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
          {/* Fixed: Removed primary/10 and primary/20 opacity modifiers */}
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            disabled={isUpdatingRole}
            className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg bg-muted text-foreground border border-border font-medium cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            {isUpdatingRole ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
            ) : (
              <>
                <span>Role: {user?.role?.toLowerCase() || "user"}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </>
            )}
          </button>

          {isOpen && !isUpdatingRole && (
            <div className="absolute right-0 top-full mt-2 w-40 bg-popover text-popover-foreground border border-border rounded-lg shadow-lg p-1 z-50">
              {["EMPLOYEE", "MANAGER", "ADMIN"].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={async () => {
                    await updateRole(role);
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs rounded-md hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
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