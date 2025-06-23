/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/** Simple class for getting the current audio level. */
export class AudioAnalyser {
  node: AnalyserNode;
  private fftData: Uint8Array;
  private audioContext: AudioContext;
  
  // Ritim analizi için yeni özellikler
  private tempoHistory: number[] = [];
  private beatHistory: number[] = [];
  private lastBeatTime = 0;
  private bassEnergyHistory: number[] = [];
  private rhythmQuality = 0;
  
  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
    this.node = audioContext.createAnalyser();
    this.node.fftSize = 2048;
    this.node.smoothingTimeConstant = 0.8;
    this.fftData = new Uint8Array(this.node.frequencyBinCount);
  }

  getLevel(): number {
    this.node.getByteFrequencyData(this.fftData);
    let sum = 0;
    for (let i = 0; i < this.fftData.length; i++) {
      sum += this.fftData[i];
    }
    return sum / this.fftData.length / 255;
  }

  // Yeni: Bass frekanslarının enerjisini analiz et
  getBassEnergy(): number {
    this.node.getByteFrequencyData(this.fftData);
    let bassSum = 0;
    const bassRange = Math.floor(this.fftData.length * 0.1); // İlk %10 bass frekansları
    
    for (let i = 0; i < bassRange; i++) {
      bassSum += this.fftData[i];
    }
    
    const bassEnergy = bassSum / bassRange / 255;
    this.bassEnergyHistory.push(bassEnergy);
    
    // Son 50 ölçümü sakla
    if (this.bassEnergyHistory.length > 50) {
      this.bassEnergyHistory.shift();
    }
    
    return bassEnergy;
  }

  // Yeni: Beat detection algoritması
  detectBeat(): boolean {
    const currentTime = this.audioContext.currentTime;
    const bassEnergy = this.getBassEnergy();
    
    if (this.bassEnergyHistory.length < 10) return false;
    
    // Ortalama bass enerjisini hesapla
    const avgBassEnergy = this.bassEnergyHistory.reduce((a, b) => a + b, 0) / this.bassEnergyHistory.length;
    
    // Beat threshold'u dinamik olarak ayarla
    const threshold = avgBassEnergy * 1.3;
    
    // Beat algıla
    const isBeat = bassEnergy > threshold && (currentTime - this.lastBeatTime) > 0.3;
    
    if (isBeat) {
      const timeSinceLastBeat = currentTime - this.lastBeatTime;
      if (this.lastBeatTime > 0) {
        this.beatHistory.push(timeSinceLastBeat);
        if (this.beatHistory.length > 8) {
          this.beatHistory.shift();
        }
      }
      this.lastBeatTime = currentTime;
    }
    
    return isBeat;
  }

  // Yeni: Tempo tahmin algoritması
  getEstimatedTempo(): number {
    if (this.beatHistory.length < 4) return 0;
    
    const avgInterval = this.beatHistory.reduce((a, b) => a + b, 0) / this.beatHistory.length;
    const bpm = 60 / avgInterval;
    
    // Mantıklı BPM aralığında tut (60-200)
    return Math.max(60, Math.min(200, Math.round(bpm)));
  }

  // Yeni: Ritim kalitesi skorlama
  getRhythmQuality(): number {
    if (this.beatHistory.length < 4) return 0;
    
    // Beat interval'larının tutarlılığını ölç
    const avgInterval = this.beatHistory.reduce((a, b) => a + b, 0) / this.beatHistory.length;
    const variance = this.beatHistory.reduce((acc, interval) => {
      return acc + Math.pow(interval - avgInterval, 2);
    }, 0) / this.beatHistory.length;
    
    // Düşük varyans = yüksek kalite
    const consistency = Math.max(0, 1 - (variance * 10));
    
    // Bass enerjisinin dengesi
    const bassConsistency = this.bassEnergyHistory.length > 10 ? 
      1 - (Math.max(...this.bassEnergyHistory) - Math.min(...this.bassEnergyHistory)) : 0;
    
    this.rhythmQuality = (consistency + bassConsistency) / 2;
    return this.rhythmQuality;
  }

  // Yeni: Frekans spektrumu analizi
  getFrequencySpectrum(): { bass: number; mid: number; treble: number } {
    this.node.getByteFrequencyData(this.fftData);
    
    const bassEnd = Math.floor(this.fftData.length * 0.1);
    const midEnd = Math.floor(this.fftData.length * 0.5);
    
    let bass = 0, mid = 0, treble = 0;
    
    // Bass (0-10%)
    for (let i = 0; i < bassEnd; i++) {
      bass += this.fftData[i];
    }
    bass /= bassEnd;
    
    // Mid (10-50%)
    for (let i = bassEnd; i < midEnd; i++) {
      mid += this.fftData[i];
    }
    mid /= (midEnd - bassEnd);
    
    // Treble (50-100%)
    for (let i = midEnd; i < this.fftData.length; i++) {
      treble += this.fftData[i];
    }
    treble /= (this.fftData.length - midEnd);
    
    return {
      bass: bass / 255,
      mid: mid / 255,
      treble: treble / 255
    };
  }

  // Mevcut getLevel metodu aynı kalır
  reset() {
    this.tempoHistory = [];
    this.beatHistory = [];
    this.bassEnergyHistory = [];
    this.lastBeatTime = 0;
    this.rhythmQuality = 0;
  }
}
