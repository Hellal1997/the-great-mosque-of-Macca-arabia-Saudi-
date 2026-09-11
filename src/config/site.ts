/**
 * site.ts — Dimensional reconstruction constants for the central area of
 * Masjid al-Haram.
 *
 * PERIOD OF REFERENCE: post-2016 ground-level mataf configuration (the
 * temporary mataf bridge was removed in 1437 AH / 2016 CE, leaving an open
 * ground-level circumambulation courtyard). All figures below are an
 * APPROXIMATE RECONSTRUCTION assembled from published dimensions, not a
 * measured architectural survey. See ASSETS.md and README.md for the source
 * list and the list of documented simplifications.
 *
 * COORDINATE FRAME
 *   - Three.js right-handed, +Y up, metres.
 *   - Kaaba centre at the world origin (0, 0, 0) at courtyard floor level.
 *   - +X = geographic East, -Z = geographic North (so the usual "north up"
 *     map convention holds when looking down the -Y axis).
 *   - The Kaaba's corners point approximately to the cardinal directions,
 *     so its walls run NE / SE / SW / NW.
 *
 * TAWAF DIRECTION
 *   Counter-clockwise as seen from above. In this frame that means the
 *   tangent at a point p (in the XZ plane) is normalize(p.z, -p.x): a
 *   pilgrim at the Black Stone (East corner, +X) moves toward North (-Z),
 *   i.e. toward the Iraqi corner, keeping the Kaaba on their left.
 */

/** Kaaba structure. Widely cited: 13.1 m high, sides 12.86 m x 11.03 m. */
export const KAABA = {
  /** NE (door) and SW wall length, metres. */
  lengthNE: 12.86,
  /** NW (Hijr side) and SE wall length, metres. */
  lengthNW: 11.03,
  height: 13.1,
  /** Shadharwan: sloped marble base, ~25 cm high projecting ~35 cm. */
  baseHeight: 0.25,
  baseProjection: 0.35,
