/**
 * Precinct.ts — everything around the Kaaba: the marble courtyard, the
 * colonnaded galleries, the upper floors, the enclosing wall and the
 * minarets.
 *
 * MASSING, NOT SURVEY
 *   These are the correct number of column rings at the correct radii with
 *   plausible arcade proportions, not a measured reconstruction of the real
 *   arcades. Ornament is abstract: no attempt is made to reproduce the
 *   calligraphic friezes of the real building.
 *
 * DRAW CALL BUDGET
 *   The 212 columns, their capitals, bases and arches are drawn as a handful
 *   of `InstancedMesh` objects rather than 212 separate meshes, so the whole
 *   arcade costs roughly the same as one column. Openings for the gates are
 *   made by omitting instances, not by boolean geometry.
 */

import * as THREE from 'three';
import { GALLERY, GATES, MATAF, MINARETS, CORNERS } from '../config/site.ts';
import type { EnvMaterials } from './Materials.ts';

export interface PrecinctBuild {
  group: THREE.Group;
  /** Meshes whose instance counts are useful for the diagnostics panel. */
  instanceCounts: Record<string, number>;
}

/**
 * The mataf floor. A single radial disc, with the paving pattern carried by
 * the marble texture, plus two inlaid features that are genuinely there and
 * genuinely matter to the simulation:
 *   - the darker ring of the innermost circulation zone, and
 *   - the line of Hajar al-Aswad: the marked stripe running out from the
 *     Black Stone corner where each circuit begins and ends.
 */
