/**
 * characterPreview.ts — a development harness, not part of the application.
 *
 * The whole point of the crowd renderer is that thousands of people cost
 * almost nothing. The risk of that approach is that a mistake in the rig, the
 * skinning weights or a posture is invisible at broadcast distance and yet
 * completely wrong. So before scaling up, this page draws exactly ONE person,
 * two metres tall on the screen, through the whole clip bank, using the same
 * baked animation texture and the same instanced shader the crowd uses.
 *
 * Served only by the dev server; excluded from the production build.
 */

import * as THREE from 'three';
import { CrowdRenderer, clipFrame } from '../characters/CrowdRenderer.ts';
import { CLIP_NAMES, CLIP_COUNT } from '../sim/States.ts';
import { CLIPS } from '../characters/AnimationBank.ts';

const label = document.getElementById('label')!;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight, false);
renderer.setPixelRatio(1);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
document.body.append(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x2b3036);

const camera = new THREE.PerspectiveCamera(32, window.innerWidth / window.innerHeight, 0.1, 60);

scene.add(new THREE.HemisphereLight(0xcfe0ff, 0x40382c, 1.5));
const key = new THREE.DirectionalLight(0xfff0dc, 2.4);
key.position.set(3, 5, 4);
scene.add(key);
