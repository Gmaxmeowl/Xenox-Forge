
import { 
  Package, Users, Settings, X, ShieldAlert, Volume2, ArrowRight, RefreshCw, VolumeX, Save, Loader2, Mic2, Square, Lock
} from 'lucide-react';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useStore } from '../../store/useStore';
import { Choice } from '../../types';
import { GoogleGenAI, Modality } from "@google/genai";

function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const PlayerEngine: React.FC = () => {
  const gameState = useStore(s => s.gameState);
  const project = useStore(s => s.project);
  const makeChoice = useStore(s => s.makeChoice);
  const resetGame = useStore(s => s.resetGame);
  const quickSave = useStore(s => s.quickSave);
  const quickLoad = useStore(s => s.quickLoad);
  const setMode = useStore(s => s.setMode);

  const [displayText, setDisplayText] = useState('');
  const [activeWindow, setActiveWindow] = useState<'inventory' | 'companions' | 'quests' | 'settings' | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  
  const [isTtsLoading, setIsTtsLoading] = useState(false);
  const [isTtsPlaying, setIsTtsPlaying] = useState(false);
  const ttsAudioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const textIntervalRef = useRef<number | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const ambientAudioRef = useRef<HTMLAudioElement | null>(null);

  const scene = project?.scenes?.find(s => s.id === gameState?.currentSceneId);
  const isPublished = project?.settings?.isPublished;

  const checkChoiceAvailability = useCallback((choice: Choice) => {
    if (!gameState) return { ok: false, reason: '' };
    const results = (choice.conditions || []).map(cond => {
      const val = gameState.variableValues[cond.targetId || ''];
      const targetVal = cond.value;
      switch (cond.type) {
        case 'variable':
          if (cond.operator === 'eq') return val == targetVal;
          if (cond.operator === 'gt') return Number(val) > Number(targetVal);
          if (cond.operator === 'lt') return Number(val) < Number(targetVal);
          return true;
        case 'item':
          return cond.operator === 'has' ? gameState.inventory.includes(cond.targetId || '') : !gameState.inventory.includes(cond.targetId || '');
        case 'relationship':
          const char = project.characters.find(c => c.id === cond.targetId);
          const rel = gameState.relationships[cond.targetId || ''] ?? (char?.initialRelationship || 0);
          if (cond.operator === 'eq') return rel == targetVal;
          if (cond.operator === 'gt') return rel > Number(targetVal);
          if (cond.operator === 'lt') return rel < Number(targetVal);
          return true;
        case 'quest':
          const qState = gameState.questStates[cond.targetId || ''];
          if (!qState) return cond.value === 'not_started';
          return qState.status === cond.value;
        case 'scene':
          return gameState.currentSceneId === cond.targetId;
        default: return true;
      }
    });
    const ok = choice.logicOperator === 'OR' ? results.length === 0 || results.some(r => r) : results.every(r => r);
    return { ok, reason: '' };
  }, [gameState, project.characters]);

  const handleChoice = useCallback((choice: Choice) => {
    if (isTyping) {
      if (textIntervalRef.current) clearInterval(textIntervalRef.current);
      setDisplayText(scene?.content || '');
      setIsTyping(false);
      return;
    }
    makeChoice(choice);
  }, [isTyping, scene?.content, makeChoice]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeWindow) return; 
      if (scene && scene.choices) {
        const choiceIdx = parseInt(e.key) - 1;
        if (choiceIdx >= 0 && choiceIdx < scene.choices.length) {
          const choice = scene.choices[choiceIdx];
          const { ok } = checkChoiceAvailability(choice);
          if (ok) handleChoice(choice);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [scene, activeWindow, checkChoiceAvailability, handleChoice]);

  useEffect(() => {
    const targetTrack = gameState?.currentTrackUrl || scene?.ambientUrl;
    if (targetTrack) {
      if (!ambientAudioRef.current) { ambientAudioRef.current = new Audio(); ambientAudioRef.current.loop = true; }
      if (ambientAudioRef.current.getAttribute('src') !== targetTrack) {
        ambientAudioRef.current.pause(); ambientAudioRef.current.src = targetTrack;
        ambientAudioRef.current.play().catch(() => {});
      }
      ambientAudioRef.current.volume = isMuted ? 0 : 0.4;
    } else if (ambientAudioRef.current) {
      ambientAudioRef.current.pause(); ambientAudioRef.current.src = "";
    }
    return () => { if (ambientAudioRef.current) { ambientAudioRef.current.pause(); ambientAudioRef.current.src = ""; } };
  }, [scene?.ambientUrl, gameState?.currentTrackUrl, isMuted]);

  useEffect(() => {
    if (scene && !gameState?.isPaused) {
      setDisplayText(''); setIsTyping(true); stopTTS();
      let i = 0;
      const fullText = scene.content || '';
      if (textIntervalRef.current) clearInterval(textIntervalRef.current);
      textIntervalRef.current = window.setInterval(() => {
        setDisplayText(fullText.substring(0, i + 1)); i++;
        if (i >= fullText.length) { if (textIntervalRef.current) clearInterval(textIntervalRef.current); setIsTyping(false); }
      }, 25);
    }
    return () => { if (textIntervalRef.current) clearInterval(textIntervalRef.current); };
  }, [scene, gameState?.isPaused]);

  const stopTTS = () => {
    if (ttsAudioSourceRef.current) { try { ttsAudioSourceRef.current.stop(); } catch(e) {} ttsAudioSourceRef.current = null; }
    setIsTtsPlaying(false);
  };

  const handleTTS = async () => {
    if (isTtsPlaying) { stopTTS(); return; }
    if (!scene?.content) return;
    setIsTtsLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const voice = project.settings.defaultVoice || 'Charon';
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: scene.content.substring(0, 3000) }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } } }
        }
      });
      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        if (!audioContextRef.current) audioContextRef.current = new AudioContext({ sampleRate: 24000 });
        const ctx = audioContextRef.current;
        const audioBuffer = await decodeAudioData(decodeBase64(base64Audio), ctx, 24000, 1);
        stopTTS();
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer; source.connect(ctx.destination);
        source.onended = () => setIsTtsPlaying(false);
        ttsAudioSourceRef.current = source; source.start(0); setIsTtsPlaying(true);
      }
    } catch (error) {
      console.error("TTS Error:", error);
    } finally { setIsTtsLoading(false); }
  };

  if (!gameState || !scene) return null;

  return (
    <div className="h-full w-full bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        {scene.backgroundUrl && <img src={scene.backgroundUrl} className="w-full h-full object-cover transition-all duration-1000" alt="background" />}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none" />
      </div>

      <div className="relative z-10 flex items-center justify-end p-6">
           <button onClick={() => setIsMuted(!isMuted)} className="p-3 bg-slate-900/80 backdrop-blur border border-white/5 rounded-2xl text-slate-400 hover:text-white transition-all shadow-xl">
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
      </div>

      <div className="flex-1 flex flex-col items-start justify-end p-12 pb-12 relative z-10">
        <div className="w-full pr-24 space-y-10 flex flex-col items-start">
          <div className="grid grid-cols-1 gap-3 max-w-xl animate-in fade-in slide-in-from-bottom-6">
            {scene.choices.map((choice, idx) => {
              const { ok } = checkChoiceAvailability(choice);
              return (
                <button key={choice.id} disabled={!ok} onClick={() => handleChoice(choice)} className={`group w-full flex items-center justify-start gap-5 p-4 rounded-2xl border-2 transition-all ${ok ? 'bg-slate-900/60 border-white/5 hover:border-indigo-500/50 text-slate-100' : 'bg-slate-950/50 border-slate-900 text-slate-700 cursor-not-allowed opacity-30'}`}>
                  <span className="text-[10px] font-black text-slate-500 px-3 py-1.5 bg-black/40 rounded-lg group-hover:text-indigo-400 transition-colors border border-white/5 shrink-0">{idx + 1}</span>
                  <span className="font-black uppercase tracking-tight text-lg leading-tight">{choice.text}</span>
                  {ok ? <ArrowRight size={18} className="ml-auto text-slate-700 group-hover:text-indigo-500 transition-all group-hover:translate-x-1" /> : <Lock size={16} className="ml-auto" />}
                </button>
              );
            })}
          </div>
          <div className="relative w-full">
            <div className="bg-slate-900/80 backdrop-blur-3xl border border-white/10 p-12 rounded-[3.5rem] shadow-2xl relative">
              {project.settings.ttsEnabled && (
                <button onClick={handleTTS} disabled={isTtsLoading} className={`absolute -top-6 -right-6 p-5 rounded-3xl border-2 shadow-2xl z-20 transition-all ${isTtsPlaying ? 'bg-red-600 border-red-400 text-white' : 'bg-slate-800 border-white/20 text-indigo-400 hover:bg-indigo-600 hover:text-white hover:scale-110'}`}>
                  {isTtsLoading ? <Loader2 size={28} className="animate-spin" /> : isTtsPlaying ? <Square size={28} fill="currentColor" /> : <Mic2 size={28} />}
                </button>
              )}
              <p className="text-lg font-serif leading-relaxed text-slate-200">
                {displayText}
                {isTyping && <span className="inline-block w-1.5 h-6 bg-indigo-500 ml-1.5 animate-pulse align-middle" />}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-10 right-10 z-40 pointer-events-none">
         <div className="flex flex-col items-end gap-3 pointer-events-auto">
            {project.settings.hudInventoryEnabled && <HUDButton icon={Package} active={activeWindow === 'inventory'} onClick={() => setActiveWindow('inventory')} label="СУМКА" />}
            {project.settings.hudCompanionsEnabled && <HUDButton icon={Users} active={activeWindow === 'companions'} onClick={() => setActiveWindow('companions')} label="ГРУППА" />}
            <HUDButton icon={Settings} active={activeWindow === 'settings'} onClick={() => setActiveWindow('settings')} label="МЕНЮ" />
         </div>
      </div>

      {activeWindow && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-12 bg-black/95 backdrop-blur-3xl animate-in fade-in">
           <div className="w-full max-w-5xl h-full max-h-[85vh] bg-slate-950/80 border border-white/10 rounded-[4rem] shadow-2xl flex flex-col overflow-hidden relative">
              <div className="px-16 py-12 border-b border-white/5 flex items-center justify-between bg-slate-900/40">
                 <h2 className="text-2xl font-black uppercase tracking-[0.5em] text-indigo-400">СИСТЕМА</h2>
                 <button onClick={() => setActiveWindow(null)} className="p-4 text-slate-500 hover:text-white transition-all transform hover:rotate-90"><X size={40} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-16 custom-scrollbar">
                 {activeWindow === 'settings' && (
                   <div className="max-w-md mx-auto space-y-8">
                      <div className="grid grid-cols-2 gap-6">
                         <button onClick={() => { quickSave(); setActiveWindow(null); }} className="flex flex-col items-center gap-6 p-10 bg-white/5 border border-white/5 hover:bg-indigo-600 hover:text-white rounded-[2.5rem] transition-all group shadow-2xl"><Save size={40} className="text-indigo-400 group-hover:text-white" /><span className="text-sm font-black uppercase tracking-widest">СОХРАНИТЬ</span></button>
                         <button onClick={() => { quickLoad(); setActiveWindow(null); }} className="flex flex-col items-center gap-6 p-10 bg-white/5 border border-white/5 hover:bg-indigo-600 hover:text-white rounded-[2.5rem] transition-all group shadow-2xl"><RefreshCw size={40} className="text-indigo-400 group-hover:text-white" /><span className="text-sm font-black uppercase tracking-widest">ЗАГРУЗИТЬ</span></button>
                      </div>
                      <button onClick={() => { resetGame(); setActiveWindow(null); }} className="w-full py-8 bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-600 hover:text-white rounded-[2.5rem] font-black uppercase text-sm tracking-widest transition-all shadow-xl">НАЧАТЬ ЗАНОВО</button>
                      
                      {!isPublished && (
                        <button onClick={() => setMode('editor')} className="w-full py-5 border border-white/5 text-white/20 hover:text-white rounded-[1.5rem] font-black uppercase text-xs tracking-[0.4em] transition-all">РЕЖИМ ТВОРЦА</button>
                      )}
                   </div>
                 )}
                 {activeWindow === 'inventory' && (
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                     {gameState.inventory.map(itemId => {
                       const item = project.items.find(i => i.id === itemId);
                       if (!item) return null;
                       return (
                         <div key={itemId} className="p-6 bg-white/5 border border-white/10 rounded-3xl flex flex-col items-center gap-4">
                           <span className="text-4xl">{item.icon}</span>
                           <span className="text-xs font-black uppercase text-center">{item.name}</span>
                         </div>
                       );
                     })}
                     {gameState.inventory.length === 0 && <p className="col-span-full text-center text-slate-600 font-black uppercase tracking-widest py-10">ПУСТО</p>}
                   </div>
                 )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const HUDButton: React.FC<{ icon: any, active: boolean, onClick: () => void, label: string }> = ({ icon: Icon, active, onClick, label }) => (
  <button onClick={onClick} className={`w-14 h-14 rounded-2xl transition-all flex flex-col items-center justify-center group shadow-2xl border backdrop-blur-3xl ${active ? 'bg-indigo-600 text-white border-indigo-400 scale-110 z-50' : 'bg-slate-900/90 text-slate-500 border-white/5 hover:text-white hover:bg-slate-800'}`} title={label}>
    <Icon size={24} className={active ? 'scale-110' : 'group-hover:scale-110 transition-transform opacity-70 group-hover:opacity-100'} />
  </button>
);

export default PlayerEngine;
