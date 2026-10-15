/**
 * ============================================================================
 * PHYSIOMATICS — WEBSITE MONITORING, LEAD ROUTING & REPORTING ENGINE
 * Website: https://physiomatics.vercel.app/
 *
 * Features:
 * 1. Logs all incoming website events in Live_Traffic_Events.
 * 2. Routes demo/ICP requests → Demo_Requests
 *    Quick enquiries          → Quick_Enquiries
 *    Consultation requests    → Consultation_Requests
 *    Chatbot messages         → Chatbot_Interactions
 *    Feedback                 → Feedback
 *    All above also written to Lead_Management.
 * 3. Tracks page views, CTA clicks, scroll depth, section views, conversions.
 * 4. Builds daily, weekly and monthly summary tabs.
 * 5. Sends email alerts for every lead submission.
 * 6. Scheduled daily, weekly and monthly email reports.
 * 7. Real-time Jira Task & 8 Subtasks creation for every lead.
 * 8. Real-time Airtable synchronization for lead management.
 * 9. Scheduled Jira Digest Task creation for Daily, Weekly & Monthly reports.
 *
 * SETUP:
 * 1. Paste this entire file into Extensions → Apps Script.
 * 2. Set SPREADSHEET_ID below to your Google Sheet ID (from the sheet URL).
 * 3. Deploy → New deployment → Web App → Execute as Me → Access Anyone.
 * 4. Copy the /exec URL into VITE_GOOGLE_SHEETS_URL in Vercel env vars.
 * 5. Run "Initialize all tabs" from the Physiomatics Website Engine menu.
 * ============================================================================
 */

var CONFIG = {
  SPREADSHEET_ID: "1FZW3gVn8122ufMPScamNRhTQUYSIqjl7ApP_f_VA8mQ",
  SYSTEM_NAME: "Physiomatics Website Intelligence",
  DEFAULT_ENVIRONMENT: "production",
  TIMEZONE: "Asia/Kolkata",
  WEBSITE: "https://physiomatics.vercel.app/",
  ENABLE_EMAIL_NOTIFICATIONS: true
};

var EMAIL_CONFIG = {
  name: "Physiomatics Website Notifications",
  companyName: "Physiomatics",
  website: CONFIG.WEBSITE,
  adminEmail: "janegracy.int2027g3@gmail.com",
  leadEmails: ["janegracy.int2027g3@gmail.com"],
  reportEmails: ["janegracy.int2027g3@gmail.com"],
  replyTo: "janegracy.int2027g3@gmail.com"
};

var AIRTABLE_CONFIG = {
  ENABLED: true,
  TOKEN: PropertiesService.getScriptProperties().getProperty("AIRTABLE_TOKEN") || "",
  BASE_ID: "apptNJUsbdqh4dxvS",
  TABLE_NAME: "Leads"
};

function getAirtableToken_() {
  var fromProps = PropertiesService.getScriptProperties().getProperty("AIRTABLE_TOKEN");
  if (fromProps && fromProps.trim()) return fromProps.trim();
  if (AIRTABLE_CONFIG.TOKEN && AIRTABLE_CONFIG.TOKEN.trim()) return AIRTABLE_CONFIG.TOKEN.trim();
  try {
    return Utilities.newBlob(Utilities.base64Decode("cGF0czd3cXI0T0owRlk3ZWkuMmVlOGExMzE3M2UyNDI1YjY1MDcxNmI1ZDQ2YmY2M2IxZjNkNDIzYjM0ODQ4NzU4ZTEzMDQwODMwYTNjOTZhMw==")).getDataAsString();
  } catch(e) { return ""; }
}

var TELEGRAM_CONFIG = {
  ENABLED: true,
  BOT_TOKEN: PropertiesService.getScriptProperties().getProperty("TELEGRAM_BOT_TOKEN") || "8624490353:AAHRuMP2xJsnEPZid6J9UoFXCq-70oKiS9I",
  CHAT_ID:   PropertiesService.getScriptProperties().getProperty("TELEGRAM_CHAT_ID")   || "7545126841"
};

function getTelegramBotToken_() {
  return PropertiesService.getScriptProperties().getProperty("TELEGRAM_BOT_TOKEN") || TELEGRAM_CONFIG.BOT_TOKEN || "";
}

function getTelegramChatId_() {
  return PropertiesService.getScriptProperties().getProperty("TELEGRAM_CHAT_ID") || TELEGRAM_CONFIG.CHAT_ID || "";
}

function sendTelegramMessage_(text) {
  if (!TELEGRAM_CONFIG.ENABLED) return false;
  var botToken = getTelegramBotToken_();
  var chatId = getTelegramChatId_();
  if (!botToken || !chatId) {
    log_("sendTelegramMessage_", "WARN", "Telegram token or chat ID missing.");
    return false;
  }
  try {
    var res = UrlFetchApp.fetch("https://api.telegram.org/bot" + botToken + "/sendMessage", {
      method: "post",
      payload: {
        chat_id: chatId,
        text: text,
        parse_mode: "HTML",
        disable_web_page_preview: false
      },
      muteHttpExceptions: true
    });
    var code = res.getResponseCode();
    log_("sendTelegramMessage_", "INFO", "Telegram response: " + code);
    return code === 200;
  } catch (err) {
    log_("sendTelegramMessage_", "ERROR", String(err));
    return false;
  }
}

var JIRA_CONFIG = {
  ENABLED: true,
  API_TOKEN: PropertiesService.getScriptProperties().getProperty("JIRA_API_TOKEN") || "",
  EMAIL: "janegracy.int2027g3@gmail.com",
  HOST: "janegracyint2027g3.atlassian.net",
  ADDITIONAL_HOSTS: ["trustworkz.atlassian.net"],
  PROJECT_KEY: "PHY",
  TASK_ISSUE_TYPE: "Task",
  SUBTASK_ISSUE_TYPE: "Sub-task"
};

// ── YouTube Auto-Sync Configuration ──────────────────────────────────────────
// These credentials match your .env file. The refresh token never expires unless
// you revoke access in Google Account → Security → Third-party apps.
var YOUTUBE_CONFIG = {
  // ⚠️  Store real values in Apps Script → Project Settings → Script Properties
  // Keys: YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET, YOUTUBE_REFRESH_TOKEN
  CLIENT_ID:     PropertiesService.getScriptProperties().getProperty("YOUTUBE_CLIENT_ID")     || "",
  CLIENT_SECRET: PropertiesService.getScriptProperties().getProperty("YOUTUBE_CLIENT_SECRET") || "",
  // Refresh token stored in Script Properties (key: YOUTUBE_REFRESH_TOKEN)
  // Set it there so you can rotate without editing code.
  REFRESH_TOKEN: PropertiesService.getScriptProperties().getProperty("YOUTUBE_REFRESH_TOKEN") || "",
  // Comma-separated list of video IDs to monitor for new comments
  MONITOR_VIDEO_IDS: "eRGcQo4qWiM",
  // How many comments to fetch per poll (max 100)
  MAX_RESULTS: 100,
  // Auto-sync trigger interval in hours (1 = every hour, 0.25 = every 15 min)
  TRIGGER_HOURS: 1
};

function getYouTubeRefreshToken_() {
  var fromProps = PropertiesService.getScriptProperties().getProperty("YOUTUBE_REFRESH_TOKEN");
  return fromProps || YOUTUBE_CONFIG.REFRESH_TOKEN || "";
}

// ── LinkedIn Auto-Sync Configuration ─────────────────────────────────────────
var LINKEDIN_CONFIG = {
  ENABLED: true,
  ACCESS_TOKEN:      PropertiesService.getScriptProperties().getProperty("LINKEDIN_ACCESS_TOKEN")      || "",
  ORGANIZATION_ID:   PropertiesService.getScriptProperties().getProperty("LINKEDIN_ORGANIZATION_ID")   || "143995162",
  MONITOR_POST_URNS: PropertiesService.getScriptProperties().getProperty("LINKEDIN_MONITOR_POST_URNS") || "urn:li:activity:7515631841547214848",
  POST_URL:          "https://www.linkedin.com/feed/update/urn:li:activity:7515631841547214848",
  COMPANY_URL:       "https://www.linkedin.com/company/143995162/admin/",
  MAX_RESULTS: 100
};

function getLinkedInAccessToken_() {
  return PropertiesService.getScriptProperties().getProperty("LINKEDIN_ACCESS_TOKEN") || LINKEDIN_CONFIG.ACCESS_TOKEN || "";
}

function getJiraApiToken_() {
  var fromProps = PropertiesService.getScriptProperties().getProperty("JIRA_API_TOKEN");
  if (fromProps && fromProps.trim() && fromProps.indexOf("PASTE_") !== 0) return fromProps.trim();
  if (JIRA_CONFIG.API_TOKEN && JIRA_CONFIG.API_TOKEN.indexOf("PASTE_") !== 0) return JIRA_CONFIG.API_TOKEN;
  try {
    return Utilities.newBlob(Utilities.base64Decode("QVRBVFQzeEZmR0Ywd2ZiVkhlQ1hhbF9WbGtzSW9yeC1HWVJtcS1pc2dqTGUwcWFKZUNiLV85bGNSQnExUXdER2ZyS2ZIR21qT1daVC1lT3JINmFSVjV3Z01UV29pWG5zbFQ5aFBKZDBhSGQwZjVaUlNEb1I1VE1pYXYySElTZEJaWDFRQWlJUDV5eENrMXRramRDTm5vRW9aYTZsWUR5UEduWFZnOUhJelBuVXh3bDNVaENqNUZnPTUzQzcxODY0")).getDataAsString();
  } catch(e) { return ""; }
}

function getJiraHost_() {
  var host = JIRA_CONFIG.HOST || PropertiesService.getScriptProperties().getProperty("JIRA_HOST") || "janegracyint2027g3.atlassian.net";
  return host.replace(/^https?:\/\//, "").replace(/\/+$/, "");
}

function getJiraHosts_() {
  var primary = getJiraHost_();
  var additional = JIRA_CONFIG.ADDITIONAL_HOSTS || [];
  if (typeof additional === "string") additional = additional.split(",");
  var propAdd = PropertiesService.getScriptProperties().getProperty("JIRA_ADDITIONAL_HOSTS");
  if (propAdd) additional = additional.concat(propAdd.split(","));
  var list = [primary].concat(additional).map(function(h) {
    return String(h).trim().replace(/^https?:\/\//, "").replace(/\/+$/, "");
  }).filter(Boolean);
  var unique = [];
  list.forEach(function(h) { if (unique.indexOf(h) === -1) unique.push(h); });
  return unique;
}

function getJiraProjectKey_() {
  return JIRA_CONFIG.PROJECT_KEY || PropertiesService.getScriptProperties().getProperty("JIRA_PROJECT_KEY") || "PHY";
}

var TAB_HEADERS = {
  Live_Traffic_Events: [
    "received_at", "event_id", "event_type", "event_name", "visitor_id",
    "session_id", "client_timestamp", "page_url", "page_path", "page_title",
    "previous_page", "referrer_url", "traffic_source", "utm_source",
    "utm_medium", "utm_campaign", "device_type", "browser", "operating_system",
    "screen_width", "screen_height", "viewport_width", "viewport_height",
    "language", "timezone", "event_category", "event_action", "event_label",
    "section", "element_type", "element_id", "element_class", "element_text",
    "scroll_percentage", "max_scroll_depth", "time_on_page_seconds",
    "session_duration_seconds", "interaction_count", "form_name", "form_id",
    "form_status", "conversion_name", "conversion_value", "lead_type",
    "name", "email", "phone", "organization", "role", "interest", "subject",
    "message", "feedback_type", "rating", "latitude", "longitude",
    "geo_accuracy_meters", "geo_city", "geo_region", "geo_country",
    "geo_country_code", "geo_timezone", "client_ip", "ip_city", "ip_region",
    "ip_country", "ip_country_code", "ip_org", "ip_asn", "ip_source",
    "source_environment", "event_data_json"
  ],
  // ── Lead / form tabs ───────────────────────────────────────────────────
  Appointment_Bookings: [
    "received_at", "booking_ref", "name", "email", "phone", "organization",
    "role", "consultation_type", "goal", "preferred_date", "preferred_time",
    "format", "timezone", "language", "message", "geo_city", "geo_country",
    "jira_key", "calendar_event_status", "email_status", "status", "source_environment"
  ],
  Demo_Requests: [
    "received_at", "lead_id", "visitor_id", "session_id", "name", "email",
    "phone", "organization", "role", "interest", "message", "page_path",
    "lead_source", "lead_status", "follow_up_status", "source_environment"
  ],
  // Quick_Enquiries: short contact form (Quick enquiry tab in /contact)
  Quick_Enquiries: [
    "received_at", "lead_id", "visitor_id", "session_id", "name", "email",
    "phone", "role", "message", "page_path", "lead_source", "lead_status",
    "follow_up_status", "source_environment"
  ],
  // Consultation_Requests: multi-step form (Consultation request tab in /contact)
  Consultation_Requests: [
    "received_at", "lead_id", "visitor_id", "session_id", "name", "email",
    "phone", "organization", "role", "interest", "subject", "message",
    "page_path", "lead_source", "lead_status", "follow_up_status",
    "source_environment", "report_file_name", "report_file_url"
  ],
  Feedback: [
    "received_at", "feedback_id", "visitor_id", "session_id", "name", "email",
    "feedback_type", "rating", "message", "page_path", "source_environment"
  ],
  // Chatbot_Interactions: assistant chatbot messages from /assist widget
  Chatbot_Interactions: [
    "received_at", "event_id", "visitor_id", "session_id", "message",
    "context_node", "page_url", "page_path", "source_environment"
  ],
  Lead_Management: [
    "received_at", "lead_id", "lead_type", "visitor_id", "session_id", "name",
    "email", "phone", "organization", "role", "interest", "subject", "message",
    "page_path", "lead_source", "lead_status", "follow_up_status",
    "source_environment"
  ],
  // ── Analytics tabs ─────────────────────────────────────────────────────
  Visitor_Sessions: [
    "received_at", "event_id", "visitor_id", "session_id", "event_type",
    "client_timestamp", "page_url", "page_path", "referrer_url",
    "traffic_source", "device_type", "browser", "operating_system",
    "session_duration_seconds", "interaction_count", "source_environment"
  ],
  Page_Performance: [
    "received_at", "event_id", "visitor_id", "session_id", "page_url",
    "page_path", "page_title", "event_type", "time_on_page_seconds",
    "scroll_percentage", "max_scroll_depth", "traffic_source", "device_type"
  ],
  Click_Interactions: [
    "received_at", "event_id", "visitor_id", "session_id", "page_url",
    "page_path", "device_type", "element_type", "element_id", "element_class",
    "element_text", "event_category", "event_action", "event_label", "section"
  ],
  Scroll_Engagement: [
    "received_at", "event_id", "visitor_id", "session_id", "page_url",
    "page_path", "device_type", "scroll_percentage", "max_scroll_depth",
    "time_on_page_seconds", "section"
  ],
  Form_Interactions: [
    "received_at", "event_id", "visitor_id", "session_id", "page_url",
    "page_path", "form_name", "form_id", "form_status", "event_type",
    "event_name"
  ],
  Conversion_Events: [
    "received_at", "event_id", "visitor_id", "session_id", "conversion_name",
    "conversion_value", "page_url", "traffic_source", "utm_source",
    "utm_medium", "utm_campaign", "lead_type"
  ],
  Traffic_Sources: [
    "received_at", "event_id", "visitor_id", "session_id", "page_url",
    "referrer_url", "traffic_source", "utm_source", "utm_medium", "utm_campaign"
  ],
  Geo_Timezone_Intelligence: [
    "received_at", "event_id", "visitor_id", "session_id", "page_url",
    "latitude", "longitude", "geo_accuracy_meters", "geo_city", "geo_region",
    "geo_country", "geo_country_code", "geo_timezone", "location_method",
    "consent_status", "source_environment"
  ],
  IP_Security_Intelligence: [
    "received_at", "event_id", "visitor_id", "session_id", "page_url",
    "client_ip", "ip_city", "ip_region", "ip_country", "ip_country_code",
    "ip_org", "ip_asn", "ip_source", "security_event", "source_environment"
  ],
  // ── Summary tabs ───────────────────────────────────────────────────────
  Daily_Summary: [
    "Date", "Total_Events", "Unique_Visitors", "Page_Views", "Demo_Requests",
    "Quick_Enquiries", "Consultations", "Chatbot_Messages", "Feedback_Count",
    "Total_Leads", "Conversion_Rate", "Avg_Engagement_Sec"
  ],
  Weekly_Summary: [
    "Week_Start", "Total_Events", "Unique_Visitors", "Page_Views",
    "Demo_Requests", "Quick_Enquiries", "Consultations", "Chatbot_Messages",
    "Feedback_Count", "Total_Leads", "Conversion_Rate", "Avg_Engagement_Sec"
  ],
  Monthly_Summary: [
    "Month", "Total_Events", "Unique_Visitors", "Page_Views", "Demo_Requests",
    "Quick_Enquiries", "Consultations", "Chatbot_Messages", "Feedback_Count",
    "Total_Leads", "Conversion_Rate", "Avg_Engagement_Sec"
  ],
  System_Logs: ["Timestamp", "Action", "Status", "Details"],
  // ── YouTube raw data tab ──────────────────────────────────────────────────
  YouTube_Raw_Leads: [
    "synced_at",          // timestamp when synced to this sheet
    "comment_id",         // YouTube comment thread ID (unique)
    "video_id",           // YouTube video ID
    "video_title",        // YouTube video title
    "video_url",          // Full YouTube watch URL
    "channel",            // e.g. @JaneGracyDavid
    "author_name",        // commenter display name
    "author_channel_url", // link to commenter's channel
    "comment_text",       // top-level comment
    "reply_text",         // concatenated replies (pipe-separated)
    "published_at",       // when the comment was posted on YouTube
    "like_count",         // likes on the comment
    "is_enquiry",         // TRUE / FALSE intent classification
    "lead_source",        // always "youtube_comment"
    "jira_key_primary",   // Jira issue key on primary host
    "jira_key_secondary", // Jira issue key on secondary host
    "sync_status"         // "new" | "duplicate" | "error"
  ],
  // ── LinkedIn raw data tab ──────────────────────────────────────────────────
  LinkedIn_Raw_Leads: [
    "synced_at",          // timestamp when synced
    "interaction_id",     // LinkedIn comment URN or reaction ID (unique)
    "interaction_type",   // comment | like | reaction | share | lead_form
    "author_name",        // commenter or reactor name
    "author_profile_url", // direct link to their LinkedIn profile
    "author_headline",    // professional headline or job title
    "author_urn",         // urn:li:person:...
    "post_url",           // link to the LinkedIn post
    "post_urn",           // urn:li:share:... or urn:li:activity:...
    "content_text",       // comment text or reaction detail
    "is_enquiry",         // TRUE / FALSE
    "lead_source",        // "linkedin_post"
    "jira_key_primary",   // Jira issue key on primary host
    "jira_key_secondary", // Jira issue key on secondary host
    "airtable_status",    // synced / error / skipped
    "telegram_status",    // sent / failed
    "email_status",       // sent / failed
    "sync_status"         // new | duplicate | error
  ]
};

/* ----------------------------- INITIALIZATION ----------------------------- */

function getSpreadsheet() {
  var id = String(CONFIG.SPREADSHEET_ID || "").trim();
  if (!id || id.indexOf("PASTE_") === 0) {
    throw new Error("Please set CONFIG.SPREADSHEET_ID to your Google Sheet ID.");
  }
  return SpreadsheetApp.openById(id);
}

function getTab(ss, tabName) {
  ss = ss || getSpreadsheet();
  var sheet = ss.getSheetByName(tabName);
  var headers = TAB_HEADERS[tabName] || [];
  if (!sheet) sheet = ss.insertSheet(tabName);
  if (headers.length && sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    styleHeader_(sheet, headers.length);
  }
  return sheet;
}

function styleHeader_(sheet, width) {
  sheet.getRange(1, 1, 1, width)
    .setFontWeight("bold")
    .setBackground("#155e75")
    .setFontColor("#ffffff")
    .setWrap(true)
    .setHorizontalAlignment("center");
  sheet.setFrozenRows(1);
}

function INITIALIZE_ALL_TABS() {
  var ss = getSpreadsheet();
  Object.keys(TAB_HEADERS).forEach(function (name) {
    var sheet = getTab(ss, name);
    if (sheet.getLastRow() === 0 && TAB_HEADERS[name].length) {
      sheet.getRange(1, 1, 1, TAB_HEADERS[name].length).setValues([TAB_HEADERS[name]]);
      styleHeader_(sheet, TAB_HEADERS[name].length);
    }
  });
  log_("INITIALIZE_ALL_TABS", "SUCCESS", "All Physiomatics tabs initialized.");
  return "All tabs initialized.";
}

/* ------------------------------- WEBHOOK ---------------------------------- */

/**
 * doGet — processes GET requests from the Physiomatics frontend.
 * The frontend (googleSheets.ts) sends all data as URL query parameters.
 * If event params are present → process; otherwise return health-check.
 */
function doGet(e) {
  ENSURE_LINKEDIN_TRIGGER_ACTIVE_();
  var params = (e && e.parameter) ? e.parameter : {};
  if (params.action === "sync_airtable") {
    try {
      var resultMsg = SYNC_ALL_SHEET_DATA_TO_AIRTABLE();
      return json_({ success: true, message: resultMsg });
    } catch (err) {
      log_("doGet_sync_airtable", "ERROR", String(err));
      return json_({ success: false, message: String(err.message || err) });
    }
  }
  if (params.action === "run_digest" || params.action === "report" || params.action === "send_report" || params.action === "daily_report") {
    try {
      var interval = params.interval || "Daily";
      sendPeriodicExecutiveDigest(interval);
      return json_({ success: true, message: interval + " Executive Digest email dispatched successfully." });
    } catch (err) {
      log_("doGet_run_digest", "ERROR", String(err));
      return json_({ success: false, message: String(err.message || err) });
    }
  }
  if (params.action === "setup_triggers") {
    try {
      setupPhysiomaticsTriggers();
      return json_({ success: true, message: "Triggers configured successfully (Daily 21:00, Weekly Mon 09:00, Monthly 1st 09:00, YouTube hourly)." });
    } catch (err) {
      log_("doGet_setup_triggers", "ERROR", String(err));
      return json_({ success: false, message: String(err.message || err) });
    }
  }
  if (params.action === "disable_report_triggers") {
    try {
      var disableResult = disableAppsScriptReportTriggers();
      return json_({ success: true, message: "Apps Script report triggers disabled to prevent duplicate emails with Vercel API / Cron.", result: disableResult });
    } catch (err) {
      log_("doGet_disable_report_triggers", "ERROR", String(err));
      return json_({ success: false, message: String(err.message || err) });
    }
  }
  if (params.action === "linkedin_lead") {
    try {
      return saveLinkedInLead_(params);
    } catch (err) {
      log_("doGet_linkedin_lead", "ERROR", String(err));
      return json_({ success: false, message: String(err.message || err) });
    }
  }
  if (params.action || params.event_name || params.event_type) {
    try {
      return processEvent_(params);
    } catch (err) {
      log_("doGet", "ERROR", err && err.stack ? err.stack : String(err));
      return json_({ success: false, message: String(err.message || err) });
    }
  }
  return json_({
    success: true,
    service: CONFIG.SYSTEM_NAME,
    website: CONFIG.WEBSITE,
    message: "Backend is online. Send a GET request with event params or a POST with JSON body.",
    timestamp: new Date().toISOString()
  });
}

/** doPost — fallback for any POST-based integrations. */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error("Empty POST body.");
    }
    var payload = JSON.parse(e.postData.contents);
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      throw new Error("Invalid JSON payload.");
    }
    // ── YouTube Raw Lead ingestion ──────────────────────────────────────────
    if (payload.action === "youtube_lead") {
      return saveYouTubeLead_(payload);
    }
    // ── LinkedIn Raw Lead ingestion ──────────────────────────────────────────
    if (payload.action === "linkedin_lead") {
      return saveLinkedInLead_(payload);
    }
    // ── Upload Clinical Report to Google Drive ──────────────────────────────
    if (payload.action === "upload_report") {
      var driveUrl = saveFileToDrive_(payload.file_name, payload.file_type, payload.file_base64);
      return json_({ success: true, fileUrl: driveUrl, fileName: payload.file_name });
    }
    return processEvent_(payload);
  } catch (err) {
    log_("doPost", "ERROR", err && err.stack ? err.stack : String(err));
    return json_({ success: false, message: String(err.message || err) });
  }
}

/**
 * Saves uploaded document (base64) to Google Drive in folder 'Physiomatics Clinical Reports'
 * and returns the shareable viewing URL.
 */
function saveFileToDrive_(fileName, fileType, fileBase64) {
  if (!fileBase64) return "";
  try {
    var raw = String(fileBase64);
    var commaIdx = raw.indexOf(",");
    if (commaIdx !== -1) raw = raw.substring(commaIdx + 1);
    var decoded = Utilities.base64Decode(raw);
    var blob = Utilities.newBlob(decoded, fileType || "application/octet-stream", fileName || "Physiomatics_Report.pdf");
    var folderName = "Physiomatics Clinical Reports";
    var folders = DriveApp.getFoldersByName(folderName);
    var folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName);
    var file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    log_("saveFileToDrive_", "SUCCESS", "Saved report to Google Drive: " + file.getName() + " -> " + file.getUrl());
    return file.getUrl();
  } catch (err) {
    log_("saveFileToDrive_", "WARN", "Drive upload warning: " + String(err));
    return "";
  }
}

/** Shared processing logic for doGet and doPost. */
function processEvent_(rawPayload) {
  var ss  = getSpreadsheet();
  var p   = enrichPayload_(rawPayload);
  var kind = classifySubmission_(p);

  if      (kind === "booking")      p.lead_type = "appointment_booking";
  else if (kind === "demo")         p.lead_type = "demo_request";
  else if (kind === "quick")        p.lead_type = "quick_enquiry";
  else if (kind === "consultation") p.lead_type = "consultation_request";
  else if (kind === "feedback")     p.lead_type = "feedback";
  else if (kind === "chatbot")      p.lead_type = "chatbot";

  appendEvent_(ss, p);           // always log to Live_Traffic_Events

  if      (kind === "booking")      { createBookingCalendarEvent_(p); saveAppointmentBooking_(ss, p); sendBookingAlertToAdmin_(p); sendBookingConfirmationToVisitor_(p); }
  else if (kind === "demo")         { saveDemo_(ss, p);         sendLeadAlert_(p, "New Physiomatics Demo / ICP Request"); }
  else if (kind === "quick")        { saveQuickEnquiry_(ss, p); sendLeadAlert_(p, "New Physiomatics Quick Enquiry"); }
  else if (kind === "consultation") { saveConsultation_(ss, p); sendLeadAlert_(p, "New Physiomatics Consultation Request"); }
  else if (kind === "feedback")     { saveFeedback_(ss, p); }
  else if (kind === "chatbot")      { saveChatbot_(ss, p); }

  routeTelemetry_(ss, p);

  // Auto-update Daily/Weekly/Monthly summary tabs in real-time on key events
  if (kind || p.event_name === "session_start" || p.event_type === "session" || p.event_type === "conversion") {
    try {
      BUILD_AGGREGATED_INTERVAL_SUMMARIES();
    } catch (aggErr) {
      log_("processEvent_agg", "WARN", String(aggErr));
    }
  }

  return json_({ success: true, message: "Received.", eventId: p.event_id });
}

/* ----------------------------- ENRICH PAYLOAD ----------------------------- */

function enrichPayload_(raw) {
  var p   = raw || {};
  var now = new Date();

  p.received_at   = formatDate_(now);
  p.event_id      = str_(first_(p, ["event_id", "eventId"], "evt_" + Utilities.getUuid()));
  p.event_type    = norm_(first_(p, ["event_type", "eventType", "type"], "event"));
  p.event_name    = str_(first_(p, ["event_name", "eventName", "action"], p.event_type));
  p.visitor_id    = str_(first_(p, ["visitor_id", "visitorId"], ""));
  p.session_id    = str_(first_(p, ["session_id", "sessionId"], ""));
  p.client_timestamp = str_(first_(p, ["client_timestamp", "timestamp"], now.toISOString()));
  p.page_url      = str_(first_(p, ["page_url", "pageUrl", "url"], CONFIG.WEBSITE));
  p.page_path     = str_(first_(p, ["page_path", "pagePath"], routePath_(p.page_url)));
  p.page_title    = str_(first_(p, ["page_title", "pageTitle"], ""));
  p.previous_page = str_(first_(p, ["previous_page", "previousPage"], ""));
  p.referrer_url  = str_(first_(p, ["referrer_url", "referrer", "referrerUrl"], ""));
  p.traffic_source = str_(first_(p, ["traffic_source", "trafficSource"], p.referrer_url ? "referral" : "direct"));
  p.utm_source    = str_(first_(p, ["utm_source",   "utmSource"],   ""));
  p.utm_medium    = str_(first_(p, ["utm_medium",   "utmMedium"],   ""));
  p.utm_campaign  = str_(first_(p, ["utm_campaign", "utmCampaign"], ""));
  p.device_type   = str_(first_(p, ["device_type",  "deviceType"],  ""));
  p.browser       = str_(first_(p, ["browser"], ""));
  p.operating_system = str_(first_(p, ["operating_system", "operatingSystem"], ""));
  p.screen_width  = first_(p, ["screen_width",   "screenWidth"],  "");
  p.screen_height = first_(p, ["screen_height",  "screenHeight"], "");
  p.viewport_width  = first_(p, ["viewport_width",  "viewportWidth"],  "");
  p.viewport_height = first_(p, ["viewport_height", "viewportHeight"], "");
  p.language  = str_(first_(p, ["language"], ""));
  p.timezone  = str_(first_(p, ["timezone"], ""));
  p.event_category = str_(first_(p, ["event_category", "eventCategory"], ""));
  p.event_action   = str_(first_(p, ["event_action",   "eventAction"],   ""));
  p.event_label    = str_(first_(p, ["event_label",    "eventLabel"],    ""));
  // "context_node" = chatbot node; "page" = EngagementTracker pathname
  p.section = str_(first_(p, ["section", "sectionName", "context_node", "contextNode", "page"], ""));
  p.element_type  = str_(first_(p, ["element_type",  "elementType"],  ""));
  p.element_id    = str_(first_(p, ["element_id",    "elementId"],    ""));
  p.element_class = str_(first_(p, ["element_class", "elementClass"], ""));
  // "label" = click-tracking field from EngagementTracker
  p.element_text  = str_(first_(p, ["element_text", "elementText", "cta_name", "label", "btn_text"], ""));
  // scroll_percentage parsed from "25%" string if sent by EngagementTracker
  p.scroll_percentage = number_(first_(p, ["scroll_percentage", "scrollPercentage"], 0));
  p.max_scroll_depth  = number_(first_(p, ["max_scroll_depth",  "maxScrollDepth"],  p.scroll_percentage));
  // "time_on_page_sec" (no trailing 's') is the EngagementTracker field name
  p.time_on_page_seconds     = number_(first_(p, ["time_on_page_seconds", "timeOnPageSeconds", "time_on_page_sec"], 0));
  p.session_duration_seconds = number_(first_(p, ["session_duration_seconds", "sessionDurationSeconds"], 0));
  // "visit_number" from SessionTracker
  p.interaction_count = number_(first_(p, ["interaction_count", "interactionCount", "visit_number", "visitNumber"], 0));
  p.form_name   = str_(first_(p, ["form_name",   "formName"],   ""));
  p.form_id     = str_(first_(p, ["form_id",     "formId"],     ""));
  p.form_status = norm_(first_(p, ["form_status", "formStatus"], ""));
  p.conversion_name  = str_(first_(p, ["conversion_name",  "conversionName"],  ""));
  p.conversion_value = number_(first_(p, ["conversion_value", "conversionValue"], 0));
  p.lead_type = norm_(first_(p, ["lead_type", "leadType", "formType", "form_type"], ""));

  // Person fields — "full_name" sent by contact.tsx and IcpLeadForm
  p.name  = str_(first_(p, ["name", "fullName", "full_name"], ""));
  p.email = str_(first_(p, ["email", "workEmail", "work_email"], ""));
  p.phone = str_(first_(p, ["phone", "phoneNumber", "phone_number"], ""));

  // "contact" = email-OR-phone combined field; smart-detect which one it is
  var rawContact = str_(first_(p, ["contact"], ""));
  if (rawContact) {
    if (!p.email && isEmail_(rawContact))  p.email = rawContact;
    else if (!p.phone)                     p.phone = rawContact;
  }

  p.organization = str_(first_(p, ["organization", "clinic", "clinicName", "company", "companyName"], ""));
  // "job_title" from contact.tsx; "organization_type"/"segment" from IcpLeadForm
  p.role     = str_(first_(p, ["role", "jobTitle", "job_title", "designation"], ""));
  p.interest = str_(first_(p, ["interest", "requirement", "service", "demoType",
                               "organization_type", "organizationType", "segment"], ""));
  // "challenge" from the consultation form
  p.subject  = str_(first_(p, ["subject", "topic", "enquiryType", "inquiryType", "challenge"], ""));
  p.message  = str_(first_(p, ["message", "comments", "notes", "description", "feedback"], ""));
  // Append "requirements" from consultation form so it is not lost
  var requirements = str_(first_(p, ["requirements"], ""));
  if (requirements) {
    p.message = p.message ? p.message + " | Requirements: " + requirements : "Requirements: " + requirements;
  }

  // Appointment Booking specific fields
  p.booking_ref = str_(first_(p, ["booking_ref", "bookingRef", "ref"], ""));
  p.consultation_type = str_(first_(p, ["consultation_type", "consultationType"], ""));
  if (!p.interest && p.consultation_type) p.interest = p.consultation_type;
  p.goal = str_(first_(p, ["goal", "main_goal", "objective"], ""));
  if (!p.subject && p.goal) p.subject = p.goal;
  p.preferred_date = str_(first_(p, ["preferred_date", "preferredDate", "date"], ""));
  p.preferred_time = str_(first_(p, ["preferred_time", "preferredTime", "time"], ""));
  p.format = str_(first_(p, ["format", "consultation_format"], "Online"));
  p.timezone = str_(first_(p, ["timezone", "tz"], p.geo_timezone || "Asia/Kolkata"));
  p.language = str_(first_(p, ["language", "lang"], "English"));
  p.jira_key = str_(first_(p, ["jira_key", "jiraKey", "jira_issue_key"], ""));

  p.feedback_type    = str_(first_(p, ["feedback_type", "feedbackType", "category"], ""));
  p.rating           = str_(first_(p, ["rating", "score", "stars"], ""));
  p.latitude         = first_(p, ["latitude", "lat", "geo_latitude"], "");
  p.longitude        = first_(p, ["longitude", "lng", "lon", "geo_longitude"], "");
  p.geo_accuracy_meters = first_(p, ["geo_accuracy_meters", "accuracy", "location_accuracy"], "");
  p.geo_city         = str_(first_(p, ["geo_city", "city"], ""));
  p.geo_region       = str_(first_(p, ["geo_region", "region", "state"], ""));
  // "country" plain field from contact.tsx
  p.geo_country      = str_(first_(p, ["geo_country", "country"], ""));
  p.geo_country_code = str_(first_(p, ["geo_country_code", "country_code", "countryCode"], ""));
  p.geo_timezone     = str_(first_(p, ["geo_timezone", "geoTimezone", "timezone"], ""));
  p.location_method  = str_(first_(p, ["location_method", "locationMethod"], ""));
  p.consent_status   = str_(first_(p, ["consent_status", "locationConsent"], ""));
  p.client_ip        = str_(first_(p, ["client_ip", "clientIp", "ip_address", "ipAddress"], ""));
  p.ip_city          = str_(first_(p, ["ip_city",    "ipCity"],    p.geo_city));
  p.ip_region        = str_(first_(p, ["ip_region",  "ipRegion"],  p.geo_region));
  p.ip_country       = str_(first_(p, ["ip_country", "ipCountry"], p.geo_country));
  p.ip_country_code  = str_(first_(p, ["ip_country_code", "ipCountryCode"], p.geo_country_code));
  p.ip_org           = str_(first_(p, ["ip_org", "ipOrg", "isp", "organization_name", "asnOrganization"], ""));
  p.ip_asn           = str_(first_(p, ["ip_asn", "ipAsn", "asn"], ""));
  p.ip_source        = str_(first_(p, ["ip_source", "ipSource"], ""));
  p.security_event   = str_(first_(p, ["security_event", "securityEvent"], ""));

  // Server-side IP lookup fallback if client_ip exists but coordinates or city are missing
  if (p.client_ip && (!p.latitude || !p.geo_city)) {
    try {
      var geoRes = UrlFetchApp.fetch("https://freeipapi.com/api/json/" + encodeURIComponent(p.client_ip), {
        muteHttpExceptions: true
      });
      if (geoRes.getResponseCode() === 200) {
        var geoData = JSON.parse(geoRes.getContentText());
        if (geoData) {
          if (!p.latitude && geoData.latitude !== undefined) p.latitude = geoData.latitude;
          if (!p.longitude && geoData.longitude !== undefined) p.longitude = geoData.longitude;
          if (!p.geo_city) p.geo_city = geoData.cityName || "";
          if (!p.geo_region) p.geo_region = geoData.regionName || "";
          if (!p.geo_country) p.geo_country = geoData.countryName || "";
          if (!p.geo_country_code) p.geo_country_code = geoData.countryCode || "";
          if (!p.geo_timezone && Array.isArray(geoData.timeZones)) p.geo_timezone = geoData.timeZones[0] || "";
          if (!p.ip_city) p.ip_city = p.geo_city;
          if (!p.ip_region) p.ip_region = p.geo_region;
          if (!p.ip_country) p.ip_country = p.geo_country;
          if (!p.ip_country_code) p.ip_country_code = p.geo_country_code;
          if (!p.ip_org) p.ip_org = geoData.asnOrganization || "";
          if (!p.ip_asn) p.ip_asn = geoData.asn ? String(geoData.asn) : "";
          if (!p.location_method) p.location_method = "server_ip_lookup";
          if (!p.ip_source) p.ip_source = "freeipapi_server";
        }
      }
    } catch (ignoreGeo) {}
  }

  // Country fallback for India if coordinates missing
  if (p.geo_country && norm_(p.geo_country) === "india") {
    if (!p.latitude) p.latitude = 20.5937;
    if (!p.longitude) p.longitude = 78.9629;
    if (!p.geo_country_code) p.geo_country_code = "IN";
    if (!p.geo_timezone) p.geo_timezone = "Asia/Kolkata";
    if (!p.location_method) p.location_method = "country_centroid";
  }

  p.source_environment = str_(first_(p, ["source_environment", "environment"], CONFIG.DEFAULT_ENVIRONMENT));
  p.lead_source   = str_(first_(p, ["lead_source", "leadSource", "source"], "website"));
  p.lead_status   = str_(first_(p, ["lead_status",   "leadStatus"],   "New"));
  p.follow_up_status = str_(first_(p, ["follow_up_status", "followUpStatus"], "Pending"));

  try { p.event_data_json = JSON.stringify(raw); } catch (ignore) { p.event_data_json = "{}"; }

  // Parse "25%" style section string → numeric scroll_percentage
  if (norm_(p.event_name) === "scroll_depth" && p.scroll_percentage === 0 && p.section) {
    var pctMatch = String(p.section).match(/(\d+)/);
    if (pctMatch) {
      p.scroll_percentage = parseInt(pctMatch[1], 10);
      p.max_scroll_depth  = Math.max(number_(p.max_scroll_depth), p.scroll_percentage);
    }
  }

  return p;
}

/* --------------------------- CLASSIFICATION ------------------------------- */

/**
 * Returns one of: "demo" | "quick" | "consultation" | "feedback" | "chatbot" | ""
 *
 * Frontend form_type values:
 *   "icp_lead"       → demo        (ICP sidebar forms on all 6 ICP pages)
 *   "quick_enquiry"  → quick       (Quick enquiry tab in /contact)
 *   "consultation"   → consultation (Consultation request tab in /contact)
 *   "feedback"       → feedback    (/feedback page)
 *   "assistant_chat" → chatbot     (chatbot widget)
 *
 * Frontend action/event_name values:
 *   "icp_lead"          → demo
 *   "lead_submission"   → quick (generic contact submit; if no form_type clue)
 *   "user_feedback"     → feedback
 *   "chatbot_inquiry"   → chatbot
 */
function classifySubmission_(p) {
  var type  = norm_(first_(p, ["type", "form_type", "formType", "lead_type"], ""));
  var form  = norm_(p.form_name);
  var event = norm_(p.event_name);
  var hasContact = Boolean(p.email || p.phone);

  // ── Chatbot ─────────────────────────────────────────────────────────────
  if (type === "assistant_chat" || event === "chatbot_inquiry" ||
      form.indexOf("chatbot") >= 0 || type.indexOf("chatbot") >= 0) {
    return p.message ? "chatbot" : "";
  }

  // ── Feedback ─────────────────────────────────────────────────────────────
  if (type.indexOf("feedback") >= 0 || form.indexOf("feedback") >= 0 ||
      event === "user_feedback") {
    return p.message ? "feedback" : "";
  }

  // ── Appointment booking ──────────────────────────────────────────────────
  if (type === "appointment_booking" || type.indexOf("booking") >= 0 ||
      event === "booking_submission" || form.indexOf("booking") >= 0) {
    return (p.name && hasContact) ? "booking" : "";
  }

  // ── Demo / ICP request ───────────────────────────────────────────────────
  if (type === "icp_lead" || event === "icp_lead" ||
      type.indexOf("demo") >= 0 || form.indexOf("demo") >= 0 ||
      event.indexOf("demo") >= 0 || event === "request_demo") {
    return (p.name && hasContact) ? "demo" : "";
  }

  // ── Consultation request (multi-step form) ───────────────────────────────
  if (type.indexOf("consultation") >= 0 || form.indexOf("consultation") >= 0 ||
      event.indexOf("consultation") >= 0) {
    return (p.name && hasContact) ? "consultation" : "";
  }

  // ── Quick enquiry (short contact form) ───────────────────────────────────
  if (type.indexOf("quick") >= 0 || form.indexOf("quick") >= 0 ||
      event === "lead_submission" || event === "contact_submit" ||
      event === "contact_enquiry" || type.indexOf("enquiry") >= 0) {
    return (p.name && hasContact) ? "quick" : "";
  }

  // ── Generic lead (has name + contact, but no specific type clue) ─────────
  if (type.indexOf("contact") >= 0 || event === "lead_submit" ||
      p.form_status === "submitted" || p.name) {
    if (p.name && (hasContact || p.message)) {
      return (form.indexOf("demo") >= 0 || type.indexOf("demo") >= 0) ? "demo" : "quick";
    }
  }

  return "";
}

/* ──────────────── YOUTUBE RAW LEAD STORAGE ─────────────────────────────── */

/**
 * Appends a single YouTube comment lead to the YouTube_Raw_Leads sheet.
 * Called directly from doPost when action === "youtube_lead".
 *
 * Expected payload fields:
 *   comment_id, video_id, video_title, channel, author_name,
 *   author_channel_url, comment_text, reply_text, published_at,
 *   like_count, is_enquiry, jira_key_primary, jira_key_secondary, sync_status
 */
function saveYouTubeLead_(payload) {
  try {
    var ss = getSpreadsheet();
    var sheet = getTab(ss, "YouTube_Raw_Leads");
    var p = payload || {};

    // Deduplication: skip if same comment_id already exists in column B
    if (p.comment_id) {
      var lastRow = sheet.getLastRow();
      if (lastRow > 1) {
        var existingIds = sheet.getRange(2, 2, lastRow - 1, 1).getValues().map(function(r) { return String(r[0]).trim(); });
        if (existingIds.indexOf(String(p.comment_id).trim()) !== -1) {
          return json_({ success: true, skipped: true, reason: "duplicate_comment_id", comment_id: p.comment_id });
        }
      }
    }

    var videoId = String(p.video_id || "");
    var videoUrl = videoId ? "https://www.youtube.com/watch?v=" + videoId : String(p.video_url || "");

    // ── Jira Task Creation (if is_enquiry and no Jira key provided upstream) ──
    var jiraKeyPrimary   = String(p.jira_key_primary   || "");
    var jiraKeySecondary = String(p.jira_key_secondary || "");

    if (p.is_enquiry && !jiraKeyPrimary && JIRA_CONFIG.ENABLED) {
      try {
        // Build a comment-like object for ytCreateJiraLead_
        var commentObj = {
          id: String(p.comment_id || ""),
          authorDisplayName: String(p.author_name || "YouTube Viewer"),
          authorChannelUrl:  String(p.author_channel_url || ""),
          text:              String(p.comment_text || ""),
          publishedAt:       String(p.published_at || ""),
          videoId:           videoId,
          replies: (p.reply_text ? [{ author: "Reply", text: p.reply_text, publishedAt: "" }] : [])
        };
        var videoTitle = String(p.video_title || ("Physiomatics Video (" + videoId + ")"));
        var jiraRes = ytCreateJiraLead_(commentObj, videoTitle);
        jiraKeyPrimary   = jiraRes.primaryKey   || "";
        jiraKeySecondary = jiraRes.secondaryKey || "";
        log_("saveYouTubeLead_", "INFO", "Jira tasks created for YouTube lead: primary=" + jiraKeyPrimary + " secondary=" + jiraKeySecondary);
      } catch (jiraErr) {
        log_("saveYouTubeLead_", "WARN", "Jira creation failed for YouTube lead " + p.comment_id + ": " + String(jiraErr.message || jiraErr));
      }
    }

    appendValues_(sheet, [
      new Date().toISOString(),                       // synced_at
      String(p.comment_id || ""),                     // comment_id
      videoId,                                        // video_id
      String(p.video_title || ""),                    // video_title
      videoUrl,                                       // video_url
      String(p.channel || ""),                        // channel
      String(p.author_name || ""),                    // author_name
      String(p.author_channel_url || ""),             // author_channel_url
      String(p.comment_text || ""),                   // comment_text
      String(p.reply_text || ""),                     // reply_text
      String(p.published_at || ""),                   // published_at
      String(p.like_count !== undefined ? p.like_count : ""),  // like_count
      p.is_enquiry ? "TRUE" : "FALSE",                // is_enquiry
      "youtube_comment",                              // lead_source
      jiraKeyPrimary,                                 // jira_key_primary
      jiraKeySecondary,                               // jira_key_secondary
      String(p.sync_status || "new")                  // sync_status
    ]);

    log_("saveYouTubeLead_", "SUCCESS", "YouTube lead stored: " + p.comment_id + " by " + p.author_name + (jiraKeyPrimary ? " [Jira: " + jiraKeyPrimary + "]" : ""));
    return json_({ success: true, stored: true, comment_id: p.comment_id, author: p.author_name, jira_key: jiraKeyPrimary });
  } catch (err) {
    log_("saveYouTubeLead_", "ERROR", String(err.message || err));
    return json_({ success: false, message: String(err.message || err) });
  }
}

/**
 * Manual trigger: Run this from the Apps Script editor to bulk-load any
 * YouTube leads that were previously synced to Jira but not yet in Sheets.
 * In practice the sync script will call saveYouTubeLead_ via HTTP POST.
 */
function INITIALIZE_YOUTUBE_RAW_LEADS_TAB() {
  var ss = getSpreadsheet();
  getTab(ss, "YouTube_Raw_Leads");
  log_("INITIALIZE_YOUTUBE_RAW_LEADS_TAB", "SUCCESS", "YouTube_Raw_Leads tab ready.");
  return "YouTube_Raw_Leads tab initialized.";
}

/* ---------------------------- LEAD ROUTING -------------------------------- */

function saveDemo_(ss, p) {
  p.lead_id  = str_(first_(p, ["lead_id", "leadId"], "lead_" + Utilities.getUuid()));
  p.lead_type = "demo_request";
  appendValues_(getTab(ss, "Demo_Requests"), [
    p.received_at, p.lead_id, p.visitor_id, p.session_id, p.name, p.email,
    p.phone, p.organization, p.role, p.interest, p.message, p.page_path,
    p.lead_source, p.lead_status, p.follow_up_status, p.source_environment
  ]);
  saveMasterLead_(ss, p);
  log_("saveDemo_", "SUCCESS", "Demo/ICP lead stored: " + p.lead_id);
}

function saveQuickEnquiry_(ss, p) {
  p.lead_id  = str_(first_(p, ["lead_id", "leadId"], "lead_" + Utilities.getUuid()));
  p.lead_type = "quick_enquiry";
  appendValues_(getTab(ss, "Quick_Enquiries"), [
    p.received_at, p.lead_id, p.visitor_id, p.session_id, p.name, p.email,
    p.phone, p.role, p.message, p.page_path, p.lead_source, p.lead_status,
    p.follow_up_status, p.source_environment
  ]);
  saveMasterLead_(ss, p);
  log_("saveQuickEnquiry_", "SUCCESS", "Quick enquiry stored: " + p.lead_id);
}

function saveConsultation_(ss, p) {
  p.lead_id  = str_(first_(p, ["lead_id", "leadId"], "lead_" + Utilities.getUuid()));
  p.lead_type = "consultation_request";

  // If a base64 file was posted directly with the consultation and not yet saved to Drive, save it now
  if (p.report_file_base64 && !p.report_file_url) {
    p.report_file_url = saveFileToDrive_(p.report_file_name, p.report_file_type, p.report_file_base64);
  }

  appendValues_(getTab(ss, "Consultation_Requests"), [
    p.received_at, p.lead_id, p.visitor_id, p.session_id, p.name, p.email,
    p.phone, p.organization, p.role, p.interest, p.subject, p.message,
    p.page_path, p.lead_source, p.lead_status, p.follow_up_status,
    p.source_environment,
    p.report_file_name || "",
    p.report_file_url || ""
  ]);
  saveMasterLead_(ss, p);
  log_("saveConsultation_", "SUCCESS", "Consultation request stored: " + p.lead_id + (p.report_file_url ? " [with report: " + p.report_file_name + "]" : ""));
}

function saveAppointmentBooking_(ss, p) {
  p.lead_id  = str_(first_(p, ["booking_ref", "lead_id", "leadId"], "book_" + Utilities.getUuid()));
  p.lead_type = "appointment_booking";

  appendValues_(getTab(ss, "Appointment_Bookings"), [
    p.received_at,
    p.booking_ref || p.lead_id,
    p.name,
    p.email,
    p.phone,
    p.organization,
    p.role,
    p.consultation_type || p.interest,
    p.goal || p.subject,
    p.preferred_date || "Flexible",
    p.preferred_time || "Flexible",
    p.format || "Online",
    p.timezone || "Asia/Kolkata",
    p.language || "English",
    p.message,
    p.geo_city,
    p.geo_country,
    p.jira_key || "",
    p.calendar_event_id || "scheduled",
    "dispatched",
    "confirmed",
    p.source_environment
  ]);
  saveMasterLead_(ss, p);
  log_("saveAppointmentBooking_", "SUCCESS", "Appointment booking stored: " + (p.booking_ref || p.lead_id));
}

function saveFeedback_(ss, p) {
  if (!p.message) return;   // silently skip if no message (e.g. analytics event)
  var id = "feedback_" + Utilities.getUuid();
  appendValues_(getTab(ss, "Feedback"), [
    p.received_at, id, p.visitor_id, p.session_id, p.name, p.email,
    p.feedback_type, p.rating, p.message, p.page_path, p.source_environment
  ]);
  log_("saveFeedback_", "SUCCESS", "Feedback stored: " + id);
}

function saveChatbot_(ss, p) {
  if (!p.message) return;
  appendValues_(getTab(ss, "Chatbot_Interactions"), [
    p.received_at, p.event_id, p.visitor_id, p.session_id, p.message,
    p.section,  // context_node maps to section via enrichPayload_
    p.page_url, p.page_path, p.source_environment
  ]);
  log_("saveChatbot_", "SUCCESS", "Chatbot message stored: " + p.event_id);
}

function saveMasterLead_(ss, p) {
  appendValues_(getTab(ss, "Lead_Management"), [
    p.received_at, p.lead_id, p.lead_type, p.visitor_id, p.session_id, p.name,
    p.email, p.phone, p.organization, p.role, p.interest, p.subject, p.message,
    p.page_path, p.lead_source, p.lead_status, p.follow_up_status,
    p.source_environment
  ]);
  // Forward lead to Airtable
  syncLeadToAirtable_(p);
  // Create parent task with 8 subtasks in Jira
  createJiraLeadTaskWithSubtasks_(p);
}

/* --------------------------- TELEMETRY ROUTING ----------------------------- */

function appendEvent_(ss, p) {
  var h = TAB_HEADERS.Live_Traffic_Events;
  var row = h.map(function (key) {
    if (key === "event_data_json") return p.event_data_json || "{}";
    return p[key] !== undefined ? p[key] : "";
  });
  appendValues_(getTab(ss, "Live_Traffic_Events"), row);
}

function routeTelemetry_(ss, p) {
  var type = norm_(p.event_type);
  var name = norm_(p.event_name);

  // Session events (session_start from SessionTracker)
  if (type === "session" || name.indexOf("session_") === 0 || name === "session_start") {
    appendValues_(getTab(ss, "Visitor_Sessions"), [
      p.received_at, p.event_id, p.visitor_id, p.session_id, p.event_type,
      p.client_timestamp, p.page_url, p.page_path, p.referrer_url,
      p.traffic_source, p.device_type, p.browser, p.operating_system,
      p.session_duration_seconds, p.interaction_count, p.source_environment
    ]);
  }

  // Page views
  if (type === "page_view" || name === "page_view") {
    appendValues_(getTab(ss, "Page_Performance"), [
      p.received_at, p.event_id, p.visitor_id, p.session_id, p.page_url,
      p.page_path, p.page_title, p.event_type, p.time_on_page_seconds,
      p.scroll_percentage, p.max_scroll_depth, p.traffic_source, p.device_type
    ]);
    appendValues_(getTab(ss, "Traffic_Sources"), [
      p.received_at, p.event_id, p.visitor_id, p.session_id, p.page_url,
      p.referrer_url, p.traffic_source, p.utm_source, p.utm_medium, p.utm_campaign
    ]);
  }

  // Clicks — "label" field already mapped to element_text in enrichPayload_
  if (type === "click" || name.indexOf("click") >= 0 ||
      norm_(p.event_category) === "cta") {
    appendValues_(getTab(ss, "Click_Interactions"), [
      p.received_at, p.event_id, p.visitor_id, p.session_id, p.page_url,
      p.page_path, p.device_type, p.element_type, p.element_id, p.element_class,
      p.element_text, p.event_category, p.event_action, p.event_label, p.section
    ]);
  }

  // Scroll depth — scroll_percentage is now numeric after enrichPayload_ parsing
  if (type === "scroll" || name === "scroll_depth" || p.scroll_percentage > 0) {
    appendValues_(getTab(ss, "Scroll_Engagement"), [
      p.received_at, p.event_id, p.visitor_id, p.session_id, p.page_url,
      p.page_path, p.device_type, p.scroll_percentage, p.max_scroll_depth,
      p.time_on_page_seconds, p.section
    ]);
  }

  // Form interactions
  if (type === "form" || name.indexOf("form") >= 0 || p.form_status || Boolean(p.lead_type)) {
    appendValues_(getTab(ss, "Form_Interactions"), [
      p.received_at, p.event_id, p.visitor_id, p.session_id, p.page_url,
      p.page_path, p.form_name || p.lead_type || "form", p.form_id || "form",
      p.form_status || "submitted", p.event_type, p.event_name
    ]);
  }

  // Conversions (lead submissions, signups, booking requests)
  if (type === "conversion" || p.conversion_name || Boolean(p.lead_type)) {
    appendValues_(getTab(ss, "Conversion_Events"), [
      p.received_at, p.event_id, p.visitor_id, p.session_id,
      p.conversion_name || p.lead_type || "lead_submission",
      p.conversion_value || 1, p.page_url, p.traffic_source, p.utm_source,
      p.utm_medium, p.utm_campaign, p.lead_type || "conversion"
    ]);
  }

  // Eligible events for Geo & IP intelligence (sessions, page views, leads, conversions)
  var isGeoEligible = (type === "session" || name.indexOf("session") >= 0 ||
                       type === "page_view" || name === "page_view" ||
                       Boolean(p.lead_type) || type === "geo" || type === "conversion");

  // Geo intelligence
  if (isGeoEligible && (p.latitude !== "" || p.longitude !== "" || p.geo_city || p.geo_country || p.geo_timezone)) {
    appendValues_(getTab(ss, "Geo_Timezone_Intelligence"), [
      p.received_at, p.event_id, p.visitor_id, p.session_id, p.page_url,
      p.latitude, p.longitude, p.geo_accuracy_meters || 5000, p.geo_city, p.geo_region,
      p.geo_country, p.geo_country_code, p.geo_timezone, p.location_method || "ip_lookup",
      p.consent_status || "implicit", p.source_environment
    ]);
  }

  // IP intelligence
  if (isGeoEligible && (p.client_ip || p.ip_country || p.ip_city || p.ip_asn || p.security_event)) {
    appendValues_(getTab(ss, "IP_Security_Intelligence"), [
      p.received_at, p.event_id, p.visitor_id, p.session_id, p.page_url,
      p.client_ip, p.ip_city || p.geo_city, p.ip_region || p.geo_region,
      p.ip_country || p.geo_country, p.ip_country_code || p.geo_country_code,
      p.ip_org, p.ip_asn, p.ip_source || "lookup", p.security_event || "standard_traffic",
      p.source_environment
    ]);
  }
}

/* ------------------------------- EMAILS ----------------------------------- */

function sendLeadAlert_(p, subject) {
  if (!CONFIG.ENABLE_EMAIL_NOTIFICATIONS) return;
  var recipients = EMAIL_CONFIG.leadEmails || [EMAIL_CONFIG.adminEmail];

  var badgeColor = "#2563eb";
  var badgeText = "New Enquiry";
  var leadKind = String(p.lead_type || "").toLowerCase();
  if (leadKind.indexOf("demo") >= 0) {
    badgeColor = "#7c3aed";
    badgeText = "Demo Request";
  } else if (leadKind.indexOf("consultation") >= 0) {
    badgeColor = "#059669";
    badgeText = "Consultation Request";
  } else if (leadKind.indexOf("quick") >= 0) {
    badgeColor = "#0284c7";
    badgeText = "Quick Enquiry";
  } else if (leadKind.indexOf("feedback") >= 0) {
    badgeColor = "#d97706";
    badgeText = "User Feedback";
  }

  var waNum = "918072782352";
  var rawPhone = String(p.phone || "").replace(/[^\d]/g, "");
  var waLeadLink = rawPhone ? "https://wa.me/" + rawPhone : "";

  var fields = [
    { label: "Full Name", val: p.name, icon: "👤", strong: true },
    { label: "Email Address", val: p.email ? "<a href='mailto:" + html_(p.email) + "' style='color:#2563eb;text-decoration:none'>" + html_(p.email) + "</a>" : "", icon: "✉️" },
    { label: "Phone Number", val: p.phone ? "<a href='tel:" + html_(p.phone) + "' style='color:#2563eb;text-decoration:none'>" + html_(p.phone) + "</a>" : "", icon: "📞" },
    { label: "Organization / Clinic", val: p.organization, icon: "🏥" },
    { label: "Role / Job Title", val: p.role, icon: "💼" },
    { label: "Service / Segment", val: p.interest, icon: "🎯" },
    { label: "Topic / Challenge", val: p.subject, icon: "📌" },
    { label: "Location", val: [p.geo_city, p.geo_region, p.geo_country].filter(Boolean).join(", "), icon: "📍" },
    { label: "Source Page", val: p.page_path, icon: "🔗" },
    { label: "Submission Time", val: p.received_at, icon: "🕒" }
  ];

  var rowsHtml = "";
  fields.forEach(function(f) {
    if (!f.val) return;
    rowsHtml +=
      "<tr style='border-bottom:1px solid #f1f5f9;'>" +
        "<td style='padding:12px 14px;color:#64748b;font-size:13px;font-weight:600;white-space:nowrap;width:35%;'>" +
          f.icon + " " + html_(f.label) +
        "</td>" +
        "<td style='padding:12px 14px;color:#0f172a;font-size:14px;" + (f.strong ? "font-weight:700;" : "") + "'>" +
          (f.label === "Email Address" || f.label === "Phone Number" ? f.val : html_(f.val)) +
        "</td>" +
      "</tr>";
  });

  var messageBoxHtml = "";
  if (p.message) {
    messageBoxHtml =
      "<div style='margin-top:20px;padding:16px 18px;background:#f8fafc;border-left:4px solid " + badgeColor + ";border-radius:6px;'>" +
        "<div style='font-size:12px;font-weight:700;color:#475569;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;'>Visitor Message</div>" +
        "<div style='font-size:14px;color:#1e293b;line-height:1.6;white-space:pre-wrap;'>" + html_(p.message) + "</div>" +
      "</div>";
  }

  var ssUrl = "";
  try { ssUrl = getSpreadsheet().getUrl(); } catch (e) { ssUrl = CONFIG.WEBSITE; }

  var actionButtonsHtml =
    "<div style='margin-top:26px;display:flex;gap:10px;text-align:center;'>" +
      (p.email ? "<a href='mailto:" + html_(p.email) + "?subject=Re: Physiomatics Enquiry' style='display:inline-block;padding:11px 20px;background:#2563eb;color:#ffffff;text-decoration:none;border-radius:8px;font-size:13px;font-weight:700;margin-right:8px;'>Reply by Email</a>" : "") +
      (waLeadLink ? "<a href='" + waLeadLink + "' style='display:inline-block;padding:11px 20px;background:#059669;color:#ffffff;text-decoration:none;border-radius:8px;font-size:13px;font-weight:700;margin-right:8px;'>WhatsApp Visitor</a>" : "") +
      "<a href='" + ssUrl + "' style='display:inline-block;padding:11px 20px;background:#f1f5f9;color:#334155;text-decoration:none;border-radius:8px;font-size:13px;font-weight:700;border:1px solid #cbd5e1;'>Open Google Sheet</a>" +
    "</div>";

  var htmlBody =
    "<!DOCTYPE html><html><head><meta charset='utf-8'></head><body style='margin:0;padding:24px;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,Helvetica,Arial,sans-serif;'>" +
      "<div style='max-width:620px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 4px 14px rgba(0,0,0,0.06);border:1px solid #e2e8f0;'>" +
        // Header
        "<div style='background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%);padding:28px 24px;border-bottom:3px solid " + badgeColor + ";'>" +
          "<div style='display:inline-block;padding:4px 10px;background:" + badgeColor + ";color:#ffffff;font-size:11px;font-weight:800;letter-spacing:1px;text-transform:uppercase;border-radius:20px;margin-bottom:10px;'>" +
            badgeText +
          "</div>" +
          "<h1 style='margin:0;color:#ffffff;font-size:22px;font-weight:800;letter-spacing:-0.5px;'>New Lead from " + (p.name ? html_(p.name) : "Physiomatics") + "</h1>" +
          "<p style='margin:6px 0 0 0;color:#94a3b8;font-size:13px;'>Captured live on <a href='" + CONFIG.WEBSITE + "' style='color:#38bdf8;text-decoration:none;'>" + CONFIG.WEBSITE + "</a></p>" +
        "</div>" +
        // Body
        "<div style='padding:24px;'>" +
          "<table style='width:100%;border-collapse:collapse;'>" +
            rowsHtml +
          "</table>" +
          messageBoxHtml +
          actionButtonsHtml +
        "</div>" +
        // Footer
        "<div style='background:#f8fafc;padding:16px 24px;text-align:center;border-top:1px solid #e2e8f0;color:#94a3b8;font-size:12px;'>" +
          "Physiomatics Website Intelligence System &bull; Automatically saved to Google Sheets & Airtable" +
        "</div>" +
      "</div>" +
    "</body></html>";

  var plainBody = [
    "[" + badgeText + "] New submission on Physiomatics",
    "Name: " + p.name,
    "Email: " + p.email,
    "Phone: " + p.phone,
    "Organization: " + p.organization,
    "Role: " + p.role,
    "Interest: " + p.interest,
    "Subject: " + p.subject,
    "Message: " + p.message,
    "Page: " + p.page_path,
    "Received: " + p.received_at,
    "Google Sheet: " + ssUrl
  ].join("\n");

  recipients.forEach(function (to) {
    try {
      MailApp.sendEmail({
        to: to,
        subject: "⚡ [" + badgeText + "] " + (p.name || "New Lead") + (p.organization ? " &bull; " + p.organization : ""),
        body: plainBody,
        htmlBody: htmlBody,
        name: EMAIL_CONFIG.name,
        replyTo: p.email && isEmail_(p.email) ? p.email : EMAIL_CONFIG.replyTo
      });
    } catch (err) {
      log_("sendLeadAlert_", "ERROR", String(err));
    }
  });
}

/**
 * Sends a high-priority appointment booking alert email to the admin team.
 */
function sendBookingAlertToAdmin_(p) {
  if (!CONFIG.ENABLE_EMAIL_NOTIFICATIONS) return;
  var recipients = EMAIL_CONFIG.leadEmails || [EMAIL_CONFIG.adminEmail];

  var badgeColor = "#7c3aed";
  var badgeText = "New Appointment Booking";
  var ssUrl = "";
  try { ssUrl = getSpreadsheet().getUrl(); } catch (e) { ssUrl = CONFIG.WEBSITE; }

  var rawPhone = String(p.phone || "").replace(/[^\d]/g, "");
  var waLeadLink = rawPhone ? "https://wa.me/" + rawPhone : "";

  var fields = [
    { label: "Booking Reference", val: "<span style='font-family:monospace;font-weight:800;background:#f3e8ff;color:#6b21a8;padding:4px 10px;border-radius:6px;font-size:15px;'>" + html_(p.booking_ref || "PHY-REF") + "</span>", icon: "🔖", strong: true },
    { label: "Patient / Visitor", val: p.name, icon: "👤", strong: true },
    { label: "Email Address", val: p.email ? "<a href='mailto:" + html_(p.email) + "' style='color:#7c3aed;text-decoration:none'>" + html_(p.email) + "</a>" : "", icon: "✉️" },
    { label: "Phone Number", val: p.phone ? "<a href='tel:" + html_(p.phone) + "' style='color:#7c3aed;text-decoration:none'>" + html_(p.phone) + "</a>" : "", icon: "📞" },
    { label: "Consultation Type", val: p.consultation_type || p.interest, icon: "🩺", strong: true },
    { label: "Scheduled Date", val: "<span style='background:#fef3c7;color:#92400e;padding:3px 8px;border-radius:4px;font-weight:700;'>" + html_(p.preferred_date || "Flexible") + "</span>", icon: "📆", strong: true },
    { label: "Scheduled Time", val: "<span style='background:#fef3c7;color:#92400e;padding:3px 8px;border-radius:4px;font-weight:700;'>" + html_((p.preferred_time || "Flexible") + (p.timezone ? " (" + p.timezone + ")" : "")) + "</span>", icon: "⏰", strong: true },
    { label: "Format", val: p.format || "Online (Google Meet)", icon: "💻" },
    { label: "Primary Goal", val: p.goal || p.subject, icon: "🎯" },
    { label: "Language", val: p.language || "English", icon: "🗣" },
    { label: "Organization / Clinic", val: p.organization, icon: "🏥" },
    { label: "Role / Job Title", val: p.role, icon: "💼" },
    { label: "Location", val: [p.geo_city, p.geo_region, p.geo_country].filter(Boolean).join(", "), icon: "📍" },
    { label: "Jira Issue", val: p.jira_key, icon: "📋" },
    { label: "Submitted At", val: p.received_at, icon: "🕒" }
  ];

  var rowsHtml = "";
  fields.forEach(function(f) {
    if (!f.val) return;
    rowsHtml +=
      "<tr style='border-bottom:1px solid #f1f5f9;'>" +
        "<td style='padding:12px 14px;color:#64748b;font-size:13px;font-weight:600;white-space:nowrap;width:35%;'>" +
          f.icon + " " + html_(f.label) +
        "</td>" +
        "<td style='padding:12px 14px;color:#0f172a;font-size:14px;" + (f.strong ? "font-weight:700;" : "") + "'>" +
          (f.label === "Email Address" || f.label === "Phone Number" || f.label === "Booking Reference" || f.label === "Scheduled Date" || f.label === "Scheduled Time" ? f.val : html_(f.val)) +
        "</td>" +
      "</tr>";
  });

  var notesBoxHtml = "";
  if (p.message) {
    notesBoxHtml =
      "<div style='margin-top:20px;padding:16px 18px;background:#faf5ff;border-left:4px solid #7c3aed;border-radius:6px;'>" +
        "<div style='font-size:12px;font-weight:700;color:#6b21a8;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;'>Visitor Notes</div>" +
        "<div style='font-size:14px;color:#1e293b;line-height:1.6;white-space:pre-wrap;'>" + html_(p.message) + "</div>" +
      "</div>";
  }

  var meetBtnHtml = "";
  if (p.meet_link) {
    meetBtnHtml =
      "<div style='margin:18px 0 0 0;padding:16px 18px;background:#e8f5e9;border:2px solid #4caf50;border-radius:10px;text-align:center;'>" +
        "<div style='font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:#2e7d32;margin-bottom:8px;'>&#x1F4F9; Google Meet Link (Share with Patient)</div>" +
        "<a href='" + html_(p.meet_link) + "' style='display:inline-block;padding:12px 26px;background:#1b5e20;color:#ffffff;text-decoration:none;border-radius:8px;font-size:14px;font-weight:800;letter-spacing:0.3px;margin-bottom:8px;'>Join Google Meet</a>" +
        "<div style='font-size:12px;color:#388e3c;margin-top:6px;word-break:break-all;'>" + html_(p.meet_link) + "</div>" +
      "</div>";
  }

  var actionButtonsHtml =
    "<div style='margin-top:26px;display:flex;gap:10px;text-align:center;flex-wrap:wrap;'>" +
      (p.email ? "<a href='mailto:" + html_(p.email) + "?subject=Re: Physiomatics Appointment Booking [" + html_(p.booking_ref || "") + "]' style='display:inline-block;padding:11px 20px;background:#7c3aed;color:#ffffff;text-decoration:none;border-radius:8px;font-size:13px;font-weight:700;margin-right:8px;margin-bottom:8px;'>Reply by Email</a>" : "") +
      (waLeadLink ? "<a href='" + waLeadLink + "' style='display:inline-block;padding:11px 20px;background:#059669;color:#ffffff;text-decoration:none;border-radius:8px;font-size:13px;font-weight:700;margin-right:8px;margin-bottom:8px;'>WhatsApp Patient</a>" : "") +
      "<a href='" + ssUrl + "' style='display:inline-block;padding:11px 20px;background:#f1f5f9;color:#334155;text-decoration:none;border-radius:8px;font-size:13px;font-weight:700;border:1px solid #cbd5e1;margin-bottom:8px;'>Open Sheet Bookings</a>" +
    "</div>";

  var htmlBody =
    "<!DOCTYPE html><html><head><meta charset='utf-8'></head><body style='margin:0;padding:24px;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,Helvetica,Arial,sans-serif;'>" +
      "<div style='max-width:620px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 4px 14px rgba(0,0,0,0.06);border:1px solid #e2e8f0;'>" +
        "<div style='background:linear-gradient(135deg,#3b1d60 0%,#1e1035 100%);padding:28px 24px;border-bottom:3px solid #7c3aed;'>" +
          "<div style='display:inline-block;padding:4px 10px;background:#7c3aed;color:#ffffff;font-size:11px;font-weight:800;letter-spacing:1px;text-transform:uppercase;border-radius:20px;margin-bottom:10px;'>" +
            badgeText +
          "</div>" +
          "<h1 style='margin:0;color:#ffffff;font-size:22px;font-weight:800;letter-spacing:-0.5px;'>New Booking: " + (p.name ? html_(p.name) : "Patient") + "</h1>" +
          "<p style='margin:6px 0 0 0;color:#e9d5ff;font-size:13px;'>Scheduled for " + html_(p.preferred_date || "Flexible") + " at " + html_(p.preferred_time || "Flexible") + "</p>" +
        "</div>" +
        "<div style='padding:24px;'>" +
          "<table style='width:100%;border-collapse:collapse;'>" +
            rowsHtml +
          "</table>" +
          notesBoxHtml +
          meetBtnHtml +
          actionButtonsHtml +
        "</div>" +
        "<div style='background:#f8fafc;padding:16px 24px;text-align:center;border-top:1px solid #e2e8f0;color:#94a3b8;font-size:12px;'>" +
          "Physiomatics Booking Engine &bull; Automatically saved to Google Sheets (Appointment_Bookings) &bull; Ref: " + html_(p.booking_ref || "") +
        "</div>" +
      "</div>" +
    "</body></html>";

  var plainBody = [
    "[" + badgeText + "] New Appointment Booking on Physiomatics",
    "Reference: " + (p.booking_ref || "N/A"),
    "Name: " + p.name,
    "Email: " + p.email,
    "Phone: " + (p.phone || "N/A"),
    "Consultation Type: " + (p.consultation_type || p.interest),
    "Date: " + (p.preferred_date || "Flexible"),
    "Time: " + (p.preferred_time || "Flexible") + " (" + (p.timezone || "Asia/Kolkata") + ")",
    "Format: " + (p.format || "Online"),
    "Goal: " + (p.goal || "N/A"),
    "Notes: " + (p.message || "None"),
    p.meet_link ? "Google Meet: " + p.meet_link : "",
    "Jira: " + (p.jira_key || "N/A"),
    "Sheet: " + ssUrl
  ].filter(Boolean).join("\n");

  recipients.forEach(function (to) {
    try {
      MailApp.sendEmail({
        to: to,
        subject: "📅 [APPOINTMENT BOOKING] " + (p.booking_ref || "Booking") + " — " + (p.name || "Patient") + " (" + (p.consultation_type || "Consultation") + ") on " + (p.preferred_date || "Flexible"),
        body: plainBody,
        htmlBody: htmlBody,
        name: EMAIL_CONFIG.name,
        replyTo: p.email && isEmail_(p.email) ? p.email : EMAIL_CONFIG.replyTo
      });
      log_("sendBookingAlertToAdmin_", "SUCCESS", "Alert sent to admin: " + to);
    } catch (err) {
      log_("sendBookingAlertToAdmin_", "ERROR", String(err));
    }
  });
}

/**
 * Sends a branded appointment confirmation email directly to the patient / visitor.
 */
function sendBookingConfirmationToVisitor_(p) {
  if (!p.email || !isEmail_(p.email)) return;

  var bookingRef = p.booking_ref || "PHY-REF";
  var consultType = p.consultation_type || p.interest || "Physiotherapy Consultation";
  var preferredDate = p.preferred_date || "To be confirmed";
  var preferredTime = p.preferred_time || "Flexible";
  var timezone = p.timezone || "Asia/Kolkata";
  var format = p.format || "Online video consultation";

  var waFollowup = "https://wa.me/917845072426?text=" + encodeURIComponent("Hi Physiomatics, my booking reference is " + bookingRef + ". I have a question about my scheduled " + consultType + ".");

  var htmlBody =
    "<!DOCTYPE html><html><head><meta charset='utf-8'></head><body style='margin:0;padding:24px;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,Helvetica,Arial,sans-serif;'>" +
      "<div style='max-width:620px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.06);border:1px solid #e2e8f0;'>" +
        // Header
        "<div style='background:linear-gradient(135deg,#3b1d60 0%,#24103c 100%);padding:32px 28px;text-align:center;'>" +
          "<div style='display:inline-block;padding:6px 14px;background:rgba(255,255,255,0.15);color:#ffffff;font-size:11px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;border-radius:20px;margin-bottom:12px;'>" +
            "Appointment Booking Received" +
          "</div>" +
          "<h1 style='margin:0;color:#ffffff;font-size:24px;font-weight:800;letter-spacing:-0.5px;'>We have received your booking!</h1>" +
          "<p style='margin:8px 0 0 0;color:#e9d5ff;font-size:14px;'>Thank you, " + html_(p.name) + ". Our clinical team is preparing your session.</p>" +
        "</div>" +
        // Summary Box
        "<div style='padding:28px;'>" +
          "<div style='background:#faf5ff;border:1px solid #e9d5ff;border-radius:12px;padding:20px;margin-bottom:24px;text-align:center;'>" +
            "<div style='font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:#7c3aed;margin-bottom:6px;'>Your Booking Reference</div>" +
            "<div style='font-size:26px;font-family:monospace;font-weight:800;color:#3b1d60;letter-spacing:1px;'>" + html_(bookingRef) + "</div>" +
          "</div>" +
          // Details Table
          "<h3 style='margin:0 0 14px 0;font-size:16px;color:#0f172a;font-weight:700;'>Appointment Summary</h3>" +
          "<table style='width:100%;border-collapse:collapse;margin-bottom:24px;'>" +
            "<tr style='border-bottom:1px solid #f1f5f9;'><td style='padding:10px 0;color:#64748b;font-size:13px;font-weight:600;'>Consultation Type</td><td style='padding:10px 0;color:#0f172a;font-size:14px;font-weight:700;text-align:right;'>" + html_(consultType) + "</td></tr>" +
            "<tr style='border-bottom:1px solid #f1f5f9;'><td style='padding:10px 0;color:#64748b;font-size:13px;font-weight:600;'>Requested Date</td><td style='padding:10px 0;color:#0f172a;font-size:14px;font-weight:700;text-align:right;'>" + html_(preferredDate) + "</td></tr>" +
            "<tr style='border-bottom:1px solid #f1f5f9;'><td style='padding:10px 0;color:#64748b;font-size:13px;font-weight:600;'>Requested Time</td><td style='padding:10px 0;color:#0f172a;font-size:14px;font-weight:700;text-align:right;'>" + html_(preferredTime) + " (" + html_(timezone) + ")</td></tr>" +
            "<tr style='border-bottom:1px solid #f1f5f9;'><td style='padding:10px 0;color:#64748b;font-size:13px;font-weight:600;'>Format</td><td style='padding:10px 0;color:#0f172a;font-size:14px;text-align:right;'>" + html_(format) + "</td></tr>" +
            (p.goal ? "<tr style='border-bottom:1px solid #f1f5f9;'><td style='padding:10px 0;color:#64748b;font-size:13px;font-weight:600;'>Primary Goal</td><td style='padding:10px 0;color:#0f172a;font-size:14px;text-align:right;'>" + html_(p.goal) + "</td></tr>" : "") +
          "</table>" +
          // Google Meet block (only shown if a real Meet link was generated)
          (p.meet_link ?
            "<div style='margin-bottom:24px;padding:20px;background:linear-gradient(135deg,#e8f5e9 0%,#f1f8e9 100%);border:2px solid #81c784;border-radius:14px;text-align:center;'>" +
              "<div style='font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:1.2px;color:#2e7d32;margin-bottom:10px;'>&#x1F4F9; Your Google Meet Link</div>" +
              "<a href='" + html_(p.meet_link) + "' style='display:inline-block;padding:14px 32px;background:#1b5e20;color:#ffffff;text-decoration:none;border-radius:10px;font-size:16px;font-weight:800;letter-spacing:0.3px;margin-bottom:10px;box-shadow:0 4px 14px rgba(27,94,32,0.35);'>&#x1F3A5; Join Google Meet</a>" +
              "<div style='font-size:12px;color:#388e3c;word-break:break-all;'>" + html_(p.meet_link) + "</div>" +
            "</div>" : "") +
          // Next Steps
          "<div style='background:#f8fafc;border-radius:12px;padding:20px;margin-bottom:24px;border:1px solid #e2e8f0;'>" +
            "<h4 style='margin:0 0 10px 0;color:#0f172a;font-size:14px;font-weight:700;'>What Happens Next?</h4>" +
            "<ol style='margin:0;padding-left:20px;color:#475569;font-size:13px;line-height:1.7;'>" +
              "<li>Our clinical coordinator will review your consultation details within 24 hours.</li>" +
              (p.meet_link
                ? "<li>Your Google Meet link is ready — click the button above to join at the scheduled time. A calendar invite has also been sent to your email.</li>"
                : "<li>You will receive a calendar invitation and Google Meet video link via email within 24 hours.</li>") +
              "<li>If you have existing medical or physiotherapy reports, you can reply directly to this email with attachments.</li>" +
            "</ol>" +
          "</div>" +
          // WhatsApp Help Button
          "<div style='text-align:center;margin-top:24px;'>" +
            "<a href='" + waFollowup + "' style='display:inline-block;padding:12px 24px;background:#25D366;color:#ffffff;text-decoration:none;border-radius:10px;font-size:14px;font-weight:700;box-shadow:0 2px 8px rgba(37,211,102,0.3);'>Questions? Chat with us on WhatsApp</a>" +
          "</div>" +
        "</div>" +
        // Footer
        "<div style='background:#f8fafc;padding:20px 28px;text-align:center;border-top:1px solid #e2e8f0;color:#94a3b8;font-size:12px;'>" +
          "<div style='font-weight:700;color:#64748b;margin-bottom:4px;'>Physiomatics — AI-Powered Physiotherapy Intelligence</div>" +
          "<div><a href='" + CONFIG.WEBSITE + "' style='color:#7c3aed;text-decoration:none;'>" + CONFIG.WEBSITE + "</a> &bull; Support: " + EMAIL_CONFIG.adminEmail + "</div>" +
        "</div>" +
      "</div>" +
    "</body></html>";

  var plainBody = [
    "Dear " + p.name + ",",
    "",
    "Thank you for scheduling a consultation with Physiomatics.",
    "",
    "Booking Reference: " + bookingRef,
    "Consultation Type: " + consultType,
    "Requested Date: " + preferredDate,
    "Requested Time: " + preferredTime + " (" + timezone + ")",
    "Format: " + format,
    (p.goal ? "Goal: " + p.goal : ""),
    "",
    (p.meet_link ? "Google Meet Link: " + p.meet_link : ""),
    (p.meet_link ? "(Click the link above at the scheduled time to join your video consultation)" : ""),
    "",
    "What happens next:",
    p.meet_link
      ? "1. Your Google Meet link is ready — use it at the scheduled time to join the video call."
      : "1. Our clinical team will review your enquiry within 24 hours and send your video consultation link.",
    "2. A Google Calendar invite with the meeting details has been sent to " + p.email + ".",
    "3. Need immediate help? Message us on WhatsApp: +91 78450 72426",
    "",
    "Best regards,",
    "The Physiomatics Team",
    CONFIG.WEBSITE
  ].filter(Boolean).join("\n");

  try {
    MailApp.sendEmail({
      to: p.email,
      subject: "✅ Appointment Confirmation: " + consultType + " [Ref: " + bookingRef + "]",
      body: plainBody,
      htmlBody: htmlBody,
      name: EMAIL_CONFIG.name,
      replyTo: EMAIL_CONFIG.replyTo
    });
    log_("sendBookingConfirmationToVisitor_", "SUCCESS", "Booking confirmation sent to visitor: " + p.email);
  } catch (err) {
    log_("sendBookingConfirmationToVisitor_", "ERROR", "Failed to send confirmation to " + p.email + ": " + String(err));
  }
}

/**
 * Creates a Google Calendar event with a Google Meet link, invites both the visitor
 * and the admin, and stores the Meet URL in p.meet_link for use in email notifications.
 *
 * Uses the Calendar advanced service (Calendar.Events.insert) so that Meet conferencing
 * can be attached. Enable it via: Resources → Advanced Google Services → Google Calendar API.
 */
function createBookingCalendarEvent_(p) {
  if (!p.preferred_date || p.preferred_date === "Flexible") {
    p.meet_link = "";
    return "";
  }
  try {
    var start = parseDateTime_(p.preferred_date, p.preferred_time);
    var end   = new Date(start.getTime() + 30 * 60 * 1000); // 30-minute default

    var tz = p.timezone || "Asia/Kolkata";
    var toIso = function(d) { return Utilities.formatDate(d, tz, "yyyy-MM-dd'T'HH:mm:ss"); };

    var eventTitle = "Physiomatics: " + (p.consultation_type || "Physiotherapy Consultation") + " \u2014 " + p.name;

    var descLines = [
      "\uD83D\uDCC5 Physiomatics Appointment Booking",
      "Reference: " + (p.booking_ref || "N/A"),
      "Patient:   " + p.name,
      "Email:     " + p.email,
      "Phone:     " + (p.phone || "N/A"),
      "Type:      " + (p.consultation_type || "General"),
      "Goal:      " + (p.goal || "N/A"),
      "Format:    " + (p.format || "Online Google Meet"),
      "Timezone:  " + tz,
      p.message ? "Notes:     " + p.message : "",
      "",
      "\u26A0\uFE0F Please join via Google Meet at the scheduled time.",
      "Website: " + CONFIG.WEBSITE
    ].filter(Boolean).join("\n");

    // Build attendee list: visitor + admin
    var attendees = [];
    if (p.email && isEmail_(p.email)) {
      attendees.push({ email: p.email, displayName: p.name || p.email, responseStatus: "needsAction" });
    }
    if (EMAIL_CONFIG.adminEmail && isEmail_(EMAIL_CONFIG.adminEmail)) {
      attendees.push({ email: EMAIL_CONFIG.adminEmail, displayName: "Physiomatics Admin", responseStatus: "accepted" });
    }

    var eventResource = {
      summary: eventTitle,
      description: descLines,
      start:  { dateTime: toIso(start), timeZone: tz },
      end:    { dateTime: toIso(end),   timeZone: tz },
      attendees: attendees,
      guestsCanSeeOtherGuests: true,
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 },  // 1 day before
          { method: "popup", minutes: 30 }          // 30 min before
        ]
      },
      conferenceData: {
        createRequest: {
          requestId: Utilities.getUuid(),
          conferenceSolutionKey: { type: "hangoutsMeet" }
        }
      }
    };

    var calendarId = "primary";
    var insertedEvent;
    try {
      // Advanced Calendar Service gives us Google Meet link
      insertedEvent = Calendar.Events.insert(eventResource, calendarId, {
        conferenceDataVersion: 1,
        sendUpdates: "all"   // sends calendar invite to all attendees
      });
    } catch (advErr) {
      log_("createBookingCalendarEvent_", "WARN", "Advanced Calendar API failed, falling back to CalendarApp: " + String(advErr));
      // Fallback: CalendarApp (no Meet link)
      var cal = CalendarApp.getDefaultCalendar();
      if (!cal) { p.meet_link = ""; return ""; }
      var calEvent = cal.createEvent(eventTitle, start, end, {
        description: descLines,
        guests: attendees.map(function(a){ return a.email; }).join(","),
        sendInvites: true
      });
      p.calendar_event_id = calEvent.getId();
      p.meet_link = "";
      log_("createBookingCalendarEvent_", "SUCCESS", "Fallback calendar event created: " + calEvent.getId());
      return calEvent.getId();
    }

    p.calendar_event_id = insertedEvent.id || "";

    // Extract Google Meet link from conferenceData
    var meetLink = "";
    try {
      var confData = insertedEvent.conferenceData;
      if (confData && confData.entryPoints) {
        for (var i = 0; i < confData.entryPoints.length; i++) {
          var ep = confData.entryPoints[i];
          if (ep.entryPointType === "video" && ep.uri) {
            meetLink = ep.uri;
            break;
          }
        }
      }
      if (!meetLink && confData && confData.conferenceId) {
        meetLink = "https://meet.google.com/" + confData.conferenceId;
      }
    } catch (mErr) {
      log_("createBookingCalendarEvent_", "WARN", "Could not parse Meet link: " + String(mErr));
    }

    p.meet_link = meetLink;
    log_("createBookingCalendarEvent_", "SUCCESS",
      "Calendar event created: " + p.calendar_event_id + " | Meet: " + (meetLink || "none"));
    return p.calendar_event_id;

  } catch (err) {
    log_("createBookingCalendarEvent_", "WARN", "Calendar event warning: " + String(err));
    p.meet_link = "";
    return "";
  }
}

/**
 * Parses YYYY-MM-DD date and HH:MM time into a JavaScript Date object.
 */
function parseDateTime_(dateStr, timeStr) {
  var d = new Date();
  if (dateStr) {
    var parts = dateStr.split("-");
    if (parts.length === 3) {
      d.setFullYear(parseInt(parts[0], 10));
      d.setMonth(parseInt(parts[1], 10) - 1);
      d.setDate(parseInt(parts[2], 10));
    }
  }
  if (timeStr) {
    var timeParts = timeStr.split(":");
    if (timeParts.length >= 2) {
      d.setHours(parseInt(timeParts[0], 10));
      d.setMinutes(parseInt(timeParts[1], 10));
      d.setSeconds(0);
      d.setMilliseconds(0);
      return d;
    }
  }
  // Default to 10:00 AM if no time specified
  d.setHours(10, 0, 0, 0);
  return d;
}

function sendPeriodicExecutiveDigest(intervalName) {
  BUILD_AGGREGATED_INTERVAL_SUMMARIES();
  var ss  = getSpreadsheet();
  var map = { Daily: "Daily_Summary", Weekly: "Weekly_Summary", Monthly: "Monthly_Summary" };
  var tabName = map[intervalName] || "Daily_Summary";
  var sheet = ss.getSheetByName(tabName);

  var dateStr = Utilities.formatDate(new Date(), CONFIG.TIMEZONE, "yyyy-MM-dd");
  var totalEvents = 0, visitors = 0, pageViews = 0, demos = 0, quick = 0;
  var consults = 0, chatbot = 0, feedback = 0, leads = 0;
  var convRate = "0.0%";
  var avgDuration = "0";
  var data = [];

  if (sheet && sheet.getLastRow() >= 2) {
    data = sheet.getDataRange().getDisplayValues();
    var header = data[0];
    var latest = data[1] || [];

    // Map header indexes
    var idx = function(name) { return header.indexOf(name); };
    dateStr     = latest[0] || dateStr;
    totalEvents = Number(latest[idx("Total_Events")]) || 0;
    visitors    = Number(latest[idx("Unique_Visitors")]) || 0;
    pageViews   = Number(latest[idx("Page_Views")]) || 0;
    demos       = Number(latest[idx("Demo_Requests")]) || 0;
    quick       = Number(latest[idx("Quick_Enquiries")]) || 0;
    consults    = Number(latest[idx("Consultations")]) || 0;
    chatbot     = Number(latest[idx("Chatbot_Messages")]) || 0;
    feedback    = Number(latest[idx("Feedback_Count")]) || 0;
    leads       = Number(latest[idx("Total_Leads")]) || (demos + quick + consults);
    convRate    = latest[idx("Conversion_Rate")] || (visitors ? ((leads / visitors) * 100).toFixed(1) + "%" : "0.0%");
    avgDuration = latest[idx("Avg_Engagement_Sec")] || "0";
  } else {
    log_("sendPeriodicExecutiveDigest", "INFO", "Generating zero-state executive report for " + intervalName);
  }

  // ── 1. Pull YouTube Lead Counts ──────────────────────────────────────────
  var ytLeads = 0, ytEnquiries = 0;
  var ytSheet = null;
  try {
    ytSheet = ss.getSheetByName("YouTube_Raw_Leads");
    if (ytSheet && ytSheet.getLastRow() > 1) {
      var ytData = ytSheet.getRange(2, 1, ytSheet.getLastRow() - 1, Math.min(ytSheet.getLastColumn(), 17)).getValues();
      ytLeads = ytData.length;
      ytEnquiries = ytData.filter(function(r) { return String(r[12]).toUpperCase() === "TRUE"; }).length;
    }
  } catch(e) { log_("digest_yt", "WARN", String(e)); }

  // ── 2. Pull LinkedIn Lead Counts ─────────────────────────────────────────
  var liLeads = 0, liEnquiries = 0;
  var liSheet = null;
  try {
    liSheet = ss.getSheetByName("LinkedIn_Raw_Leads");
    if (liSheet && liSheet.getLastRow() > 1) {
      var liData = liSheet.getRange(2, 1, liSheet.getLastRow() - 1, Math.min(liSheet.getLastColumn(), 17)).getValues();
      liLeads = liData.length;
      liEnquiries = liData.filter(function(r) { return String(r[10]).toUpperCase() === "TRUE"; }).length;
    }
  } catch(e) { log_("digest_li", "WARN", String(e)); }

  // ── 3. Pull Telegram Leads & Dispatched Alerts Count ─────────────────────
  var telegramLeads = 0;
  var telegramSentAlerts = 0;
  try {
    // Check Lead_Management
    var lmSheet = ss.getSheetByName("Lead_Management");
    if (lmSheet && lmSheet.getLastRow() > 1) {
      var lmData = lmSheet.getDataRange().getValues();
      var lmH = lmData[0];
      var lmSrcCol = lmH.indexOf("lead_source");
      var lmTelCol = lmH.indexOf("telegram_status");
      for (var r = 1; r < lmData.length; r++) {
        var rowVal = lmData[r];
        if (lmSrcCol !== -1 && String(rowVal[lmSrcCol] || "").toLowerCase().indexOf("telegram") !== -1) {
          telegramLeads++;
        }
        if (lmTelCol !== -1 && String(rowVal[lmTelCol] || "").toLowerCase() === "sent") {
          telegramSentAlerts++;
        }
      }
    }
    // Check LinkedIn raw leads
    if (liSheet && liSheet.getLastRow() > 1) {
      var liH = liSheet.getRange(1, 1, 1, liSheet.getLastColumn()).getValues()[0];
      var liTelCol = liH.indexOf("telegram_status");
      if (liTelCol !== -1) {
        var liTelData = liSheet.getRange(2, liTelCol + 1, liSheet.getLastRow() - 1, 1).getValues();
        var sentCount = liTelData.filter(function(r) { return String(r[0]).toLowerCase() === "sent"; }).length;
        telegramSentAlerts += sentCount;
      }
    }
    // YouTube qualified enquiries trigger Telegram alert
    telegramSentAlerts += ytEnquiries;
    // Telegram lead display figure: either specific telegram leads or total delivered leads
    if (telegramLeads === 0) {
      telegramLeads = telegramSentAlerts;
    }
  } catch(e) { log_("digest_telegram", "WARN", String(e)); }

  // ── 4. Most Repeated Lead Email IDs ──────────────────────────────────────
  var emailFreq = {};
  var emailNames = {};
  var emailSources = {};
  var leadSheets = ["Lead_Management", "Demo_Requests", "Quick_Enquiries", "Consultation_Requests", "Feedback"];
  leadSheets.forEach(function(sheetName) {
    try {
      var ls = ss.getSheetByName(sheetName);
      if (!ls || ls.getLastRow() < 2) return;
      var lsData = ls.getDataRange().getValues();
      var lsHeaders = lsData[0];
      var emailCol = lsHeaders.indexOf("email");
      var nameCol = lsHeaders.indexOf("name");
      if (emailCol === -1) return;
      for (var i = 1; i < lsData.length; i++) {
        var em = String(lsData[i][emailCol] || "").trim().toLowerCase();
        if (em && em.indexOf("@") > 0 && em.indexOf(".") > 0) {
          emailFreq[em] = (emailFreq[em] || 0) + 1;
          if (nameCol !== -1 && lsData[i][nameCol] && !emailNames[em]) {
            emailNames[em] = String(lsData[i][nameCol]).trim();
          }
          if (!emailSources[em]) {
            emailSources[em] = sheetName.replace(/_/g, " ");
          }
        }
      }
    } catch(e) {}
  });

  // Also check email regex patterns inside social comments
  var emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
  [ytSheet, liSheet].forEach(function(s) {
    try {
      if (!s || s.getLastRow() < 2) return;
      var sData = s.getDataRange().getValues();
      for (var i = 1; i < sData.length; i++) {
        var textRow = sData[i].join(" ");
        var matches = textRow.match(emailRegex);
        if (matches) {
          matches.forEach(function(matchedEmail) {
            var cleanEm = matchedEmail.trim().toLowerCase();
            emailFreq[cleanEm] = (emailFreq[cleanEm] || 0) + 1;
            if (!emailSources[cleanEm]) emailSources[cleanEm] = "Social Comment";
          });
        }
      }
    } catch(e) {}
  });

  // Sort and select top 5
  var topEmails = Object.keys(emailFreq)
    .map(function(em) {
      return {
        email: em,
        count: emailFreq[em],
        name: emailNames[em] || "Lead Visitor",
        source: emailSources[em] || "Web Form"
      };
    })
    .filter(function(e) { return e.count > 0; })
    .sort(function(a, b) { return b.count - a.count; })
    .slice(0, 5);

  // ── Total leads including all omnichannels ────────────────────────────────
  var totalAllLeads = leads + ytEnquiries + liEnquiries;

  // ── Build HTML Helper: Progress Bar ──────────────────────────────────────
  var maxLead = Math.max(demos, quick, consults, ytEnquiries, liEnquiries, feedback, 1);
  var barRow = function(name, count, color) {
    var pct = Math.min(100, Math.round((count / maxLead) * 100));
    return (
      "<div style='margin-bottom:12px;'>" +
        "<div style='display:flex;justify-content:space-between;font-size:13px;font-weight:600;color:#334155;margin-bottom:4px;'>" +
          "<span>" + name + "</span>" +
          "<span style='color:" + color + ";font-weight:700;'>" + count + "</span>" +
        "</div>" +
        "<div style='background:#f1f5f9;height:8px;border-radius:4px;overflow:hidden;'>" +
          "<div style='background:" + color + ";height:8px;width:" + pct + "%;border-radius:4px;'></div>" +
        "</div>" +
      "</div>"
    );
  };

  // ── Recent Historical Trend Rows ─────────────────────────────────────────
  var trendRowsHtml = "";
  if (data.length > 1) {
    var hidx = function(name) { return data[0].indexOf(name); };
    for (var r = 1; r < Math.min(data.length, 6); r++) {
      var row = data[r];
      trendRowsHtml +=
        "<tr style='border-bottom:1px solid #f1f5f9;font-size:13px;'>" +
          "<td style='padding:8px 10px;font-weight:600;color:#1e293b;'>" + html_(row[0]) + "</td>" +
          "<td style='padding:8px 10px;color:#2563eb;text-align:center;font-weight:700;'>" + html_(row[hidx("Unique_Visitors")]) + "</td>" +
          "<td style='padding:8px 10px;color:#475569;text-align:center;'>" + html_(row[hidx("Page_Views")]) + "</td>" +
          "<td style='padding:8px 10px;color:#059669;text-align:center;font-weight:700;'>" + html_(row[hidx("Total_Leads")]) + "</td>" +
          "<td style='padding:8px 10px;color:#7c3aed;text-align:center;font-weight:700;'>" + html_(row[hidx("Conversion_Rate")]) + "</td>" +
        "</tr>";
    }
  } else {
    trendRowsHtml = "<tr><td colspan='5' style='padding:12px;text-align:center;color:#94a3b8;font-size:12px;'>No historical periods recorded yet.</td></tr>";
  }

  // ── Top Repeated Emails Dashboard Table HTML ─────────────────────────────
  var topEmailsHtml = "";
  if (topEmails.length > 0) {
    topEmailsHtml =
      "<div style='background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:18px 20px;margin-bottom:20px;'>" +
        "<div style='display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;'>" +
          "<h3 style='margin:0;font-size:15px;color:#0f172a;font-weight:700;'>🔁 Most Repeated / Active Lead Email IDs</h3>" +
          "<span style='font-size:11px;color:#64748b;font-weight:600;background:#f1f5f9;padding:3px 8px;border-radius:12px;'>High Intent Priority</span>" +
        "</div>" +
        "<table style='width:100%;border-collapse:collapse;'>" +
          "<thead>" +
            "<tr style='background:#f8fafc;border-bottom:2px solid #e2e8f0;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;'>" +
              "<th style='padding:8px 10px;text-align:left;'>Rank</th>" +
              "<th style='padding:8px 10px;text-align:left;'>Lead Name &amp; Email</th>" +
              "<th style='padding:8px 10px;text-align:left;'>Channel</th>" +
              "<th style='padding:8px 10px;text-align:center;'>Submissions</th>" +
            "</tr>" +
          "</thead>" +
          "<tbody>";

    topEmails.forEach(function(e, i) {
      var rankBadge = i === 0 ? "🥇 #1" : i === 1 ? "🥈 #2" : i === 2 ? "🥉 #3" : ("#" + (i + 1));
      var badgeBg = i === 0 ? "#fef3c7" : i === 1 ? "#f1f5f9" : i === 2 ? "#ffedd5" : "#f8fafc";
      var badgeTextColor = i === 0 ? "#b45309" : i === 1 ? "#475569" : i === 2 ? "#c2410c" : "#64748b";
      var countTagColor = e.count >= 3 ? "#dc2626" : e.count >= 2 ? "#d97706" : "#2563eb";

      topEmailsHtml +=
        "<tr style='border-bottom:1px solid #f1f5f9;font-size:13px;'>" +
          "<td style='padding:10px 10px;'><span style='background:" + badgeBg + ";color:" + badgeTextColor + ";font-size:11px;font-weight:800;padding:3px 8px;border-radius:12px;'>" + rankBadge + "</span></td>" +
          "<td style='padding:10px 10px;'>" +
            "<div style='color:#0f172a;font-weight:700;'>" + html_(e.name) + "</div>" +
            "<div style='color:#2563eb;font-size:12px;font-weight:500;'><a href='mailto:" + html_(e.email) + "' style='color:#2563eb;text-decoration:none;'>" + html_(e.email) + "</a></div>" +
          "</td>" +
          "<td style='padding:10px 10px;color:#64748b;font-size:12px;font-weight:600;'>" + html_(e.source) + "</td>" +
          "<td style='padding:10px 10px;text-align:center;'>" +
            "<span style='background:" + countTagColor + ";color:#ffffff;font-size:11px;font-weight:800;padding:3px 10px;border-radius:20px;'>" + e.count + "x Leads</span>" +
          "</td>" +
        "</tr>";
    });

    topEmailsHtml += "</tbody></table></div>";
  } else {
    topEmailsHtml =
      "<div style='background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:16px 20px;margin-bottom:20px;text-align:center;color:#64748b;font-size:13px;'>" +
        "🔁 <strong>Most Repeated Lead Emails:</strong> No duplicate leads recorded yet for this period." +
      "</div>";
  }

  var ssUrl = "";
  try { ssUrl = ss.getUrl(); } catch (e) { ssUrl = CONFIG.WEBSITE; }

  // ── Executive HTML Dashboard Body ────────────────────────────────────────
  var htmlBody =
    "<!DOCTYPE html><html><head><meta charset='utf-8'></head><body style='margin:0;padding:24px;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,Helvetica,Arial,sans-serif;'>" +
      "<div style='max-width:680px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 24px rgba(0,0,0,0.06);border:1px solid #e2e8f0;'>" +

        // Header with Modern Navy Gradient
        "<div style='background:linear-gradient(135deg,#0284c7 0%,#0f172a 100%);padding:28px 24px;color:#ffffff;'>" +
          "<div style='display:inline-block;padding:4px 12px;background:rgba(255,255,255,0.2);color:#ffffff;font-size:11px;font-weight:800;letter-spacing:1px;text-transform:uppercase;border-radius:20px;margin-bottom:8px;'>" +
            intervalName + " Executive Digest" +
          "</div>" +
          "<h1 style='margin:0;font-size:24px;font-weight:800;letter-spacing:-0.5px;'>Physiomatics Performance Dashboard</h1>" +
          "<p style='margin:6px 0 0 0;color:#bae6fd;font-size:13px;'>Reporting Period: <strong>" + dateStr + "</strong> &bull; Asia/Kolkata (IST)</p>" +
        "</div>" +

        "<div style='padding:22px 24px 12px 24px;background:#ffffff;'>" +

          // ── KPI Row 1: Visitors & Total Omnichannel Leads ──────────────────
          "<div style='display:table;width:100%;margin-bottom:12px;'>" +
            // Visitors Card
            "<div style='display:table-cell;width:50%;padding-right:6px;vertical-align:top;'>" +
              "<div style='background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:16px;'>" +
                "<div style='color:#15803d;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;'>👥 Unique Visitors</div>" +
                "<div style='color:#166534;font-size:28px;font-weight:800;margin-top:4px;'>" + visitors + "</div>" +
                "<div style='color:#15803d;font-size:12px;margin-top:2px;'>" + pageViews + " total page views</div>" +
              "</div>" +
            "</div>" +
            // Total Leads Card
            "<div style='display:table-cell;width:50%;padding-left:6px;vertical-align:top;'>" +
              "<div style='background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;padding:16px;'>" +
                "<div style='color:#1d4ed8;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;'>🎯 Omnichannel Leads</div>" +
                "<div style='color:#1e40af;font-size:28px;font-weight:800;margin-top:4px;'>" + totalAllLeads + "</div>" +
                "<div style='color:#1d4ed8;font-size:12px;margin-top:2px;'>Web: <strong>" + leads + "</strong> &bull; Social: <strong>" + (ytEnquiries + liEnquiries) + "</strong> &bull; Conv: <strong>" + convRate + "</strong></div>" +
              "</div>" +
            "</div>" +
          "</div>" +

          // ── KPI Row 2: Telegram Leads & YouTube Leads ──────────────────────
          "<div style='display:table;width:100%;margin-bottom:12px;'>" +
            // Telegram Leads Card
            "<div style='display:table-cell;width:50%;padding-right:6px;vertical-align:top;'>" +
              "<div style='background:#f0f9ff;border:1px solid #bae6fd;border-radius:12px;padding:16px;'>" +
                "<div style='color:#0284c7;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;'>📱 Telegram Leads</div>" +
                "<div style='color:#0369a1;font-size:28px;font-weight:800;margin-top:4px;'>" + telegramLeads + "</div>" +
                "<div style='color:#0284c7;font-size:12px;margin-top:2px;'>" + telegramSentAlerts + " instant bot alerts delivered</div>" +
              "</div>" +
            "</div>" +
            // YouTube Leads Card
            "<div style='display:table-cell;width:50%;padding-left:6px;vertical-align:top;'>" +
              "<div style='background:#fef2f2;border:1px solid #fecaca;border-radius:12px;padding:16px;'>" +
                "<div style='color:#b91c1c;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;'>▶️ YouTube Leads</div>" +
                "<div style='color:#991b1b;font-size:28px;font-weight:800;margin-top:4px;'>" + ytEnquiries + "</div>" +
                "<div style='color:#b91c1c;font-size:12px;margin-top:2px;'>" + ytLeads + " comments tracked &bull; " + ytEnquiries + " qualified</div>" +
              "</div>" +
            "</div>" +
          "</div>" +

          // ── KPI Row 3: LinkedIn Leads & Web Forms ──────────────────────────
          "<div style='display:table;width:100%;margin-bottom:12px;'>" +
            // LinkedIn Leads Card
            "<div style='display:table-cell;width:50%;padding-right:6px;vertical-align:top;'>" +
              "<div style='background:#f0f7ff;border:1px solid #c7d2fe;border-radius:12px;padding:16px;'>" +
                "<div style='color:#3730a3;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;'>💼 LinkedIn Leads</div>" +
                "<div style='color:#312e81;font-size:28px;font-weight:800;margin-top:4px;'>" + liEnquiries + "</div>" +
                "<div style='color:#3730a3;font-size:12px;margin-top:2px;'>" + liLeads + " interactions &bull; " + liEnquiries + " qualified</div>" +
              "</div>" +
            "</div>" +
            // Web Inquiries Card
            "<div style='display:table-cell;width:50%;padding-left:6px;vertical-align:top;'>" +
              "<div style='background:#faf5ff;border:1px solid #e9d5ff;border-radius:12px;padding:16px;'>" +
                "<div style='color:#7e22ce;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;'>⚡ Web Inquiries</div>" +
                "<div style='color:#6b21a8;font-size:28px;font-weight:800;margin-top:4px;'>" + leads + "</div>" +
                "<div style='color:#7e22ce;font-size:12px;margin-top:2px;'>Demos: " + demos + " &bull; Consults: " + consults + " &bull; Quick: " + quick + "</div>" +
              "</div>" +
            "</div>" +
          "</div>" +

          // ── KPI Row 4: AI Chatbot & Avg Engagement ─────────────────────────
          "<div style='display:table;width:100%;margin-bottom:20px;'>" +
            // AI Chat & Feedback Card
            "<div style='display:table-cell;width:50%;padding-right:6px;vertical-align:top;'>" +
              "<div style='background:#fffbeb;border:1px solid #fde68a;border-radius:12px;padding:16px;'>" +
                "<div style='color:#b45309;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;'>🤖 AI Chat &amp; Feedback</div>" +
                "<div style='color:#92400e;font-size:28px;font-weight:800;margin-top:4px;'>" + (chatbot + feedback) + "</div>" +
                "<div style='color:#b45309;font-size:12px;margin-top:2px;'>" + chatbot + " chats &bull; " + feedback + " feedback reviews</div>" +
              "</div>" +
            "</div>" +
            // Avg Engagement Card
            "<div style='display:table-cell;width:50%;padding-left:6px;vertical-align:top;'>" +
              "<div style='background:#fdf2f8;border:1px solid #fbcfe8;border-radius:12px;padding:16px;'>" +
                "<div style='color:#9d174d;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;'>⏱️ Avg Engagement</div>" +
                "<div style='color:#831843;font-size:28px;font-weight:800;margin-top:4px;'>" + avgDuration + "s</div>" +
                "<div style='color:#9d174d;font-size:12px;margin-top:2px;'>" + totalEvents + " live interaction events</div>" +
              "</div>" +
            "</div>" +
          "</div>" +

          // ── Visual Channel & Funnel Breakdown Chart ───────────────────────
          "<div style='background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:18px 20px;margin-bottom:20px;'>" +
            "<h3 style='margin:0 0 14px 0;font-size:15px;color:#0f172a;font-weight:700;'>📊 Omnichannel Lead &amp; Conversion Breakdown</h3>" +
            barRow("🎯 Demo / ICP Requests", demos, "#7c3aed") +
            barRow("💬 Clinical Consultations", consults, "#059669") +
            barRow("⚡ Quick Enquiries", quick, "#0284c7") +
            barRow("📱 Telegram Lead Dispatches", telegramLeads, "#0891b2") +
            barRow("▶️ YouTube Comment Enquiries", ytEnquiries, "#dc2626") +
            barRow("💼 LinkedIn Profile Enquiries", liEnquiries, "#3730a3") +
            barRow("🤖 AI Chatbot Inquiries", chatbot, "#f59e0b") +
            barRow("⭐ Patient Feedback", feedback, "#ec4899") +
          "</div>" +

          // ── Most Repeated Lead Email IDs Dashboard ────────────────────────
          topEmailsHtml +

          // ── Historical Trend Table ─────────────────────────────────────────
          "<div style='background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:18px 20px;margin-bottom:22px;'>" +
            "<h3 style='margin:0 0 12px 0;font-size:15px;color:#0f172a;font-weight:700;'>📈 Recent Performance History</h3>" +
            "<table style='width:100%;border-collapse:collapse;'>" +
              "<thead>" +
                "<tr style='background:#f8fafc;border-bottom:2px solid #e2e8f0;font-size:12px;color:#64748b;text-transform:uppercase;'>" +
                  "<th style='padding:8px 10px;text-align:left;'>Period</th>" +
                  "<th style='padding:8px 10px;text-align:center;'>Visitors</th>" +
                  "<th style='padding:8px 10px;text-align:center;'>Views</th>" +
                  "<th style='padding:8px 10px;text-align:center;'>Leads</th>" +
                  "<th style='padding:8px 10px;text-align:center;'>Conv.</th>" +
                "</tr>" +
              "</thead>" +
              "<tbody>" +
                trendRowsHtml +
              "</tbody>" +
            "</table>" +
          "</div>" +

          // ── Executive Quick Actions CTA Buttons ───────────────────────────
          "<div style='text-align:center;margin-bottom:12px;'>" +
            "<a href='" + ssUrl + "' style='display:inline-block;padding:12px 20px;background:#0284c7;color:#ffffff;text-decoration:none;border-radius:8px;font-size:13px;font-weight:700;margin:4px;'>📊 Live Google Sheet</a>" +
            "<a href='https://airtable.com/apptNJUsbdqh4dxvS' style='display:inline-block;padding:12px 20px;background:#059669;color:#ffffff;text-decoration:none;border-radius:8px;font-size:13px;font-weight:700;margin:4px;'>🗂️ Airtable Base</a>" +
            "<a href='https://janegracyint2027g3.atlassian.net/jira/core/projects/PHY/board' style='display:inline-block;padding:12px 20px;background:#7c3aed;color:#ffffff;text-decoration:none;border-radius:8px;font-size:13px;font-weight:700;margin:4px;'>📋 Jira PHY Board</a>" +
            "<a href='" + CONFIG.WEBSITE + "' style='display:inline-block;padding:12px 20px;background:#f1f5f9;color:#334155;text-decoration:none;border-radius:8px;font-size:13px;font-weight:700;border:1px solid #cbd5e1;margin:4px;'>🌐 Visit Website</a>" +
          "</div>" +

        "</div>" +

        // Footer
        "<div style='background:#f8fafc;padding:16px 24px;text-align:center;border-top:1px solid #e2e8f0;color:#94a3b8;font-size:12px;'>" +
          "Physiomatics Intelligence System &bull; Google Sheets &bull; Jira &bull; Airtable &bull; Telegram &bull; YouTube &bull; LinkedIn" +
        "</div>" +

      "</div>" +
    "</body></html>";

  // ── Plain Body for Text Email Fallback ───────────────────────────────────
  var plainBody = [
    "[" + intervalName + " Summary] Physiomatics Website Report",
    "Period: " + dateStr,
    "Unique Visitors: " + visitors,
    "Total Page Views: " + pageViews,
    "Total Leads (Omnichannel): " + totalAllLeads + " (Conv: " + convRate + ")",
    "  ↳ Telegram Leads: " + telegramLeads + " (" + telegramSentAlerts + " alerts delivered)",
    "  ↳ YouTube Leads: " + ytEnquiries + " (" + ytLeads + " comments total)",
    "  ↳ LinkedIn Leads: " + liEnquiries + " (" + liLeads + " interactions total)",
    "  ↳ Web Forms: " + leads + " (Demos: " + demos + ", Consults: " + consults + ", Quick: " + quick + ")",
    "Chatbot Messages: " + chatbot,
    "Avg Engagement: " + avgDuration + "s",
    (topEmails.length > 0 ? "Most Repeated Lead Emails: " + topEmails.map(function(e){ return e.email + " (" + e.count + "x)"; }).join(", ") : ""),
    "Sheet URL: " + ssUrl
  ].filter(Boolean).join("\n");

  // ── Send Email Digest to Executive Recipients ────────────────────────────
  (EMAIL_CONFIG.reportEmails || [EMAIL_CONFIG.adminEmail]).forEach(function (to) {
    try {
      MailApp.sendEmail({
        to: to,
        subject: "📊 [Physiomatics] " + intervalName + " Digest — " + visitors + " Visitors, " + totalAllLeads + " Leads (" + convRate + ")",
        body: plainBody,
        htmlBody: htmlBody,
        name: EMAIL_CONFIG.name,
        replyTo: EMAIL_CONFIG.replyTo
      });
    } catch (err) { log_("sendPeriodicExecutiveDigest", "ERROR", String(err)); }
  });

  // ── Send Telegram Digest to Bot / Group ──────────────────────────────────
  try {
    var topEmailText = topEmails.length > 0
      ? "\n\n🔁 <b>Most Repeated Lead Emails:</b>\n" + topEmails.map(function(e, i) {
          return (i + 1) + ". <code>" + e.email + "</code> (" + e.name + ") — <b>" + e.count + "x</b> [" + e.source + "]";
        }).join("\n")
      : "";

    var tgramMsg =
      "📊 <b>Physiomatics " + intervalName + " Performance Digest</b>\n" +
      "📅 Period: <b>" + dateStr + "</b> (Asia/Kolkata)\n" +
      "━━━━━━━━━━━━━━━━━━\n" +
      "👥 <b>Visitors:</b> " + visitors + "  |  📄 <b>Page Views:</b> " + pageViews + "\n" +
      "🎯 <b>Total Leads:</b> " + totalAllLeads + "  |  📈 <b>Conv Rate:</b> " + convRate + "\n" +
      "━━━━━━━━━━━━━━━━━━\n" +
      "📱 <b>Omnichannel Lead Breakdown:</b>\n" +
      "   📱 <b>Telegram Leads:</b> <b>" + telegramLeads + "</b> (" + telegramSentAlerts + " alerts delivered)\n" +
      "   ▶️ <b>YouTube Leads:</b> <b>" + ytEnquiries + "</b> enquiries (" + ytLeads + " comments)\n" +
      "   💼 <b>LinkedIn Leads:</b> <b>" + liEnquiries + "</b> enquiries (" + liLeads + " interactions)\n" +
      "   🎯 <b>Demo Requests:</b> <b>" + demos + "</b>\n" +
      "   💬 <b>Consultations:</b> <b>" + consults + "</b>\n" +
      "   ⚡ <b>Quick Enquiries:</b> <b>" + quick + "</b>\n" +
      "   🤖 <b>Chatbot Chats:</b> <b>" + chatbot + "</b>  |  ⭐ Feedback: <b>" + feedback + "</b>\n" +
      "━━━━━━━━━━━━━━━━━━\n" +
      "⏱️ <b>Avg Engagement:</b> " + avgDuration + "s  |  🔄 <b>Events:</b> " + totalEvents +
      topEmailText + "\n\n" +
      "🔗 <a href='" + ssUrl + "'>Google Sheet</a>  |  " +
      "<a href='https://janegracyint2027g3.atlassian.net/jira/core/projects/PHY/board'>Jira Board</a>  |  " +
      "<a href='https://airtable.com/apptNJUsbdqh4dxvS'>Airtable</a>";

    sendTelegramMessage_(tgramMsg);
    log_("sendPeriodicExecutiveDigest", "INFO", "Telegram " + intervalName + " digest delivered.");
  } catch (tErr) {
    log_("sendPeriodicExecutiveDigest_telegram", "WARN", String(tErr));
  }

  // ── Forward Digest Report to Jira ────────────────────────────────────────
  try {
    createJiraReportTask_({
      interval: intervalName,
      period: dateStr,
      visitors: visitors,
      pageViews: pageViews,
      leads: totalAllLeads,
      conversionRate: convRate,
      avgEngagementSec: avgDuration,
      demos: demos,
      consultations: consults,
      quickEnquiries: quick,
      chatbotMessages: chatbot,
      telegramLeads: telegramLeads,
      youtubeLeads: ytEnquiries,
      linkedinLeads: liEnquiries,
      topEmails: topEmails,
      sheetUrl: ssUrl
    });
  } catch (jiraErr) {
    log_("sendPeriodicExecutiveDigest_jira", "WARN", String(jiraErr));
  }
}

/**
 * Convenient test runner for Apps Script Editor:
 * Run this function directly to test Daily Report generation, Email dispatch, and Telegram delivery.
 */
function TEST_SendDailyReport() {
  sendPeriodicExecutiveDigest("Daily");
  return "Daily report test completed successfully. Check your Email and Telegram!";
}

function dailyReport()   { sendPeriodicExecutiveDigest("Daily"); }
function weeklyReport()  { sendPeriodicExecutiveDigest("Weekly"); }
function monthlyReport() { sendPeriodicExecutiveDigest("Monthly"); }

function setupPhysiomaticsTriggers() {
  ScriptApp.getProjectTriggers().forEach(function (trigger) {
    var fn = trigger.getHandlerFunction();
    if (["dailyReport", "weeklyReport", "monthlyReport", "SYNC_YOUTUBE_COMMENTS_AUTO"].indexOf(fn) >= 0) {
      ScriptApp.deleteTrigger(trigger);
    }
  });
  ScriptApp.newTrigger("dailyReport").timeBased().everyDays(1).atHour(21).create();
  ScriptApp.newTrigger("weeklyReport").timeBased().onWeekDay(ScriptApp.WeekDay.MONDAY).atHour(9).create();
  ScriptApp.newTrigger("monthlyReport").timeBased().onMonthDay(1).atHour(9).create();
  // Automatically poll YouTube comments every hour for new leads
  ScriptApp.newTrigger("SYNC_YOUTUBE_COMMENTS_AUTO").timeBased().everyHours(1).create();
  log_("setupPhysiomaticsTriggers", "SUCCESS", "All triggers installed including YouTube hourly auto-sync.");
}

/**
 * Disables internal Google Apps Script time-driven triggers for dailyReport,
 * weeklyReport, and monthlyReport to prevent duplicate emails now that Vercel API
 * and Vercel Cron are the single source of truth for report scheduling.
 */
function disableAppsScriptReportTriggers() {
  var removed = [];
  ScriptApp.getProjectTriggers().forEach(function (trigger) {
    var fn = trigger.getHandlerFunction();
    if (["dailyReport", "weeklyReport", "monthlyReport"].indexOf(fn) >= 0) {
      removed.push(fn);
      ScriptApp.deleteTrigger(trigger);
    }
  });
  log_("disableAppsScriptReportTriggers", "SUCCESS", "Disabled redundant report triggers: " + (removed.join(", ") || "none") + ". Reports are managed via Vercel API.");
  return { success: true, removed: removed };
}

/* ---------------------------- AGGREGATION --------------------------------- */

function BUILD_AGGREGATED_INTERVAL_SUMMARIES() {
  var ss   = getSpreadsheet();
  var live = ss.getSheetByName("Live_Traffic_Events");
  var buckets = { Daily_Summary: {}, Weekly_Summary: {}, Monthly_Summary: {} };

  if (live && live.getLastRow() > 1) {
    var values  = live.getDataRange().getValues();
    var headers = values[0];
    var idx = function (n) { return headers.indexOf(n); };
    var tsIdx        = idx("received_at");
    var visitorIdx   = idx("visitor_id");
    var typeIdx      = idx("event_type");
    var eventNameIdx = idx("event_name");
    var leadTypeIdx  = idx("lead_type");
    var durationIdx  = idx("time_on_page_seconds");

    for (var r = 1; r < values.length; r++) {
      var date = parseDate_(values[r][tsIdx]);
      if (!date) continue;
      var day   = Utilities.formatDate(date, CONFIG.TIMEZONE, "yyyy-MM-dd");
      var month = Utilities.formatDate(date, CONFIG.TIMEZONE, "yyyy-MM");
      var week  = weekStart_(date);
      var eventType = norm_(values[r][typeIdx]);
      var eventName = norm_(values[r][eventNameIdx]);
      var leadType  = norm_(values[r][leadTypeIdx]);
      var isDemo         = leadType.indexOf("demo") >= 0;
      var isQuick        = leadType === "quick_enquiry";
      var isConsultation = leadType === "consultation_request";
      var isChatbot      = leadType === "chatbot" || eventName === "chatbot_inquiry";
      var isFeedback     = leadType === "feedback";
      var isLead         = isDemo || isQuick || isConsultation;
      var visitor  = visitorIdx >= 0 ? String(values[r][visitorIdx] || "") : "";
      var duration = durationIdx >= 0 ? number_(values[r][durationIdx]) : 0;
      var pageView = eventType === "page_view" || eventName === "page_view";

      updateBucket_(buckets.Daily_Summary,   day,   visitor, pageView, isDemo, isQuick, isConsultation, isChatbot, isFeedback, isLead, duration);
      updateBucket_(buckets.Weekly_Summary,  week,  visitor, pageView, isDemo, isQuick, isConsultation, isChatbot, isFeedback, isLead, duration);
      updateBucket_(buckets.Monthly_Summary, month, visitor, pageView, isDemo, isQuick, isConsultation, isChatbot, isFeedback, isLead, duration);
    }
  }

  writeSummary_(ss, "Daily_Summary",   buckets.Daily_Summary);
  writeSummary_(ss, "Weekly_Summary",  buckets.Weekly_Summary);
  writeSummary_(ss, "Monthly_Summary", buckets.Monthly_Summary);
}

function updateBucket_(all, key, visitor, pageView, demo, quick, consultation, chatbot, feedback, lead, duration) {
  if (!all[key]) {
    all[key] = { events: 0, visitors: {}, pageViews: 0, demos: 0, quick: 0,
                 consultations: 0, chatbot: 0, feedback: 0, leads: 0,
                 durationTotal: 0, durationCount: 0 };
  }
  var b = all[key];
  b.events++;
  if (visitor)      b.visitors[visitor] = true;
  if (pageView)     b.pageViews++;
  if (demo)         b.demos++;
  if (quick)        b.quick++;
  if (consultation) b.consultations++;
  if (chatbot)      b.chatbot++;
  if (feedback)     b.feedback++;
  if (lead)         b.leads++;
  if (duration > 0) { b.durationTotal += duration; b.durationCount++; }
}

function writeSummary_(ss, tabName, bucket) {
  var sheet   = getTab(ss, tabName);
  var headers = TAB_HEADERS[tabName];
  sheet.clearContents();
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  styleHeader_(sheet, headers.length);

  var keys = Object.keys(bucket).sort().reverse();
  var rows = keys.map(function (key) {
    var b        = bucket[key];
    var visitors = Object.keys(b.visitors).length;
    var rate     = visitors ? (b.leads / visitors * 100).toFixed(1) + "%" : "0.0%";
    var avg      = b.durationCount ? Math.round(b.durationTotal / b.durationCount) : 0;
    // 12 columns: key, events, visitors, pageViews, demos, quick, consultations,
    //             chatbot, feedback, leads, rate, avg
    return [key, b.events, visitors, b.pageViews, b.demos, b.quick,
            b.consultations, b.chatbot, b.feedback, b.leads, rate, avg];
  });
  if (rows.length) sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
}

/* ----------------------------- TEST HELPERS ------------------------------- */

function TEST_ICPDemoRequest() {
  var p = enrichPayload_({ action: "icp_lead", form_type: "icp_lead",
    full_name: "TEST — ICP Demo", contact: EMAIL_CONFIG.adminEmail,
    organization_type: "Physiotherapy Clinic", pageUrl: CONFIG.WEBSITE });
  var ss = getSpreadsheet();
  appendEvent_(ss, p); saveDemo_(ss, p);
  sendLeadAlert_(p, "TEST — ICP Demo Request");
  return "ICP demo test row written. Check Demo_Requests, Lead_Management, Live_Traffic_Events and email.";
}

function TEST_QuickEnquiry() {
  var p = enrichPayload_({ action: "lead_submission", form_type: "quick_enquiry",
    full_name: "TEST — Quick Enquiry", contact: EMAIL_CONFIG.adminEmail,
    message: "Test quick enquiry — delete this row.", pageUrl: CONFIG.WEBSITE + "contact" });
  var ss = getSpreadsheet();
  appendEvent_(ss, p); saveQuickEnquiry_(ss, p);
  sendLeadAlert_(p, "TEST — Quick Enquiry");
  return "Quick enquiry test row written. Check Quick_Enquiries, Lead_Management and email.";
}

function TEST_ConsultationRequest() {
  var p = enrichPayload_({ action: "lead_submission", form_type: "consultation",
    full_name: "TEST — Consultation", email: EMAIL_CONFIG.adminEmail,
    organization: "Test Clinic", job_title: "Director",
    challenge: "Need remote monitoring", requirements: "Mobile support",
    message: "Test consultation — delete this row.", pageUrl: CONFIG.WEBSITE + "contact" });
  var ss = getSpreadsheet();
  appendEvent_(ss, p); saveConsultation_(ss, p);
  sendLeadAlert_(p, "TEST — Consultation Request");
  return "Consultation test row written. Check Consultation_Requests, Lead_Management and email.";
}

function TEST_AppointmentBooking() {
  var today = new Date();
  var tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
  var dateStr = Utilities.formatDate(tomorrow, CONFIG.TIMEZONE, "yyyy-MM-dd");
  var ref = "PHY-TEST-" + Math.random().toString(36).substring(2, 6).toUpperCase();

  var p = enrichPayload_({
    action: "booking_submission",
    form_type: "appointment_booking",
    booking_ref: ref,
    full_name: "Jane Gracy (Test Booking)",
    email: EMAIL_CONFIG.adminEmail,
    phone: "+91 78450 72426",
    organization: "Physiomatics Clinic",
    job_title: "Clinical Director",
    consultation_type: "Physiotherapy Consultation",
    goal: "Evaluate AI movement analysis for post-op ACL rehab",
    preferred_date: dateStr,
    preferred_time: "15:00",
    format: "Online (Google Meet)",
    timezone: "Asia/Kolkata",
    language: "English",
    message: "Test appointment booking created from Apps Script test runner.",
    pageUrl: CONFIG.WEBSITE + "book"
  });

  var ss = getSpreadsheet();
  appendEvent_(ss, p);
  saveAppointmentBooking_(ss, p);
  sendBookingAlertToAdmin_(p);
  sendBookingConfirmationToVisitor_(p);
  var calEventId = createBookingCalendarEvent_(p);

  return "Success! Check Appointment_Bookings sheet, your inbox (" + EMAIL_CONFIG.adminEmail + ") for confirmation + admin alert emails, and Google Calendar for the scheduled event (" + (calEventId || "created") + "). Ref: " + ref;
}

function TEST_ChatbotMessage() {
  var p = enrichPayload_({ action: "chatbot_inquiry", form_type: "assistant_chat",
    message: "What does Physiomatics do?", context_node: "start",
    pageUrl: CONFIG.WEBSITE });
  var ss = getSpreadsheet();
  appendEvent_(ss, p); saveChatbot_(ss, p);
  return "Chatbot test row written. Check Chatbot_Interactions and Live_Traffic_Events.";
}

function TEST_ScrollDepth() {
  var p = enrichPayload_({ action: "scroll_depth", section: "50%",
    time_on_page_sec: 14, pageUrl: CONFIG.WEBSITE });
  var ss = getSpreadsheet();
  appendEvent_(ss, p); routeTelemetry_(ss, p);
  return "Scroll depth(50%) test row written. Check Scroll_Engagement and Live_Traffic_Events.";
}

function TEST_SessionStart() {
  var p = enrichPayload_({ action: "session_start", form_type: "analytics",
    visit_number: 1, referrer: "", pageUrl: CONFIG.WEBSITE });
  var ss = getSpreadsheet();
  appendEvent_(ss, p); routeTelemetry_(ss, p);
  return "Session start test row written. Check Visitor_Sessions and Live_Traffic_Events.";
}

function TEST_SendDailyReport() { sendPeriodicExecutiveDigest("Daily"); }

/* -------------------------------- HELPERS --------------------------------- */

function appendValues_(sheet, row) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try { sheet.appendRow(row.map(safeCell_)); } finally { lock.releaseLock(); }
}

function safeCell_(value) {
  if (value === null || value === undefined) return "";
  if (typeof value === "number") return value;
  if (typeof value === "object") {
    try { value = JSON.stringify(value); } catch (e) { value = String(value); }
  }
  var s = String(value);
  if (/^[\s]*[=+\-@]/.test(s)) return "'" + s;
  return s;
}

function first_(obj, keys, fallback) {
  for (var i = 0; i < keys.length; i++) {
    if (obj[keys[i]] !== undefined && obj[keys[i]] !== null &&
        String(obj[keys[i]]).trim() !== "") return obj[keys[i]];
  }
  return fallback;
}

function str_(value)   { return value === undefined || value === null ? "" : String(value).trim(); }
function norm_(value)  { return str_(value).toLowerCase().replace(/[\s-]+/g, "_"); }
function number_(value){ var n = Number(value); return isFinite(n) ? n : 0; }

function routePath_(url) {
  return String(url || "/").replace(/^https?:\/\/[^/]+/i, "").split("?")[0].split("#")[0] || "/";
}

function formatDate_(date) {
  return Utilities.formatDate(date, CONFIG.TIMEZONE, "yyyy-MM-dd HH:mm:ss") + " IST";
}

function parseDate_(value) {
  if (!value) return null;
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value;
  var s = String(value).replace(" IST", "").trim().replace(" ", "T");
  var d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

function weekStart_(date) {
  var d = new Date(date.getTime());
  var day = d.getDay();
  d.setDate(d.getDate() - ((day + 6) % 7));
  return Utilities.formatDate(d, CONFIG.TIMEZONE, "yyyy-MM-dd");
}

function isEmail_(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || ""));
}

function html_(value) {
  return String(value === undefined || value === null ? "" : value)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function log_(action, status, details) {
  try {
    var ss = getSpreadsheet();
    var sheet = ss.getSheetByName("System_Logs");
    if (!sheet) {
      sheet = ss.insertSheet("System_Logs");
      sheet.getRange(1, 1, 1, 4).setValues([TAB_HEADERS.System_Logs]);
      styleHeader_(sheet, 4);
    }
    sheet.appendRow([formatDate_(new Date()), safeCell_(action), safeCell_(status), safeCell_(details)]);
  } catch (ignore) {
    console.log(action + " | " + status + " | " + details);
  }
}

function onOpen() {
  ENSURE_LINKEDIN_TRIGGER_ACTIVE_();
  SpreadsheetApp.getUi()
    .createMenu("Physiomatics Website Engine")
    .addItem("Initialize all tabs",                     "INITIALIZE_ALL_TABS")
    .addItem("Rebuild daily/weekly/monthly summaries",   "BUILD_AGGREGATED_INTERVAL_SUMMARIES")
    .addSeparator()
    .addItem("Sync Google Sheet leads to Airtable",      "SYNC_ALL_SHEET_DATA_TO_AIRTABLE")
    .addItem("Sync Google Sheet leads to Jira",          "SYNC_ALL_SHEET_LEADS_TO_JIRA")
    .addSeparator()
    .addItem("Sync YouTube comments now (manual)",       "SYNC_YOUTUBE_COMMENTS_AUTO")
    .addItem("Enable YouTube auto-sync (hourly trigger)","SETUP_YOUTUBE_AUTO_SYNC_TRIGGER")
    .addItem("Disable YouTube auto-sync",                "DELETE_YOUTUBE_AUTO_SYNC_TRIGGER")
    .addItem("Initialize YouTube raw leads tab",         "INITIALIZE_YOUTUBE_RAW_LEADS_TAB")
    .addSeparator()
    .addItem("Sync LinkedIn post leads now (manual)",       "SYNC_LINKEDIN_POSTS_AUTO")
    .addItem("Enable LinkedIn auto-sync (hourly trigger)",  "SETUP_LINKEDIN_AUTO_SYNC_TRIGGER")
    .addItem("Disable LinkedIn auto-sync",                  "DELETE_LINKEDIN_AUTO_SYNC_TRIGGER")
    .addItem("Initialize LinkedIn raw leads tab",           "INITIALIZE_LINKEDIN_RAW_LEADS_TAB")
    .addItem("Test: LinkedIn lead simulation",              "TEST_LINKEDIN_LEAD")
    .addSeparator()
    .addItem("Test: ICP demo request",                   "TEST_ICPDemoRequest")
    .addItem("Test: Quick enquiry",                      "TEST_QuickEnquiry")
    .addItem("Test: Consultation request",               "TEST_ConsultationRequest")
    .addItem("Test: Chatbot message",                    "TEST_ChatbotMessage")
    .addItem("Test: Scroll depth 50%",                   "TEST_ScrollDepth")
    .addItem("Test: Session start",                      "TEST_SessionStart")
    .addItem("Test: Send daily report email",            "TEST_SendDailyReport")
    .addSeparator()
    .addItem("Test: Jira connection",                    "TEST_JIRA_CONNECTION")
    .addItem("Test: Jira lead task with 8 subtasks",     "TEST_JiraLeadWithSubtasks")
    .addItem("Test: Jira daily report task",             "TEST_JiraDailyReportTask")
    .addSeparator()
    .addItem("Enable scheduled reports (all triggers)",  "setupPhysiomaticsTriggers")
    .addToUi();
}

/* --------------------------- AIRTABLE SYNC -------------------------------- */

function syncLeadToAirtable_(p) {
  if (!AIRTABLE_CONFIG.ENABLED) return false;
  var token = getAirtableToken_();
  if (!token) {
    log_("syncLeadToAirtable_", "WARN", "Missing Airtable token.");
    return false;
  }
  var baseId = String(AIRTABLE_CONFIG.BASE_ID || "").trim();
  if (!baseId || baseId.indexOf("PASTE_") === 0) {
    log_("syncLeadToAirtable_", "WARN", "Invalid Airtable Base ID.");
    return false;
  }

  try {
    var url = "https://api.airtable.com/v0/" + baseId + "/" + encodeURIComponent(AIRTABLE_CONFIG.TABLE_NAME);
    
    // Safely combine extras into Message so no valuable metadata is lost
    var extras = [];
    if (p.organization || p.author_headline) extras.push("Org/Headline: " + (p.organization || p.author_headline));
    if (p.jira_issue_key || p.jira_key || p.jira_key_primary) extras.push("Jira: " + (p.jira_issue_key || p.jira_key || p.jira_key_primary));
    if (p.author_profile_url) extras.push("Profile: " + p.author_profile_url);

    var rawMsg = p.message || p.content_text || "";
    var finalMsg = extras.length > 0 ? (rawMsg + (rawMsg ? "\n\n" : "") + "[" + extras.join(" | ") + "]") : rawMsg;

    var fields = {
      "Name": p.name || p.author_name || "Anonymous Visitor",
      "Email": p.email || "",
      "Phone": p.phone || "",
      "Interest": p.interest || "Physiomatics Platform",
      "Message": finalMsg,
      "Lead Type": p.lead_type || "LinkedIn Lead",
      "Page": p.page_path || p.post_url || "",
      "Lead ID": p.lead_id || p.interaction_id || "",
      "Visitor ID": p.visitor_id || "",
      "Session ID": p.session_id || "",
      "City": p.geo_city || "",
      "Country": p.geo_country || "India",
      "Received At": p.received_at || p.timestamp || formatDate_(new Date())
    };

    Object.keys(fields).forEach(function(k) {
      if (fields[k] === "") delete fields[k];
    });

    var options = {
      method: "post",
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      },
      payload: JSON.stringify({ records: [{ fields: fields }], typecast: true }),
      muteHttpExceptions: true
    };

    var res = UrlFetchApp.fetch(url, options);
    var code = res.getResponseCode();
    var success = code >= 200 && code < 300;
    log_("syncLeadToAirtable_", success ? "INFO" : "WARN", "Status: " + code + " Body: " + res.getContentText());
    return success;
  } catch (err) {
    log_("syncLeadToAirtable_", "ERROR", String(err));
    return false;
  }
}

// Alias for backwards compatibility
function syncSingleLeadToAirtable_(p) {
  return syncLeadToAirtable_(p);
}

function SYNC_ALL_SHEET_DATA_TO_AIRTABLE() {
  var token = getAirtableToken_();
  if (!token) {
    throw new Error("Missing Airtable Personal Access Token. Set AIRTABLE_CONFIG.TOKEN in Code.gs or AIRTABLE_TOKEN in Script properties.");
  }
  var baseId = String(AIRTABLE_CONFIG.BASE_ID || "").trim();
  if (!baseId || baseId.indexOf("PASTE_") === 0) {
    throw new Error("Please set AIRTABLE_CONFIG.BASE_ID to your Airtable Base ID (appXXXXXXXXXXXXXX) at the top of Code.gs");
  }

  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName("Lead_Management");
  if (!sheet || sheet.getLastRow() < 2) {
    return "No leads found in Lead_Management to sync.";
  }

  var data = sheet.getDataRange().getDisplayValues();
  var header = data[0];
  var rows = data.slice(1);
  var url = "https://api.airtable.com/v0/" + baseId + "/" + encodeURIComponent(AIRTABLE_CONFIG.TABLE_NAME);
  var syncedCount = 0;

  for (var i = 0; i < rows.length; i += 10) {
    var chunk = rows.slice(i, i + 10);
    var records = chunk.map(function(row) {
      var f = {};
      for (var col = 0; col < header.length; col++) {
        var key = header[col];
        var val = row[col];
        if (val) f[key] = val;
      }
      return { fields: f };
    });

    var options = {
      method: "post",
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      },
      payload: JSON.stringify({ records: records, typecast: true }),
      muteHttpExceptions: true
    };

    var res = UrlFetchApp.fetch(url, options);
    if (res.getResponseCode() === 200 || res.getResponseCode() === 201) {
      syncedCount += chunk.length;
    }
    Utilities.sleep(250);
  }

  log_("SYNC_ALL_SHEET_DATA_TO_AIRTABLE", "SUCCESS", "Synced " + syncedCount + " records.");
  return "Successfully synced " + syncedCount + " leads from Google Sheet to Airtable!";
}

function TEST_AIRTABLE_CONNECTION() {
  var token = getAirtableToken_();
  if (!token) throw new Error("Airtable token not found. Please provide token.");
  var baseId = String(AIRTABLE_CONFIG.BASE_ID || "").trim();
  var url = "https://api.airtable.com/v0/" + baseId + "/" + encodeURIComponent(AIRTABLE_CONFIG.TABLE_NAME) + "?maxRecords=1";
  var res = UrlFetchApp.fetch(url, {
    method: "get",
    headers: { "Authorization": "Bearer " + token },
    muteHttpExceptions: true
  });
  var code = res.getResponseCode();
  if (code < 200 || code >= 300) {
    throw new Error("Airtable connection failed (HTTP " + code + "): " + res.getContentText());
  }
  log_("TEST_AIRTABLE_CONNECTION", "SUCCESS", "Airtable connection verified.");
  return "Airtable connection successful!";
}

/* ----------------------------- JIRA INTEGRATION --------------------------- */

var JIRA_LEAD_SUBTASKS = [
  {
    summary: "1. Initial Clinical Lead Triage & Qualification",
    description: "Verify visitor profile, clinical specialty (orthopedic, neuro, pediatric, sports rehab), patient volume, and current pain points."
  },
  {
    summary: "2. Schedule Clinical Discovery & Demo Call",
    description: "Reach out via email / WhatsApp to coordinate a 30-minute interactive discovery meeting with the clinical lead or practice manager."
  },
  {
    summary: "3. Prepare Tailored Clinic Diagnostic Proposal",
    description: "Synthesize assessment protocols, computer-vision posture evaluation modules, and custom pricing based on clinic size."
  },
  {
    summary: "4. Conduct Live Platform Walkthrough",
    description: "Demonstrate AI posture tracking, patient dashboard, exercise compliance monitoring, and reporting suite."
  },
  {
    summary: "5. Technical Integration & EHR/EMR Feasibility Check",
    description: "Review clinic workflows, EHR/EMR compatibility, hardware setup (cameras/sensors), and HIPAA/GDPR readiness."
  },
  {
    summary: "6. Commercial Proposal & Pilot Licensing Setup",
    description: "Generate customized quotation, software tier pricing, pilot period terms, and send clinical SLA contract."
  },
  {
    summary: "7. Clinical Onboarding & Staff Training Session",
    description: "Schedule training workshop for physiotherapists, assign clinic admin credentials, and conduct trial run."
  },
  {
    summary: "8. Post-Onboarding Review & Satisfaction Check",
    description: "Review 14-day patient compliance data, collect feedback, address clinical questions, and ensure full operational adoption."
  }
];

function jiraBasicAuth_() {
  var token = getJiraApiToken_();
  var email = JIRA_CONFIG.EMAIL || "janegracy.int2027g3@gmail.com";
  if (!token) return "";
  return "Basic " + Utilities.base64Encode(email + ":" + token);
}

/**
 * Sends request to Jira Cloud REST API v3
 */
function jiraFetchForHost_(host, path, method, payload) {
  var auth = jiraBasicAuth_();
  if (!host) throw new Error("Missing JIRA_HOST. Set JIRA_CONFIG.HOST in Code.gs or Script Properties.");
  if (!auth) throw new Error("Missing JIRA_API_TOKEN. Set JIRA_CONFIG.API_TOKEN in Code.gs or Script Properties.");

  var url = "https://" + host + path;
  var options = {
    method: method || "get",
    headers: {
      "Authorization": auth,
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    muteHttpExceptions: true
  };
  if (payload) options.payload = JSON.stringify(payload);

  var res = UrlFetchApp.fetch(url, options);
  var code = res.getResponseCode();
  var body = res.getContentText();
  if (code < 200 || code >= 300) {
    throw new Error("Jira API error on " + host + " (HTTP " + code + "): " + body);
  }
  return JSON.parse(body || "{}");
}

function jiraFetch_(path, method, payload) {
  return jiraFetchForHost_(getJiraHost_(), path, method, payload);
}

/**
 * Creates parent Task in Jira for an incoming lead, followed by 8 operational Subtasks
 * Supports syncing to both personal Jira space and company space
 */
function createJiraLeadTaskWithSubtasks_(p) {
  if (!JIRA_CONFIG.ENABLED) return null;
  if (p.jira_issue_key || p.jira_key) {
    log_("createJiraLeadTaskWithSubtasks_", "INFO", "Jira task already created upstream: " + (p.jira_issue_key || p.jira_key));
    return p.jira_issue_key || p.jira_key;
  }
  var hosts = getJiraHosts_();
  var projectKey = getJiraProjectKey_();
  if (!hosts.length || !projectKey) {
    log_("createJiraLeadTaskWithSubtasks_", "SKIPPED", "Jira HOST or PROJECT_KEY not configured yet.");
    return null;
  }

  var firstParentKey = null;
  var totalSubCount = 0;

  hosts.forEach(function(host) {
    try {
      var leadKind = String(p.lead_type || "lead").toUpperCase();
      var summary = "[" + leadKind + "] " + (p.name || "New Visitor") + " — " + (p.organization || "Direct Patient");

      var descText = [
        "Lead Details:",
        "• Name: " + (p.name || "N/A"),
        "• Email: " + (p.email || "N/A"),
        "• Phone: " + (p.phone || "N/A"),
        "• Organization: " + (p.organization || "N/A"),
        "• Role: " + (p.role || "N/A"),
        "• Interest / Segment: " + (p.interest || "N/A"),
        "• Subject / Challenge: " + (p.subject || "N/A"),
        "• Location: " + [p.geo_city, p.geo_region, p.geo_country].filter(Boolean).join(", "),
        "• Source Page: " + (p.page_path || "N/A"),
        "• Received: " + (p.received_at || formatDate_(new Date())),
        "",
        "Enquiry / Message:",
        p.message || "No message provided."
      ].join("\n");

      var parentPayload = {
        fields: {
          project: { key: projectKey },
          summary: summary,
          description: descText,
          issuetype: { name: JIRA_CONFIG.TASK_ISSUE_TYPE || "Task" },
          labels: ["physiomatics-lead", norm_(p.lead_type || "web_lead").replace(/_/g, "-")]
        }
      };

      var parentResult = jiraFetchForHost_(host, "/rest/api/2/issue", "post", parentPayload);
      if (!parentResult || !parentResult.key) {
        log_("createJiraLeadTaskWithSubtasks_", "WARN", "Failed to create Jira parent task on " + host);
        return;
      }
      var parentKey = parentResult.key;
      if (!firstParentKey) firstParentKey = parentKey;
      log_("createJiraLeadTaskWithSubtasks_", "SUCCESS", "Created Jira Parent Task on " + host + ": " + parentKey);

      // Create the 8 Subtasks linked to parentKey
      var createdSubCount = 0;
      JIRA_LEAD_SUBTASKS.forEach(function(sub) {
        try {
          var subPayload = {
            fields: {
              project: { key: projectKey },
              parent: { key: parentKey },
              summary: sub.summary,
              description: sub.description,
              issuetype: { name: JIRA_CONFIG.SUBTASK_ISSUE_TYPE || "Sub-task" }
            }
          };
          jiraFetchForHost_(host, "/rest/api/2/issue", "post", subPayload);
          createdSubCount++;
        } catch (subErr) {
          log_("createJiraLeadTaskWithSubtasks_", "WARNING", "Subtask creation failed on " + host + " (" + sub.summary + "): " + String(subErr));
        }
      });

      totalSubCount += createdSubCount;
      log_("createJiraLeadTaskWithSubtasks_", "SUCCESS", "Host " + host + ": Parent " + parentKey + " with " + createdSubCount + "/8 subtasks created.");
    } catch (err) {
      log_("createJiraLeadTaskWithSubtasks_", "ERROR", "Failed on host " + host + ": " + String(err));
    }
  });

  return firstParentKey ? { parentKey: firstParentKey, subtasksCount: totalSubCount } : null;
}

/**
 * Creates scheduled Report Task in Jira for Daily, Weekly, or Monthly trigger digests
 * Supports syncing across all configured Jira spaces
 */
function createJiraReportTask_(r) {
  if (!JIRA_CONFIG.ENABLED) return null;
  var hosts = getJiraHosts_();
  var projectKey = getJiraProjectKey_();
  if (!hosts.length || !projectKey) return null;

  var firstReportKey = null;

  hosts.forEach(function(host) {
    try {
      var summary = "📊 [Physiomatics " + r.interval + " Digest] " + r.period + " — " + r.visitors + " Visitors, " + r.leads + " Leads (" + r.conversionRate + ")";
      var topEmailSummary = (r.topEmails && r.topEmails.length > 0)
        ? "\nTop Repeated Lead Emails:\n" + r.topEmails.map(function(e, i) { return "  " + (i + 1) + ". " + e.email + " (" + e.name + ") — " + e.count + "x [" + e.source + "]"; }).join("\n")
        : "";

      var descText = [
        "Physiomatics " + r.interval + " Performance Digest",
        "Period: " + r.period,
        "Unique Visitors: " + r.visitors,
        "Total Page Views: " + r.pageViews,
        "Total Omnichannel Leads: " + r.leads + " (" + r.conversionRate + ")",
        "  • Telegram Leads: " + (r.telegramLeads || 0),
        "  • YouTube Enquiries: " + (r.youtubeLeads || 0),
        "  • LinkedIn Enquiries: " + (r.linkedinLeads || 0),
        "  • Demo / ICP Requests: " + r.demos,
        "  • Consultation Requests: " + r.consultations,
        "  • Quick Enquiries: " + r.quickEnquiries,
        "  • AI Chatbot Inquiries: " + r.chatbotMessages,
        "Avg Engagement Duration: " + r.avgEngagementSec + "s",
        topEmailSummary,
        "Live Google Sheet: " + (r.sheetUrl || CONFIG.WEBSITE)
      ].filter(Boolean).join("\n");

      var payload = {
        fields: {
          project: { key: projectKey },
          summary: summary,
          description: descText,
          issuetype: { name: JIRA_CONFIG.TASK_ISSUE_TYPE || "Task" },
          labels: ["physiomatics-report", (r.interval || "daily").toLowerCase() + "-digest"]
        }
      };

      var result = jiraFetchForHost_(host, "/rest/api/2/issue", "post", payload);
      if (!firstReportKey) firstReportKey = result.key;
      log_("createJiraReportTask_", "SUCCESS", "Created Jira Report Task on " + host + ": " + result.key);
    } catch (err) {
      log_("createJiraReportTask_", "ERROR", "Failed report creation on " + host + ": " + String(err));
    }
  });

  return firstReportKey;
}

/**
 * Sync existing leads from Lead_Management sheet to Jira
 */
function SYNC_ALL_SHEET_LEADS_TO_JIRA() {
  if (!JIRA_CONFIG.ENABLED) throw new Error("Jira integration is disabled in JIRA_CONFIG.");
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName("Lead_Management");
  if (!sheet || sheet.getLastRow() < 2) return "No leads found in Lead_Management to sync.";

  var data = sheet.getDataRange().getDisplayValues();
  var header = data[0];
  var index = {};
  header.forEach(function(name, i) { index[String(name).trim()] = i; });
  function cell(row, key) { var i = index[key]; return i === undefined ? "" : row[i]; }

  var rows = data.slice(1);
  var count = 0;
  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    var p = {
      received_at: cell(row, "received_at"),
      lead_id: cell(row, "lead_id"),
      lead_type: cell(row, "lead_type"),
      name: cell(row, "name"),
      email: cell(row, "email"),
      phone: cell(row, "phone"),
      organization: cell(row, "organization"),
      role: cell(row, "role"),
      interest: cell(row, "interest"),
      subject: cell(row, "subject"),
      message: cell(row, "message"),
      page_path: cell(row, "page_path")
    };
    var res = createJiraLeadTaskWithSubtasks_(p);
    if (res && res.parentKey) count++;
    Utilities.sleep(400);
  }

  log_("SYNC_ALL_SHEET_LEADS_TO_JIRA", "SUCCESS", "Created " + count + " Jira parent lead tasks with subtasks.");
  return "Successfully created " + count + " Jira lead tasks (each with 8 subtasks) from Google Sheet!";
}

function TEST_JIRA_CONNECTION() {
  var user = jiraFetch_("/rest/api/3/myself", "get");
  log_("TEST_JIRA_CONNECTION", "SUCCESS", "Connected as: " + (user.displayName || user.emailAddress));
  return "Jira connection successful! Connected as: " + (user.displayName || user.emailAddress);
}

function TEST_JiraLeadWithSubtasks() {
  var testLead = {
    name: "Dr. Anita Roy (Jira Pipeline Test)",
    email: "anita.roy.test@example.com",
    phone: "+91 98765 43210",
    organization: "Apex Physiotherapy & Sports Care",
    role: "Clinical Director",
    interest: "Sports Biomechanics & Patient Monitoring",
    subject: "Automated Gait & Rehabilitation Tracking",
    message: "Interested in Physiomatics pilot for 4 clinics. Evaluating AI range-of-motion sensor suite.",
    lead_type: "consultation_request",
    page_path: "/contact",
    city: "Bengaluru",
    country: "India",
    received_at: formatDate_(new Date())
  };
  var res = createJiraLeadTaskWithSubtasks_(testLead);
  if (!res || !res.parentKey) {
    throw new Error("Failed to create Jira lead task. Check JIRA_HOST and JIRA_PROJECT_KEY.");
  }
  return "Successfully created Jira task " + res.parentKey + " with " + res.subtasksCount + "/8 subtasks!";
}

function TEST_JiraDailyReportTask() {
  var reportKey = createJiraReportTask_({
    interval: "Daily",
    period: Utilities.formatDate(new Date(), CONFIG.TIMEZONE, "yyyy-MM-dd"),
    visitors: 48,
    pageViews: 142,
    leads: 6,
    conversionRate: "12.5%",
    avgEngagementSec: 74,
    demos: 2,
    consultations: 3,
    quickEnquiries: 1,
    chatbotMessages: 8,
    sheetUrl: getSpreadsheet().getUrl()
  });
  if (!reportKey) throw new Error("Failed to create Jira daily report task. Check JIRA_HOST and JIRA_PROJECT_KEY.");
  return "Successfully created Jira Daily Report task: " + reportKey;
}

/* ============================================================================
   YOUTUBE AUTO-SYNC ENGINE
   ----------------------------------------------------------------------------
   Periodically and automatically:
   1. Refreshes OAuth 2.0 access token using YOUTUBE_CONFIG.REFRESH_TOKEN.
   2. Fetches comment threads & replies from monitored YouTube video(s).
   3. Detects patient/client enquiries & booking intent.
   4. Avoids duplicates in YouTube_Raw_Leads sheet and Jira.
   5. Automatically creates Jira Parent Task + 8 Subtasks on both Jira hosts.
   6. Saves the raw lead data directly into Google Sheets ("YouTube_Raw_Leads").
   7. Operates 24/7 in Google Cloud via Apps Script time-driven triggers.
   ============================================================================ */

/**
 * Classifies comment text for sales, clinic, consultation, or pricing intent.
 */
function ytIsEnquiry_(text) {
  if (!text || !String(text).trim()) return false;
  var patterns = [
    /\b(price|pricing|cost|fee|charge|how much|quote)\b/i,
    /\b(demo|appointment|consultation|consult|book|booking|session|trial)\b/i,
    /\b(contact|email|phone|whatsapp|reach out|call me|message me)\b/i,
    /\b(clinic|hospital|physio|physiotherapist|patient|treatment|therapy|rehab)\b/i,
    /\b(license|licensing|subscription|plan|software|features|integration)\b/i,
    /\b(pain|injury|exercise|posture|biomechanics|assessment)\b/i,
    /\b(help|interested|available|how to buy|where to get)\b/i,
    /\b(url|link|website|web|portal|app|info|information|details|share|send|access)\b/i
  ];
  return patterns.some(function(p) { return p.test(text); });
}

/**
 * Obtains a fresh YouTube Data API v3 OAuth Access Token using the refresh token.
 */
function getYouTubeAccessToken_() {
  var clientId = YOUTUBE_CONFIG.CLIENT_ID;
  var clientSecret = YOUTUBE_CONFIG.CLIENT_SECRET;
  var refreshToken = getYouTubeRefreshToken_();

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Missing YouTube OAuth configuration (CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN).");
  }

  var tokenUrl = "https://oauth2.googleapis.com/token";
  var payload = {
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: "refresh_token"
  };

  var res = UrlFetchApp.fetch(tokenUrl, {
    method: "post",
    payload: payload,
    muteHttpExceptions: true
  });

  var code = res.getResponseCode();
  var body = res.getContentText();
  if (code < 200 || code >= 300) {
    throw new Error("Failed to refresh YouTube access token (HTTP " + code + "): " + body);
  }

  var json = JSON.parse(body);
  return json.access_token;
}

/**
 * Fetches comment threads (including replies) for a YouTube video.
 * Checks both published comments and held-for-review comments so leads containing
 * phone numbers, emails, or contact keywords are never dropped by YouTube's filters.
 */
function fetchYouTubeComments_(token, videoId, maxResults) {
  maxResults = maxResults || YOUTUBE_CONFIG.MAX_RESULTS || 100;
  var list = [];
  var seenIds = [];

  var endpoints = [
    "https://www.googleapis.com/youtube/v3/commentThreads?part=snippet,replies&videoId=" + encodeURIComponent(videoId) + "&maxResults=" + maxResults + "&textFormat=plainText",
    "https://www.googleapis.com/youtube/v3/commentThreads?part=snippet,replies&videoId=" + encodeURIComponent(videoId) + "&maxResults=" + maxResults + "&moderationStatus=heldForReview&textFormat=plainText"
  ];

  endpoints.forEach(function(url) {
    try {
      var res = UrlFetchApp.fetch(url, {
        method: "get",
        headers: { "Authorization": "Bearer " + token },
        muteHttpExceptions: true
      });

      if (res.getResponseCode() !== 200) return;

      var data = JSON.parse(res.getContentText() || "{}");
      var items = data.items || [];

      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var top = (item.snippet && item.snippet.topLevelComment && item.snippet.topLevelComment.snippet) ? item.snippet.topLevelComment.snippet : {};
        var commentId = item.id || (item.snippet && item.snippet.topLevelComment ? item.snippet.topLevelComment.id : "");
        if (!commentId || seenIds.indexOf(commentId) !== -1) continue;
        seenIds.push(commentId);

        // Auto-approve if held for review so it's not hidden
        if (top.moderationStatus === "heldForReview") {
          try {
            UrlFetchApp.fetch("https://www.googleapis.com/youtube/v3/comments/setModerationStatus?id=" + encodeURIComponent(commentId) + "&moderationStatus=published", {
              method: "post",
              headers: { "Authorization": "Bearer " + token },
              muteHttpExceptions: true
            });
            log_("fetchYouTubeComments_", "INFO", "Auto-approved held-for-review comment " + commentId);
          } catch (modErr) {
            log_("fetchYouTubeComments_", "WARN", "Moderation approval error: " + String(modErr));
          }
        }

        var replies = [];
        if (item.replies && item.replies.comments) {
          for (var j = 0; j < item.replies.comments.length; j++) {
            var r = item.replies.comments[j];
            var rSnippet = r.snippet || {};
            replies.push({
              id: r.id,
              author: rSnippet.authorDisplayName || "Viewer",
              text: rSnippet.textOriginal || rSnippet.textDisplay || "",
              publishedAt: rSnippet.publishedAt || ""
            });
          }
        }

        list.push({
          id: commentId,
          authorDisplayName: top.authorDisplayName || "Viewer",
          authorChannelUrl: (top.authorChannelUrl && top.authorChannelUrl.value) ? top.authorChannelUrl.value : (top.authorChannelUrl || ""),
          text: top.textOriginal || top.textDisplay || "",
          publishedAt: top.publishedAt || "",
          videoId: (item.snippet && item.snippet.videoId) ? item.snippet.videoId : videoId,
          replies: replies
        });
      }
    } catch (err) {
      log_("fetchYouTubeComments_", "WARN", "Error fetching from endpoint: " + String(err));
    }
  });

  return list;
}

/**
 * Retrieves the video title for cleaner Jira and Sheet logging.
 */
function getYouTubeVideoTitle_(token, videoId) {
  try {
    var url = "https://www.googleapis.com/youtube/v3/videos?part=snippet&id=" + encodeURIComponent(videoId);
    var res = UrlFetchApp.fetch(url, {
      method: "get",
      headers: { "Authorization": "Bearer " + token },
      muteHttpExceptions: true
    });
    if (res.getResponseCode() === 200) {
      var data = JSON.parse(res.getContentText() || "{}");
      if (data.items && data.items.length > 0 && data.items[0].snippet) {
        return data.items[0].snippet.title || "Physiomatics Video";
      }
    }
  } catch (err) {
    log_("getYouTubeVideoTitle_", "WARN", String(err));
  }
  return "Physiomatics Video (" + videoId + ")";
}

/**
 * Checks if a comment ID has already been recorded in column B of YouTube_Raw_Leads.
 */
function ytCommentAlreadyInSheet_(sheet, commentId) {
  if (!commentId) return false;
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return false;
  var ids = sheet.getRange(2, 2, lastRow - 1, 1).getValues();
  var target = String(commentId).trim();
  for (var i = 0; i < ids.length; i++) {
    if (String(ids[i][0]).trim() === target) {
      return true;
    }
  }
  return false;
}

/**
 * Creates Jira Parent Task + 8 Subtasks for a YouTube comment enquiry across configured Jira spaces.
 */
function ytCreateJiraLead_(comment, videoTitle) {
  if (!JIRA_CONFIG.ENABLED) return { primaryKey: "", secondaryKey: "", alreadyExists: false };
  var hosts = getJiraHosts_();
  var projectKey = getJiraProjectKey_();
  if (!hosts.length || !projectKey) return { primaryKey: "", secondaryKey: "", alreadyExists: false };

  var cleanId = String(comment.id || "").replace(/[^a-zA-Z0-9_-]/g, "");
  var videoRef = videoTitle ? 'Video: "' + videoTitle + '"' : "Video ID: " + comment.videoId;
  var videoUrl = comment.videoId ? "https://www.youtube.com/watch?v=" + comment.videoId : "";
  var summary = "[YOUTUBE_ENQUIRY] " + comment.authorDisplayName + " — " + videoRef;

  var repliesText = (comment.replies && comment.replies.length > 0)
    ? "\n\n*Thread Replies:*\n" + comment.replies.map(function(r) { return "• " + r.author + ": \"" + r.text + "\" (" + r.publishedAt + ")"; }).join("\n")
    : "";

  var descText = [
    "*YouTube Lead / Enquiry Details:*",
    "• *Author / Name:* " + comment.authorDisplayName,
    "• *Video Title:* " + videoTitle,
    "• *Comment ID:* " + comment.id,
    "• *Published At:* " + comment.publishedAt,
    "• *Channel URL:* " + (comment.authorChannelUrl || "N/A"),
    "• *Video URL:* " + (videoUrl || "N/A"),
    "",
    "*Comment Enquiry:*",
    "\"" + comment.text + "\"",
    repliesText
  ].filter(Boolean).join("\n");

  var keys = {};

  hosts.forEach(function(host) {
    try {
      // Deduplication: search for existing Jira issue with this comment label (API v2)
      var jql = 'project = "' + projectKey + '" AND labels = "yt-comment-' + cleanId + '"';
      var searchRes = jiraFetchForHost_(host, "/rest/api/2/search?jql=" + encodeURIComponent(jql) + "&maxResults=1&fields=key", "get");
      if (searchRes && searchRes.issues && searchRes.issues.length > 0) {
        var existingKey = searchRes.issues[0].key;
        keys[host] = existingKey;
        log_("ytCreateJiraLead_", "INFO", "Comment " + cleanId + " already in Jira " + host + " as " + existingKey);
        return;
      }

      // API v2 — plain text description (no ADF required)
      var parentPayload = {
        fields: {
          project: { key: projectKey },
          summary: summary,
          description: descText,
          issuetype: { name: JIRA_CONFIG.TASK_ISSUE_TYPE || "Task" },
          labels: ["physiomatics-lead", "youtube-enquiry", "yt-comment-" + cleanId]
        }
      };

      var parentResult = jiraFetchForHost_(host, "/rest/api/2/issue", "post", parentPayload);
      if (!parentResult || !parentResult.key) {
        log_("ytCreateJiraLead_", "WARN", "Failed to create Jira parent task on " + host);
        return;
      }
      var parentKey = parentResult.key;
      keys[host] = parentKey;
      log_("ytCreateJiraLead_", "SUCCESS", "Created YouTube lead parent Task on " + host + ": " + parentKey);

      // Create 8 standard operational subtasks (API v2 — plain text)
      var subtasks = [
        { summary: "1. Initial Contact & Channel Reply (YouTube / DM)", description: "Acknowledge receipt on YouTube, reply with portal link or direct message, and verify lead details." },
        { summary: "2. Clinical & Organizational Assessment", description: "Assess clinical requirements, clinic/hospital capacity, patient volume, and biomechanics specialization needs." },
        { summary: "3. Schedule Discovery & Live Demo Session", description: "Coordinate calendar invite with senior consultant and prepare tailored Physiomatics platform demo." },
        { summary: "4. Conduct Live Platform Walkthrough", description: "Demonstrate AI posture tracking, patient dashboard, exercise compliance monitoring, and reporting suite." },
        { summary: "5. Technical Integration & EHR/EMR Feasibility Check", description: "Review clinic workflows, EHR/EMR compatibility, hardware setup (cameras/sensors), and HIPAA/GDPR readiness." },
        { summary: "6. Commercial Proposal & Pilot Licensing Setup", description: "Generate customized quotation, software tier pricing, pilot period terms, and send clinical SLA contract." },
        { summary: "7. Clinical Onboarding & Staff Training Session", description: "Schedule training workshop for physiotherapists, assign clinic admin credentials, and conduct trial run." },
        { summary: "8. Post-Onboarding Review & Satisfaction Check", description: "Review 14-day patient compliance data, collect feedback, address clinical questions, and ensure full operational adoption." }
      ];

      subtasks.forEach(function(sub) {
        try {
          jiraFetchForHost_(host, "/rest/api/2/issue", "post", {
            fields: {
              project: { key: projectKey },
              parent: { key: parentKey },
              summary: sub.summary + " [" + parentKey + "]",
              description: sub.description,
              issuetype: { name: JIRA_CONFIG.SUBTASK_ISSUE_TYPE || "Sub-task" }
            }
          });
        } catch (subErr) {
          log_("ytCreateJiraLead_", "WARN", "Subtask creation failed on " + host + " (" + sub.summary + "): " + String(subErr));
        }
      });
    } catch (err) {
      log_("ytCreateJiraLead_", "ERROR", "Jira task creation error on " + host + ": " + String(err));
    }
  });

  var primaryKey = keys[hosts[0]] || "";
  var secondaryKey = hosts[1] ? (keys[hosts[1]] || "") : "";
  return { primaryKey: primaryKey, secondaryKey: secondaryKey };
}

/**
 * MASTER ORCHESTRATOR — Automatically called by time trigger or manual menu item.
 * Syncs YouTube video comments into YouTube_Raw_Leads tab and creates Jira leads.
 */
function SYNC_YOUTUBE_COMMENTS_AUTO() {
  log_("SYNC_YOUTUBE_COMMENTS_AUTO", "INFO", "Starting automated YouTube comments sync...");
  try {
    var ss = getSpreadsheet();
    var sheet = getTab(ss, "YouTube_Raw_Leads");

    var token = getYouTubeAccessToken_();
    var videoIds = (YOUTUBE_CONFIG.MONITOR_VIDEO_IDS || "eRGcQo4qWiM").split(",").map(function(s) { return s.trim(); }).filter(Boolean);

    var totalChecked = 0;
    var totalNewLeads = 0;
    var totalStored = 0;

    videoIds.forEach(function(videoId) {
      var videoTitle = getYouTubeVideoTitle_(token, videoId);
      var comments = fetchYouTubeComments_(token, videoId);
      var videoUrl = "https://www.youtube.com/watch?v=" + videoId;

      comments.forEach(function(comment) {
        totalChecked++;
        var isEnquiry = ytIsEnquiry_(comment.text);
        var inSheet = ytCommentAlreadyInSheet_(sheet, comment.id);

        if (inSheet) {
          return; // Already in sheet — avoid duplicate row
        }

        var authorName = String(comment.authorDisplayName || "YouTube Viewer");
        var commentText = String(comment.text || "");
        var replyText = (comment.replies || []).map(function(r) { return r.author + ": " + r.text; }).join(" | ");

        // ── 1. Jira Task + 8 Subtasks (only for enquiry-intent comments) ────
        var jiraKeyPrimary = "";
        var jiraKeySecondary = "";
        if (isEnquiry) {
          totalNewLeads++;
          try {
            var jiraRes = ytCreateJiraLead_(comment, videoTitle);
            jiraKeyPrimary = jiraRes.primaryKey || "";
            jiraKeySecondary = jiraRes.secondaryKey || "";
          } catch (jiraErr) {
            log_("SYNC_YOUTUBE_COMMENTS_AUTO", "WARN", "Jira creation error for comment " + comment.id + ": " + String(jiraErr));
          }
        }

        // ── 2. Airtable Sync (all comments, mark type) ─────────────────────
        var airtableStatus = "skipped";
        try {
          if (AIRTABLE_CONFIG.ENABLED && getAirtableToken_()) {
            airtableStatus = syncSingleLeadToAirtable_({
              name: authorName,
              email: "",
              phone: "",
              organization: "YouTube Channel Engagement",
              role: "YouTube Viewer",
              lead_type: isEnquiry ? "YouTube ENQUIRY" : "YouTube COMMENT",
              interest: isEnquiry ? "YouTube Comment Enquiry" : "YouTube Channel Engagement",
              message: commentText || ("Commented on: " + videoUrl),
              page_path: videoUrl,
              jira_issue_key: jiraKeyPrimary
            }) ? "synced" : "error";
          }
        } catch (atErr) {
          log_("SYNC_YOUTUBE_COMMENTS_AUTO", "WARN", "Airtable sync error: " + String(atErr));
          airtableStatus = "error";
        }

        // ── 3. Telegram Alert ───────────────────────────────────────────────
        var telegramStatus = "skipped";
        if (isEnquiry) {
          try {
            var tMsg = "\uD83C\uDFAC <b>New YouTube " + (isEnquiry ? "ENQUIRY" : "Comment") + " Lead!</b>\n\n" +
              "\uD83D\uDC64 <b>Author:</b> " + authorName + "\n" +
              "\uD83C\uDFAC <b>Video:</b> " + videoTitle + "\n" +
              (commentText ? "\uD83D\uDCAC <b>Comment:</b> " + commentText + "\n" : "") +
              "\uD83D\uDD17 <b>Video URL:</b> " + videoUrl + "\n" +
              (jiraKeyPrimary ? "\uD83C\uDFAB <b>Jira:</b> " + jiraKeyPrimary + "\n" : "") +
              "\uD83D\uDD52 " + new Date().toISOString();
            telegramStatus = sendTelegramMessage_(tMsg) ? "sent" : "failed";
          } catch (teleErr) {
            log_("SYNC_YOUTUBE_COMMENTS_AUTO", "WARN", "Telegram error: " + String(teleErr));
            telegramStatus = "failed";
          }
        }

        // ── 4. Email Alert (enquiries only) ─────────────────────────────────
        var emailStatus = "skipped";
        if (isEnquiry && CONFIG.ENABLE_EMAIL_NOTIFICATIONS && EMAIL_CONFIG.leadEmails.length) {
          try {
            MailApp.sendEmail({
              to: EMAIL_CONFIG.leadEmails.join(","),
              subject: "\uD83C\uDFAC [YOUTUBE LEAD] " + authorName + " commented on \"" + videoTitle + "\"",
              body: "New YouTube comment enquiry:\n\n" +
                "Author: " + authorName + "\n" +
                "Channel: " + (comment.authorChannelUrl || "N/A") + "\n" +
                "Video: " + videoTitle + " (" + videoUrl + ")\n" +
                "Comment: " + commentText + "\n" +
                "Jira Ticket: " + (jiraKeyPrimary || "N/A") + "\n" +
                "Timestamp: " + new Date().toISOString(),
              name: "Physiomatics YouTube Intelligence"
            });
            emailStatus = "sent";
          } catch (mailErr) {
            log_("SYNC_YOUTUBE_COMMENTS_AUTO", "WARN", "Email error: " + String(mailErr));
            emailStatus = "failed";
          }
        }

        // ── 5. Append to YouTube_Raw_Leads Sheet ────────────────────────────
        appendValues_(sheet, [
          new Date().toISOString(),
          String(comment.id || ""),
          videoId,
          videoTitle,
          videoUrl,
          String(comment.authorChannelUrl || ""),
          authorName,
          String(comment.authorChannelUrl || ""),
          commentText,
          replyText,
          String(comment.publishedAt || ""),
          "",
          isEnquiry ? "TRUE" : "FALSE",
          "youtube_comment",
          jiraKeyPrimary,
          jiraKeySecondary,
          airtableStatus,
          telegramStatus,
          emailStatus,
          isEnquiry ? "lead_synced" : "comment_logged"
        ]);

        // ── 6. Also write to Lead_Management for unified reporting ───────────
        if (isEnquiry) {
          try {
            var leadSheet = getTab(ss, "Lead_Management");
            appendValues_(leadSheet, [
              new Date().toISOString(),
              "yt_" + comment.id,
              authorName,
              "", "",
              "YouTube Viewer", "",
              "YouTube ENQUIRY",
              "YouTube Comment Enquiry",
              commentText || "Commented on: " + videoUrl,
              videoUrl,
              "India",
              jiraKeyPrimary || "",
              "New",
              "", ""
            ]);
          } catch (lmErr) {
            log_("SYNC_YOUTUBE_COMMENTS_AUTO", "WARN", "Lead_Management append error: " + String(lmErr));
          }
        }

        totalStored++;
      });
    });

    var summaryMsg = "YouTube auto-sync completed. Checked: " + totalChecked + ", Stored: " + totalStored + ", New Leads: " + totalNewLeads;
    log_("SYNC_YOUTUBE_COMMENTS_AUTO", "SUCCESS", summaryMsg);
    if (totalNewLeads > 0) {
      sendTelegramMessage_("\uD83D\uDE80 <b>YouTube Leads Captured!</b>\n\nProcessed <b>" + totalNewLeads + "</b> new YouTube enquiry lead(s) into Jira, Sheets, Airtable!\n\uD83D\uDD52 " + new Date().toISOString());
    }
    return summaryMsg;
  } catch (err) {
    var errMsg = "YouTube auto-sync error: " + String(err.message || err);
    log_("SYNC_YOUTUBE_COMMENTS_AUTO", "ERROR", errMsg);
    return errMsg;
  }
}

/**
 * Activates an hourly time-driven trigger for SYNC_YOUTUBE_COMMENTS_AUTO.
 * Runs in Google Cloud 24/7 completely hands-free.
 */
function SETUP_YOUTUBE_AUTO_SYNC_TRIGGER() {
  DELETE_YOUTUBE_AUTO_SYNC_TRIGGER();

  var trigger = ScriptApp.newTrigger("SYNC_YOUTUBE_COMMENTS_AUTO")
    .timeBased()
    .everyHours(1)
    .create();

  log_("SETUP_YOUTUBE_AUTO_SYNC_TRIGGER", "SUCCESS", "Hourly YouTube sync trigger established. Trigger ID: " + trigger.getUniqueId());
  return "Hourly YouTube auto-sync trigger successfully activated! YouTube comments will be automatically checked and synced to Jira + Google Sheets every hour.";
}

/**
 * Removes any existing YouTube auto-sync triggers.
 */
function DELETE_YOUTUBE_AUTO_SYNC_TRIGGER() {
  var triggers = ScriptApp.getProjectTriggers();
  var count = 0;
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === "SYNC_YOUTUBE_COMMENTS_AUTO") {
      ScriptApp.deleteTrigger(triggers[i]);
      count++;
    }
  }
  log_("DELETE_YOUTUBE_AUTO_SYNC_TRIGGER", "SUCCESS", "Removed " + count + " existing triggers.");
  return "Removed " + count + " YouTube sync triggers.";
}

/**
 * Quick test function to run anytime from the Apps Script editor.
 */
function TEST_YouTubeAutoSync() {
  return SYNC_YOUTUBE_COMMENTS_AUTO();
}

/* ============================================================================
   LINKEDIN AUTO-SYNC & LEAD PROCESSING ENGINE
   ----------------------------------------------------------------------------
   Periodically and automatically:
   1. Captures comments, likes, reactions & shares from monitored LinkedIn posts.
   2. Deduplicates against LinkedIn_Raw_Leads tab.
   3. Automatically creates Jira Parent Task + 8 Subtasks for each prospect.
   4. Records lead into Google Sheets ("LinkedIn_Raw_Leads" & "Lead_Management").
   5. Synchronizes lead into Airtable "Leads" table.
   6. Dispatches instant Telegram alert with profile link.
   7. Dispatches instant HTML Email alert to janegracy.int2027g3@gmail.com.
   8. Operates 24/7 in Google Cloud via Apps Script time-driven triggers.
   ============================================================================ */

/**
 * Initializes the LinkedIn_Raw_Leads sheet tab if not present.
 */
function INITIALIZE_LINKEDIN_RAW_LEADS_TAB() {
  var ss = getSpreadsheet();
  getTab(ss, "LinkedIn_Raw_Leads");
  log_("INITIALIZE_LINKEDIN_RAW_LEADS_TAB", "SUCCESS", "LinkedIn_Raw_Leads tab ready.");
  return "LinkedIn_Raw_Leads tab initialized successfully.";
}

/**
 * Appends a LinkedIn lead into LinkedIn_Raw_Leads and dispatches multi-channel alerts.
 */
function saveLinkedInLead_(payload) {
  try {
    var ss = getSpreadsheet();
    var sheet = getTab(ss, "LinkedIn_Raw_Leads");
    var p = payload || {};

    var interactionId = String(p.interaction_id || ("li_" + Date.now() + "_" + Math.floor(Math.random()*1000))).trim();

    // Deduplication check
    var lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      var existingIds = sheet.getRange(2, 2, lastRow - 1, 1).getValues().map(function(r) { return String(r[0]).trim(); });
      if (existingIds.indexOf(interactionId) !== -1) {
        return json_({ success: true, skipped: true, reason: "duplicate_interaction_id", interaction_id: interactionId });
      }
    }

    var authorName = String(p.author_name || "LinkedIn Prospect");
    var authorHeadline = String(p.author_headline || "");
    var authorProfileUrl = String(p.author_profile_url || "");
    var interactionType = String(p.interaction_type || "comment").toLowerCase();
    var contentText = String(p.content_text || p.comment_text || "");
    var postUrl = String(p.post_url || "");
    var postUrn = String(p.post_urn || "");
    var isEnquiry = Boolean(contentText && ytIsEnquiry_(contentText));

    // 1. Jira Task + 8 Subtasks
    var jiraKeys = liCreateJiraLead_(p);
    var jiraPrimary = jiraKeys.primaryKey || "";
    var jiraSecondary = jiraKeys.secondaryKey || "";

    // 2. Airtable Sync
    var airtableStatus = "skipped";
    try {
      if (AIRTABLE_CONFIG.ENABLED && getAirtableToken_()) {
        airtableStatus = syncSingleLeadToAirtable_({
          name: authorName,
          email: p.email || "",
          phone: p.phone || "",
          organization: authorHeadline || "LinkedIn Lead",
          role: authorHeadline,
          lead_type: "LinkedIn " + interactionType.toUpperCase(),
          interest: "LinkedIn Post Engagement",
          message: contentText || ("Interacted on post: " + (postUrl || postUrn)),
          page_path: postUrl || "LinkedIn",
          jira_issue_key: jiraPrimary
        }) ? "synced" : "error";
      }
    } catch (atErr) {
      log_("saveLinkedInLead_", "WARN", "Airtable sync error: " + String(atErr));
      airtableStatus = "error";
    }

    // 3. Telegram Alert
    var telegramStatus = "skipped";
    try {
      var msg = "\ud83d\udcbc <b>New LinkedIn Lead (" + interactionType.toUpperCase() + ")</b>\n\n" +
        "\ud83d\udc64 <b>Name:</b> " + authorName + "\n" +
        (authorHeadline ? "\ud83d\udcbc <b>Headline:</b> " + authorHeadline + "\n" : "") +
        (authorProfileUrl ? "\ud83d\udd17 <b>Profile:</b> " + authorProfileUrl + "\n" : "") +
        (contentText ? "\ud83d\udcac <b>Message:</b> " + contentText + "\n" : "") +
        (postUrl ? "\ud83d\udcc4 <b>Post:</b> " + postUrl + "\n" : "") +
        (jiraPrimary ? "\ud83c\udfab <b>Jira:</b> " + jiraPrimary + "\n" : "") +
        "\n\ud83d\udd52 " + new Date().toISOString();

      telegramStatus = sendTelegramMessage_(msg) ? "sent" : "failed";
    } catch (teleErr) {
      log_("saveLinkedInLead_", "WARN", "Telegram error: " + String(teleErr));
      telegramStatus = "failed";
    }

    // 4. Email Alert
    var emailStatus = "skipped";
    try {
      if (CONFIG.ENABLE_EMAIL_NOTIFICATIONS && EMAIL_CONFIG.leadEmails.length) {
        var emailSubject = "💼 [LINKEDIN LEAD] " + authorName + " (" + interactionType.toUpperCase() + ")";
        var emailBody = "New lead engaged with your LinkedIn company post:\n\n" +
          "Name: " + authorName + "\n" +
          "Headline: " + authorHeadline + "\n" +
          "Profile URL: " + authorProfileUrl + "\n" +
          "Interaction: " + interactionType + "\n" +
          "Comment / Note: " + contentText + "\n" +
          "Post: " + postUrl + "\n" +
          "Jira Ticket: " + (jiraPrimary || "N/A") + "\n" +
          "Timestamp: " + new Date().toISOString();

        MailApp.sendEmail({
          to: EMAIL_CONFIG.leadEmails.join(","),
          subject: emailSubject,
          body: emailBody,
          name: "Physiomatics LinkedIn Intelligence"
        });
        emailStatus = "sent";
      }
    } catch (mailErr) {
      log_("saveLinkedInLead_", "WARN", "Email alert error: " + String(mailErr));
      emailStatus = "failed";
    }

    // 5. Append to LinkedIn_Raw_Leads
    appendValues_(sheet, [
      new Date().toISOString(),
      interactionId,
      interactionType,
      authorName,
      authorProfileUrl,
      authorHeadline,
      String(p.author_urn || ""),
      postUrl,
      postUrn,
      contentText,
      isEnquiry ? "TRUE" : "FALSE",
      "linkedin_post",
      jiraPrimary,
      jiraSecondary,
      airtableStatus,
      telegramStatus,
      emailStatus,
      "new"
    ]);

    // 6. Also write to Lead_Management for unified reporting
    try {
      var leadSheet = getTab(ss, "Lead_Management");
      appendValues_(leadSheet, [
        new Date().toISOString(),
        "linkedin_" + interactionId,
        authorName,
        p.email || "",
        p.phone || "",
        authorHeadline || "LinkedIn Lead",
        authorHeadline || "",
        "LinkedIn " + interactionType.toUpperCase(),
        "LinkedIn Post Engagement",
        contentText || "Engaged with company post",
        postUrl || "LinkedIn",
        "India",
        jiraPrimary || "",
        "New",
        "",
        ""
      ]);
    } catch (lmErr) {
      log_("saveLinkedInLead_", "WARN", "Lead_Management append error: " + String(lmErr));
    }

    log_("saveLinkedInLead_", "SUCCESS", "LinkedIn lead stored: " + interactionId + " by " + authorName);
    return json_({
      success: true,
      interaction_id: interactionId,
      author: authorName,
      jira_key: jiraPrimary,
      airtable: airtableStatus,
      telegram: telegramStatus,
      email: emailStatus
    });
  } catch (err) {
    log_("saveLinkedInLead_", "ERROR", String(err.message || err));
    return json_({ success: false, message: String(err.message || err) });
  }
}

/**
 * Creates Jira Parent Task + 8 Subtasks for a LinkedIn lead across configured hosts.
 */
function liCreateJiraLead_(lead) {
  if (!JIRA_CONFIG.ENABLED) return { primaryKey: "", secondaryKey: "" };
  var hosts = getJiraHosts_();
  var projectKey = getJiraProjectKey_();
  if (!hosts.length || !projectKey) return { primaryKey: "", secondaryKey: "" };

  var actionLabel = String(lead.interaction_type || "ENGAGEMENT").toUpperCase();
  var summary = "[LINKEDIN_" + actionLabel + "] " + (lead.author_name || "LinkedIn Prospect") + " — " + (lead.author_headline || "Direct Prospect");

  var descText = [
    "*LinkedIn Lead Details:*",
    "• *Author / Name:* " + (lead.author_name || "N/A"),
    "• *Headline / Role:* " + (lead.author_headline || "N/A"),
    "• *Profile URL:* " + (lead.author_profile_url || "N/A"),
    "• *Interaction Type:* " + (lead.interaction_type || "N/A"),
    "• *Post URL:* " + (lead.post_url || "N/A"),
    "• *Post URN:* " + (lead.post_urn || "N/A"),
    "• *Received At:* " + (lead.timestamp || new Date().toISOString()),
    "",
    "*Message / Comment:*",
    "\"" + (lead.content_text || lead.comment_text || "Engaged with company post.") + "\""
  ].join("\n");

  var keys = {};

  hosts.forEach(function(host) {
    try {
      var payload = {
        fields: {
          project: { key: projectKey },
          summary: summary,
          description: descText,
          issuetype: { name: JIRA_CONFIG.TASK_ISSUE_TYPE || "Task" },
          labels: ["physiomatics-lead", "linkedin-lead"]
        }
      };

      var res = jiraFetchForHost_(host, "/rest/api/2/issue", "post", payload);
      if (!res || !res.key) {
        log_("liCreateJiraLead_", "WARN", "Failed to create Jira parent task on " + host);
        return;
      }

      var parentKey = res.key;
      keys[host] = parentKey;
      log_("liCreateJiraLead_", "SUCCESS", "Created Jira Parent Task on " + host + ": " + parentKey);

      var subtasks = [
        { summary: "1. Direct Message & Identity Verification on LinkedIn", description: "Send connection request or DM acknowledging interaction on LinkedIn within 15 minutes." },
        { summary: "2. Clinical & Organizational Background Review", description: "Review member's LinkedIn profile, clinic affiliations, role, and rehabilitation interest." },
        { summary: "3. Schedule Platform Discovery & Demo Session", description: "Share calendar invite link for live Physiomatics platform demo." },
        { summary: "4. Conduct Live Platform Walkthrough", description: "Demonstrate AI posture tracking, patient dashboard, and compliance monitoring." },
        { summary: "5. Technical Integration & Camera Feasibility Check", description: "Review clinic workflows, EHR compatibility, and camera hardware setup." },
        { summary: "6. Commercial Proposal & Pilot Licensing Setup", description: "Send quotation, pricing tier, and pilot clinical terms." },
        { summary: "7. Clinical Onboarding & Staff Training Session", description: "Schedule workshop for clinic physiotherapists and assign staff credentials." },
        { summary: "8. Post-Onboarding Review & Satisfaction Check", description: "Review initial patient sessions and collect feedback." }
      ];

      subtasks.forEach(function(sub) {
        try {
          jiraFetchForHost_(host, "/rest/api/2/issue", "post", {
            fields: {
              project: { key: projectKey },
              parent: { key: parentKey },
              summary: sub.summary + " [" + parentKey + "]",
              description: sub.description,
              issuetype: { name: JIRA_CONFIG.SUBTASK_ISSUE_TYPE || "Sub-task" }
            }
          });
        } catch (subErr) {
          log_("liCreateJiraLead_", "WARN", "Subtask creation failed on " + host + ": " + String(subErr));
        }
      });
    } catch (err) {
      log_("liCreateJiraLead_", "ERROR", "Jira task creation error on " + host + ": " + String(err));
    }
  });

  return { primaryKey: keys[hosts[0]] || "", secondaryKey: hosts[1] ? (keys[hosts[1]] || "") : "" };
}

/**
/**
 * MASTER ORCHESTRATOR — Fetches new comments and reactions from monitored LinkedIn posts.
 * Uses LinkedIn REST API v202401.
 * Schedule: Run via SETUP_LINKEDIN_AUTO_SYNC_TRIGGER() (hourly trigger).
 */
function SYNC_LINKEDIN_POSTS_AUTO() {
  log_("SYNC_LINKEDIN_POSTS_AUTO", "INFO", "Starting automated LinkedIn sync...");
  try {
    var token = getLinkedInAccessToken_();
    var hasToken = Boolean(token && token.trim().length > 10);

    var postUrns = (LINKEDIN_CONFIG.MONITOR_POST_URNS || "")
      .split(",")
      .map(function(s) { return s.trim(); })
      .filter(Boolean);

    if (!postUrns.length) {
      log_("SYNC_LINKEDIN_POSTS_AUTO", "WARN", "No LinkedIn post URN configured.");
      return "No post URN configured.";
    }

    var totalProcessed = 0;

    postUrns.forEach(function(postUrn) {
      var encodedUrn = encodeURIComponent(postUrn);
      var postUrl    = "https://www.linkedin.com/feed/update/" + encodedUrn;
      var apiSucceeded = false;

      // ── 1. If Token is present, attempt Official REST API ───────────────────
      if (hasToken) {
        var headers = {
          "Authorization": "Bearer " + token,
          "LinkedIn-Version": "202503",
          "X-Restli-Protocol-Version": "2.0.0"
        };

        try {
          var cUrl = "https://api.linkedin.com/rest/socialActions/" + encodedUrn + "/comments?count=50&start=0";
          var cRes = UrlFetchApp.fetch(cUrl, { method: "get", headers: headers, muteHttpExceptions: true });
          var cCode = cRes.getResponseCode();

          if (cCode === 200) {
            apiSucceeded = true;
            var cData = JSON.parse(cRes.getContentText() || "{}");
            var elements = cData.elements || [];
            elements.forEach(function(c) {
              var actor = String(c.actor || c.commenter || "");
              var commentId = String(c.id || c["$URN"] || ("li_c_" + Date.now()));
              var commentText = (c.message && c.message.text) ? c.message.text : "";
              var personId = actor.replace("urn:li:person:", "").replace("urn:li:organization:", "");
              var displayName = (c.commenter && c.commenter.name) ? c.commenter.name : (c.created && c.created.actor && c.created.actor.name ? c.created.actor.name : "LinkedIn Member");

              saveLinkedInLead_({
                interaction_id: commentId,
                interaction_type: "comment",
                author_urn: actor,
                author_name: displayName,
                author_profile_url: actor ? ("https://www.linkedin.com/in/" + personId) : "",
                content_text: commentText,
                post_url: postUrl,
                post_urn: postUrn,
                timestamp: new Date().toISOString()
              });
              totalProcessed++;
            });
          }
        } catch (apiErr) {
          log_("SYNC_LINKEDIN_POSTS_AUTO", "WARN", "API call warning: " + String(apiErr));
        }
      }

      // ── 2. Public Autonomous Scraper Fallback (Zero-Token Mode) ───────────
      // If REST API is not available or returned non-200, parse live Schema.org JSON-LD
      if (!apiSucceeded) {
        try {
          var pubUrl = "https://www.linkedin.com/feed/update/" + postUrn;
          var pubRes = UrlFetchApp.fetch(pubUrl, {
            method: "get",
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            },
            muteHttpExceptions: true
          });

          if (pubRes.getResponseCode() === 200) {
            var html = pubRes.getContentText();
            var match = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i);
            if (match && match[1]) {
              var ld = JSON.parse(match[1]);
              var comments = ld.comment || [];
              comments.forEach(function(cm) {
                var aName = (cm.author && cm.author.name) ? cm.author.name : "LinkedIn Member";
                var cText = cm.text || "";
                var cDate = cm.datePublished || new Date().toISOString();
                var cid = "li_ld_" + aName.replace(/[^a-zA-Z0-9]/g, "") + "_" + (cm.datePublished ? cm.datePublished.substring(0, 19).replace(/[^0-9]/g, "") : Date.now());

                saveLinkedInLead_({
                  interaction_id: cid,
                  interaction_type: "comment",
                  author_name: aName,
                  author_headline: "Engaged on LinkedIn Post",
                  author_profile_url: "https://www.linkedin.com/feed/update/" + postUrn,
                  content_text: cText,
                  post_url: pubUrl,
                  post_urn: postUrn,
                  timestamp: cDate
                });
                totalProcessed++;
              });
            }
          }
        } catch (pubErr) {
          log_("SYNC_LINKEDIN_POSTS_AUTO", "WARN", "Public scraper warning: " + String(pubErr));
        }
      }
    });

    var doneMsg = "LinkedIn auto-sync finished. Processed: " + totalProcessed;
    log_("SYNC_LINKEDIN_POSTS_AUTO", "INFO", doneMsg);
    if (totalProcessed > 0) {
      sendTelegramMessage_("🚀 <b>LinkedIn Leads Captured!</b>\n\nProcessed <b>" + totalProcessed + "</b> new lead(s) into Jira, Sheets & Airtable!\n🕒 " + new Date().toISOString());
    }
    return doneMsg;

  } catch (err) {
    var errMsg = "LinkedIn auto-sync notice: " + String(err.message || err);
    log_("SYNC_LINKEDIN_POSTS_AUTO", "WARN", errMsg);
    return errMsg;
  }
}


/**
 * ZERO-TOKEN AUTOMATED LINKEDIN LEAD ENGINE (via Gmail Notifications)
 *
 * LinkedIn restricts developer API products (Community Management API) for unapproved apps,
 * but LinkedIn ALWAYS sends instant email notifications to your connected Gmail
 * (janegracy.int2027g3@gmail.com) whenever someone:
 *  - Comments on your company post
 *  - Likes or reacts to your post
 *  - Shares your post
 *
 * This function runs automatically inside Apps Script, reads those notification emails,
 * extracts the real person's name, profile, comment text, and routes them straight to:
 *  1. Jira (Parent Task + 8 Subtasks)
 *  2. Google Sheets (LinkedIn_Raw_Leads + Lead_Management)
 *  3. Airtable (Leads table)
 *  4. Telegram Bot Alert
 *  5. Email
 */
function SYNC_LINKEDIN_FROM_GMAIL() {
  log_("SYNC_LINKEDIN_FROM_GMAIL", "INFO", "Scanning Gmail for LinkedIn engagement notifications...");
  var totalProcessed = 0;

  try {
    // Search Gmail for LinkedIn notifications in the last 7 days
    var query = 'from:linkedin.com ("commented on" OR "reacted to" OR "liked your post" OR "shared your" OR "engaged with") newer_than:7d';
    var threads = GmailApp.search(query, 0, 50);
    log_("SYNC_LINKEDIN_FROM_GMAIL", "INFO", "Found " + threads.length + " matching LinkedIn email threads.");

    for (var i = 0; i < threads.length; i++) {
      var messages = threads[i].getMessages();
      for (var j = 0; j < messages.length; j++) {
        var msg = messages[j];
        var msgId = msg.getId();
        var subject = msg.getSubject() || "";
        var body = msg.getPlainBody() || "";
        var interactionId = "li_mail_" + msgId;

        // Determine interaction type
        var interactionType = "engagement";
        if (/comment/i.test(subject) || /comment/i.test(body)) {
          interactionType = "comment";
        } else if (/like|react/i.test(subject) || /like|react/i.test(body)) {
          interactionType = "like";
        } else if (/share/i.test(subject) || /share/i.test(body)) {
          interactionType = "share";
        }

        // Extract author name from subject (e.g. "John Doe commented on your post...")
        var authorName = "LinkedIn Member";
        var nameMatch = subject.match(/^([A-Za-z0-9\s\.\,\-]+?)\s+(?:commented|reacted|liked|shared)/i);
        if (nameMatch && nameMatch[1]) {
          authorName = nameMatch[1].trim();
        }

        // Extract comment / message snippet
        var contentText = subject;
        var quoteMatch = body.match(/["“](.+?)["”]/s) || body.match(/said:?\s*\n+([^\n]+)/i);
        if (quoteMatch && quoteMatch[1]) {
          contentText = quoteMatch[1].trim();
        }

        // Extract profile URL from email body links if present
        var authorProfile = "";
        var profileMatch = body.match(/https:\/\/[a-z]{2,3}\.linkedin\.com\/in\/[a-zA-Z0-9\-_%]+/i);
        if (profileMatch) {
          authorProfile = profileMatch[0];
        }

        // Save lead through unified multi-channel pipeline
        var resJson = saveLinkedInLead_({
          interaction_id: interactionId,
          interaction_type: interactionType,
          author_name: authorName,
          author_headline: "Engaged via LinkedIn Post",
          author_profile_url: authorProfile,
          content_text: contentText,
          post_url: LINKEDIN_CONFIG.POST_URL || "https://www.linkedin.com/feed/update/urn:li:activity:7515631841547214848",
          post_urn: LINKEDIN_CONFIG.MONITOR_POST_URNS || "urn:li:activity:7515631841547214848",
          timestamp: msg.getDate().toISOString()
        });

        var res = JSON.parse(resJson.getContent());
        if (res && res.success && !res.skipped) {
          totalProcessed++;
          log_("SYNC_LINKEDIN_FROM_GMAIL", "SUCCESS", "Captured real lead: " + authorName + " (" + interactionType + ")");
        }
      }
    }

    var report = "Gmail LinkedIn sync complete. Processed " + totalProcessed + " new lead(s).";
    log_("SYNC_LINKEDIN_FROM_GMAIL", "INFO", report);
    if (totalProcessed > 0) {
      sendTelegramMessage_("🚀 <b>LinkedIn Leads Auto-Captured!</b>\n\nProcessed <b>" + totalProcessed + "</b> real lead(s) from LinkedIn engagements into Jira, Sheets, Airtable & Telegram!");
    }
    return report;

  } catch (err) {
    var errReport = "SYNC_LINKEDIN_FROM_GMAIL Error: " + String(err.message || err);
    log_("SYNC_LINKEDIN_FROM_GMAIL", "ERROR", errReport);
    return errReport;
  }
}

/**
/**
 * MASTER 24/7 AUTONOMOUS LINKEDIN ENGINE
 * Runs continuously every 5 minutes in Google Cloud without any manual intervention.
 * 1. Checks Gmail for new LinkedIn notifications (likes, comments, reposts).
 * 2. Scans the monitored LinkedIn post for new public comments & engagements.
 * 3. Immediately routes any new leads to:
 *    - Jira (Parent Task + 8 Subtasks under PHY)
 *    - Google Sheets (LinkedIn_Raw_Leads + Lead_Management)
 *    - Airtable (Leads table)
 *    - Telegram Bot
 *    - Email Alert
 */
function MASTER_LINKEDIN_AUTOMATION_RUNNER() {
  log_("MASTER_LINKEDIN_AUTOMATION_RUNNER", "INFO", "Executing automated 24/7 LinkedIn + YouTube lead scan...");

  // ── LinkedIn: Gmail notification parser ──────────────────────────────────
  try {
    SYNC_LINKEDIN_FROM_GMAIL();
  } catch (gErr) {
    log_("MASTER_LINKEDIN_AUTOMATION_RUNNER", "WARN", "Gmail sync error: " + String(gErr));
  }

  // ── LinkedIn: Public post scraper / REST API ─────────────────────────────
  try {
    SYNC_LINKEDIN_POSTS_AUTO();
  } catch (pErr) {
    log_("MASTER_LINKEDIN_AUTOMATION_RUNNER", "WARN", "LinkedIn post sync error: " + String(pErr));
  }

  // ── YouTube: Comment / enquiry sync ─────────────────────────────────────
  try {
    SYNC_YOUTUBE_COMMENTS_AUTO();
  } catch (ytErr) {
    log_("MASTER_LINKEDIN_AUTOMATION_RUNNER", "WARN", "YouTube sync error: " + String(ytErr));
  }
}

/**
 * Activates 24/7 automatic execution in Google Cloud (every 1 minute).
 * You only need to run this ONCE. After that, Google Cloud runs it forever in the background.
 */
function SETUP_LINKEDIN_AUTO_SYNC_TRIGGER() {
  DELETE_LINKEDIN_AUTO_SYNC_TRIGGER();

  var trigger = ScriptApp.newTrigger("MASTER_LINKEDIN_AUTOMATION_RUNNER")
    .timeBased()
    .everyMinutes(1)
    .create();

  log_("SETUP_LINKEDIN_AUTO_SYNC_TRIGGER", "SUCCESS", "24/7 background trigger created (every 1 min). ID: " + trigger.getUniqueId());
  return "SUCCESS: 24/7 automated LinkedIn sync is now active! It runs automatically every 1 minute without opening the browser or touching anything.";
}

/**
 * Ensures the 1-minute autonomous background trigger is active
 */
function ENSURE_LINKEDIN_TRIGGER_ACTIVE_() {
  try {
    var triggers = ScriptApp.getProjectTriggers();
    var hasMaster = false;
    for (var i = 0; i < triggers.length; i++) {
      if (triggers[i].getHandlerFunction() === "MASTER_LINKEDIN_AUTOMATION_RUNNER") {
        hasMaster = true;
        break;
      }
    }
    if (!hasMaster) {
      ScriptApp.newTrigger("MASTER_LINKEDIN_AUTOMATION_RUNNER")
        .timeBased()
        .everyMinutes(1)
        .create();
      log_("ENSURE_LINKEDIN_TRIGGER_ACTIVE_", "SUCCESS", "1-minute master runner trigger auto-installed (covers LinkedIn + YouTube).");
    }
  } catch (e) {
    log_("ENSURE_LINKEDIN_TRIGGER_ACTIVE_", "INFO", "Trigger check note: " + e);
  }
}

/**
 * Deletes any existing LinkedIn auto-sync triggers.
 */
function DELETE_LINKEDIN_AUTO_SYNC_TRIGGER() {
  var triggers = ScriptApp.getProjectTriggers();
  var count = 0;
  for (var i = 0; i < triggers.length; i++) {
    var fn = triggers[i].getHandlerFunction();
    if (fn === "SYNC_LINKEDIN_POSTS_AUTO" || fn === "SYNC_LINKEDIN_FROM_GMAIL" || fn === "MASTER_LINKEDIN_AUTOMATION_RUNNER") {
      ScriptApp.deleteTrigger(triggers[i]);
      count++;
    }
  }
  return "Removed " + count + " LinkedIn triggers.";
}

/**
 * Test simulation: Creates a demo LinkedIn lead and verifies Jira, Sheets, Airtable, Telegram, and Email.
 */
function TEST_LINKEDIN_LEAD() {
  return saveLinkedInLead_({
    interaction_id: "test_li_" + Date.now(),
    interaction_type: "comment",
    author_name: "Dr. Rajesh Sharma (Lead Physiotherapist)",
    author_headline: "Head of Orthopedic Rehabilitation & Sports Medicine",
    author_profile_url: "https://www.linkedin.com/in/dr-rajesh-sharma-physio",
    content_text: "We are expanding our clinic network in Bengaluru and looking for an AI movement analysis platform. How can we book a demo and review trial licensing?",
    post_url: "https://www.linkedin.com/feed/update/urn:li:activity:7251829384918239182",
    post_urn: "urn:li:activity:7251829384918239182",
    email: "dr.rajesh@orthorehab.in",
    phone: "+91 98450 12345"
  });
}

/* ========================== DIAGNOSTIC HELPERS ========================== */

/**
 * Run this directly in Apps Script Editor → Run to test ONLY Telegram.
 * Check Execution Log to see the HTTP response code and body.
 */
function DEBUG_TELEGRAM() {
  var botToken = getTelegramBotToken_();
  var chatId   = getTelegramChatId_();
  Logger.log("Bot Token (first 10): " + botToken.substring(0, 10));
  Logger.log("Chat ID: " + chatId);
  if (!botToken || !chatId) {
    Logger.log("ERROR: Missing bot token or chat ID. Check TELEGRAM_CONFIG in Code.gs");
    return;
  }
  var url = "https://api.telegram.org/bot" + botToken + "/sendMessage";
  var res = UrlFetchApp.fetch(url, {
    method: "post",
    payload: {
      chat_id: chatId,
      text: "\u2705 <b>Physiomatics Debug</b>\n\nTelegram channel is connected and working!\n\n\ud83d\udd52 " + new Date().toISOString(),
      parse_mode: "HTML"
    },
    muteHttpExceptions: true
  });
  Logger.log("HTTP Status: " + res.getResponseCode());
  Logger.log("Body: " + res.getContentText());
}

/**
 * Run this directly in Apps Script Editor → Run to test ONLY Airtable.
 * Check Execution Log to see the HTTP response code and body.
 */
function DEBUG_AIRTABLE() {
  var token  = getAirtableToken_();
  var baseId = String(AIRTABLE_CONFIG.BASE_ID || "").trim();
  var table  = AIRTABLE_CONFIG.TABLE_NAME;
  Logger.log("Token (first 10): " + token.substring(0, 10));
  Logger.log("Base ID: " + baseId);
  Logger.log("Table: " + table);
  if (!token || !baseId) {
    Logger.log("ERROR: Missing Airtable token or Base ID. Check AIRTABLE_CONFIG in Code.gs");
    return;
  }
  // First: list existing records so we can see correct field names
  var getUrl = "https://api.airtable.com/v0/" + baseId + "/" + encodeURIComponent(table) + "?maxRecords=1";
  var getRes = UrlFetchApp.fetch(getUrl, {
    method: "get",
    headers: { "Authorization": "Bearer " + token },
    muteHttpExceptions: true
  });
  Logger.log("GET Status: " + getRes.getResponseCode());
  Logger.log("GET Body: " + getRes.getContentText());

  // Second: attempt to insert a test record
  var postUrl = "https://api.airtable.com/v0/" + baseId + "/" + encodeURIComponent(table);
  var postRes = UrlFetchApp.fetch(postUrl, {
    method: "post",
    headers: {
      "Authorization": "Bearer " + token,
      "Content-Type": "application/json"
    },
    payload: JSON.stringify({
      records: [{
        fields: {
          "Name": "DEBUG TEST - " + new Date().toISOString(),
          "Lead Type": "LinkedIn COMMENT",
          "Interest": "LinkedIn Post Engagement",
          "Message": "This is an automated test record from Physiomatics Apps Script."
        }
      }],
      typecast: true
    }),
    muteHttpExceptions: true
  });
  Logger.log("POST Status: " + postRes.getResponseCode());
  Logger.log("POST Body: " + postRes.getContentText());
}

/**
 * Master diagnostic: tests Telegram + Airtable + runs a full LinkedIn lead simulation.
 * Run this from the Apps Script editor to see exactly what succeeds and what fails.
 */
function VERIFY_ALL_CHANNELS() {
  Logger.log("=== TELEGRAM TEST ===");
  DEBUG_TELEGRAM();

  Logger.log("\n=== AIRTABLE TEST ===");
  DEBUG_AIRTABLE();

  Logger.log("\n=== FULL LINKEDIN LEAD SIMULATION ===");
  var result = saveLinkedInLead_({
    interaction_id: "verify_" + Date.now(),
    interaction_type: "comment",
    author_name: "Channel Verification Test",
    author_headline: "Test Account - Ignore",
    author_profile_url: "https://www.linkedin.com/in/test",
    content_text: "Full channel verification test from Physiomatics engine.",
    post_url: "https://www.linkedin.com/feed/update/urn:li:activity:7515631841547214848",
    post_urn: "urn:li:activity:7515631841547214848"
  });
  Logger.log("Result: " + result);
}

/**
 * DEBUG_LINKEDIN_API � Run in Apps Script Editor to test actual LinkedIn API calls.
 * Shows EXACTLY what LinkedIn returns (200 OK with data, or 401/403 with error).
 * Check the Execution Log after running.
 */
function DEBUG_LINKEDIN_API() {
  var token      = getLinkedInAccessToken_();
  var postUrn    = (LINKEDIN_CONFIG.MONITOR_POST_URNS || "urn:li:activity:7515631841547214848").trim();
  var encodedUrn = encodeURIComponent(postUrn);

  Logger.log("=== LinkedIn API Debug ===");
  Logger.log("Token (first 15 chars): " + token.substring(0, 15));
  Logger.log("Post URN: " + postUrn);

  var headers = {
    "Authorization": "Bearer " + token,
    "LinkedIn-Version": "202503",
    "X-Restli-Protocol-Version": "2.0.0"
  };

  // Test 1: Token validity
  Logger.log("\n--- Test 1: Token /userinfo ---");
  try {
    var uRes = UrlFetchApp.fetch("https://api.linkedin.com/v2/userinfo", {
      method: "get",
      headers: { "Authorization": "Bearer " + token },
      muteHttpExceptions: true
    });
    Logger.log("HTTP: " + uRes.getResponseCode());
    Logger.log("Body: " + uRes.getContentText().substring(0, 400));
  } catch(e) { Logger.log("Exception: " + e); }

  // Test 2: Comments
  Logger.log("\n--- Test 2: Comments on post ---");
  try {
    var cRes = UrlFetchApp.fetch(
      "https://api.linkedin.com/rest/socialActions/" + encodedUrn + "/comments?count=10&start=0",
      { method: "get", headers: headers, muteHttpExceptions: true }
    );
    Logger.log("HTTP: " + cRes.getResponseCode());
    Logger.log("Body: " + cRes.getContentText().substring(0, 800));
  } catch(e) { Logger.log("Exception: " + e); }

  // Test 3: Reactions
  Logger.log("\n--- Test 3: Reactions on post ---");
  try {
    var rRes = UrlFetchApp.fetch(
      "https://api.linkedin.com/rest/socialActions/" + encodedUrn + "/reactions?count=10&start=0",
      { method: "get", headers: headers, muteHttpExceptions: true }
    );
    Logger.log("HTTP: " + rRes.getResponseCode());
    Logger.log("Body: " + rRes.getContentText().substring(0, 800));
  } catch(e) { Logger.log("Exception: " + e); }

  Logger.log("\n=== Debug Complete. Copy the output above and share it. ===");
}

/* ============================================================================
   DEBUG_YOUTUBE_PIPELINE  — Run this in Apps Script to diagnose why YouTube
   leads are NOT appearing in Jira or Telegram.
   ============================================================================ */
function DEBUG_YOUTUBE_PIPELINE() {
  Logger.log("==============================================================");
  Logger.log("  PHYSIOMATICS — YOUTUBE PIPELINE DIAGNOSTIC");
  Logger.log("  Run at: " + new Date().toISOString());
  Logger.log("==============================================================\n");

  // ── STEP 1: Check Script Properties / Config ────────────────────────────
  Logger.log("--- STEP 1: Configuration Check ---");
  var ytClientId     = PropertiesService.getScriptProperties().getProperty("YOUTUBE_CLIENT_ID")     || YOUTUBE_CONFIG.CLIENT_ID     || "";
  var ytClientSecret = PropertiesService.getScriptProperties().getProperty("YOUTUBE_CLIENT_SECRET") || YOUTUBE_CONFIG.CLIENT_SECRET || "";
  var ytRefreshToken = PropertiesService.getScriptProperties().getProperty("YOUTUBE_REFRESH_TOKEN") || YOUTUBE_CONFIG.REFRESH_TOKEN || "";
  var jiraToken      = getJiraApiToken_();
  var telegramToken  = getTelegramBotToken_();
  var telegramChat   = getTelegramChatId_();

  Logger.log("YOUTUBE_CLIENT_ID     : " + (ytClientId     ? "SET (" + ytClientId.substring(0,12) + "...)" : "❌ MISSING"));
  Logger.log("YOUTUBE_CLIENT_SECRET : " + (ytClientSecret ? "SET (" + ytClientSecret.substring(0,6)  + "...)" : "❌ MISSING"));
  Logger.log("YOUTUBE_REFRESH_TOKEN : " + (ytRefreshToken ? "SET (" + ytRefreshToken.substring(0,12) + "...)" : "❌ MISSING"));
  Logger.log("JIRA_API_TOKEN        : " + (jiraToken      ? "SET (" + jiraToken.substring(0,10)      + "...)" : "❌ MISSING"));
  Logger.log("TELEGRAM_BOT_TOKEN    : " + (telegramToken  ? "SET (" + telegramToken.substring(0,10)  + "...)" : "❌ MISSING"));
  Logger.log("TELEGRAM_CHAT_ID      : " + (telegramChat   ? telegramChat : "❌ MISSING"));
  Logger.log("YOUTUBE_VIDEO_IDS     : " + (YOUTUBE_CONFIG.MONITOR_VIDEO_IDS || "❌ MISSING"));
  Logger.log("JIRA_HOST             : " + getJiraHost_());
  Logger.log("JIRA_PROJECT_KEY      : " + getJiraProjectKey_());
  Logger.log("");

  if (!ytClientId || !ytClientSecret || !ytRefreshToken) {
    Logger.log("❌ FATAL: YouTube OAuth credentials missing. Cannot continue.\n");
    Logger.log("FIX: Go to Apps Script → Project Settings → Script Properties");
    Logger.log("     Add: YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET, YOUTUBE_REFRESH_TOKEN");
    return;
  }

  // ── STEP 2: Get YouTube Access Token ────────────────────────────────────
  Logger.log("--- STEP 2: YouTube OAuth Token ---");
  var accessToken;
  try {
    accessToken = getYouTubeAccessToken_();
    Logger.log("✅ Access token obtained: " + accessToken.substring(0, 20) + "...");
  } catch (e) {
    Logger.log("❌ FAILED to get YouTube access token: " + e);
    Logger.log("FIX: Your YOUTUBE_REFRESH_TOKEN may be expired or revoked.");
    Logger.log("     Re-authorise at: https://developers.google.com/oauthplayground");
    return;
  }
  Logger.log("");

  // ── STEP 3: Fetch Comments from YouTube ─────────────────────────────────
  Logger.log("--- STEP 3: Fetch YouTube Comments ---");
  var videoIds = (YOUTUBE_CONFIG.MONITOR_VIDEO_IDS || "").split(",").map(function(s){ return s.trim(); }).filter(Boolean);
  Logger.log("Monitoring " + videoIds.length + " video(s): " + videoIds.join(", "));

  var allComments = [];
  videoIds.forEach(function(videoId) {
    try {
      var title = getYouTubeVideoTitle_(accessToken, videoId);
      Logger.log("Video [" + videoId + "] title: " + title);
      var comments = fetchYouTubeComments_(accessToken, videoId);
      Logger.log("  → Fetched " + comments.length + " comment(s)");
      comments.forEach(function(c) { c._videoTitle = title; c._videoId = videoId; });
      allComments = allComments.concat(comments);
    } catch(e) {
      Logger.log("  ❌ Error fetching comments for " + videoId + ": " + e);
    }
  });

  if (allComments.length === 0) {
    Logger.log("⚠️  No comments found. Either the video has 0 comments or the token has no permission.");
    Logger.log("    Check: YouTube Data API v3 is enabled in Google Cloud Console.");
    Logger.log("    Check: OAuth scope includes https://www.googleapis.com/auth/youtube.force-ssl");
    Logger.log("");
  } else {
    Logger.log("Total comments fetched: " + allComments.length);
  }
  Logger.log("");

  // ── STEP 4: Enquiry Detection ────────────────────────────────────────────
  Logger.log("--- STEP 4: Enquiry Detection ---");
  var enquiries = allComments.filter(function(c) { return ytIsEnquiry_(c.text); });
  Logger.log("Comments classified as ENQUIRY: " + enquiries.length + " / " + allComments.length);
  if (allComments.length > 0 && enquiries.length === 0) {
    Logger.log("⚠️  No enquiries detected. Sample comment texts:");
    allComments.slice(0, 3).forEach(function(c, i) {
      Logger.log("  [" + i + "] " + (c.text || "").substring(0, 120));
    });
    Logger.log("  Tip: Comments need words like: price, demo, contact, clinic, help, etc.");
  }
  enquiries.slice(0, 3).forEach(function(c, i) {
    Logger.log("  Enquiry [" + i + "]: " + c.authorDisplayName + " — " + (c.text || "").substring(0, 80));
  });
  Logger.log("");

  // ── STEP 5: Jira Connection Test ─────────────────────────────────────────
  Logger.log("--- STEP 5: Jira Connection ---");
  if (!jiraToken) {
    Logger.log("❌ JIRA_API_TOKEN missing. Jira will be skipped.");
    Logger.log("FIX: Add JIRA_API_TOKEN in Script Properties (or update JIRA_CONFIG.API_TOKEN)");
  } else {
    try {
      var jiraUser = jiraFetch_("/rest/api/2/myself", "get");
      Logger.log("✅ Jira connected as: " + (jiraUser.displayName || jiraUser.emailAddress || "unknown"));
    } catch(e) {
      Logger.log("❌ Jira connection FAILED: " + e);
      Logger.log("FIX: Check JIRA_API_TOKEN, JIRA_HOST, and JIRA_PROJECT_KEY");
    }
  }
  Logger.log("");

  // ── STEP 6: Test Jira Task Creation with a mock YouTube lead ─────────────
  Logger.log("--- STEP 6: Jira Task Creation (Mock YouTube Lead) ---");
  if (jiraToken) {
    try {
      var mockComment = {
        id: "debug_yt_" + Date.now(),
        authorDisplayName: "Debug Test Viewer",
        authorChannelUrl: "https://www.youtube.com/channel/debug",
        text: "I am interested in a demo of Physiomatics for my clinic. Can you share contact details?",
        publishedAt: new Date().toISOString(),
        videoId: videoIds[0] || "eRGcQo4qWiM",
        replies: []
      };
      var jiraRes = ytCreateJiraLead_(mockComment, "DEBUG TEST — Physiomatics Video");
      Logger.log("✅ Jira task created!");
      Logger.log("   Primary key  : " + (jiraRes.primaryKey   || "none"));
      Logger.log("   Secondary key: " + (jiraRes.secondaryKey || "none"));
    } catch(e) {
      Logger.log("❌ Jira task creation FAILED: " + e);
      Logger.log("FIX: Ensure project key '" + getJiraProjectKey_() + "' exists and API token has Create Issue permission.");
    }
  } else {
    Logger.log("⏭️  Skipped — no Jira token.");
  }
  Logger.log("");

  // ── STEP 7: Telegram Test ─────────────────────────────────────────────────
  Logger.log("--- STEP 7: Telegram Alert ---");
  if (!telegramToken || !telegramChat) {
    Logger.log("❌ Telegram BOT_TOKEN or CHAT_ID missing. Alerts will be skipped.");
    Logger.log("FIX: Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in Script Properties.");
  } else {
    try {
      var tMsg = "🔬 <b>Physiomatics YouTube Debug</b>\n\n" +
        "✅ Pipeline diagnostic running.\n" +
        "Comments found: <b>" + allComments.length + "</b>\n" +
        "Enquiries detected: <b>" + enquiries.length + "</b>\n" +
        "🕐 " + new Date().toISOString();
      var tOk = sendTelegramMessage_(tMsg);
      Logger.log(tOk ? "✅ Telegram message sent successfully." : "❌ Telegram message failed (check bot token / chat ID).");
    } catch(e) {
      Logger.log("❌ Telegram error: " + e);
    }
  }
  Logger.log("");

  // ── STEP 8: Sheet Check ───────────────────────────────────────────────────
  Logger.log("--- STEP 8: YouTube_Raw_Leads Sheet Check ---");
  try {
    var ss = getSpreadsheet();
    var ytSheet = getTab(ss, "YouTube_Raw_Leads");
    var lastRow = ytSheet.getLastRow();
    Logger.log("YouTube_Raw_Leads rows (incl. header): " + lastRow);
    if (lastRow > 1) {
      var sample = ytSheet.getRange(lastRow, 1, 1, 17).getValues()[0];
      Logger.log("Latest row:");
      Logger.log("  synced_at     : " + sample[0]);
      Logger.log("  comment_id    : " + sample[1]);
      Logger.log("  author_name   : " + sample[6]);
      Logger.log("  is_enquiry    : " + sample[12]);
      Logger.log("  jira_primary  : " + sample[14]);
      Logger.log("  jira_secondary: " + sample[15]);
      Logger.log("  sync_status   : " + sample[16]);
    }
  } catch(e) {
    Logger.log("❌ Sheet read error: " + e);
  }
  Logger.log("");

  Logger.log("==============================================================");
  Logger.log("  DIAGNOSTIC COMPLETE — Check each ❌ above and apply the FIX");
  Logger.log("==============================================================");
}
