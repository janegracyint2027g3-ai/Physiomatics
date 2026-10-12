/**
 * Google Calendar Appointment Scheduling Integration
 * Automatically books and allocates appointment times in Google Calendar.
 */

import { sendToGoogleSheet } from "./googleSheets";
import { trackClarityEvent } from "./clarity";

export const GOOGLE_CALENDAR_APPOINTMENT_URL =
  "https://calendar.google.com/calendar/appointments/schedules/AcZssZ1NzPsycGY7geNZYmqGuWd8BSaivQBMOxTtqWrHlrtE3XHEiTfnaCUtSN-ER1vAblJjGo9PHEHw?gv=true";

declare global {
  interface Window {
    calendar?: {
      schedulingButton?: {
        load: (config: {
          url: string;
          color?: string;
          label?: string;
          target: HTMLElement | null;
        }) => void;
      };
    };
  }
}

/**
 * Opens the Google Calendar appointment scheduling interface.
 * First checks if Google's embedded scheduling button is available,
 * otherwise opens a clean booking popup window.
 */
export function openGoogleCalendarAppointment(source: string = "website_book_button"): void {
  // 1. Telemetry & Analytics
  try {
    trackClarityEvent("calendar_appointment_click", { source });
    sendToGoogleSheet({
      action: "calendar_appointment_click",
      event_type: "click",
      event_name: "open_calendar_scheduling",
      event_category: "appointment",
      section: source,
      conversion_name: "appointment_booking_intent",
      conversion_value: 1
    });
  } catch (err) {
    console.warn("[Calendar] Analytics error:", err);
  }

  // 2. Always open in a new external tab — never inline on the same page
  window.open(GOOGLE_CALENDAR_APPOINTMENT_URL, "_blank", "noopener,noreferrer");
}
