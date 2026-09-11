# Architecture

This describes how the pieces fit together and, more usefully, *why* each one
is built the way it is. Most of the decisions here are trade-offs, and the
trade-off is the interesting part.

```
                       ┌──────────────┐
                       │   main.ts    │  fixed-step loop, wiring
                       └──────┬───────┘
          ┌───────────────────┼────────────────────┐
          │                   │                    │
    ┌─────▼─────┐      ┌──────▼──────┐      ┌──────▼──────┐
    │    sim    │      │ characters  │      │  env/camera │
    │           │      │             │      │  audio/ui   │
    │ Crowd     │─────▶│ Animation   │      │ Environment │
    │ Prayer    │      │  Director   │      │ CameraSystem│
    │  Orches.  │      │ CrowdView   │─────▶│ AudioSystem │
    │ SpatialH. │      │ CrowdRender │      │ UI          │
    │ Obstacles │      │ VAT bake    │      │ DebugCollis.│
    │ PrayerLay.│      │ Rig/Mesh    │      └─────────────┘
    └───────────┘      └─────────────┘
      no THREE           THREE only in
      import at all      the renderer
```

The `sim` layer imports nothing from Three.js. That is not tidiness for its
own sake: it is what lets the entire simulation run headless in Node, which is
how the test suite, the soak test and the benchmark work at all. A crowd
simulation you can only exercise through a browser is a crowd simulation you
cannot really test.

## The loop

`core/Clock.ts` runs a fixed timestep of 1/30 s with render interpolation.

**Why fixed.** Steering, collision response and row formation are iterative.
With a variable timestep, agents on a slow machine take longer steps, tunnel
through each other, and produce different behaviour from the same code on a
fast machine. Fixing the step makes the simulation reproducible and stable
independent of display rate.

**Why interpolate.** At 30 Hz on a 60 Hz display, rendering raw simulation
state shows each position twice, which reads as judder. `alpha` — the fraction
of the way to the next tick — is passed to `CrowdView`, which interpolates
position and heading (the heading through the shortest arc, so an agent
crossing ±π does not spin the long way round).

**Spiral of death.** If simulation cost exceeds real time, catching up
completely would never finish. `maxTicksPerFrame` caps the work and the clock
discards the backlog, reporting the dropped ticks so the diagnostics panel can
say the simulation is running behind rather than quietly lying about it.
