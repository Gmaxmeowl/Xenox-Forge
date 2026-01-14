
import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { translations } from '../../translations';
import { SceneType, RuleCondition, RuleAction, Choice, MediaAsset, ConditionType, ConditionOperator } from '../../types';
import { 
  Plus, Trash2, BrainCircuit, FileText, GitMerge, Flag, Info, ShieldCheck, Zap, ChevronDown, 
  Image as ImageIcon, FolderOpen, Maximize2, X, Music, Folder, Volume2, Star, Sparkles, Loader2, Database, MessageSquare, Settings2, ChevronRight, ChevronLeft, Eye, EyeOff
} from 'lucide-react';
import MediaLibrary from './MediaLibrary';
import { GoogleGenAI } from "@google/genai";

const SceneEditor: React.FC = () => {
  const { selectedSceneId, project, updateScene, deleteScene, setStartScene, language } = useStore();
  const t = translations[language].sceneEditor;
  
  const scene = project.scenes.find(s => s.id === selectedSceneId);
  const isStartScene = project.startSceneId === selectedSceneId;

  const [expandedChoice, setExpandedChoice] = useState<string | null>(null);
  const [showLibraryModal, setShowLibraryModal] = useState<{ type: 'bg' | 'ambient' | 'action_audio', choiceId?: string, listKey?: any, itemId?: string } | null>(null);
  const [isConfigPanelOpen, setIsConfigPanelOpen] = useState(false);
  const [isStoryExpanded, setIsStoryExpanded] = useState(true);
  
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  if (!scene) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-slate-600 bg-slate-950">
        <BrainCircuit size={48} className="mb-4 opacity-20" />
        <p className="text-sm font-medium">{t.selectScene}</p>
      </div>
    );
  }

  const generateAIText = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const context = `
        Game: ${project.name}
        Scene Title: ${scene.title}
        Characters: ${project.characters.map(c => c.name).join(', ')}
        Items: ${project.items.map(i => i.name).join(', ')}
      `;
      const fullPrompt = `You are a professional narrative designer. Expand this scene description based on: ${aiPrompt}. 
      Context: ${context}. Keep it atmospheric and engaging. Return story in Russian.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ parts: [{ text: fullPrompt }] }]
      });

      const generatedText = response.text || '';
      updateScene(scene.id, { content: scene.content ? `${scene.content}\n\n${generatedText}` : generatedText });
      setAiPrompt('');
      setIsAiPanelOpen(false);
      setIsStoryExpanded(true);
    } catch (error) {
      console.error("AI Text Error:", error);
      alert("Ошибка ИИ.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const addChoice = () => {
    if (scene.type === 'end') return;
    const newChoices: Choice[] = [...scene.choices, { 
      id: `c_${Date.now()}`, 
      text: '', 
      conditions: [], 
      logicOperator: 'AND',
      actions: [], 
      elseActions: [] 
    }];
    updateScene(scene.id, { choices: newChoices });
    setExpandedChoice(newChoices[newChoices.length - 1].id);
  };

  const removeChoice = (choiceId: string) => {
    const newChoices = scene.choices.filter(c => c.id !== choiceId);
    updateScene(scene.id, { choices: newChoices });
  };

  const updateChoice = (choiceId: string, updates: Partial<Choice>) => {
    const newChoices = scene.choices.map(c => c.id === choiceId ? { ...c, ...updates } : c);
    updateScene(scene.id, { choices: newChoices });
  };

  const addCondition = (choiceId: string) => {
    const choice = scene.choices.find(c => c.id === choiceId);
    if (!choice) return;
    const newCond: RuleCondition = { id: `cond_${Date.now()}`, type: 'variable', operator: 'eq', value: 0 };
    updateChoice(choiceId, { conditions: [...choice.conditions, newCond] });
  };

  const addAction = (choiceId: string, isElse: boolean = false) => {
    const choice = scene.choices.find(c => c.id === choiceId);
    if (!choice) return;
    
    const newAction: RuleAction = { id: `act_${Date.now()}`, type: 'change_scene' };
    if (isElse) {
      updateChoice(choiceId, { elseActions: [...choice.elseActions, newAction] });
    } else {
      updateChoice(choiceId, { actions: [...choice.actions, newAction] });
    }
  };

  const removeRuleItem = (choiceId: string, itemId: string, listKey: 'conditions' | 'actions' | 'elseActions') => {
    const choice = scene.choices.find(c => c.id === choiceId);
    if (!choice) return;
    updateChoice(choiceId, { [listKey]: (choice[listKey] as any[]).filter((i: any) => i.id !== itemId) });
  };

  const updateRuleItem = (choiceId: string, itemId: string, listKey: 'conditions' | 'actions' | 'elseActions', updates: any) => {
    const choice = scene.choices.find(c => c.id === choiceId);
    if (!choice) return;
    updateChoice(choiceId, { 
      [listKey]: (choice[listKey] as any[]).map((i: any) => i.id === itemId ? { ...i, ...updates } : i) 
    });
  };

  const handleLibrarySelect = (asset: MediaAsset) => {
    if (!showLibraryModal) return;
    if (showLibraryModal.type === 'bg') {
      updateScene(scene.id, { backgroundUrl: asset.data });
    } else if (showLibraryModal.type === 'ambient') {
      updateScene(scene.id, { ambientUrl: asset.data });
    } else if (showLibraryModal.type === 'action_audio' && showLibraryModal.choiceId && showLibraryModal.listKey && showLibraryModal.itemId) {
      updateRuleItem(showLibraryModal.choiceId, showLibraryModal.itemId, showLibraryModal.listKey, { targetId: asset.data });
    }
    setShowLibraryModal(null);
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-slate-950 relative">
      <div className="flex-1 flex flex-col min-w-0 border-r border-slate-800 h-full overflow-y-auto custom-scrollbar p-6">
        <div className="max-w-4xl mx-auto w-full space-y-8 pb-20">
          <div className="flex flex-col gap-4">
             <input type="text" value={scene.title} onChange={(e) => updateScene(scene.id, { title: e.target.value })} className="bg-transparent text-2xl font-black text-white outline-none w-full border-b border-transparent focus:border-indigo-500/30 transition-all uppercase tracking-tighter" placeholder={t.sceneTitle} />
             
             <div className="flex flex-wrap items-center gap-2">
               <button 
                  onClick={() => setIsAiPanelOpen(!isAiPanelOpen)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] font-black transition-all border ${isAiPanelOpen ? 'bg-purple-600 text-white border-purple-400' : 'bg-slate-900 text-purple-400 border-purple-500/20 hover:bg-slate-800'}`}
               >
                  <Sparkles size={14} /> AI ПИСАТЕЛЬ
               </button>
               {!isStartScene && (
                 <button onClick={() => setStartScene(scene.id)} className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-indigo-600 text-[10px] font-black text-slate-400 hover:text-white rounded-xl transition-all uppercase border border-slate-700">
                    <Star size={14} /> В начало
                 </button>
               )}
               <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 shadow-lg">
                  {(['normal', 'choice', 'end'] as SceneType[]).map(type => (
                    <button key={type} onClick={() => updateScene(scene.id, { type })} className={`px-4 py-2 text-[10px] font-bold rounded-lg uppercase transition-all flex items-center gap-2 ${scene.type === type ? (type === 'normal' ? 'bg-blue-600' : type === 'choice' ? 'bg-purple-600' : 'bg-red-600') + ' text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>
                      {type === 'choice' ? <GitMerge size={14}/> : type === 'end' ? <Flag size={14}/> : <FileText size={14}/>}
                    </button>
                  ))}
               </div>
             </div>
          </div>

          {isAiPanelOpen && (
            <div className="p-6 bg-purple-900/10 border border-purple-500/20 rounded-[2.5rem] space-y-4 animate-in slide-in-from-top-4 duration-300">
               <h4 className="text-[10px] font-black text-purple-400 uppercase tracking-widest flex items-center gap-2">Генератор повествования</h4>
               <div className="flex gap-4">
                  <input value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} placeholder="Опишите продолжение..." className="flex-1 bg-black/40 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-purple-500" />
                  <button disabled={isAiLoading || !aiPrompt.trim()} onClick={generateAIText} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-black rounded-xl transition-all">
                    {isAiLoading ? '...' : <MessageSquare size={14} />}
                  </button>
               </div>
            </div>
          )}

          <div className="space-y-6">
            <div className="space-y-4">
              <button 
                onClick={() => setIsStoryExpanded(!isStoryExpanded)}
                className="flex items-center justify-between w-full group"
              >
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 cursor-pointer group-hover:text-indigo-400 transition-colors">
                  <FileText size={14} /> ТЕКСТ ПОВЕСТВОВАНИЯ
                </label>
                <div className="flex items-center gap-3">
                   {(!isStoryExpanded && scene.content) && (
                     <span className="text-[9px] font-black text-slate-700 uppercase tracking-tighter">
                       ~{Math.round(scene.content.length / 5)} СЛОВ
                     </span>
                   )}
                   {isStoryExpanded ? <Eye size={14} className="text-slate-600" /> : <EyeOff size={14} className="text-indigo-500 animate-pulse" />}
                   <ChevronDown size={14} className={`text-slate-600 transition-transform ${isStoryExpanded ? '' : '-rotate-90'}`} />
                </div>
              </button>
              
              {isStoryExpanded ? (
                <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                  <textarea 
                    value={scene.content} 
                    onChange={(e) => updateScene(scene.id, { content: e.target.value })} 
                    className="w-full min-h-[300px] bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-8 text-lg font-serif leading-relaxed text-slate-300 outline-none focus:border-indigo-500/50 transition-all resize-none shadow-2xl" 
                    placeholder={t.storyPlaceholder} 
                  />
                </div>
              ) : (
                <div 
                  onClick={() => setIsStoryExpanded(true)}
                  className="w-full py-4 px-8 bg-slate-900/20 border border-dashed border-slate-800 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-slate-900/40 hover:border-slate-700 transition-all text-[10px] font-black text-slate-600 uppercase tracking-widest gap-3"
                >
                   <FileText size={14} /> Развернуть поле текста
                </div>
              )}
            </div>

            <div className="space-y-4">
               <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2"><Zap size={14} className="text-amber-400" /> ВАРИАНТЫ ВЫБОРА</h3>
                  {scene.type !== 'end' && <button onClick={addChoice} className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white text-[10px] font-black rounded-xl hover:bg-indigo-500 transition-all shadow-lg"><Plus size={14} /> ДОБАВИТЬ ВЫБОР</button>}
               </div>

               <div className="space-y-4">
                  {scene.choices.map((choice, idx) => (
                    <div key={choice.id} className="bg-slate-900/40 border border-slate-800 rounded-[2rem] overflow-hidden shadow-lg group/choice">
                      <div onClick={() => setExpandedChoice(expandedChoice === choice.id ? null : choice.id)} className="p-5 flex items-center gap-5 cursor-pointer hover:bg-white/5 transition-colors">
                        <div className="h-10 w-10 rounded-xl bg-slate-800 flex items-center justify-center text-xs font-black text-slate-500">{idx + 1}</div>
                        <input type="text" value={choice.text} onClick={(e) => e.stopPropagation()} onChange={(e) => updateChoice(choice.id, { text: e.target.value })} className="flex-1 bg-transparent border-none text-sm font-black text-slate-100 outline-none uppercase tracking-tight" placeholder="Что сделает герой?.." />
                        <ChevronDown size={18} className={`text-slate-600 transition-transform ${expandedChoice === choice.id ? 'rotate-180' : ''}`} />
                      </div>

                      {expandedChoice === choice.id && (
                        <div className="p-6 border-t border-slate-800 bg-black/30 space-y-8 animate-in slide-in-from-top-2 duration-200">
                          <section className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                 <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2"><ShieldCheck size={14} /> ЕСЛИ (УСЛОВИЯ)</h4>
                                 <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-lg border border-slate-800">
                                    <span className="text-[7px] font-black text-slate-600 uppercase tracking-tighter">ЛОГИКА:</span>
                                    <select 
                                      value={choice.logicOperator || 'AND'} 
                                      onChange={(e) => updateChoice(choice.id, { logicOperator: e.target.value as 'AND' | 'OR' })}
                                      className="bg-transparent text-[10px] font-black text-indigo-400 outline-none cursor-pointer uppercase"
                                    >
                                       <option value="AND">И (ВСЕ)</option>
                                       <option value="OR">ИЛИ (ЛЮБОЕ)</option>
                                    </select>
                                 </div>
                              </div>
                              <button onClick={() => addCondition(choice.id)} className="text-[10px] font-black text-slate-400 hover:text-white"><Plus size={12} /></button>
                            </div>
                            <div className="space-y-2">
                              {choice.conditions.map(cond => (
                                <ConditionRow key={cond.id} cond={cond} project={project} onUpdate={(upd) => updateRuleItem(choice.id, cond.id, 'conditions', upd)} onRemove={() => removeRuleItem(choice.id, cond.id, 'conditions')} />
                              ))}
                            </div>
                          </section>

                          <section className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2"><Zap size={14} /> ТО (ДЕЙСТВИЯ)</h4>
                              <button onClick={() => addAction(choice.id)} className="text-[10px] font-black text-slate-400 hover:text-white"><Plus size={12} /></button>
                            </div>
                            <div className="space-y-2">
                              {choice.actions.map(act => (
                                <ActionRow key={act.id} action={act} project={project} onUpdate={(upd) => updateRuleItem(choice.id, act.id, 'actions', upd)} onRemove={() => removeRuleItem(choice.id, act.id, 'actions')} onOpenLibrary={() => setShowLibraryModal({ type: 'action_audio', choiceId: choice.id, listKey: 'actions', itemId: act.id })} />
                              ))}
                            </div>
                          </section>
                          <button onClick={() => removeChoice(choice.id)} className="w-full py-2 bg-red-500/10 text-red-500 text-[10px] font-black uppercase rounded-xl hover:bg-red-500 hover:text-white transition-all">Удалить выбор</button>
                        </div>
                      )}
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className={`relative flex transition-all duration-300 ${isConfigPanelOpen ? 'w-80' : 'w-12'}`}>
         <button 
           onClick={() => setIsConfigPanelOpen(!isConfigPanelOpen)}
           className="absolute left-0 top-1/2 -translate-x-1/2 w-8 h-24 bg-slate-800 border border-white/5 rounded-full flex flex-col items-center justify-center text-indigo-400 hover:text-white transition-all z-50 shadow-2xl"
         >
           {isConfigPanelOpen ? <ChevronRight size={20}/> : <ChevronLeft size={20}/>}
           <Settings2 size={14} className="mt-2" />
         </button>

         <div className={`w-full h-full bg-slate-900/40 overflow-y-auto custom-scrollbar p-6 space-y-10 shadow-inner ${isConfigPanelOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <section className="space-y-5">
               <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><ImageIcon size={14} /> ВИЗУАЛ</h3>
               <div className="group relative aspect-video bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                  {scene.backgroundUrl ? <img src={scene.backgroundUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110" /> : <div className="w-full h-full flex items-center justify-center text-slate-800 font-black text-[10px] uppercase text-center p-2">Без фона</div>}
                  <button onClick={() => setShowLibraryModal({ type: 'bg' })} className="absolute inset-0 bg-indigo-950/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-white font-black text-[9px] uppercase tracking-widest gap-2">
                     МЕДИАТЕКА
                  </button>
               </div>
            </section>

            <section className="space-y-5">
               <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Music size={14} /> ЗВУК</h3>
               <div className="flex items-center gap-3 bg-slate-950 p-4 border border-slate-800 rounded-2xl">
                  <Volume2 size={16} className="text-indigo-500 shrink-0" />
                  <span className="flex-1 text-[9px] font-black text-slate-400 truncate uppercase">
                     {scene.ambientUrl ? "Активен" : "Тишина"}
                  </span>
                  <button onClick={() => setShowLibraryModal({ type: 'ambient' })} className="p-2 bg-indigo-600/10 text-indigo-400 rounded-lg hover:bg-indigo-600 hover:text-white transition-all">
                     <FolderOpen size={14} />
                  </button>
               </div>
            </section>

            <section className="space-y-5">
               <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Folder size={14} /> ОРГАНИЗАЦИЯ</h3>
               <div className="space-y-2">
                  <label className="text-[8px] font-black text-slate-600 uppercase">Папка сцены</label>
                  <input type="text" value={scene.folder || ''} onChange={(e) => updateScene(scene.id, { folder: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-[10px] font-black text-indigo-400 outline-none focus:border-indigo-500/50 shadow-inner" placeholder="ПАПКА (Main)" />
               </div>
               <button onClick={() => { if(confirm('Удалить сцену навсегда?')) deleteScene(scene.id); }} className="w-full py-3 bg-red-600/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase rounded-xl hover:bg-red-600 hover:text-white transition-all">
                  УДАЛИТЬ СЦЕНУ
               </button>
            </section>
         </div>
      </div>

      {showLibraryModal && (
        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-12 animate-in fade-in duration-300">
           <div className="w-full h-full bg-slate-950 border border-white/5 rounded-[3rem] shadow-2xl flex flex-col relative overflow-hidden">
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                 <h3 className="text-xs font-black text-indigo-400 uppercase tracking-[0.5em]">Выбор ресурса</h3>
                 <button onClick={() => setShowLibraryModal(null)} className="p-2 bg-slate-900 hover:bg-slate-800 rounded-full text-white transition-all"><X size={24} /></button>
              </div>
              <MediaLibrary onSelect={handleLibrarySelect} />
           </div>
        </div>
      )}
    </div>
  );
};

const ConditionRow: React.FC<{ cond: RuleCondition, project: any, onUpdate: (u: any) => void, onRemove: () => void }> = ({ cond, project, onUpdate, onRemove }) => {
  return (
    <div className="flex items-center gap-3 p-3 bg-slate-800/40 rounded-xl border border-slate-700/50 group shadow-sm">
      <select 
        value={cond.type} 
        onChange={(e) => {
          const nextType = e.target.value as ConditionType;
          let nextOp: ConditionOperator = 'eq';
          if (nextType === 'item') nextOp = 'has';
          if (nextType === 'scene') nextOp = 'at_scene';
          if (nextType === 'quest') nextOp = 'quest_status';
          onUpdate({ type: nextType, operator: nextOp, targetId: '', value: nextType === 'quest' ? 'active' : (nextType === 'variable' ? 0 : '') });
        }} 
        className="bg-slate-900 text-[10px] font-black text-slate-300 p-2 rounded-lg outline-none w-32 border border-slate-700 shadow-inner"
      >
        <option value="variable">Данные</option>
        <option value="item">Предмет</option>
        <option value="relationship">Отношение</option>
        <option value="quest">Квест</option>
        <option value="scene">Местоположение</option>
      </select>
      
      <select value={cond.targetId} onChange={(e) => onUpdate({ targetId: e.target.value })} className="flex-1 bg-slate-950 text-[10px] p-2 rounded-lg outline-none font-bold text-indigo-400 border border-slate-800 shadow-inner">
        <option value="">Выберите цель...</option>
        {cond.type === 'variable' && project.variables.map((v: any) => <option key={v.id} value={v.id}>{v.name}</option>)}
        {cond.type === 'item' && project.items.map((i: any) => <option key={i.id} value={i.id}>{i.name}</option>)}
        {cond.type === 'relationship' && project.characters.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
        {cond.type === 'quest' && project.quests.map((q: any) => <option key={q.id} value={q.id}>{q.name}</option>)}
        {cond.type === 'scene' && project.scenes.map((s: any) => <option key={s.id} value={s.id}>{s.title}</option>)}
      </select>
      
      <ConditionOperatorSelector condition={cond} onUpdate={(op) => onUpdate({ operator: op })} />
      <ConditionValueInput condition={cond} onUpdate={(val) => onUpdate({ value: val })} />
      <button onClick={onRemove} className="p-2 text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={14} /></button>
    </div>
  );
};

const ConditionOperatorSelector: React.FC<{ condition: RuleCondition, onUpdate: (op: any) => void }> = ({ condition, onUpdate }) => {
  if (condition.type === 'item') {
    return (
      <select value={condition.operator} onChange={(e) => onUpdate(e.target.value)} className="bg-slate-950 text-[10px] p-2 rounded-lg outline-none w-32 font-black text-amber-500 border border-slate-800">
        <option value="has">ЕСТЬ У ГЕРОЯ</option>
        <option value="has_not">ОТСУТСТВУЕТ</option>
      </select>
    );
  }
  if (condition.type === 'scene') {
    return (
      <select value={condition.operator} onChange={(e) => onUpdate(e.target.value)} className="bg-slate-950 text-[10px] p-2 rounded-lg outline-none w-32 font-black text-blue-400 border border-slate-800">
        <option value="at_scene">ТЕКУЩАЯ СЦЕНА</option>
      </select>
    );
  }
  if (condition.type === 'quest') {
    return (
      <select value={condition.operator} onChange={(e) => onUpdate(e.target.value)} className="bg-slate-950 text-[10px] p-2 rounded-lg outline-none w-32 font-black text-purple-400 border border-slate-800">
        <option value="quest_status">В СОСТОЯНИИ</option>
      </select>
    );
  }
  return (
    <select value={condition.operator} onChange={(e) => onUpdate(e.target.value)} className="bg-slate-900 text-[10px] p-2 rounded-lg outline-none w-14 border border-slate-700">
      <option value="eq">=</option>
      <option value="gt">&gt;</option>
      <option value="lt">&lt;</option>
    </select>
  );
};

const ConditionValueInput: React.FC<{ condition: RuleCondition, onUpdate: (val: any) => void }> = ({ condition, onUpdate }) => {
  if (condition.type === 'item' || condition.type === 'scene') return null;
  if (condition.type === 'quest') {
    return (
      <select value={condition.value as string} onChange={(e) => onUpdate(e.target.value)} className="bg-slate-900 text-[10px] p-2 rounded-lg outline-none border border-slate-700 font-black text-slate-300">
        <option value="not_started">Не начато</option>
        <option value="active">В процессе</option>
        <option value="completed">Успех</option>
        <option value="failed">Провал</option>
      </select>
    );
  }
  return (
    <input type="text" value={condition.value as string} onChange={(e) => onUpdate(e.target.value)} className="w-20 bg-slate-900 text-[10px] p-2 rounded-lg outline-none border border-slate-700 focus:border-indigo-500 font-mono text-center text-indigo-400 shadow-inner" />
  );
};

const ActionRow: React.FC<{ action: RuleAction, project: any, onUpdate: (upd: any) => void, onRemove: () => void, onOpenLibrary?: () => void }> = ({ action, project, onUpdate, onRemove, onOpenLibrary }) => {
  return (
    <div className="flex items-center gap-3 p-3 bg-slate-800/40 rounded-xl border border-slate-700/50 group shadow-sm">
      <select value={action.type} onChange={(e) => onUpdate({ type: e.target.value, targetId: '', value: 0 })} className="bg-slate-900 text-[10px] font-black text-slate-300 p-2 rounded-lg outline-none w-36 border border-slate-700 shadow-inner">
        <option value="change_scene">Перейти к сцене</option>
        <option value="give_item">Дать предмет</option>
        <option value="remove_item">Удалить предмет</option>
        <option value="mod_variable">Изменить отношение</option>
        <option value="start_quest">Выдать квест</option>
        <option value="join_party">В группу (спутник)</option>
        <option value="leave_party">Покинуть группу</option>
        <option value="play_sound">Включить саундтрек</option>
        <option value="stop_sound">Тишина (Stop)</option>
      </select>
      
      {action.type === 'change_scene' && <select className="bg-slate-950 text-[10px] p-2 rounded-lg outline-none flex-1 font-bold text-indigo-400 border border-slate-800 shadow-inner" value={action.targetId} onChange={(e) => onUpdate({ targetId: e.target.value })}><option value="">Выберите сцену...</option>{project.scenes.map((s: any) => <option key={s.id} value={s.id}>{s.title}</option>)}</select>}
      
      {action.type === 'mod_variable' && <select className="bg-slate-950 text-[10px] p-2 rounded-lg outline-none flex-1 font-bold text-indigo-400 border border-slate-800 shadow-inner" value={action.targetId} onChange={(e) => onUpdate({ targetId: e.target.value })}><option value="">Какой лор...</option>{project.variables.map((v: any) => <option key={v.id} value={v.id}>{v.name}</option>)}</select>}
      
      {(action.type === 'give_item' || action.type === 'remove_item') && <select className="bg-slate-950 text-[10px] p-2 rounded-lg outline-none flex-1 font-bold text-indigo-400 border border-slate-800 shadow-inner" value={action.targetId} onChange={(e) => onUpdate({ targetId: e.target.value })}><option value="">Какой предмет...</option>{project.items.map((i: any) => <option key={i.id} value={i.id}>{i.name}</option>)}</select>}
      
      {action.type === 'start_quest' && <select className="bg-slate-950 text-[10px] p-2 rounded-lg outline-none flex-1 font-bold text-indigo-400 border border-slate-800 shadow-inner" value={action.targetId} onChange={(e) => onUpdate({ targetId: e.target.value })}><option value="">Линия квеста...</option>{project.quests.map((q: any) => <option key={q.id} value={q.id}>{q.name}</option>)}</select>}
      
      {(action.type === 'join_party' || action.type === 'leave_party') && <select className="bg-slate-950 text-[10px] p-2 rounded-lg outline-none flex-1 font-bold text-indigo-400 border border-slate-800 shadow-inner" value={action.targetId} onChange={(e) => onUpdate({ targetId: e.target.value })}><option value="">Персонаж...</option>{project.characters.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>}
      
      {action.type === 'play_sound' && (
        <button onClick={onOpenLibrary} className="flex-1 bg-slate-950 text-[9px] p-2 rounded-lg text-indigo-400 font-black border border-slate-800 hover:border-indigo-500 truncate transition-all shadow-inner uppercase tracking-tighter">
           {action.targetId ? "Трек выбран (Клик для смены)" : "Выбрать из банка звуков..."}
        </button>
      )}

      {action.type === 'mod_variable' && <input type="number" value={action.value as number} onChange={(e) => onUpdate({ value: Number(e.target.value) })} className="w-16 bg-slate-950 text-[10px] p-2 rounded-lg outline-none border border-slate-800 text-center font-mono text-emerald-400 shadow-inner" />}
      <button onClick={onRemove} className="p-2 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-colors"><Trash2 size={14}/></button>
    </div>
  );
};

export default SceneEditor;
