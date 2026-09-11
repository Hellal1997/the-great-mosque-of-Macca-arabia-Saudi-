/**
 * bench.ts — simulation cost against population.
 *
 * WHAT THIS MEASURES
 *   The CPU cost of one simulation tick: steering, neighbour queries,
 *   collision response, state machines, prayer logic. It also measures the
 *   one-off cost of generating the prayer layout and baking the character
 *   animation, because those decide how long the loading screen lasts.
 *
 * WHAT THIS DOES NOT MEASURE
 *   Frame rate. Rendering needs a GPU and a browser; this is a headless Node
 *   process. The numbers here are a lower bound on what the application
 *   costs, not a statement about how fast it draws. See TEST-REPORT.md.
 *
 * Run: npm run bench
 */

import { Crowd } from '../src/sim/Crowd.ts';
import { PrayerOrchestrator } from '../src/sim/PrayerOrchestrator.ts';
import { generatePrayerSlots } from '../src/sim/PrayerLayout.ts';
import { GlobalPhase } from '../src/sim/States.ts';

const DT = 1 / 30;
const POPULATIONS = [250, 1000, 3000, 5000];
/** Ticks measured per configuration, after a warm-up. */
const MEASURE_TICKS = 900;
const WARMUP_TICKS = 240;

interface Row {
  population: number;
  scenario: string;
  meanMs: number;
  p95Ms: number;
  maxMs: number;
  realtimeHeadroom: number;
}
