'use client';

import { useState } from "react";
import { useProjects } from "@/hooks/useProjects";
import { AlertTriangle, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DeleteProjectModalProps {
  projectId: string;
  projectTitle: string;
  onClose: () => void;
}

export default function DeleteProjectModal({
  projectId,
  projectTitle,
  onClose,
}: DeleteProjectModalProps) {
  const { deleteProject, isDeleting } = useProjects();
  const [errorMsg, setErrorMsg] = useState("");

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!projectId) {
      setErrorMsg("Project ID is missing!");
      return;
    }

    setErrorMsg("");
    try {
      await deleteProject(projectId);
      onClose();
    } catch (err: any) {
      setErrorMsg(
        err?.response?.data?.message || err?.message || "Failed to delete project"
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-card text-card-foreground border border-border rounded-xl p-6 shadow-lg space-y-4 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-500 font-semibold">
            <AlertTriangle className="w-5 h-5" />
            <span>Delete Project</span>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs rounded-lg text-center font-medium">
            {errorMsg}
          </div>
        )}

        <p className="text-sm text-muted-foreground leading-relaxed">
          Are you sure you want to delete <strong className="text-foreground">{projectTitle}</strong>? This action cannot be undone and will remove all associated data.
        </p>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
          <Button type="button" variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button 
            type="button" 
            variant="danger" 
            onClick={handleDelete} 
            disabled={isDeleting}
          >
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
}