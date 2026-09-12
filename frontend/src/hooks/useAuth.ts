import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { getErrorMessage } from "@/lib/getErrorMessage";

export const useAuth = () => {
  const queryClient = useQueryClient();

  // 1. Fetch Authenticated User
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["auth-user"],
    queryFn: authService.getProfile,
    retry: false, // 401 aane par retry na karein
    retryOnMount: false, // Unauthenticated status ko remount par re-fetch nahi karna
    refetchOnWindowFocus: false, // Window switch hone par unwanted call na ho
    staleTime: 1000 * 60 * 5, // 5 mins cache
  });

  // 2. Login Mutation
  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["auth-user"] });
      await queryClient.refetchQueries({ queryKey: ["auth-user"] });
    },
    onError: (err) => {
      console.error("Login Error:", getErrorMessage(err));
    },
  });

  // 3. Register Mutation
  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["auth-user"] });
      await queryClient.refetchQueries({ queryKey: ["auth-user"] });
    },
    onError: (err) => {
      console.error("Register Error:", getErrorMessage(err));
    },
  });

  // 4. Update Role Mutation
  const updateRoleMutation = useMutation({
    mutationFn: authService.updateRole,
    onSuccess: async (updatedUser) => {
      // Direct update React Query Cache with updated User object
      queryClient.setQueryData(["auth-user"], updatedUser);
      // Invalidate to make sure server state is perfectly synced
      await queryClient.invalidateQueries({ queryKey: ["auth-user"] });
    },
    onError: (err) => {
      console.error("Role Update Error:", getErrorMessage(err));
    },
  });

  // 5. Logout Mutation
  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      // Reset auth query state explicitly
      queryClient.setQueryData(["auth-user"], null);
      // Clean entire query cache to stop background refetches post-logout
      queryClient.clear();
    },
    onError: (err) => {
      console.error("Logout Error:", getErrorMessage(err));
      // Error ke bawajood client state clean kar dein
      queryClient.setQueryData(["auth-user"], null);
      queryClient.clear();
    },
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,

    // Login
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error ? getErrorMessage(loginMutation.error) : null,

    // Register
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error ? getErrorMessage(registerMutation.error) : null,

    // Update Role
    updateRole: updateRoleMutation.mutateAsync,
    isUpdatingRole: updateRoleMutation.isPending,
    updateRoleError: updateRoleMutation.error
      ? getErrorMessage(updateRoleMutation.error)
      : null,

    // Logout
    logout: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,

    // Global Auth Error
    authError: error ? getErrorMessage(error) : null,
  };
};