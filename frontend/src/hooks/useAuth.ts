import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { getErrorMessage } from "@/lib/getErrorMessage";

export const useAuth = () => {
  const queryClient = useQueryClient();

  const { data: user, isLoading, error } = useQuery({
    queryKey: ["auth-user"],
    queryFn: authService.getProfile,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 mins cache
  });

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: async () => {
      // Refresh profile data immediately after login cookie is set
      await queryClient.invalidateQueries({ queryKey: ["auth-user"] });
      await queryClient.refetchQueries({ queryKey: ["auth-user"] });
    },
    onError: (err) => {
      const message = getErrorMessage(err);
      console.error("Login Error:", message);
    },
  });

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["auth-user"] });
      await queryClient.refetchQueries({ queryKey: ["auth-user"] });
    },
    onError: (err) => {
      const message = getErrorMessage(err);
      console.error("Register Error:", message);
    },
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error ? getErrorMessage(loginMutation.error) : null,

    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error ? getErrorMessage(registerMutation.error) : null,
    
    authError: error ? getErrorMessage(error) : null,
  };
};