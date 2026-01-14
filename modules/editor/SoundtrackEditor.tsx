
import React, { useState, useRef } from 'react';
import { useStore } from '../../store/useStore';
import { 
  Music, Sparkles, Play, Square, Loader2, Check, Activity, Info, Zap, Trash2, Volume2, 
  Waves, Ghost, Radio, Disc, CloudDownload, Star, StarOff, VolumeX, ShieldCheck
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const SOUND_LIBRARY: Record<string, string[]> = {
  horror: [
    "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
    "https://assets.mixkit.co/active_storage/sfx/2552/2552-preview.mp3",
  ],
  cyber: [
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  ],
  fantasy: [
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3",
  ],
  'sci-fi': [
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3",
  ]
};

const SoundtrackEditor: React.FC = () => {
  const assets = useStore(s => s.project.assets);
  const globalSoundtrackId = useStore(s => s.project.settings.globalSoundtrackId);
  const addAsset = useStore(s => s.addAsset);
  const deleteAsset = useStore(s => s.deleteAsset);
  const updateSettings = useStore(s => s.updateSettings);

  const [selectedMode, setSelectedMode] = useState('horror');
  const [aiMood, setAiMood] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPreview, setGeneratedPreview] = useState<string | null>(null);
  const [composerLog, setComposerLog] = useState<string | null>(null);
  const [previewingTrack, setPreviewingTrack] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const audioAssets = assets.filter(a => a.type === 'audio');

  const stringToHash = (s: string) => {
    let hash = 0;
    for (let i = 0; i < s.length; i++) {
      hash = ((hash << 5) - hash) + s.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  };

  const handleCompose = async () => {
    if (!aiMood.trim()) return;
    setIsGenerating(true);
    setComposerLog(null);
    setGeneratedPreview(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `You are a professional music supervisor. Analyze this mood: "${aiMood}". 
      Explain how instruments should react in ${selectedMode} style. Output in Russian. Max 50 words.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ parts: [{ text: prompt }] }]
      });

      setComposerLog(response.text || "Музыкальный профиль успешно сформирован.");
      
      const pool = SOUND_LIBRARY[selectedMode] || SOUND_LIBRARY.horror;
      const index = stringToHash(aiMood + (response.text || "")) % pool.length;
      setGeneratedPreview(pool[index]);
      
    } catch (error: any) {
      console.error("Composer Error:", error);
      const isBlocked = error.message?.includes('finishReason: SAFETY');
      alert(isBlocked ? "Запрос отклонен фильтрами безопасности. Попробуйте другое описание." : "Ошибка связи с нейросетью.");
    } finally {
      setIsGenerating(false);
    }
  };

  const saveTrack = () => {
    if (generatedPreview) {
      addAsset({
        name: `NEURAL_${selectedMode.toUpperCase()}_${Date.now().toString().slice(-4)}`,
        type: 'audio',
        data: generatedPreview,
        mimeType: 'audio/mpeg'
      });
      setGeneratedPreview(null);
      setComposerLog(null);
      setAiMood('');
    }
  };

  const togglePreview = (url: string) => {
    if (previewingTrack === url) {
      stopPreview();
    } else {
      if (!audioRef.current) audioRef.current = new Audio();
      audioRef.current.src = url;
      audioRef.current.loop = true;
      audioRef.current.play().catch(() => {});
      setPreviewingTrack(url);
    }
  };

  const stopPreview = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setPreviewingTrack(null);
  };

  const downloadAsset = async (url: string, name: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = name.endsWith('.mp3') ? name : `${name}.mp3`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(blobUrl);
      document.body.removeChild(a);
    } catch (e) {
      alert('Ошибка при скачивании файла.');
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 p-8 overflow-hidden">
      <div className="max-w-6xl mx-auto w-full flex flex-col h-full space-y-10">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-indigo-600/10 rounded-3xl border border-indigo-500/20">
               <Music size={40} className="text-indigo-500 animate-pulse" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Soundscape PRO v2.5</h2>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Интеллектуальная система управления атмосферой</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             {previewingTrack && (
               <button onClick={stopPreview} className="flex items-center gap-3 px-6 py-3 bg-red-600 hover:bg-red-500 text-white text-[10px] font-black rounded-2xl shadow-xl animate-in fade-in">
                  <VolumeX size={16} /> ВЫКЛЮЧИТЬ ЗВУК
               </button>
             )}
             <div className="bg-slate-900/50 p-3 rounded-2xl border border-white/5 flex flex-col items-end">
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">ТЕМ В ПРОЕКТЕ</span>
                <span className="text-xl font-black text-white">{audioAssets.length}</span>
             </div>
          </div>
        </header>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-10 overflow-hidden">
          <div className="lg:col-span-2 flex flex-col space-y-8 overflow-y-auto custom-scrollbar pr-4">
             <section className="bg-slate-900/40 border border-slate-800 rounded-[3rem] p-10 space-y-8 shadow-2xl relative overflow-hidden">
                <div className="space-y-2">
                   <h3 className="text-xl font-black text-white uppercase flex items-center gap-3"><Zap className="text-indigo-400" /> Neural Sound Designer</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                   {[{ id: 'horror', name: 'ХОРРОР', icon: Ghost, color: 'text-red-400' }, { id: 'cyber', name: 'ТЕХНО', icon: Radio, color: 'text-indigo-400' }, { id: 'fantasy', name: 'ФЭНТЕЗИ', icon: Disc, color: 'text-amber-400' }, { id: 'sci-fi', name: 'SCI-FI', icon: Waves, color: 'text-blue-400' }].map(m => (
                     <button key={m.id} onClick={() => setSelectedMode(m.id)} className={`p-4 rounded-2xl border-2 transition-all text-left space-y-2 ${selectedMode === m.id ? 'bg-indigo-600/20 border-indigo-500 scale-105' : 'bg-slate-900 border-slate-800 hover:border-slate-700'}`}>
                        <m.icon size={20} className={selectedMode === m.id ? 'text-white' : m.color} />
                        <p className="text-[10px] font-black text-white uppercase leading-tight">{m.name}</p>
                     </button>
                   ))}
                </div>
                <div className="space-y-4">
                   <textarea 
                     value={aiMood} 
                     onChange={e => setAiMood(e.target.value)} 
                     className="w-full h-32 bg-black/40 border border-slate-700 rounded-3xl p-6 text-white text-sm outline-none focus:border-indigo-500 transition-all resize-none shadow-inner" 
                     placeholder="Опишите настроение для подбора саундтрека..." 
                   />
                   <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2"><Activity size={12} className="text-emerald-500" /><span className="text-[9px] font-black text-slate-600 uppercase">Engine: Neural Matcher</span></div>
                      <button disabled={isGenerating || !aiMood.trim()} onClick={handleCompose} className="px-10 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-black rounded-xl flex items-center gap-2 shadow-lg">
                         {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />} ПОДОБРАТЬ
                      </button>
                   </div>
                </div>
                {composerLog && (
                   <div className="p-6 bg-indigo-600/5 border border-indigo-500/20 rounded-[2rem] space-y-4 animate-in fade-in">
                      <p className="text-xs text-slate-300 italic leading-relaxed">{composerLog}</p>
                      {generatedPreview && (
                        <div className="flex items-center gap-4 bg-black/30 p-4 rounded-2xl border border-white/5">
                           <button onClick={() => togglePreview(generatedPreview)} className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg">
                              {previewingTrack === generatedPreview ? <Square size={16} fill="white" /> : <Play size={16} fill="white" />}
                           </button>
                           <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden"><div className={`h-full bg-indigo-500 ${previewingTrack === generatedPreview ? 'animate-pulse' : 'w-0'}`} /></div>
                           <button onClick={saveTrack} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black rounded-lg">ДОБАВИТЬ В ИГРУ</button>
                        </div>
                      )}
                   </div>
                )}
             </section>
          </div>

          <div className="flex flex-col space-y-6 overflow-hidden">
             <div className="p-4 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl flex items-center gap-3">
                <Music size={18} className="text-indigo-500" />
                <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Банк ресурсов</h3>
             </div>
             <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2 pb-10">
                {audioAssets.map(asset => {
                    const isGlobal = globalSoundtrackId === asset.id;
                    return (
                      <div key={asset.id} className={`p-4 bg-slate-900 border rounded-2xl flex items-center gap-4 group transition-all ${isGlobal ? 'border-indigo-500/50 bg-indigo-950/10' : 'border-slate-800 hover:border-indigo-500/30'}`}>
                         <button onClick={() => togglePreview(asset.data)} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${previewingTrack === asset.data ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-500'}`}>
                           {previewingTrack === asset.data ? <Square size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
                         </button>
                         <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-black text-slate-200 truncate uppercase">{asset.name}</p>
                            {isGlobal && <span className="text-[7px] font-black text-indigo-400 uppercase bg-indigo-500/20 px-1.5 py-0.5 rounded-full inline-flex items-center gap-1 mt-1"><Star size={8} fill="currentColor" /> ГЛАВНАЯ</span>}
                         </div>
                         <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-all">
                            <button onClick={() => updateSettings({ globalSoundtrackId: isGlobal ? undefined : asset.id })} className={`p-1.5 ${isGlobal ? 'text-indigo-400' : 'text-slate-600 hover:text-indigo-400'}`}>{isGlobal ? <Star size={14} fill="currentColor" /> : <StarOff size={14} />}</button>
                            <button onClick={() => downloadAsset(asset.data, asset.name)} className="p-1.5 text-slate-600 hover:text-emerald-400"><CloudDownload size={14} /></button>
                            <button onClick={() => deleteAsset(asset.id)} className="p-1.5 text-slate-600 hover:text-red-500"><Trash2 size={14} /></button>
                         </div>
                      </div>
                    );
                  })}
             </div>
             <div className="p-6 bg-indigo-500/5 border border-indigo-500/20 rounded-[2.5rem] space-y-3">
                <div className="flex items-center gap-2 text-indigo-400"><ShieldCheck size={16} /><span className="text-[10px] font-black uppercase tracking-widest">Совет</span></div>
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">Стартовая музыка играет до тех пор, пока сюжетный триггер не сменит её.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoundtrackEditor;
