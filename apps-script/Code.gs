/**
 * ============================================================================
 * PHYSIOMATICS — WEBSITE MONITORING, LEAD ROUTING & REPORTING ENGINE
 * Website: https://physiomatics.vercel.app/
 *
 * Features:
 * 1. Logs incoming website events in Live_Traffic_Events.
 * 2. Routes demo requests, contact enquiries and feedback to dedicated tabs.
 * 3. Maintains Lead_Management for demo/contact enquiries.
 * 4. Tracks page views, CTA clicks, form interactions, scroll and conversions
 *    when the frontend sends those events.
 * 5. Builds daily, weekly and monthly summary tabs from received event data.
 * 6. Sends email alerts for demo/contact enquiries.
 * 7. Can send scheduled daily, weekly and monthly reports.
 * 8. Stores consented browser geolocation/timezone when the frontend sends it.
 * 9. Stores IP/security metadata only when a trusted endpoint/provider sends it.
 *
 * IMPORTANT:
 * - Set SPREADSHEET_ID before running setup.
 * - This script logs events sent from the Physiomatics website via GET params.
 *   The frontend (googleSheets.ts) sends GET requests with all data as query
 *   parameters. doGet(e) processes them via e.parameter.
 * - Apps Script doPost(e) is also supported as a fallback (sends JSON body).
 * - Do not send patient records, diagnoses, videos or other sensitive health
 *   information to this marketing/website analytics spreadsheet.
 * ============================================================================
 */

var CONFIG = {
  SPREADSHEET_ID: "PASTE_YOUR_PHYSIOMATICS_GOOGLE_SHEET_ID_HERE",
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
  Demo_Requests: [
    "received_at", "lead_id", "visitor_id", "session_id", "name", "email",
    "phone", "organization", "role", "interest", "message", "page_path",
    "lead_source", "lead_status", "follow_up_status", "source_environment"
  ],
  Contact_Enquiries: [
    "received_at", "lead_id", "visitor_id", "session_id", "name", "email",
    "phone", "subject", "message", "page_path", "lead_source", "lead_status",
    "follow_up_status", "source_environment"
  ],
  Feedback: [
    "received_at", "feedback_id", "visitor_id", "session_id", "name", "email",
    "feedback_type", "rating", "message", "page_path", "source_environment"
  ],
  Lead_Management: [
    "received_at", "lead_id", "lead_type", "visitor_id", "session_id", "name",
    "email", "phone", "organization", "role", "interest", "subject", "message",
    "page_path", "lead_source", "lead_status", "follow_up_status",
    "source_environment"
  ],
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
  Daily_Summary: [
    "Date", "Total_Events", "Unique_Visitors", "Page_Views", "Demo_Requests",
    "Contact_Enquiries", "Feedback_Count", "Total_Leads", "Conversion_Rate",
    "Avg_Engagement_Sec"
  ],
  Weekly_Summary: [
    "Week_Start", "Total_Events", "Unique_Visitors", "Page_Views",
    "Demo_Requests", "Contact_Enquiries", "Feedback_Count", "Total_Leads",
    "Conversion_Rate", "Avg_Engagement_Sec"
  ],
  Monthly_Summary: [
    "Month", "Total_Events", "Unique_Visitors", "Page_Views",
    "Demo_Requests", "Contact_Enquiries", "Feedback_Count", "Total_Leads",
    "Conversion_Rate", "Avg_Engagement_Sec"
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
  log_("INITIALIZE_ALL_TABS", "SUCCESS", "Physiomatics tabs initialized.");
  return "All Physiomatics tabs initialized.";
}

/* ------------------------------- WEBHOOK ---------------------------------- */

/**
 * FIX #1 — CRITICAL:
 * The Physiomatics frontend (googleSheets.ts) sends all data as GET query
 * parameters (e.parameter). The original doGet() returned a health-check and
 * never wrote anything to the sheet, so ALL frontend events were silently
 * dropped. Now: if any event params are present, process them; otherwise
 * return the health-check response.
 */
function doGet(e) {
  var params = (e && e.parameter) ? e.parameter : {};

  // If the request carries event data from the frontend, process it.
  if (params.action || params.event_name || params.event_type) {
    try {
      return processEvent_(params);
    } catch (err) {
      log_("doGet", "ERROR", err && err.stack ? err.stack : String(err));
      return json_({ success: false, message: String(err.message || err) });
    }
  }

  // No event params — return health-check (e.g. browser URL bar hit).
  return json_({
    success: true,
    service: CONFIG.SYSTEM_NAME,
    website: CONFIG.WEBSITE,
    message: "Backend is online. Send a GET request with event params or a POST with JSON body.",
    timestamp: new Date().toISOString()
  });
}

/**
 * doPost is kept as a fallback for any future POST-based integrations.
 * Both doGet and doPost now call the shared processEvent_() function.
 */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error("Empty POST body. Send JSON data from the website.");
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

/**
 * Shared event-processing logic used by both doGet and doPost.
 */
function processEvent_(rawPayload) {
  var ss = getSpreadsheet();
  var p = enrichPayload_(rawPayload);
  var kind = classifySubmission_(p);

  // Stamp the classified type before writing the master event so summaries
  // can count demo/contact/feedback submissions correctly.
  if (kind === "demo") p.lead_type = "demo_request";
  else if (kind === "contact") p.lead_type = "contact_enquiry";
  else if (kind === "feedback") p.lead_type = "feedback";

  appendEvent_(ss, p);

  if (kind === "demo") {
    saveDemo_(ss, p);
    sendLeadAlert_(p, "New Physiomatics Demo Request");
  } else if (kind === "contact") {
    saveContact_(ss, p);
    sendLeadAlert_(p, "New Physiomatics Contact Enquiry");
  } else if (kind === "feedback") {
    saveFeedback_(ss, p);
  }

  routeTelemetry_(ss, p);
  return json_({ success: true, message: "Submission received and routed.", eventId: p.event_id });
}

/**
 * FIX #2–#10 — enrichPayload_:
 * Added aliases for all field names the Physiomatics frontend actually sends.
 * Changes are annotated with [FIX #N] comments.
 */
function enrichPayload_(raw) {
  var p = raw || {};
  var now = new Date();
  p.received_at = formatDate_(now);
  p.event_id = str_(first_(p, ["event_id", "eventId"], "evt_" + Utilities.getUuid()));
  p.event_type = norm_(first_(p, ["event_type", "eventType", "type"], "event"));
  // [FIX #2] "action" is the primary field the frontend sends (e.g. "lead_submission",
  // "session_start", "click", "scroll_depth"). Map it to event_name.
  p.event_name = str_(first_(p, ["event_name", "eventName", "action"], p.event_type));
  p.visitor_id = str_(first_(p, ["visitor_id", "visitorId"], ""));
  p.session_id = str_(first_(p, ["session_id", "sessionId"], ""));
  p.client_timestamp = str_(first_(p, ["client_timestamp", "timestamp"], now.toISOString()));
  p.page_url = str_(first_(p, ["page_url", "pageUrl", "url"], CONFIG.WEBSITE));
  p.page_path = str_(first_(p, ["page_path", "pagePath"], routePath_(p.page_url)));
  p.page_title = str_(first_(p, ["page_title", "pageTitle"], ""));
  p.previous_page = str_(first_(p, ["previous_page", "previousPage"], ""));
  // [FIX #3] "referrer" is the exact field SessionTracker sends.
  p.referrer_url = str_(first_(p, ["referrer_url", "referrer", "referrerUrl"], ""));
  p.traffic_source = str_(first_(p, ["traffic_source", "trafficSource"], p.referrer_url ? "referral" : "direct"));
  p.utm_source = str_(first_(p, ["utm_source", "utmSource"], ""));
  p.utm_medium = str_(first_(p, ["utm_medium", "utmMedium"], ""));
  p.utm_campaign = str_(first_(p, ["utm_campaign", "utmCampaign"], ""));
  p.device_type = str_(first_(p, ["device_type", "deviceType"], ""));
  p.browser = str_(first_(p, ["browser"], ""));
  p.operating_system = str_(first_(p, ["operating_system", "operatingSystem"], ""));
  p.screen_width = first_(p, ["screen_width", "screenWidth"], "");
  p.screen_height = first_(p, ["screen_height", "screenHeight"], "");
  p.viewport_width = first_(p, ["viewport_width", "viewportWidth"], "");
  p.viewport_height = first_(p, ["viewport_height", "viewportHeight"], "");
  p.language = str_(first_(p, ["language"], ""));
  p.timezone = str_(first_(p, ["timezone"], ""));
  p.event_category = str_(first_(p, ["event_category", "eventCategory"], ""));
  p.event_action = str_(first_(p, ["event_action", "eventAction"], ""));
  p.event_label = str_(first_(p, ["event_label", "eventLabel"], ""));
  // [FIX #4] "context_node" is sent by the chatbot; "page" is sent by EngagementTracker.
  p.section = str_(first_(p, ["section", "sectionName", "context_node", "contextNode", "page"], ""));
  p.element_type = str_(first_(p, ["element_type", "elementType"], ""));
  p.element_id = str_(first_(p, ["element_id", "elementId"], ""));
  p.element_class = str_(first_(p, ["element_class", "elementClass"], ""));
  // [FIX #5] "label" is what EngagementTracker sends for click events.
  p.element_text = str_(first_(p, ["element_text", "elementText", "cta_name", "label", "btn_text"], ""));
  // [FIX #6] scroll_depth events from EngagementTracker send section:"25%" not
  // scroll_percentage:25. We parse it below after all fields are set.
  p.scroll_percentage = number_(first_(p, ["scroll_percentage", "scrollPercentage"], 0));
  p.max_scroll_depth = number_(first_(p, ["max_scroll_depth", "maxScrollDepth"], p.scroll_percentage));
  // [FIX #7] The frontend sends "time_on_page_sec" (no trailing 's').
  p.time_on_page_seconds = number_(first_(p, ["time_on_page_seconds", "timeOnPageSeconds", "time_on_page_sec"], 0));
  p.session_duration_seconds = number_(first_(p, ["session_duration_seconds", "sessionDurationSeconds"], 0));
  // [FIX #8] "visit_number" is what SessionTracker sends; map it to interaction_count.
  p.interaction_count = number_(first_(p, ["interaction_count", "interactionCount", "visit_number", "visitNumber"], 0));
  p.form_name = str_(first_(p, ["form_name", "formName"], ""));
  p.form_id = str_(first_(p, ["form_id", "formId"], ""));
  p.form_status = norm_(first_(p, ["form_status", "formStatus"], ""));
  p.conversion_name = str_(first_(p, ["conversion_name", "conversionName"], ""));
  p.conversion_value = number_(first_(p, ["conversion_value", "conversionValue"], 0));
  p.lead_type = norm_(first_(p, ["lead_type", "leadType", "formType", "form_type"], ""));
  // [FIX #9] "full_name" is what contact.tsx and IcpLeadForm send.
  p.name = str_(first_(p, ["name", "fullName", "full_name"], ""));
  p.email = str_(first_(p, ["email", "workEmail", "work_email"], ""));
  p.phone = str_(first_(p, ["phone", "phoneNumber", "phone_number"], ""));

  // [FIX #10] "contact" is the combined email-or-phone field sent by contact.tsx
  // and IcpLeadForm. Smart-detect: if it looks like an email use it as email,
  // otherwise treat it as a phone number.
  var rawContact = str_(first_(p, ["contact"], ""));
  if (rawContact) {
    if (!p.email && isEmail_(rawContact)) {
      p.email = rawContact;
    } else if (!p.phone && !isEmail_(rawContact)) {
      p.phone = rawContact;
    }
  }

  p.organization = str_(first_(p, ["organization", "clinic", "clinicName", "company", "companyName"], ""));
  // [FIX #11] "job_title" → role; "organization_type" / "segment" → interest.
  p.role = str_(first_(p, ["role", "jobTitle", "job_title", "designation"], ""));
  p.interest = str_(first_(p, ["interest", "requirement", "service", "demoType",
                               "organization_type", "organizationType", "segment"], ""));
  // [FIX #12] "challenge" is the current-challenge field from the consultation form.
  p.subject = str_(first_(p, ["subject", "topic", "enquiryType", "inquiryType", "challenge"], ""));
  // [FIX #13] "requirements" appended to message so it is not lost.
  p.message = str_(first_(p, ["message", "comments", "notes", "description", "feedback"], ""));
  var requirements = str_(first_(p, ["requirements"], ""));
  if (requirements) {
    p.message = p.message ? p.message + " | Requirements: " + requirements : "Requirements: " + requirements;
  }

  p.feedback_type = str_(first_(p, ["feedback_type", "feedbackType", "category"], ""));
  p.rating = str_(first_(p, ["rating", "score", "stars"], ""));
  p.latitude = first_(p, ["latitude", "lat", "geo_latitude"], "");
  p.longitude = first_(p, ["longitude", "lng", "lon", "geo_longitude"], "");
  p.geo_accuracy_meters = first_(p, ["geo_accuracy_meters", "accuracy", "location_accuracy"], "");
  p.geo_city = str_(first_(p, ["geo_city", "city"], ""));
  p.geo_region = str_(first_(p, ["geo_region", "region", "state"], ""));
  // [FIX #14] contact.tsx sends a plain "country" field.
  p.geo_country = str_(first_(p, ["geo_country", "country"], ""));
  p.geo_country_code = str_(first_(p, ["geo_country_code", "country_code"], ""));
  p.geo_timezone = str_(first_(p, ["geo_timezone", "geoTimezone", "timezone"], ""));
  p.location_method = str_(first_(p, ["location_method", "locationMethod"], ""));
  p.consent_status = str_(first_(p, ["consent_status", "locationConsent"], ""));
  p.client_ip = str_(first_(p, ["client_ip", "clientIp", "ip_address", "ipAddress"], ""));
  p.ip_city = str_(first_(p, ["ip_city", "ipCity"], ""));
  p.ip_region = str_(first_(p, ["ip_region", "ipRegion"], ""));
  p.ip_country = str_(first_(p, ["ip_country", "ipCountry"], ""));
  p.ip_country_code = str_(first_(p, ["ip_country_code", "ipCountryCode"], ""));
  p.ip_org = str_(first_(p, ["ip_org", "ipOrg", "isp", "organization_name"], ""));
  p.ip_asn = str_(first_(p, ["ip_asn", "ipAsn", "asn"], ""));
  p.ip_source = str_(first_(p, ["ip_source", "ipSource"], ""));
  p.security_event = str_(first_(p, ["security_event", "securityEvent"], ""));
  p.source_environment = str_(first_(p, ["source_environment", "environment"], CONFIG.DEFAULT_ENVIRONMENT));
  p.lead_source = str_(first_(p, ["lead_source", "leadSource", "source"], "website"));
  p.lead_status = str_(first_(p, ["lead_status", "leadStatus"], "New"));
  p.follow_up_status = str_(first_(p, ["follow_up_status", "followUpStatus"], "Pending"));

  try {
    p.event_data_json = JSON.stringify(raw);
  } catch (ignore) {
    p.event_data_json = "{}";
  }

  // [FIX #6 continued] Parse "25%" / "50%" / "75%" / "100%" section strings
  // that EngagementTracker sends for scroll_depth events into a numeric
  // scroll_percentage so routeTelemetry_ routes them to Scroll_Engagement.
  if (norm_(p.event_name) === "scroll_depth" && p.scroll_percentage === 0 && p.section) {
    var pctMatch = String(p.section).match(/(\d+)/);
    if (pctMatch) {
      p.scroll_percentage = parseInt(pctMatch[1], 10);
      p.max_scroll_depth = Math.max(number_(p.max_scroll_depth), p.scroll_percentage);
    }
  }

  return p;
}

/**
 * FIX #15 — classifySubmission_:
 * Added all Physiomatics frontend form_type and event_name values that were
 * not previously recognized, causing all contact/ICP lead submissions to be
 * silently unclassified and never routed to Demo_Requests/Contact_Enquiries.
 *
 * Frontend values added:
 *   form_type "quick_enquiry"    → contact enquiry
 *   form_type "consultation"     → contact enquiry (consultation request)
 *   form_type "icp_lead"         → demo request    (ICP = sales prospect)
 *   event_name "lead_submission" → contact enquiry (was checking "lead_submit" — wrong)
 *   event_name "icp_lead"        → demo request
 *   event_name "user_feedback"   → feedback        (was only detected via form_type)
 */
function classifySubmission_(p) {
  var type  = norm_(first_(p, ["type", "form_type", "formType", "lead_type"], ""));
  var form  = norm_(p.form_name);
  var event = norm_(p.event_name);
  var hasContact = Boolean(p.email || p.phone);

  // ── Feedback detection ──────────────────────────────────────────────────
  if (type.indexOf("feedback") >= 0 || form.indexOf("feedback") >= 0 ||
      event.indexOf("feedback") >= 0) {
    return p.message ? "feedback" : "";
  }

  // ── Demo request detection ──────────────────────────────────────────────
  if (type.indexOf("demo") >= 0 || form.indexOf("demo") >= 0 ||
      event === "demo_request" || event === "request_demo") {
    return (p.name && hasContact) ? "demo" : "";
  }
  // [FIX] ICP leads are treated as demo/sales requests.
  if (type === "icp_lead" || event === "icp_lead") {
    return (p.name && hasContact) ? "demo" : "";
  }

  // ── Contact enquiry detection ───────────────────────────────────────────
  if (type.indexOf("contact") >= 0 || form.indexOf("contact") >= 0 ||
      event === "contact_submit" || event === "contact_enquiry") {
    return (p.name && hasContact) ? "contact" : "";
  }
  // [FIX] "quick_enquiry" and "consultation" are the form_type values
  // contact.tsx sends for its Quick enquiry and Consultation request tabs.
  if (type === "quick_enquiry" || type === "consultation") {
    return (p.name && hasContact) ? "contact" : "";
  }
  // [FIX] "lead_submission" is the action/event_name contact.tsx sends.
  //       Original code checked "lead_submit" (missing "ion") — never matched.
  if (event === "lead_submission") {
    return (p.name && hasContact) ? "contact" : "";
  }

  // ── Generic lead payloads ───────────────────────────────────────────────
  if (p.event_type === "lead" || event === "lead_submit" ||
      p.form_status === "submitted") {
    if (p.name && hasContact) {
      return (form.indexOf("demo") >= 0 || p.lead_type.indexOf("demo") >= 0) ? "demo" : "contact";
    }
  }

  return "";
}

/* ---------------------------- LEAD ROUTING -------------------------------- */

function saveDemo_(ss, p) {
  p.lead_id = str_(first_(p, ["lead_id", "leadId"], "lead_" + Utilities.getUuid()));
  p.lead_type = "demo_request";
  var sheet = getTab(ss, "Demo_Requests");
  appendValues_(sheet, [
    p.received_at, p.lead_id, p.visitor_id, p.session_id, p.name, p.email,
    p.phone, p.organization, p.role, p.interest, p.message, p.page_path,
    p.lead_source, p.lead_status, p.follow_up_status, p.source_environment
  ]);
  saveMasterLead_(ss, p);
  log_("saveDemo_", "SUCCESS", "Demo request stored: " + p.lead_id);
}

function saveContact_(ss, p) {
  p.lead_id = str_(first_(p, ["lead_id", "leadId"], "lead_" + Utilities.getUuid()));
  p.lead_type = "contact_enquiry";
  var sheet = getTab(ss, "Contact_Enquiries");
  appendValues_(sheet, [
    p.received_at, p.lead_id, p.visitor_id, p.session_id, p.name, p.email,
    p.phone, p.subject, p.message, p.page_path, p.lead_source, p.lead_status,
    p.follow_up_status, p.source_environment
  ]);
  saveMasterLead_(ss, p);
  log_("saveContact_", "SUCCESS", "Contact enquiry stored: " + p.lead_id);
}

function saveMasterLead_(ss, p) {
  appendValues_(getTab(ss, "Lead_Management"), [
    p.received_at, p.lead_id, p.lead_type, p.visitor_id, p.session_id, p.name,
    p.email, p.phone, p.organization, p.role, p.interest, p.subject, p.message,
    p.page_path, p.lead_source, p.lead_status, p.follow_up_status,
    p.source_environment
  ]);
}

function saveFeedback_(ss, p) {
  if (!p.message) throw new Error("Feedback message is required.");
  var id = "feedback_" + Utilities.getUuid();
  appendValues_(getTab(ss, "Feedback"), [
    p.received_at, id, p.visitor_id, p.session_id, p.name, p.email,
    p.feedback_type, p.rating, p.message, p.page_path, p.source_environment
  ]);
  log_("saveFeedback_", "SUCCESS", "Feedback stored: " + id);
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

/**
 * FIX #16 — routeTelemetry_:
 * - session_start: added explicit check for event_name "session_start" so
 *   SessionTracker visits are routed to Visitor_Sessions even though event_type
 *   defaults to "event" (not "session").
 * - scroll_depth: after enrichPayload_ parses "25%" → scroll_percentage, the
 *   condition `p.scroll_percentage > 0` now evaluates to true correctly.
 * - click: event_name "click" matches `name.indexOf("click") >= 0` already ✅
 * - section_view / chatbot_inquiry / exercise_analysis: these non-lead events
 *   are silently captured in Live_Traffic_Events only, which is correct.
 */
function routeTelemetry_(ss, p) {
  var type = norm_(p.event_type);
  var name = norm_(p.event_name);

  // Session events — includes session_start from SessionTracker.
  if (type === "session" || name.indexOf("session_") === 0 || name === "session_start") {
    appendValues_(getTab(ss, "Visitor_Sessions"), [
      p.received_at, p.event_id, p.visitor_id, p.session_id, p.event_type,
      p.client_timestamp, p.page_url, p.page_path, p.referrer_url,
      p.traffic_source, p.device_type, p.browser, p.operating_system,
      p.session_duration_seconds, p.interaction_count, p.source_environment
    ]);
  }

  // Page views.
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

  // Click events — "label" field is already mapped to element_text in enrichPayload_.
  if (type === "click" || name.indexOf("click") >= 0 ||
      norm_(p.event_category) === "cta") {
    appendValues_(getTab(ss, "Click_Interactions"), [
      p.received_at, p.event_id, p.visitor_id, p.session_id, p.page_url,
      p.page_path, p.device_type, p.element_type, p.element_id, p.element_class,
      p.element_text, p.event_category, p.event_action, p.event_label, p.section
    ]);
  }

  // Scroll events — scroll_depth events now have scroll_percentage parsed correctly.
  if (type === "scroll" || name === "scroll_depth" || p.scroll_percentage > 0) {
    appendValues_(getTab(ss, "Scroll_Engagement"), [
      p.received_at, p.event_id, p.visitor_id, p.session_id, p.page_url,
      p.page_path, p.device_type, p.scroll_percentage, p.max_scroll_depth,
      p.time_on_page_seconds, p.section
    ]);
  }

  // Form interactions.
  if (type === "form" || name.indexOf("form") >= 0 || p.form_status) {
    appendValues_(getTab(ss, "Form_Interactions"), [
      p.received_at, p.event_id, p.visitor_id, p.session_id, p.page_url,
      p.page_path, p.form_name, p.form_id, p.form_status, p.event_type, p.event_name
    ]);
  }

  // Conversion events.
  if (type === "conversion" || p.conversion_name) {
    appendValues_(getTab(ss, "Conversion_Events"), [
      p.received_at, p.event_id, p.visitor_id, p.session_id, p.conversion_name,
      p.conversion_value, p.page_url, p.traffic_source, p.utm_source,
      p.utm_medium, p.utm_campaign, p.lead_type
    ]);
  }

  // Geo — only when frontend sends location data with consent.
  if (p.latitude !== "" || p.longitude !== "" || p.geo_city || p.geo_country) {
    appendValues_(getTab(ss, "Geo_Timezone_Intelligence"), [
      p.received_at, p.event_id, p.visitor_id, p.session_id, p.page_url,
      p.latitude, p.longitude, p.geo_accuracy_meters, p.geo_city, p.geo_region,
      p.geo_country, p.geo_country_code, p.geo_timezone, p.location_method,
      p.consent_status, p.source_environment
    ]);
  }

  // IP intelligence — only when supplied by a trusted server-side provider.
  if (p.client_ip || p.ip_country || p.ip_city || p.ip_asn || p.security_event) {
    appendValues_(getTab(ss, "IP_Security_Intelligence"), [
      p.received_at, p.event_id, p.visitor_id, p.session_id, p.page_url,
      p.client_ip, p.ip_city, p.ip_region, p.ip_country, p.ip_country_code,
      p.ip_org, p.ip_asn, p.ip_source, p.security_event, p.source_environment
    ]);
  }
}

/* ------------------------------- EMAILS ----------------------------------- */

function sendLeadAlert_(p, subject) {
  if (!CONFIG.ENABLE_EMAIL_NOTIFICATIONS) return;
  var recipients = EMAIL_CONFIG.leadEmails || [EMAIL_CONFIG.adminEmail];
  var body = [
    "A new submission was received on the Physiomatics website.",
    "",
    "Type: " + p.lead_type,
    "Received: " + p.received_at,
    "Name: " + p.name,
    "Email: " + p.email,
    "Phone: " + p.phone,
    "Organization / Clinic: " + p.organization,
    "Role: " + p.role,
    "Interest / Segment: " + p.interest,
    "Subject / Challenge: " + p.subject,
    "Message: " + p.message,
    "Page: " + p.page_path,
    "Website: " + CONFIG.WEBSITE,
    "",
    "Open the Google Sheet to review and manage this enquiry."
  ].join("\n");

  recipients.forEach(function (to) {
    try {
      MailApp.sendEmail({
        to: to,
        subject: subject,
        body: body,
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
  var ss = getSpreadsheet();
  var map = { Daily: "Daily_Summary", Weekly: "Weekly_Summary", Monthly: "Monthly_Summary" };
  var sheet = ss.getSheetByName(map[intervalName]);
  if (!sheet || sheet.getLastRow() < 2) {
    log_("sendPeriodicExecutiveDigest", "SKIPPED", "No summary data for " + intervalName);
    return;
  }

  var rows = sheet.getDataRange().getDisplayValues();
  var header = rows[0];
  var target = rows[1];
  var metrics = [];
  for (var i = 0; i < header.length; i++) {
    metrics.push("<tr><td style='padding:9px;border-bottom:1px solid #e2e8f0;color:#475569'>" +
      html_(header[i]) + "</td><td style='padding:9px;border-bottom:1px solid #e2e8f0;font-weight:700'>" +
      html_(target[i]) + "</td></tr>");
  }

  var htmlBody = "<div style='font-family:Arial,sans-serif;max-width:640px;margin:auto;border:1px solid #dbeafe;border-radius:12px;overflow:hidden'>" +
    "<div style='background:#155e75;color:white;padding:24px'><h2 style='margin:0'>Physiomatics Website Report</h2>" +
    "<p style='margin:8px 0 0'> " + html_(intervalName) + " summary</p></div>" +
    "<div style='padding:20px'><table style='width:100%;border-collapse:collapse'>" + metrics.join("") +
    "</table><p style='margin-top:20px'><a href='" + ss.getUrl() + "'>Open Physiomatics Google Sheet</a></p></div></div>";

  (EMAIL_CONFIG.reportEmails || [EMAIL_CONFIG.adminEmail]).forEach(function (to) {
    try {
      MailApp.sendEmail({
        to: to,
        subject: "[Physiomatics] " + intervalName + " Website Summary",
        htmlBody: htmlBody,
        name: EMAIL_CONFIG.name,
        replyTo: EMAIL_CONFIG.replyTo
      });
    } catch (err) {
      log_("sendPeriodicExecutiveDigest", "ERROR", String(err));
    }
  });
}

function dailyReport() { sendPeriodicExecutiveDigest("Daily"); }
function weeklyReport() { sendPeriodicExecutiveDigest("Weekly"); }
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
  log_("setupPhysiomaticsTriggers", "SUCCESS", "Daily, weekly and monthly report triggers installed.");
}

/* ---------------------------- AGGREGATION --------------------------------- */

function BUILD_AGGREGATED_INTERVAL_SUMMARIES() {
  var ss = getSpreadsheet();
  var live = ss.getSheetByName("Live_Traffic_Events");
  var buckets = { Daily_Summary: {}, Weekly_Summary: {}, Monthly_Summary: {} };

  if (live && live.getLastRow() > 1) {
    var values = live.getDataRange().getValues();
    var headers = values[0];
    var idx = function (name) { return headers.indexOf(name); };
    var tsIdx = idx("received_at"), visitorIdx = idx("visitor_id"), typeIdx = idx("event_type");
    var eventNameIdx = idx("event_name"), leadTypeIdx = idx("lead_type");
    var durationIdx = idx("time_on_page_seconds"), formIdx = idx("form_name");

    for (var r = 1; r < values.length; r++) {
      var date = parseDate_(values[r][tsIdx]);
      if (!date) continue;
      var day   = Utilities.formatDate(date, CONFIG.TIMEZONE, "yyyy-MM-dd");
      var month = Utilities.formatDate(date, CONFIG.TIMEZONE, "yyyy-MM");
      var week  = weekStart_(date);
      var eventType = norm_(values[r][typeIdx]);
      var eventName = norm_(values[r][eventNameIdx]);
      var leadType  = norm_(values[r][leadTypeIdx]);
      var formName  = norm_(values[r][formIdx]);
      var isDemo     = leadType.indexOf("demo") >= 0 || formName.indexOf("demo") >= 0;
      var isContact  = leadType.indexOf("contact") >= 0 || formName.indexOf("contact") >= 0;
      var isFeedback = leadType.indexOf("feedback") >= 0 || formName.indexOf("feedback") >= 0;
      var isLead     = isDemo || isContact;
      var visitor  = visitorIdx >= 0 ? String(values[r][visitorIdx] || "") : "";
      var duration = durationIdx >= 0 ? number_(values[r][durationIdx]) : 0;
      var pageView = eventType === "page_view" || eventName === "page_view";

      updateBucket_(buckets.Daily_Summary,   day,   visitor, pageView, isDemo, isContact, isFeedback, isLead, duration);
      updateBucket_(buckets.Weekly_Summary,  week,  visitor, pageView, isDemo, isContact, isFeedback, isLead, duration);
      updateBucket_(buckets.Monthly_Summary, month, visitor, pageView, isDemo, isContact, isFeedback, isLead, duration);
    }
  }

  writeSummary_(ss, "Daily_Summary",   buckets.Daily_Summary);
  writeSummary_(ss, "Weekly_Summary",  buckets.Weekly_Summary);
  writeSummary_(ss, "Monthly_Summary", buckets.Monthly_Summary);
}

function updateBucket_(all, key, visitor, pageView, demo, contact, feedback, lead, duration) {
  if (!all[key]) {
    all[key] = {
      events: 0, visitors: {}, pageViews: 0, demos: 0, contacts: 0,
      feedback: 0, leads: 0, durationTotal: 0, durationCount: 0
    };
  }
  var b = all[key];
  b.events++;
  if (visitor) b.visitors[visitor] = true;
  if (pageView) b.pageViews++;
  if (demo)     b.demos++;
  if (contact)  b.contacts++;
  if (feedback) b.feedback++;
  if (lead)     b.leads++;
  if (duration > 0) { b.durationTotal += duration; b.durationCount++; }
}

function writeSummary_(ss, tabName, bucket) {
  var sheet = getTab(ss, tabName);
  var headers = TAB_HEADERS[tabName];
  sheet.clearContents();
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  styleHeader_(sheet, headers.length);

  var keys = Object.keys(bucket).sort().reverse();
  var rows = keys.map(function (key) {
    var b = bucket[key];
    var visitors = Object.keys(b.visitors).length;
    var rate = visitors ? (b.leads / visitors * 100).toFixed(1) + "%" : "0.0%";
    var avg  = b.durationCount ? Math.round(b.durationTotal / b.durationCount) : 0;
    return [key, b.events, visitors, b.pageViews, b.demos, b.contacts,
            b.feedback, b.leads, rate, avg];
  });
  if (rows.length) sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
}

/* ----------------------------- TEST HELPERS ------------------------------- */

function TEST_writeDemoRequest() {
  var ss = getSpreadsheet();
  var p = enrichPayload_({
    action: "icp_lead",
    form_type: "icp_lead",
    full_name: "TEST — Physiomatics",
    contact: EMAIL_CONFIG.adminEmail,
    organization_type: "Physiotherapy Clinic",
    page_url: CONFIG.WEBSITE
  });
  appendEvent_(ss, p);
  saveDemo_(ss, p);
  sendLeadAlert_(p, "TEST — Physiomatics Demo Request");
  return "Test ICP lead row written. Check Demo_Requests, Lead_Management, Live_Traffic_Events and email.";
}

function TEST_writeContactEnquiry() {
  var ss = getSpreadsheet();
  var p = enrichPayload_({
    action: "lead_submission",
    form_type: "quick_enquiry",
    full_name: "TEST — Quick Enquiry",
    contact: EMAIL_CONFIG.adminEmail,
    message: "Test quick enquiry — delete this row.",
    page_url: CONFIG.WEBSITE + "contact"
  });
  appendEvent_(ss, p);
  saveContact_(ss, p);
  sendLeadAlert_(p, "TEST — Physiomatics Contact Enquiry");
  return "Test contact enquiry written. Check Contact_Enquiries, Lead_Management, Live_Traffic_Events and email.";
}

function TEST_writeSessionStart() {
  var p = enrichPayload_({
    action: "session_start",
    form_type: "analytics",
    visit_number: 1,
    referrer: "",
    pageUrl: CONFIG.WEBSITE
  });
  appendEvent_(getSpreadsheet(), p);
  return "Test session_start written. Check Live_Traffic_Events and Visitor_Sessions.";
}

function TEST_writeScrollDepth() {
  var p = enrichPayload_({
    action: "scroll_depth",
    section: "50%",
    time_on_page_sec: 12,
    pageUrl: CONFIG.WEBSITE
  });
  appendEvent_(getSpreadsheet(), p);
  routeTelemetry_(getSpreadsheet(), p);
  return "Test scroll_depth(50%) written. Check Live_Traffic_Events and Scroll_Engagement.";
}

function TEST_sendDailyReport() { sendPeriodicExecutiveDigest("Daily"); }

/* -------------------------------- HELPERS --------------------------------- */

function appendValues_(sheet, row) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    sheet.appendRow(row.map(safeCell_));
  } finally {
    lock.releaseLock();
  }
}

function safeCell_(value) {
  if (value === null || value === undefined) return "";
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

function str_(value) {
  return value === undefined || value === null ? "" : String(value).trim();
}

function norm_(value) {
  return str_(value).toLowerCase().replace(/[\s-]+/g, "_");
}

function number_(value) {
  var n = Number(value);
  return isFinite(n) ? n : 0;
}

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
    .addItem("Initialize all tabs",                    "INITIALIZE_ALL_TABS")
    .addItem("Rebuild daily/weekly/monthly summaries",  "BUILD_AGGREGATED_INTERVAL_SUMMARIES")
    .addSeparator()
    .addItem("Test: ICP demo request",                  "TEST_writeDemoRequest")
    .addItem("Test: Quick contact enquiry",             "TEST_writeContactEnquiry")
    .addItem("Test: Session start event",               "TEST_writeSessionStart")
    .addItem("Test: Scroll depth 50%",                  "TEST_writeScrollDepth")
    .addItem("Test: Send daily report email",           "TEST_sendDailyReport")
    .addSeparator()
    .addItem("Enable scheduled reports",                "setupPhysiomaticsTriggers")
    .addToUi();
}
