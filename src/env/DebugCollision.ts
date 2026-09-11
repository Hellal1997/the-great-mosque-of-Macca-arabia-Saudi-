/**
 * DebugCollision.ts — the hidden diagnostic view.
 *
 * The brief forbids capsule people in the presented simulation, and rightly:
 * a courtyard of capsules is a prototype, not a depiction. But a crowd
 * simulation is very hard to debug without seeing what the agents actually
 * collide with, so the capsules live here, behind a switch that is off by
 * default. What this draws is the SIMULATION's view of the world — the convex
 * primitives from sim/Obstacles.ts, not the rendered architecture — which is
 * precisely what makes it useful: if the two ever disagree, this is how you
 * see it.
 */

import * as THREE from 'three';
import { OBSTACLES, ObstacleKind } from '../sim/Obstacles.ts';
import { MATAF, PRAYER_LAYOUT } from '../config/site.ts';
import type { Crowd } from '../sim/Crowd.ts';

export class DebugCollisionView {
  readonly group = new THREE.Group();
  private readonly capsules: THREE.InstancedMesh;
  private readonly dummy = new THREE.Object3D();
  private readonly capacity: number;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.group.name = 'debug-collision';
    this.group.visible = false;

    const lineMat = new THREE.LineBasicMaterial({ color: 0x63e6ff });
    const warnMat = new THREE.LineBasicMaterial({ color: 0xffb648 });

    for (const o of OBSTACLES) {
      let points: THREE.Vector3[] = [];
      if (o.kind === ObstacleKind.Box) {
        const c = Math.cos(-Math.atan2(o.sin, o.cos));
