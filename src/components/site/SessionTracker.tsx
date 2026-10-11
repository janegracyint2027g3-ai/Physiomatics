import { useEffect } from "react";
import { toast } from "sonner";

export function SessionTracker() {
  useEffect(() => {
    const visitsStr = localStorage.getItem("physiomatics_visit_count");
    const lastVisit = localStorage.getItem("physiomatics_last_visit");
    const now = new Date().getTime();
    
    let visits = parseInt(visitsStr || "0");
    
    // Treat as a new visit if it's been more than 30 minutes (1800000 ms)
    // or if it's their first time
    if (!lastVisit || now - parseInt(lastVisit) > 1800000) {
      visits += 1;
      localStorage.setItem("physiomatics_visit_count", visits.toString());
      
      if (visits > 1) {
        setTimeout(() => {
          toast(`Welcome back!`, {
            description: `This is your #${visits} visit to Physiomatics. Ready to pick up where you left off?`,
            duration: 5000,
          });
        }, 1500);
      } else {
        setTimeout(() => {
          toast("Welcome to Physiomatics!", {
            description: "Explore AI-assisted physiotherapy training.",
            duration: 5000,
          });
        }, 1500);
      }
    }

    localStorage.setItem("physiomatics_last_visit", now.toString());

  }, []);

  return null;
}
