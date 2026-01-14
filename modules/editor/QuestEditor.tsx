
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { translations } from '../../translations';
import { Quest, QuestStage, RuleAction, RuleCondition, ActionType, ConditionOperator, ConditionType } from '../../types';
import { 
  BookOpen, Plus, Trash2, Search, Zap, ChevronDown, GitBranch, List, ArrowRight, ShieldCheck, X, Settings2, Target, CheckSquare, Square, Magnet, FileText, AlignLeft, Users
} from 'lucide-react';

const GRID_SIZE = 24;

const QuestEditor: React.FC = () => {
  const { 
    project, selectedQuestId, selectQuest, addQuest, updateQuest, deleteQuest, 
    addQuestStage, updateQuestStage, deleteQuestStage, updateQuestStagesPositions, language, updateSettings
  } = useStore();
  const t = translations[language].questsEditor;
  
  const [searchQuery, setSearchQuery] = useState('');
  const q = project.quests.find(item => item.id === selectedQuestId);
  const [editingStageId, setEditingStageId] = useState<string | null>(null);
  const [snapToGrid, setSnapToGrid] = useState(true);

  // Graph logic
  const graphRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragInfo = useRef<{ startX: number; startY: number; initialPos: { x: number; y: number }; stageId: string } | null>(null);

  const filteredQuests = project.quests.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStageMouseDown = (e: React.MouseEvent, stageId: string) => {
    e.stopPropagation();
    const stage = q?.stages.find(s => s.id === stageId);
    if (!stage) return;
    
    dragInfo.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialPos: { ...stage.position },
      stageId
    };
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && dragInfo.current && selectedQuestId) {
        const dx = e.clientX - dragInfo.current.startX;
        const dy = e.clientY - dragInfo.current.startY;
        let nx = dragInfo.current.initialPos.x + dx;
        let ny = dragInfo.current.initialPos.y + dy;
        
        if (snapToGrid) {
          nx = Math.round(nx / GRID_SIZE) * GRID_SIZE;
          ny = Math.round(ny / GRID_SIZE) * GRID_SIZE;
        }

        updateQuestStagesPositions(selectedQuestId, [{ id: dragInfo.current.stageId, position: { x: nx, y: ny } }]);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      dragInfo.current = null;
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, selectedQuestId, snapToGrid, updateQuestStagesPositions]);

  const toggleNextStage = (stageId: string, targetStageId: string) => {
    if (!q) return;
    const stage = q.stages.find(s => s.id === stageId);
    if (!stage) return;
    const nextIds = [...stage.nextStageIds];
    const idx = nextIds.indexOf(targetStageId);
    if (idx > -1) nextIds.splice(idx, 1);
    else nextIds.push(targetStageId);
    updateQuestStage(q.id, stageId, { nextStageIds: nextIds });
  };

  const addCondition = (stageId: string) => {
    if (!q) return;
    const stage = q.stages.find(s => s.id === stageId);
    if (!stage) return;
    const newCond: RuleCondition = { id: `qc_${Date.now()}`, type: 'variable', operator: 'eq', value: 0 };
    updateQuestStage(q.id, stageId, { conditions: [...stage.conditions, newCond] });
  };

  const addAction = (stageId: string) => {
    if (!q) return;
    const stage = q.stages.find(s => s.id === stageId);
    if (!stage) return;
    const newAction: RuleAction = { id: `qa_${Date.now()}`, type: 'mod_variable', value: 1 };
    updateQuestStage(q.id, stageId, { completionActions: [...stage.completionActions, newAction] });
  };

  const removeRow = (stageId: string, rowId: string, listKey: 'conditions' | 'completionActions') => {
    if (!q) return;
    const stage = q.stages.find(s => s.id === stageId);
    if (!stage) return;
    const newList = (stage[listKey] as any[]).filter(i => i.id !== rowId);
    updateQuestStage(q.id, stageId, { [listKey]: newList });
  };

  const updateRow = (stageId: string, rowId: string, listKey: 'conditions' | 'completionActions', updates: any) => {
    if (!q) return;
    const stage = q.stages.find(s => s.id === stageId);
    if (!stage) return;
    const newList = (stage[listKey] as any[]).map(i => i.id === rowId ? { ...i, ...updates } : i);
    updateQuestStage(q.id, stageId, { [listKey]: newList });
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-slate-950">
      <div className="w-80 border-r border-slate-800 bg-slate-900/30 flex flex-col p-6 space-y-6 z-20">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <BookOpen size={14} /> КВЕСТЫ ({project.quests.length})
          </h3>
          <button onClick={addQuest} className="text-indigo-400 hover:text-white transition-transform active:scale-90 p-1">
            <Plus size={18} />
          </button>
        </div>

        <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700 space-y-3">
           <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-[9px] font-black text-slate-500 uppercase group-hover:text-indigo-400 transition-colors tracking-tight">Отображать в HUD</span>
              <input 
                type="checkbox" 
                checked={project.settings.hudQuestsEnabled} 
                onChange={e => updateSettings({ hudQuestsEnabled: e.target.checked })}
                className="w-3 h-3 rounded bg-slate-900 border-slate-700 text-indigo-500 focus:ring-0"
              />
           </label>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
          <input 
            type="text" 
            placeholder="Поиск..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2 pl-9 pr-4 text-xs text-slate-200 outline-none focus:border-indigo-500 transition-all shadow-inner"
          />
        </div>
        
        <div className="space-y-1 overflow-y-auto flex-1 custom-scrollbar pr-1">
          <button onClick={() => selectQuest(null)} className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between group ${!selectedQuestId ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}>
            <div className="flex items-center gap-2"><List size={14} /> Все сюжеты</div>
          </button>
          {filteredQuests.map(item => (
            <div key={item.id} className="relative group">
              <button 
                onClick={() => selectQuest(item.id)}
                className={`w-full text-left px-3 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${selectedQuestId === item.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm">{item.icon}</span>
                  <span className="truncate max-w-[120px]">{item.name}</span>
                </div>
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); if(confirm(`Удалить квест "${item.name}"?`)) deleteQuest(item.id); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-red-500/0 group-hover:text-red-500/50 hover:text-red-500 transition-all bg-slate-900/80 rounded-lg"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {!q ? (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-700">
           <BookOpen size={80} strokeWidth={1} className="opacity-10 mb-6" />
           <h2 className="text-lg font-black uppercase tracking-[0.5em] opacity-30">Выберите Сюжетную Линию</h2>
        </div>
      ) : (
        <div className="flex-1 relative flex flex-col overflow-hidden">
          <div className="absolute top-6 left-6 right-6 z-10 flex flex-col gap-4 pointer-events-none">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-6 pointer-events-auto bg-slate-900/95 backdrop-blur-xl border border-white/10 p-4 rounded-[2rem] shadow-2xl">
                <div className="flex items-center gap-4">
                    <span className="text-3xl">{q.icon}</span>
                    <input 
                      value={q.name} 
                      onChange={e => updateQuest(q.id, { name: e.target.value })} 
                      className="bg-transparent text-xl font-black text-white outline-none w-48 border-b border-transparent focus:border-indigo-500/30" 
                      placeholder="Название квеста"
                    />
                </div>
                <div className="w-px h-8 bg-white/10" />
                <button onClick={() => setSnapToGrid(!snapToGrid)} className={`p-2 rounded-xl transition-all ${snapToGrid ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-500 hover:bg-slate-800'}`}>
                  <Magnet size={18} />
                </button>
                <button onClick={() => addQuestStage(q.id)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black rounded-xl transition-all shadow-lg pointer-events-auto">
                  <Plus size={14} /> ДОБАВИТЬ ЭТАП
                </button>
              </div>
              
              <div className="pointer-events-auto">
                <button 
                  onClick={() => { if(confirm('Удалить этот квест?')) deleteQuest(q.id); }}
                  className="p-3 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white rounded-2xl transition-all border border-red-500/20 shadow-xl"
                >
                  <Trash2 size={24} />
                </button>
              </div>
            </div>

            <div className="pointer-events-auto max-w-xl bg-slate-900/80 backdrop-blur-md border border-white/5 p-4 rounded-2xl shadow-xl flex items-start gap-4 animate-in slide-in-from-top-4">
                <AlignLeft size={16} className="text-indigo-400 mt-1 shrink-0" />
                <textarea 
                  value={q.description} 
                  onChange={e => updateQuest(q.id, { description: e.target.value })}
                  placeholder="Общее описание сюжета этой линии..."
                  className="w-full bg-transparent text-xs text-slate-400 font-medium outline-none resize-none h-12 custom-scrollbar"
                />
            </div>
          </div>

          <div 
            ref={graphRef}
            className="flex-1 w-full h-full bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] relative overflow-auto cursor-grab active:cursor-grabbing"
          >
             <div className="min-w-[3000px] min-h-[3000px] relative pointer-events-none">
                <svg className="absolute inset-0 w-full h-full overflow-visible">
                   <defs>
                      <marker id="q-arrow" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orientation="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="#6366f1" />
                      </marker>
                   </defs>
                   {q.stages.flatMap(stage => 
                      stage.nextStageIds.map(targetId => {
                        const target = q.stages.find(s => s.id === targetId);
                        if (!target) return null;
                        return (
                          <path 
                            key={`${stage.id}-${targetId}`}
                            d={`M ${stage.position.x + 100} ${stage.position.y + 60} L ${target.position.x + 100} ${target.position.y}`}
                            stroke="#6366f1"
                            strokeWidth="2"
                            fill="none"
                            markerEnd="url(#q-arrow)"
                            className="opacity-40 transition-all hover:opacity-100"
                          />
                        );
                      })
                   )}
                </svg>

                {q.stages.map((stage, idx) => (
                  <div 
                    key={stage.id}
                    onMouseDown={(e) => handleStageMouseDown(e, stage.id)}
                    className={`absolute w-52 bg-slate-900 border-2 rounded-2xl p-4 shadow-2xl pointer-events-auto select-none transition-all group ${
                      editingStageId === stage.id ? 'border-indigo-500 ring-4 ring-indigo-500/20 scale-105 z-30' : 'border-slate-800 hover:border-slate-700 z-10'
                    }`}
                    style={{ left: stage.position.x, top: stage.position.y }}
                  >
                     <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                           <GitBranch size={10} className="text-slate-500" />
                           <span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">STAGE_{idx+1}</span>
                        </div>
                        <div className="flex items-center gap-1">
                           <button onClick={(e) => { e.stopPropagation(); setEditingStageId(editingStageId === stage.id ? null : stage.id); }} className="p-1 text-slate-600 hover:text-indigo-400"><Settings2 size={12}/></button>
                           <button onClick={(e) => { e.stopPropagation(); if(confirm('Удалить этап?')) deleteQuestStage(q.id, stage.id); }} className="p-1 text-slate-600 hover:text-red-500"><Trash2 size={12}/></button>
                        </div>
                     </div>
                     <h4 className="text-[11px] font-bold text-white truncate group-hover:text-indigo-300 transition-colors mb-2">{stage.title || 'Безымянный этап'}</h4>
                     
                     <div className="flex flex-wrap gap-1 mt-3">
                        {stage.nextStageIds.length > 0 && (
                          <div className="px-1.5 py-0.5 bg-indigo-500/10 text-indigo-400 text-[7px] font-black rounded uppercase">
                             Next: {stage.nextStageIds.length}
                          </div>
                        )}
                        <div className={`px-1.5 py-0.5 text-[7px] font-black rounded uppercase ${stage.type === 'dialogue' ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                           {stage.type}
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </div>

          {editingStageId && (
             <div className="absolute top-0 right-0 bottom-0 w-[450px] bg-slate-900/95 backdrop-blur-xl border-l border-white/5 p-8 overflow-y-auto z-40 shadow-2xl animate-in slide-in-from-right duration-300 custom-scrollbar">
                <div className="flex items-center justify-between mb-8">
                   <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2"><Target size={16} /> ИНСПЕКТОР ЭТАПА</h3>
                   <button onClick={() => setEditingStageId(null)} className="p-2 text-slate-500 hover:text-white"><X size={20}/></button>
                </div>

                {(() => {
                   const stage = q.stages.find(s => s.id === editingStageId);
                   if (!stage) return null;
                   return (
                      <div className="space-y-8 pb-10">
                         <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2">
                                <FileText size={12} /> Заголовок
                            </label>
                            <input 
                              value={stage.title} 
                              onChange={e => updateQuestStage(q.id, stage.id, { title: e.target.value })} 
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white font-bold outline-none focus:border-indigo-500" 
                            />
                         </div>

                         <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2">
                                <AlignLeft size={12} /> Описание этапа
                            </label>
                            <textarea 
                              value={stage.description} 
                              onChange={e => updateQuestStage(q.id, stage.id, { description: e.target.value })} 
                              placeholder="Что должен сделать игрок на этом этапе?"
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-300 outline-none focus:border-indigo-500 min-h-[100px] resize-none custom-scrollbar"
                            />
                         </div>

                         <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2">
                                <Zap size={12} /> Тип задачи
                            </label>
                            <select value={stage.type} onChange={e => updateQuestStage(q.id, stage.id, { type: e.target.value as any })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-indigo-400 font-bold outline-none">
                               <option value="dialogue">💬 Диалог</option>
                               <option value="collect">🎒 Сбор</option>
                               <option value="reach_location">📍 Локация</option>
                               <option value="variable_check">⚙️ Логика</option>
                            </select>
                         </div>

                         <div className="space-y-6">
                            <div className="space-y-3">
                               <div className="flex items-center justify-between border-b border-white/5 pb-2">
                                  <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                                     <ShieldCheck size={14}/> ЕСЛИ (УСЛОВИЯ ЗАВЕРШЕНИЯ)
                                  </label>
                                  <button onClick={() => addCondition(stage.id)} className="p-1 text-slate-500 hover:text-indigo-400"><Plus size={16}/></button>
                               </div>
                               <div className="space-y-2">
                                  {stage.conditions.map(c => (
                                     <div key={c.id} className="p-3 bg-slate-950/50 border border-slate-800 rounded-xl space-y-3">
                                        <div className="flex items-center gap-2">
                                           <select 
                                              value={c.type} 
                                              onChange={e => updateRow(stage.id, c.id, 'conditions', { type: e.target.value as ConditionType, targetId: '', operator: (e.target.value === 'item' ? 'has' : 'eq') })}
                                              className="bg-slate-900 text-[10px] font-black text-slate-400 p-1.5 rounded outline-none border border-slate-800"
                                           >
                                              <option value="variable">Данные</option>
                                              <option value="item">Предмет</option>
                                              <option value="scene">Сцена</option>
                                              <option value="relationship">Отношение</option>
                                           </select>
                                           <select 
                                              value={c.targetId} 
                                              onChange={e => updateRow(stage.id, c.id, 'conditions', { targetId: e.target.value })}
                                              className="flex-1 bg-slate-900 text-[10px] font-bold text-indigo-400 p-1.5 rounded outline-none border border-slate-800"
                                           >
                                              <option value="">Цель...</option>
                                              {c.type === 'variable' && project.variables.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                                              {c.type === 'item' && project.items.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                                              {c.type === 'scene' && project.scenes.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                                              {c.type === 'relationship' && project.characters.map(ch => <option key={ch.id} value={ch.id}>{ch.name}</option>)}
                                           </select>
                                           <button onClick={() => removeRow(stage.id, c.id, 'conditions')} className="text-slate-600 hover:text-red-500"><Trash2 size={12}/></button>
                                        </div>
                                        <div className="flex items-center gap-2">
                                           <select 
                                              value={c.operator} 
                                              onChange={e => updateRow(stage.id, c.id, 'conditions', { operator: e.target.value as ConditionOperator })}
                                              className="bg-slate-900 text-[10px] font-black text-slate-200 p-1.5 rounded outline-none border border-slate-800"
                                           >
                                              {c.type === 'item' ? (
                                                 <><option value="has">ЕСТЬ</option><option value="has_not">НЕТ</option></>
                                              ) : c.type === 'scene' ? (
                                                 <option value="at_scene">НА СЦЕНЕ</option>
                                              ) : (
                                                 <><option value="eq">=</option><option value="gt">&gt;</option><option value="lt">&lt;</option></>
                                              )}
                                           </select>
                                           {(c.type === 'variable' || c.type === 'relationship') && (
                                              <input 
                                                 value={c.value as any} 
                                                 onChange={e => updateRow(stage.id, c.id, 'conditions', { value: e.target.value })}
                                                 className="flex-1 bg-slate-900 text-[10px] font-mono p-1.5 rounded border border-slate-800 outline-none text-emerald-400"
                                                 placeholder="Значение..."
                                              />
                                           )}
                                        </div>
                                     </div>
                                  ))}
                               </div>
                            </div>

                            <div className="space-y-3">
                               <div className="flex items-center justify-between border-b border-white/5 pb-2">
                                  <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                                     <Zap size={14}/> ТО (ДЕЙСТВИЯ ПРИ ЗАВЕРШЕНИИ)
                                  </label>
                                  <button onClick={() => addAction(stage.id)} className="p-1 text-slate-500 hover:text-emerald-400"><Plus size={16}/></button>
                               </div>
                               <div className="space-y-2">
                                  {stage.completionActions.map(a => (
                                     <div key={a.id} className="p-3 bg-slate-950/50 border border-slate-800 rounded-xl space-y-3">
                                        <div className="flex items-center gap-2">
                                           <select 
                                              value={a.type} 
                                              onChange={e => updateRow(stage.id, a.id, 'completionActions', { type: e.target.value as ActionType, targetId: '', value: 0 })}
                                              className="bg-slate-900 text-[10px] font-black text-slate-400 p-1.5 rounded outline-none border border-slate-800 w-32"
                                           >
                                              <option value="mod_variable">Изм. данные</option>
                                              <option value="give_item">Дать предмет</option>
                                              <option value="join_party">В группу</option>
                                              <option value="leave_party">Персонаж убыл</option>
                                              <option value="end_quest">Завершить квест</option>
                                              <option value="fail_quest">Провалить квест</option>
                                           </select>
                                           <select 
                                              value={a.targetId} 
                                              onChange={e => updateRow(stage.id, a.id, 'completionActions', { targetId: e.target.value })}
                                              className="flex-1 bg-slate-900 text-[10px] font-bold text-emerald-400 p-1.5 rounded outline-none border border-slate-800"
                                           >
                                              <option value="">Цель...</option>
                                              {a.type === 'mod_variable' && project.variables.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                                              {a.type === 'give_item' && project.items.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                                              {(a.type === 'join_party' || a.type === 'leave_party') && project.characters.map(ch => <option key={ch.id} value={ch.id}>{ch.name}</option>)}
                                              {(a.type === 'end_quest' || a.type === 'fail_quest') && <option value={q.id}>{q.name}</option>}
                                           </select>
                                           <button onClick={() => removeRow(stage.id, a.id, 'completionActions')} className="text-slate-600 hover:text-red-500"><Trash2 size={12}/></button>
                                        </div>
                                        {a.type === 'mod_variable' && (
                                           <input 
                                              type="number"
                                              value={a.value as any}
                                              onChange={e => updateRow(stage.id, a.id, 'completionActions', { value: Number(e.target.value) })}
                                              className="w-full bg-slate-900 text-[10px] font-mono p-1.5 rounded border border-slate-800 outline-none text-emerald-400"
                                              placeholder="Смещение..."
                                           />
                                        )}
                                     </div>
                                  ))}
                               </div>
                            </div>
                         </div>

                         <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2">
                               <ArrowRight size={14} className="text-indigo-400"/> ПЕРЕХОДЫ НА СЛЕДУЮЩИЕ ЭТАПЫ
                            </label>
                            <div className="grid grid-cols-1 gap-2">
                               {q.stages.filter(s => s.id !== stage.id).map(target => (
                                  <button 
                                    key={target.id}
                                    onClick={() => toggleNextStage(stage.id, target.id)}
                                    className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${stage.nextStageIds.includes(target.id) ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'}`}
                                  >
                                    {stage.nextStageIds.includes(target.id) ? <CheckSquare size={16}/> : <Square size={16}/>}
                                    <div className="min-w-0">
                                       <span className="text-[10px] font-bold uppercase truncate block">{target.title || 'Безымянный этап'}</span>
                                       <span className="text-[8px] opacity-40 uppercase tracking-tighter">ID: {target.id}</span>
                                    </div>
                                  </button>
                               ))}
                            </div>
                         </div>
                      </div>
                   )
                })()}
             </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestEditor;
