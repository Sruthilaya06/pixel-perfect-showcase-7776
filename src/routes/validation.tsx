import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { loadStats } from "@/lib/aiu/stats";
import { PageHeader, Stat, StatusBadge } from "@/components/aiu/AppShell";

export const Route = createFileRoute("/validation")({
  head: () => ({
    meta: [
      { title: "Validation — AIU Retrieval Dashboard" },
      { name: "description", content: "Valid and invalid records, duplicate primary keys and orphan foreign keys." },
      { property: "og:title", content: "Validation — AIU Retrieval Dashboard" },
      { property: "og:description", content: "Relational validation results for the AIU dataset." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Validation,
});

function Validation() {
  const { data, isLoading, error } = useQuery({ queryKey: ["stats"], queryFn: loadStats });
  const sum = (k: "valid" | "invalid" | "duplicatePk" | "orphanFk") => data?.reduce((a, t) => a + t[k], 0) ?? "…";
  const issues = data?.flatMap((t) => t.issues.map((i) => ({ ...i, table: t.label }))) ?? [];
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Validation" subtitle="Primary key uniqueness and foreign key integrity, checked live" />
      {error && <p className="mb-4 text-sm text-destructive">{(error as Error).message}</p>}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Valid Records" value={sum("valid")} tone="success" />
        <Stat label="Invalid Records" value={sum("invalid")} tone="destructive" />
        <Stat label="Duplicate PKs" value={sum("duplicatePk")} tone="warning" />
        <Stat label="Orphan FK Records" value={sum("orphanFk")} tone="warning" />
      </div>
      <div className="mt-6 overflow-x-auto rounded-md border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left text-xs text-muted-foreground">
            <tr><th className="p-3">Table</th><th className="p-3 text-right">Total</th><th className="p-3 text-right">Valid</th><th className="p-3 text-right">Invalid</th><th className="p-3 text-right">Duplicate PK</th><th className="p-3 text-right">Orphan FK</th><th className="p-3">Status</th></tr>
          </thead>
          <tbody>
            {isLoading && <tr><td className="p-3 text-muted-foreground" colSpan={7}>Loading…</td></tr>}
            {data?.map((t) => (
              <tr key={t.table} className="border-t border-border font-mono text-xs">
                <td className="p-3 font-sans text-sm">{t.label}</td>
                <td className="p-3 text-right">{t.total}</td><td className="p-3 text-right">{t.valid}</td><td className="p-3 text-right">{t.invalid}</td>
                <td className="p-3 text-right">{t.duplicatePk}</td><td className="p-3 text-right">{t.orphanFk}</td>
                <td className="p-3"><StatusBadge status={t.invalid + t.duplicatePk + t.orphanFk === 0 ? "PASS" : "INVALID"} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h2 className="mb-2 mt-8 text-sm font-semibold">Issues</h2>
      {data && issues.length === 0 ? (
        <p className="rounded-md border border-success/30 bg-success/10 p-4 text-sm">No validation issues found. All records pass PK and FK checks.</p>
      ) : (
        <ul className="divide-y divide-border rounded-md border border-border bg-card text-sm">
          {issues.map((i, n) => <li key={n} className="p-3"><span className="text-muted-foreground">{i.table} · row {i.rowId}:</span> {i.issue}</li>)}
        </ul>
      )}
    </div>
  );
}
