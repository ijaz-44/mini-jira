import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, Zap } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      {/* Header / Navbar */}
      <header className="px-6 py-4 border-b border-border bg-card/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2 font-bold text-xl text-primary">
          <Zap className="w-6 h-6 fill-current" />
          <span>Mini Jira</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium px-4 py-2 bg-primary hover:opacity-90 text-primary-foreground rounded-lg transition-colors shadow-sm"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-6 py-20 text-center space-y-8 my-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold border border-border">
          <ShieldCheck className="w-4 h-4 text-primary" /> Secure Agile Workspace
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
          Manage Projects & Tasks <br />
          <span className="text-primary">Without the Complexity</span>
        </h1>

        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Streamline your team&apos;s workflow with Kanban boards, real-time analytics, and task tracking built for modern engineering teams.
        </p>

        <div className="flex items-center justify-center gap-4 pt-4">
          <Link
            href="/login"
            className="flex items-center gap-2 px-6 py-3 bg-primary hover:opacity-90 text-primary-foreground font-medium rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            Go to App <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Quick Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 text-left">
          <div className="p-4 bg-card rounded-xl border border-border shadow-sm space-y-2">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-sm">Kanban Workflow</h3>
            <p className="text-xs text-muted-foreground">Visualize progress across To Do, In Progress, and Done stages easily.</p>
          </div>
          <div className="p-4 bg-card rounded-xl border border-border shadow-sm space-y-2">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-sm">Fast Metrics</h3>
            <p className="text-xs text-muted-foreground">Keep track of urgent tasks, total projects, and completed milestones.</p>
          </div>
          <div className="p-4 bg-card rounded-xl border border-border shadow-sm space-y-2">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-sm">JWT Authenticated</h3>
            <p className="text-xs text-muted-foreground">Secure session management using httpOnly HTTP cookies & Zustand.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-muted-foreground border-t border-border">
        Mini Jira Application &copy; {new Date().getFullYear()} — Built with Next.js & TypeScript
      </footer>
    </div>
  );
}