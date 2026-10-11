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
  TOKEN: "", // Paste your Airtable Personal Access Token (pats...) directly in Apps Script editor
  BASE_ID: "apptNJUsbdqh4dxvS",
  TABLE_NAME: "Leads"
};

function getAirtableToken_() {
  return (AIRTABLE_CONFIG.TOKEN && AIRTABLE_CONFIG.TOKEN.indexOf("PASTE_") !== 0)
    ? AIRTABLE_CONFIG.TOKEN
    : (PropertiesService.getScriptProperties().getProperty("AIRTABLE_TOKEN") || "");
}

var JIRA_CONFIG = {
  ENABLED: true,
  API_TOKEN: "ATATT3xFfGF0wfbVHeCXal_VlksIorx-GYRmq-isgjLe0qaJeCb-_9lcRBq1QwDGfrKfHGmjOWZT-eOrH6aRV5wgMTWoiXnslT9hPJd0aHd0f5ZRSDoR5TMiav2HISdBZX1QAiIP5yxCk1tkjdCNnoEoZa6lYDyPGnXVg9HIzPnUxwl3UhCj5Fg=53C71864",
  EMAIL: "janegracy.int2027g3@gmail.com",
  HOST: "trustworkz.atlassian.net",
  PROJECT_KEY: "PHY",
  TASK_ISSUE_TYPE: "Task",
  SUBTASK_ISSUE_TYPE: "Sub-task"
};

function getJiraApiToken_() {
  return (JIRA_CONFIG.API_TOKEN && JIRA_CONFIG.API_TOKEN.indexOf("PASTE_") !== 0)
    ? JIRA_CONFIG.API_TOKEN
    : (PropertiesService.getScriptProperties().getProperty("JIRA_API_TOKEN") || "");
}

function getJiraHost_() {
  var host = JIRA_CONFIG.HOST || PropertiesService.getScriptProperties().getProperty("JIRA_HOST") || "";
  return host.replace(/^https?:\/\//, "").replace(/\/+$/, "");
}

function getJiraProjectKey_() {
  return JIRA_CONFIG.PROJECT_KEY || PropertiesService.getScriptProperties().getProperty("JIRA_PROJECT_KEY") || "";
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
    "source_environment"
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
  System_Logs: ["Timestamp", "Action", "Status", "Details"]
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
    return processEvent_(payload);
  } catch (err) {
    log_("doPost", "ERROR", err && err.stack ? err.stack : String(err));
    return json_({ success: false, message: String(err.message || err) });
  }
}

/** Shared processing logic for doGet and doPost. */
function processEvent_(rawPayload) {
  var ss  = getSpreadsheet();
  var p   = enrichPayload_(rawPayload);
  var kind = classifySubmission_(p);

  if      (kind === "demo")         p.lead_type = "demo_request";
  else if (kind === "quick")        p.lead_type = "quick_enquiry";
  else if (kind === "consultation") p.lead_type = "consultation_request";
  else if (kind === "feedback")     p.lead_type = "feedback";
  else if (kind === "chatbot")      p.lead_type = "chatbot";

  appendEvent_(ss, p);           // always log to Live_Traffic_Events

  if      (kind === "demo")         { saveDemo_(ss, p);         sendLeadAlert_(p, "New Physiomatics Demo / ICP Request"); }
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

  // ── Demo / ICP request ───────────────────────────────────────────────────
  if (type === "icp_lead" || event === "icp_lead" ||
      type.indexOf("demo") >= 0 || form.indexOf("demo") >= 0 ||
      event === "demo_request" || event === "request_demo") {
    return (p.name && hasContact) ? "demo" : "";
  }

  // ── Consultation request (multi-step form) ───────────────────────────────
  if (type === "consultation" || form.indexOf("consultation") >= 0 ||
      event === "consultation_submit") {
    return (p.name && hasContact) ? "consultation" : "";
  }

  // ── Quick enquiry (short contact form) ───────────────────────────────────
  if (type === "quick_enquiry" || form.indexOf("quick") >= 0 ||
      event === "lead_submission" || event === "contact_submit" ||
      event === "contact_enquiry") {
    return (p.name && hasContact) ? "quick" : "";
  }

  // ── Generic lead (has name + contact, but no specific type clue) ─────────
  if (type.indexOf("contact") >= 0 || event === "lead_submit" ||
      p.form_status === "submitted") {
    if (p.name && hasContact) {
      return (form.indexOf("demo") >= 0 || p.lead_type.indexOf("demo") >= 0) ? "demo" : "quick";
    }
  }

  return "";
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
  appendValues_(getTab(ss, "Consultation_Requests"), [
    p.received_at, p.lead_id, p.visitor_id, p.session_id, p.name, p.email,
    p.phone, p.organization, p.role, p.interest, p.subject, p.message,
    p.page_path, p.lead_source, p.lead_status, p.follow_up_status,
    p.source_environment
  ]);
  saveMasterLead_(ss, p);
  log_("saveConsultation_", "SUCCESS", "Consultation request stored: " + p.lead_id);
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

function sendPeriodicExecutiveDigest(intervalName) {
  BUILD_AGGREGATED_INTERVAL_SUMMARIES();
  var ss  = getSpreadsheet();
  var map = { Daily: "Daily_Summary", Weekly: "Weekly_Summary", Monthly: "Monthly_Summary" };
  var tabName = map[intervalName] || "Daily_Summary";
  var sheet = ss.getSheetByName(tabName);

  if (!sheet || sheet.getLastRow() < 2) {
    log_("sendPeriodicExecutiveDigest", "SKIPPED", "No summary data for " + intervalName);
    return;
  }

  var data = sheet.getDataRange().getDisplayValues();
  var header = data[0];
  var latest = data[1] || [];

  // Map header indexes
  var idx = function(name) { return header.indexOf(name); };
  var dateStr     = latest[0] || "Latest";
  var totalEvents = Number(latest[idx("Total_Events")]) || 0;
  var visitors    = Number(latest[idx("Unique_Visitors")]) || 0;
  var pageViews   = Number(latest[idx("Page_Views")]) || 0;
  var demos       = Number(latest[idx("Demo_Requests")]) || 0;
  var quick       = Number(latest[idx("Quick_Enquiries")]) || 0;
  var consults    = Number(latest[idx("Consultations")]) || 0;
  var chatbot     = Number(latest[idx("Chatbot_Messages")]) || 0;
  var feedback    = Number(latest[idx("Feedback_Count")]) || 0;
  var leads       = Number(latest[idx("Total_Leads")]) || (demos + quick + consults);
  var convRate    = latest[idx("Conversion_Rate")] || (visitors ? ((leads / visitors) * 100).toFixed(1) + "%" : "0.0%");
  var avgDuration = latest[idx("Avg_Engagement_Sec")] || "0";

  // Build horizontal progress bar for Lead Distribution
  var maxLead = Math.max(demos, quick, consults, feedback, 1);
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

  // Recent historical rows (up to 5 past intervals) for mini trend chart
  var trendRowsHtml = "";
  for (var r = 1; r < Math.min(data.length, 6); r++) {
    var row = data[r];
    trendRowsHtml +=
      "<tr style='border-bottom:1px solid #f1f5f9;font-size:13px;'>" +
        "<td style='padding:8px 10px;font-weight:600;color:#1e293b;'>" + html_(row[0]) + "</td>" +
        "<td style='padding:8px 10px;color:#2563eb;text-align:center;font-weight:700;'>" + html_(row[idx("Unique_Visitors")]) + "</td>" +
        "<td style='padding:8px 10px;color:#475569;text-align:center;'>" + html_(row[idx("Page_Views")]) + "</td>" +
        "<td style='padding:8px 10px;color:#059669;text-align:center;font-weight:700;'>" + html_(row[idx("Total_Leads")]) + "</td>" +
        "<td style='padding:8px 10px;color:#7c3aed;text-align:center;font-weight:700;'>" + html_(row[idx("Conversion_Rate")]) + "</td>" +
      "</tr>";
  }

  var ssUrl = "";
  try { ssUrl = ss.getUrl(); } catch (e) { ssUrl = CONFIG.WEBSITE; }

  var htmlBody =
    "<!DOCTYPE html><html><head><meta charset='utf-8'></head><body style='margin:0;padding:24px;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,Helvetica,Arial,sans-serif;'>" +
      "<div style='max-width:640px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 6px 18px rgba(0,0,0,0.06);border:1px solid #e2e8f0;'>" +

        // Header with gradient
        "<div style='background:linear-gradient(135deg,#0284c7 0%,#0f172a 100%);padding:28px 24px;color:#ffffff;'>" +
          "<div style='display:inline-block;padding:3px 10px;background:rgba(255,255,255,0.2);color:#ffffff;font-size:11px;font-weight:800;letter-spacing:1px;text-transform:uppercase;border-radius:20px;margin-bottom:8px;'>" +
            intervalName + " Executive Digest" +
          "</div>" +
          "<h1 style='margin:0;font-size:24px;font-weight:800;letter-spacing:-0.5px;'>Physiomatics Performance Dashboard</h1>" +
          "<p style='margin:6px 0 0 0;color:#bae6fd;font-size:13px;'>Reporting Period: <strong>" + dateStr + "</strong> &bull; Asia/Kolkata (IST)</p>" +
        "</div>" +

        // Metric KPI Grid (4 Cards)
        "<div style='padding:20px 24px 10px 24px;background:#ffffff;'>" +
          "<div style='display:table;width:100%;margin-bottom:14px;'>" +
            // KPI 1: Visitors
            "<div style='display:table-cell;width:50%;padding-right:8px;padding-bottom:12px;vertical-align:top;'>" +
              "<div style='background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:16px;'>" +
                "<div style='color:#15803d;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;'>Unique Visitors</div>" +
                "<div style='color:#166534;font-size:28px;font-weight:800;margin-top:4px;'>" + visitors + "</div>" +
                "<div style='color:#15803d;font-size:12px;margin-top:2px;'> " + pageViews + " total page views</div>" +
              "</div>" +
            "</div>" +
            // KPI 2: Total Leads
            "<div style='display:table-cell;width:50%;padding-left:8px;padding-bottom:12px;vertical-align:top;'>" +
              "<div style='background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;padding:16px;'>" +
                "<div style='color:#1d4ed8;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;'>Total Leads</div>" +
                "<div style='color:#1e40af;font-size:28px;font-weight:800;margin-top:4px;'>" + leads + "</div>" +
                "<div style='color:#1d4ed8;font-size:12px;margin-top:2px;'>Conversion: <strong>" + convRate + "</strong></div>" +
              "</div>" +
            "</div>" +
          "</div>" +

          "<div style='display:table;width:100%;margin-bottom:20px;'>" +
            // KPI 3: Engagement
            "<div style='display:table-cell;width:50%;padding-right:8px;vertical-align:top;'>" +
              "<div style='background:#faf5ff;border:1px solid #e9d5ff;border-radius:12px;padding:16px;'>" +
                "<div style='color:#7e22ce;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;'>Avg Engagement</div>" +
                "<div style='color:#6b21a8;font-size:28px;font-weight:800;margin-top:4px;'>" + avgDuration + "s</div>" +
                "<div style='color:#7e22ce;font-size:12px;margin-top:2px;'>" + totalEvents + " live interactions</div>" +
              "</div>" +
            "</div>" +
            // KPI 4: Inquiries & Chat
            "<div style='display:table-cell;width:50%;padding-left:8px;vertical-align:top;'>" +
              "<div style='background:#fffbeb;border:1px solid #fde68a;border-radius:12px;padding:16px;'>" +
                "<div style='color:#b45309;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;'>AI Chat & Feedback</div>" +
                "<div style='color:#92400e;font-size:28px;font-weight:800;margin-top:4px;'>" + (chatbot + feedback) + "</div>" +
                "<div style='color:#b45309;font-size:12px;margin-top:2px;'>" + chatbot + " chats &bull; " + feedback + " feedback</div>" +
              "</div>" +
            "</div>" +
          "</div>" +

          // Visual Funnel & Lead Breakdown Chart
          "<div style='background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:18px 20px;margin-bottom:20px;'>" +
            "<h3 style='margin:0 0 14px 0;font-size:15px;color:#0f172a;font-weight:700;'>📊 Lead & Conversion Breakdown</h3>" +
            barRow("🎯 Demo / ICP Requests", demos, "#7c3aed") +
            barRow("💬 Consultation Requests", consults, "#059669") +
            barRow("⚡ Quick Enquiries", quick, "#0284c7") +
            barRow("🤖 AI Chatbot Inquiries", chatbot, "#f59e0b") +
            barRow("⭐ Customer Feedback", feedback, "#ec4899") +
          "</div>" +

          // Trend Table
          "<div style='background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:18px 20px;margin-bottom:24px;'>" +
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

          // CTA Action Buttons
          "<div style='text-align:center;margin-bottom:12px;'>" +
            "<a href='" + ssUrl + "' style='display:inline-block;padding:12px 24px;background:#0284c7;color:#ffffff;text-decoration:none;border-radius:8px;font-size:14px;font-weight:700;margin-right:8px;'>Open Live Google Sheet</a>" +
            "<a href='https://airtable.com/apptNJUsbdqh4dxvS' style='display:inline-block;padding:12px 24px;background:#059669;color:#ffffff;text-decoration:none;border-radius:8px;font-size:14px;font-weight:700;margin-right:8px;'>Open Airtable Base</a>" +
            "<a href='https://trustworkz.atlassian.net/jira/software/projects/PHY/boards' style='display:inline-block;padding:12px 24px;background:#7c3aed;color:#ffffff;text-decoration:none;border-radius:8px;font-size:14px;font-weight:700;margin-right:8px;'>Open Jira Board</a>" +
            "<a href='" + CONFIG.WEBSITE + "' style='display:inline-block;padding:12px 24px;background:#f1f5f9;color:#334155;text-decoration:none;border-radius:8px;font-size:14px;font-weight:700;border:1px solid #cbd5e1;'>Visit Website</a>" +
          "</div>" +

        "</div>" +

        // Footer
        "<div style='background:#f8fafc;padding:16px 24px;text-align:center;border-top:1px solid #e2e8f0;color:#94a3b8;font-size:12px;'>" +
          "Physiomatics Website Intelligence System &bull; Automatically saved to Google Sheets, Airtable & Jira" +
        "</div>" +

      "</div>" +
    "</body></html>";

  var plainBody = [
    "[" + intervalName + " Summary] Physiomatics Website Report",
    "Period: " + dateStr,
    "Unique Visitors: " + visitors,
    "Total Page Views: " + pageViews,
    "Total Leads: " + leads + " (" + convRate + ")",
    "Demo Requests: " + demos,
    "Consultations: " + consults,
    "Quick Enquiries: " + quick,
    "Chatbot Messages: " + chatbot,
    "Avg Engagement: " + avgDuration + "s",
    "Sheet URL: " + ssUrl
  ].join("\n");

  (EMAIL_CONFIG.reportEmails || [EMAIL_CONFIG.adminEmail]).forEach(function (to) {
    try {
      MailApp.sendEmail({
        to: to,
        subject: "📊 [Physiomatics] " + intervalName + " Executive Digest — " + visitors + " Visitors, " + leads + " Leads (" + convRate + ")",
        body: plainBody,
        htmlBody: htmlBody,
        name: EMAIL_CONFIG.name,
        replyTo: EMAIL_CONFIG.replyTo
      });
    } catch (err) { log_("sendPeriodicExecutiveDigest", "ERROR", String(err)); }
  });

  // Forward digest report to Jira as an operational task
  try {
    createJiraReportTask_({
      interval: intervalName,
      period: dateStr,
      visitors: visitors,
      pageViews: pageViews,
      leads: leads,
      conversionRate: convRate,
      avgEngagementSec: avgDuration,
      demos: demos,
      consultations: consults,
      quickEnquiries: quick,
      chatbotMessages: chatbot,
      sheetUrl: ssUrl
    });
  } catch (jiraErr) {
    log_("sendPeriodicExecutiveDigest_jira", "WARN", String(jiraErr));
  }
}

function dailyReport()   { sendPeriodicExecutiveDigest("Daily"); }
function weeklyReport()  { sendPeriodicExecutiveDigest("Weekly"); }
function monthlyReport() { sendPeriodicExecutiveDigest("Monthly"); }

function setupPhysiomaticsTriggers() {
  ScriptApp.getProjectTriggers().forEach(function (trigger) {
    var fn = trigger.getHandlerFunction();
    if (["dailyReport", "weeklyReport", "monthlyReport"].indexOf(fn) >= 0) {
      ScriptApp.deleteTrigger(trigger);
    }
  });
  ScriptApp.newTrigger("dailyReport").timeBased().everyDays(1).atHour(21).create();
  ScriptApp.newTrigger("weeklyReport").timeBased().onWeekDay(ScriptApp.WeekDay.MONDAY).atHour(9).create();
  ScriptApp.newTrigger("monthlyReport").timeBased().onMonthDay(1).atHour(9).create();
  log_("setupPhysiomaticsTriggers", "SUCCESS", "Triggers installed.");
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
  SpreadsheetApp.getUi()
    .createMenu("Physiomatics Website Engine")
    .addItem("Initialize all tabs",                     "INITIALIZE_ALL_TABS")
    .addItem("Rebuild daily/weekly/monthly summaries",   "BUILD_AGGREGATED_INTERVAL_SUMMARIES")
    .addSeparator()
    .addItem("Sync Google Sheet leads to Airtable",      "SYNC_ALL_SHEET_DATA_TO_AIRTABLE")
    .addItem("Sync Google Sheet leads to Jira",          "SYNC_ALL_SHEET_LEADS_TO_JIRA")
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
    .addItem("Enable scheduled reports",                 "setupPhysiomaticsTriggers")
    .addToUi();
}

/* --------------------------- AIRTABLE SYNC -------------------------------- */

function syncLeadToAirtable_(p) {
  if (!AIRTABLE_CONFIG.ENABLED) return;
  var token = getAirtableToken_();
  if (!token) return;
  var baseId = String(AIRTABLE_CONFIG.BASE_ID || "").trim();
  if (!baseId || baseId.indexOf("PASTE_") === 0) return;

  try {
    var url = "https://api.airtable.com/v0/" + baseId + "/" + encodeURIComponent(AIRTABLE_CONFIG.TABLE_NAME);
    var fields = {
      "Name": p.name || "Anonymous Visitor",
      "Email": p.email || "",
      "Phone": p.phone || "",
      "Organization": p.organization || "",
      "Role": p.role || "",
      "Interest": p.interest || "",
      "Subject": p.subject || "",
      "Message": p.message || "",
      "Lead Type": p.lead_type || "",
      "Page": p.page_path || "",
      "Lead ID": p.lead_id || "",
      "Visitor ID": p.visitor_id || "",
      "Session ID": p.session_id || "",
      "City": p.geo_city || "",
      "Country": p.geo_country || "",
      "Received At": p.received_at || formatDate_(new Date())
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
    log_("syncLeadToAirtable_", "INFO", "Status: " + res.getResponseCode());
  } catch (err) {
    log_("syncLeadToAirtable_", "ERROR", String(err));
  }
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
function jiraFetch_(path, method, payload) {
  var host = getJiraHost_();
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
    throw new Error("Jira API error (HTTP " + code + "): " + body);
  }
  return JSON.parse(body || "{}");
}

/**
 * Creates parent Task in Jira for an incoming lead, followed by 8 operational Subtasks
 */
function createJiraLeadTaskWithSubtasks_(p) {
  if (!JIRA_CONFIG.ENABLED) return null;
  var host = getJiraHost_();
  var projectKey = getJiraProjectKey_();
  if (!host || !projectKey) {
    log_("createJiraLeadTaskWithSubtasks_", "SKIPPED", "Jira HOST or PROJECT_KEY not configured yet.");
    return null;
  }

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
        description: {
          type: "doc",
          version: 1,
          content: [{
            type: "paragraph",
            content: [{ type: "text", text: descText }]
          }]
        },
        issuetype: { name: JIRA_CONFIG.TASK_ISSUE_TYPE || "Task" },
        labels: ["physiomatics-lead", norm_(p.lead_type || "web_lead").replace(/_/g, "-")]
      }
    };

    var parentResult = jiraFetch_("/rest/api/3/issue", "post", parentPayload);
    var parentKey = parentResult.key;
    log_("createJiraLeadTaskWithSubtasks_", "SUCCESS", "Created Jira Parent Task: " + parentKey);

    // Create the 8 Subtasks linked to parentKey
    var createdSubCount = 0;
    JIRA_LEAD_SUBTASKS.forEach(function(sub) {
      try {
        var subPayload = {
          fields: {
            project: { key: projectKey },
            parent: { key: parentKey },
            summary: sub.summary,
            description: {
              type: "doc",
              version: 1,
              content: [{
                type: "paragraph",
                content: [{ type: "text", text: sub.description }]
              }]
            },
            issuetype: { name: JIRA_CONFIG.SUBTASK_ISSUE_TYPE || "Sub-task" }
          }
        };
        jiraFetch_("/rest/api/3/issue", "post", subPayload);
        createdSubCount++;
      } catch (subErr) {
        log_("createJiraLeadTaskWithSubtasks_", "WARNING", "Subtask creation failed (" + sub.summary + "): " + String(subErr));
      }
    });

    log_("createJiraLeadTaskWithSubtasks_", "SUCCESS", "Parent " + parentKey + " with " + createdSubCount + "/8 subtasks created.");
    return { parentKey: parentKey, subtasksCount: createdSubCount };
  } catch (err) {
    log_("createJiraLeadTaskWithSubtasks_", "ERROR", String(err));
    return null;
  }
}

/**
 * Creates scheduled Report Task in Jira for Daily, Weekly, or Monthly trigger digests
 */
function createJiraReportTask_(r) {
  if (!JIRA_CONFIG.ENABLED) return null;
  var host = getJiraHost_();
  var projectKey = getJiraProjectKey_();
  if (!host || !projectKey) return null;

  try {
    var summary = "📊 [Physiomatics " + r.interval + " Digest] " + r.period + " — " + r.visitors + " Visitors, " + r.leads + " Leads (" + r.conversionRate + ")";
    var descText = [
      "Physiomatics " + r.interval + " Performance Digest",
      "Period: " + r.period,
      "Unique Visitors: " + r.visitors,
      "Total Page Views: " + r.pageViews,
      "Total Leads: " + r.leads + " (" + r.conversionRate + ")",
      "Demo / ICP Requests: " + r.demos,
      "Consultation Requests: " + r.consultations,
      "Quick Enquiries: " + r.quickEnquiries,
      "AI Chatbot Inquiries: " + r.chatbotMessages,
      "Avg Engagement Duration: " + r.avgEngagementSec + "s",
      "Live Google Sheet: " + (r.sheetUrl || CONFIG.WEBSITE)
    ].join("\n");

    var payload = {
      fields: {
        project: { key: projectKey },
        summary: summary,
        description: {
          type: "doc",
          version: 1,
          content: [{
            type: "paragraph",
            content: [{ type: "text", text: descText }]
          }]
        },
        issuetype: { name: JIRA_CONFIG.TASK_ISSUE_TYPE || "Task" },
        labels: ["physiomatics-report", (r.interval || "daily").toLowerCase() + "-digest"]
      }
    };

    var result = jiraFetch_("/rest/api/3/issue", "post", payload);
    log_("createJiraReportTask_", "SUCCESS", "Created Jira Report Task: " + result.key);
    return result.key;
  } catch (err) {
    log_("createJiraReportTask_", "ERROR", String(err));
    return null;
  }
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
