/**
 * UI.ts — the whole overlay: controls, diagnostics, phase banner, event log,
 * loading and error states.
 *
 * PRINCIPLES
 *   * Restrained. The simulation is the subject. Panels are translucent, the
 *     type is small, and nothing animates for its own sake.
 *   * Keyboard-complete. Every control is a real focusable element with a
 *     label, and the frequently used ones also have single-key shortcuts.
 *     Nothing requires a pointer.
 *   * Honest. The "3D simulation" badge is not dismissible, the diagnostics
 *     report what is measured rather than what is hoped for, and failures
 *     surface as readable errors rather than a black screen.
 */

import { AGENT_STATE_NAMES, GLOBAL_PHASE_NAMES, GlobalPhase } from '../sim/States.ts';
import type { AudioState } from '../audio/AudioSystem.ts';
import { RECITATION } from '../audio/recitation.ts';
import { ADHAN } from '../audio/AdhanPlayer.ts';

export type QualityName = 'low' | 'medium' | 'high';

export interface UIModel {
  population: number;
  targetPopulation: number;
  waiting: number;
  capacity: number;
  prayerCapacity: number;
  byState: Int32Array;
  phase: GlobalPhase;
  phaseDetail: string;
  simTime: number;
  paused: boolean;
  speed: number;
  circuitsCompleted: number;
  arrivals: number;
