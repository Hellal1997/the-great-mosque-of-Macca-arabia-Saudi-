/**
 * simulation.test.ts — the invariants the crowd must never violate.
 *
 * These are properties, not golden values. A crowd simulation is stochastic
 * and lightly chaotic: asserting that agent 412 is at a particular coordinate
 * after 90 seconds would be a test of the random seed, not of the model. What
 * can be asserted is that nobody is ever inside the Kaaba, that the population
 * only changes through the gates, that every worshipper gets a slot of their
 * own, and that no number ever becomes NaN.
 */

import { describe, it, expect } from 'vitest';
import { Crowd } from '../src/sim/Crowd.ts';
import { PrayerOrchestrator, buildPrayerTimeline, sampleTimeline } from '../src/sim/PrayerOrchestrator.ts';
import { AgentState, GlobalPhase, AGENT_STATE_COUNT, CLIP_COUNT } from '../src/sim/States.ts';
import { insideTawafExclusion, isWalkable, OBSTACLES } from '../src/sim/Obstacles.ts';
import { generatePrayerSlots, SlotAllocator, yawTowardKaaba } from '../src/sim/PrayerLayout.ts';
import { GALLERY, MATAF, PRAYER_LAYOUT } from '../src/config/site.ts';
import { CLIPS, CLIP_OFFSETS, TOTAL_FRAMES } from '../src/characters/AnimationBank.ts';
import { resolveFrames } from '../src/characters/CrowdView.ts';

const DT = 1 / 30;

function run(crowd: Crowd, seconds: number, onTick?: (t: number) => void): void {
  const steps = Math.round(seconds / DT);
  for (let i = 0; i < steps; i++) {
    crowd.step(DT);
    onTick?.(i * DT);
  }
}

/** Every finite-number invariant, checked in one pass. */
function assertNumericallySane(crowd: Crowd): void {
  const ids = crowd.liveIdsView();
  for (let k = 0; k < ids.length; k++) {
    const id = ids[k];
