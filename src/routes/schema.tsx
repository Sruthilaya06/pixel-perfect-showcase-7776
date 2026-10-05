import { createFileRoute } from "@tanstack/react-router";
import { TABLES, RELATIONSHIPS, SEARCH_FIELDS } from "@/lib/aiu/metadata";
import { PageHeader } from "@/components/aiu/AppShell";

export const Route = createFileRoute("/schema")({
  head: () => ({
    meta: [
      { title: "Schema & Relationships — AIU Retrieval Dashboard" },
      { name: "description", content: "AIU tables, columns, datatypes, primary and foreign keys." },
      { property: "og:title", content: "Schema & Relationships — AIU Retrieval Dashboard" },
      { property: "og:description", content: "AIU tables, columns, datatypes, primary and foreign keys." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Schema,
});

function Schema() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Schema & Relationships" subtitle="Defined once in the app's central metadata and reused by retrieval and validation" />
      <h2 className="mb-2 text-sm font-semibold">Relationships</h2>
      <div className="mb-8 overflow-x-auto rounded-md border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left text-xs text-muted-foreground"><tr><th className="p-3">From (FK)</th><th className="p-3">To (PK)</th><th className="p-3">Cardinality</th></tr></thead>
          <tbody>
            {RELATIONSHIPS.map((r, i) => (
              <tr key={i} className="border-t border-border font-mono text-xs">
                <td className="p-3">{r.from.table}.{r.from.column}</td><td className="p-3">→ {r.to.table}.{r.to.column}</td><td className="p-3 font-sans">{r.cardinality}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h2 className="mb-2 text-sm font-semibold">Search fields</h2>
      <div className="mb-8 overflow-x-auto rounded-md border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left text-xs text-muted-foreground"><tr><th className="p-3">Field</th><th className="p-3">Table.Column</th><th className="p-3">Datatype</th><th className="p-3">Match</th><th className="p-3">Normalization</th></tr></thead>
          <tbody>
            {SEARCH_FIELDS.map((f) => (
              <tr key={f.key} className="border-t border-border text-xs"><td className="p-3 text-sm">{f.label}</td><td className="p-3 font-mono">{f.table}.{f.column}</td><td className="p-3 font-mono">{f.datatype}</td><td className="p-3">{f.searchType}</td><td className="p-3">{f.normalization}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <h2 className="mb-2 text-sm font-semibold">Tables</h2>
      <div className="grid gap-4 lg:grid-cols-2">
        {TABLES.map((t) => (
          <div key={t.name} className="rounded-md border border-border bg-card">
            <div className="flex justify-between border-b border-border bg-muted px-3 py-2 text-sm"><span className="font-semibold">{t.label}</span><span className="font-mono text-xs text-muted-foreground">{t.name}</span></div>
            <div className="max-h-72 overflow-auto">
              {t.columns.map((c) => (
                <div key={c.column} className="flex items-center justify-between gap-2 border-b border-border px-3 py-1 text-xs last:border-0">
                  <span className="truncate font-mono" title={c.source}>{c.column}</span>
                  <span className="flex shrink-0 items-center gap-1">
                    {c.pk && <span className="rounded bg-primary px-1 text-[10px] text-primary-foreground">PK</span>}
                    {c.fk && <span className="rounded bg-accent px-1 text-[10px] text-accent-foreground">FK → {c.fk}</span>}
                    <span className="w-24 text-right text-muted-foreground">{c.type}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
