/**
 * AnimationBank.ts — every pose and clip the crowd can play.
 *
 * PRAYER POSTURES
 *   The postures and their order follow the standard congregational salah as
 *   described in the widely available fiqh manuals and as visible in any
 *   recording of a congregation: qiyam (standing) with the hands folded,
 *   takbir with the hands raised, ruku (bowing with the back level and the
 *   hands on the knees), i'tidal (returning upright), sujud (prostration on
 *   forehead, nose, palms, knees and toes), jalsa (sitting between the two
 *   prostrations), the second sujud, and the final tashahhud sitting closed
 *   by the taslim to the right and then the left.
 *
 *   Documented simplifications: the hands are single rigid blobs, so the
 *   raised index finger of the tashahhud is not modelled; the differences
 *   between schools in hand placement and in the sitting posture (iftirash
 *   vs tawarruk) are not distinguished; and no facial or lip movement is
 *   represented. Nothing in this file encodes text or recitation — only body
 *   posture.
 *
 * LOCOMOTION
 *   The walk and shuffle cycles are procedural sine-driven joint curves with
 *   a defined stride length, which is what allows the renderer to drive
 *   playback rate from the agent's actual ground speed and thereby avoid
 *   foot sliding.
 */

import { BONE_COUNT, BoneIndex, type Pose, createPose, lerpPose, makePose } from './Rig.ts';
import { CLIP_COUNT, Clip } from '../sim/States.ts';

const P = Math.PI;

// ---------------------------------------------------------------------------
// Key postures
// ---------------------------------------------------------------------------

