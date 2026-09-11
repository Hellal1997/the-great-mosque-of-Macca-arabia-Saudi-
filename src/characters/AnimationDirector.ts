/**
 * AnimationDirector.ts — decides which clip every agent is playing.
 *
 * This is deliberately separate from both the crowd simulation (which owns
 * positions and intent) and the renderer (which owns GPU state). It reads
 * agent state and speed, and writes four fields back into the crowd's
 * structure-of-arrays: `clip`, `clipTime`, `prevClip`, `clipBlend`.
 *
 * FOOT SLIDING
 *   Walk playback rate is derived from ground speed, never from wall time:
 *
 *     cycles per second = speed / (strideFraction * bodyHeight)
 *
 *   `strideFraction` is the ground distance one full two-step cycle covers,
 *   expressed as a fraction of body height, and it is a property of the baked
 *   clip. Because the same number drives both the animation and nothing else,
 *   a person walking at 0.3 m/s shuffles and a person at 1.3 m/s strides, and
 *   neither skates.
 *
 * CONGREGATION SYNCHRONY
 *   Worshippers follow the imam, so they share one timeline. A small
 *   per-person delay (tens to a few hundred milliseconds, stored by the crowd
 *   as `prayerDelay`) keeps the rows from looking like a single rigid object
 *   while preserving the sense of a congregation moving together.
 */

import { Clip, AgentState } from '../sim/States.ts';
import type { Crowd } from '../sim/Crowd.ts';
import type { PrayerTimeline } from '../sim/PrayerOrchestrator.ts';
import { sampleTimeline } from '../sim/PrayerOrchestrator.ts';
import { CLIPS, WALK_STRIDE_FRACTION } from './AnimationBank.ts';

/** Seconds taken to cross-fade when an agent changes clip. */
const BLEND_TIME = 0.18;

/** Below this speed a walking agent is treated as standing. */
