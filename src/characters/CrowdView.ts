/**
 * CrowdView.ts — the bridge between the simulation and the renderer.
 *
 * The simulation knows nothing about cameras and the renderer knows nothing
 * about agent states; this module is the only place that knows both. Each
 * frame it walks the live agents, interpolates them between the previous and
 * current simulation ticks, decides visibility and level of detail, resolves
 * clip phase into texture rows, and hands the result to the renderer.
 *
 * Interpolation matters here. The simulation runs on a fixed timestep that is
 * usually slower than the display refresh, so rendering raw simulation state
 * would judder. `alpha` is the fraction of a tick elapsed since the last one,
 * and every visible quantity — position and heading — is interpolated with it.
 */

import * as THREE from 'three';
import type { Crowd } from '../sim/Crowd.ts';
import type { AnimationDirector } from './AnimationDirector.ts';
import { CrowdRenderer, PALETTE_COUNT, clipFrame } from './CrowdRenderer.ts';
import { CLIPS, CLIP_OFFSETS } from './AnimationBank.ts';
import { CLIP_COUNT } from '../sim/States.ts';

const CLIP_FRAMES = new Int32Array(CLIP_COUNT);
const CLIP_LOOP = new Uint8Array(CLIP_COUNT);
for (let i = 0; i < CLIP_COUNT; i++) {
  CLIP_FRAMES[i] = CLIPS[i].frames;
  CLIP_LOOP[i] = CLIPS[i].loop ? 1 : 0;
}

/** Radius of the bounding sphere used for per-agent frustum culling. */
const AGENT_RADIUS = 1.2;

export class CrowdView {
  private readonly frustum = new THREE.Frustum();
  private readonly viewProj = new THREE.Matrix4();
  private readonly sphere = new THREE.Sphere(new THREE.Vector3(), AGENT_RADIUS);
/**
 * CrowdView.ts — the bridge between the simulation and the renderer.
 *
 * The simulation knows nothing about cameras and the renderer knows nothing
 * about agent states; this module is the only place that knows both. Each
 * frame it walks the live agents, interpolates them between the previous and
 * current simulation ticks, decides visibility and level of detail, resolves
 * clip phase into texture rows, and hands the result to the renderer.
 *
 * Interpolation matters here. The simulation runs on a fixed timestep that is
 * usually slower than the display refresh, so rendering raw simulation state
 * would judder. `alpha` is the fraction of a tick elapsed since the last one,
 * and every visible quantity — position and heading — is interpolated with it.
 */

import * as THREE from 'three';
import type { Crowd } from '../sim/Crowd.ts';
import type { AnimationDirector } from './AnimationDirector.ts';
import { CrowdRenderer, PALETTE_COUNT, clipFrame } from './CrowdRenderer.ts';
import { CLIPS, CLIP_OFFSETS } from './AnimationBank.ts';
import { CLIP_COUNT } from '../sim/States.ts';

const CLIP_FRAMES = new Int32Array(CLIP_COUNT);
const CLIP_LOOP = new Uint8Array(CLIP_COUNT);
for (let i = 0; i < CLIP_COUNT; i++) {
  CLIP_FRAMES[i] = CLIPS[i].frames;
  CLIP_LOOP[i] = CLIPS[i].loop ? 1 : 0;
}

/** Radius of the bounding sphere used for per-agent frustum culling. */
const AGENT_RADIUS = 1.2;

export class CrowdView {
  private readonly frustum = new THREE.Frustum();
  private readonly viewProj = new THREE.Matrix4();
  private readonly sphere = new THREE.Sphere(new THREE.Vector3(), AGENT_RADIUS);
