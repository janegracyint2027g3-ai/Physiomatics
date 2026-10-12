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

  // 2. Look for any existing mounted Google scheduling button and click it to open the native modal
  const nativeBtn = document.querySelector<HTMLButtonElement>(
    ".calendar-scheduling-button, [data-calendar-scheduling-target] button, .calendar-scheduling-button-target button"
  );
  if (nativeBtn) {
    nativeBtn.click();
    return;
  }

  // 3. Fallback: Open Google Calendar Appointment Scheduling in a centered popup window
  const width = 720;
  const height = 820;
  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2;

  const popup = window.open(
    GOOGLE_CALENDAR_APPOINTMENT_URL,
    "GoogleCalendarAppointmentScheduling",
    `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,resizable=yes`
  );

  if (!popup || popup.closed || typeof popup.closed === "undefined") {
    // Popup was blocked by browser, open in new tab
    window.open(GOOGLE_CALENDAR_APPOINTMENT_URL, "_blank", "noopener,noreferrer");
  }
}
