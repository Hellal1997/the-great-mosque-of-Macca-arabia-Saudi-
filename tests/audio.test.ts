import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AudioSystem } from '../src/audio/AudioSystem.ts';

function deferredPlayback() {
  let resolve!: () => void;
  let reject!: (reason: Error) => void;
  const promise = new Promise<void>((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}

/** Control browser playback completion separately from the user's actions. */
class BrowserAudio extends EventTarget {
  static instances: BrowserAudio[] = [];
  readonly attempts: ReturnType<typeof deferredPlayback>[] = [];
  src = '';
  preload = '';
  loop = false;
  autoplay = false;
  muted = false;
  volume = 1;
  currentTime = 0;
  paused = true;
  ended = false;
  error: MediaError | null = null;

  constructor(src?: string) {
    super();
    this.src = src ?? '';
    BrowserAudio.instances.push(this);
  }

  play(): Promise<void> {
    this.paused = false;
    this.ended = false;
    const attempt = deferredPlayback();
    this.attempts.push(attempt);
