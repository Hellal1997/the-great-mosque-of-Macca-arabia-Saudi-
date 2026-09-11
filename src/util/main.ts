/**
 * main.ts — the application.
 *
 * Wiring, in order: renderer -> environment -> crowd simulation -> character
 * rendering -> camera -> audio -> interface -> loop.
 *
 * The loop is: advance the fixed-step simulation as many times as real time
 * demands (capped), then render once with an interpolation factor. Everything
 * expensive that is not the simulation — LOD selection, culling, instance
 * upload — happens once per rendered frame, not once per tick.
 */

import * as THREE from 'three';
import './ui/ui.css';

import { Crowd } from './sim/Crowd.ts';
import { PrayerOrchestrator } from './sim/PrayerOrchestrator.ts';
import { GlobalPhase } from './sim/States.ts';
import { AnimationDirector } from './characters/AnimationDirector.ts';
import { CrowdRenderer } from './characters/CrowdRenderer.ts';
import { CrowdView } from './characters/CrowdView.ts';
import { Environment, type QualityName } from './env/Environment.ts';
import { DebugCollisionView } from './env/DebugCollision.ts';
import { CameraSystem, CAMERA_PRESETS } from './camera/CameraSystem.ts';
import { AudioSystem } from './audio/AudioSystem.ts';
import { startAutoplay } from './audio/autoplay.ts';
import { AdhanPlayer } from './audio/AdhanPlayer.ts';
import { FixedClock, FrameTimer } from './core/Clock.ts';
import { UI, type UIModel } from './ui/UI.ts';

/** Population ceiling. Documented in the README alongside the benchmarks. */
const CAPACITY = 5000;
const DEFAULT_POPULATION = 900;
const DEFAULT_ARRIVAL_RATE = 22;
const DEFAULT_CIRCUITS = 7;
const SIM_HZ = 30;
