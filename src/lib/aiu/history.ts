// Lightweight query history (browser localStorage). Call only from effects/handlers.
export interface HistoryEntry { id: string; at: string; mode: "single" | "bulk"; searchType: string; request: string; resultCount: number; status: string }
const KEY = "aiu.queryHistory.v1";

export function readHistory(): HistoryEntry[] {
  try { return JSON.parse(localStorage.getItem(KEY) ?? "[]"); } catch { return []; }
}
export function addHistory(e: Omit<HistoryEntry, "id" | "at">) {
  const list = [{ ...e, id: crypto.randomUUID(), at: new Date().toISOString() }, ...readHistory()].slice(0, 200);
  localStorage.setItem(KEY, JSON.stringify(list));
}
export function clearHistory() { localStorage.removeItem(KEY); }
