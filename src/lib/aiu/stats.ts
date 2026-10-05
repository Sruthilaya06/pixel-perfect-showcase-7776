// Live validation statistics computed from the database (no fabricated numbers).
import { supabase } from "@/integrations/supabase/client";
import { TABLES, RELATIONSHIPS, type TableName } from "./metadata";

export interface TableStats {
  table: TableName; label: string; total: number; valid: number; invalid: number;
  duplicatePk: number; orphanFk: number; issues: { rowId: number; issue: string }[];
}

type KeyRow = { row_id: number; client_code?: string | null; form_number?: number | null; is_valid: boolean; validation_issues: string };

export async function loadStats(): Promise<TableStats[]> {
  const data = {} as Record<TableName, KeyRow[]>;
  await Promise.all(TABLES.map(async (t) => {
    const cols = ["row_id", "is_valid", "validation_issues", ...t.columns.filter((c) => c.pk || c.fk).map((c) => c.column)];
    const { data: d, error } = await supabase.from(t.name).select([...new Set(cols)].join(",")).limit(10000);
    if (error) throw new Error(error.message);
    data[t.name] = (d ?? []) as unknown as KeyRow[];
  }));
  return TABLES.map((t) => {
    const rows = data[t.name];
    const issues: TableStats["issues"] = [];
    let duplicatePk = 0, orphanFk = 0;
    if (t.pk) {
      const seen = new Map<string, number>();
      for (const r of rows) { const k = String((r as Record<string, unknown>)[t.pk] ?? ""); seen.set(k, (seen.get(k) ?? 0) + 1); }
      for (const r of rows) {
        const k = String((r as Record<string, unknown>)[t.pk] ?? "");
        if ((seen.get(k) ?? 0) > 1) { duplicatePk++; issues.push({ rowId: r.row_id, issue: `Duplicate ${t.pk}: ${k}` }); }
      }
    }
    for (const rel of RELATIONSHIPS.filter((r) => r.from.table === t.name)) {
      const parent = new Set(data[rel.to.table].map((r) => String((r as Record<string, unknown>)[rel.to.column] ?? "")));
      for (const r of rows) {
        const v = (r as Record<string, unknown>)[rel.from.column];
        if (v !== null && v !== undefined && v !== "" && !parent.has(String(v))) {
          orphanFk++; issues.push({ rowId: r.row_id, issue: `Orphan ${rel.from.column} '${v}' not in ${rel.to.table}` });
        }
      }
    }
    for (const r of rows) if (r.validation_issues) issues.push({ rowId: r.row_id, issue: r.validation_issues });
    const valid = rows.filter((r) => r.is_valid).length;
    return { table: t.name, label: t.label, total: rows.length, valid, invalid: rows.length - valid, duplicatePk, orphanFk, issues };
  });
}
