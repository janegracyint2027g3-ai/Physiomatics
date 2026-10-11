import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { useState } from "react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/feedback")({
  head: () => ({
    meta: [
      { title: "Submit Feedback — Physiomatics" },
      { name: "description", content: "Share your experience with Physiomatics. Help us improve usability, accessibility, and the exercise recording process." },
      { property: "og:title", content: "Submit Feedback" },
    ],
  }),
  component: FeedbackPage,
});

import { sendToGoogleSheet } from "@/lib/googleSheets";
import { supabase } from "@/integrations/supabase/client";

function FeedbackPage() {
  const [feedback, setFeedback] = useState("");
  const [category, setCategory] = useState("general");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    setIsSubmitting(true);
    
    // 1. Sync to Google Sheet
    sendToGoogleSheet({
      action: "user_feedback",
      form_type: "feedback",
      form_name: "feedback",
      form_status: "submitted",
      category,
      message: feedback.trim(),
    }).catch((err) => console.error("Google Sheets feedback sync error:", err));

    // 2. Sync to Supabase feedback table if available
    try {
      await supabase.from("feedback").insert({
        category,
        message: feedback.trim(),
      } as any);
    } catch (e) {
      // ignore table if RLS or schema doesn't exist
    }

    setIsSubmitting(false);
    setFeedback("");
    toast.success("Feedback submitted", {
      description: "Thank you for sharing your thoughts with us!",
    });
  };

  return (
    <>
      <PageHero eyebrow="Feedback" title="Help us improve">
        We value your feedback on usability, accessibility, exercise recording, and the general product experience.
      </PageHero>
      <div className="container-page py-16">
        <div className="mx-auto max-w-xl rounded-3xl border bg-card p-8 shadow-soft">
          <form onSubmit={handleSubmit} className="grid gap-6">
            
            <div className="grid gap-2">
              <label htmlFor="category" className="text-sm font-medium">Feedback Category</label>
              <select 
                id="category" 
                className="h-11 rounded-xl border bg-background px-3"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="usability">Usability & Accessibility</option>
                <option value="recording">Video Recording</option>
                <option value="analysis">Movement Analysis Accuracy</option>
                <option value="general">General Experience</option>
              </select>
            </div>

            <div className="grid gap-2">
              <label htmlFor="feedback" className="text-sm font-medium">Your thoughts</label>
              <Textarea
                id="feedback"
                placeholder="Tell us what's working well and what we can do better..."
                className="min-h-[150px] rounded-xl bg-background"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                required
              />
            </div>
            
            <p className="text-xs text-muted-foreground border-l-2 border-coral pl-3">
              <strong>Privacy Notice:</strong> Please do not submit private patient information, personal medical records, or sensitive health data in this form.
            </p>

            <Button type="submit" disabled={isSubmitting} size="lg" variant="hero">
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
