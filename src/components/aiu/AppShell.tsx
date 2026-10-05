import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { LayoutDashboard, Search, Database, ShieldCheck, Network, History } from "lucide-react";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/retrieval", label: "Retrieval Assistant", icon: Search },
  { to: "/explorer", label: "Data Explorer", icon: Database },
  { to: "/validation", label: "Validation", icon: ShieldCheck },
  { to: "/schema", label: "Schema & Relationships", icon: Network },
  { to: "/history", label: "Query History", icon: History },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex">
        <div className="border-b border-sidebar-border px-5 py-5">
          <div className="font-mono text-xs uppercase tracking-widest text-sidebar-primary">AIU</div>
          <div className="mt-1 text-sm font-semibold text-sidebar-accent-foreground">Retrieval Dashboard</div>
          <div className="text-xs opacity-60">Version 2.1</div>
        </div>
        <nav className="flex-1 space-y-0.5 p-3">
          {NAV.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: to === "/" }}
              className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              activeProps={{ className: "bg-sidebar-accent text-sidebar-accent-foreground font-medium" }}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-sidebar-border p-4 text-xs opacity-60">Synthetic dataset · read-only</div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <nav className="flex gap-1 overflow-x-auto border-b border-border bg-sidebar p-2 md:hidden">
          {NAV.map(({ to, label }) => (
            <Link key={to} to={to} activeOptions={{ exact: to === "/" }} className="whitespace-nowrap rounded px-3 py-1.5 text-xs text-sidebar-foreground" activeProps={{ className: "bg-sidebar-accent text-sidebar-accent-foreground" }}>
              {label}
            </Link>
          ))}
        </nav>
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {actions}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const tone =
    status === "FOUND" || status === "PASS" ? "bg-success/15 text-success border-success/30"
    : status === "NO_RECORDS_FOUND" || status === "NOT_FOUND" || status === "DUPLICATE" ? "bg-warning/20 text-warning-foreground border-warning/40"
    : status === "VALIDATION_ERROR" || status === "SYSTEM_ERROR" || status === "INVALID" ? "bg-destructive/10 text-destructive border-destructive/30"
    : "bg-muted text-muted-foreground border-border";
  return <span className={`inline-flex rounded border px-2 py-0.5 font-mono text-[11px] font-medium ${tone}`}>{status}</span>;
}

export function Stat({ label, value, tone }: { label: string; value: ReactNode; tone?: "success" | "destructive" | "warning" }) {
  const c = tone === "success" ? "text-success" : tone === "destructive" ? "text-destructive" : tone === "warning" ? "text-warning-foreground" : "text-foreground";
  return (
    <div className="rounded-md border border-border bg-card p-4">
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className={`mt-2 font-mono text-2xl font-semibold ${c}`}>{value}</div>
    </div>
  );
}
