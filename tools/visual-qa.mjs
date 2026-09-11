/**
 * visual-qa.mjs — headless visual inspection.
 *
 * Starts the dev server, opens the pages in headless Chromium, and writes
 * screenshots to qa-output/. This is how the character rig and the scene were
 * actually checked during development: a crowd simulation can pass every
 * numeric assertion and still be visibly wrong.
 *
 * The container this was developed in has no GPU, so Chromium falls back to
 * SwiftShader (software rasterisation). That is fine for checking that things
 * are in the right place and the right shape; it is NOT a frame-rate
 * measurement and this script does not pretend otherwise.
 *
 *   node tools/visual-qa.mjs [--shots=name,name] [--keep]
 */

import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { setTimeout as sleep } from 'node:timers/promises';

const OUT = new URL('../qa-output/', import.meta.url).pathname;
const PORT = 5231;
const BASE = `http://127.0.0.1:${PORT}`;

const args = process.argv.slice(2);
const only = args.find((a) => a.startsWith('--shots='))?.split('=')[1]?.split(',') ?? null;

const LAUNCH_ARGS = [
  '--use-gl=swiftshader',
  '--enable-unsafe-swiftshader',
  '--no-sandbox',
  '--disable-dev-shm-usage',
  '--disable-gpu-sandbox',
  '--enable-webgl',
  '--ignore-gpu-blocklist',
