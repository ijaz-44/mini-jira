import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProjectCardActions from "./ProjectCardActions";

interface ProjectCardProps {
  project: {
    _id: string;
    title: string;
    description?: string;
  };
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="group relative bg-card text-card-foreground border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
      <div>
        {/* Header Section */}
        <div className="flex justify-between items-start mb-2 gap-2">
          <Link href={`/projects/${project._id}`} className="flex-1">
            <h2 className="text-lg font-semibold text-foreground hover:text-primary transition-colors">
              {project.title}
            </h2>
          </Link>

          {/* Action Options (Edit & Delete) */}
          <ProjectCardActions project={project} />
        </div>

        {/* Description */}
        <Link href={`/projects/${project._id}`} className="block">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {project.description || "No description provided."}
          </p>
        </Link>
      </div>

      {/* View Details Link */}
      <div className="mt-4 pt-3 border-t border-border flex items-center justify-end">
        <Link
          href={`/projects/${project._id}`}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
        >
          <span>View details</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}