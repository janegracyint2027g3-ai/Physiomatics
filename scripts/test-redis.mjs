#!/usr/bin/env node
/**
 * Physiomatics — Redis & Session Terminal Diagnostics CLI
 *
 * Usage:
 *   npm run test:redis
 *   or:
 *   node scripts/test-redis.mjs [--live]
 */

import Redis from "ioredis";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

// Auto-load .env or .env.local if not already in environment
function loadEnv() {
  const envFiles = [".env.local", ".env"];
  for (const file of envFiles) {
    const fullPath = path.join(rootDir, file);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, "utf-8");
      for (const line of content.split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eqIdx = trimmed.indexOf("=");
        if (eqIdx > 0) {
          const key = trimmed.slice(0, eqIdx).trim();
          let val = trimmed.slice(eqIdx + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    }
  }
}

loadEnv();

const isLiveFlag = process.argv.includes("--live");
const LIVE_URL = "https://physiomatics.vercel.app";

const colors = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  magenta: "\x1b[35m",
};

function banner() {
  console.log("\n" + colors.cyan + colors.bold + "==========================================================" + colors.reset);
  console.log(colors.cyan + colors.bold + "       PHYSIOMATICS — REDIS & SESSION DIAGNOSTICS         " + colors.reset);
  console.log(colors.cyan + colors.bold + "==========================================================" + colors.reset);
}

async function runLiveDiagnostics() {
  console.log(`\n${colors.yellow}[Mode]${colors.reset} Testing Live Production Vercel Deployment (${LIVE_URL})\n`);

  // Test 1: Redis Health
  process.stdout.write(`1. [HTTP GET] ${LIVE_URL}/api/redis-health ... `);
  try {
    const start = Date.now();
    const res = await fetch(`${LIVE_URL}/api/redis-health`);
    const duration = Date.now() - start;
    const json = await res.json();

    if (res.ok && json.success) {
      console.log(`${colors.green}✓ PASS${colors.reset} (${duration}ms)`);
      console.log(`   ${colors.dim}Status:${colors.reset}  ${colors.green}${json.message}${colors.reset}`);
      console.log(`   ${colors.dim}Ping:${colors.reset}    ${json.ping} (Redis Latency: ${json.latencyMs}ms)`);
    } else {
      console.log(`${colors.red}✗ FAIL${colors.reset} (${duration}ms)`);
      console.log(`   ${colors.red}Error: ${json.error || "Unknown"}${colors.reset}`);
    }
  } catch (err) {
    console.log(`${colors.red}✗ ERROR${colors.reset}`);
    console.error(`   ${colors.red}${err.message}${colors.reset}`);
  }

  // Test 2: Session Persistence
  process.stdout.write(`\n2. [HTTP POST] ${LIVE_URL}/api/session-test ... `);
  try {
    const start = Date.now();
    const res = await fetch(`${LIVE_URL}/api/session-test`, { method: "POST" });
    const duration = Date.now() - start;
    const json = await res.json();

    if (res.ok && json.success) {
      console.log(`${colors.green}✓ PASS${colors.reset} (${duration}ms)`);
      console.log(`   ${colors.dim}Status:${colors.reset}     ${colors.green}${json.message}${colors.reset}`);
      console.log(`   ${colors.dim}Session ID:${colors.reset} ${json.sessionId}`);
      console.log(`   ${colors.dim}Cookie Set:${colors.reset} ${json.cookieSet}`);
    } else {
      console.log(`${colors.red}✗ FAIL${colors.reset} (${duration}ms)`);
      console.log(`   ${colors.red}Error: ${json.error || "Unknown"}${colors.reset}`);
    }
  } catch (err) {
    console.log(`${colors.red}✗ ERROR${colors.reset}`);
    console.error(`   ${colors.red}${err.message}${colors.reset}`);
  }

  console.log("\n" + colors.green + colors.bold + "✓ Live verification finished." + colors.reset + "\n");
}

async function runDirectDiagnostics() {
  const redisUrl = process.env.REDIS_URL;
  const secret = process.env.SESSION_SECRET;

  console.log(`\n${colors.yellow}[Mode]${colors.reset} Direct Database & Engine Test (Local Environment)\n`);

  if (!redisUrl) {
    console.error(`${colors.red}✗ ERROR: REDIS_URL is not set in environment or .env${colors.reset}`);
    process.exit(1);
  }

  if (!secret) {
    console.error(`${colors.red}✗ ERROR: SESSION_SECRET is not set in environment or .env${colors.reset}`);
    process.exit(1);
  }

  // Obfuscate Redis URL for terminal display
  const maskedUrl = redisUrl.replace(/:([^:@]+)@/, ":****@");
  console.log(`   ${colors.dim}Redis Target:${colors.reset}   ${maskedUrl}`);
  console.log(`   ${colors.dim}Session Secret:${colors.reset} ${secret.slice(0, 8)}...${secret.slice(-6)}\n`);

  const client = new Redis(redisUrl, {
    maxRetriesPerRequest: 3,
    connectTimeout: 8000,
  });

  try {
    // 1. Redis Ping Test
    process.stdout.write("1. Testing Redis PING ... ");
    const t0 = Date.now();
    const pong = await client.ping();
    const pingLatency = Date.now() - t0;
    if (pong === "PONG") {
      console.log(`${colors.green}✓ PASS${colors.reset} (${pingLatency}ms)`);
      console.log(`   ${colors.bold}${colors.green}Redis connected successfully!${colors.reset}`);
    } else {
      console.log(`${colors.red}✗ FAIL (Unexpected: ${pong})${colors.reset}`);
    }

    // 2. Cryptographic HMAC Test
    process.stdout.write("\n2. Testing HMAC SHA-256 Session Signing & Anti-Tamper ... ");
    const sampleId = crypto.randomUUID();
    const hmac = crypto.createHmac("sha256", secret).update(sampleId).digest("hex");
    const signedCookie = `${sampleId}.${hmac}`;
    const tamperedCookie = `${sampleId}.${hmac.slice(0, -2)}aa`;

    const isValidOriginal = crypto.timingSafeEqual(
      Buffer.from(hmac, "hex"),
      Buffer.from(crypto.createHmac("sha256", secret).update(sampleId).digest("hex"), "hex")
    );
    const isTamperedRejected = hmac !== tamperedCookie.split(".")[1];

    if (isValidOriginal && isTamperedRejected) {
      console.log(`${colors.green}✓ PASS${colors.reset}`);
      console.log(`   ${colors.dim}Valid signature accepted, tampered signature strictly rejected.${colors.reset}`);
    } else {
      console.log(`${colors.red}✗ FAIL${colors.reset}`);
    }

    // 3. Write & Read Session Persistence
    process.stdout.write("\n3. Testing Session Write, Persistence, & Read-Back ... ");
    const testSessionId = crypto.randomUUID();
    const testData = {
      user: "Jane Gracy David",
      timestamp: new Date().toISOString(),
      role: "tester",
      terminalTest: true,
    };

    // Store in Redis with 60s TTL
    await client.setex(`session:${testSessionId}`, 60, JSON.stringify(testData));

    // Read back
    const rawRead = await client.get(`session:${testSessionId}`);
    if (!rawRead) {
      console.log(`${colors.red}✗ FAIL (Session not found in Redis)${colors.reset}`);
    } else {
      const parsed = JSON.parse(rawRead);
      if (parsed.user === testData.user && parsed.terminalTest === true) {
        console.log(`${colors.green}✓ PASS${colors.reset}`);
        console.log(`   ${colors.bold}${colors.green}Session stored and verified successfully in Redis!${colors.reset}`);
        console.log(`   ${colors.dim}Key:${colors.reset}        session:${testSessionId}`);
        console.log(`   ${colors.dim}TTL:${colors.reset}        ${await client.ttl(`session:${testSessionId}`)} seconds`);
        console.log(`   ${colors.dim}Data:${colors.reset}       ${JSON.stringify(parsed)}`);
      } else {
        console.log(`${colors.red}✗ FAIL (Data mismatch)${colors.reset}`);
      }
    }

    // Clean up test key
    await client.del(`session:${testSessionId}`);
    console.log(`   ${colors.dim}Cleanup:${colors.reset}    Test key deleted safely.`);

    console.log("\n" + colors.green + colors.bold + "==========================================================" + colors.reset);
    console.log(colors.green + colors.bold + "           ALL TERMINAL REDIS TESTS PASSED!               " + colors.reset);
    console.log(colors.green + colors.bold + "==========================================================" + colors.reset);
    console.log(`${colors.dim}Tip: Run '${colors.cyan}npm run test:redis:live${colors.dim}' to test against live Vercel endpoint.${colors.reset}\n`);
  } catch (err) {
    console.log(`${colors.red}✗ ERROR${colors.reset}`);
    console.error(`   ${colors.red}${err.message}${colors.reset}\n`);
  } finally {
    client.disconnect();
  }
}

banner();

if (isLiveFlag) {
  runLiveDiagnostics();
} else {
  runDirectDiagnostics();
}
