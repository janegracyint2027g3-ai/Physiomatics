import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/inbox")({
  head: () => ({
    meta: [
      { title: "Enquiry inbox — Physiomatics" },
      { name: "description", content: "Private list of enquiries received through the Physiomatics website." },
      { property: "og:title", content: "Physiomatics enquiry inbox" },
      { property: "og:description", content: "Private team area." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Inbox,
});

const STATUSES = ["new", "contacted", "closed"] as const;

function Inbox() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string>("all");
  const { data, isLoading, error } = useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const setStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("leads").update({ status }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    qc.invalidateQueries({ queryKey: ["leads"] });
  };

  const signOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  const rows = (data ?? []).filter((l) => filter === "all" || l.status === filter);

  return (
    <section className="container-page py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-4xl">Enquiry inbox</h1>
        <Button variant="outline" onClick={signOut}>Sign out</Button>
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        {["all", ...STATUSES].map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`rounded-full px-4 py-1.5 text-sm font-semibold capitalize ${filter === s ? "bg-primary text-primary-foreground" : "border bg-card text-muted-foreground"}`}>
            {s} {s !== "all" && `(${(data ?? []).filter((l) => l.status === s).length})`}
          </button>
        ))}
      </div>
      {isLoading && <p className="mt-8 text-muted-foreground">Loading…</p>}
      {error && <p className="mt-8 text-destructive">Couldn't load enquiries.</p>}
      {data && data.length === 0 && <p className="mt-8 text-muted-foreground">No enquiries yet. If you expected some, this account may not be the site owner.</p>}
      <div className="mt-8 grid gap-4">
        {rows.map((l) => (
          <article key={l.id} className="rounded-3xl border bg-card p-6 shadow-soft">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">{l.form_type === "consultation" ? "Consultation request" : "Quick enquiry"} · {new Date(l.created_at).toLocaleString()}</div>
                <h2 className="mt-1 text-xl">{l.full_name}</h2>
                <div className="text-sm text-muted-foreground">{[l.contact, l.email, l.phone].filter(Boolean).join(" · ")}</div>
              </div>
              <select value={l.status} onChange={(e) => setStatus(l.id, e.target.value)} className="h-9 rounded-xl border bg-background px-3 text-sm capitalize">
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <dl className="mt-4 grid gap-2 text-sm md:grid-cols-2">
              {([["Role / type", l.organization_type], ["Job title", l.job_title], ["Organization", l.organization], ["Country", l.country], ["Patients / students", l.audience_size], ["Message", l.message], ["Main challenge", l.challenge], ["Requirements", l.requirements]] as const)
                .filter(([, v]) => v).map(([k, v]) => (
                  <div key={k}><dt className="font-semibold">{k}</dt><dd className="text-muted-foreground whitespace-pre-wrap">{v}</dd></div>
                ))}
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}
