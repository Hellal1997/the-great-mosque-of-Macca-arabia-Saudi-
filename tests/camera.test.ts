import { describe, expect, it } from 'vitest';
import { CAMERA_PRESETS, CameraSystem } from '../src/camera/CameraSystem.ts';

/** Pointer events do not need a browser or WebGL to exercise camera input. */
class CameraSurface extends EventTarget {
  readonly captures = new Set<number>();

  setPointerCapture(id: number): void {
    this.captures.add(id);
  }

  hasPointerCapture(id: number): boolean {
    return this.captures.has(id);
  }

  releasePointerCapture(id: number): void {
    this.captures.delete(id);
    this.pointer('lostpointercapture', id);
  }

  pointer(type: string, id: number, x = 0, y = 0): void {
    this.dispatchEvent(Object.assign(new Event(type), {
      pointerId: id,
      button: 0,
      clientX: x,
      clientY: y,
    }));
  }
}

function setup(aspect = 16 / 9) {
  const surface = new CameraSurface();
  const camera = new CameraSystem(surface as unknown as HTMLElement, aspect);
  return { surface, camera };
}

