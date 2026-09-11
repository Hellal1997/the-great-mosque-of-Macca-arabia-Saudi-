/**
 * Materials.ts — every surface in the scene, generated at run time.
 *
 * WHY PROCEDURAL
 *   No photographic texture of the Haram can be shipped without a licence,
 *   and inventing a "photoreal" one would be worse: it would look like a
 *   claim about a real place that the simulation is not entitled to make.
 *   Everything here is synthesised from noise and simple functions, so the
 *   asset manifest has no third-party entries and the whole thing still
 *   builds offline. See ASSETS.md.
 *
 * WHAT IS DELIBERATELY ABSENT
 *   The kiswah of the Kaaba carries Qur'anic calligraphy woven in gold. This
 *   simulation does NOT attempt to reproduce it. Fabricating approximate
 *   sacred text would be disrespectful and inaccurate, so the hizam and the
 *   door are rendered as gold-toned bands and panels with abstract, non-
 *   textual relief. The same restraint applies to the arcades.
 */

import * as THREE from 'three';

type Canvas = HTMLCanvasElement;

function canvas(size: number): { c: Canvas; ctx: CanvasRenderingContext2D } {
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d');
  if (!ctx) throw new Error('2D canvas context unavailable — cannot generate textures.');
  return { c, ctx };
}

/** Deterministic value noise so every run looks identical. */
function makeNoise(seed: number) {
  const perm = new Uint8Array(512);
  let s = seed >>> 0;
