/**
 * Touch and responsive regression checks for the simulation overlay.
 *
 * npm run qa:mobile
 * npm run qa:mobile -- --only=phone,small
 * MOBILE_QA_BASE_URL=http://127.0.0.1:5173 npm run qa:mobile
 * MOBILE_QA_BROWSER=msedge npm run qa:mobile
 * MOBILE_QA_EXECUTABLE=/path/to/chrome npm run qa:mobile
 *
 * Screenshots and a machine-readable report are written to qa-output/.
 * Chromium touch emulation verifies interaction and layout, not native iOS
 * browser chrome, the software keyboard, or physical-device frame rates.
 */
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { setTimeout as sleep } from 'node:timers/promises';
import { chromium } from 'playwright';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const OUT = fileURLToPath(new URL('../qa-output/', import.meta.url));
const PORT = Number(process.env.MOBILE_QA_PORT ?? 5232);
const BASE = process.env.MOBILE_QA_BASE_URL ?? `http://127.0.0.1:${PORT}`;
const TIMEOUT = 120_000;
const results = [];
const only = process.argv.find((arg) => arg.startsWith('--only='))?.slice(7).split(',');

function browserOptions() {
  if (process.env.MOBILE_QA_BROWSER) return { channel: process.env.MOBILE_QA_BROWSER };
  if (process.env.MOBILE_QA_EXECUTABLE) return { executablePath: process.env.MOBILE_QA_EXECUTABLE };
  if (existsSync(chromium.executablePath())) return {};
  // A workstation can have a newer Playwright browser cache than this repo.
  // Reuse an available Chromium before requiring another large download.
