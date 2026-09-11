/**
 * CrowdRenderer.ts — draws the whole crowd in a handful of draw calls.
 *
 * One `InstancedBufferGeometry` per LOD, each sharing a material that samples
 * the baked vertex-animation texture. Per instance we upload 11 floats:
 * position, yaw, height, build, two animation frames, a blend weight, a
 * palette index and a brightness jitter. Everything else — the posed vertex
 * positions and normals — comes out of the texture, so each instance can be
 * on a completely different clip at a completely different phase while the
 * whole LOD still costs exactly one draw call.
 *
 * Ground contact is provided by cheap instanced blob shadows rather than by
 * putting several thousand characters into the shadow map. That is a
 * deliberate trade: the architecture casts real shadows, and the crowd gets a
 * grounded look for a fraction of the cost. It is listed in the limitations.
 */

import * as THREE from 'three';
import { LOD_SPECS, buildCharacterMesh, type MeshData } from './CharacterMesh.ts';
import { bakeVertexAnimation, type BakedAnimation } from './VertexAnimationTexture.ts';
import { CLIPS, CLIP_OFFSETS, WALK_STRIDE_FRACTION } from './AnimationBank.ts';
import { Clip } from '../sim/States.ts';

/**
 * Garment palettes: garment, head covering, skin.
 *
 * The weighting matters more than the individual colours. Ihram is two
 * lengths of unstitched white cloth, and the mataf is overwhelmingly white as
 * a result; an even mix of light and dark garments reads as a generic crowd
 * rather than as this one. Eight of the ten entries are white or off-white,
 * and the two muted ones are there because a real crowd is never perfectly
 * uniform. Per-instance brightness jitter breaks up the whites so they do not
 * read as one flat sheet.
 */
const PALETTES: ReadonlyArray<readonly [number, number, number]> = [
  // garment, head covering, skin
