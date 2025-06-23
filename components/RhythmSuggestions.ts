/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { RhythmSuggestion } from '../utils/RhythmOptimizer';

/** Ritim iyileştirme önerilerini görüntüleyen bileşen. */
@customElement('rhythm-suggestions')
export class RhythmSuggestions extends LitElement {
  static override styles = css`
    :host {
      position: fixed;
      bottom: 20px;
      left: 20px;
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 20px;
      border-radius: 15px;
      font-family: 'Google Sans', sans-serif;
      backdrop-filter: blur(15px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      max-width: 350px;
      z-index: 1000;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    }
    
    /* Responsive ayarlar */
    @media screen and (max-width: 768px) {
      :host {
        bottom: 10px;
        left: 10px;
        right: 10px;
        padding: 15px;
        max-width: none;
      }
    }
    
    @media screen and (max-width: 480px) {
      :host {
        bottom: 5px;
        left: 5px;
        right: 5px;
        padding: 12px;
        border-radius: 10px;
      }
      
      .suggestion-prompt {
        font-size: 13px !important;
      }
      
      .suggestion-reasoning {
        font-size: 11px !important;
      }
      
      .suggestion-footer {
        font-size: 10px !important;
      }
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    }

    .title {
      font-weight: 600;
      font-size: 16px;
      color: #fff;
    }

    .close-btn {
      background: none;
      border: none;
      color: #ccc;
      font-size: 18px;
      cursor: pointer;
      padding: 5px;
      border-radius: 5px;
      transition: all 0.2s ease;
    }

    .close-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
    }

    .suggestion {
      margin-bottom: 15px;
      padding: 12px;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.05);
      border-left: 3px solid var(--category-color);
      transition: all 0.2s ease;
      cursor: pointer;
    }

    .suggestion:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateX(5px);
    }

    .suggestion:last-child {
      margin-bottom: 0;
    }

    .suggestion-prompt {
      font-weight: 600;
      font-size: 14px;
      margin-bottom: 6px;
      color: #fff;
    }

    .suggestion-reasoning {
      font-size: 12px;
      color: #ccc;
      line-height: 1.4;
      margin-bottom: 8px;
    }

    .suggestion-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
    }

    .category-badge {
      padding: 3px 8px;
      border-radius: 12px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .category-tempo {
      background: #ff6b6b;
      color: white;
    }

    .category-genre {
      background: #4ecdc4;
      color: white;
    }

    .category-energy {
      background: #45b7d1;
      color: white;
    }

    .category-harmony {
      background: #f9ca24;
      color: #333;
    }

    .confidence {
      color: #ccc;
    }

    .confidence.high {
      color: #2ecc71;
    }

    .confidence.medium {
      color: #f39c12;
    }

    .confidence.low {
      color: #e74c3c;
    }

    .no-suggestions {
      text-align: center;
      color: #ccc;
      font-style: italic;
      padding: 20px 0;
    }

    .apply-btn {
      background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
      border: none;
      color: white;
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 10px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s ease;
    }

    .apply-btn:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }
  `;

  @property({ type: Array }) suggestions: RhythmSuggestion[] = [];
  @property({ type: Boolean }) visible = false;

  private applySuggestion(suggestion: RhythmSuggestion) {
    this.dispatchEvent(new CustomEvent('apply-suggestion', {
      detail: suggestion,
      bubbles: true
    }));
  }

  private close() {
    this.dispatchEvent(new CustomEvent('close-suggestions', {
      bubbles: true
    }));
  }

  private getConfidenceClass(confidence: number): string {
    if (confidence >= 0.8) return 'high';
    if (confidence >= 0.6) return 'medium';
    return 'low';
  }

  private getConfidenceText(confidence: number): string {
    return `${Math.round(confidence * 100)}% güven`;
  }

  override render() {
    if (!this.visible) return html``;

    return html`
      <div class="header">
        <div class="title">🎯 Ritim Önerileri</div>
        <button class="close-btn" @click=${this.close}>×</button>
      </div>

      ${this.suggestions.length === 0 
        ? html`<div class="no-suggestions">
            Şu anda önerim yok.<br>
            Müzik çalmaya devam edin!
          </div>`
        : this.suggestions.map(suggestion => html`
            <div 
              class="suggestion" 
              style="--category-color: ${this.getCategoryColor(suggestion.category)}"
              @click=${() => this.applySuggestion(suggestion)}>
              
              <div class="suggestion-prompt">${suggestion.prompt}</div>
              <div class="suggestion-reasoning">${suggestion.reasoning}</div>
              
              <div class="suggestion-footer">
                <span class="category-badge category-${suggestion.category}">
                  ${this.getCategoryLabel(suggestion.category)}
                </span>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span class="confidence ${this.getConfidenceClass(suggestion.confidence)}">
                    ${this.getConfidenceText(suggestion.confidence)}
                  </span>
                  <button class="apply-btn" @click=${(e: Event) => {
                    e.stopPropagation();
                    this.applySuggestion(suggestion);
                  }}>Uygula</button>
                </div>
              </div>
            </div>
          `)
      }
    `;
  }

  private getCategoryColor(category: string): string {
    const colors = {
      'tempo': '#ff6b6b',
      'genre': '#4ecdc4',
      'energy': '#45b7d1',
      'harmony': '#f9ca24'
    };
    return colors[category as keyof typeof colors] || '#ccc';
  }

  private getCategoryLabel(category: string): string {
    const labels = {
      'tempo': 'Tempo',
      'genre': 'Tarz',
      'energy': 'Enerji',
      'harmony': 'Harmoni'
    };
    return labels[category as keyof typeof labels] || category;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'rhythm-suggestions': RhythmSuggestions;
  }
} 