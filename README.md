# 🔥 RhythmForge AI - Forge Your Perfect Beat

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node.js-18%2B-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/vite-6.2-purple.svg)](https://vitejs.dev/)
[![AI Powered](https://img.shields.io/badge/AI-Gemini%20Powered-orange.svg)](https://ai.google.dev/)

**The ultimate AI-powered rhythm creation studio** that transforms your musical ideas into reality. Combine the precision of a blacksmith's forge with the intelligence of modern AI to craft perfect beats, rhythms, and musical compositions in real-time.

<p align="center">
  <img src="https://github.com/user-attachments/assets/b8ef0cc5-a33a-44a8-8dfc-5ddfa9ac1ac4" alt="Image" />
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/be29ef0c-ef57-4168-aebe-bd2c4131145b" alt="Image" />
</p>

## ✨ Features

### 🎛️ **Real-Time Music Control**
- **AI-Powered Generation**: Leverages Google's Gemini AI for dynamic music synthesis
- **MIDI Integration**: Full support for MIDI controllers with CC (Continuous Controller) mapping
- **16 Musical Styles**: Pre-configured prompts spanning multiple genres and BPMs
- **Live Weight Control**: Real-time adjustment of prompt weights with visual feedback

### 📊 **Advanced Rhythm Analysis**
- **Beat Detection**: Intelligent beat detection algorithm with dynamic thresholds
- **Tempo Estimation**: Real-time BPM calculation (60-200 BPM range)
- **Rhythm Quality Scoring**: Consistency analysis and quality metrics
- **Frequency Spectrum Analysis**: Bass, mid, and treble frequency breakdown

### 🤖 **AI-Powered Suggestions**
- **Smart Recommendations**: Context-aware rhythm and style suggestions
- **Category-Based Analysis**: Tempo, genre, energy, and harmony optimization
- **Confidence Scoring**: Reliability indicators for each suggestion
- **One-Click Application**: Instant implementation of AI recommendations

### 📱 **Responsive Design**
- **Cross-Platform**: Optimized for desktop, tablet, and mobile devices
- **Touch-Friendly**: Mobile-first UI with intuitive gesture controls
- **Adaptive Layout**: Dynamic grid system that scales across screen sizes
- **Compact Text**: Optimized prompt display for maximum readability

### 🎨 **Visual Experience**
- **Real-Time Visualizations**: Dynamic rhythm analysis display
- **Color-Coded Prompts**: Visual categorization with vibrant color schemes
- **Audio Level Indicators**: Live audio feedback with visual representations
- **Gradient Backgrounds**: Immersive visual experience matching audio output

## 🛠️ The Forge Setup

### What You Need
- Node.js 18+ 
- npm or yarn package manager
- Google Gemini API key
- MIDI controller (optional but recommended for full forge experience)

### Installation

1. **Clone the forge**
   ```bash
   git clone https://github.com/hakangokdev/RhythmForgeAI.git
   cd RhythmForgeAI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   # Create .env file
   echo "GEMINI_API_KEY=your_api_key_here" > .env
   ```

4. **Fire up the forge**
   ```bash
   npm run dev
   ```

5. **Enter the forge**
   Navigate to `http://localhost:5173` and start forging!

### Production Forge
```bash
npm run build
npm run preview
```

## 🔥 Master the Forge

### Forging Your First Beat
1. **Connect Your Tools** (optional): Click "MIDI" button to link your controller
2. **Fire Up Analysis**: Click "RİTİM" button to activate the rhythm forge
3. **Shape Your Sound**: Turn knobs to forge different musical elements
4. **Start the Forge**: Click play to begin AI-powered rhythm creation
5. **Apply AI Wisdom**: Use intelligent suggestions to perfect your craft

### Tool Mapping (MIDI)
1. Click "MIDI" to reveal your forging tools
2. Click "Learn" on any element to enter binding mode
3. Touch a control on your MIDI device to forge the connection
4. The mapping is automatically forged and ready

### The Forge Monitor
- **Tempo Gauge**: Real-time BPM of your current forge
- **Quality Meter**: Rhythm precision indicator (0-100%)
- **Frequency Anvils**: Visual bass, mid, and treble energy levels
- **Beat Hammer**: Pulses with each detected rhythm strike

### AI Forge Master
- **Smart Crafting**: AI suggestions based on your current forge state
- **Craft Categories**: Tempo, Genre, Energy, and Harmony guidance
- **Mastery Levels**: High (80%+), Medium (60-80%), Apprentice (<60%)
- **Instant Forging**: One-click application of master suggestions

## 🎨 The Forge Arsenal

**RhythmForge AI** comes equipped with 16 masterfully crafted rhythm templates:

| Style | BPM | Description |
|-------|-----|-------------|
| Bossa Nova | 110 | Smooth Brazilian rhythms |
| Ambient Chillwave | Varies | Atmospheric electronic textures |
| Drum & Bass | 174 | High-energy electronic beats |
| Post Punk Rhythms | Varies | Angular, driving rhythms |
| Shoegaze Walls | Varies | Dense, textural soundscapes |
| Funk Bass Slaps | Varies | Groovy bass-driven rhythms |
| 8-bit Chiptune | Varies | Retro video game sounds |
| Epic Strings | Varies | Cinematic orchestral elements |
| Crystal Arpeggios | Varies | Sparkling melodic patterns |
| Sharp Staccato | Varies | Percussive, precise attacks |
| Sub 808 Kick | Varies | Deep bass frequencies |
| Wobble Dubstep | Varies | Heavy electronic drops |
| K-Pop Energy | Varies | Upbeat, infectious rhythms |
| Neo Soul Rhodes | Varies | Warm, jazzy keyboard sounds |
| Trip Hop Vinyl | Varies | Urban, downtempo grooves |
| Thrash Kicks | Varies | Aggressive metal rhythms |

## ⚒️ The Forge Blueprint

### Core Forging Tools
- **Frontend Anvil**: TypeScript, Lit Element, Vite
- **AI Brain**: Google Gemini AI API
- **Audio Forge**: Web Audio API
- **Control Interface**: Web MIDI API
- **Build Hammer**: Vite with TypeScript support

### Master Components

#### The Audio Analyser Forge (`AudioAnalyser.ts`)
- Real-time spectral forging
- Beat detection mastery
- Tempo measurement precision
- Frequency spectrum smithing
- Quality assessment algorithms

#### The Rhythm Oracle (`RhythmOptimizer.ts`)
- AI-powered wisdom engine
- Multi-dimensional analysis (tempo, genre, energy, harmony)
- Confidence forging algorithms
- Context-aware recommendations

#### The MIDI Bridge (`MidiDispatcher.ts`)
- Hardware communication forge
- Control message handling
- Device management system
- Learning mode architecture

#### Forge Interface Elements
- **WeightKnob**: Interactive forging control with visual feedback
- **PromptController**: Individual template management with MIDI binding
- **RhythmVisualizer**: Real-time forge monitoring display
- **RhythmSuggestions**: AI master recommendation interface
- **PlayPauseButton**: Forge transport controls
- **ToastMessage**: Forge feedback system

### Performance Mastery
- **Throttled Forging**: Prevents excessive API hammering and UI updates
- **Efficient Audio Smithing**: Optimized spectral calculations
- **Responsive Timing**: Smart UI update orchestration
- **Memory Discipline**: Proper cleanup of forge contexts and listeners

## 🔧 Forge Customization

### Forging New Rhythm Templates
```typescript
// In index.tsx, enhance the DEFAULT_PROMPTS forge
const CUSTOM_FORGE_TEMPLATES = [
  { color: '#ff0000', text: 'Your Custom Forge Style' },
  // Add more masterpieces...
];
```

### Fine-tuning the Analysis Forge
```typescript
// In AudioAnalyser.ts, adjust forging parameters
private readonly BEAT_THRESHOLD = 1.3; // Forge sensitivity
private readonly MIN_BEAT_INTERVAL = 0.3; // Minimum forge timing
```

### Customizing the AI Oracle
```typescript
// In RhythmOptimizer.ts, expand the wisdom templates
private readonly genreTemplates = {
  'custom-mastery': ['Forge Style 1', 'Forge Style 2', 'Forge Style 3'],
  // Add your genres...
};
```

## 📱 Forge Compatibility

| Screen Type | Size Range | Forge Optimizations |
|-------------|------------|---------------------|
| Master Forge | 1200px+ | Full forging power |
| Compact Forge | 900-1200px | Efficient grid spacing |
| Tablet Forge | 600-900px | Touch-optimized controls |
| Mobile Forge | 480-600px | Streamlined interface |
| Pocket Forge | <480px | Maximum efficiency |

## ⚙️ Forge Configuration

### AI Brain Connection
1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Create your forge API key
3. Power up your environment:
   ```bash
   GEMINI_API_KEY=your_forge_key_here
   ```

### Audio Forge Settings
```typescript
// Default forge configuration in index.tsx
private audioContext = new AudioContext({ 
  sampleRate: 48000 // Forge-grade audio quality
});
```

## 🛠️ Forge Troubleshooting

### Common Forge Issues

**MIDI Tools Not Responding**
- Ensure browser supports Web MIDI API (Chrome, Edge recommended)
- Check your forge tool connections
- Verify device permissions in browser settings

**Audio Forge Latency**
- Adjust buffer size in forge settings
- Close other audio applications
- Use ASIO drivers on Windows for peak forge performance

**AI Brain Connection Issues**
- Verify your forge key is correctly configured
- Check network connectivity to the AI brain
- Ensure API quotas are not exceeded

**Forge Performance Issues**
- Reduce number of active rhythm templates
- Lower analysis frequency for smoother forging
- Close unnecessary browser tabs to free up forge power

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 🤝 Join the Forge

1. Fork the forge repository
2. Create a feature branch (`git checkout -b feature/forge-enhancement`)
3. Commit your masterwork (`git commit -m 'Add forge enhancement'`)
4. Push to the branch (`git push origin feature/forge-enhancement`)
5. Open a Pull Request to merge with the master forge


