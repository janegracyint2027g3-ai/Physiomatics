import { Button, type ButtonProps } from "@/components/ui/button";
import { CalendarCheck } from "lucide-react";
import { openGoogleCalendarAppointment } from "@/lib/calendar";

interface GoogleCalendarButtonProps {
  label?: string;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  className?: string;
  source?: string;
  showIcon?: boolean;
  /** @deprecated — kept for backward compat, no longer used */
  useNativeGoogleWidget?: boolean;
  /** @deprecated — kept for backward compat, no longer used */
  color?: string;
}

/**
 * A button that opens the Google Calendar Appointment Scheduling page
 * in a new external browser tab when clicked.
 */
export function GoogleCalendarButton({
  label = "Book an appointment",
  variant = "hero",
  size = "lg",
  className = "",
  source = "page_booking",
  showIcon = true,
}: GoogleCalendarButtonProps) {
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
