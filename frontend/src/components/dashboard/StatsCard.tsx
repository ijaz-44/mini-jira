'use client';

import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  description?: string;
}

export function StatsCard({ title, value, icon: Icon, description }: StatsCardProps) {
  return (
    <div className="p-5 bg-card text-card-foreground rounded-xl border border-border shadow-sm flex items-center justify-between">
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl font-bold text-foreground mt-1">{value}</h3>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </div>
      <div className="p-3 bg-secondary text-primary rounded-lg">
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
}