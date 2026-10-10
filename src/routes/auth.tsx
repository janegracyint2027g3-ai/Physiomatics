import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Team sign in — Physiomatics" },
      { name: "description", content: "Sign in to the Physiomatics team area to manage enquiries." },
      { property: "og:title", content: "Physiomatics team sign in" },
      { property: "og:description", content: "Private area for the Physiomatics team." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email")), password = String(f.get("password"));
    setBusy(true);
    const { error } = mode === "in"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/inbox` } });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    if (mode === "up") { toast.success("Check your email to confirm your account, then sign in."); return; }
    navigate({ to: "/inbox" });
  };

  return (
    <section className="container-page grid min-h-[70vh] place-items-center py-16">
      <form onSubmit={onSubmit} className="grid w-full max-w-sm gap-4 rounded-3xl border bg-card p-8 shadow-soft">
        <h1 className="text-3xl">{mode === "in" ? "Team sign in" : "Create team account"}</h1>
        <p className="text-sm text-muted-foreground">Private area for viewing enquiries.</p>
        <div className="grid gap-1.5"><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" required className="h-11 rounded-xl" /></div>
        <div className="grid gap-1.5"><Label htmlFor="password">Password</Label><Input id="password" name="password" type="password" minLength={8} required className="h-11 rounded-xl" /></div>
        <Button type="submit" disabled={busy}>{mode === "in" ? "Sign in" : "Create account"}</Button>
        <button type="button" className="text-sm text-primary" onClick={() => setMode(mode === "in" ? "up" : "in")}>
          {mode === "in" ? "No account yet? Create one" : "Have an account? Sign in"}
        </button>
      </form>
    </section>
  );
}
