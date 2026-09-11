/**
 * Crowd.ts — the agent-based crowd simulation.
 *
 * Design notes
 * ------------
 *  * Structure-of-arrays over typed arrays, allocated once at `capacity`.
 *    No per-tick allocation anywhere in `step()`.
 *  * A free list recycles slots so spawning and despawning never reallocate.
 *  * Neighbour interaction is bounded by a uniform spatial hash rebuilt each
 *    tick with a counting sort; there is no all-pairs sweep.
 *  * Steering is a social-force model with anisotropic weighting plus an
 *    obstacle SDF field, followed by one position-based relaxation pass that
 *    guarantees agents do not end a tick overlapping each other or geometry.
 *  * Tawaf is NOT a fixed circular track. Each agent has a preferred orbit
 *    radius that drifts, an individual preferred speed, and its own reaction
 *    to congestion, so paths differ between agents and between circuits.
 *    Circuit counting is done on accumulated signed bearing while, and only
 *    while, the agent is in PERFORMING_TAWAF.
 */

import {
  GALLERY,
  GATES,
  MATAF,
  PEDESTRIAN,
  PRAYER_LAYOUT,
  SPAWN_RADIUS,
} from '../config/site.ts';
import {
  MATAF_OBSTACLES,
  OBSTACLES,
  insideTawafExclusion,
  escapeTawafExclusion,
  nearestObstacleDistance,
  obstacleSdf,
  resolvePenetration,
