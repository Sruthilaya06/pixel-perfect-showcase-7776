import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { loadStats } from "@/lib/aiu/stats";
import { PageHeader, Stat } from "@/components/aiu/AppShell";
import { Search, Database, ShieldCheck, Network } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — AIU Retrieval Dashboard" },
      { name: "description", content: "Overview of AIU records, tables, validity and data issues." },
      { property: "og:title", content: "Dashboard — AIU Retrieval Dashboard" },
      { property: "og:description", content: "Overview of AIU records, tables, validity and data issues." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Dashboard,
});

const ACTIONS = [
  { to: "/retrieval", label: "New Retrieval", desc: "Search by mobile, PAN, client code, form number or name", icon: Search },
  { to: "/explorer", label: "Explore Data", desc: "Browse tables, columns and records", icon: Database },
  { to: "/validation", label: "Validate Data", desc: "Duplicate keys and orphan relationships", icon: ShieldCheck },
  { to: "/schema", label: "View Schema", desc: "Tables, datatypes and relationships", icon: Network },
] as const;

function Dashboard() {
  const { data, isLoading, error } = useQuery({ queryKey: ["stats"], queryFn: loadStats });
  const total = data?.reduce((a, t) => a + t.total, 0);
  const valid = data?.reduce((a, t) => a + t.valid, 0);
  const issues = data?.reduce((a, t) => a + t.invalid + t.duplicatePk + t.orphanFk, 0);
  const v = (n?: number) => (isLoading ? "…" : n ?? "—");
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Dashboard" subtitle="Live figures from the AIU source tables" />
      {error && <p className="mb-4 text-sm text-destructive">Could not load statistics: {(error as Error).message}</p>}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Total Records" value={v(total)} />
        <Stat label="Tables" value={v(data?.length)} />
        <Stat label="Valid Records" value={v(valid)} tone="success" />
        <Stat label="Data Issues" value={v(issues)} tone={issues ? "destructive" : undefined} />
      </div>
      <h2 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Quick Actions</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ACTIONS.map(({ to, label, desc, icon: Icon }) => (
          <Link key={to} to={to} className="group rounded-md border border-border bg-card p-4 transition-colors hover:border-ring">
            <Icon className="h-5 w-5 text-ring" />
            <div className="mt-3 font-medium">{label}</div>
            <div className="mt-1 text-xs text-muted-foreground">{desc}</div>
          </Link>
        ))}
      </div>
      {data && (
        <>
          <h2 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Records by table</h2>
          <div className="rounded-md border border-border bg-card">
            {data.map((t) => (
              <div key={t.table} className="flex items-center justify-between border-b border-border px-4 py-2.5 text-sm last:border-0">
                <span>{t.label}</span>
                <span className="font-mono text-xs text-muted-foreground">{t.total} rows · {t.valid} valid</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
