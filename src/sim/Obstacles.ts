/**
 * Obstacles.ts — the simplified collision + navigation representation of the
 * environment. This is deliberately kept separate from the rendering geometry
 * in src/env: renderers may add mouldings, bevels and decoration, but the
 * simulation only ever sees the convex primitives declared here.
 *
 * Every obstacle exposes a signed distance in the XZ plane (negative inside)
 * plus an outward gradient, which is all the steering code needs.
 */

import { GALLERY, HIJR, KAABA, MAQAM, MATAF, ZAMZAM } from '../config/site.ts';

export const ObstacleKind = {
  Box: 0,
  Circle: 1,
  Arc: 2,
} as const;

export type ObstacleKind = (typeof ObstacleKind)[keyof typeof ObstacleKind];

export interface ObstacleBase {
  readonly kind: ObstacleKind;
  readonly name: string;
  /** Height in metres — used for reporting only, the sim is 2.5D. */
  readonly height: number;
  /** Bounding circle for broad-phase rejection. */
  readonly bx: number;
  readonly bz: number;
  readonly br: number;
}

export interface BoxObstacle extends ObstacleBase {
  readonly kind: typeof ObstacleKind.Box;
  readonly cx: number;
  readonly cz: number;
  readonly halfX: number;
