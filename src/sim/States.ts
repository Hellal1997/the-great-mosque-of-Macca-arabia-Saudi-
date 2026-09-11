/**
 * States.ts — the two state machines that drive the simulation.
 *
 * AgentState is per-person. GlobalPhase is the precinct-wide orchestration
 * used to move the whole crowd into and out of congregational prayer.
 *
 * These are plain const objects rather than TypeScript `enum`s so that the
 * source stays fully type-erasable: that keeps `isolatedModules` happy for
 * Vite/esbuild and lets the Node test tooling run the .ts files directly.
 */

export const AgentState = {
  /** Walking in from a gate, heading for the courtyard. */
  ENTERING: 0,
  /** In the courtyard, working outward/inward to merge into the flow. */
  JOINING_TAWAF: 1,
  /** Circumambulating. */
  PERFORMING_TAWAF: 2,
  /** Finished the required circuits, peeling out of the ring. */
  LEAVING_TAWAF: 3,
  /** Heading for a gate to depart the simulated area. */
  EXITING: 4,
  /** Walking to an assigned prayer slot. */
  MOVING_TO_PRAYER: 5,
  /** Settled in a row, running the prayer animation timeline. */
  PRAYING: 6,
  /** Standing up and dispersing after the prayer. */
  RESUMING_ACTIVITY: 7,
  /** Standing still in the courtyard (e.g. after tawaf, before leaving). */
  IDLE: 8,
} as const;

export type AgentState = (typeof AgentState)[keyof typeof AgentState];

export const AGENT_STATE_NAMES: readonly string[] = [
  'ENTERING',
