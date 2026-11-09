import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskService } from "@/services/task.service";
import { useFilterStore } from "@/store/filterStore";
import { useDebounce } from "./useDebounce";
import { Task, TaskStatus } from "@/types/task.types";
import { CreateTaskInput, UpdateTaskInput } from "@/lib/validations/task.schema";

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

  // Prepend helper
  const prependToActiveQuery = (newTask: Task) => {
    queryClient.setQueryData<Task[]>(QUERY_KEY, (oldData = []) => {
      return [newTask, ...oldData];
    });
  };

  // Cache updater helper
  const updateCacheEntries = (updater: (task: Task) => Task | null) => {
    queryClient.setQueriesData<Task[]>(
      { queryKey: ["tasks"] },
      (oldData) => {
        if (!oldData || !Array.isArray(oldData)) return oldData;
        return oldData
          .map(updater)
          .filter((t): t is Task => t !== null);
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

      // Yahan purana updateCache hata kar naya helper laga diya hai
      prependToActiveQuery(tempTask);

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

  // 3. Update Task Mutation
  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, data }: { taskId: string; data: Partial<UpdateTaskInput> }) =>
      taskService.updateTask(taskId, data),
    onMutate: async ({ taskId, data }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      const previousTasksData = queryClient.getQueriesData({ queryKey: ["tasks"] });

      // Yahan bhi updateCache ki jagah updateCacheEntries use ho raha hai
      updateCacheEntries((task) => {
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

      // Yahan bhi updateCache ki jagah updateCacheEntries use ho raha hai
      updateCacheEntries((task) => {
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
    tasks: tasksQuery.data ?? [], // Yeh miss ho gaya tha, ab tasks array component ko mil jayegi!
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