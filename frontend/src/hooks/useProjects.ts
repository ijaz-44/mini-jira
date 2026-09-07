import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectService } from "@/services/project.service";
import { CreateProjectInput } from "@/lib/validations/project.schema";

export const useProjects = () => {
  const queryClient = useQueryClient();

  const projectsQuery = useQuery({
    queryKey: ["projects"],
    queryFn: projectService.getProjects,
  });

  const createProjectMutation = useMutation({
    mutationFn: projectService.createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error) => {
      // Error is handled by UI toast/notification
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: ({
      projectId,
      data,
    }: {
      projectId: string;
      data: Partial<CreateProjectInput>;
    }) => projectService.updateProject(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: (projectId: string) => projectService.deleteProject(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  return {
    projects: projectsQuery.data || [],
    isLoading: projectsQuery.isLoading,
    isError: projectsQuery.isError,

    // Create Mutation
    createProject: createProjectMutation.mutateAsync,
    isCreating: createProjectMutation.isPending,
    createError: createProjectMutation.error,

    // Update Mutation
    updateProject: updateProjectMutation.mutateAsync,
    isUpdating: updateProjectMutation.isPending,
    updateError: updateProjectMutation.error,

    // Delete Mutation
    deleteProject: deleteProjectMutation.mutateAsync,
    isDeleting: deleteProjectMutation.isPending,
    deleteError: deleteProjectMutation.error,
  };
};