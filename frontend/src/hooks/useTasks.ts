import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskService } from "@/services/task.service";
import { useFilterStore } from "@/store/filterStore";
import { useDebounce } from "./useDebounce";

export const useTasks = () => {
  const queryClient = useQueryClient();
  const { search, status, priority } = useFilterStore();
  
  // Search state ko 400ms debounce kar ke API spam roko
  const debouncedSearch = useDebounce(search, 400);

  const queryParams: Record<string, string> = {};
  if (debouncedSearch) queryParams.search = debouncedSearch;
  if (status !== "ALL") queryParams.status = status;
  if (priority !== "ALL") queryParams.priority = priority;

  // Fetch Tasks Query
  const tasksQuery = useQuery({
    queryKey: ["tasks", queryParams],
    queryFn: () => taskService.getTasks(queryParams),
  });

  // Create Task Mutation
  const createTaskMutation = useMutation({
    mutationFn: taskService.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  // Status Change Mutation (Optimistic Update ready)
  const updateStatusMutation = useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: string }) =>
      taskService.updateTaskStatus(taskId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  return {
    tasks: tasksQuery.data || [],
    isLoading: tasksQuery.isLoading,
    isError: tasksQuery.isError,
    createTask: createTaskMutation.mutateAsync,
    updateStatus: updateStatusMutation.mutateAsync,
  };
};