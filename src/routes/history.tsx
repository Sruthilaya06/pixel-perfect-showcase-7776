import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { readHistory, clearHistory, type HistoryEntry } from "@/lib/aiu/history";
import { PageHeader, StatusBadge } from "@/components/aiu/AppShell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Query History — AIU Retrieval Dashboard" },
      { name: "description", content: "Recent retrieval requests made from this browser." },
      { property: "og:title", content: "Query History — AIU Retrieval Dashboard" },
      { property: "og:description", content: "Recent retrieval requests made from this browser." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const [list, setList] = useState<HistoryEntry[]>([]);
  useEffect(() => setList(readHistory()), []);
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Query History" subtitle="Stored in this browser only" actions={list.length > 0 && <Button variant="outline" size="sm" onClick={() => { clearHistory(); setList([]); }}>Clear history</Button>} />
      {list.length === 0 ? (
        <p className="text-sm text-muted-foreground">No queries yet. Run a retrieval to see it here.</p>
      ) : (
        <div className="overflow-x-auto rounded-md border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left text-xs text-muted-foreground"><tr><th className="p-3">Date / time</th><th className="p-3">Mode</th><th className="p-3">Search type</th><th className="p-3">Request</th><th className="p-3 text-right">Results</th><th className="p-3">Status</th></tr></thead>
            <tbody>
              {list.map((h) => (
                <tr key={h.id} className="border-t border-border">
                  <td className="p-3 font-mono text-xs">{new Date(h.at).toLocaleString()}</td><td className="p-3 text-xs">{h.mode}</td><td className="p-3">{h.searchType}</td>
                  <td className="p-3 font-mono text-xs">{h.request}</td><td className="p-3 text-right font-mono">{h.resultCount}</td><td className="p-3"><StatusBadge status={h.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
