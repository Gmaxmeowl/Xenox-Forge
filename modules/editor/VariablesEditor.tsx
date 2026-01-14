
import React, { useState, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { translations } from '../../translations';
import { ProjectVariable, VariableGroup, VariableValueType, VariableDependency } from '../../types';
import { 
  Plus, Trash2, Search, Info, Settings2, ShieldCheck, Zap, 
  ChevronDown, Layers, Hash, Type, Folder, FolderPlus, Clock, 
  AlertTriangle, Filter, List, Activity, ArrowRight, GitMerge, MoreVertical, CheckCircle2, XCircle, RotateCcw, Palette, ChevronRight,
  ChevronLeft
} from 'lucide-react';

const VariablesEditor: React.FC = () => {
  const { 
    project, selectedVariableId, selectVariable, addVariable, updateVariable, 
    deleteVariable, addVariableGroup, updateVariableGroup, deleteVariableGroup, language 
  } = useStore();
  const t = translations[language].variablesEditor;
  
  const v = project.variables.find(item => item.id === selectedVariableId);
  const [filterType, setFilterType] = useState<'all' | VariableValueType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Expanded states
  const [isAllVarsExpanded, setIsAllVarsExpanded] = useState(true);
  const [expandedGroupIds, setExpandedGroupIds] = useState<Set<string>>(new Set(project.variableGroups.map(g => g.id)));
  
  const toggleGroup = (id: string) => {
    const next = new Set(expandedGroupIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    setExpandedGroupIds(next);
  };

  const createVariableInGroup = (groupId?: string) => {
    // We call addVariable and then update it with the groupId if provided
    const beforeIds = project.variables.map(iv => iv.id);
    addVariable();
    setTimeout(() => {
      // Find the one that wasn't there before
      const currentVars = useStore.getState().project.variables;
      const newVar = currentVars.find(cv => !beforeIds.includes(cv.id));
      if (newVar && groupId) {
        updateVariable(newVar.id, { groupId });
      }
    }, 50);
  };

  const filteredVars = project.variables.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="flex-1 flex overflow-hidden bg-slate-950">
      {/* Side Management Panel */}
      <div className="w-80 border-r border-slate-800 bg-slate-900/30 flex flex-col p-6 space-y-6 z-20">
         <div className="space-y-4">
            <button 
              onClick={() => createVariableInGroup()}
              className="w-full flex items-center justify-center gap-3 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black transition-all shadow-xl shadow-indigo-500/10 active:scale-95"
            >
               <Plus size={18} /> СОЗДАТЬ ДАННУЮ
            </button>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
              <input 
                type="text" 
                placeholder="Поиск по названию..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2 pl-9 pr-4 text-[11px] text-slate-200 outline-none focus:border-indigo-500/50 transition-all shadow-inner"
              />
            </div>
         </div>

         <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-1">
            {/* All Variables Collapsable */}
            <div className="space-y-1">
               <button 
                 onClick={() => setIsAllVarsExpanded(!isAllVarsExpanded)}
                 className="w-full flex items-center gap-2 px-2 py-2 text-[10px] font-black text-slate-500 hover:text-white uppercase transition-colors group"
               >
                 <ChevronDown size={14} className={`transition-transform duration-300 ${isAllVarsExpanded ? '' : '-rotate-90 text-slate-700'}`} />
                 <List size={14} className="text-indigo-500/50 group-hover:text-indigo-500" />
                 Все данные <span className="ml-auto text-[9px] text-slate-700">{project.variables.length}</span>
               </button>
               {isAllVarsExpanded && (
                 <div className="space-y-0.5 ml-4">
                    {filteredVars.filter(v_item => !v_item.groupId).map(item => (
                      <button 
                        key={item.id}
                        onClick={() => selectVariable(item.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-[11px] font-bold truncate transition-all ${selectedVariableId === item.id ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-800'}`}
                      >
                        {item.name}
                      </button>
                    ))}
                 </div>
               )}
            </div>

            <div className="h-px bg-slate-800/50 mx-2" />

            {/* Categories Section */}
            <div className="space-y-4">
               <div className="flex items-center justify-between px-2">
                  <h4 className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Категории</h4>
                  <button onClick={addVariableGroup} className="text-indigo-400 hover:text-white"><FolderPlus size={14} /></button>
               </div>
               
               {project.variableGroups.map(group => {
                  const groupVars = filteredVars.filter(v_item => v_item.groupId === group.id);
                  const isExpanded = expandedGroupIds.has(group.id);
                  return (
                    <div key={group.id} className="space-y-1">
                       <div className="flex items-center group/cat">
                          <button 
                            onClick={() => toggleGroup(group.id)}
                            className="flex-1 flex items-center gap-2 px-2 py-2 text-[10px] font-black text-slate-400 hover:text-white uppercase transition-colors"
                          >
                             <ChevronDown size={14} className={`transition-transform duration-300 ${isExpanded ? '' : '-rotate-90 text-slate-700'}`} />
                             <Folder size={14} style={{ color: group.color }} />
                             {group.name} <span className="ml-auto text-[9px] text-slate-700">{groupVars.length}</span>
                          </button>
                          <button 
                            onClick={() => createVariableInGroup(group.id)}
                            className="p-1.5 opacity-0 group-hover/cat:opacity-100 text-indigo-400 hover:text-white transition-all"
                            title="Добавить в категорию"
                          >
                             <Plus size={12} />
                          </button>
                       </div>
                       {isExpanded && (
                          <div className="space-y-0.5 ml-4">
                             {groupVars.map(item => (
                                <button 
                                  key={item.id}
                                  onClick={() => selectVariable(item.id)}
                                  className={`w-full text-left px-3 py-2 rounded-lg text-[11px] font-bold truncate transition-all ${selectedVariableId === item.id ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-800'}`}
                                >
                                  {item.name}
                                </button>
                             ))}
                          </div>
                       )}
                    </div>
                  );
               })}
            </div>
         </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {!v ? (
          <div className="flex-1 p-8 overflow-y-auto scroll-smooth custom-scrollbar">
             <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-widest text-white">{t.title}</h2>
                  <p className="text-[10px] text-slate-500 font-bold uppercase mt-1 tracking-widest">Глобальное состояние и логика проекта</p>
                </div>
             </div>

             <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4 pb-20">
                {filteredVars.map(item => {
                   const group = project.variableGroups.find(g => g.id === item.groupId);
                   return (
                    <div 
                      key={item.id} 
                      onClick={() => selectVariable(item.id)} 
                      className="p-5 bg-slate-900/40 border border-slate-800 rounded-3xl flex flex-col gap-4 hover:border-indigo-500/50 cursor-pointer transition-all group overflow-hidden relative shadow-lg"
                    >
                      <div className="flex items-start justify-between relative z-10">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-800 text-slate-500 group-hover:text-indigo-400 transition-colors">
                              {item.type === 'boolean' ? <Zap size={18} /> : item.type === 'number' ? <Hash size={18} /> : <Type size={18} />}
                           </div>
                           <div className="min-w-0">
                              <p className="text-sm font-black text-white uppercase truncate w-32 group-hover:text-indigo-300 transition-colors leading-tight">{item.name}</p>
                              <div className="flex items-center gap-2">
                                 <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">{item.type}</p>
                                 {group && <span className="text-[8px] px-1.5 py-0.5 rounded bg-slate-950 text-indigo-400 font-black border border-indigo-500/20">{group.name}</span>}
                              </div>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="text-[10px] font-mono text-indigo-400 font-black">{String(item.defaultValue)}</p>
                           <p className="text-[7px] text-slate-700 font-black uppercase">DEFAULT</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
             </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-950">
             <div className="p-6 border-b border-slate-800 bg-slate-900/20 flex items-center justify-between">
                <button onClick={() => selectVariable(null)} className="flex items-center gap-2 text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest transition-colors">
                   <ChevronLeft size={16} /> Назад к списку
                </button>
                <div className="flex gap-2">
                   <button onClick={() => { if(confirm('Удалить эту переменную?')) { deleteVariable(v.id); selectVariable(null); } }} className="p-2.5 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white rounded-xl transition-all border border-red-500/20">
                      <Trash2 size={18}/>
                   </button>
                </div>
             </div>
             
             <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                <div className="max-w-4xl mx-auto space-y-12 pb-20">
                   <section className="flex items-center gap-8">
                      <div className="w-24 h-24 rounded-3xl bg-slate-900 border-2 border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-2xl relative">
                         {v.type === 'boolean' ? <Zap size={48} /> : v.type === 'number' ? <Hash size={48} /> : <Type size={48} />}
                      </div>
                      <div className="flex-1 space-y-2">
                         <input 
                           value={v.name} 
                           onChange={(e) => updateVariable(v.id, { name: e.target.value })} 
                           className="bg-transparent text-5xl font-black text-white outline-none w-full border-b border-transparent focus:border-slate-800 transition-all uppercase tracking-tighter" 
                           placeholder="НАЗВАНИЕ..." 
                         />
                         <div className="flex items-center gap-3">
                            <select 
                              value={v.type} 
                              onChange={(e) => updateVariable(v.id, { type: e.target.value as any })}
                              className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-1 text-[10px] font-black text-indigo-400 uppercase outline-none shadow-inner"
                            >
                               <option value="number">Число</option>
                               <option value="boolean">Логическое</option>
                               <option value="string">Текст</option>
                            </select>
                            <select 
                              value={v.groupId || ''} 
                              onChange={(e) => updateVariable(v.id, { groupId: e.target.value || undefined })}
                              className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-1 text-[10px] font-black text-slate-500 uppercase outline-none shadow-inner"
                            >
                               <option value="">Без категории</option>
                               {project.variableGroups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                            </select>
                         </div>
                      </div>
                   </section>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <section className="p-8 bg-slate-900/30 border border-slate-800 rounded-[2.5rem] space-y-6 shadow-xl">
                         <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] flex items-center gap-3">
                            <Settings2 size={14} /> Конфигурация
                         </h3>
                         <div className="space-y-6">
                            <div className="space-y-3">
                               <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Значение по умолчанию</label>
                               <input 
                                 value={v.defaultValue} 
                                 onChange={(e) => updateVariable(v.id, { defaultValue: v.type === 'number' ? Number(e.target.value) : e.target.value })} 
                                 className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-sm text-indigo-400 font-mono outline-none focus:border-indigo-500 shadow-inner" 
                               />
                            </div>
                            
                            <div className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-2xl">
                               <div className="space-y-0.5">
                                  <p className="text-[9px] font-black text-white uppercase">Временная данная</p>
                                  <p className="text-[7px] text-slate-500 uppercase">Сброс после N сцен</p>
                               </div>
                               <input 
                                 type="checkbox" 
                                 checked={v.isTemporary} 
                                 onChange={e => updateVariable(v.id, { isTemporary: e.target.checked })} 
                                 className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-indigo-500"
                               />
                            </div>
                         </div>
                      </section>

                      <section className="p-8 bg-slate-900/30 border border-slate-800 rounded-[2.5rem] flex flex-col space-y-6 shadow-xl">
                         <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                            <div>
                               <h3 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] flex items-center gap-3"><GitMerge size={14} /> Зависимости</h3>
                               <p className="text-[8px] text-slate-600 mt-1 uppercase">Логические связи между флагами</p>
                            </div>
                            <button 
                              onClick={() => updateVariable(v.id, { dependencies: [...v.dependencies, { variableId: '', type: 'requires' }] })} 
                              className="p-2 bg-emerald-600/10 text-emerald-400 rounded-lg hover:bg-emerald-600 hover:text-white transition-all"
                            >
                               <Plus size={16} />
                            </button>
                         </div>
                         
                         <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar">
                            {v.dependencies.map((dep, di) => (
                              <div key={di} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center gap-3 group animate-in slide-in-from-right-2">
                                 <select 
                                   value={dep.type} 
                                   onChange={(e) => updateVariable(v.id, { dependencies: v.dependencies.map((d, i) => i === di ? { ...d, type: e.target.value as any } : d) })} 
                                   className="bg-slate-900 text-[10px] font-black text-indigo-400 p-2 rounded-lg outline-none border border-slate-800 w-32"
                                 >
                                    <option value="requires">Требует</option>
                                    <option value="conflicts">Конфликт</option>
                                 </select>
                                 <select 
                                   value={dep.variableId} 
                                   onChange={(e) => updateVariable(v.id, { dependencies: v.dependencies.map((d, i) => i === di ? { ...d, variableId: e.target.value } : d) })} 
                                   className="flex-1 bg-slate-900 text-[10px] font-bold text-slate-300 p-2 rounded-lg outline-none border border-slate-800"
                                 >
                                    <option value="">Выберите данную...</option>
                                    {project.variables.filter(pv => pv.id !== v.id).map(pv => <option key={pv.id} value={pv.id}>{pv.name}</option>)}
                                 </select>
                                 <button 
                                   onClick={() => updateVariable(v.id, { dependencies: v.dependencies.filter((_, i) => i !== di) })} 
                                   className="text-slate-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                 >
                                    <Trash2 size={14}/>
                                 </button>
                              </div>
                            ))}
                            {v.dependencies.length === 0 && (
                               <div className="flex-1 flex flex-col items-center justify-center text-slate-800 opacity-30 py-10">
                                  <ShieldCheck size={40} strokeWidth={1} />
                                  <p className="text-[8px] font-black uppercase mt-2">Нет связей</p>
                               </div>
                            )}
                         </div>
                      </section>
                   </div>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VariablesEditor;
