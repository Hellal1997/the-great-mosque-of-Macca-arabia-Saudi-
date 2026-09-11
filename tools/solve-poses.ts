/**
 * solve-poses.ts — fits the salah postures to physical constraints.
 *
 * WHY THIS EXISTS
 *   The postures were first authored by hand from anatomical reasoning, and
 *   they were wrong in a way that is easy to make and hard to see: a positive
 *   X rotation tilts an UPWARD-pointing bone (the spine chain) forward, but
 *   swings a DOWNWARD-pointing bone (arms, legs) backward. Signs that looked
 *   consistent on the page produced a ruku that bowed backwards and a sujud
 *   that levitated.
 *
 *   Angles are the wrong thing to author by hand anyway. What is actually
 *   known about these postures is where the BODY has to be: the forehead,
 *   the palms, the knees and the toes are on the ground in sujud; the shins
 *   are on the ground and the hips are on the heels in jalsa; the back is
 *   near level in ruku. So this states those positions and solves for the
 *   angles that satisfy them, by coordinate descent with shrinking steps
 *   over a hand-chosen set of degrees of freedom, with joint limits and a
 *   weak pull toward a neutral pose to keep the solutions anatomical.
 *
 *   The result is printed as a ready-to-paste pose specification. It is run
 *   as a tool, not at start-up: the output is committed to AnimationBank.ts
 *   so the application has no solver in it.
 *
 * Run: node --experimental-strip-types tools/solve-poses.ts
 */

import { BONES, BoneIndex, RigEvaluator } from '../src/characters/Rig.ts';
import type { Pose } from '../src/characters/Rig.ts';

const BONE_COUNT = BONES.length;
const ev = new RigEvaluator();
const scratch: [number, number, number] = [0, 0, 0];

type Axis = 0 | 1 | 2;

