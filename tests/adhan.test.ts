import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ADHAN, AdhanPlayer } from '../src/audio/AdhanPlayer.ts';
import type { AudioState, AudioSystem } from '../src/audio/AudioSystem.ts';

class Media extends EventTarget {
  static instances: Media[] = [];
  src = '';
  volume = 1;
  preload = '';
  paused = true;
  resolve!: () => void;
  reject!: (error: Error) => void;
  constructor() { super(); Media.instances.push(this); }
  play() {
    this.paused = false;
    return new Promise<void>((resolve, reject) => { this.resolve = resolve; this.reject = reject; });
  }
  pause() { this.paused = true; }
  removeAttribute(name: string) { if (name === 'src') this.src = ''; }
  load() {}
}

function setup(state: AudioState = 'on') {
  const quran = {
    state,
    stop: vi.fn(() => { quran.state = 'off'; }),
    start: vi.fn(async () => { quran.state = 'on'; return quran.state; }),
  };
  const change = vi.fn();
  const adhan = new AdhanPlayer(quran as unknown as AudioSystem, change);
  return { quran, change, adhan };
}

describe('Haram adhan', () => {
  beforeEach(() => { Media.instances = []; vi.stubGlobal('Audio', Media); });
  afterEach(() => vi.unstubAllGlobals());
