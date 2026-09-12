'use client';

import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTaskSchema } from "@/lib/validations/task.schema";
import { useTasks } from "@/hooks/useTasks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectItem } from "@/components/ui/select";
import { Task, TaskStatus, TaskPriority } from "@/types/task.types";
import { z } from "zod";

// Zod Input and Output type separation for RHF compatibility
type TaskFormInput = z.input<typeof createTaskSchema>;
type TaskFormOutput = z.output<typeof createTaskSchema>;

interface TaskFormProps {
  projectId: string;
  initialData?: Task | null;
  onSuccess?: () => void;
}

export function TaskForm({ projectId, initialData, onSuccess }: TaskFormProps) {
  const { createTask, updateTask } = useTasks();
  const isEditing = Boolean(initialData);

  // Safely extract assignedTo if present on initialData
  const initialAssignedTo = (initialData as Record<string, any>)?.assignedTo || "";

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormInput, any, TaskFormOutput>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      projectId: projectId || initialData?.projectId || "",
      status: (initialData?.status as TaskStatus) || "TODO",
      priority: (initialData?.priority as TaskPriority) || "MEDIUM",
      assignedTo: initialAssignedTo,
    },
  });

  const selectedStatus = watch("status");
  const selectedPriority = watch("priority");


  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        description: initialData.description || "",
        projectId: initialData.projectId || projectId,
        status: (initialData.status as TaskStatus) || "TODO",
        priority: (initialData.priority as TaskPriority) || "MEDIUM",
        assignedTo: (initialData as any)?.assignedTo || "",
      });
    } else if (projectId) {
      setValue("projectId", projectId, { shouldDirty: true });
    }
  }, [initialData?.id, (initialData as any)?._id, projectId, reset, setValue]);
  
  
  const onSubmit: SubmitHandler<TaskFormOutput> = async (data) => {
    try {
      if (isEditing && initialData) {
        const taskId = initialData.id || (initialData as any)._id || "";
        await updateTask({ taskId, data });
      } else {
        await createTask({
          ...data,
          projectId: data.projectId || projectId,
        });
      }
      reset();
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Failed to save task", err);
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

      <div className="grid grid-cols-2 gap-3">
        {/* Status Dropdown */}
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Status</label>
          <Select
            value={selectedStatus as string}
            onValueChange={(val) => setValue("status", val as TaskStatus, { shouldValidate: true })}
          >
            <SelectItem value="TODO">To Do</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="IN_REVIEW">In Review</SelectItem>
            <SelectItem value="DONE">Done</SelectItem>
          </Select>
        </div>

        {/* Priority Dropdown */}
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Priority</label>
          <Select
            value={selectedPriority as string}
            onValueChange={(val) => setValue("priority", val as TaskPriority, { shouldValidate: true })}
          >
            <SelectItem value="LOW">Low</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="HIGH">High</SelectItem>
            <SelectItem value="URGENT">Urgent</SelectItem>
          </Select>
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? (isEditing ? "Updating..." : "Creating...") : isEditing ? "Update Task" : "Create Task"}
      </Button>
    </form>
  );
}