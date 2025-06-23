/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import type { Prompt } from '../types';

export interface RhythmSuggestion {
  prompt: string;
  reasoning: string;
  confidence: number;
  category: 'tempo' | 'genre' | 'energy' | 'harmony';
}

export class RhythmOptimizer {
  private readonly genreTemplates = {
    'electronic': ['Techno with driving 128 BPM', 'Deep House with warm basslines', 'Ambient with evolving pads'],
    'rock': ['Alternative Rock with distorted guitars', 'Indie Rock with jangly melodies', 'Post Rock with dynamic builds'],
    'hip-hop': ['Boom Bap with vinyl warmth', 'Trap with crispy hi-hats', 'Lo-Fi Hip Hop with jazzy chords'],
    'jazz': ['Bebop with walking basslines', 'Smooth Jazz with muted trumpets', 'Jazz Fusion with electric piano'],
    'world': ['Afrobeat with polyrhythmic percussion', 'Bossa Nova with nylon guitars', 'Indian Classical with sitar'],
    'orchestral': ['Cinematic Strings with epic brass', 'Chamber Music with intimate strings', 'Modern Classical with minimalist patterns']
  };

  private readonly energyLevels = {
    low: ['Ambient', 'Chillout', 'Downtempo', 'Lo-Fi'],
    medium: ['Mid-tempo', 'Groove', 'Steady', 'Balanced'],
    high: ['Energetic', 'Driving', 'Intense', 'Powerful']
  };

  analyzeCurrentRhythm(
    activePrompts: Prompt[],
    tempo: number,
    rhythmQuality: number,
    frequencySpectrum: { bass: number; mid: number; treble: number }
  ): RhythmSuggestion[] {
    const suggestions: RhythmSuggestion[] = [];

    // Tempo analizi
    if (tempo > 0) {
      suggestions.push(...this.analyzeTempoOptimization(tempo, activePrompts));
    }

    // Frekans dengesi analizi
    suggestions.push(...this.analyzeFrequencyBalance(frequencySpectrum));

    // Ritim kalitesi analizi
    if (rhythmQuality < 0.6) {
      suggestions.push(...this.suggestRhythmImprovement(rhythmQuality, activePrompts));
    }

    // Aktif prompt'ların uyumluluğu
    suggestions.push(...this.analyzePromptHarmony(activePrompts));

    // Confidence skoruna göre sırala
    return suggestions.sort((a, b) => b.confidence - a.confidence).slice(0, 3);
  }

  private analyzeTempoOptimization(tempo: number, activePrompts: Prompt[]): RhythmSuggestion[] {
    const suggestions: RhythmSuggestion[] = [];

    if (tempo < 90) {
      suggestions.push({
        prompt: 'Driving percussion with steady 110 BPM',
        reasoning: `Mevcut tempo (${tempo} BPM) çok yavaş, daha enerjik bir ritim öneriyorum`,
        confidence: 0.8,
        category: 'tempo'
      });
    } else if (tempo > 160) {
      suggestions.push({
        prompt: 'Smooth groove with relaxed 130 BPM',
        reasoning: `Mevcut tempo (${tempo} BPM) çok hızlı, daha dengeli bir ritim öneriyorum`,
        confidence: 0.7,
        category: 'tempo'
      });
    }

    return suggestions;
  }

  private analyzeFrequencyBalance(spectrum: { bass: number; mid: number; treble: number }): RhythmSuggestion[] {
    const suggestions: RhythmSuggestion[] = [];

    // Bass eksikliği
    if (spectrum.bass < 0.3 && spectrum.mid > 0.6) {
      suggestions.push({
        prompt: 'Deep 808 bass with sub frequencies',
        reasoning: 'Bass frekansları eksik, daha güçlü alt frekanslar eklenmeli',
        confidence: 0.85,
        category: 'energy'
      });
    }

    // Treble eksikliği
    if (spectrum.treble < 0.3 && spectrum.bass > 0.6) {
      suggestions.push({
        prompt: 'Bright cymbals with sparkling harmonics',
        reasoning: 'Üst frekanslar eksik, parlaklık ve canlılık kazandıracak elementler eklenmeli',
        confidence: 0.8,
        category: 'energy'
      });
    }

    // Dengeli spektrum için harmony önerisi
    if (Math.abs(spectrum.bass - spectrum.mid) < 0.2 && Math.abs(spectrum.mid - spectrum.treble) < 0.2) {
      suggestions.push({
        prompt: 'Lush strings with warm harmonic content',
        reasoning: 'Frekans dengesi iyi, harmonik zenginlik eklemek için string elementleri öneriyorum',
        confidence: 0.6,
        category: 'harmony'
      });
    }

    return suggestions;
  }

  private suggestRhythmImprovement(quality: number, activePrompts: Prompt[]): RhythmSuggestion[] {
    const suggestions: RhythmSuggestion[] = [];

    if (quality < 0.4) {
      suggestions.push({
        prompt: 'Quantized kick with tight timing',
        reasoning: 'Ritim tutarlılığı düşük, net ve keskin vuruşlarla düzenlilik sağlanmalı',
        confidence: 0.9,
        category: 'tempo'
      });
    }

    return suggestions;
  }

  private analyzePromptHarmony(activePrompts: Prompt[]): RhythmSuggestion[] {
    const suggestions: RhythmSuggestion[] = [];
    
    if (activePrompts.length === 0) {
      return suggestions;
    }

    const activeTexts = activePrompts.map(p => p.text.toLowerCase());
    
    // Tarz uyumsuzluğu kontrolü
    const hasElectronic = activeTexts.some(t => 
      t.includes('dubstep') || t.includes('techno') || t.includes('electronic') || t.includes('synth')
    );
    const hasOrganic = activeTexts.some(t => 
      t.includes('acoustic') || t.includes('jazz') || t.includes('folk') || t.includes('classical')
    );

    if (hasElectronic && hasOrganic) {
      suggestions.push({
        prompt: 'Organic electronic fusion with hybrid elements',
        reasoning: 'Elektronik ve organik elementlerin karışımı tespit edildi, fusion yaklaşımı öneriyorum',
        confidence: 0.7,
        category: 'genre'
      });
    }

    // Eksik element analizi
    const hasRhythm = activeTexts.some(t => 
      t.includes('drum') || t.includes('beat') || t.includes('kick') || t.includes('percussion')
    );
    const hasMelody = activeTexts.some(t => 
      t.includes('melody') || t.includes('arpeggio') || t.includes('lead') || t.includes('piano')
    );
    const hasBass = activeTexts.some(t => 
      t.includes('bass') || t.includes('sub') || t.includes('low')
    );

    if (!hasRhythm) {
      suggestions.push({
        prompt: 'Crisp snare with punchy kick drum',
        reasoning: 'Ritimsel element eksik, güçlü bir davul seksiyonu eklenmeli',
        confidence: 0.85,
        category: 'tempo'
      });
    }

    if (!hasBass) {
      suggestions.push({
        prompt: 'Rolling bassline with warm sub frequencies',
        reasoning: 'Bass element eksik, ritimi destekleyecek bass hattı eklenmeli',
        confidence: 0.8,
        category: 'energy'
      });
    }

    return suggestions;
  }

  // Önerileri Türkçe'ye çevir
  localizePrompt(englishPrompt: string): string {
    const translations: Record<string, string> = {
      'Driving percussion with steady 110 BPM': 'Sabit 110 BPM ile güçlü perküsyon',
      'Smooth groove with relaxed 130 BPM': 'Rahat 130 BPM ile yumuşak groove',
      'Deep 808 bass with sub frequencies': '808 bass ile derin alt frekanslar',
      'Bright cymbals with sparkling harmonics': 'Parlak ziller ile canlı harmonikler',
      'Lush strings with warm harmonic content': 'Sıcak harmonik içerikli zengin strings',
      'Quantized kick with tight timing': 'Sıkı zamanlama ile quantize kick',
      'Organic electronic fusion with hybrid elements': 'Hibrit elementlerle organik elektronik füzyon',
      'Crisp snare with punchy kick drum': 'Net snare ile güçlü kick davul',
      'Rolling bassline with warm sub frequencies': 'Sıcak alt frekanslarla yuvarlanır bass hattı'
    };

    return translations[englishPrompt] || englishPrompt;
  }
} 