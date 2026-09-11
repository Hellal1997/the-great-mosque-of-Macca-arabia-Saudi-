/**
 * Rig.ts — a small procedural humanoid skeleton.
 *
 * The whole character pipeline is generated in code: there is no external
 * rigged model to download, so there is nothing to license and nothing that
 * can fail to load. The rig is deliberately tiny (19 bones) because the
 * cameras never get close enough for finger or face detail to matter, and
 * because every bone costs bake time and vertex-animation texture space.
 *
 * CONVENTIONS
 *   * Local frame: +Y up, +Z is the character's forward. With a right-handed
 *     system that puts the character's LEFT at +X.
 *   * A bone's `offset` is the position of its joint in its parent's space at
 *     rest. At rest every bone's rotation is identity, limbs hang straight
 *     down, and the feet sit on y = 0.
 *   * Rotations are XYZ Euler triples, in radians. With limbs hanging down
 *     (0, -1, 0), a NEGATIVE X rotation swings the limb FORWARD (+Z) and a
 *     positive Z rotation swings it toward +X (the character's left).
 *   * All lengths are expressed as a fraction of total standing height, so a
 *     single rig serves every body size in the crowd.
 */

export interface BoneDef {
  readonly name: string;
  readonly parent: number;
  /** Offset from the parent joint, as a fraction of total height. */
  readonly offset: readonly [number, number, number];
}

export const BONES: readonly BoneDef[] = [
  /*  0 */ { name: 'root', parent: -1, offset: [0, 0.53, 0] },
  /*  1 */ { name: 'spine', parent: 0, offset: [0, 0.07, 0] },
  /*  2 */ { name: 'chest', parent: 1, offset: [0, 0.12, 0] },
  /*  3 */ { name: 'neck', parent: 2, offset: [0, 0.135, 0] },
  /*  4 */ { name: 'head', parent: 3, offset: [0, 0.075, 0] },

