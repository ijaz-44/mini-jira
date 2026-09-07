'use client';

import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { ChevronDown, Loader2 } from "lucide-react";


export function Navbar() {
  const { user, updateRole, isUpdatingRole } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  


  return (
    <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between text-card-foreground">
      <h2 className="text-lg font-semibold text-foreground tracking-tight">Workspace</h2>
      <div className="flex items-center gap-3">
        <div className="relative">
  <button
    type="button"
    onClick={() => setIsOpen((prev) => !prev)}
    disabled={isUpdatingRole}
    className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 font-medium"
  >
    {isUpdatingRole ? (
      <Loader2 className="w-3.5 h-3.5 animate-spin" />
    ) : (
      <>
        <span>Role: {user?.role?.toLowerCase() || "user"}</span>
        <ChevronDown className="w-3.5 h-3.5" />
      </>
    )}
  </button>

  {isOpen && !isUpdatingRole && (
    <div className="absolute right-0 top-full mt-2 w-40 bg-card border border-border rounded-lg shadow-lg p-1 z-50">
      {["EMPLOYEE", "MANAGER", "ADMIN"].map((role) => (
        <button
          key={role}
          type="button"
          onClick={async () => {
            await updateRole(role);
            setIsOpen(false);
          }}
          className="w-full text-left px-3 py-2 text-xs rounded-md hover:bg-muted"
        >
          {role.toLowerCase()}
        </button>
      ))}
    </div>
  )}
</div>

      </div>
    </header>
  );
}