'use client';

import { useState } from "react";
import { useProjects } from "@/hooks/useProjects";
import { Plus, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProjectCard, { ProjectType } from "./ProjectCard";
import { ProjectModal } from "@/components/modals/ProjectModal";

export default function ProjectsPage() {
  const { projects, isLoading } = useProjects();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectType | null>(null);

  const handleCreateClick = () => {
    setSelectedProject(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (project: ProjectType) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Projects</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your active workspaces and teams
          </p>
        </div>
        
        <Button 
          onClick={handleCreateClick}
          className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Create Project
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 p-4 text-sm text-muted-foreground">
          <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <span>Loading projects...</span>
        </div>
      ) : !projects || projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-card text-card-foreground rounded-xl border border-border/60 shadow-sm space-y-3">
          <div className="p-3 bg-muted rounded-full text-muted-foreground">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">No projects found</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Get started by creating your first project workspace.
            </p>
          </div>
          <Button onClick={handleCreateClick} variant="outline" size="sm" className="mt-2 cursor-pointer">
            Create First Project
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project: any) => (
            <ProjectCard 
              key={project._id || project.id} 
              project={project} 
              onEdit={handleEditClick}
            />
          ))}
        </div>
      )}

      {/* Global Project Modal for Create/Edit */}
      <ProjectModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projectToEdit={selectedProject}
      />
    </div>
  );
}