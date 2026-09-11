/**
 * Clock.ts — a fixed-timestep accumulator with render interpolation.
 *
 * WHY FIXED
 *   Steering, collision response and row formation are all iterative. If the
 *   timestep varies with frame rate, agents on a slow machine take longer
 *   steps, tunnel through each other, and the whole crowd behaves differently
 *   from the same simulation on a fast machine. Fixing the timestep makes the
 *   simulation reproducible and stable regardless of display rate.
 *
 * WHY INTERPOLATE
 *   The simulation runs at 30 Hz. A 60 Hz display asking for raw simulation
 *   state would show each position twice, which reads as a judder even though
 *   the underlying motion is smooth. `alpha` is the fraction of the way to the
 *   next tick, and the render layer uses it to interpolate.
 *
 * SPIRAL OF DEATH
 *   If simulation cost exceeds real time — a huge population on a slow
 *   machine — running "until caught up" would never catch up and the tab
 *   would lock. `maxTicksPerFrame` caps the work and the clock quietly drops
 *   the surplus, reporting it so the diagnostics panel can show that the
 *   simulation is running behind wall time rather than pretending otherwise.
 *
 * BACKGROUND TABS
 *   A hidden tab stops firing animation frames. On return, the elapsed wall
 *   time can be minutes. `resync()` throws that away instead of trying to
 *   simulate it, so returning to the tab resumes rather than fast-forwards.
 */

export interface ClockStats {
  /** Simulation ticks executed on the last frame. */
  ticks: number;
  /** Ticks dropped on the last frame because of the cap. */
  dropped: number;
  /** Total simulated seconds. */
  simTime: number;
