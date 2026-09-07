import { useState, useEffect, FormEvent } from "react";
import { useTasks } from "@/hooks/useTasks";
import { useProjects } from "@/hooks/useProjects";
import { Task } from "@/types/task.types";
import { X, Loader2 } from "lucide-react";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: Task | null;
}

export function CreateTaskModal({ isOpen, onClose, taskToEdit }: CreateTaskModalProps) {
  const { createTask, updateTask } = useTasks();
  const { projects = [] } = useProjects();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Task["priority"]>("MEDIUM");
  const [projectId, setProjectId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getId = (item: { id?: string; _id?: string }) => item?.id || item?._id || "";

  useEffect(() => {
    if (!isOpen) return;

    const defaultProjectId = projects[0] ? getId(projects[0]) : "";

    if (taskToEdit) {
      setTitle(taskToEdit.title || "");
      setDescription(taskToEdit.description || "");
      setPriority(taskToEdit.priority || "MEDIUM");
      setProjectId(taskToEdit.projectId || defaultProjectId);
    } else {
      setTitle("");
      setDescription("");
      setPriority("MEDIUM");
      setProjectId(defaultProjectId);
    }
  }, [taskToEdit, isOpen]);

  if (!isOpen) return null;

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
        });
      }

      onClose();
    } catch (error) {
      console.error("Failed to save task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-card border border-border text-card-foreground w-full max-w-md rounded-xl p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h3 className="font-semibold text-lg">
            {taskToEdit ? "Edit Task" : "Create New Task"}
          </h3>
          <button onClick={onClose} disabled={isSubmitting} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

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
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              className="px-4 py-2 border border-border rounded-lg text-xs font-medium hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:opacity-90 shadow-xs"
            >
              {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {isSubmitting ? (taskToEdit ? "Updating..." : "Creating...") : (taskToEdit ? "Update Task" : "Create Task")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}