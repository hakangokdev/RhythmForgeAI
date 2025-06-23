/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';

/** Ritim analizi ve kalite görselleştirme bileşeni. */
@customElement('rhythm-visualizer')
export class RhythmVisualizer extends LitElement {
  static override styles = css`
    :host {
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 15px;
      border-radius: 10px;
      font-family: 'Google Sans', sans-serif;
      font-size: 12px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      min-width: 200px;
      max-width: 300px;
      z-index: 1000;
    }
    
    /* Responsive ayarlar */
    @media screen and (max-width: 768px) {
      :host {
        top: 10px;
        right: 10px;
        padding: 12px;
        font-size: 11px;
        min-width: 180px;
        max-width: 250px;
      }
    }
    
    @media screen and (max-width: 480px) {
      :host {
        top: 5px;
        right: 5px;
        left: 5px;
        padding: 10px;
        font-size: 10px;
        min-width: auto;
        max-width: none;
      }
    }

    .metric {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      align-items: center;
    }

    .metric-label {
      font-weight: 500;
      color: #ccc;
    }

    .metric-value {
      font-weight: 600;
      color: #fff;
    }

    .tempo {
      color: #ff6b6b;
    }

    .quality-bar {
      width: 100%;
      height: 4px;
      background: #333;
      border-radius: 2px;
      overflow: hidden;
      margin-top: 4px;
    }

    .quality-fill {
      height: 100%;
      background: linear-gradient(90deg, #ff4444, #ffaa44, #44ff44);
      transition: width 0.3s ease;
    }

    .spectrum {
      display: flex;
      gap: 8px;
      margin-top: 8px;
    }

    .spectrum-bar {
      flex: 1;
      height: 40px;
      background: #333;
      border-radius: 2px;
      position: relative;
      overflow: hidden;
    }

    .spectrum-fill {
      position: absolute;
      bottom: 0;
      width: 100%;
      transition: height 0.1s ease;
    }

    .bass-fill {
      background: #ff6b6b;
    }

    .mid-fill {
      background: #4ecdc4;
    }

    .treble-fill {
      background: #45b7d1;
    }

    .spectrum-label {
      position: absolute;
      bottom: 2px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 10px;
      color: #fff;
      text-shadow: 0 1px 2px rgba(0,0,0,0.8);
    }

    .beat-indicator {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #333;
      transition: all 0.1s ease;
    }

    .beat-indicator.active {
      background: #ff6b6b;
      box-shadow: 0 0 15px #ff6b6b;
      transform: scale(1.2);
    }

    .header {
      text-align: center;
      font-weight: 600;
      margin-bottom: 12px;
      color: #fff;
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      padding-bottom: 8px;
    }
  `;

  @property({ type: Number }) tempo = 0;
  @property({ type: Number }) rhythmQuality = 0;
  @property({ type: Object }) frequencySpectrum = { bass: 0, mid: 0, treble: 0 };
  @property({ type: Boolean }) beatDetected = false;
  @property({ type: Boolean }) visible = false;

  override render() {
    if (!this.visible) return html``;

    const qualityPercentage = Math.round(this.rhythmQuality * 100);
    const qualityColor = this.rhythmQuality > 0.7 ? '#44ff44' : 
                        this.rhythmQuality > 0.4 ? '#ffaa44' : '#ff4444';

    return html`
      <div class="header">🎵 Ritim Analizi</div>
      
      <div class="metric">
        <span class="metric-label">Tempo:</span>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span class="metric-value tempo">${this.tempo} BPM</span>
          <div class="beat-indicator ${this.beatDetected ? 'active' : ''}"></div>
        </div>
      </div>

      <div class="metric">
        <span class="metric-label">Ritim Kalitesi:</span>
        <span class="metric-value" style="color: ${qualityColor}">
          ${qualityPercentage}%
        </span>
      </div>
      <div class="quality-bar">
        <div class="quality-fill" style=${styleMap({
          width: `${qualityPercentage}%`
        })}></div>
      </div>

      <div class="metric" style="margin-top: 12px;">
        <span class="metric-label">Frekans Spektrumu:</span>
      </div>
      <div class="spectrum">
        <div class="spectrum-bar">
          <div class="spectrum-fill bass-fill" style=${styleMap({
            height: `${Math.round(this.frequencySpectrum.bass * 100)}%`
          })}></div>
          <div class="spectrum-label">Bass</div>
        </div>
        <div class="spectrum-bar">
          <div class="spectrum-fill mid-fill" style=${styleMap({
            height: `${Math.round(this.frequencySpectrum.mid * 100)}%`
          })}></div>
          <div class="spectrum-label">Mid</div>
        </div>
        <div class="spectrum-bar">
          <div class="spectrum-fill treble-fill" style=${styleMap({
            height: `${Math.round(this.frequencySpectrum.treble * 100)}%`
          })}></div>
          <div class="spectrum-label">Treble</div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'rhythm-visualizer': RhythmVisualizer;
  }
} 