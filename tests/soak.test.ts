/**
 * soak.test.ts — forty simulated minutes, unattended.
 *
 * Short tests catch logic errors. They do not catch the things that only show
 * up over time: a slot allocator that leaks a few entries per prayer, an
 * accumulated bearing that drifts, a free list that loses ids, a spatial hash
 * that degrades, memory that grows. This runs 72,000 fixed timesteps through
 * repeated prayer cycles and a changing population target, sampling
 * invariants throughout and checking for drift at the end.
 *
 * It is deliberately separate from the main suite because it takes minutes:
 *   npm run soak
 */

import { describe, it, expect } from 'vitest';
import { Crowd } from '../src/sim/Crowd.ts';
import { PrayerOrchestrator } from '../src/sim/PrayerOrchestrator.ts';
import { AgentState, GlobalPhase } from '../src/sim/States.ts';
import { insideTawafExclusion } from '../src/sim/Obstacles.ts';
import { GALLERY } from '../src/config/site.ts';

const DT = 1 / 30;
const MINUTES = 40;
const TOTAL_TICKS = Math.round((MINUTES * 60) / DT);

describe('soak', () => {
  it(`survives ${MINUTES} simulated minutes with prayers and population changes`, () => {
    const capacity = 3000;
    const c = new Crowd({ capacity, seed: 0xf00d });
    c.tunables.targetPopulation = 1200;
    c.tunables.arrivalRate = 40;
    c.tunables.departureRate = 40;
    c.populate(1200);

    const o = new PrayerOrchestrator(c);
    o.settings.adhanToIqamah = 20;
