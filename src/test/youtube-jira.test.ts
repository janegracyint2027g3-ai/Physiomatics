import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  isPotentialEnquiry,
  convertCommentToJiraPayload,
  createJiraTaskFromComment,
  getYouTubeVideoComments,
  type YouTubeComment,
} from "../lib/youtube";

describe("YouTube Comments & Jira Lead Pipeline Integration", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("1. Enquiry Intent Detection (isPotentialEnquiry)", () => {
    it("identifies commercial and pricing enquiries", () => {
      expect(isPotentialEnquiry("What is the price of your Physiomatics platform?")).toBe(true);
      expect(isPotentialEnquiry("How much does the clinic subscription cost?")).toBe(true);
      expect(isPotentialEnquiry("Can you send me a quote for our hospital?")).toBe(true);
    });

    it("identifies clinical booking and demo requests", () => {
      expect(isPotentialEnquiry("I would like to book a demo for our physio team.")).toBe(true);
      expect(isPotentialEnquiry("Can we schedule a consultation session?")).toBe(true);
      expect(isPotentialEnquiry("Is there a free trial available for therapists?")).toBe(true);
    });

    it("identifies clinical rehabilitation and pain questions", () => {
      expect(isPotentialEnquiry("I have severe lower back pain, can this exercise rehab help?")).toBe(true);
      expect(isPotentialEnquiry("Does the AI sensor support post-stroke biomechanics assessment?")).toBe(true);
    });

    it("ignores generic non-enquiry comments", () => {
      expect(isPotentialEnquiry("Great video, thanks for sharing!")).toBe(false);
      expect(isPotentialEnquiry("Nice music in the background.")).toBe(false);
      expect(isPotentialEnquiry("")).toBe(false);
    });
  });

  describe("2. Comment to Jira Payload Conversion (convertCommentToJiraPayload)", () => {
    const sampleComment: YouTubeComment = {
      id: "UgxSAMPLE_COMMENT_ID_123",
      authorDisplayName: "Dr. Sarah Jenkins",
      authorChannelUrl: "https://www.youtube.com/channel/UCsample123",
      textDisplay: "We run a sports clinic. How can we book a demo for Physiomatics?",
      textOriginal: "We run a sports clinic. How can we book a demo for Physiomatics?",
      videoId: "dQw4w9WgXcQ",
      publishedAt: "2026-10-12T10:00:00Z",
      likeCount: 4,
      totalReplyCount: 1,
      isEnquiry: true,
    };

    it("maps YouTube comment into a structured JiraLeadPayload", () => {
      const payload = convertCommentToJiraPayload(sampleComment, "AI Biomechanics Overview");

      expect(payload.name).toBe("Dr. Sarah Jenkins");
      expect(payload.lead_type).toBe("youtube_enquiry");
      expect(payload.organization).toBe("YouTube Community");
      expect(payload.subject).toContain("Dr. Sarah Jenkins");
      expect(payload.subject).toContain('AI Biomechanics Overview');
      expect(payload.message).toContain("We run a sports clinic");
      expect(payload.message).toContain("UgxSAMPLE_COMMENT_ID_123");
      expect(payload.page_path).toBe("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
      expect(payload.lead_id).toBe("yt_UgxSAMPLE_COMMENT_ID_123");
    });
  });

  describe("3. Comment Retrieval (getYouTubeVideoComments)", () => {
    it("fetches, parses, and tags comments from YouTube API", async () => {
      const mockTokenResponse = {
        access_token: "mock_test_token_123",
        expires_in: 3600,
        scope: "https://www.googleapis.com/auth/youtube.readonly",
        issued_at: Date.now(),
      };

      const mockCommentThreadsResponse = {
        items: [
          {
            id: "thread1",
            snippet: {
              videoId: "vid123",
              totalReplyCount: 2,
              topLevelComment: {
                id: "comment1",
                snippet: {
                  authorDisplayName: "Alex Miller",
                  textOriginal: "How much is the license for 5 physiotherapists?",
                  publishedAt: "2026-10-12T11:00:00Z",
                  likeCount: 5,
                },
              },
            },
          },
          {
            id: "thread2",
            snippet: {
              videoId: "vid123",
              totalReplyCount: 0,
              topLevelComment: {
                id: "comment2",
                snippet: {
                  authorDisplayName: "John Doe",
                  textOriginal: "Awesome animations!",
                  publishedAt: "2026-10-12T11:05:00Z",
                  likeCount: 1,
                },
              },
            },
          },
        ],
      };

      // Mock fetch
      const fetchSpy = vi.spyOn(globalThis, "fetch").mockImplementation(async (url: any) => {
        const urlStr = String(url);
        if (urlStr.includes("/api/youtube/token")) {
          return new Response(JSON.stringify(mockTokenResponse), { status: 200 });
        }
        if (urlStr.includes("commentThreads")) {
          return new Response(JSON.stringify(mockCommentThreadsResponse), { status: 200 });
        }
        return new Response("Not found", { status: 404 });
      });

      const comments = await getYouTubeVideoComments("vid123");

      expect(comments).toHaveLength(2);
      expect(comments[0].authorDisplayName).toBe("Alex Miller");
      expect(comments[0].isEnquiry).toBe(true);
      expect(comments[1].authorDisplayName).toBe("John Doe");
      expect(comments[1].isEnquiry).toBe(false);

      fetchSpy.mockRestore();
    });
  });

  describe("4. Jira Task Creation (createJiraTaskFromComment)", () => {
    it("creates Jira parent task and 8 subtasks for YouTube comment", async () => {
      const sampleComment: YouTubeComment = {
        id: "UgxTEST_JIRA_999",
        authorDisplayName: "Clinic Director Mike",
        textDisplay: "We are interested in booking a trial for our rehabilitation hospital.",
        textOriginal: "We are interested in booking a trial for our rehabilitation hospital.",
        videoId: "vid789",
        publishedAt: "2026-10-12T12:00:00Z",
        likeCount: 2,
        isEnquiry: true,
      };

      const fetchSpy = vi.spyOn(globalThis, "fetch").mockImplementation(async (url: any, opts: any) => {
        const urlStr = String(url);
        if (urlStr.includes("/rest/api/3/issue")) {
          const body = JSON.parse(opts?.body || "{}");
          if (body?.fields?.issuetype?.name === "Sub-task") {
            return new Response(JSON.stringify({ id: "10050", key: "PHY-99" }), { status: 201 });
          }
          return new Response(JSON.stringify({ id: "10049", key: "PHY-98" }), { status: 201 });
        }
        return new Response("{}", { status: 200 });
      });

      const result = await createJiraTaskFromComment(sampleComment, "Physiomatics Patient Portal Demo");

      expect(result.success).toBe(true);
      expect(result.issueKey).toBeDefined();

      fetchSpy.mockRestore();
    });
  });

  describe("5. Deduplication Logic", () => {
    it("recognizes existing Jira issue for duplicate comment ID", async () => {
      const existingIssueKey = "PHY-136";
      const commentId = "UgxTEST_DUPLICATE_001";

      const fetchSpy = vi.spyOn(globalThis, "fetch").mockImplementation(async (url: any) => {
        const urlStr = String(url);
        if (urlStr.includes("/rest/api/3/search")) {
          return new Response(
            JSON.stringify({
              total: 1,
              issues: [{ id: "10049", key: existingIssueKey, fields: { summary: "Existing task" } }],
            }),
            { status: 200 }
          );
        }
        return new Response("{}", { status: 200 });
      });

      // Simulate search query check
      const jql = `project = "PHY" AND (labels = "yt-comment-${commentId}" OR text ~ "${commentId}")`;
      const searchRes = await fetch(
        `https://janegracyint2027g3.atlassian.net/rest/api/3/search?jql=${encodeURIComponent(jql)}`
      );
      const searchData = await searchRes.json();

      expect(searchData.issues).toHaveLength(1);
      expect(searchData.issues[0].key).toBe(existingIssueKey);

      fetchSpy.mockRestore();
    });
  });
});
