// Generic retrieval engine: search field -> seed rows -> expand keys via relationships -> standard result.
// Uses the read-only data API (no raw SQL). Batch queries (`in`) are used for multiple values.
import { supabase } from "@/integrations/supabase/client";
import { SEARCH_FIELD_BY_KEY, type SearchFieldKey, type TableName } from "./metadata";

type Row = Record<string, unknown>;
export type MatchStatus = "FOUND" | "NO_RECORDS_FOUND" | "VALIDATION_ERROR" | "SYSTEM_ERROR";

export interface ClientGroup {
  clientCode: string | null;
  user: Row | null;
  accounts: {
    formNumber: string;
    account: Row | null;
    addresses: Row[];
    personal: Row[];
    clientDetails: Row[];
  }[];
}

export interface RetrievalResult {
  searchField: string;
  searchValue: string;
  status: MatchStatus;
  recordCount: number;
  related: ClientGroup[];
  sourceTables: TableName[];
  error?: string;
  message: string;
}

const q = (table: TableName) => supabase.from(table).select("*");

async function rows(p: PromiseLike<{ data: Row[] | null; error: { message: string } | null }>): Promise<Row[]> {
  const { data, error } = await p;
  if (error) throw new Error(error.message);
  return data ?? [];
}

const s = (v: unknown) => (v === null || v === undefined ? "" : String(v));
const fullName = (r: Row) =>
  [r.user_first_name, r.user_middle_name, r.user_last_name].map(s).filter(Boolean).join(" ").toLowerCase();

/** Find seed rows in the search field's table that match any of the normalized values. */
async function findSeeds(key: SearchFieldKey, values: string[]): Promise<Row[]> {
  const f = SEARCH_FIELD_BY_KEY[key];
  if (f.searchType === "name_ci") {
    const out: Row[] = [];
    for (const v of values) {
      const first = v.split(" ")[0].replace(/[%_,()]/g, "");
      const cand = await rows(q("user_personal_details").ilike("user_first_name", first));
      const target = v.toLowerCase();
      out.push(...cand.filter((r) => fullName(r) === target || s(r.user_name_as_per_aadhar).trim().toLowerCase() === target));
    }
    return out;
  }
  const typed = f.datatype === "BIGINT" ? values.map(Number) : values;
  return rows(q(f.table).in(f.column, typed));
}

/** Expand seed rows into complete related records across all five tables. */
async function expand(seeds: Row[]): Promise<{ groups: ClientGroup[]; count: number; tables: Set<TableName> }> {
  const cc = new Set<string>();
  const fn = new Set<string>();
  for (const r of seeds) {
    if (r.client_code) cc.add(s(r.client_code));
    if (r.form_number !== null && r.form_number !== undefined) fn.add(s(r.form_number));
  }
  // Resolve keys through user_account_information (the hub between client_code and form_number).
  const accounts = new Map<string, Row>();
  const addAcc = (list: Row[]) => list.forEach((a) => { accounts.set(s(a.form_number), a); cc.add(s(a.client_code)); fn.add(s(a.form_number)); });
  if (fn.size) addAcc(await rows(q("user_account_information").in("form_number", [...fn].map(Number))));
  if (cc.size) addAcc(await rows(q("user_account_information").in("client_code", [...cc])));
  cc.delete(""); fn.delete("");

  const fnNums = [...fn].map(Number);
  const [users, addresses, personal, clientDet] = await Promise.all([
    cc.size ? rows(q("user_details").in("client_code", [...cc])) : [],
    fnNums.length ? rows(q("user_address_details").in("form_number", fnNums)) : [],
    fnNums.length ? rows(q("user_personal_details").in("form_number", fnNums)) : [],
    fnNums.length ? rows(q("client_details").in("form_number", fnNums)) : [],
  ]);

  const tables = new Set<TableName>();
  if (users.length) tables.add("user_details");
  if (accounts.size) tables.add("user_account_information");
  if (addresses.length) tables.add("user_address_details");
  if (personal.length) tables.add("user_personal_details");
  if (clientDet.length) tables.add("client_details");

  const byFn = <T extends Row>(list: T[], f: string) => list.filter((r) => s(r.form_number) === f);
  const groups = new Map<string, ClientGroup>();
  const groupFor = (code: string | null) => {
    const k = code ?? "__none__";
    if (!groups.has(k)) groups.set(k, { clientCode: code, user: users.find((u) => s(u.client_code) === code) ?? null, accounts: [] });
    return groups.get(k)!;
  };
  for (const u of users) groupFor(s(u.client_code));
  for (const f of fn) {
    const acc = accounts.get(f) ?? null;
    groupFor(acc ? s(acc.client_code) : null).accounts.push({
      formNumber: f, account: acc, addresses: byFn(addresses, f), personal: byFn(personal, f), clientDetails: byFn(clientDet, f),
    });
  }
  const count = users.length + accounts.size + addresses.length + personal.length + clientDet.length;
  return { groups: [...groups.values()], count, tables };
}

export async function retrieve(key: SearchFieldKey, rawValue: string): Promise<RetrievalResult> {
  const f = SEARCH_FIELD_BY_KEY[key];
  const value = f.normalize(rawValue);
  const base = { searchField: f.label, searchValue: value || rawValue, related: [], sourceTables: [], recordCount: 0 };
  const err = value ? f.validate(value) : "Please enter a value";
  if (err) return { ...base, status: "VALIDATION_ERROR", error: err, message: err };
  try {
    const seeds = await findSeeds(key, [value]);
    if (!seeds.length) return { ...base, status: "NO_RECORDS_FOUND", message: `No records found for ${f.label}: ${value}` };
    const { groups, count, tables } = await expand(seeds);
    return { ...base, status: "FOUND", related: groups, recordCount: count, sourceTables: [...tables], message: `${count} related records found` };
  } catch (e) {
    const m = e instanceof Error ? e.message : "Unknown error";
    return { ...base, status: "SYSTEM_ERROR", error: m, message: `System error: ${m}` };
  }
}

// ---------- Bulk ----------
export interface BulkItem { input: string; normalized: string; status: "FOUND" | "NOT_FOUND" | "INVALID" | "DUPLICATE"; error?: string; matches: number }
export interface BulkResult { field: string; total: number; valid: number; found: number; notFound: number; invalid: number; duplicates: number; items: BulkItem[]; related: ClientGroup[]; error?: string }

export async function retrieveBulk(key: SearchFieldKey, inputs: string[]): Promise<BulkResult> {
  const f = SEARCH_FIELD_BY_KEY[key];
  const seen = new Set<string>();
  const items: BulkItem[] = inputs.map((input) => {
    const normalized = f.normalize(input);
    const error = f.validate(normalized);
    if (error) return { input, normalized, status: "INVALID", error, matches: 0 };
    if (seen.has(normalized)) return { input, normalized, status: "DUPLICATE", matches: 0 };
    seen.add(normalized);
    return { input, normalized, status: "NOT_FOUND", matches: 0 };
  });
  const unique = [...seen];
  let related: ClientGroup[] = [];
  let error: string | undefined;
  if (unique.length) {
    try {
      const seeds = [];
      for (let i = 0; i < unique.length; i += 200) seeds.push(...(await findSeeds(key, unique.slice(i, i + 200))));
      const hits = new Map<string, number>();
      for (const r of seeds) { const v = s(r[f.column]).toUpperCase(); hits.set(v, (hits.get(v) ?? 0) + 1); }
      for (const it of items) if (it.status === "NOT_FOUND") { const n = hits.get(it.normalized.toUpperCase()) ?? 0; if (n) { it.status = "FOUND"; it.matches = n; } }
      if (seeds.length) related = (await expand(seeds)).groups;
    } catch (e) { error = e instanceof Error ? e.message : "Unknown error"; }
  }
  const c = (st: BulkItem["status"]) => items.filter((i) => i.status === st).length;
  return { field: f.label, total: inputs.length, valid: unique.length, found: c("FOUND"), notFound: c("NOT_FOUND"), invalid: c("INVALID"), duplicates: c("DUPLICATE"), items, related, error };
}

/** Parse uploaded TXT / CSV / XLSX into a flat list of values (first column for tabular files). */
export async function parseBulkFile(file: File): Promise<string[]> {
  const name = file.name.toLowerCase();
  let cells: string[];
  if (name.endsWith(".xlsx") || name.endsWith(".xls")) {
    const XLSX = await import("xlsx");
    const wb = XLSX.read(await file.arrayBuffer(), { type: "array" });
    const data = XLSX.utils.sheet_to_json<unknown[]>(wb.Sheets[wb.SheetNames[0]], { header: 1, raw: false, defval: "" });
    cells = data.map((r) => s(r[0]));
  } else {
    const text = await file.text();
    cells = name.endsWith(".csv") ? text.split(/\r?\n/).map((l) => l.split(",")[0].replace(/^"|"$/g, "")) : text.split(/[\r\n,;\t]+/);
  }
  const vals = cells.map((c) => c.trim()).filter(Boolean);
  // Drop a header row if the first value is clearly a label.
  if (vals.length && /[a-z]{3,}/i.test(vals[0]) && /mobile|pan|client|form|number|code/i.test(vals[0])) vals.shift();
  return vals;
}

// ---------- Output projection ----------
import { OUTPUT_FIELDS } from "./metadata";
export function projectRows(groups: ClientGroup[], fieldKeys: string[]): Record<string, string>[] {
  const fields = OUTPUT_FIELDS.filter((f) => fieldKeys.includes(f.key));
  const out: Record<string, string>[] = [];
  for (const g of groups) {
    const accs = g.accounts.length ? g.accounts : [{ formNumber: "", account: null, addresses: [], personal: [], clientDetails: [] }];
    for (const a of accs) {
      const src: Record<TableName, Row[]> = {
        user_details: g.user ? [g.user] : [], user_account_information: a.account ? [a.account] : [],
        user_address_details: a.addresses, user_personal_details: a.personal, client_details: a.clientDetails,
      };
      const row: Record<string, string> = {};
      for (const f of fields) {
        const vals = src[f.table].map((r) => f.columns.map((c) => s(r[c])).filter(Boolean).join(f.key === "name" ? " " : ", ")).filter(Boolean);
        row[f.key] = [...new Set(vals)].join(" | ") || "—";
      }
      out.push(row);
    }
  }
  return out;
}
