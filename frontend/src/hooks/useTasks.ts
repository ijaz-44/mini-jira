import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskService } from "@/services/task.service";
import { useFilterStore } from "@/store/filterStore";
import { useDebounce } from "./useDebounce";
import { Task, TaskStatus } from "@/types/task.types";
import { CreateTaskInput, UpdateTaskInput } from "@/lib/validations/task.schema";

interface TasksApiResponse {
  success?: boolean;
  tasks?: Task[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

type QueryData = TasksApiResponse | Task[];

export const useTasks = (projectId?: string) => {
  const queryClient = useQueryClient();
  const { search, status, priority } = useFilterStore();

  const debouncedSearch = useDebounce(search, 400);

  const queryParams: Record<string, string> = {};
  if (projectId) queryParams.projectId = projectId;
  if (debouncedSearch) queryParams.search = debouncedSearch;
  if (status && status !== "ALL") queryParams.status = status;
  if (priority && priority !== "ALL") queryParams.priority = priority;

  const QUERY_KEY = ["tasks", queryParams] as const;

  // 1. Fetch Tasks Query
  const tasksQuery = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => taskService.getTasks(queryParams),
  });

  // Safe Extractor for Tasks Array & MongoDB _id normalization
  const extractTasks = (data: unknown): Task[] => {
    if (!data) return [];
    let list: Task[] = [];

    if (Array.isArray(data)) {
      list = data;
    } else if (
      typeof data === "object" &&
      data !== null &&
      "tasks" in data &&
      Array.isArray((data as TasksApiResponse).tasks)
    ) {
      list = (data as TasksApiResponse).tasks || [];
    }

    return list.map((task) => ({
      ...task,
      id: task.id || (task as { _id?: string })._id || "",
    }));
  };

  // Helper function to mutate cache cleanly without touching unrelated queries
  const updateCache = (
    updater: (task: Task) => Task | null,
    prependTask?: Task
  ) => {
    queryClient.setQueriesData<QueryData>(
      { queryKey: ["tasks"] },
      (oldData) => {
        if (!oldData) return prependTask ? [prependTask] : oldData;

        if (Array.isArray(oldData)) {
          if (prependTask) return [prependTask, ...oldData];
          return oldData
            .map(updater)
            .filter((t): t is Task => t !== null);
        }

        if ("tasks" in oldData && Array.isArray(oldData.tasks)) {
          const updatedList = prependTask
            ? [prependTask, ...oldData.tasks]
            : oldData.tasks
                .map(updater)
                .filter((t): t is Task => t !== null);

          return { ...oldData, tasks: updatedList };
        }

        return oldData;
      }
    );
  };

  // 2. Create Task Mutation
  const createTaskMutation = useMutation({
    mutationFn: (data: CreateTaskInput) => taskService.createTask(data),
    onMutate: async (newTaskData) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      const previousTasksData = queryClient.getQueriesData({ queryKey: ["tasks"] });

      const tempTask: Task = {
        id: `temp-${Date.now()}`,
        title: newTaskData.title || "Untitled Task",
        description: newTaskData.description || "",
        status: (newTaskData.status as TaskStatus) || "TODO",
        priority: newTaskData.priority || "MEDIUM",
        projectId: newTaskData.projectId || projectId || "",
        assignedTo: newTaskData.assignedTo || "",
        createdAt: new Date().toISOString(),
      };

      updateCache((task) => task, tempTask);

      return { previousTasksData };
    },
    onError: (_err, _newTask, context) => {
      if (context?.previousTasksData) {
        context.previousTasksData.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"], type: "active" });
    },
  });

  // 3. Update Task Mutation (Handles both status update & detail updates cleanly)
  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, data }: { taskId: string; data: Partial<UpdateTaskInput> }) =>
      taskService.updateTask(taskId, data),
    onMutate: async ({ taskId, data }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      const previousTasksData = queryClient.getQueriesData({ queryKey: ["tasks"] });

      updateCache((task) => {
        if (task.id === taskId || (task as { _id?: string })._id === taskId) {
          return { ...task, ...data };
        }
        return task;
      });

      return { previousTasksData };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousTasksData) {
        context.previousTasksData.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"], type: "active" });
    },
  });

  // 4. Update Status (Shortcut abstraction over updateTask)
  const updateStatus = (taskId: string, status: TaskStatus) =>
    updateTaskMutation.mutateAsync({ taskId, data: { status } });

  // 5. Delete Task Mutation
  const deleteTaskMutation = useMutation({
    mutationFn: (taskId: string) => taskService.deleteTask(taskId),
    onMutate: async (taskId) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      const previousTasksData = queryClient.getQueriesData({ queryKey: ["tasks"] });

      updateCache((task) => {
        if (task.id === taskId || (task as { _id?: string })._id === taskId) {
          return null; // Remove from list
        }
        return task;
      });

      return { previousTasksData };
    },
    onError: (_err, _taskId, context) => {
      if (context?.previousTasksData) {
        context.previousTasksData.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"], type: "active" });
    },
  });

  return {
    tasks: extractTasks(tasksQuery.data),
    isLoading: tasksQuery.isLoading,
    isError: tasksQuery.isError,
    refetch: tasksQuery.refetch,
    createTask: createTaskMutation.mutateAsync,
    isCreating: createTaskMutation.isPending,
    updateTask: updateTaskMutation.mutateAsync,
    updateStatus,
    isUpdating: updateTaskMutation.isPending,
    deleteTask: deleteTaskMutation.mutateAsync,
    isDeleting: deleteTaskMutation.isPending,
  };
};