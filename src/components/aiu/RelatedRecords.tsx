import { useState } from "react";
import type { ClientGroup } from "@/lib/aiu/retrieval";
import { OUTPUT_FIELDS } from "@/lib/aiu/metadata";
import { projectRows } from "@/lib/aiu/retrieval";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronDown, ChevronRight } from "lucide-react";

type Row = Record<string, unknown>;

export function ProjectedTable({ groups, fields }: { groups: ClientGroup[]; fields: string[] }) {
  const cols = OUTPUT_FIELDS.filter((f) => fields.includes(f.key));
  const rows = projectRows(groups, fields);
  if (!cols.length) return <p className="text-sm text-muted-foreground">Select at least one output field.</p>;
  return (
    <div className="overflow-x-auto rounded-md border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>{cols.map((c) => <TableHead key={c.key} className="whitespace-nowrap">{c.label}</TableHead>)}</TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r, i) => (
            <TableRow key={i}>{cols.map((c) => <TableCell key={c.key} className="font-mono text-xs">{r[c.key]}</TableCell>)}</TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function RecordBlock({ title, rows }: { title: string; rows: Row[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded border border-border">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-muted">
        {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        <span className="font-medium">{title}</span>
        <span className="ml-auto font-mono text-xs text-muted-foreground">{rows.length} record(s)</span>
      </button>
      {open && rows.map((r, i) => (
        <dl key={i} className="grid grid-cols-1 gap-x-6 gap-y-1 border-t border-border bg-muted/40 px-4 py-3 text-xs sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(r).filter(([k]) => !["data", "created_at", "row_id"].includes(k)).map(([k, v]) => (
            <div key={k} className="flex justify-between gap-2 border-b border-border/50 py-0.5">
              <dt className="text-muted-foreground">{k}</dt>
              <dd className="truncate text-right font-mono">{v === null || v === "" ? "—" : String(v)}</dd>
            </div>
          ))}
        </dl>
      ))}
    </div>
  );
}

export function FullRelated({ groups }: { groups: ClientGroup[] }) {
  return (
    <div className="space-y-4">
      {groups.map((g) => (
        <div key={g.clientCode ?? "none"} className="rounded-md border border-border bg-card p-4">
          <div className="mb-3 text-sm font-semibold">Client <span className="font-mono">{g.clientCode ?? "(unlinked)"}</span></div>
          <div className="space-y-2">
            <RecordBlock title="User Details" rows={g.user ? [g.user] : []} />
            {g.accounts.map((a) => (
              <div key={a.formNumber} className="space-y-2 border-l-2 border-accent pl-3">
                <div className="text-xs font-medium text-muted-foreground">Form <span className="font-mono">{a.formNumber}</span></div>
                <RecordBlock title="User Account Information" rows={a.account ? [a.account] : []} />
                <RecordBlock title="User Address Details" rows={a.addresses} />
                <RecordBlock title="User Personal Details" rows={a.personal} />
                <RecordBlock title="Client Details" rows={a.clientDetails} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
