'use client';

import { useState } from "react";
import { useProjects } from "@/hooks/useProjects";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EditProjectModalProps {
  project: {
    _id?: string;
    id?: string;
    name?: string;
    title?: string;
    description?: string;
  };
  onClose: () => void;
}

export default function EditProjectModal({ project, onClose }: EditProjectModalProps) {
  const projectId = project._id || project.id || "";
  const initialName = project.name || project.title || "";

  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(project.description || "");
  const [errorMsg, setErrorMsg] = useState("");

  const { updateProject, isUpdating } = useProjects();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!projectId) {
      setErrorMsg("Project ID is missing!");
      return;
    }

    if (!name.trim()) return;

    setErrorMsg("");
    try {
      // Excat matches hook parameter key `projectId`
      await updateProject({
        projectId: projectId,
        data: {
          name: name.trim(),
          description: description.trim(),
        },
      });

      onClose();
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || err?.message || "Failed to update project");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-card text-card-foreground border border-border rounded-xl p-6 shadow-lg space-y-4 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h2 className="text-lg font-semibold">Edit Project</h2>
          <button 
            type="button" 
            onClick={onClose} 
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-xs rounded-lg text-center font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Project Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none text-foreground"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}