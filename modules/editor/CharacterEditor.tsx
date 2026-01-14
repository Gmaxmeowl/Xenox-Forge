import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { translations } from '../../translations';
import { Character, CharacterTrigger, RuleCondition, RuleAction, ConditionType, ActionType } from '../../types';
import { 
  Plus, Trash2, User, Smile, ShieldAlert, Zap, Layers, ChevronDown, 
  Search, ShieldCheck, Heart, UserPlus, LogOut, Info, Settings2, Ghost, RefreshCcw, Palette, Users, Monitor, Sparkles, Loader2
} from 'lucide-react';
import { getPollinationsUrl } from '../../pollinations.ts';

const CharacterEditor: React.FC = () => {
  const { project, selectedCharacterId, addCharacter, updateCharacter, deleteCharacter, selectCharacter, language, updateSettings } = useStore();
  const t = translations[language].editor;
  
  const [searchQuery, setSearchQuery] = useState('');
  const char = project.characters.find(c => c.id === selectedCharacterId);
  const [expandedTriggerId, setExpandedTriggerId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const filteredCharacters = project.characters.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const generateAiAvatar = async () => {
    if (!char) return;
    if (!char.name && !char.description) {
      alert("Сначала напишите имя или описание персонажа, чтобы ИИ знал, кого рисовать.");
      return;
    }

    setIsGenerating(true);
    try {
      // Use Pollinations.ai for professional character portraits
      const avatarContext = "Character portrait, game companion avatar, clean background, detailed face";
      const prompt = `Character: ${char.name}. Role: ${char.role}. Description: ${char.description}. ${avatarContext}`;
      
      const imageUrl = getPollinationsUrl(prompt, 512, 512);
      
      // Update character avatar with the generated URL
      updateCharacter(char.id, { avatar: imageUrl });
      
      // Small delay for UX feel
      await new Promise(resolve => setTimeout(resolve, 600));
    } catch (error) {
      console.error("AI Avatar Gen Error:", error);
      alert("Ошибка генерации аватара.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (project.characters.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-slate-600 bg-slate-950">
        <div className="p-12 border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center max-w-sm text-center">
          <User size={64} className="mb-6 opacity-20" />
          <h2 className="text-lg font-bold text-slate-400 mb-2">Нет персонажей</h2>
          <p className="text-xs text-slate-500 mb-6">Создайте первого персонажа (спутника) для начала работы</p>
          <button onClick={addCharacter} className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-black transition-all shadow-xl shadow-indigo-500/20">
            <Plus size={18} /> СОЗДАТЬ ПЕРСОНАЖА
          </button>
        </div>
      </div>
    );
  }

  const addTrigger = () => {
    if (!char) return;
    const newTrigger: CharacterTrigger = {
      id: `trig_${Date.now()}`,
      name: 'Новый автотриггер',
      conditions: [],
      actions: [],
      isOneTime: true,
      priority: 0
    };
    updateCharacter(char.id, { triggers: [...char.triggers, newTrigger] });
    setExpandedTriggerId(newTrigger.id);
  };

  const updateTrigger = (trigId: string, updates: Partial<CharacterTrigger>) => {
    if (!char) return;
    const newTriggers = char.triggers.map(t => t.id === trigId ? { ...t, ...updates } : t);
    updateCharacter(char.id, { triggers: newTriggers });
  };

  const removeTrigger = (trigId: string) => {
    if (!char) return;
    updateCharacter(char.id, { triggers: char.triggers.filter(t => t.id !== trigId) });
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-slate-950">
      <div className="w-80 border-r border-slate-800 bg-slate-900/30 flex flex-col p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <Users size={14} /> Спутники ({project.characters.length})
          </h3>
          <button onClick={addCharacter} className="text-indigo-400 hover:text-white transition-transform active:scale-90">
            <Plus size={16} />
          </button>
        </div>

        <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700 space-y-3">
           <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-[9px] font-black text-slate-500 uppercase group-hover:text-indigo-400 transition-colors">Отображать в HUD</span>
              <input 
                type="checkbox" 
                checked={project.settings.hudCompanionsEnabled} 
                onChange={e => updateSettings({ hudCompanionsEnabled: e.target.checked })}
                className="w-3 h-3 rounded bg-slate-900 border-slate-700 text-indigo-500 focus:ring-0"
              />
           </label>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
          <input 
            type="text" 
            placeholder="Поиск спутника..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2 pl-9 pr-4 text-xs text-slate-200 outline-none focus:border-indigo-500/50 transition-all shadow-inner"
          />
        </div>
        
        <div className="space-y-1 overflow-y-auto flex-1 custom-scrollbar pr-1">
          <button 
            onClick={() => selectCharacter(null)}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between group ${!selectedCharacterId ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            Все персонажи
          </button>
          {filteredCharacters.map(c => (
            <button 
              key={c.id}
              onClick={() => selectCharacter(c.id)}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between group ${
                selectedCharacterId === c.id 
                  ? 'bg-indigo-600 text-white shadow-lg' 
                  : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <User size={14} className={selectedCharacterId === c.id ? 'text-indigo-200' : 'text-indigo-500'} />
                <span className="truncate max-w-[120px]">{c.name}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[8px] px-1.5 py-0.5 rounded bg-slate-950/40 text-slate-500 font-black">
                   {c.triggers.length}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {!char ? (
        <div className="flex-1 p-8 overflow-y-auto bg-slate-950">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-widest text-white">Все спутники</h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase mt-1 tracking-widest">Персонажи, которых игрок может встретить в истории</p>
            </div>
            <button onClick={addCharacter} className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black rounded-xl transition-all shadow-xl shadow-indigo-500/10">
              <Plus size={16} /> ДОБАВИТЬ СПУТНИКА
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCharacters.map(c => (
              <div 
                key={c.id} 
                onClick={() => selectCharacter(c.id)}
                className="p-5 bg-slate-900/40 border border-slate-800 rounded-3xl flex flex-col gap-4 hover:border-indigo-500/50 cursor-pointer transition-all group relative overflow-hidden shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div 
                       className="w-12 h-12 rounded-xl flex items-center justify-center shadow-2xl border-2 overflow-hidden" 
                       style={{ backgroundColor: `${c.colorTag}20`, borderColor: c.colorTag }}
                    >
                      <img src={c.avatar} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-black text-white uppercase truncate w-32 group-hover:text-indigo-400 transition-colors">{c.name}</p>
                      <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">{c.role}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-indigo-400">{c.initialRelationship}%</span>
                    <span className="text-[8px] text-slate-700 uppercase font-bold tracking-tighter">ЛОЯЛЬНОСТЬ</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 h-8 leading-relaxed italic">"{c.description || "Нет описания..."}"</p>
                <div className="flex items-center justify-between border-t border-slate-800/50 pt-4 mt-2">
                   <div className="flex items-center gap-2">
                      <Zap size={10} className="text-amber-500" />
                      <span className="text-[9px] font-black text-slate-500 uppercase">{c.triggers.length} триггеров</span>
                   </div>
                   <button className="p-1.5 bg-slate-800 rounded-lg text-slate-500 hover:text-white transition-colors">
                      <Layers size={12} />
                   </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 p-8 overflow-y-auto scroll-smooth">
          <div className="max-w-4xl mx-auto space-y-12">
            <section className="flex items-start gap-8">
              <div className="flex flex-col items-center gap-4 group">
                <div 
                  className={`w-32 h-32 rounded-3xl bg-slate-800 border-4 overflow-hidden shadow-2xl transition-all relative ${isGenerating ? 'opacity-50' : ''}`}
                  style={{ borderColor: char.colorTag }}
                >
                  <img src={char.avatar} className="w-full h-full object-cover" />
                  {isGenerating && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <Loader2 size={32} className="text-white animate-spin" />
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col gap-2 w-full">
                  <button 
                    disabled={isGenerating}
                    onClick={generateAiAvatar}
                    className="flex items-center justify-center gap-2 py-2 px-4 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 text-white text-[9px] font-black uppercase rounded-xl transition-all shadow-lg"
                  >
                    {isGenerating ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                    ОБЛИК ПО ИИ
                  </button>
                  <button 
                    onClick={() => updateCharacter(char.id, { avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}` })}
                    className="flex items-center justify-center gap-2 py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-[9px] font-black uppercase rounded-xl transition-all"
                  >
                    <RefreshCcw size={12} /> РАНДОМ
                  </button>
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-4">
                  <input 
                    value={char.name}
                    onChange={(e) => updateCharacter(char.id, { name: e.target.value })}
                    placeholder="Имя персонажа..."
                    className="bg-transparent text-3xl font-black text-white outline-none w-full border-b border-transparent focus:border-slate-800 transition-all uppercase"
                  />
                  <button onClick={() => { deleteCharacter(char.id); selectCharacter(null); }} className="p-2 text-slate-600 hover:text-red-500 transition-colors">
                    <Trash2 size={20} />
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <input 
                    value={char.role}
                    onChange={(e) => updateCharacter(char.id, { role: e.target.value })}
                    placeholder="Роль (например: Маг, Проводник)..."
                    className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-1.5 text-[10px] font-black text-indigo-400 uppercase tracking-widest outline-none shadow-inner"
                  />
                  <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5">
                     <Palette size={12} className="text-slate-500" />
                     <input 
                      type="color" 
                      value={char.colorTag}
                      onChange={(e) => updateCharacter(char.id, { colorTag: e.target.value })}
                      className="w-4 h-4 bg-transparent border-none rounded cursor-pointer"
                     />
                  </div>
                  <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-lg px-4 py-1.5">
                     <Heart size={12} className="text-rose-500" />
                     <span className="text-[10px] font-black text-slate-500 uppercase">Лояльность:</span>
                     <input 
                        type="number" 
                        min="0" max="100"
                        value={char.initialRelationship}
                        onChange={(e) => updateCharacter(char.id, { initialRelationship: Number(e.target.value) })}
                        className="w-12 bg-transparent text-[10px] font-black text-indigo-400 outline-none"
                     />
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Info size={14} /> ОПИСАНИЕ И ЛОР СПУТНИКА
              </h3>
              <textarea 
                value={char.description}
                onChange={(e) => updateCharacter(char.id, { description: e.target.value })}
                className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl p-6 text-sm leading-relaxed text-slate-300 outline-none focus:border-indigo-500/50 min-h-[120px] resize-none shadow-inner"
                placeholder="Расскажите историю этого спутника, его цели и мотивы..."
              />
            </section>

            <section className="space-y-6 pb-20">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Zap size={14} className="text-amber-400" /> АВТОМАТИЧЕСКИЕ ТРИГГЕРЫ
                </h3>
                <button onClick={addTrigger} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black rounded-xl transition-all shadow-lg">
                  <Plus size={14} /> ДОБАВИТЬ ТРИГГЕР
                </button>
              </div>

              <div className="space-y-4">
                {char.triggers.map((trigger, idx) => (
                  <div key={trigger.id} className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div 
                      onClick={() => setExpandedTriggerId(expandedTriggerId === trigger.id ? null : trigger.id)}
                      className="p-5 flex items-center gap-4 cursor-pointer hover:bg-white/5 transition-colors"
                    >
                      <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-[10px] font-black text-slate-500">{idx + 1}</div>
                      <input 
                        value={trigger.name}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => updateTrigger(trigger.id, { name: e.target.value })}
                        className="bg-transparent text-sm font-bold text-slate-100 outline-none flex-1"
                      />
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer" onClick={e => e.stopPropagation()}>
                           <span className="text-[9px] font-black text-slate-600 uppercase">Одноразовый</span>
                           <input 
                              type="checkbox" 
                              checked={trigger.isOneTime}
                              onChange={e => updateTrigger(trigger.id, { isOneTime: e.target.checked })}
                              className="w-3 h-3 rounded bg-slate-800 border-slate-700 text-indigo-500 focus:ring-0"
                           />
                        </label>
                        <button onClick={(e) => { e.stopPropagation(); removeTrigger(trigger.id); }} className="p-2 text-slate-600 hover:text-red-500 transition-colors"><Trash2 size={14}/></button>
                        <ChevronDown size={18} className={`text-slate-600 transition-transform ${expandedTriggerId === trigger.id ? 'rotate-180' : ''}`} />
                      </div>
                    </div>

                    {expandedTriggerId === trigger.id && (
                      <div className="p-6 bg-black/30 border-t border-slate-800 space-y-6">
                         <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-4">
                               <label className="text-[9px] font-black text-indigo-400 uppercase tracking-widest flex items-center justify-between">
                                  <span>УСЛОВИЯ (ЕСЛИ)</span>
                                  <button onClick={() => updateTrigger(trigger.id, { conditions: [...trigger.conditions, { id: `c_${Date.now()}`, type: 'relationship', operator: 'gt', value: 50 }] })} className="p-1 hover:text-indigo-400"><Plus size={12}/></button>
                               </label>
                               <div className="space-y-2">
                                  {trigger.conditions.map(c => (
                                    <ConditionRow 
                                      key={c.id} 
                                      condition={c} 
                                      project={project}
                                      characterId={char.id}
                                      onUpdate={(upd) => updateTrigger(trigger.id, { conditions: trigger.conditions.map(tc => tc.id === c.id ? { ...tc, ...upd } : tc) })}
                                      onRemove={() => updateTrigger(trigger.id, { conditions: trigger.conditions.filter(tc => tc.id !== c.id) })}
                                    />
                                  ))}
                                  {trigger.conditions.length === 0 && <p className="text-[10px] text-slate-700 italic uppercase">Нет условий (срабатывает всегда)</p>}
                               </div>
                            </div>
                            <div className="space-y-4">
                               <label className="text-[9px] font-black text-emerald-400 uppercase tracking-widest flex items-center justify-between">
                                  <span>ДЕЙСТВИЯ (ТО)</span>
                                  <button onClick={() => updateTrigger(trigger.id, { actions: [...trigger.actions, { id: `a_${Date.now()}`, type: 'mod_relationship', value: 10 }] })} className="p-1 hover:text-emerald-400"><Plus size={12}/></button>
                               </label>
                               <div className="space-y-2">
                                  {trigger.actions.map(a => (
                                    <ActionRow 
                                      key={a.id} 
                                      action={a} 
                                      project={project}
                                      onUpdate={(upd) => updateTrigger(trigger.id, { actions: trigger.actions.map(ta => ta.id === a.id ? { ...ta, ...upd } : ta) })}
                                      onRemove={() => updateTrigger(trigger.id, { actions: trigger.actions.filter(ta => ta.id !== a.id) })}
                                    />
                                  ))}
                                  {trigger.actions.length === 0 && <p className="text-[10px] text-slate-700 italic uppercase">Нет действий</p>}
                               </div>
                            </div>
                         </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
};

const ConditionRow: React.FC<{ condition: RuleCondition, project: any, onUpdate: (u: any) => void, onRemove: () => void, characterId: string }> = ({ condition, project, onUpdate, onRemove, characterId }) => {
  return (
    <div className="flex items-center gap-2 p-2 bg-slate-800/50 border border-slate-700 rounded-lg group">
      <select 
        value={condition.type}
        onChange={(e) => {
           const newType = e.target.value as ConditionType;
           const defaultOp = newType === 'item' ? 'has' : newType === 'scene' ? 'at_scene' : 'gt';
           onUpdate({ type: newType, operator: defaultOp });
        }}
        className="bg-slate-900 text-[9px] font-bold text-slate-300 p-1 rounded outline-none w-24"
      >
        <option value="relationship">Отношение</option>
        <option value="item">Инвентарь</option>
        <option value="variable">Переменная</option>
        <option value="scene">Сцена</option>
      </select>
      
      <select value={condition.targetId} onChange={(e) => onUpdate({ targetId: e.target.value })} className="flex-1 bg-slate-900 text-[9px] p-1 rounded outline-none truncate">
        <option value="">Цель...</option>
        {condition.type === 'relationship' && project.characters.filter((c: any) => c.id !== characterId).map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
        {condition.type === 'item' && project.items.map((i: any) => <option key={i.id} value={i.id}>{i.name}</option>)}
        {condition.type === 'variable' && project.variables.map((v: any) => <option key={v.id} value={v.id}>{v.name}</option>)}
        {condition.type === 'scene' && project.scenes.map((s: any) => <option key={s.id} value={s.id}>{s.title}</option>)}
      </select>

      <OperatorSelector condition={condition} onUpdate={(op) => onUpdate({ operator: op })} />
      
      {condition.type !== 'item' && condition.type !== 'scene' && (
        <input type="number" value={condition.value as number} onChange={(e) => onUpdate({ value: Number(e.target.value) })} className="w-10 bg-slate-900 text-[9px] p-1 rounded outline-none" />
      )}
      
      <button onClick={onRemove} className="text-slate-600 hover:text-red-500 transition-opacity"><Trash2 size={12} /></button>
    </div>
  );
};

const OperatorSelector: React.FC<{ condition: RuleCondition, onUpdate: (op: any) => void }> = ({ condition, onUpdate }) => {
   if (condition.type === 'item') {
      return <select value={condition.operator} onChange={e => onUpdate(e.target.value)} className="bg-slate-900 text-[9px] p-1 rounded outline-none w-16 font-black text-amber-500"><option value="has">ЕСТЬ</option><option value="has_not">НЕТ</option></select>
   }
   if (condition.type === 'scene') {
      return <select value={condition.operator} onChange={e => onUpdate(e.target.value)} className="bg-slate-900 text-[9px] p-1 rounded outline-none w-16 font-black text-indigo-400"><option value="at_scene">НА НЕЙ</option></select>
   }
   return <select value={condition.operator} onChange={e => onUpdate(e.target.value)} className="bg-slate-900 text-[9px] p-1 rounded outline-none w-10"><option value="gt">&gt;</option><option value="lt">&lt;</option><option value="eq">=</option></select>
}

const ActionRow: React.FC<{ action: RuleAction, project: any, onUpdate: (u: any) => void, onRemove: () => void }> = ({ action, project, onUpdate, onRemove }) => {
  return (
    <div className="flex items-center gap-2 p-2 bg-slate-800/50 border border-slate-700 rounded-lg group">
      <select value={action.type} onChange={(e) => onUpdate({ type: e.target.value as ActionType })} className="bg-slate-900 text-[9px] font-bold text-slate-300 p-1 rounded outline-none w-24">
        <option value="mod_relationship">Отношение</option>
        <option value="join_party">В группу</option>
        <option value="leave_party">Уйти</option>
        <option value="give_item">Дать вещь</option>
        <option value="remove_item">Забрать вещь</option>
      </select>
      <select value={action.targetId} onChange={(e) => onUpdate({ targetId: e.target.value })} className="flex-1 bg-slate-900 text-[9px] p-1 rounded outline-none truncate">
          <option value="">Цель...</option>
          {(action.type === 'give_item' || action.type === 'remove_item') ? project.items.map((i: any) => <option key={i.id} value={i.id}>{i.name}</option>) : project.characters.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
      {action.type === 'mod_relationship' && (
        <input type="number" value={action.value as number} onChange={(e) => onUpdate({ value: Number(e.target.value) })} className="w-10 bg-slate-900 text-[9px] p-1 rounded outline-none" />
      )}
      <button onClick={onRemove} className="text-slate-600 hover:text-red-500 transition-opacity"><Trash2 size={12} /></button>
    </div>
  );
};

export default CharacterEditor;
