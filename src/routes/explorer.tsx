import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TABLES, TABLE_BY_NAME, type TableName } from "@/lib/aiu/metadata";
import { PageHeader } from "@/components/aiu/AppShell";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/explorer")({
  head: () => ({
    meta: [
      { title: "Data Explorer — AIU Retrieval Dashboard" },
      { name: "description", content: "Browse AIU tables, column datatypes, keys and records." },
      { property: "og:title", content: "Data Explorer — AIU Retrieval Dashboard" },
      { property: "og:description", content: "Browse AIU tables, column datatypes, keys and records." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Explorer,
});

function Explorer() {
  const [table, setTable] = useState<TableName>("user_details");
  const [filter, setFilter] = useState("");
  const meta = TABLE_BY_NAME[table];
  const cols = meta.columns.filter((c) => c.type !== "JSONB");
  const { data, isLoading, error } = useQuery({
    queryKey: ["explore", table],
    queryFn: async () => {
      const { data, error } = await supabase.from(table).select("*").order("row_id").limit(500);
      if (error) throw new Error(error.message);
      return (data ?? []) as Record<string, unknown>[];
    },
  });
  const rows = useMemo(() => {
    const f = filter.trim().toLowerCase();
    return (data ?? []).filter((r) => !f || cols.some((c) => String(r[c.column] ?? "").toLowerCase().includes(f)));
  }, [data, filter, cols]);

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader title="Data Explorer" subtitle="Select a table to view its columns and records" />
      <div className="mb-4 flex flex-wrap gap-3">
        <Select value={table} onValueChange={(v) => setTable(v as TableName)}>
          <SelectTrigger className="w-64"><SelectValue /></SelectTrigger>
          <SelectContent>{TABLES.map((t) => <SelectItem key={t.name} value={t.name}>{t.label}</SelectItem>)}</SelectContent>
        </Select>
        <Input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Filter records…" className="max-w-xs" />
      </div>
      <div className="grid gap-6 lg:grid-cols-[18rem_1fr]">
        <div className="max-h-[70vh] overflow-auto rounded-md border border-border bg-card">
          <div className="sticky top-0 border-b border-border bg-muted px-3 py-2 text-xs font-semibold">{meta.columns.length} columns</div>
          {meta.columns.map((c) => (
            <div key={c.column} className="flex items-center justify-between gap-2 border-b border-border px-3 py-1.5 text-xs last:border-0">
              <span className="truncate font-mono" title={c.source}>{c.column}</span>
              <span className="flex shrink-0 gap-1">
                {c.pk && <span className="rounded bg-primary px-1 text-[10px] text-primary-foreground">PK</span>}
                {c.fk && <span className="rounded bg-accent px-1 text-[10px] text-accent-foreground" title={c.fk}>FK</span>}
                <span className="text-muted-foreground">{c.type}</span>
              </span>
            </div>
          ))}
        </div>
        <div className="min-w-0">
          {error && <p className="text-sm text-destructive">{(error as Error).message}</p>}
          <div className="mb-2 text-xs text-muted-foreground">{isLoading ? "Loading…" : `${rows.length} of ${data?.length ?? 0} records`}</div>
          <div className="max-h-[70vh] overflow-auto rounded-md border border-border bg-card">
            <table className="text-xs">
              <thead className="sticky top-0 bg-muted text-left">
                <tr><th className="p-2">valid</th>{cols.map((c) => <th key={c.column} className="whitespace-nowrap p-2 font-mono font-medium">{c.column}</th>)}</tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={String(r.row_id)} className="border-t border-border hover:bg-muted/50">
                    <td className="p-2">{r.is_valid ? "✓" : <span className="text-destructive">✗</span>}</td>
                    {cols.map((c) => <td key={c.column} className="whitespace-nowrap p-2 font-mono">{r[c.column] === null ? "—" : String(r[c.column])}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
