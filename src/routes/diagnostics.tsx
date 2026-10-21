import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero } from "@/components/site/PageHero";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Database, CheckCircle2, AlertCircle, RefreshCw, Key, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/diagnostics")({
  head: () => ({
    meta: [
      { title: "Redis & Session Diagnostics — Physiomatics" },
      { name: "description", content: "Diagnostics dashboard for Redis connectivity and session persistence testing." },
    ],
  }),
  component: DiagnosticsPage,
});

export function DiagnosticsPage() {
  const [redisLoading, setRedisLoading] = useState(false);
  const [redisResult, setRedisResult] = useState<{
    success: boolean;
    message?: string;
    error?: string;
    latencyMs?: number;
    ping?: string;
  } | null>(null);

  const [sessionLoading, setSessionLoading] = useState(false);
  const [sessionResult, setSessionResult] = useState<{
    success: boolean;
    message?: string;
    error?: string;
    sessionId?: string;
    persistedData?: Record<string, unknown>;
  } | null>(null);

  const testRedisConnection = async () => {
    setRedisLoading(true);
    setRedisResult(null);
    try {
      const res = await fetch("/api/redis-health", { credentials: "same-origin" });
      const data = await res.json();
      if (res.ok && data.success) {
        setRedisResult({
          success: true,
          message: data.message || "Redis connected successfully!",
          latencyMs: data.latencyMs,
          ping: data.ping,
        });
      } else {
        setRedisResult({
          success: false,
          error: data.error || "Failed to reach Redis cloud instance",
        });
      }
    } catch (err: any) {
      setRedisResult({
        success: false,
        error: err.message || "Network error while connecting to /api/redis-health",
      });
    } finally {
      setRedisLoading(false);
    }
  };

  const testSessionPersistence = async () => {
    setSessionLoading(true);
    setSessionResult(null);
    try {
      const res = await fetch("/api/session-test", {
        method: "POST",
        credentials: "same-origin",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSessionResult({
          success: true,
          message: data.message || "Session stored and verified successfully in Redis!",
          sessionId: data.sessionId,
          persistedData: data.persistedData,
        });
      } else {
        setSessionResult({
          success: false,
          error: data.error || "Failed to verify session persistence in Redis",
        });
      }
    } catch (err: any) {
      setSessionResult({
        success: false,
        error: err.message || "Network error while calling /api/session-test",
      });
    } finally {
      setSessionLoading(false);
    }
  };

  return (
    <>
      <PageHero
        eyebrow="System Diagnostics"
        title="Redis & Session Diagnostics"
      >
        Verify live Redis Cloud database connectivity and end-to-end encrypted session persistence for Physiomatics.
      </PageHero>

      <div className="container-page -mt-8 md:-mt-12 space-y-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Redis Connection Health */}
          <Card className="border border-border/60 shadow-sm bg-card">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Database className="h-5 w-5 text-primary" />
                <CardTitle>Redis Connection</CardTitle>
              </div>
              <CardDescription>
                Sends a PING command to Redis Cloud and verifies sub-second roundtrip latency.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                id="btn-test-redis-connection"
                onClick={testRedisConnection}
                disabled={redisLoading}
                className="w-full sm:w-auto"
              >
                {redisLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Testing Connection...
                  </>
                ) : (
                  <>
                    <Activity className="mr-2 h-4 w-4" />
                    Test Redis Connection
                  </>
                )}
              </Button>

              {redisResult && (
                <div
                  className={`p-4 rounded-lg border text-sm ${
                    redisResult.success
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
                      : "bg-destructive/10 border-destructive/30 text-destructive"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {redisResult.success ? (
                      <CheckCircle2 className="h-5 w-5 mt-0.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    ) : (
                      <AlertCircle className="h-5 w-5 mt-0.5 text-destructive shrink-0" />
                    )}
                    <div className="space-y-1">
                      <p className="font-semibold text-base">
                        {redisResult.success
                          ? "Redis connected successfully!"
                          : "Connection Failed"}
                      </p>
                      {redisResult.success && redisResult.latencyMs !== undefined && (
                        <p className="text-xs opacity-90">
                          Ping Response: <strong>{redisResult.ping}</strong> (latency: {redisResult.latencyMs}ms)
                        </p>
                      )}
                      {redisResult.error && (
                        <p className="text-xs">{redisResult.error}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card 2: Session Persistence Test */}
          <Card className="border border-border/60 shadow-sm bg-card">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <CardTitle>Session Persistence</CardTitle>
              </div>
              <CardDescription>
                Generates an HMAC-signed session, writes it to Redis, reads it back, and validates persistence.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                id="btn-test-session-persistence"
                onClick={testSessionPersistence}
                disabled={sessionLoading}
                variant="secondary"
                className="w-full sm:w-auto"
              >
                {sessionLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Verifying Persistence...
                  </>
                ) : (
                  <>
                    <Key className="mr-2 h-4 w-4" />
                    Test Session Persistence
                  </>
                )}
              </Button>

              {sessionResult && (
                <div
                  className={`p-4 rounded-lg border text-sm ${
                    sessionResult.success
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
                      : "bg-destructive/10 border-destructive/30 text-destructive"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {sessionResult.success ? (
                      <CheckCircle2 className="h-5 w-5 mt-0.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    ) : (
                      <AlertCircle className="h-5 w-5 mt-0.5 text-destructive shrink-0" />
                    )}
                    <div className="space-y-1">
                      <p className="font-semibold text-base">
                        {sessionResult.success
                          ? "Session stored and verified successfully in Redis!"
                          : "Persistence Test Failed"}
                      </p>
                      {sessionResult.success && sessionResult.sessionId && (
                        <p className="text-xs font-mono opacity-90 break-all">
                          Session ID: {sessionResult.sessionId}
                        </p>
                      )}
                      {sessionResult.error && (
                        <p className="text-xs">{sessionResult.error}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
export default DiagnosticsPage;
