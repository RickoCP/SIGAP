/**
 * Field Alert Audio and Haptic feedback generator
 * Uses browser Web Audio API to synthesize tactical two-tone field radio dispatch alerts.
 * Works seamlessly in all modern browsers without requiring external audio assets.
 */

class FieldAudioSynthesizer {
  private audioCtx: AudioContext | null = null;
  private isAudioUnlocked = false;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {
        // will resume on user gesture
      });
    }
    return this.audioCtx;
  }

  /**
   * Play tactical radio dispatch tone
   * @param urgency 'urgent' | 'high' | 'medium' | 'low'
   */
  public playDispatchAlert(urgency: 'urgent' | 'high' | 'medium' | 'low' = 'high'): void {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      // Frequency patterns based on tactical urgency
      if (urgency === 'urgent') {
        // Urgent: Triple rapid alert pulse
        this.playTone(ctx, now, 880, 0.08, 0.2); // A5
        this.playTone(ctx, now + 0.1, 1174.66, 0.1, 0.25); // D6
        this.playTone(ctx, now + 0.25, 1318.51, 0.12, 0.25); // E6
        this.playTone(ctx, now + 0.42, 1760, 0.2, 0.3); // A6 (crescendo alarm)
      } else if (urgency === 'high') {
        // High: Dual tone radio beacon
        this.playTone(ctx, now, 784, 0.12, 0.2); // G5
        this.playTone(ctx, now + 0.14, 1046.5, 0.22, 0.25); // C6
      } else {
        // Medium / standard: Single gentle radio chime
        this.playTone(ctx, now, 659.25, 0.12, 0.15); // E5
        this.playTone(ctx, now + 0.14, 880, 0.18, 0.18); // A5
      }
    } catch (err) {
      console.warn('Field audio alert failed or blocked by autoplay policy:', err);
    }
  }

  private playTone(
    ctx: AudioContext,
    startTime: number,
    frequency: number,
    duration: number,
    volume: number
  ): void {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle'; // warmer, punchy tactical radio tone
    osc.frequency.setValueAtTime(frequency, startTime);

    // Envelope
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(volume, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);
  }

  private activeSirenOsc: OscillatorNode | null = null;
  private activeSirenGain: GainNode | null = null;
  private sirenIntervalId: number | null = null;

  /**
   * Play continuous disaster early warning siren (BNPB/BMKG public siren)
   */
  public playEarlyWarningSiren(): void {
    try {
      this.stopEarlyWarningSiren();
      const ctx = this.getContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(450, ctx.currentTime);

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      let goingUp = true;
      let currentFreq = 450;
      const interval = window.setInterval(() => {
        if (!this.activeSirenOsc) {
          clearInterval(interval);
          return;
        }
        if (goingUp) {
          currentFreq += 50;
          if (currentFreq >= 900) goingUp = false;
        } else {
          currentFreq -= 50;
          if (currentFreq <= 450) goingUp = true;
        }
        try {
          osc.frequency.setValueAtTime(currentFreq, ctx.currentTime);
        } catch {
          // ignore
        }
      }, 70);

      this.activeSirenOsc = osc;
      this.activeSirenGain = gain;
      this.sirenIntervalId = interval;

      // Auto-stop after 12 seconds to prevent audio fatigue
      setTimeout(() => {
        this.stopEarlyWarningSiren();
      }, 12000);
    } catch (err) {
      console.warn('Early warning siren could not play:', err);
    }
  }

  /**
   * Stop active disaster siren
   */
  public stopEarlyWarningSiren(): void {
    if (this.sirenIntervalId !== null) {
      clearInterval(this.sirenIntervalId);
      this.sirenIntervalId = null;
    }
    if (this.activeSirenGain && this.getContext()) {
      try {
        const ctx = this.getContext()!;
        this.activeSirenGain.gain.setValueAtTime(this.activeSirenGain.gain.value, ctx.currentTime);
        this.activeSirenGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.2);
        setTimeout(() => {
          if (this.activeSirenOsc) {
            try { this.activeSirenOsc.stop(); } catch {}
            this.activeSirenOsc.disconnect();
            this.activeSirenOsc = null;
          }
          if (this.activeSirenGain) {
            this.activeSirenGain.disconnect();
            this.activeSirenGain = null;
          }
        }, 250);
      } catch {
        this.activeSirenOsc = null;
        this.activeSirenGain = null;
      }
    } else {
      this.activeSirenOsc = null;
      this.activeSirenGain = null;
    }
  }

  /**
   * Unlock audio context on initial user click
   */
  public unlockAudio(): void {
    if (this.isAudioUnlocked) return;
    const ctx = this.getContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().then(() => {
        this.isAudioUnlocked = true;
      }).catch(() => {});
    } else if (ctx) {
      this.isAudioUnlocked = true;
    }
  }
}

export const fieldAudio = new FieldAudioSynthesizer();

/**
 * Triggers mobile haptic vibration if supported by device
 */
export function triggerFieldVibration(urgency: 'urgent' | 'high' | 'medium' | 'low' = 'high'): void {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      if (urgency === 'urgent') {
        navigator.vibrate([250, 100, 250, 100, 350]);
      } else if (urgency === 'high') {
        navigator.vibrate([200, 100, 200]);
      } else {
        navigator.vibrate([150]);
      }
    } catch {
      // ignore
    }
  }
}
