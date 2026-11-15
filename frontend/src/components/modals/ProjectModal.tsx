'use client';

import { X } from "lucide-react";
import { ProjectForm, ProjectType } from "@/components/modals/ProjectForm";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectToEdit?: ProjectType | null;
}

export function ProjectModal({ isOpen, onClose, projectToEdit }: ProjectModalProps) {
  if (!isOpen) return null;

  const isEditing = !!projectToEdit;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-card text-card-foreground border border-border rounded-xl p-6 shadow-lg space-y-4 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h2 className="text-lg font-semibold">
            {isEditing ? "Edit Project" : "Create New Project"}
          </h2>
          <button 
            type="button"
            onClick={onClose} 
            className="text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <ProjectForm 
          onSuccess={onClose} 
          projectToEdit={projectToEdit} 
        />
      </div>
    </div>
  );
}