/**
 * PrayerOrchestrator.ts — the precinct-wide state machine and the salah
 * animation timeline.
 *
 * THE SEQUENCE
 *   The postures and their order follow the standard congregational salah:
 *     takbirat al-ihram (standing, hands raised)
 *     -> qiyam (standing recitation)
 *     -> ruku (bowing, back level, hands on knees)
 *     -> i'tidal (returning to standing)
 *     -> sujud (prostration)
 *     -> jalsa (sitting between the two prostrations)
 *     -> sujud (second prostration)
 *     -> rise for the next rak'ah, or sit for tashahhud
 *     -> tashahhud (final sitting)
 *     -> taslim (greeting to the right, then to the left)
 *   A middle tashahhud is inserted after the second rak'ah of a three- or
 *   four-rak'ah prayer.
 *
 * DOCUMENTED SIMPLIFICATIONS
 *   * Segment durations are compressed relative to a real congregation so a
 *     complete cycle is watchable; `durationScale` exposes this.
 *   * Qunut, sujud al-sahw and the differences between the madhahib in the
 *     details of hand placement and the sitting posture are not modelled.
 *   * This orchestrator renders body posture only. Optional Quran recordings
 *     play independently through AudioSystem, without posture synchronisation.
 *
 * ADHAN / IQAMAH / START
 *   These are kept as three separate, separately configurable events, because
 *   they are separated in practice by an interval that varies by prayer and
 *   by mosque. The simulation clock is a demonstration clock: it is NOT a
 *   prayer-time calculator and makes no claim about when any congregation in
 *   Makkah actually begins.
 */

import { Clip, GlobalPhase } from './States.ts';
