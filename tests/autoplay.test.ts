import { describe, expect, it, vi } from 'vitest';
import type { AudioState, AudioSystem } from '../src/audio/AudioSystem.ts';
import { startAutoplay } from '../src/audio/autoplay.ts';

class Playback {
  state: AudioState = 'off';
  private completeAttempt: ((state: AudioState) => void) | undefined;

  readonly start = vi.fn(() => {
    this.state = 'starting';
    return new Promise<AudioState>((resolve) => { this.completeAttempt = resolve; });
  });

  stop(): void { this.state = 'off'; }

  async complete(state: AudioState): Promise<void> {
    this.state = state;
    this.completeAttempt?.(state);
    await Promise.resolve();
    await Promise.resolve();
  }
}

function setup() {
  const audio = new Playback();
  const target = new EventTarget();
  const cleanup = startAutoplay(audio as unknown as AudioSystem, target);
  return { audio, target, cleanup };
}

describe('entry autoplay', () => {
  it('attempts playback immediately and leaves successful playback alone', async () => {
    const { audio, target, cleanup } = setup();
    expect(audio.start).toHaveBeenCalledTimes(1);
    expect(audio.state).toBe('starting');
    await audio.complete('on');
