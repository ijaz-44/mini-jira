"use client";

import { useState } from "react";
import { FolderKanban, MoreVertical, Pencil, Trash2, ArrowRight } from "lucide-react";
import EditProjectModal from "./EditProjectModal";
import DeleteProjectModal from "./DeleteProjectModal";
import ProjectDetailsModal from "./ProjectDetailsModal"; // Naya Modal Component

export interface ProjectType {
  _id?: string;
  id?: string;
  name?: string;
  title?: string;
  description?: string;
}

interface ProjectCardActionsProps {
  project: ProjectType;
  onSuccess?: () => void;
}

export default function ProjectCardActions({ project, onSuccess }: ProjectCardActionsProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false); // Modal State

  const projectTitle = project.name || project.title || "Untitled Project";
  const projectId = project._id || project.id || "";

  return (
    <div className="group relative p-5 bg-card text-card-foreground rounded-xl border border-border/80 shadow-sm hover:shadow-md hover:border-accent-foreground/20 transition-all duration-200 flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="p-2.5 bg-accent/50 text-foreground w-fit rounded-lg border border-border/50 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
            <FolderKanban className="w-5 h-5" />
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 hover:bg-accent rounded-md text-muted-foreground hover:text-foreground transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <div 
                className="absolute right-0 mt-1 w-36 bg-popover text-popover-foreground rounded-md shadow-lg border border-border z-20 py-1"
                onMouseLeave={() => setShowMenu(false)}
              >
                <button
                  type="button"
                  onClick={() => {
                    setIsEditOpen(true);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 hover:bg-accent transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsDeleteOpen(true);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-destructive flex items-center gap-2 hover:bg-accent transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
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
        
        {/* Clickable Button for Modal */}
        <button
          type="button"
          onClick={() => setIsDetailsOpen(true)}
          className="font-medium text-primary hover:underline flex items-center gap-1 transition-all cursor-pointer"
        >
          View Details <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Project Details Modal */}
      {isDetailsOpen && (
        <ProjectDetailsModal
          project={project}
          onClose={() => setIsDetailsOpen(false)}
        />
      )}

      {isEditOpen && (
        <EditProjectModal
          project={project}
          onClose={() => setIsEditOpen(false)}
        />
      )}

      {isDeleteOpen && (
        <DeleteProjectModal
          projectId={projectId}
          projectTitle={projectTitle}
          onClose={() => setIsDeleteOpen(false)}
        />
      )}
    </div>
  );
}