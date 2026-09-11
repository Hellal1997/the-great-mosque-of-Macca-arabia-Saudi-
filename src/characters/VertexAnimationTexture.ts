/**
 * VertexAnimationTexture.ts — bakes the whole animation bank into textures.
 *
 * WHY THIS APPROACH
 *   Three.js `InstancedMesh` does NOT give independent skeletal animation:
 *   a SkinnedMesh has one skeleton, and instancing it would make every copy
 *   move identically. To get thousands of independently animated people in a
 *   handful of draw calls, we bake linear-blend skinning on the CPU once at
 *   start-up and store the resulting vertex positions in a texture:
 *
 *     texel (vertexIndex, frameIndex) -> posed vertex position
 *
 *   The vertex shader then reads its own vertex's position for whatever
 *   frame that particular instance is on. Every instance can be on a
 *   different clip at a different phase, and it is still one draw call per
 *   LOD. Bake cost is a few hundred thousand vector transforms, which is
 *   milliseconds, and it happens before the first frame is presented.
 *
 * LAYOUT
 *   Position texture: RGBA32F, width = vertexCount, height = totalFrames.
 *   Normal texture:   RGBA8,   same dimensions, normal * 0.5 + 0.5.
 *   Positions are in HEIGHT-FRACTION space; the shader scales per instance.
 */

import * as THREE from 'three';
import { BONE_COUNT, RigEvaluator, createPose } from './Rig.ts';
import { CLIPS, CLIP_OFFSETS, TOTAL_FRAMES } from './AnimationBank.ts';
import type { MeshData } from './CharacterMesh.ts';
import { CLIP_COUNT } from '../sim/States.ts';

export interface BakedAnimation {
  positionTexture: THREE.DataTexture;
  normalTexture: THREE.DataTexture;
  vertexCount: number;
  frameCount: number;
  /** Bytes of GPU memory used by the two textures. */
