'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTaskSchema, CreateTaskInput } from "@/lib/validations/task.schema";
import { useTasks } from "@/hooks/useTasks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface TaskFormProps {
  projectId: string;
  onSuccess?: () => void;
}

export function TaskForm({ projectId, onSuccess }: TaskFormProps) {
  const { createTask } = useTasks();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      projectId,
      status: "TODO",
      priority: "MEDIUM",
    },
  });

  const onSubmit = async (data: CreateTaskInput) => {
    try {
      await createTask(data);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Failed to create task", err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input placeholder="Task title..." {...register("title")} />
        {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
      </div>

      <div>
        <Textarea placeholder="Task description (optional)..." {...register("description")} />
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Creating..." : "Create Task"}
      </Button>
    </form>
  );
}