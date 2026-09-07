'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { X, Calendar, User, Tag, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Task } from '@/types/task.types';

export default function TaskDetailsModal() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const taskId = searchParams.get('taskId');

  const handleClose = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('taskId');
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  if (!taskId) return null;

  // React Query Cache se direct sare loaded tasks scan karein (Filters ki waja se data miss nahi hoga)
  const allTasksQueries = queryClient.getQueriesData<any>({ queryKey: ['tasks'] });
  
  let selectedTask: Task | undefined;

  for (const [_, queryData] of allTasksQueries) {
    if (!queryData) continue;
    
    const taskList: Task[] = Array.isArray(queryData)
      ? queryData
      : Array.isArray(queryData?.tasks)
      ? queryData.tasks
      : [];

    selectedTask = taskList.find(
      (t) => String(t.id) === String(taskId) || String((t as any)._id) === String(taskId)
    );

    if (selectedTask) break;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-card text-card-foreground border border-border rounded-xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-primary/10 text-primary font-semibold">
            TASK-{taskId.slice(-4).toUpperCase()}
          </span>
          <button
            type="button"
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-accent transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Dynamic Task Title */}
          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Task Title
            </span>
            <h2 className="text-lg font-bold text-foreground tracking-tight p-3 bg-muted/30 border border-border rounded-lg">
              {selectedTask?.title || "Untitled Task"}
            </h2>
          </div>

          {/* Properties Grid */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/20 border border-border rounded-lg text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span>Status:</span>
              <span className="font-medium text-foreground bg-accent px-2 py-0.5 rounded text-xs uppercase">
                {selectedTask?.status || "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Tag className="w-4 h-4 text-destructive" />
              <span>Priority:</span>
              <span className="font-medium text-destructive text-xs uppercase">
                {selectedTask?.priority || "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="w-4 h-4" />
              <span>Assignee:</span>
              <span className="font-medium text-foreground text-xs">Unassigned</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Created At:</span>
              <span className="font-medium text-foreground text-xs">Recent</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Description
            </span>
            <div className="p-3 bg-background border border-border rounded-md text-sm text-muted-foreground min-h-24 leading-relaxed">
              {selectedTask?.description ? (
                selectedTask.description
              ) : (
                <span className="italic text-muted-foreground/60">
                  No description provided for this task.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-3 border-t border-border bg-muted/20">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}