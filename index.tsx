/**
 * @fileoverview Control real time music with a MIDI controller
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { css, html, LitElement } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';

import { GoogleGenAI, type LiveMusicSession, type LiveMusicServerMessage } from '@google/genai';

import { decode, decodeAudioData } from './utils/audio'
import { throttle } from './utils/throttle'
import { AudioAnalyser } from './utils/AudioAnalyser';
import { MidiDispatcher } from './utils/MidiDispatcher';
import { RhythmOptimizer, type RhythmSuggestion } from './utils/RhythmOptimizer';

import './components/WeightKnob';
import './components/PromptController';
import './components/PlayPauseButton';
import './components/ToastMessage';
import './components/RhythmVisualizer';
import './components/RhythmSuggestions';
import type { PlayPauseButton } from './components/PlayPauseButton';
import type { ToastMessage } from './components/ToastMessage';

import type { Prompt, PlaybackState } from './types';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY, apiVersion: 'v1alpha' });
const model = 'lyria-realtime-exp';

const DEFAULT_PROMPTS = [
  // Kısa ve Etkili Ritim Tanımlamaları
  { color: '#9900ff', text: 'Bossa Nova 110 BPM' },
  { color: '#5200ff', text: 'Ambient Chillwave' },
  { color: '#ff25f6', text: 'Drum & Bass 174 BPM' },
  { color: '#2af6de', text: 'Post Punk Rhythms' },
  { color: '#ffdd28', text: 'Shoegaze Walls' },
  { color: '#2af6de', text: 'Funk Bass Slaps' },
  { color: '#9900ff', text: '8-bit Chiptune' },
  { color: '#3dffab', text: 'Epic Strings' },
  { color: '#d8ff3e', text: 'Crystal Arpeggios' },
  { color: '#d9b2ff', text: 'Sharp Staccato' },
  { color: '#3dffab', text: 'Sub 808 Kick' },
  { color: '#ffdd28', text: 'Wobble Dubstep' },
  { color: '#ff25f6', text: 'K-Pop Energy' },
  { color: '#d8ff3e', text: 'Neo Soul Rhodes' },
  { color: '#5200ff', text: 'Trip Hop Vinyl' },
  { color: '#d9b2ff', text: 'Thrash Kicks' },
];

/** The grid of prompt inputs. */
@customElement('prompt-dj-midi')
class PromptDjMidi extends LitElement {
  static override styles = css`
    :host {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
      position: relative;
      padding: 10px;
    }
    
    /* Ana container responsive ayarları */
    @media screen and (max-width: 480px) {
      :host {
        padding: 5px;
        justify-content: flex-start;
        padding-top: 60px;
      }
    }
    #background {
      will-change: background-image;
      position: absolute;
      height: 100%;
      width: 100%;
      z-index: -1;
      background: #111;
    }
    #grid {
      width: 80vmin;
      height: 80vmin;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 2.5vmin;
      margin-top: 8vmin;
    }
    
    /* Kompakt Responsive Grid */
    @media screen and (max-width: 1200px) {
      #grid {
        width: 85vmin;
        gap: 1.8vmin;
      }
    }
    
    @media screen and (max-width: 900px) {
      #grid {
        width: 88vmin;
        gap: 1.2vmin;
      }
    }
    
    @media screen and (max-width: 600px) {
      #grid {
        width: 92vmin;
        height: 92vmin;
        gap: 0.8vmin;
        margin-top: 3vmin;
      }
    }
    
    @media screen and (max-width: 480px) {
      #grid {
        width: 96vw;
        height: 96vw;
        gap: 0.4vmin;
        margin-top: 1vmin;
      }
    }
    
    @media screen and (max-width: 380px) {
      #grid {
        width: 98vw;
        height: 98vw;
        gap: 0.2vmin;
        margin-top: 0.5vmin;
      }
    }
    prompt-controller {
      width: 100%;
    }
    play-pause-button {
      position: relative;
      width: 15vmin;
    }
    
    /* Play-pause button responsive */
    @media screen and (max-width: 600px) {
      play-pause-button {
        width: 18vmin;
      }
    }
    
    @media screen and (max-width: 480px) {
      play-pause-button {
        width: 20vmin;
        margin-bottom: 10px;
      }
    }
    #buttons {
      position: absolute;
      top: 0;
      left: 0;
      padding: 5px;
      display: flex;
      gap: 5px;
      flex-wrap: wrap;
    }
    
    /* Button responsive ayarları */
    @media screen and (max-width: 600px) {
      #buttons {
        padding: 3px;
        gap: 3px;
      }
      
      button {
        padding: 2px 4px !important;
        font-size: 12px;
      }
      
      select {
        padding: 3px !important;
        font-size: 12px;
      }
    }
    
    @media screen and (max-width: 480px) {
      #buttons {
        position: relative;
        top: auto;
        left: auto;
        justify-content: center;
        margin-bottom: 10px;
        padding: 5px;
      }
    }
    button {
      font: inherit;
      font-weight: 600;
      cursor: pointer;
      color: #fff;
      background: #0002;
      -webkit-font-smoothing: antialiased;
      border: 1.5px solid #fff;
      border-radius: 4px;
      user-select: none;
      padding: 3px 6px;
      &.active {
        background-color: #fff;
        color: #000;
      }
    }
    select {
      font: inherit;
      padding: 5px;
      background: #fff;
      color: #000;
      border-radius: 4px;
      border: none;
      outline: none;
      cursor: pointer;
    }
  `;

  private prompts: Map<string, Prompt>;
  private midiDispatcher: MidiDispatcher;
  private audioAnalyser: AudioAnalyser;
  private rhythmOptimizer: RhythmOptimizer;

  @state() private playbackState: PlaybackState = 'stopped';

  private session: LiveMusicSession;
  private audioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 48000 });
  private outputNode: GainNode = this.audioContext.createGain();
  private nextStartTime = 0;
  private readonly bufferTime = 2; // adds an audio buffer in case of netowrk latency

  @property({ type: Boolean }) private showMidi = false;
  @property({ type: Boolean }) private showRhythmAnalysis = false;
  @state() private audioLevel = 0;
  @state() private midiInputIds: string[] = [];
  @state() private activeMidiInputId: string | null = null;

  // Yeni ritim analizi state'leri
  @state() private currentTempo = 0;
  @state() private rhythmQuality = 0;
  @state() private frequencySpectrum = { bass: 0, mid: 0, treble: 0 };
  @state() private beatDetected = false;
  @state() private rhythmSuggestions: RhythmSuggestion[] = [];
  @state() private showSuggestions = false;

  @property({ type: Object })
  private filteredPrompts = new Set<string>();

  private audioLevelRafId: number | null = null;
  private connectionError = true;

  @query('play-pause-button') private playPauseButton!: PlayPauseButton;
  @query('toast-message') private toastMessage!: ToastMessage;

  constructor(
    prompts: Map<string, Prompt>,
    midiDispatcher: MidiDispatcher,
  ) {
    super();
    this.prompts = prompts;
    this.midiDispatcher = midiDispatcher;
    this.audioAnalyser = new AudioAnalyser(this.audioContext);
    this.rhythmOptimizer = new RhythmOptimizer();
    this.audioAnalyser.node.connect(this.audioContext.destination);
    this.outputNode.connect(this.audioAnalyser.node);
    this.updateAudioLevel = this.updateAudioLevel.bind(this);
    this.updateAudioLevel();
  }

  override async firstUpdated() {
    await this.connectToSession();
    await this.setSessionPrompts();
  }

  private async connectToSession() {
    this.session = await ai.live.music.connect({
      model: model,
      callbacks: {
        onmessage: async (e: LiveMusicServerMessage) => {
          if (e.setupComplete) {
            this.connectionError = false;
          }
          if (e.filteredPrompt) {
            this.filteredPrompts = new Set([...this.filteredPrompts, e.filteredPrompt.text])
            this.toastMessage.show(e.filteredPrompt.filteredReason);
          }
          if (e.serverContent?.audioChunks !== undefined) {
            if (this.playbackState === 'paused' || this.playbackState === 'stopped') return;
            const audioBuffer = await decodeAudioData(
              decode(e.serverContent?.audioChunks[0].data),
              this.audioContext,
              48000,
              2,
            );
            const source = this.audioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(this.outputNode);
            if (this.nextStartTime === 0) {
              this.nextStartTime = this.audioContext.currentTime + this.bufferTime;
              setTimeout(() => {
                this.playbackState = 'playing';
              }, this.bufferTime * 1000);
            }

            if (this.nextStartTime < this.audioContext.currentTime) {
              this.playbackState = 'loading';
              this.nextStartTime = 0;
              return;
            }
            source.start(this.nextStartTime);
            this.nextStartTime += audioBuffer.duration;
          }
        },
        onerror: (e: ErrorEvent) => {
          this.connectionError = true;
          this.stop();
          this.toastMessage.show('Connection error, please restart audio.');
        },
        onclose: (e: CloseEvent) => {
          this.connectionError = true;
          this.stop();
          this.toastMessage.show('Connection error, please restart audio.');
        },
      },
    });
  }

  private getPromptsToSend() {
    return Array.from(this.prompts.values())
      .filter((p) => {
        return !this.filteredPrompts.has(p.text) && p.weight !== 0;
      })
  }

  private setSessionPrompts = throttle(async () => {
    const promptsToSend = this.getPromptsToSend();
    if (promptsToSend.length === 0) {
      this.toastMessage.show('There needs to be one active prompt to play.')
      this.pause();
      return;
    }
    try {
      await this.session.setWeightedPrompts({
        weightedPrompts: promptsToSend,
      });
    } catch (e) {
      this.toastMessage.show(e.message)
      this.pause();
    }
  }, 200);

  private updateAudioLevel() {
    this.audioLevel = this.audioAnalyser.getLevel();
    
    // Yeni ritim analizi güncellemeleri
    this.currentTempo = this.audioAnalyser.getEstimatedTempo();
    this.rhythmQuality = this.audioAnalyser.getRhythmQuality();
    this.frequencySpectrum = this.audioAnalyser.getFrequencySpectrum();
    this.beatDetected = this.audioAnalyser.detectBeat();
    
    // Ritim önerilerini güncelle (her 2 saniyede bir)
    if (this.playbackState === 'playing' && Math.random() < 0.01) { // ~2 saniyede bir
      this.updateRhythmSuggestions();
    }
    
    this.audioLevelRafId = requestAnimationFrame(this.updateAudioLevel);
  }

  private dispatchPromptsChange() {
    this.dispatchEvent(
      new CustomEvent('prompts-changed', { detail: this.prompts }),
    );
    return this.setSessionPrompts();
  }

  private handlePromptChanged(e: CustomEvent<Prompt>) {
    const { promptId, text, weight, cc } = e.detail;
    const prompt = this.prompts.get(promptId);

    if (!prompt) {
      console.error('prompt not found', promptId);
      return;
    }

    prompt.text = text;
    prompt.weight = weight;
    prompt.cc = cc;

    const newPrompts = new Map(this.prompts);
    newPrompts.set(promptId, prompt);

    this.setPrompts(newPrompts);
  }

  private setPrompts(newPrompts: Map<string, Prompt>) {
    this.prompts = newPrompts;
    this.requestUpdate();
    this.dispatchPromptsChange();
  }

  /** Generates radial gradients for each prompt based on weight and color. */
  private readonly makeBackground = throttle(
    () => {
      const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);

      const MAX_WEIGHT = 0.5;
      const MAX_ALPHA = 0.6;

      const bg: string[] = [];

      [...this.prompts.values()].forEach((p, i) => {
        const alphaPct = clamp01(p.weight / MAX_WEIGHT) * MAX_ALPHA;
        const alpha = Math.round(alphaPct * 0xff)
          .toString(16)
          .padStart(2, '0');

        const stop = p.weight / 2;
        const x = (i % 4) / 3;
        const y = Math.floor(i / 4) / 3;
        const s = `radial-gradient(circle at ${x * 100}% ${y * 100}%, ${p.color}${alpha} 0px, ${p.color}00 ${stop * 100}%)`;

        bg.push(s);
      });

      return bg.join(', ');
    },
    30, // don't re-render more than once every XXms
  );

  private pause() {
    this.session.pause();
    this.playbackState = 'paused';
    this.outputNode.gain.setValueAtTime(1, this.audioContext.currentTime);
    this.outputNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.1);
    this.nextStartTime = 0;
    this.outputNode = this.audioContext.createGain();
    this.outputNode.connect(this.audioContext.destination);
    this.outputNode.connect(this.audioAnalyser.node);
  }

  private play() {

    const promptsToSend = this.getPromptsToSend();
    if (promptsToSend.length === 0) {
      this.toastMessage.show('There needs to be one active prompt to play. Turn up a knob to resume playback.')
      this.pause();
      return;
    }

    this.audioContext.resume();
    this.session.play();
    this.playbackState = 'loading';
    this.outputNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    this.outputNode.gain.linearRampToValueAtTime(1, this.audioContext.currentTime + 0.1);
  }

  private stop() {
    this.session.stop();
    this.playbackState = 'stopped';
    this.outputNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    this.outputNode.gain.linearRampToValueAtTime(1, this.audioContext.currentTime + 0.1);
    this.nextStartTime = 0;
  }

  private async handlePlayPause() {
    if (this.playbackState === 'playing') {
      this.pause();
    } else if (this.playbackState === 'paused' || this.playbackState === 'stopped') {
      if (this.connectionError) {
        await this.connectToSession();
        this.setSessionPrompts();
      }
      this.play();
    } else if (this.playbackState === 'loading') {
      this.stop();
    }
    console.debug('handlePlayPause');
  }

  private async toggleShowMidi() {
    this.showMidi = !this.showMidi;
    if (!this.showMidi) return;
    const inputIds = await this.midiDispatcher.getMidiAccess();
    this.midiInputIds = inputIds;
    this.activeMidiInputId = this.midiDispatcher.activeMidiInputId;
  }

  private handleMidiInputChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const newMidiId = selectElement.value;
    this.activeMidiInputId = newMidiId;
    this.midiDispatcher.activeMidiInputId = newMidiId;
  }

  private resetAll() {
    this.setPrompts(buildDefaultPrompts());
    this.audioAnalyser.reset();
  }

  private toggleRhythmAnalysis() {
    this.showRhythmAnalysis = !this.showRhythmAnalysis;
  }

  private updateRhythmSuggestions() {
    const activePrompts = [...this.prompts.values()].filter(p => p.weight > 0);
    this.rhythmSuggestions = this.rhythmOptimizer.analyzeCurrentRhythm(
      activePrompts,
      this.currentTempo,
      this.rhythmQuality,
      this.frequencySpectrum
    );
    
    // Öneri varsa ve henüz gösterilmiyorsa, göster
    if (this.rhythmSuggestions.length > 0 && !this.showSuggestions) {
      this.showSuggestions = true;
    }
  }

  private handleApplySuggestion(e: CustomEvent<RhythmSuggestion>) {
    const suggestion = e.detail;
    
    // Boş bir prompt slot'u bul ve önerileni ekle
    const emptyPrompt = [...this.prompts.values()].find(p => p.weight === 0);
    if (emptyPrompt) {
      emptyPrompt.text = this.rhythmOptimizer.localizePrompt(suggestion.prompt);
      emptyPrompt.weight = 0.8; // Orta seviye ağırlık
      
      const newPrompts = new Map(this.prompts);
      newPrompts.set(emptyPrompt.promptId, emptyPrompt);
      this.setPrompts(newPrompts);
      
      this.toastMessage.show(`Ritim önerisi uygulandı: ${emptyPrompt.text}`);
    } else {
      this.toastMessage.show('Tüm slotlar dolu. Bir promptu sıfırlayın ve tekrar deneyin.');
    }
  }

  private handleCloseSuggestions() {
    this.showSuggestions = false;
  }

  override render() {
    const bg = styleMap({
      backgroundImage: this.makeBackground(),
    });
    return html`<div id="background" style=${bg}></div>
      <div id="buttons">
        <button
          @click=${this.toggleShowMidi}
          class=${this.showMidi ? 'active' : ''}
          >MIDI</button
        >
        <button
          @click=${this.toggleRhythmAnalysis}
          class=${this.showRhythmAnalysis ? 'active' : ''}
          >RİTİM</button
        >
        <select
          @change=${this.handleMidiInputChange}
          .value=${this.activeMidiInputId || ''}
          style=${this.showMidi ? '' : 'visibility: hidden'}>
          ${this.midiInputIds.length > 0
        ? this.midiInputIds.map(
          (id) =>
            html`<option value=${id}>
                    ${this.midiDispatcher.getDeviceName(id)}
                  </option>`,
        )
        : html`<option value="">No devices found</option>`}
        </select>
      </div>
      <div id="grid">${this.renderPrompts()}</div>
      <play-pause-button .playbackState=${this.playbackState} @click=${this.handlePlayPause}></play-pause-button>
      <rhythm-visualizer 
        .visible=${this.showRhythmAnalysis}
        .tempo=${this.currentTempo}
        .rhythmQuality=${this.rhythmQuality}
        .frequencySpectrum=${this.frequencySpectrum}
        .beatDetected=${this.beatDetected}>
      </rhythm-visualizer>
      <rhythm-suggestions
        .visible=${this.showSuggestions}
        .suggestions=${this.rhythmSuggestions}
        @apply-suggestion=${this.handleApplySuggestion}
        @close-suggestions=${this.handleCloseSuggestions}>
      </rhythm-suggestions>
      <toast-message></toast-message>`;
  }

  private renderPrompts() {
    return [...this.prompts.values()].map((prompt) => {
      return html`<prompt-controller
        promptId=${prompt.promptId}
        filtered=${this.filteredPrompts.has(prompt.text)}
        cc=${prompt.cc}
        text=${prompt.text}
        weight=${prompt.weight}
        color=${prompt.color}
        .midiDispatcher=${this.midiDispatcher}
        .showCC=${this.showMidi}
        audioLevel=${this.audioLevel}
        @prompt-changed=${this.handlePromptChanged}>
      </prompt-controller>`;
    });
  }
}

function main(parent: HTMLElement) {
  const midiDispatcher = new MidiDispatcher();
  const initialPrompts = getInitialPrompts();
  const pdjMidi = new PromptDjMidi(
    initialPrompts,
    midiDispatcher,
  );
  parent.appendChild(pdjMidi);
}

function getInitialPrompts(): Map<string, Prompt> {
  const { localStorage } = window;
  const storedPrompts = localStorage.getItem('prompts');

  if (storedPrompts) {
    try {
      const prompts = JSON.parse(storedPrompts) as Prompt[];
      console.log('Loading stored prompts', prompts);
      return new Map(prompts.map((prompt) => [prompt.promptId, prompt]));
    } catch (e) {
      console.error('Failed to parse stored prompts', e);
    }
  }

  console.log('No stored prompts, using default prompts');

  return buildDefaultPrompts();
}

function buildDefaultPrompts() {
  // Construct default prompts
  // Pick 3 random prompts to start with weight 1
  const startOn = [...DEFAULT_PROMPTS]
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  const prompts = new Map<string, Prompt>();

  for (let i = 0; i < DEFAULT_PROMPTS.length; i++) {
    const promptId = `prompt-${i}`;
    const prompt = DEFAULT_PROMPTS[i];
    const { text, color } = prompt;
    prompts.set(promptId, {
      promptId,
      text,
      weight: startOn.includes(prompt) ? 1 : 0,
      cc: i,
      color,
    });
  }

  return prompts;
}

function setStoredPrompts(prompts: Map<string, Prompt>) {
  const storedPrompts = JSON.stringify([...prompts.values()]);
  const { localStorage } = window;
  localStorage.setItem('prompts', storedPrompts);
}

main(document.body);
