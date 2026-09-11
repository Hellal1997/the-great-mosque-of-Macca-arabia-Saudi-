/**
 * CharacterMesh.ts — procedural generation of the skinned character body.
 *
 * The body is built from "rings": closed loops of vertices placed along a
 * path, each ring bound to one or two bones with blend weights. Triangulating
 * between consecutive rings gives clean topology, and dropping rings or
 * segments gives a cheap, well-behaved LOD chain.
 *
 * The garment is a single lofted tube from hem to shoulders whose lower rings
 * are weighted to the average of both thighs. That is what lets the robe
 * follow the legs credibly through bowing, kneeling and prostration instead
 * of shearing away from the body.
 *
 * Coordinates are in HEIGHT FRACTIONS; the instance shader multiplies by each
 * agent's real height.
 */

import { BONE_COUNT, BoneIndex } from './Rig.ts';

export interface MeshData {
  /** Rest positions, 3 per vertex, in height fractions. */
  position: Float32Array;
  /** Rest normals, 3 per vertex. */
  normal: Float32Array;
  /** Two bone indices per vertex. */
  skinIndex: Uint8Array;
  /** Two matching weights per vertex (sum to 1). */
  skinWeight: Float32Array;
  /**
   * Per-vertex material zone, used by the shader to tint garment / skin /
   * head-covering separately: 0 = garment, 1 = skin, 2 = head covering,
   * 3 = sash / trim.
   */
  zone: Uint8Array;
  index: Uint32Array;
  vertexCount: number;
