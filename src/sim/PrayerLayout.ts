/**
 * PrayerLayout.ts — generation of congregational prayer positions around the
 * Kaaba, and locality-aware assignment of worshippers to them.
 *
 * ARRANGEMENT
 *   In Masjid al-Haram the qibla is the Kaaba itself, so the rows are not a
 *   rectangular grid facing one world direction: they are concentric rings
 *   centred on the Kaaba, and every worshipper faces inward along their own
 *   radius. Rows are generated from the inside out, since the front (inner)
 *   rows fill first.
 *
 *   Slots are rejected where they collide with the Kaaba footprint, the Hijr
 *   Ismail, the Maqam Ibrahim, the Zamzam kiosk, gallery columns, or the
 *   radial service aisles that are kept clear for circulation.
 *
 * ASSIGNMENT
 *   Angular bucketing keeps the assignment local: a worshipper standing in
 *   the south-west of the courtyard is offered slots in the south-west first,
 *   so nobody has to cross the whole mataf. Buckets are searched outward from
 *   the worshipper's own bucket, and within a bucket slots are handed out
 *   innermost-first. Every slot is handed out at most once by construction.
 */

import { PRAYER_LAYOUT } from '../config/site.ts';
import { OBSTACLES, insideTawafExclusion, nearestObstacleDistance, wrapAngle } from './Obstacles.ts';

export interface PrayerSlots {
  /** World X of each slot. */
  readonly x: Float32Array;
  /** World Z of each slot. */
  readonly z: Float32Array;
  /** Facing yaw (radians) — toward the Kaaba centre. */
  readonly yaw: Float32Array;
  /** Row index, 0 = innermost. */
  readonly row: Int32Array;
  /** Radius of the slot from the Kaaba centre. */
