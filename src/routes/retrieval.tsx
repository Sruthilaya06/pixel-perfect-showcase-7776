import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SEARCH_FIELDS, OUTPUT_FIELDS, SEARCH_FIELD_BY_KEY, type SearchFieldKey } from "@/lib/aiu/metadata";
import { retrieve, retrieveBulk, parseBulkFile, type RetrievalResult, type BulkResult } from "@/lib/aiu/retrieval";
import { addHistory } from "@/lib/aiu/history";
import { PageHeader, StatusBadge, Stat } from "@/components/aiu/AppShell";
import { ProjectedTable, FullRelated } from "@/components/aiu/RelatedRecords";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/retrieval")({
  head: () => ({
    meta: [
      { title: "Retrieval Assistant — AIU Retrieval Dashboard" },
      { name: "description", content: "Retrieve related AIU records by mobile, PAN, client code, form number or name." },
      { property: "og:title", content: "Retrieval Assistant — AIU Retrieval Dashboard" },
      { property: "og:description", content: "Single and bulk retrieval of related AIU records." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: RetrievalPage,
});

function FieldPicker({ selected, setSelected }: { selected: string[]; setSelected: (s: string[]) => void }) {
  return (
    <div className="rounded-md border border-border bg-card p-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-sm font-medium">Output fields</div>
        <div className="flex gap-2 text-xs">
          <button className="text-ring hover:underline" onClick={() => setSelected(OUTPUT_FIELDS.map((f) => f.key))}>All</button>
          <button className="text-ring hover:underline" onClick={() => setSelected([])}>None</button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {OUTPUT_FIELDS.map((f) => (
          <label key={f.key} className="flex items-center gap-2 text-sm" title={`${f.table}.${f.columns.join(" + ")} (${f.datatype})`}>
            <Checkbox checked={selected.includes(f.key)} onCheckedChange={(c) => setSelected(c ? [...selected, f.key] : selected.filter((k) => k !== f.key))} />
            {f.label}
          </label>
        ))}
      </div>
    </div>
  );
}

function FieldSelect({ value, onChange, bulkOnly }: { value: SearchFieldKey; onChange: (v: SearchFieldKey) => void; bulkOnly?: boolean }) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as SearchFieldKey)}>
      <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
      <SelectContent>
        {SEARCH_FIELDS.filter((f) => !bulkOnly || f.bulk).map((f) => <SelectItem key={f.key} value={f.key}>{f.label}</SelectItem>)}
      </SelectContent>
    </Select>
  );
}

function RetrievalPage() {
  const [fields, setFields] = useState(OUTPUT_FIELDS.filter((f) => f.default).map((f) => f.key));
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Retrieval Assistant" subtitle="Choose a search field, enter a value, and retrieve all related records" />
      <Tabs defaultValue="single">
        <TabsList><TabsTrigger value="single">Single search</TabsTrigger><TabsTrigger value="bulk">Bulk search</TabsTrigger></TabsList>
        <div className="mt-4"><FieldPicker selected={fields} setSelected={setFields} /></div>
        <TabsContent value="single"><Single fields={fields} /></TabsContent>
        <TabsContent value="bulk"><Bulk fields={fields} /></TabsContent>
      </Tabs>
    </div>
  );
}

function Single({ fields }: { fields: string[] }) {
  const [key, setKey] = useState<SearchFieldKey>("mobile");
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState<RetrievalResult | null>(null);

  const run = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const r = await retrieve(key, value);
    setRes(r);
    setBusy(false);
    addHistory({ mode: "single", searchType: r.searchField, request: r.searchValue, resultCount: r.recordCount, status: r.status });
  };

  return (
    <div className="mt-4 space-y-6">
      <form onSubmit={run} className="flex flex-wrap items-end gap-3 rounded-md border border-border bg-card p-4">
        <div><div className="mb-1 text-xs font-medium text-muted-foreground">Search By</div><FieldSelect value={key} onChange={setKey} /></div>
        <div className="min-w-60 flex-1">
          <div className="mb-1 text-xs font-medium text-muted-foreground">Value</div>
          <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder={`e.g. ${SEARCH_FIELD_BY_KEY[key].placeholder}`} className="font-mono" />
        </div>
        <Button type="submit" disabled={busy}>{busy ? "Retrieving…" : "Retrieve"}</Button>
        <div className="w-full text-xs text-muted-foreground">Normalization: {SEARCH_FIELD_BY_KEY[key].normalization}</div>
      </form>

      {res && (
        <div className="space-y-4">
          <div className="grid gap-3 rounded-md border border-border bg-card p-4 text-sm sm:grid-cols-5">
            <div><div className="text-xs text-muted-foreground">Search field</div>{res.searchField}</div>
            <div><div className="text-xs text-muted-foreground">Search value</div><span className="font-mono">{res.searchValue}</span></div>
            <div><div className="text-xs text-muted-foreground">Status</div><StatusBadge status={res.status} /></div>
            <div><div className="text-xs text-muted-foreground">Record count</div><span className="font-mono">{res.recordCount}</span></div>
            <div><div className="text-xs text-muted-foreground">Source tables</div><span className="text-xs">{res.sourceTables.join(", ") || "—"}</span></div>
          </div>
          {res.status !== "FOUND" ? (
            <p className={`rounded-md border p-4 text-sm ${res.status === "NO_RECORDS_FOUND" ? "border-warning/40 bg-warning/10" : "border-destructive/30 bg-destructive/5 text-destructive"}`}>{res.message}</p>
          ) : (
            <>
              <ProjectedTable groups={res.related} fields={fields} />
              <h3 className="text-sm font-semibold">All related records</h3>
              <FullRelated groups={res.related} />
            </>
          )}
        </div>
      )}
    </div>
  );
}

function Bulk({ fields }: { fields: string[] }) {
  const [key, setKey] = useState<SearchFieldKey>("mobile");
  const [values, setValues] = useState<string[]>([]);
  const [fileName, setFileName] = useState("");
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState<BulkResult | null>(null);

  const onFile = async (f?: File) => {
    if (!f) return;
    setFileName(f.name);
    const v = await parseBulkFile(f);
    setValues(v);
    setText(v.join("\n"));
  };

  const run = async () => {
    const inputs = text.split(/[\r\n,;\t]+/).map((s) => s.trim()).filter(Boolean);
    setBusy(true);
    const r = await retrieveBulk(key, inputs);
    setRes(r);
    setBusy(false);
    addHistory({ mode: "bulk", searchType: r.field, request: `${fileName || "pasted list"} (${r.total} inputs)`, resultCount: r.found, status: r.error ? "SYSTEM_ERROR" : r.found ? "FOUND" : "NO_RECORDS_FOUND" });
  };

  return (
    <div className="mt-4 space-y-6">
      <div className="space-y-3 rounded-md border border-border bg-card p-4">
        <div className="flex flex-wrap items-end gap-3">
          <div><div className="mb-1 text-xs font-medium text-muted-foreground">Search By</div><FieldSelect value={key} onChange={setKey} bulkOnly /></div>
          <div>
            <div className="mb-1 text-xs font-medium text-muted-foreground">Upload TXT, CSV or XLSX (first column)</div>
            <Input type="file" accept=".txt,.csv,.xlsx,.xls" onChange={(e) => onFile(e.target.files?.[0])} />
          </div>
          <Button onClick={run} disabled={busy || !text.trim()}>{busy ? "Retrieving…" : "Run bulk retrieval"}</Button>
        </div>
        <textarea value={text} onChange={(e) => { setText(e.target.value); setValues([]); }} rows={5} placeholder="…or paste values, one per line" className="w-full rounded-md border border-input bg-background p-2 font-mono text-xs" />
        {values.length > 0 && <div className="text-xs text-muted-foreground">Parsed {values.length} values from {fileName}</div>}
      </div>

      {res && (
        <div className="space-y-4">
          {res.error && <p className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">System error: {res.error}</p>}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            <Stat label="Total Inputs" value={res.total} />
            <Stat label="Valid Inputs" value={res.valid} />
            <Stat label="Found" value={res.found} tone="success" />
            <Stat label="Not Found" value={res.notFound} tone="warning" />
            <Stat label="Invalid" value={res.invalid} tone="destructive" />
          </div>
          {res.duplicates > 0 && <p className="text-xs text-muted-foreground">{res.duplicates} duplicate input(s) removed before retrieval.</p>}
          <div className="max-h-72 overflow-auto rounded-md border border-border bg-card">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-muted text-left text-xs text-muted-foreground"><tr><th className="p-2">Input</th><th className="p-2">Normalized</th><th className="p-2">Status</th><th className="p-2">Detail</th></tr></thead>
              <tbody>
                {res.items.map((it, i) => (
                  <tr key={i} className="border-t border-border"><td className="p-2 font-mono text-xs">{it.input}</td><td className="p-2 font-mono text-xs">{it.normalized}</td><td className="p-2"><StatusBadge status={it.status} /></td><td className="p-2 text-xs text-muted-foreground">{it.error ?? (it.matches ? `${it.matches} match(es)` : "")}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          {res.related.length > 0 && <ProjectedTable groups={res.related} fields={fields} />}
        </div>
      )}
    </div>
  );
}
