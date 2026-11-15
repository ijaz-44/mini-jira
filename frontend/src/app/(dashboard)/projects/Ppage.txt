'use client';

import { useState } from "react";
import { useProjects } from "@/hooks/useProjects";
import { Plus, Layers, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProjectCardActions from "./ProjectCardActions";

export default function ProjectsPage() {
  const { projects, isLoading, createProject, isCreating } = useProjects();
  
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setErrorMsg("");
    try {
      await createProject({ name: name.trim(), description: description.trim() });
      setName("");
      setDescription("");
      setIsOpen(false);
    } catch (err: any) {
      setErrorMsg(err?.message || "Something went wrong. Please try again.");
    }
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
          onClick={() => setIsOpen(true)}
          className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
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
          <Button onClick={() => setIsOpen(true)} variant="outline" size="sm" className="mt-2">
            Create First Project
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project: any) => (
            <ProjectCardActions 
              key={project._id || project.id} 
              project={project} 
            />
          ))}
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-card text-card-foreground border border-border rounded-xl p-6 shadow-lg space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-lg font-semibold">Create New Project</h2>
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-muted-foreground hover:text-foreground"
                type="button"
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
                  placeholder="e.g. Next.js SaaS App"
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
                  placeholder="Brief summary of the project..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none text-foreground"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}