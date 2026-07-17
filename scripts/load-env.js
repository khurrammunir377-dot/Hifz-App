/**
 * Cross-platform environment loader.
 *
 * Priority: system environment variables > .env file values.
 * This ensures that platform-injected variables are never overridden
 * by placeholder values in the .env file.
 *
 * Works on Windows, macOS, and Linux.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve .env relative to the project root (one level up from scripts/)
const envPath = path.resolve(__dirname, "..", ".env");

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  const lines = envContent.split(/\r?\n/); // Handle both LF and CRLF line endings
  lines.forEach((line) => {
    // Skip comments and empty lines
    if (!line || line.trim().startsWith("#")) return;
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, ""); // Remove surrounding quotes
      // Only set if not already defined in the environment (system vars take priority)
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  });
}

// Map server-side variables to Expo public (EXPO_PUBLIC_*) variables so that
// the frontend can read them without duplicating entries in .env
const mappings = {
  VITE_APP_ID: "EXPO_PUBLIC_APP_ID",
  VITE_OAUTH_PORTAL_URL: "EXPO_PUBLIC_OAUTH_PORTAL_URL",
  OAUTH_SERVER_URL: "EXPO_PUBLIC_OAUTH_SERVER_URL",
  OWNER_OPEN_ID: "EXPO_PUBLIC_OWNER_OPEN_ID",
  OWNER_NAME: "EXPO_PUBLIC_OWNER_NAME",
};

for (const [systemVar, expoVar] of Object.entries(mappings)) {
  if (process.env[systemVar] && !process.env[expoVar]) {
    process.env[expoVar] = process.env[systemVar];
  }
}
