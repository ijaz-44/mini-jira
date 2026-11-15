'use client';

import { X, FolderKanban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectType } from "./ProjectCard";

interface ProjectDetailsModalProps {
  project: ProjectType;
  onClose: () => void;
}

export default function ProjectDetailsModal({ project, onClose }: ProjectDetailsModalProps) {
  const projectTitle = project.name || project.title || "Untitled Project";
  const projectId = project._id || project.id || "";

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card text-card-foreground border border-border rounded-xl w-full max-w-md p-6 shadow-xl space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-muted text-primary rounded-lg border border-border">
              <FolderKanban className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Project Details</h2>
              {projectId && (
                <p className="text-xs text-muted-foreground font-mono mt-0.5">
                  ID: {projectId}
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              Project Title
            </span>
            <div className="p-3 bg-muted rounded-lg border border-border text-sm font-medium text-foreground">
              {projectTitle}
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              Description
            </span>
            <div className="p-3 bg-muted rounded-lg border border-border text-sm text-muted-foreground leading-relaxed min-h-[80px]">
              {project.description ? (
                project.description
              ) : (
                <span className="text-muted-foreground italic">
                  No description provided for this project.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-3 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="cursor-pointer"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}