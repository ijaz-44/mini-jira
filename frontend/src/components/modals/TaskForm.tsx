'use client';

import { useState, useEffect, FormEvent } from "react";
import { useTasks } from "@/hooks/useTasks";
import { useProjects } from "@/hooks/useProjects";
import { Task } from "@/types/task.types";
import { Loader2 } from "lucide-react";

interface TaskFormProps {
  onSuccess: () => void;
  taskToEdit?: Task | null;
}

const getId = (item: { id?: string; _id?: string }) => item?.id || item?._id || "";

export function TaskForm({ onSuccess, taskToEdit }: TaskFormProps) {
  const { createTask, updateTask } = useTasks();
  const { projects = [] } = useProjects();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Task["priority"]>("MEDIUM");
  const [projectId, setProjectId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const defaultProjectId = projects[0] ? getId(projects[0]) : "";

    if (taskToEdit) {
      setTitle(taskToEdit.title || "");
      setDescription(taskToEdit.description || "");
      setPriority(taskToEdit.priority || "MEDIUM");
      setProjectId(taskToEdit.projectId || defaultProjectId);
      
      if (taskToEdit.dueDate) {
        const dateObj = new Date(taskToEdit.dueDate);
        setDueDate(isNaN(dateObj.getTime()) ? "" : dateObj.toISOString().split('T')[0]);
      } else {
        setDueDate("");
      }
    } else {
      setTitle("");
      setDescription("");
      setPriority("MEDIUM");
      setProjectId(defaultProjectId);
      setDueDate("");
    }
  }, [taskToEdit, projects]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const selectedProjectId = projectId || (projects[0] ? getId(projects[0]) : "");
    const taskId = taskToEdit ? getId(taskToEdit) : "";

    try {
      setIsSubmitting(true);

      if (taskToEdit && taskId) {
        if (updateTask) {
          await updateTask({
            taskId,
            data: {
              title: title.trim(),
              description: description.trim(),
              priority,
              projectId: selectedProjectId,
              dueDate: dueDate ? new Date(dueDate) : undefined,
            },
          });
        }
      } else {
        if (!selectedProjectId) {
          alert("Please select or create a project first.");
          return;
        }
        await createTask({
          title: title.trim(),
          description: description.trim(),
          priority,
          projectId: selectedProjectId,
          status: "TODO",
          dueDate: dueDate ? new Date(dueDate) : undefined,
        });
      }

      onSuccess();
    } catch (error) {
      console.error("Failed to save task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-xs font-medium text-muted-foreground block mb-1">Title</label>
        <input
          type="text"
          required
          disabled={isSubmitting}
          placeholder="Task title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-hidden focus:ring-1 focus:ring-primary"
        />
      </div>

      <div>
        <label className="text-xs font-medium text-muted-foreground block mb-1">Description</label>
        <textarea
          rows={3}
          disabled={isSubmitting}
          placeholder="Task details..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-hidden focus:ring-1 focus:ring-primary"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1">Priority</label>
          <select
            disabled={isSubmitting}
            value={priority}
            onChange={(e) => setPriority(e.target.value as Task["priority"])}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-hidden focus:ring-1 focus:ring-primary"
          >
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
            <option value="URGENT">URGENT</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1">Due Date</label>
          <input
            type="date"
            disabled={isSubmitting}
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-hidden focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {projects.length > 0 && (
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1">Project</label>
          <select
            disabled={isSubmitting}
            value={projectId || getId(projects[0])}
            onChange={(e) => setProjectId(e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-hidden focus:ring-1 focus:ring-primary"
          >
            {projects.map((proj) => {
              const pId = getId(proj);
              return (
                <option key={pId} value={pId}>
                  {proj.name}
                </option>
              );
            })}
          </select>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 w-full justify-center px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:opacity-90 shadow-xs cursor-pointer"
        >
          {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          {isSubmitting ? (taskToEdit ? "Updating..." : "Creating...") : (taskToEdit ? "Update Task" : "Create Task")}
        </button>
      </div>
    </form>
  );
}