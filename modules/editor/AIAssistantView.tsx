
import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { Sparkles, Mic2, Volume2, Info, Zap, Timer, CheckCircle2, AlertCircle, RefreshCcw } from 'lucide-react';

const VOICES = [
  { id: 'Kore', name: 'KORE (Ядро)', desc: 'Холодный, властный ИИ. Идеально для стиля Шодан / GLaDOS', gender: 'female' },
  { id: 'Zephyr', name: 'ZEPHYR (Аура)', desc: 'Мягкий, успокаивающий голос бортового компьютера', gender: 'female' },
  { id: 'Charon', name: 'CHARON (Харон)', desc: 'Мрачный, хриплый шепот. Для хоррора и мистики', gender: 'male' },
  { id: 'Fenrir', name: 'FENRIR (Фенрир)', desc: 'Грубый, низкий бас. Для суровых воинов и монстров', gender: 'male' },
  { id: 'Puck', name: 'PUCK (Пак)', desc: 'Хитрый, быстрый и ехидный голос трикстера', gender: 'male' }
];

const AIAssistantView: React.FC = () => {
  const project = useStore(s => s.project);
  const updateSettings = useStore(s => s.updateSettings);
  const currentSpeed = project.settings.ttsSpeed || 1;
  const [isKeyValid, setIsKeyValid] = useState<boolean | null>(null);

  useEffect(() => {
    const key = process.env.API_KEY;
    if (key && key.length > 5) {
      setIsKeyValid(true);
    } else {
      setIsKeyValid(false);
    }
  }, []);

  return (
    <div className="flex-1 p-8 bg-slate-950 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="flex items-center justify-between border-b border-white/5 pb-8">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-purple-600/10 rounded-3xl border border-purple-500/20">
              <Sparkles size={48} className="text-purple-500 animate-pulse" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter">AI Assistant PRO</h2>
              <div className="flex items-center gap-2 mt-1">
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Центр управления нейронными возможностями</span>
                 <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${isKeyValid ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                    {isKeyValid ? <CheckCircle2 size={8} /> : <AlertCircle size={8} />}
                    {isKeyValid ? 'AI_READY' : 'NO_API_KEY'}
                 </div>
              </div>
            </div>
          </div>
          <button onClick={() => window.location.reload()} className="p-3 bg-slate-900 hover:bg-slate-800 text-slate-400 rounded-2xl transition-all border border-white/5 flex items-center gap-2 text-[10px] font-black uppercase">
             <RefreshCcw size={14} /> Перезагрузить ИИ
          </button>
        </header>

        {!isKeyValid && (
           <div className="p-6 bg-red-600/10 border border-red-500/20 rounded-3xl space-y-3">
              <h4 className="text-sm font-black text-red-400 uppercase tracking-widest flex items-center gap-2"><AlertCircle size={16}/> API КЛЮЧ НЕ НАЙДЕН</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Для работы нейросетевых функций (TTS, генерация аватаров и фонов) необходимо запускать приложение через лаунчер <b>Запустить_XenoX.bat</b> с прописанным ключом API_KEY. <br/>Без ключа функции будут выдавать ошибку "Requested entity not found".</p>
           </div>
        )}

        <section className="bg-slate-900/40 border border-slate-800 rounded-[3rem] p-10 space-y-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
             <Mic2 size={120} />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h3 className="text-xl font-black text-white uppercase flex items-center gap-3">
                 <Mic2 className="text-indigo-400" /> AI Озвучка текста
              </h3>
              <p className="text-xs text-slate-500 font-medium max-w-md">Включает возможность прослушивания текста сцен прямо в плеере игры. Использует модель Gemini 2.5 Flash Preview TTS.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer scale-125">
               <input 
                  type="checkbox" 
                  checked={project.settings.ttsEnabled}
                  onChange={(e) => updateSettings({ ttsEnabled: e.target.checked })}
                  className="sr-only peer" 
               />
               <div className="w-14 h-7 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {project.settings.ttsEnabled && (
            <div className="space-y-10 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="space-y-6">
                 <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2">
                    <Volume2 size={14} /> Выбор голоса и личности
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                   {VOICES.map((voice) => (
                     <button 
                       key={voice.id}
                       onClick={() => updateSettings({ defaultVoice: voice.id })}
                       className={`p-6 border-2 rounded-3xl flex flex-col gap-4 transition-all text-left group ${
                         project.settings.defaultVoice === voice.id 
                           ? 'bg-indigo-600/20 border-indigo-500 shadow-xl shadow-indigo-500/10' 
                           : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                       }`}
                     >
                       <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${project.settings.defaultVoice === voice.id ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-500 group-hover:text-slate-300'}`}>
                          <Mic2 size={24} />
                       </div>
                       <div>
                         <p className={`text-sm font-black uppercase ${project.settings.defaultVoice === voice.id ? 'text-white' : 'text-slate-400'}`}>{voice.name}</p>
                         <p className="text-[10px] text-slate-500 mt-1 leading-tight font-bold">{voice.desc}</p>
                       </div>
                     </button>
                   ))}
                 </div>
              </div>

              <div className="space-y-6">
                 <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2">
                    <Timer size={14} /> Скорость воспроизведения
                 </div>
                 <div className="flex items-center gap-4 bg-black/30 p-2 rounded-2xl border border-white/5">
                   {[1, 1.5, 2].map((speed) => (
                     <button
                        key={speed}
                        onClick={() => updateSettings({ ttsSpeed: speed })}
                        className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${currentSpeed === speed ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                     >
                        {speed}x
                     </button>
                   ))}
                 </div>
              </div>
            </div>
          )}
        </section>

        <section className="bg-purple-600/5 border border-purple-500/20 rounded-[3rem] p-10 flex items-start gap-8">
           <Info size={40} className="text-purple-400 shrink-0" />
           <div className="space-y-4">
              <h4 className="text-sm font-black text-white uppercase tracking-widest">Совет по Шодан-стилю</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <p className="text-[10px] font-black text-purple-400 uppercase">Голос KORE</p>
                    <p className="text-xs text-slate-400 leading-relaxed">Выбирайте этот голос для антагонистов-ИИ. Мы добавили специальную инструкцию, которая делает его холодным и слегка искаженным при генерации.</p>
                 </div>
                 <div className="space-y-2">
                    <p className="text-[10px] font-black text-purple-400 uppercase">Повествование</p>
                    <p className="text-xs text-slate-400 leading-relaxed">AI озвучка добавляет глубины погружения. Рекомендуем использовать разные голоса для разных настроек проекта.</p>
                 </div>
              </div>
           </div>
        </section>
      </div>
    </div>
  );
};

export default AIAssistantView;
