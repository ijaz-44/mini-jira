'use client';

import { useState, useEffect, FormEvent } from "react";
import { useProjects } from "@/hooks/useProjects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

export interface ProjectType {
  _id?: string;
  id?: string;
  name?: string;
  title?: string;
  description?: string;
}

interface ProjectFormProps {
  onSuccess: () => void;
  projectToEdit?: ProjectType | null;
}

const getId = (item: { id?: string; _id?: string }) => item?.id || item?._id || "";

export function ProjectForm({ onSuccess, projectToEdit }: ProjectFormProps) {
  const { createProject, updateProject } = useProjects();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (projectToEdit) {
      setName(projectToEdit.name || projectToEdit.title || "");
      setDescription(projectToEdit.description || "");
    } else {
      setName("");
      setDescription("");
    }
    setErrorMsg("");
  }, [projectToEdit]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setErrorMsg("");
    setIsSubmitting(true);

    try {
      const projectId = projectToEdit ? getId(projectToEdit) : "";

      if (projectToEdit && projectId) {
        await updateProject({
          projectId,
          data: {
            name: name.trim(),
            description: description.trim(),
          },
        });
      } else {
        await createProject({
          name: name.trim(),
          description: description.trim(),
        });
      }

      onSuccess();
    } catch (err: any) {
      setErrorMsg(
        err?.response?.data?.message || err?.message || "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEditing = !!projectToEdit;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Fixed: Removed opacity modifiers destructive/10 and destructive/20 */}
      {errorMsg && (
        <div className="p-3 bg-muted border border-destructive text-destructive text-xs rounded-lg text-center font-medium">
          {errorMsg}
        </div>
      )}

      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Project Name
        </label>
        <Input
          type="text"
          required
          disabled={isSubmitting}
          placeholder="e.g. Next.js SaaS App"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Description
        </label>
        {/* Fixed: Removed ring/50 and dark:bg-input/30 opacity modifiers */}
        <textarea
          rows={3}
          disabled={isSubmitting}
          placeholder="Brief summary of the project..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-lg border border-input bg-muted px-2.5 py-2 text-base text-foreground transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none"
        />
      </div>

      <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onSuccess} 
          disabled={isSubmitting}
          className="cursor-pointer"
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin mr-1.5" />}
          {isSubmitting 
            ? (isEditing ? "Saving..." : "Creating...") 
            : (isEditing ? "Save Changes" : "Create Project")
          }
        </Button>
      </div>
    </form>
  );
}