'use client';

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterInput } from "@/lib/validations/auth.schema";
import { Lock, Mail, User, ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const { register: registerAuth, isRegistering, registerError } = useAuth();

  // Generics ko zodResolver par chor do taakay manual type clash na ho
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "EMPLOYEE",
    },
  });

  const onSubmit = async (values: RegisterInput) => {
    setSuccessMessage("");
    try {
      await registerAuth(values);
      setSuccessMessage("Account created successfully! Redirecting...");
      setTimeout(() => router.push("/dashboard"), 1200);
    } catch (err) {
      // Handled inside useAuth
    }
  };

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center bg-background p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-lg bg-card border border-border rounded-xl p-6 sm:p-10 shadow-md space-y-6">
        
        <div className="text-center space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-bold text-card-foreground tracking-tight">
            Create an Account
          </h1>
          <p className="text-sm text-muted-foreground">
            Get started with your project workspace
          </p>
        </div>

        {/* Global Server Error or Success Banner */}
        {(registerError || successMessage) && (
          <div className={`p-3 text-xs rounded-lg text-center font-medium animate-in fade-in ${
            successMessage 
              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-600" 
              : "bg-destructive/10 border border-destructive/20 text-destructive"
          }`}>
            {successMessage || registerError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                {...register("name")}
                type="text"
                disabled={isRegistering}
                placeholder="John Doe"
                className={`input-field ${errors.name ? "border-red-500 focus:ring-red-500" : ""}`}
              />
            </div>
            {errors.name && (
              <p className="text-xs text-red-500 font-medium">{errors.name.message}</p>
            )}
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                {...register("email")}
                type="email"
                disabled={isRegistering}
                placeholder="developer@example.com"
                className={`input-field ${errors.email ? "border-red-500 focus:ring-red-500" : ""}`}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                disabled={isRegistering}
                placeholder="••••••••"
                className={`input-field pr-10 ${errors.password ? "border-red-500 focus:ring-red-500" : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 font-medium">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                {...register("confirmPassword")}
                type={showConfirmPassword ? "text" : "password"}
                disabled={isRegistering}
                placeholder="••••••••"
                className={`input-field pr-10 ${errors.confirmPassword ? "border-red-500 focus:ring-red-500" : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-500 font-medium">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isRegistering || !!successMessage}
            className="btn-primary mt-2"
          >
            {isRegistering ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Register</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-sm text-muted-foreground pt-2 border-t border-border">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}