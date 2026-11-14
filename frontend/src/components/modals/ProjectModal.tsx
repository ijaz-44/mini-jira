'use client';

import { ReactNode } from "react";
import { X, FolderKanban } from "lucide-react";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode; // <--- Yeh wapas aa gaya!
}

export function ProjectModal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
}: ProjectModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-card text-card-foreground border border-border rounded-xl p-6 shadow-xl space-y-4 relative animate-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 text-primary rounded-lg border border-primary/20">
              <FolderKanban className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">{title}</h2>
              {subtitle && (
                <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-md hover:bg-accent cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Dynamic Children (Form, Details, etc.) */}
        <div>{children}</div>

      </div>
    </div>
  );
}