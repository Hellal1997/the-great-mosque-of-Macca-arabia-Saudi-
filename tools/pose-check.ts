/**
 * pose-check.ts — numeric validation of the salah postures.
 *
 * Screenshots tell you a posture is wrong; they are a slow way to work out by
 * how much. This prints the world position of every joint that has a physical
 * constraint attached to it, so a pose can be corrected against numbers
 * instead of by eye:
 *
 *   sujud   — forehead, both palms, both knees and the toes all on the ground
 *   jalsa   — shins on the ground, hips resting on the heels, torso upright
 *   ruku    — back near horizontal, hands at about knee height
 *   qiyam   — everything at rest height, feet flat
 *
 * Run: node --experimental-strip-types tools/pose-check.ts
 */

import { BONES, BoneIndex, RigEvaluator, createPose } from '../src/characters/Rig.ts';
import {
  POSE_QIYAM,
  POSE_TAKBIR,
  POSE_RUKU,
  POSE_ITIDAL,
  POSE_SUJUD,
  POSE_JALSA,
  POSE_TASHAHHUD,
} from '../src/characters/AnimationBank.ts';
import type { Pose } from '../src/characters/Rig.ts';

const ev = new RigEvaluator();
const p: [number, number, number] = [0, 0, 0];

/** Body height used to report figures in centimetres. */
const H = 174;

function joints(pose: Pose): Record<string, [number, number, number]> {
  ev.evaluate(pose);
