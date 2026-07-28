'use client';

import { useAuth } from "@/hooks/useAuth";

export function Navbar() {
  const { user } = useAuth();

  return (
    <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between text-card-foreground">
      <h2 className="text-lg font-semibold text-foreground tracking-tight">Workspace</h2>
      <div className="flex items-center gap-3">
        <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium capitalize">
          {user?.role?.toLowerCase() || "user"}
        </span>
      </div>
    </header>
  );
}