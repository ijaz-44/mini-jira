'use client';

import { useState } from "react";
import { FolderKanban, MoreVertical, Pencil, Trash2, ArrowRight, Loader2 } from "lucide-react";
import { useProjects } from "@/hooks/useProjects";
import ProjectDetailsModal from "./ProjectDetailsModal";

export interface ProjectType {
  _id?: string;
  id?: string;
  name?: string;
  title?: string;
  description?: string;
}

interface ProjectCardProps {
  project: ProjectType;
  onEdit: (project: ProjectType) => void;
}

export default function ProjectCard({ project, onEdit }: ProjectCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { deleteProject, isDeleting } = useProjects();

  const projectTitle = project.name || project.title || "Untitled Project";
  const projectId = project._id || project.id || "";

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${projectTitle}"?`)) return;
    try {
      await deleteProject(projectId);
    } catch (err) {
      console.error("Failed to delete project", err);
    }
  };

  return (
    <div className="group relative bg-card text-card-foreground border border-border/80 rounded-[var(--radius)] p-5 shadow-sm hover:shadow-md hover:border-accent-foreground/20 transition-all duration-200 flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="p-2.5 bg-accent/50 text-foreground w-fit rounded-[var(--radius)] border border-border/50 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
            <FolderKanban className="w-5 h-5" />
          </div>

          {/* Action Menu Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 hover:bg-accent hover:text-accent-foreground rounded-[var(--radius)] text-muted-foreground transition-colors cursor-pointer"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <div 
                className="absolute right-0 mt-1 w-36 bg-popover text-popover-foreground rounded-[var(--radius)] shadow-lg border border-border z-20 py-1"
                onMouseLeave={() => setShowMenu(false)}
              >
                <button
                  type="button"
                  onClick={() => {
                    onEdit(project);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
                >
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleDelete();
                    setShowMenu(false);
                  }}
                  disabled={isDeleting}
                  className="w-full text-left px-3 py-1.5 text-xs text-destructive flex items-center gap-2 hover:bg-accent transition-colors cursor-pointer"
                >
                  {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />} 
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
            {projectTitle}
          </h3>
          {project.description ? (
            <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
              {project.description}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground/60 italic mt-1.5">
              No description provided
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
        <span className="capitalize">Active Workspace</span>
        <button
          type="button"
          onClick={() => setIsDetailsOpen(true)}
          className="font-medium text-primary hover:underline flex items-center gap-1 transition-all cursor-pointer"
        >
          View Details <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {isDetailsOpen && (
        <ProjectDetailsModal
          project={project}
          onClose={() => setIsDetailsOpen(false)}
        />
      )}
    </div>
  );
}