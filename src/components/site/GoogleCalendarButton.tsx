import { useEffect, useRef, useState } from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Calendar, CalendarCheck } from "lucide-react";
import { GOOGLE_CALENDAR_APPOINTMENT_URL, openGoogleCalendarAppointment } from "@/lib/calendar";

interface GoogleCalendarButtonProps {
  label?: string;
  color?: string;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  className?: string;
  source?: string;
  showIcon?: boolean;
  useNativeGoogleWidget?: boolean;
}

export function GoogleCalendarButton({
  label = "Book an appointment",
  color = "#039BE5",
  variant = "hero",
  size = "lg",
  className = "",
  source = "page_booking",
  showIcon = true,
  useNativeGoogleWidget = false,
}: GoogleCalendarButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [nativeLoaded, setNativeLoaded] = useState(false);

  useEffect(() => {
    if (!useNativeGoogleWidget) return;

    let mounted = true;
    const initWidget = () => {
      if (
        containerRef.current &&
        typeof window !== "undefined" &&
        window.calendar?.schedulingButton?.load
      ) {
        // Clear previous buttons if re-mounting
        containerRef.current.innerHTML = "";
        try {
          window.calendar.schedulingButton.load({
            url: GOOGLE_CALENDAR_APPOINTMENT_URL,
            color: color,
            label: label,
            target: containerRef.current,
          });
          if (mounted) setNativeLoaded(true);
        } catch (err) {
          console.warn("[Calendar] Failed to load native scheduling button:", err);
        }
      }
    };

    // Try immediately if already loaded
    if (typeof window !== "undefined" && window.calendar?.schedulingButton?.load) {
      initWidget();
    } else {
      // Poll briefly for the script to load
      const interval = setInterval(() => {
        if (typeof window !== "undefined" && window.calendar?.schedulingButton?.load) {
          initWidget();
          clearInterval(interval);
        }
      }, 200);

      const timeout = setTimeout(() => clearInterval(interval), 4000);
      return () => {
        mounted = false;
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }

    return () => {
      mounted = false;
    };
  }, [useNativeGoogleWidget, color, label]);

  if (useNativeGoogleWidget) {
    return (
      <div className="inline-block" data-calendar-scheduling-target>
        <div ref={containerRef} className="calendar-scheduling-button-target" />
        {!nativeLoaded && (
          <Button
            variant={variant}
            size={size}
            className={className}
            onClick={() => openGoogleCalendarAppointment(source)}
          >
            {showIcon && <Calendar className="mr-2 size-4" />}
            {label}
          </Button>
        )}
      </div>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={() => openGoogleCalendarAppointment(source)}
    >
      {showIcon && <CalendarCheck className="mr-2 size-4" />}
      {label}
    </Button>
  );
}
