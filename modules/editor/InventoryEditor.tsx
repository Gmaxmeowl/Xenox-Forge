
import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { translations } from '../../translations';
import { Item, ItemCategory, ItemRarity, RuleAction, RuleCondition } from '../../types';
import { 
  Package, Plus, Trash2, Search, Info, Settings2, ShieldCheck, Zap, 
  ChevronDown, Coins, Weight, Layers, Eye, Tag, Ghost, Palette, Monitor
} from 'lucide-react';

const rarityColors = {
  common: 'border-slate-500 text-slate-400 bg-slate-500/10',
  uncommon: 'border-emerald-500 text-emerald-400 bg-emerald-500/10',
  rare: 'border-blue-500 text-blue-400 bg-blue-500/10',
  epic: 'border-purple-500 text-purple-400 bg-purple-500/10',
  legendary: 'border-amber-500 text-amber-400 bg-amber-500/10'
};

const InventoryEditor: React.FC = () => {
  const { project, selectedItemId, addItem, updateItem, deleteItem, selectItem, language, updateSettings } = useStore();
  const t = translations[language].inventoryEditor;
  
  const [searchQuery, setSearchQuery] = useState('');
  const item = project.items.find(i => i.id === selectedItemId);

  const filteredItems = project.items.filter(i => 
    i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (project.items.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-slate-600 bg-slate-950">
        <div className="p-12 border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center max-w-sm text-center">
          <Package size={64} className="mb-6 opacity-20" />
          <h2 className="text-lg font-bold text-slate-400 mb-2">{t.noItem}</h2>
          <p className="text-xs text-slate-500 mb-6">{t.noItemDesc}</p>
          <button onClick={addItem} className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-black transition-all shadow-xl shadow-indigo-500/20">
            <Plus size={18} /> {t.addItem}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex overflow-hidden bg-slate-950">
      {/* Sidebar for Items List */}
      <div className="w-80 border-r border-slate-800 bg-slate-900/30 flex flex-col p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <Package size={14} /> Предметы ({project.items.length})
          </h3>
          <button onClick={addItem} className="text-indigo-400 hover:text-white transition-transform active:scale-90">
            <Plus size={16} />
          </button>
        </div>

        <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700 space-y-3">
           <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-[9px] font-black text-slate-500 uppercase group-hover:text-indigo-400 transition-colors">Отображать в HUD</span>
              <input 
                type="checkbox" 
                checked={project.settings.hudInventoryEnabled} 
                onChange={e => updateSettings({ hudInventoryEnabled: e.target.checked })}
                className="w-3 h-3 rounded bg-slate-900 border-slate-700 text-indigo-500 focus:ring-0"
              />
           </label>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
          <input 
            type="text" 
            placeholder="Поиск предмета..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2 pl-9 pr-4 text-xs text-slate-200 outline-none focus:border-indigo-500/50 transition-all shadow-inner"
          />
        </div>
        
        <div className="space-y-1 overflow-y-auto flex-1 custom-scrollbar pr-1">
          <button onClick={() => selectItem(null)} className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between group ${!selectedItemId ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}>Все предметы</button>
          {filteredItems.map(i => (
            <button 
              key={i.id}
              onClick={() => selectItem(i.id)}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between group ${selectedItemId === i.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm grayscale group-hover:grayscale-0 transition-all">{i.icon}</span>
                <span className="truncate max-w-[120px]">{i.name}</span>
              </div>
              <span className={`w-2 h-2 rounded-full ${i.rarity === 'legendary' ? 'bg-amber-500' : i.rarity === 'epic' ? 'bg-purple-500' : 'bg-slate-700'}`} />
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      {!item ? (
        <div className="flex-1 p-8 overflow-y-auto bg-slate-950">
           <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-widest text-white">Инвентарь Проекта</h2>
                <p className="text-[10px] text-slate-500 font-bold uppercase mt-1 tracking-widest">Каталог вещей, доступных для взаимодействия в истории</p>
              </div>
              <button onClick={addItem} className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black rounded-xl transition-all shadow-xl shadow-indigo-500/10">
                <Plus size={16} /> ДОБАВИТЬ ПРЕДМЕТ
              </button>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredItems.map(i => (
                <div key={i.id} onClick={() => selectItem(i.id)} className="p-5 bg-slate-900/40 border border-slate-800 rounded-3xl hover:border-indigo-500/50 cursor-pointer transition-all group shadow-lg">
                   <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center text-3xl shadow-2xl transition-transform group-hover:scale-110 ${rarityColors[i.rarity]}`}>{i.icon}</div>
                      <div className="min-w-0">
                         <p className="text-sm font-black text-white truncate w-32 group-hover:text-indigo-400 transition-colors uppercase">{i.name}</p>
                         <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">{i.category}</p>
                      </div>
                   </div>
                   <div className="mt-4 pt-4 border-t border-slate-800/50 flex justify-between items-center text-[9px] font-black text-slate-500 uppercase">
                      <span>Вес: {i.weight}</span>
                      <span>Ценность: {i.value}</span>
                   </div>
                </div>
              ))}
           </div>
        </div>
      ) : (
        <div className="flex-1 p-8 overflow-y-auto scroll-smooth">
          <div className="max-w-4xl mx-auto space-y-12 pb-20">
            {/* Header section with Icon modification */}
            <section className="flex items-start gap-8">
              <div className="relative group">
                 <div className={`w-24 h-24 rounded-3xl border-4 flex items-center justify-center text-5xl shadow-2xl transition-all ${rarityColors[item.rarity]}`}>
                    {item.icon}
                 </div>
                 <div className="absolute -bottom-2 -right-2 flex flex-col gap-1">
                    <div className="p-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl flex items-center gap-2 group-hover:scale-105 transition-all">
                       <Palette size={12} className="text-indigo-400" />
                       <input 
                          value={item.icon} 
                          onChange={(e) => updateItem(item.id, { icon: e.target.value })} 
                          className="w-10 bg-transparent text-sm text-center outline-none text-white font-bold" 
                          placeholder="🏠"
                          title="Введите эмодзи или символ" 
                       />
                    </div>
                 </div>
              </div>
              <div className="flex-1 space-y-4">
                 <div className="flex items-center gap-4">
                    <input 
                      value={item.name} 
                      onChange={(e) => updateItem(item.id, { name: e.target.value })} 
                      className="bg-transparent text-4xl font-black text-white outline-none w-full border-b border-transparent focus:border-slate-800 transition-all" 
                      placeholder={t.itemName} 
                    />
                    <button onClick={() => { deleteItem(item.id); selectItem(null); }} className="p-2 text-slate-600 hover:text-red-500 transition-colors">
                       <Trash2 size={24} />
                    </button>
                 </div>
                 <div className="flex items-center gap-3">
                    <select 
                      value={item.category} 
                      onChange={(e) => updateItem(item.id, { category: e.target.value as ItemCategory })} 
                      className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-1.5 text-[10px] font-black text-indigo-400 uppercase tracking-widest outline-none shadow-inner"
                    >
                      {Object.entries(t.categories).map(([val, label]) => <option key={val} value={val}>{label as string}</option>)}
                    </select>
                    <select 
                      value={item.rarity} 
                      onChange={(e) => updateItem(item.id, { rarity: e.target.value as ItemRarity })} 
                      className={`border rounded-lg px-4 py-1.5 text-[10px] font-black uppercase outline-none bg-black/20 shadow-inner ${rarityColors[item.rarity]}`}
                    >
                      {Object.entries(t.rarities).map(([val, label]) => <option key={val} value={val}>{label as string}</option>)}
                    </select>
                 </div>
              </div>
            </section>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="bg-slate-900/50 p-6 rounded-[2rem] border border-slate-800 space-y-3 shadow-xl">
                  <div className="flex items-center gap-2 text-[9px] font-black text-slate-600 uppercase tracking-widest">
                     <Weight size={12} /> ВЕС (КГ)
                  </div>
                  <input 
                    type="number" 
                    value={item.weight} 
                    onChange={(e) => updateItem(item.id, { weight: Number(e.target.value) })} 
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white font-bold outline-none focus:border-indigo-500/50 transition-all" 
                  />
               </div>
               <div className="bg-slate-900/50 p-6 rounded-[2rem] border border-slate-800 space-y-3 shadow-xl">
                  <div className="flex items-center gap-2 text-[9px] font-black text-slate-600 uppercase tracking-widest">
                     <Coins size={12} /> СТОИМОСТЬ
                  </div>
                  <input 
                    type="number" 
                    value={item.value} 
                    onChange={(e) => updateItem(item.id, { value: Number(e.target.value) })} 
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white font-bold outline-none focus:border-indigo-500/50 transition-all" 
                  />
               </div>
               <div className="bg-slate-900/50 p-6 rounded-[2rem] border border-slate-800 space-y-3 shadow-xl">
                  <div className="flex items-center gap-2 text-[9px] font-black text-slate-600 uppercase tracking-widest">
                     <Settings2 size={12} /> СВОЙСТВА
                  </div>
                  <div className="space-y-2">
                    <PropertyToggle label={t.usable} checked={item.isUsable} onChange={(v) => updateItem(item.id, { isUsable: v })} />
                    <PropertyToggle label={t.consumable} checked={item.isConsumable} onChange={(v) => updateItem(item.id, { isConsumable: v })} />
                    <PropertyToggle label={t.discardable} checked={item.isDiscardable} onChange={(v) => updateItem(item.id, { isDiscardable: v })} />
                  </div>
               </div>
            </div>

            <section className="space-y-4">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Info size={14} /> ОПИСАНИЕ ПРЕДМЕТА
              </h3>
              <textarea 
                value={item.description} 
                onChange={(e) => updateItem(item.id, { description: e.target.value })} 
                className="w-full bg-slate-900/50 border border-slate-800 rounded-3xl p-6 text-sm leading-relaxed text-slate-300 outline-none focus:border-indigo-500/50 min-h-[120px] resize-none shadow-inner" 
                placeholder="Для чего нужен этот предмет? Какие секреты он скрывает?.." 
              />
            </section>
          </div>
        </div>
      )}
    </div>
  );
};

const PropertyToggle: React.FC<{ label: string, checked: boolean, onChange: (v: boolean) => void }> = ({ label, checked, onChange }) => (
  <label className="flex items-center justify-between group cursor-pointer hover:bg-white/5 p-1 rounded-lg transition-all">
     <span className="text-[9px] font-black text-slate-400 uppercase tracking-tight group-hover:text-slate-200">{label}</span>
     <div className="relative inline-flex items-center cursor-pointer">
       <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only peer" />
       <div className="w-8 h-4 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-indigo-600"></div>
     </div>
  </label>
);

export default InventoryEditor;
