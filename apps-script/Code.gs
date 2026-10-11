// ═══════════════════════════════════════════════════════════════════════
//  PHYSIOMATICS — Google Apps Script Web App
//  Paste this entire script in Extensions → Apps Script, then:
//    1. Click "Deploy" → "New deployment" → Type = Web App
//    2. Execute as: Me
//    3. Who has access: Anyone
//    4. Copy the /exec URL into VITE_GOOGLE_SHEETS_URL in your .env
// ═══════════════════════════════════════════════════════════════════════

// ── Sheet names ──────────────────────────────────────────────────────────
var SHEET_LEADS       = "Leads";          // form submissions from Contact, ICP
var SHEET_FEEDBACK    = "Feedback";       // /feedback page submissions
var SHEET_SESSIONS    = "Sessions";       // visit / session_start events
var SHEET_CLICKS      = "Clicks";         // button / link clicks
var SHEET_SCROLLS     = "Scroll Depth";   // scroll depth milestones
var SHEET_SECTIONS    = "Section Views";  // IntersectionObserver section views
var SHEET_POSE        = "Pose Analysis";  // AI movement analysis results
var SHEET_CHAT        = "Chatbot";        // assistant chatbot messages
var SHEET_ALL         = "All Events";     // every event (raw log)

// ── Column headers per sheet ──────────────────────────────────────────────
var HEADERS = {
  Leads:          ["Timestamp","Page","Name","Contact","Email","Phone","Role / Title","Organization","Country","Org Type","Audience Size","Message","Challenge","Requirements","Form Type"],
  Feedback:       ["Timestamp","Page","Category","Message"],
  Sessions:       ["Timestamp","Page","Visit #","Referrer"],
  Clicks:         ["Timestamp","Page","Label"],
  "Scroll Depth": ["Timestamp","Page","Depth %","Time on Page (s)"],
  "Section Views":["Timestamp","Page","Section"],
  "Pose Analysis":["Timestamp","Page","Data"],
  Chatbot:        ["Timestamp","Page","Message","Context Node"],
  "All Events":   ["Timestamp","Page","Action","Form Type","Raw Params"],
};

// ────────────────────────────────────────────────────────────────────────
// doGet — entry point for all GET requests from the website
// ────────────────────────────────────────────────────────────────────────
function doGet(e) {
  try {
    var p   = e.parameter || {};
    var ss  = SpreadsheetApp.getActiveSpreadsheet();
    var ts  = p.timestamp  || new Date().toISOString();
    var pg  = p.pageUrl    || "";
    var act = (p.action    || "unknown").toLowerCase();

    // ── Route to specific sheet ─────────────────────────────────────────
    if (act === "lead_submission" || act === "icp_lead") {
      appendRow(ss, SHEET_LEADS, [
        ts, pg,
        p.full_name || p.name || "",
        p.contact   || "",
        p.email     || "",
        p.phone     || "",
        p.job_title || "",
        p.organization || "",
        p.country   || "",
        p.organization_type || p.segment || "",
        p.audience_size || "",
        p.message   || "",
        p.challenge || "",
        p.requirements || "",
        p.form_type || act,
      ]);
    }

    else if (act === "user_feedback") {
      appendRow(ss, SHEET_FEEDBACK, [
        ts, pg,
        p.category || "",
        p.message  || "",
      ]);
    }

    else if (act === "session_start") {
      appendRow(ss, SHEET_SESSIONS, [
        ts, pg,
        p.visit_number || "1",
        p.referrer || "",
      ]);
    }

    else if (act === "click") {
      appendRow(ss, SHEET_CLICKS, [
        ts, pg,
        p.label || "",
      ]);
    }

    else if (act === "scroll_depth") {
      appendRow(ss, SHEET_SCROLLS, [
        ts, pg,
        p.section || "",
        p.time_on_page_sec || "",
      ]);
    }

    else if (act === "section_view") {
      appendRow(ss, SHEET_SECTIONS, [
        ts, pg,
        p.section || "",
      ]);
    }

    else if (act === "pose_analysis") {
      appendRow(ss, SHEET_POSE, [
        ts, pg,
        JSON.stringify(p),
      ]);
    }

    else if (act === "chatbot_inquiry") {
      appendRow(ss, SHEET_CHAT, [
        ts, pg,
        p.message      || "",
        p.context_node || "",
      ]);
    }

    // ── Always append to All Events raw log ────────────────────────────
    appendRow(ss, SHEET_ALL, [
      ts, pg, act, p.form_type || "", JSON.stringify(p),
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "ok", action: act }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    Logger.log("doGet error: " + err.message);
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ── doPost — also handle POST requests (fallback) ─────────────────────────
function doPost(e) {
  // Re-use doGet handler; parse body as JSON and merge into parameters
  try {
    var body = {};
    if (e.postData && e.postData.contents) {
      try { body = JSON.parse(e.postData.contents); } catch (_) {}
    }
    // Merge body fields into e.parameter so doGet logic works
    e.parameter = Object.assign({}, e.parameter || {}, body);
    return doGet(e);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error" }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ── Helper: append a row, create sheet + header row if needed ─────────────
function appendRow(ss, sheetName, values) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    var headers = HEADERS[sheetName] || ["Timestamp", "Data"];
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length)
         .setFontWeight("bold")
         .setBackground("#6B21A8")
         .setFontColor("#ffffff");
    sheet.setFrozenRows(1);
  }
  sheet.appendRow(values);
}
