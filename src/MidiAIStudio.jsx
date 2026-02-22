import { useState, useEffect } from "react";

const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

const NAV_ITEMS = [
  { label: "Home",          id: "s-intro" },
  { label: "Sheet Music",   id: "s-sheet" },
  { label: "MIDI Deep",     id: "s-midi" },
  { label: "The Problem",   id: "s-problem" },
  { label: "My Solution",   id: "s-solution" },
  { label: "Real Struggles",id: "s-struggles" },
  { label: "Pipeline",      id: "s-pipeline" },
  { label: "Showcase",      id: "s-showcase" },
  { label: "Project",       id: "s-project" },
];

/* ── Live Piano Roll ── */
const MidiGrid = () => {
  const notes = ["C5","B4","A4","G4","F4","E4","D4","C4"];
  const COLS = 16;
  const noteData = [
    {r:0,s:0,l:2},{r:0,s:4,l:3},{r:0,s:8,l:2},{r:0,s:13,l:2},
    {r:1,s:2,l:4},{r:1,s:10,l:3},
    {r:2,s:1,l:2},{r:2,s:6,l:4},{r:2,s:12,l:2},
    {r:3,s:0,l:3},{r:3,s:5,l:2},{r:3,s:9,l:4},
    {r:4,s:3,l:3},{r:4,s:8,l:2},{r:4,s:14,l:2},
    {r:5,s:1,l:4},{r:5,s:7,l:3},
    {r:6,s:0,l:2},{r:6,s:5,l:2},{r:6,s:11,l:3},
    {r:7,s:2,l:3},{r:7,s:8,l:4},{r:7,s:14,l:1},
  ];
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick(p => (p+1)%COLS), 180);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="overflow-hidden rounded-xl border border-amber-500/30 bg-gray-950 w-full">
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-900 border-b border-gray-800">
        <div className="w-2 h-2 rounded-full bg-red-500"/>
        <div className="w-2 h-2 rounded-full bg-yellow-500"/>
        <div className="w-2 h-2 rounded-full bg-green-500"/>
        <span className="text-gray-400 text-xs ml-2 font-mono truncate">MIDI Piano Roll — composition.mid</span>
      </div>
      <div className="p-3 md:p-4">
        {notes.map((note, ri) => (
          <div key={note} className="flex items-center gap-1 mb-1">
            <span className="text-gray-500 text-xs w-7 font-mono text-right flex-shrink-0">{note}</span>
            <div className="flex gap-0.5 flex-1 min-w-0">
              {Array(COLS).fill(0).map((_,ci) => {
                const block = noteData.find(n=>n.r===ri&&n.s===ci);
                const cont  = noteData.find(n=>n.r===ri&&n.s<ci&&n.s+n.l>ci);
                return <div key={ci} className={`h-3 md:h-4 flex-1 rounded-sm transition-colors duration-100 ${ci===tick?"bg-gray-600/60":block?"bg-amber-400 shadow-sm shadow-amber-500/40":cont?"bg-amber-600/60":"bg-gray-800"}`}/>;
              })}
            </div>
          </div>
        ))}
        <div className="flex gap-0.5 mt-2 ml-8">
          {Array(COLS).fill(0).map((_,i)=>(
            <div key={i} className="flex-1 text-center">
              {i%4===0&&<span className="text-gray-600 text-xs font-mono">{i+1}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ── Waveform ── */
const Waveform = ({ color="bg-amber-400", n=12 }) => (
  <div className="flex items-end gap-0.5 opacity-30">
    {Array(n).fill(0).map((_,i)=>(
      <div key={i} className={`w-1.5 rounded-t ${color}`}
        style={{height:`${18+Math.abs(Math.sin(i*0.9))*22}px`,animation:`waveform 0.7s ${i*0.045}s ease-in-out infinite alternate`}}/>
    ))}
  </div>
);

/* ── Syntax-highlighted MIDI text ── */
const MidiText = () => {
  const code = `Tempo: 85\nTimeSig: 4/4\nKey: D\n\nBar: 1\nD4: X50 .(3)   X60 .(3)   X70 .(3)   X80 .(3)\nA3: X40 ~(15)\nF3: .(8)       X55 ~(7)\n\nBar: 2\nD4: X85 ~(3)   .(4)       X70 .(3)   X90 .(4)\nA3: ~(16)\nF3: ~(8)       .(4)       X60 ~(3)`;
  const cl = l => {
    if(/^(Tempo|TimeSig|Key)/.test(l)) return "text-amber-400";
    if(/^Bar/.test(l)) return "text-purple-400 font-bold";
    if(/^[A-G]/.test(l)) return "text-emerald-400";
    if(l.includes("~")) return "text-pink-300";
    if(l.includes("X")) return "text-blue-300";
    if(l.includes(".")) return "text-gray-600";
    return "text-gray-300";
  };
  return (
    <div className="rounded-xl border border-emerald-500/30 bg-gray-950 overflow-hidden w-full">
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-900 border-b border-gray-800">
        <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0"/>
        <span className="text-gray-400 text-xs ml-1 font-mono truncate">human-readable.txt — Custom Format</span>
      </div>
      <pre className="p-4 text-xs font-mono leading-6 overflow-x-auto">
        {code.split("\n").map((l,i)=><div key={i} className={cl(l)}>{l||"\u00A0"}</div>)}
      </pre>
    </div>
  );
};

/* ── Binary hex dump ── */
const HexDump = () => (
  <div className="rounded-xl border border-red-500/30 bg-gray-950 overflow-hidden w-full">
    <div className="flex items-center gap-2 px-4 py-2 bg-gray-900 border-b border-gray-800">
      <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0"/>
      <span className="text-gray-400 text-xs ml-1 font-mono truncate">raw.mid — Binary Hexdump</span>
    </div>
    <div className="p-4 font-mono text-xs overflow-x-auto">
      {["4D 54 68 64","00 00 00 06","00 01 00 04","01 E0 4D 54","72 6B 00 00","00 38 00 FF","51 03 07 A1","20 00 FF 58","04 04 02 18","08 00 FF 2F","00 4D 54 72","6B 00 00 01"].map((r,i)=>(
        <div key={i} className="flex gap-4 mb-1">
          <span className="text-gray-600 flex-shrink-0">{String(i*4).padStart(4,"0")}</span>
          <span className="text-red-400/80">{r}</span>
        </div>
      ))}
      <div className="text-gray-600 mt-2">… 12,847 more bytes …</div>
    </div>
  </div>
);

/* ── Reusable UI ── */
const SectionHdr = ({ eyebrow, title, sub }) => (
  <div className="text-center mb-10 md:mb-14 px-2">
    <div className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono tracking-widest uppercase mb-4">{eyebrow}</div>
    <h2 className="text-2xl md:text-4xl font-black text-white mb-3 leading-tight">{title}</h2>
    {sub&&<p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">{sub}</p>}
  </div>
);

const ACCENT = {
  amber:  ["border-amber-500/20 bg-amber-500/5 hover:border-amber-400/50","text-amber-400"],
  purple: ["border-purple-500/20 bg-purple-500/5 hover:border-purple-400/50","text-purple-400"],
  emerald:["border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-400/50","text-emerald-400"],
  blue:   ["border-blue-500/20 bg-blue-500/5 hover:border-blue-400/50","text-blue-400"],
  pink:   ["border-pink-500/20 bg-pink-500/5 hover:border-pink-400/50","text-pink-400"],
  cyan:   ["border-cyan-500/20 bg-cyan-500/5 hover:border-cyan-400/50","text-cyan-400"],
};
const Card = ({ icon, title, desc, accent="amber" }) => {
  const [b,ic]=ACCENT[accent];
  return (
    <div className={`rounded-2xl border p-5 transition-all duration-300 ${b}`}>
      <div className={`text-2xl mb-3 ${ic}`}>{icon}</div>
      <h3 className="text-white font-bold text-sm mb-2">{title}</h3>
      <p className="text-gray-400 text-xs leading-relaxed">{desc}</p>
    </div>
  );
};

const RuleCard = ({ symbol, name, desc, example }) => (
  <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 hover:border-amber-500/40 transition-all">
    <div className="flex items-start gap-3">
      <div className="bg-gray-800 rounded-lg px-2 py-1.5 font-mono text-amber-400 text-sm font-bold whitespace-nowrap flex-shrink-0">{symbol}</div>
      <div className="flex-1 min-w-0">
        <div className="text-white font-semibold text-xs mb-1">{name}</div>
        <div className="text-gray-400 text-xs mb-2">{desc}</div>
        {example&&<div className="bg-gray-950 rounded-lg px-3 py-1.5 font-mono text-xs text-emerald-400 border border-gray-800 break-all">{example}</div>}
      </div>
    </div>
  </div>
);

const Step = ({ num, title, desc, last }) => (
  <div className="flex gap-3">
    <div className="flex flex-col items-center flex-shrink-0">
      <div className="w-7 h-7 rounded-full bg-amber-500 text-black font-black flex items-center justify-center text-xs">{num}</div>
      {!last&&<div className="w-px flex-1 bg-gray-800 my-2 min-h-4"/>}
    </div>
    <div className="pb-5 pt-0.5 min-w-0">
      <h4 className="text-white font-bold text-xs mb-1">{title}</h4>
      <p className="text-gray-400 text-xs leading-relaxed">{desc}</p>
    </div>
  </div>
);

/* ── Demo Modal ── */
const DemoModal = ({ onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl" onClick={e=>e.stopPropagation()}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white font-black text-lg">🚀 Open the Project</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-800 transition-all text-xl">✕</button>
      </div>
      <div className="space-y-3">
        <a href="https://midi-generator-seven.vercel.app/" target="_blank" rel="noreferrer"
          className="flex items-center gap-4 bg-amber-500 hover:bg-amber-400 text-black rounded-xl px-5 py-4 transition-all group">
          <span className="text-2xl flex-shrink-0">🔐</span>
          <div className="min-w-0"><div className="font-black text-sm">Authenticated Demo</div><div className="text-black/60 text-xs truncate">midi-generator-seven.vercel.app</div></div>
          <span className="ml-auto group-hover:translate-x-1 transition-transform font-bold flex-shrink-0">→</span>
        </a>
        <a href="https://ai-midi-generator-six.vercel.app/" target="_blank" rel="noreferrer"
          className="flex items-center gap-4 bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 rounded-xl px-5 py-4 transition-all group">
          <span className="text-2xl flex-shrink-0">🌐</span>
          <div className="min-w-0"><div className="font-black text-sm">Open Demo</div><div className="text-gray-400 text-xs truncate">ai-midi-generator-six.vercel.app</div></div>
          <span className="ml-auto group-hover:translate-x-1 transition-transform text-gray-400 font-bold flex-shrink-0">→</span>
        </a>
        <a href="https://github.com/bharath-mnr/midi-generator" target="_blank" rel="noreferrer"
          className="flex items-center gap-4 bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 rounded-xl px-5 py-4 transition-all group">
          <span className="text-2xl flex-shrink-0">⭐</span>
          <div className="min-w-0"><div className="font-black text-sm">GitHub Repository</div><div className="text-gray-400 text-xs truncate">github.com/bharath-mnr/midi-generator</div></div>
          <span className="ml-auto group-hover:translate-x-1 transition-transform text-gray-400 font-bold flex-shrink-0">→</span>
        </a>
      </div>
      <p className="text-gray-600 text-xs text-center mt-5">Click outside to close</p>
    </div>
  </div>
);

/* ── Prompt Modal ── */
const PROMPT_TEXT = `Create a 45-bar epic cinematic piano composition in D minor at 85 BPM in 4/4 time.

═══════════════════════════════════════════════════════════════════════
ARCHITECTURAL STRUCTURE: Symmetrical Arc with Central Climax
═══════════════════════════════════════════════════════════════════════

INTRODUCTION - BARS 1-8 (The Awakening)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Dynamics: pp to mp (velocity 45→69)
Texture: Sparse, contemplative, building foundation

Chord Progression: Dm - Bb - C - Am (repeating twice)

Bar 1 (Dm, vel 45): 
- Bass: D2 whole note, A2 enters beat 2
- Arpeggios: D3-F3-A3-D4 sixteenth note pattern across middle register
- High notes: A5 whole note (vel 50), D6 enters beat 2 (vel 52)

Bar 2 (Bb, vel 48):
- Bass: Bb1 whole note, F2 enters beat 2
- Arpeggios: Bb2-D3-F3-Bb3 pattern
- High notes: F5 whole note (vel 53), Bb5 enters beat 2 (vel 55)

Bar 3 (C, vel 52):
- Bass: C2 whole note, G2 enters beat 2
- Arpeggios: C3-E3-G3-C4 pattern
- High notes: C5 whole note (vel 57), E5 beat 2 (vel 59), G5 beat 3 (vel 61)
- Gradual ascending melody introduction

Bar 4 (Am, vel 55-58):
- Bass: A2 whole note transitioning to vel 58 at beat 3, E3 enters beat 2
- Arpeggios: A3-C#4-E4-A4 pattern
- High melody becomes active: A5 (vel 63), rising through C#6, E6 with velocities 65-69
- First hint of melodic movement and emotional expression

Bars 5-8: EXACT REPEAT of bars 1-4
- Establishes thematic material
- Reinforces harmonic progression
- Listener becomes familiar with the motif


DEVELOPMENT SECTION - BARS 9-16 (Rising Tension)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Dynamics: mp to f (velocity 62→95)
Texture: Thickening, adding layers, increasing rhythmic activity

Bar 9 (Dm, vel 62):
- Texture expands to 12 simultaneous voices
- Bass: D2-A2 foundation
- Mid arpeggios: D3-F3-A3-D4 PLUS F4-A4 layer added
- High cascade: D5 (72), F5 (74), A5 (76), D6 (78) - staggered entrances
- Creates waterfall effect in upper register

Bar 10 (Bb, vel 65):
- Similar 12-voice texture
- Bb1-F2 bass
- Extended arpeggios through D4-F4
- No high melody - focuses on harmonic density

Bar 11 (Gm substitute, vel 68):
- HARMONIC SHIFT: Uses Gm instead of C major
- Creates modal mixture, darker color
- High melody introduced: G5 leads with velocities climbing 88→94
- Three-note melody: G5, Bb5, D6 with rhythmic displacement
- Most animated high voice yet

Bar 12 (Am, vel 72-75):
- Continuing intensity, velocity shift mid-bar
- Extended range: A2 through E6
- High melody: A5 (96), C#6, E6 with peaks at 98-102
- Melodic phrases becoming more urgent

Bars 13-16: Second iteration with increased intensity
- Bar 13 (Dm, 78): Reaches into D7 register, velocities up to 111
- Bar 14 (Bb, 82): Full 10-voice texture
- Bar 15 (C, 85): Dense harmonic block
- Bar 16 (Am, 88-95): Accelerating high melody with syncopation
  High notes: A5 with velocity changes 90-92-95 showing rhythmic urgency


CLIMAX BUILD - BARS 17-20 (The Ascent)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Dynamics: f to fff (velocity 98→118)
Texture: Maximum density approaching

Bar 17 (Dm, vel 98):
- 11 simultaneous voices spanning D2-A5
- Full saturation of all registers
- Continuous arpeggio motion
- Preparing for ultimate climax

Bar 18 (Gm, vel 102):
- Harmonic substitution returns
- G2-D3 bass foundation
- All voices at 102 velocity - unified power

Bar 19 (Am, vel 105-112):
- Intensity surge, velocities climbing within single bar
- High melody: A5 through C#6 with peaks 108-110-112
- Energy coiling for release

Bar 20 (Dm, vel 115-118): ★ BREAKING POINT ★
- TEXTURAL SHIFT: Sustained notes STOP in beat 3
- Staccato hits emerge: Non-sustained attacks
- Rhythmic fragmentation: F3, A3, F4 become detached eighth notes
- Creates dramatic rupture in texture
- High notes F6-F6 appear as short accents
- Builds into bar 21's explosion


ABSOLUTE PEAK - BARS 21-24 (The Summit)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Dynamics: fff (velocity 120-127 MAX)
Texture: Full orchestral piano density

Bar 21 (Dm, vel 120-127):
- 14 simultaneous voices
- Range: D2 through D7 (five full octaves)
- High register cascade: F6 (125), A6 (125), D7 (127) - MAXIMUM VELOCITY
- Overwhelming power, all registers activated

Bar 22 (Bb, vel 120):
- Sustained maximum intensity
- 12 voices, all at velocity 120
- No dynamic variation - pure sustained power

Bar 23 (C, vel 120):
- Maintains fff dynamic
- 12-voice C major harmony
- Continuous energy, no release

Bar 24 (Am, vel 127): ★★★ ULTIMATE CLIMAX ★★★
- 15 SIMULTANEOUS VOICES - maximum polyphony
- SEVEN OCTAVE SPAN: A2 through A7
- Every voice at maximum velocity 127
- A major chord (Picardy third resolution)
- Represents the absolute peak of emotional/dynamic journey
- Most notes, highest range, loudest dynamic all converge


RESET/TRANSFORMATION - BARS 25-26 (The Void)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Bar 25 (Dm, vel 127 fading):
- Deconstruction begins
- High notes F6-A6 become short, non-sustained
- Texture thins slightly
- Final subdivision shows silence (.) - first true rest since climax
- Represents exhaustion after peak

Bar 26 (D power chord, vel 127): ★ VOID/RESET ★
- ONLY 5 NOTES: D2-D3-D4-D5-D6
- Perfect octave unisons across five octaves
- Maximum velocity but MINIMAL notes
- Pure, hollow, ringing resonance
- Symbolic reset - clearing the canvas
- Moment of stillness before descent
- Last subdivision shows silence - true pause


MIRROR DESCENT - BARS 27-42 (The Return Journey)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Texture: Progressively thinning, unwinding
Dynamics: Systematic descent matching bars 9-24 in reverse

The descent follows a precise mirror of the ascent with these velocity steps:
120 → 112 → 108 → 105 → 98 → 92 → 88 → 85 → 82 → 78 → 75 → 72 → 68 → 62 → 58 → 55

Bar 27 (Dm, 120): Mirrors bar 21, but descending energy
Bar 28 (Bb, 112): Mirrors bar 22, slightly softer
Bar 29 (C, 108): Gradual unwinding continues
Bar 30 (Am, 105): Seven-octave span maintained but softer
Bar 31 (Dm, 98): Mirrors bar 17
Bar 32 (Bb, 92): Continuing descent
Bar 33 (C, 88): Mirrors bar 16
Bar 34 (Am, 85): Texture still rich but mellowing
Bar 35 (Dm, 82): Mirrors bar 14
Bar 36 (Bb, 78): Gradual thinning
Bar 37 (C, 75): Mirrors bar 12
Bar 38 (Am, 72): Seven-octave A major returns, softer
Bar 39 (Dm, 68): Mirrors bar 11
Bar 40 (Bb, 62): Mirrors bar 10
Bar 41 (C, 58): Mirrors bar 9
Bar 42 (Dm, 55): Returns to opening texture richness


DISSOLUTION - BARS 43-45 (Fading to Silence)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Bar 43 (Dm, vel 45): EXACT MIRROR of bar 1
- Returns to opening 8-voice texture
- Arpeggios: D3-F3-A3-D4
- High notes: A5 (50), D6 (52)
- Circular return to beginning

Bar 44 (Dm, vel 40): Below opening dynamic
- Same pattern as bar 43 but softer (pp)
- A5 (45), D6 (47)
- Fading further into distance

Bar 45 (Dm, incomplete): ★ FINAL BREATH ★
- UNFINISHED - bar ends mid-phrase
- Suggests continuation beyond the piece
- Eternal echo, not a resolution
- Music doesn't "end" - it dissolves into silence

═══════════════════════════════════════════════════════════════════════
TECHNICAL SPECIFICATIONS:
═══════════════════════════════════════════════════════════════════════

Voice Leading:
- Sustained bass notes (whole notes in lowest register)
- Arpeggiated patterns in middle voices (sixteenth note figures)
- Melodic high register (enters and exits dynamically)
- All voices maintain smooth connections throughout

Velocity Architecture:
- ASCENT: 45→69→95→118→127 (bars 1-24)
- PEAK: 127 sustained (bars 24-26)
- DESCENT: 127→55→40 (bars 27-44)
- Creates perfect parabolic emotional curve

Harmonic Strategy:
- Primary: Dm - Bb - C - Am (i - VI - VII - v in D minor)
- Substitution: Gm appears at moments of heightened tension (bars 11, 18)
- Picardy third: A MAJOR at climax (bar 24) for triumphant peak
- Returns to minor for descent

Textural Evolution:
- Bars 1-8: 6-8 voices
- Bars 9-20: 10-12 voices
- Bars 21-24: 12-15 voices (MAXIMUM)
- Bar 26: 5 voices (MINIMUM at loud dynamic)
- Bars 27-42: Gradual reduction 12→8 voices
- Bars 43-45: 6-8 voices, fading

Rhythmic Devices:
- Sustained notes (~) create harmonic pillars
- Arpeggios provide constant motion
- Bar 20: Staccato breaks create dramatic tension
- Bar 25: First substantial rests after climax
- Bar 26: Silence in final subdivision - breathing space

Register Usage:
- Lowest: D2, A#1, C2 (bass foundation)
- Highest: D7, E7, A7 (climactic peaks)
- Spans up to 7 octaves at climax
- Returns to 5-6 octave span in coda


═══════════════════════════════════════════════════════════════════════
EMOTIONAL/NARRATIVE ARC:
═══════════════════════════════════════════════════════════════════════

This is a symphonic piano tone poem representing:
- AWAKENING (bars 1-8): Consciousness emerging
- STRIVING (bars 9-16): Effort and determination
- ASCENT (bars 17-20): Approaching transcendence
- BREAKTHROUGH (bar 20): Shattering of limitations
- APOTHEOSIS (bars 21-24): Ultimate realization/triumph
- VOID (bar 26): Moment outside time
- INTEGRATION (bars 27-42): Wisdom of the descent
- RETURN (bars 43-45): Changed but recognizable, fading into mystery

The piece never truly "ends" - it dissolves, suggesting the journey continues beyond our hearing.`;

const PromptModal = ({ onClose }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(PROMPT_TEXT).then(()=>{ setCopied(true); setTimeout(()=>setCopied(false),2000); });
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl" onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 flex-shrink-0">
          <div>
            <h3 className="text-white font-black text-base">📋 The 45-Bar Cinematic Prompt</h3>
            <p className="text-gray-500 text-xs mt-0.5">Full architectural specification — paste directly into the app</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-800 transition-all text-xl">✕</button>
        </div>
        <div className="overflow-y-auto flex-1 p-5">
          <pre className="text-xs font-mono text-gray-400 leading-5 whitespace-pre-wrap break-words">{PROMPT_TEXT}</pre>
        </div>
        <div className="flex gap-3 px-6 py-4 border-t border-gray-800 flex-shrink-0">
          <button onClick={copy}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${copied?"bg-green-500 text-white":"bg-amber-500 hover:bg-amber-400 text-black"}`}>
            {copied ? "✓ Copied!" : "📋 Copy Full Prompt"}
          </button>
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl text-sm font-medium bg-gray-800 hover:bg-gray-700 text-gray-300 transition-all">Close</button>
        </div>
      </div>
    </div>
  );
};

/* ── Navbar ── */
const Nav = ({ onDemo }) => {
  const [open,setOpen]       = useState(false);
  const [scrolled,setScrolled] = useState(false);
  const [active,setActive]   = useState("s-intro");
  useEffect(()=>{
    const fn=()=>{
      setScrolled(window.scrollY>20);
      for(let i=NAV_ITEMS.length-1;i>=0;i--){
        const el=document.getElementById(NAV_ITEMS[i].id);
        if(el&&el.getBoundingClientRect().top<=120){setActive(NAV_ITEMS[i].id);break;}
      }
    };
    window.addEventListener("scroll",fn,{passive:true});
    return()=>window.removeEventListener("scroll",fn);
  },[]);
  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled?"bg-gray-950/96 backdrop-blur-xl border-b border-gray-800/60 shadow-xl":"bg-gray-950/80 backdrop-blur-sm"}`}>
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
        <button onClick={()=>scrollTo("s-intro")} className="flex items-center gap-2 flex-shrink-0 mr-2">
          <span className="text-amber-400 text-xl">🎹</span>
          <span className="text-white font-black tracking-tight hidden sm:inline">MIDI<span className="text-amber-400">AI</span></span>
        </button>
        <div className="hidden xl:flex items-center gap-0.5 flex-1">
          {NAV_ITEMS.map(({label,id})=>(
            <button key={id} onClick={()=>scrollTo(id)}
              className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${active===id?"bg-amber-500 text-black":"text-gray-400 hover:text-white hover:bg-gray-800"}`}>
              {label}
            </button>
          ))}
        </div>
        <div className="flex-1 hidden xl:block"/>
        <button onClick={onDemo} className="bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold px-3 md:px-4 py-2 rounded-lg transition-all whitespace-nowrap flex-shrink-0">
          Live Demo →
        </button>
        <button onClick={()=>setOpen(p=>!p)} className="xl:hidden text-gray-400 hover:text-white p-2 flex-shrink-0">
          <div className="space-y-1">
            <div className={`w-5 h-0.5 bg-current transition-all ${open?"rotate-45 translate-y-1.5":""}`}/>
            <div className={`w-5 h-0.5 bg-current transition-all ${open?"opacity-0":""}`}/>
            <div className={`w-5 h-0.5 bg-current transition-all ${open?"-rotate-45 -translate-y-1.5":""}`}/>
          </div>
        </button>
      </div>
      <div className={`xl:hidden overflow-hidden transition-all duration-300 ${open?"max-h-80":"max-h-0"}`}>
        <div className="bg-gray-950 border-t border-gray-800 px-4 py-3 grid grid-cols-2 gap-2">
          {NAV_ITEMS.map(({label,id})=>(
            <button key={id} onClick={()=>{scrollTo(id);setOpen(false);}}
              className={`text-left px-3 py-2 rounded-lg text-xs font-medium transition-all ${active===id?"bg-amber-500 text-black":"text-gray-300 hover:bg-gray-800"}`}>
              {label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

/* ══════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════ */
export default function App() {
  const [showDemo,setShowDemo]     = useState(false);
  const [showPrompt,setShowPrompt] = useState(false);

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@700;800;900&family=Inter:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box}
        body{margin:0;font-family:'Inter',sans-serif;overflow-x:hidden}
        h1,h2,h3,h4{font-family:'Syne',sans-serif}
        .mono{font-family:'Space Mono',monospace}
        @keyframes waveform{from{transform:scaleY(0.35)}to{transform:scaleY(1)}}
        @keyframes float-up{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes pring{0%{box-shadow:0 0 0 0 rgba(245,158,11,.45)}70%{box-shadow:0 0 0 14px rgba(245,158,11,0)}100%{box-shadow:0 0 0 0 rgba(245,158,11,0)}}
        @keyframes fadein{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        .float-up{animation:float-up 3.5s ease-in-out infinite}
        .pring{animation:pring 2s infinite}
        .fadein{animation:fadein 0.6s ease both}
        .gtext{background:linear-gradient(135deg,#f59e0b,#ef4444,#8b5cf6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .mesh{background:radial-gradient(ellipse at 15% 50%,rgba(245,158,11,.07) 0%,transparent 55%),radial-gradient(ellipse at 85% 20%,rgba(139,92,246,.06) 0%,transparent 55%),radial-gradient(ellipse at 50% 90%,rgba(16,185,129,.04) 0%,transparent 55%)}
        .dotgrid{background-image:radial-gradient(rgba(255,255,255,.04) 1px,transparent 1px);background-size:28px 28px}
        section{scroll-margin-top:64px}
        .p-body{font-size:0.8125rem;line-height:1.7;color:#9ca3af;margin-bottom:0.85rem}
        .p-body:last-child{margin-bottom:0}
      `}</style>

      <Nav onDemo={()=>setShowDemo(true)}/>
      {showDemo   && <DemoModal   onClose={()=>setShowDemo(false)}/>}
      {showPrompt && <PromptModal onClose={()=>setShowPrompt(false)}/>}

      {/* ══ HERO ══ */}
      <section id="s-intro" className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-24 pb-16 mesh dotgrid overflow-hidden">
        <div className="absolute left-4 top-1/3 hidden md:block"><Waveform color="bg-amber-400" n={14}/></div>
        <div className="absolute right-4 top-1/4 hidden md:block"><Waveform color="bg-purple-400" n={14}/></div>

        <div className="max-w-3xl mx-auto text-center w-full fadein">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono tracking-widest uppercase mb-6">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse flex-shrink-0"/>
            Full-Stack AI Music Composition Platform
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-5 leading-tight tracking-tight">
            <span className="gtext block">MIDI AI Studio</span>
            <span className="text-white block mt-1 text-xl sm:text-2xl md:text-3xl font-bold">Generate professional MIDI with plain English</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base mb-5 max-w-xl mx-auto leading-relaxed">
            A full-stack platform bridging natural language and music production. Describe your composition — receive a production-ready <span className="text-amber-400 font-semibold">.mid file</span> powered by Google Gemini, a custom symbolic intermediate format I designed, and a strict validation engine.
          </p>

          <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-5 mb-8 text-left max-w-xl mx-auto">
            <div className="text-amber-400 text-xs font-mono font-bold uppercase tracking-widest mb-3">💡 The Core Problem I Solved</div>
            <ul className="space-y-2 text-xs md:text-sm text-gray-400">
              <li className="flex gap-2"><span className="text-red-400 flex-shrink-0 mt-0.5">✗</span><span>LLMs cannot reason over binary MIDI streams without an intermediate symbolic representation</span></li>
              <li className="flex gap-2"><span className="text-red-400 flex-shrink-0 mt-0.5">✗</span><span>Existing symbolic formats (LilyPond, MusicXML, ABC) were not designed for LLM generation — they hallucinate structure and timing constantly</span></li>
              <li className="flex gap-2"><span className="text-red-400 flex-shrink-0 mt-0.5">✗</span><span>Musicians with strong theoretical knowledge but no instrumental proficiency have no programmatic path to realize their ideas</span></li>
              <li className="flex gap-2"><span className="text-emerald-400 flex-shrink-0 mt-0.5">✓</span><span>I designed a token-efficient, structurally constrained symbolic format that LLMs can reliably generate — and built the full parser, validator, and converter from scratch</span></li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
            <button onClick={()=>setShowDemo(true)} className="pring bg-amber-500 hover:bg-amber-400 text-black font-black px-7 py-3 rounded-xl text-sm transition-all">🚀 Launch MIDI AI Studio</button>
            <button onClick={()=>scrollTo("s-sheet")} className="bg-gray-800 hover:bg-gray-700 text-white font-bold px-7 py-3 rounded-xl text-sm transition-all border border-gray-700">📖 Understand the Research →</button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
            {[["🎵","Text → MIDI","Describe, receive a .mid"],["✏️","Edit MIDI","Upload + AI-modify any .mid"],["📚","Style Learn","Upload refs, match your style"],["🔄","Convert","MIDI ↔ symbolic text"]].map(it=>(
              <div key={it[1]} className="bg-gray-900/80 rounded-xl p-3 border border-gray-800 text-center">
                <div className="text-xl mb-1">{it[0]}</div>
                <div className="text-white font-bold text-xs">{it[1]}</div>
                <div className="text-gray-500 text-xs mt-0.5">{it[2]}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-700">
          <span className="text-xs font-mono tracking-widest hidden sm:block">SCROLL TO LEARN</span>
          <div className="w-px h-10 bg-gradient-to-b from-gray-700 to-transparent"/>
        </div>
      </section>

      {/* ══ SHEET MUSIC ══ */}
      <section id="s-sheet" className="py-20 md:py-28 px-4 border-t border-gray-900">
        <div className="max-w-6xl mx-auto">
          <SectionHdr eyebrow="Chapter 1 — Music Notation" title="Sheet Music: The Human Encoding of Sound"
            sub="To understand why AI music generation is hard, you first need to understand how music has been encoded for humans — and why those encodings break for machines."/>

          <div className="grid md:grid-cols-2 gap-8 items-start mb-10">
            <div>
              <h3 className="text-base md:text-lg font-bold text-white mb-3">What Sheet Music Actually Is</h3>
              <p className="p-body">Sheet music is a symbolic encoding system developed over centuries to represent music for trained human performers. A score encodes four orthogonal dimensions simultaneously: <span className="text-amber-400">pitch</span> (vertical position on the staff), <span className="text-amber-400">duration</span> (note head shape + beams), <span className="text-amber-400">timing</span> (horizontal position + rests), and <span className="text-amber-400">dynamics</span> (text markings and hairpins).</p>
              <p className="p-body">Reading a full orchestral score requires simultaneously tracking multiple staves, transposing for transposing instruments, interpreting harmonic context, and reading conductor markings in real time. This takes years of formal training. The notation is deeply <span className="text-yellow-400">context-dependent</span> — a dotted note's duration depends on tempo, a fermata's length on the conductor. None of this is machine-readable without a human in the loop.</p>
              <p className="p-body">For AI specifically: text-based sheet music formats like LilyPond require the model to understand beam groups, stem directions, enharmonic spelling, and layout rules — things that existing LLMs hallucinate constantly. I measured a ~70% initial failure rate in early tests with LilyPond-style output.</p>
            </div>
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">🎼</div>
                <div className="text-white font-bold text-sm mb-1">Standard Music Notation</div>
                <div className="text-gray-500 text-xs">Five-line staff — centuries of evolved visual encoding</div>
              </div>
              <div className="bg-amber-50/90 rounded-xl p-5 mb-4">
                <div className="space-y-3">
                  {[0,1,2,3,4].map(i=>(
                    <div key={i} className="h-px bg-gray-600 relative">
                      {i===2&&<div className="absolute left-14 -top-3.5 w-6 h-6 rounded-full bg-gray-800"/>}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-3 font-mono"><span>𝄞 Treble</span><span>♩ = 120</span><span>4/4</span></div>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[["𝅝","Whole","4 beats"],["♩","Quarter","1 beat"],["♪","Eighth","½ beat"]].map(([sym,name,b])=>(
                  <div key={name} className="bg-gray-800 rounded-lg p-3 text-center">
                    <div className="text-amber-400 text-xl mb-1">{sym}</div>
                    <div className="text-white text-xs font-semibold">{name}</div>
                    <div className="text-gray-500 text-xs">{b}</div>
                  </div>
                ))}
              </div>
              <div className="bg-gray-800 rounded-xl p-3 text-xs text-gray-400 space-y-1">
                <div className="text-white font-semibold text-xs mb-2">What a single note encodes:</div>
                <div className="flex gap-2"><span className="text-amber-400">●</span>Pitch: staff position + accidental</div>
                <div className="flex gap-2"><span className="text-blue-400">●</span>Duration: head shape + stem + beam + dot</div>
                <div className="flex gap-2"><span className="text-purple-400">●</span>Dynamics: surrounding text markings</div>
                <div className="flex gap-2"><span className="text-pink-400">●</span>Articulation: symbols above/below the head</div>
              </div>
            </div>
          </div>

          {/* Why all existing formats fail */}
          <div className="bg-gray-900 rounded-2xl border border-red-500/20 p-6 mb-8">
            <h3 className="text-sm md:text-base font-bold text-red-400 mb-4">⚠️ Why All Existing Text-Based Notation Formats Fail for LLM Generation</h3>
            <div className="grid sm:grid-cols-3 gap-4 mb-4">
              {[
                {name:"LilyPond",why:"Designed for human typesetters. Requires correct beam groups, stem directions, enharmonic spelling, and layout context. LLMs hallucinate beam structure constantly. Error rate in initial tests: ~70%. Even correct-looking LilyPond often won't compile."},
                {name:"MusicXML",why:"Verbose XML schema. A 4-bar piece produces 300–500 lines of markup. Extreme token overhead. The LLM loses musical context inside XML boilerplate. Output is also hard to validate without a full MusicXML parser."},
                {name:"ABC Notation",why:"Works for simple, single-voice, diatonic melodies. No velocity encoding. No polyphony support. Rhythm specified as fractions (L:1/8) that LLMs miscount under complex patterns. Completely unusable for professional multi-voice music."},
              ].map(f=>(
                <div key={f.name} className="bg-gray-800 rounded-xl p-4">
                  <div className="text-white font-bold text-xs mb-2">{f.name}</div>
                  <p className="text-gray-400 text-xs leading-relaxed">{f.why}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-800 pt-4 text-xs text-amber-400 font-semibold">→ None of these were designed with LLM generation as a constraint. I needed to build something new, from scratch.</div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <Card icon="🎵" title="Pitch Encoding" desc="Notes are A–G with octave numbers and sharps/flats. Pitch is discrete and directly maps to MIDI note numbers 0–127. My format preserves this exact mapping with no ambiguity." accent="amber"/>
            <Card icon="⏱️" title="Rhythmic Encoding" desc="Sheet music uses note shapes to encode duration. I replace this with a fixed integer subdivision grid — 16 slots for 4/4. Every slot is counted, every slot is accounted for. No fractions, no context dependency." accent="purple"/>
            <Card icon="🎭" title="Dynamic Encoding" desc="Dynamics (pp to fff) and articulation encode the emotional layer. I map these to velocity ranges (pp=21–35, mf=66–80, fff=111–127) that the LLM can reason about symbolically by name." accent="emerald"/>
          </div>
        </div>
      </section>

      {/* ══ MIDI DEEP ══ */}
      <section id="s-midi" className="py-20 md:py-28 px-4 bg-gray-900/30 border-t border-gray-900">
        <div className="max-w-6xl mx-auto">
          <SectionHdr eyebrow="Chapter 2 — MIDI Protocol Deep Dive" title="MIDI: The Machine Language of Music"
            sub="MIDI is not audio. It is a structured binary event protocol — and one that LLMs cannot natively parse or generate without an intermediate symbolic representation."/>

          <div className="grid md:grid-cols-2 gap-8 items-start mb-10">
            <div>
              <h3 className="text-base md:text-lg font-bold text-white mb-3">What MIDI Actually Encodes at the Byte Level</h3>
              <p className="p-body">A MIDI file is a binary stream of <span className="text-amber-400">time-stamped events</span>. Each event has a delta-time (ticks since the last event), a status byte (event type + channel), and data bytes. A Note On for C4 at velocity 80: <span className="font-mono text-blue-300 text-xs">90 3C 50</span> — three bytes encoding channel, pitch (MIDI number 60), and velocity. A matching Note Off: <span className="font-mono text-blue-300 text-xs">80 3C 00</span>.</p>
              <p className="p-body">Timing is stored in <span className="text-amber-400">ticks</span>. The number of ticks per quarter note (TPQ / PPQN) is defined in the binary header. My implementation uses 480 TPQ. A quarter note = 480 ticks. An eighth note = 240 ticks. These numbers are meaningless without the TPQ from the header — which is context buried in binary that an LLM cannot retrieve.</p>
              <p className="p-body">MIDI supports 16 channels with independent instrument assignments. A typical orchestral MIDI file has multiple tracks with events interleaved by absolute tick position. Parsing requires a stateful loop tracking note-on/off pairs and per-channel state. This is the parser I built from scratch in Node.js, including VLQ-encoded delta time reconstruction.</p>
            </div>
            <div>
              <MidiGrid/>
              <p className="text-center text-gray-500 text-xs mt-2 font-mono">↑ Piano Roll — the visual representation of MIDI data in a DAW. Playhead scans in real time.</p>
            </div>
          </div>

          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 mb-8">
            <h3 className="text-base font-bold text-white mb-5">The Anatomy of a MIDI File</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
              {[
                {icon:"📋",label:"Header Chunk (MThd)",desc:"14 bytes. Stores format type (0/1/2), track count, and TPQ. Without TPQ, all event timestamps are uninterpretable numbers."},
                {icon:"🎵",label:"Track Chunks (MTrk)",desc:"One per instrument or voice. Contains the delta-time event stream. Events are sorted by absolute tick, not by note — making polyphony extraction non-trivial."},
                {icon:"⏱️",label:"Variable-Length Delta Time",desc:"Each event's timestamp is relative to the previous. Values over 127 use multi-byte VLQ encoding (7 bits per byte, MSB signals continuation). Getting this wrong produces silent timing corruption."},
                {icon:"🎹",label:"Event Types",desc:"Note On/Off, Program Change, Control Change (pedal, modulation, sustain), Pitch Bend, Aftertouch, Meta Events (tempo, time sig, track name). All binary."},
              ].map(it=>(
                <div key={it.label} className="bg-gray-800 rounded-xl p-4">
                  <div className="text-2xl mb-2">{it.icon}</div>
                  <div className="text-white font-semibold text-xs mb-2">{it.label}</div>
                  <p className="text-gray-400 text-xs leading-relaxed">{it.desc}</p>
                </div>
              ))}
            </div>
            <div className="bg-gray-950 rounded-xl p-4 font-mono text-xs overflow-x-auto">
              <div className="text-gray-500 mb-2">// MIDI event stream — 2 notes, raw bytes:</div>
              <div className="text-blue-300">00 90 3C 50  <span className="text-gray-600">← delta=0,   NoteOn  C4  vel=80</span></div>
              <div className="text-blue-300">78 80 3C 00  <span className="text-gray-600">← delta=120, NoteOff C4</span></div>
              <div className="text-blue-300">00 90 3E 55  <span className="text-gray-600">← delta=0,   NoteOn  D4  vel=85</span></div>
              <div className="text-blue-300">60 80 3E 00  <span className="text-gray-600">← delta=96,  NoteOff D4</span></div>
              <div className="text-gray-600 mt-1">… for every note in every voice, all interleaved by tick position …</div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 mb-8">
            <h3 className="text-base font-bold text-white mb-4">How DAWs Use MIDI</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[["🎹","Piano Roll","The visual editor — colored blocks on a time+pitch grid. Width = duration, position height = pitch, color intensity = velocity. This is what I replicate in my symbolic format."],["🎚️","Velocity Lane","Below the piano roll. Bar chart of note-on velocity (1–127) per note. What I expose as X80, X50, etc. in my format."],["🔗","MIDI Clips","Containers of MIDI events placed on timeline tracks. One clip can drive any VST instrument with zero re-recording."],["🎛️","MIDI Out","Routes the event stream to VST plugins, hardware synthesizers, or external sound modules via USB-MIDI or DIN."]].map(([ic,lbl,d])=>(
                <div key={lbl} className="bg-gray-800 rounded-xl p-3 text-center">
                  <div className="text-xl mb-2">{ic}</div>
                  <div className="text-white font-semibold text-xs mb-1">{lbl}</div>
                  <div className="text-gray-500 text-xs">{d}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-gray-700 bg-gray-900 p-5">
              <div className="text-blue-400 font-bold mb-3 text-sm">🎵 Audio (WAV / MP3 / FLAC)</div>
              <ul className="space-y-1.5 text-xs text-gray-400">
                {[["✗","red","Records actual PCM waveforms — the final rendered sound"],["✗","red","Instrument and arrangement permanently baked in"],["✗","red","Files 10–100× larger than equivalent MIDI"],["✗","red","Pitch/tempo editing introduces time-stretch artifacts"],["✗","red","No programmatic access to note-level musical structure"],["✓","green","Sounds identically regardless of playback system"]].map(([sym,c,t],i)=>(
                  <li key={i} className="flex gap-2"><span className={`text-${c}-400 flex-shrink-0`}>{sym}</span>{t}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5">
              <div className="text-amber-400 font-bold mb-3 text-sm">🎹 MIDI</div>
              <ul className="space-y-1.5 text-xs text-gray-400">
                {["Records performance instructions — what to play, when, how hard","Instrument assignment changeable at any time after the fact","Typical 4-bar piece: 2–4 KB. Full orchestral score: ~200 KB","Non-destructive pitch, tempo, quantization editing","Full programmatic access — read, modify, generate, analyze","Universal exchange format for all professional DAWs"].map((t,i)=>(
                  <li key={i} className="flex gap-2"><span className="text-green-400 flex-shrink-0">✓</span>{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ══ THE PROBLEM ══ */}
      <section id="s-problem" className="py-20 md:py-28 px-4 border-t border-gray-900">
        <div className="max-w-6xl mx-auto">
          <SectionHdr eyebrow="Chapter 3 — The Core Technical Problem" title="LLMs Cannot Reason Over Binary MIDI Streams"
            sub="This is not a simple API integration problem. The architecture of binary MIDI and the architecture of LLMs are fundamentally incompatible — without a carefully designed symbolic bridge."/>

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div>
              <h3 className="text-sm font-bold text-red-400 mb-3">❌ What an LLM sees when given a MIDI file</h3>
              <HexDump/>
              <p className="text-gray-500 text-xs mt-2">A .mid file is opaque binary. Even base64-encoded and passed as a string, the LLM has no way to interpret note positions, timing relationships, or harmonic structure. It cannot "add harmony" to a hex stream.</p>
            </div>
            <div>
              <h3 className="text-sm font-bold text-emerald-400 mb-3">✓ What an LLM sees with my symbolic format</h3>
              <MidiText/>
              <p className="text-gray-500 text-xs mt-2">Every pitch, timing slot, velocity, and sustain is explicit. The LLM can parse the harmonic structure, extend it, add voices, modify dynamics — then my converter reconstructs valid binary MIDI from the symbolic output.</p>
            </div>
          </div>

          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 mb-8">
            <h3 className="text-base font-bold text-white mb-5 text-center">Why the Problem Is Harder Than It Looks</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                {n:"01",t:"Binary Opacity",d:"LLMs process token sequences. Binary MIDI bytes have no token boundary corresponding to a musical concept — a note, a bar, a beat. The structure is entirely invisible.",c:"text-red-400"},
                {n:"02",t:"Temporal Ambiguity",d:"MIDI timestamps are delta-ticks. Without TPQ and tempo map, the model cannot determine if 480 ticks is a quarter note or half note. Context is buried in the binary header.",c:"text-orange-400"},
                {n:"03",t:"Polyphonic Interleaving",d:"Simultaneous notes produce interleaved event streams. Reconstructing voice assignments from raw events requires a stateful parser — and the LLM must maintain this context across hundreds of events.",c:"text-yellow-400"},
                {n:"04",t:"No Validation Layer",d:"There is no natural validation step when an LLM generates text. Without a purpose-built format and rule-based validator, wrong tick counts and overlapping notes pass silently to the output.",c:"text-purple-400"},
                {n:"05",t:"Voice Identity Loss",d:"Without a per-voice symbolic layer, the LLM generates a note soup. Individual voices — bass, melody, harmony — lose their identity across bars, destroying musical coherence.",c:"text-pink-400"},
              ].map(p=>(
                <div key={p.n} className="text-center bg-gray-800/50 rounded-xl p-4">
                  <div className={`text-2xl font-black font-mono mb-2 ${p.c}`}>{p.n}</div>
                  <div className="text-white font-bold text-xs mb-2">{p.t}</div>
                  <div className="text-gray-500 text-xs leading-relaxed">{p.d}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6">
            <h3 className="text-sm font-bold text-blue-400 mb-3">🔬 The Research Framing</h3>
            <div className="grid md:grid-cols-2 gap-4 text-xs text-gray-400 leading-relaxed">
              <p>LLMs are fundamentally <span className="text-white font-semibold">sequence models over discrete tokens</span>. For reliable generation on a structured domain, the domain's representation must satisfy three properties: it must be expressible as a UTF-8 token sequence, it must have learnable and verifiable structural constraints, and it must be validatable at inference time without domain expertise in the validator.</p>
              <p>Binary MIDI satisfies none of these. My custom format was designed to satisfy all three: it is a plain text sequence, it has explicit and countable subdivision constraints, and it can be fully validated with a simple rule-based checker that runs before conversion — <span className="text-white font-semibold">no music theory knowledge required in the validator itself</span>.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ SOLUTION ══ */}
      <section id="s-solution" className="py-20 md:py-28 px-4 bg-gray-900/30 border-t border-gray-900">
        <div className="max-w-6xl mx-auto">
          <SectionHdr eyebrow="Chapter 4 — The Custom Symbolic Format" title="Designing a Format for LLM Generation"
            sub="Every design decision was made with one constraint: can a large language model reliably generate this, and can I deterministically validate it?"/>

          <div className="bg-gray-950 rounded-2xl border border-amber-500/20 p-6 mb-8">
            <h3 className="text-sm font-bold text-amber-400 font-mono mb-5">// The three constraints I designed around</h3>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                {c:"text-emerald-400",t:"1. One line per voice",d:"Each note name per bar gets exactly one line. Polyphony is structurally explicit — it is architecturally impossible for the model to conflate voices. Each line is independently parseable and independently validatable."},
                {c:"text-blue-400",t:"2. Integer subdivision grid",d:"Time is divided into a fixed number of integer slots (16 for 4/4, 12 for 3/4). Every slot must be accounted for. No fractions, no floating point, no context-dependent duration encoding. The model works on a grid it can reliably count and verify."},
                {c:"text-purple-400",t:"3. Compressible tokens",d:"N consecutive identical symbols compress to symbol(N). Critical: a 45-bar piece with many sustained notes would exceed model context limits if fully expanded. Compression keeps complex pieces within token budgets while remaining deterministically parseable."},
              ].map(p=>(
                <div key={p.t}>
                  <div className={`font-bold mb-2 text-xs ${p.c}`}>{p.t}</div>
                  <p className="text-gray-400 text-xs leading-relaxed">{p.d}</p>
                </div>
              ))}
            </div>
          </div>

          <h3 className="text-base font-bold text-white mb-4">Symbol Reference</h3>
          <div className="grid sm:grid-cols-2 gap-3 mb-8">
            <RuleCard symbol="." name="Rest" desc="Silence. This subdivision slot is empty." example="C4: . . . . → 4 silent slots"/>
            <RuleCard symbol="~" name="Sustain" desc="Extend the duration of the previous note." example="C4: X ~(7) → note occupies 8 consecutive slots"/>
            <RuleCard symbol="X" name="Note On" desc="Attack at default velocity 100." example="C4: .(4) X .(11) → attack on slot 5 of 16"/>
            <RuleCard symbol="X80" name="Velocity Note" desc="Attack with explicit velocity (1–127)." example="C4: X80 ~(3) .(12) → forte attack, held 4 slots"/>
            <RuleCard symbol="XR25" name="Right Offset" desc="Attack starts 25% into the slot — swing and late feel." example="C4: X80XR25 → behind-the-beat micro-timing"/>
            <RuleCard symbol="XE30" name="Short Note" desc="Attack lasts only 30% of the slot — staccato." example="C4: XE20 XE20 XE20 → three detached staccato attacks"/>
            <RuleCard symbol="~(N)" name="Compressed Sustain" desc="Shorthand for N consecutive sustain tokens." example="A2: X40 ~(15) → 16-slot held note in 4/4"/>
            <RuleCard symbol="XO40XE30" name="Positioned Note" desc="Rest 40% of slot, then attack for 30%." example="Off-grid syncopation and micro-timing placement"/>
          </div>

          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 mb-8">
            <h3 className="text-base font-bold text-white mb-4">Subdivision Grid by Time Signature</h3>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-3">
              {[["4/4",16,"4 groups of 4"],["3/4",12,"3 groups of 4"],["2/4",8,"Single spacing"],["6/8",12,"Compound duple"],["12/8",12,"Compound quad"]].map(([sig,subs,d])=>(
                <div key={sig} className="bg-gray-800 rounded-xl p-3 text-center">
                  <div className="text-amber-400 font-black text-xl font-mono mb-1">{sig}</div>
                  <div className="text-white font-black text-lg">{subs}</div>
                  <div className="text-gray-400 text-xs">slots</div>
                  <div className="text-gray-600 text-xs mt-1">{d}</div>
                </div>
              ))}
            </div>
            <p className="text-gray-500 text-xs">Every note line, in every bar, must expand to exactly this many tokens after decompression. The validator counts each symbol individually and rejects the entire output if any line deviates by even one slot.</p>
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
            <h3 className="text-sm md:text-base font-bold text-emerald-400 mb-4">🛡️ The Validation Pipeline — Why It Was Non-Optional</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-400 text-xs mb-3 leading-relaxed">Early versions without validation produced corrupted MIDI files silently. A single wrong subdivision count in one bar would shift all subsequent note timings, creating a cascading error across the entire piece. The validator was added after the first week of testing revealed this was the most common failure mode.</p>
                <ul className="space-y-1.5 text-xs text-gray-400">
                  {["Expand all compression notation first, then count each symbol","Exact subdivision count per line — one off means rejection","Valid note names (C–B, any accidental, octave -1 to 9)","Velocity 1–127 (strict)","Percentage offsets 0–100, non-overlapping within a slot","Every ~ must follow an active note — no orphaned sustains","Space required between X and ~ (X~ is a tokenization error)"].map(r=>(
                    <li key={r} className="flex gap-2"><span className="text-emerald-400 flex-shrink-0">✓</span>{r}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-gray-950 rounded-xl p-4 font-mono text-xs">
                <div className="text-gray-500 mb-3">// Errors caught in production:</div>
                <div className="text-red-400">❌ X ~(16)   → 17 slots, need 16 in 4/4</div>
                <div className="text-green-400 mb-3">✓  X ~(15)   → exactly 16 ✓</div>
                <div className="text-red-400">❌ X60X80    → two full attacks in one slot</div>
                <div className="text-green-400 mb-3">✓  XE30XE50  → sequential, sum=80% ✓</div>
                <div className="text-red-400">❌ ~(4) X    → sustain before any note</div>
                <div className="text-green-400">✓  X ~(3)    → attack first, then sustain</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ REAL STRUGGLES ══ */}
      <section id="s-struggles" className="py-20 md:py-28 px-4 border-t border-gray-900">
        <div className="max-w-6xl mx-auto">
          <SectionHdr eyebrow="Chapter 5 — Real Engineering Challenges" title="Where Things Actually Went Wrong"
            sub="The path from idea to working system wasn't smooth. These are the real failure modes I hit and how I debugged them."/>

          <div className="grid sm:grid-cols-2 gap-5 mb-8">
            <div className="bg-gray-900 rounded-2xl border border-orange-500/20 p-5">
              <div className="flex items-start gap-3 mb-3">
                <div className="text-2xl flex-shrink-0">🤖</div>
                <div>
                  <div className="text-orange-400 font-bold text-sm">Gemini's Subdivision Hallucination</div>
                  <div className="text-gray-500 text-xs">Most persistent failure — took 3 weeks to solve</div>
                </div>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed mb-3">Gemini consistently generated bars with 17 or 18 subdivisions instead of 16 in 4/4. It would output <span className="font-mono text-red-400">X ~(16)</span> — which looks right at a glance but expands to 17 tokens. The resulting MIDI had notes bleeding into the next bar, creating cascading timing errors for the entire piece. Initial rejection rate: ~65%.</p>
              <div className="bg-gray-950 rounded-lg p-3 font-mono text-xs mb-3">
                <div className="text-gray-500 mb-1">// What kept happening:</div>
                <div className="text-red-400">A2: X50 ~(15)  ← 16 tokens ✓</div>
                <div className="text-red-400">D4: X60 ~(16)  ← 17 tokens ✗</div>
              </div>
              <p className="text-gray-400 text-xs"><span className="text-white font-semibold">Fix:</span> Added explicit counting examples to the system prompt with the formula "tokens = 1 (attack) + N (sustain count)". Added validator error messages that named the exact line and slot count. Rejection rate dropped to ~8%.</p>
            </div>

            <div className="bg-gray-900 rounded-2xl border border-yellow-500/20 p-5">
              <div className="flex items-start gap-3 mb-3">
                <div className="text-2xl flex-shrink-0">⚙️</div>
                <div>
                  <div className="text-yellow-400 font-bold text-sm">The MIDI Parser from Scratch</div>
                  <div className="text-gray-500 text-xs">No library handled the custom format</div>
                </div>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed mb-3">No existing Node.js MIDI library could map my symbolic format to binary MIDI. I built the full converter: parse the token stream, reconstruct note-on/off event pairs with correct absolute tick positions, build track chunk byte arrays with properly VLQ-encoded delta times, and assemble the file header at 480 TPQ.</p>
              <p className="text-gray-400 text-xs leading-relaxed mb-3">The hardest part: <span className="text-white font-semibold">variable-length quantity (VLQ) encoding</span> for delta times. Values over 127 require multi-byte encoding where each byte contributes 7 bits and the MSB signals continuation. Getting this wrong produced files that opened in DAWs but played at completely wrong timings.</p>
              <p className="text-gray-400 text-xs"><span className="text-white font-semibold">Fix:</span> Wrote a dedicated VLQ encoder with unit tests against known MIDI byte sequences, then cross-validated output by importing into Ableton and checking a hex dump side-by-side.</p>
            </div>

            <div className="bg-gray-900 rounded-2xl border border-purple-500/20 p-5">
              <div className="flex items-start gap-3 mb-3">
                <div className="text-2xl flex-shrink-0">🔄</div>
                <div>
                  <div className="text-purple-400 font-bold text-sm">Quota Race Condition</div>
                  <div className="text-gray-500 text-xs">Concurrency bug in the Java layer</div>
                </div>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed mb-3">Two simultaneous requests would both read the same <span className="font-mono text-blue-300">dailyCount</span> before either had written back — then both decremented it. Users hit their daily limit in half the expected requests.</p>
              <div className="bg-gray-950 rounded-lg p-3 font-mono text-xs mb-3">
                <div className="text-gray-500 mb-1">// The race:</div>
                <div className="text-gray-400">Thread A: read count=5 → write 4</div>
                <div className="text-gray-400">Thread B: read count=5 → write 4  ← lost update</div>
                <div className="text-red-400">2 gens consumed, quota dropped by 2 not 1</div>
              </div>
              <p className="text-gray-400 text-xs"><span className="text-white font-semibold">Fix:</span> Replaced read-modify-write with <span className="font-mono text-blue-300">SELECT FOR UPDATE</span> inside a Spring transaction, plus deadlock retry logic. Quota deduction is now atomic.</p>
            </div>

            <div className="bg-gray-900 rounded-2xl border border-blue-500/20 p-5">
              <div className="flex items-start gap-3 mb-3">
                <div className="text-2xl flex-shrink-0">🎵</div>
                <div>
                  <div className="text-blue-400 font-bold text-sm">Cross-Bar Sustain Continuation</div>
                  <div className="text-gray-500 text-xs">Subtle musical correctness bug</div>
                </div>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed mb-3">When a note sustained across a bar line, Gemini would start the next bar with a new <span className="font-mono text-red-400">X</span> attack instead of a <span className="font-mono text-green-400">~</span> continuation. This created an audible re-attack at every bar line — a tiny gap in the MIDI, breaking phrase continuity throughout the piece.</p>
              <div className="bg-gray-950 rounded-lg p-3 font-mono text-xs mb-3">
                <div className="text-red-400">Bar 1 — A2: X40 ~(15)</div>
                <div className="text-red-400">Bar 2 — A2: X40 ~(15)  ← re-attack ✗</div>
                <div className="text-gray-500 mt-1 mb-1">// Correct:</div>
                <div className="text-green-400">Bar 2 — A2: ~(16)       ← continuation ✓</div>
              </div>
              <p className="text-gray-400 text-xs"><span className="text-white font-semibold">Fix:</span> Added explicit continuation rule to system prompt and validator: "If a note from bar N continues into bar N+1, that voice's first token in bar N+1 must be ~ not X."</p>
            </div>
          </div>

          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
            <h3 className="text-sm font-bold text-white mb-4">📊 What the Iteration Process Looked Like</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              {[["~65%","Initial rejection rate","First format version — too many hallucinations"],["~8%","Post-iteration rate","After prompt engineering + validator feedback loop"],["3 weeks","Main bottleneck","Subdivision count fix — single biggest improvement"],["100%","Custom-built","Parser, validator, converter — zero third-party libraries"]].map(([val,label,sub])=>(
                <div key={label} className="bg-gray-800 rounded-xl p-3">
                  <div className="text-amber-400 font-black text-lg mb-1">{val}</div>
                  <div className="text-white font-bold text-xs mb-1">{label}</div>
                  <div className="text-gray-500 text-xs">{sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ PIPELINE ══ */}
      <section id="s-pipeline" className="py-20 md:py-28 px-4 bg-gray-900/30 border-t border-gray-900">
        <div className="max-w-6xl mx-auto">
          <SectionHdr eyebrow="Chapter 6 — Architecture" title="End-to-End Pipeline"
            sub="From your text prompt to a downloadable .mid file — every component custom-built."/>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div>
              <h3 className="text-sm md:text-base font-bold text-white mb-4">🚀 Text → MIDI Generation</h3>
              <Step num={1} title="Natural language prompt" desc='e.g. "Create a 32-bar cinematic piano piece in D minor at 85 BPM with 5-part harmony and a climax at bar 24."'/>
              <Step num={2} title="Spring Boot validates & routes" desc="JWT auth check, daily quota via pessimistic write lock (SELECT FOR UPDATE + retry), input sanitization, proxy to Node.js bridge."/>
              <Step num={3} title="Enhanced Prompt Builder" desc="Wraps your prompt with the full format spec, subdivision rules, examples of common errors, and the validation contract — so Gemini knows exactly what a correct output looks like."/>
              <Step num={4} title="Gemini AI generates" desc="Returns bar-by-bar symbolic notation. Typically 2,000–8,000 tokens for a complex multi-voice piece."/>
              <Step num={5} title="MidiValidator" desc="Expands all compression, counts subdivisions for every line, checks velocities and percentages. Rejects bad output with specific error messages used in retry prompts."/>
              <Step num={6} title="TextToMidiConverter → .mid" desc="Validated text converts to binary MIDI at 480 TPQ. VLQ-encoded delta times, correct track chunk headers, tempo meta events. Output opens immediately in any DAW." last/>
            </div>
            <div>
              <h3 className="text-sm md:text-base font-bold text-white mb-4">✏️ Upload + Edit Existing MIDI</h3>
              <Step num={1} title="Upload any .mid file" desc="Your own composition, a DAW export, a downloaded loop — any valid MIDI file."/>
              <Step num={2} title="MidiToTextConverter parses it" desc="Reads binary, extracts all tracks and events, maps absolute ticks to subdivision slots using TPQ from the header, outputs my symbolic format."/>
              <Step num={3} title="AI receives full symbolic representation" desc="The LLM gets the complete current state of your MIDI as structured text — every note, timing, velocity — alongside your modification instruction."/>
              <Step num={4} title="Gemini modifies the notation" desc="Understands existing musical structure, adds voices, changes harmonies, extends bars — while staying within all format rules."/>
              <Step num={5} title="Same validation pipeline" desc="Every modified line validated before conversion. No silent corruption passes through."/>
              <Step num={6} title="Download modified .mid" desc="Drop into Ableton, FL Studio, Logic, Cubase, or any DAW. Plays immediately." last/>
            </div>
          </div>

          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
            <h3 className="text-base font-bold text-white mb-5 text-center">System Architecture</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
              {[
                {icon:"⚛️",label:"React Frontend",sub:"Vite + Tailwind CSS",c:"border-blue-500/40 bg-blue-500/10"},
                {icon:"☕",label:"Spring Boot :8080",sub:"JWT · Quotas · History · Proxy",c:"border-green-500/40 bg-green-500/10"},
                {icon:"🐘",label:"PostgreSQL",sub:"Users · Sessions · History",c:"border-indigo-500/40 bg-indigo-500/10"},
              ].map(it=>(
                <div key={it.label} className={`rounded-xl border p-4 text-center ${it.c}`}>
                  <div className="text-2xl mb-1">{it.icon}</div>
                  <div className="text-white font-bold text-xs">{it.label}</div>
                  <div className="text-gray-500 text-xs">{it.sub}</div>
                </div>
              ))}
            </div>
            <div className="text-center text-gray-600 text-xs mb-3">↕ Spring Boot proxies MIDI operations to the stateless Node.js bridge ↕</div>
            <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 max-w-sm mx-auto text-center">
              <div className="text-2xl mb-1">🟢</div>
              <div className="text-white font-bold text-sm">Node.js Stateless Bridge :5000</div>
              <div className="text-gray-500 text-xs">Custom Parser + Validator + Converter + Gemini AI</div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ SHOWCASE ══ */}
      <section id="s-showcase" className="py-20 md:py-28 px-4 border-t border-gray-900">
        <div className="max-w-6xl mx-auto">
          <SectionHdr eyebrow="Chapter 7 — Live Showcase" title="The 45-Bar Cinematic Composition"
            sub="A real prompt → real output. Demonstrating the system handling full structural, harmonic, and dynamic complexity across 45 bars."/>

          {/* Composition stats + arc */}
          <div className="bg-gray-900 rounded-2xl border border-amber-500/20 p-6 mb-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
              {[["📏","45 Bars","D minor, 4/4, 85 BPM"],["🎹","15 Voices","Peak polyphony at bar 24"],["🔊","Velocity 127","Maximum at the climax"],["🎼","7 Octaves","A2 → A7 span at bar 24"]].map(([ic,val,sub])=>(
                <div key={val} className="bg-gray-800 rounded-xl p-3 text-center">
                  <div className="text-xl mb-1">{ic}</div>
                  <div className="text-white font-black text-sm md:text-base">{val}</div>
                  <div className="text-gray-500 text-xs">{sub}</div>
                </div>
              ))}
            </div>
            {/* Velocity arc chart */}
            <div className="bg-gray-950 rounded-xl p-4 md:p-5 mb-4">
              <div className="text-gray-500 text-xs font-mono mb-3">Velocity arc across all 45 bars:</div>
              <div className="flex items-end gap-px h-14 mb-2">
                {[45,46,48,50,52,54,56,58,62,65,68,72,75,78,82,85,88,95,102,112,120,124,126,127,127,127,120,112,108,105,98,92,88,85,82,78,75,72,68,62,58,55,45,40,25].map((v,i)=>(
                  <div key={i} className="flex-1 rounded-t-sm"
                    style={{height:`${(v/127)*100}%`,backgroundColor:`hsl(${35+((127-v)/127)*190},${55+((v/127)*45)}%,${22+((v/127)*38)}%)`}}/>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-600 font-mono">
                <span>Bar 1 (pp)</span>
                <span className="text-amber-400 font-bold">Bar 24 ★ CLIMAX</span>
                <span>Bar 45 (dissolve)</span>
              </div>
            </div>
            <div className="text-xs text-gray-400 leading-relaxed">
              <span className="text-white font-semibold">Emotional arc: </span>
              <span className="text-gray-600">Awakening (1–8) → </span>
              <span className="text-gray-500">Rising Tension (9–16) → </span>
              <span className="text-gray-400">Ascent (17–20) → </span>
              <span className="text-amber-400 font-semibold">Apotheosis (21–24) → </span>
              <span className="text-gray-400">Void (25–26) → </span>
              <span className="text-gray-500">Mirror Descent (27–42) → </span>
              <span className="text-gray-600">Dissolution (43–45)</span>
            </div>
          </div>

          {/* Videos */}
          <div className="grid md:grid-cols-2 gap-5 mb-6">
            <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-800 border-b border-gray-700">
                <div className="w-2 h-2 rounded-full bg-red-500"/>
                <div className="w-2 h-2 rounded-full bg-yellow-500"/>
                <div className="w-2 h-2 rounded-full bg-green-500"/>
                <span className="text-gray-400 text-xs font-mono ml-1 truncate">45-bar-cinematic — Full Composition</span>
              </div>
              <div className="relative bg-gray-950 aspect-video">
                <video className="w-full h-full object-contain" controls preload="metadata"
                    src="src/assets/vid_1.mp4">
                </video>
              </div>
              <div className="px-4 py-3 border-t border-gray-800">
                <div className="text-white font-semibold text-xs mb-0.5">45-Bar Epic Cinematic — Full Piece</div>
                <div className="text-gray-500 text-xs">D minor · 85 BPM · 4/4 · Awakening through Dissolution</div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-800 border-b border-gray-700">
                <div className="w-2 h-2 rounded-full bg-red-500"/>
                <div className="w-2 h-2 rounded-full bg-yellow-500"/>
                <div className="w-2 h-2 rounded-full bg-green-500"/>
                <span className="text-gray-400 text-xs font-mono ml-1 truncate">before-after-harmony — Edit Demo</span>
              </div>
              <div className="relative bg-gray-950 aspect-video flex items-center justify-center">
                {/* Replace src with your second video when ready */}
                <video className="w-full h-full object-contain" controls preload="metadata" src="src/assets/vid_2.mp4">
                </video>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 pointer-events-none">
                  <div className="text-4xl mb-3 float-up">🎭</div>
                  <div className="text-white font-bold text-sm mb-1">Before → After: Harmony Edit</div>
                  <div className="text-gray-400 text-xs">Upload a MIDI melody → AI adds 5-part orchestral harmony</div>
                  <div className="text-gray-600 text-xs mt-2 italic">Add your second video src attribute above</div>
                </div>
              </div>
              <div className="px-4 py-3 border-t border-gray-800">
                <div className="text-white font-semibold text-xs mb-0.5">MIDI Edit Demo — Before &amp; After</div>
                <div className="text-gray-500 text-xs">33-bar melody → 5-voice cinematic arrangement</div>
              </div>
            </div>
          </div>

          {/* Prompt CTA */}
          <div className="bg-gray-900 rounded-2xl border border-purple-500/20 p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
              <div>
                <h3 className="text-white font-black text-base mb-1">📋 The Full Generation Prompt</h3>
                <p className="text-gray-400 text-xs leading-relaxed max-w-lg"></p>
              </div>
              <div className="flex gap-3 flex-shrink-0">
                <button onClick={()=>setShowPrompt(true)}
                  className="bg-purple-500 hover:bg-purple-400 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-all whitespace-nowrap">
                  📋 View &amp; Copy Prompt
                </button>
                <a href="src/assets/audio.mp3" target="_blank" rel="noreferrer"
                  className="bg-gray-800 hover:bg-gray-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-all border border-gray-700 whitespace-nowrap">
                  🎵 Download MP3
                </a>
              </div>
            </div>
            <div className="bg-gray-950 rounded-xl p-4 font-mono text-xs text-gray-500 overflow-x-auto">
              <div className="text-purple-400 mb-1">// Excerpt — bar 24, the absolute peak:</div>
              <div>Bar 24 (Am, vel 127): ★★★ ULTIMATE CLIMAX ★★★</div>
              <div>- 15 SIMULTANEOUS VOICES — maximum polyphony</div>
              <div>- SEVEN OCTAVE SPAN: A2 through A7</div>
              <div>- Every voice at maximum velocity 127</div>
              <div>- A major chord (Picardy third resolution)</div>
              <div className="text-gray-700 mt-1">… click "View &amp; Copy Prompt" for the complete 45-bar specification</div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ PROJECT ══ */}
      <section id="s-project" className="py-20 md:py-28 px-4 bg-gray-900/30 border-t border-gray-900">
        <div className="max-w-6xl mx-auto">
          <SectionHdr eyebrow="Chapter 8 — The Full Project" title="MIDI AI Studio"
            sub="Everything built, how it fits together, and what problems each component solves."/>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
            {[["⚛️","React 18","Vite · Tailwind · Router","border-blue-500/30 bg-blue-500/5"],["☕","Spring Boot 3","Security · JPA · REST","border-green-500/30 bg-green-500/5"],["🟢","Node.js 20","Express · Custom MIDI Engine","border-emerald-500/30 bg-emerald-500/5"],["🐘","PostgreSQL 15","Users · History","border-indigo-500/30 bg-indigo-500/5"]].map(([ic,name,sub,c])=>(
              <div key={name} className={`rounded-2xl border p-4 text-center ${c}`}>
                <div className="text-3xl mb-2">{ic}</div>
                <div className="text-white font-bold text-sm">{name}</div>
                <div className="text-gray-500 text-xs mt-1">{sub}</div>
              </div>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            <Card icon="🤖" title="AI Music Generation" desc="Describe your composition in natural language. Receive a professional .mid file. Up to 200 bars, any key, any time signature, complex multi-voice arrangements." accent="amber"/>
            <Card icon="📚" title="Style Learning" desc="Upload 2–3 MIDI reference files. The AI analyzes harmonic language, rhythmic patterns, and voicing style, then generates new pieces that match your aesthetic." accent="purple"/>
            <Card icon="✏️" title="MIDI Editing" desc="Upload any .mid, describe modifications — 'add jazz chords', 'extend to 48 bars', 'add a walking bass line' — receive the modified file." accent="emerald"/>
            <Card icon="🔄" title="Bidirectional Conversion" desc="MIDI → symbolic text and text → MIDI with full musical fidelity. Lossless for timing, velocity, polyphony, and all expressive data." accent="blue"/>
            <Card icon="🔐" title="Secure Auth + Quotas" desc="JWT sessions with email verification. Daily limits tracked per user with pessimistic write locks to prevent the race condition bug documented above." accent="cyan"/>
            <Card icon="📊" title="Usage Dashboard" desc="Real-time remaining quota, full generation history, and file access per user. All outputs persisted to PostgreSQL." accent="pink"/>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
              <h3 className="text-sm font-bold text-white mb-4">🏆 Technical Depth</h3>
              <ul className="space-y-3 text-xs">
                {[["Custom MIDI Parser & Generator","Built from scratch in Node.js — 480 TPQ, VLQ-encoded delta times, multi-track polyphonic voice reconstruction. No library existed for the custom symbolic format."],["Pessimistic Lock on Quota","SELECT FOR UPDATE with retry in a Spring transaction. Solved the double-decrement race condition documented in the Struggles section."],["Compression Notation Engine","Handles all nested compression patterns before validation — correctly expanding X80(3) inside mixed lines, detecting orphaned sustains, catching off-by-one errors."],["SendGrid HTTP API","Cloud platforms block port 587. Replaced SMTP with SendGrid HTTP API for platform-agnostic delivery on Render/Railway."]].map(([t,d])=>(
                  <li key={t} className="flex gap-2">
                    <span className="text-amber-400 flex-shrink-0 mt-0.5">→</span>
                    <div><span className="text-white font-semibold">{t}: </span><span className="text-gray-400">{d}</span></div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
              <h3 className="text-sm font-bold text-white mb-4">🎯 Who This Helps</h3>
              <ul className="space-y-3 text-xs">
                {[["Music Theorists","You understand harmony, counterpoint, voice leading — but can't perform at a professional level. This closes the gap between theoretical knowledge and practical output."],["Producers & Beatmakers","Generate MIDI stems — progressions, melodies, bass lines — as starting points to edit in your DAW without starting from blank."],["Film & Game Composers","Rapidly prototype orchestral ideas. Describe the emotional arc, specify dynamic structure, receive MIDI to refine in your notation software."],["Music Educators","Generate custom MIDI exercises, harmonization examples, and counterpoint studies programmatically at scale."]].map(([w,d])=>(
                  <li key={w} className="flex gap-2">
                    <span className="text-emerald-400 flex-shrink-0 mt-0.5">→</span>
                    <div><span className="text-white font-semibold">{w}: </span><span className="text-gray-400">{d}</span></div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className="py-20 md:py-28 px-4 border-t border-gray-900 mesh dotgrid">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-4xl mb-5 float-up inline-block">🎹</div>
          <h2 className="text-2xl md:text-4xl font-black text-white mb-4">Ready to Compose?</h2>
          <p className="text-gray-400 text-sm md:text-base mb-8 leading-relaxed max-w-lg mx-auto">
            You now understand the problem — LLMs cannot reason over binary MIDI without an intermediate symbolic representation — and how this system solves it. Try it yourself.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={()=>setShowDemo(true)} className="pring inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-black px-7 py-3 rounded-xl text-sm transition-all">
              🚀 Launch MIDI AI Studio
            </button>
            <a href="https://github.com/bharath-mnr/midi-generator" target="_blank" rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-bold px-7 py-3 rounded-xl text-sm transition-all border border-gray-700">
              ⭐ Star on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="border-t border-gray-900 py-7 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-gray-600 text-xs text-center md:text-left">
            <span className="text-amber-400">🎼</span> MIDI AI Studio — React · Spring Boot · Node.js · PostgreSQL · Google Gemini AI
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="https://midi-generator-seven.vercel.app/" target="_blank" rel="noreferrer" className="text-gray-600 hover:text-amber-400 text-xs transition-colors font-mono">🔐 Auth Demo</a>
            <a href="https://ai-midi-generator-six.vercel.app/" target="_blank" rel="noreferrer" className="text-gray-600 hover:text-amber-400 text-xs transition-colors font-mono">🌐 Open Demo</a>
            <a href="https://github.com/bharath-mnr/midi-generator" target="_blank" rel="noreferrer" className="text-gray-600 hover:text-amber-400 text-xs transition-colors font-mono">⭐ GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}