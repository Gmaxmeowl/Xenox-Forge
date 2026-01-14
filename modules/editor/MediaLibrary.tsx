import React, { useRef, useState } from 'react';
import { useStore } from '../../store/useStore';
import { Upload, Trash2, Image as ImageIcon, Music, Search, X, Check, Sparkles, Loader2, Download } from 'lucide-react';
import { MediaAsset } from '../../types';
import { getPollinationsUrl } from '../../pollinations.ts';

const MediaLibrary: React.FC<{ onSelect?: (asset: MediaAsset) => void }> = ({ onSelect }) => {
  const assets = useStore(s => s.project.assets);
  const addAsset = useStore(s => s.addAsset);
  const deleteAsset = useStore(s => s.deleteAsset);
  const setActiveView = useStore(s => s.setActiveView);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'image' | 'audio' | 'ai_img'>('all');
  
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPreview, setGeneratedPreview] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const base64 = event.target.result as string;
          const type = file.type.startsWith('image/') ? 'image' : 'audio';
          addAsset({ name: file.name, type, data: base64, mimeType: file.type });
        }
      };
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const generateAIImage = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    setGeneratedPreview(null);
    
    try {
      // Use Pollinations.ai for professional game backgrounds
      const backgroundContext = "Professional game background environment, atmospheric, cinematic, no characters in focus";
      const fullPrompt = `${aiPrompt}. ${backgroundContext}`;
      const imageUrl = getPollinationsUrl(fullPrompt, 1280, 720);
      
      // We don't need to await anything as it's just a URL generation
      // But we simulate a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 800));
      setGeneratedPreview(imageUrl);
    } catch (error: any) {
      console.error("AI Generation Error:", error);
      alert("Ошибка генерации. Проверьте соединение.");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadAsset = (asset: MediaAsset) => {
    const link = document.createElement('a');
    link.href = asset.data;
    link.download = asset.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const saveGeneratedAsset = () => {
    if (generatedPreview) {
      addAsset({
        name: `NEURAL_BG_${aiPrompt.substring(0, 15).replace(/\s+/g, '_')}_${Date.now()}`,
        type: 'image',
        data: generatedPreview,
        mimeType: 'image/png'
      });
      setGeneratedPreview(null);
      setAiPrompt('');
      setFilter('image');
    }
  };

  const filteredAssets = assets.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || a.type === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 p-8 overflow-hidden">
      <div className="max-w-6xl mx-auto w-full flex flex-col h-full space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-widest text-white">XenoX Медиа-центр</h2>
          </div>
          <div className="flex gap-2">
             <button onClick={() => setFilter('ai_img')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black transition-all border ${filter === 'ai_img' ? 'bg-purple-600 text-white border-purple-400' : 'bg-slate-900 text-purple-400 border-purple-500/20'}`}><Sparkles size={14} /> AI ФОНЫ</button>
             <button onClick={() => setActiveView('soundtracks')} className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black bg-indigo-600/10 text-indigo-400 border border-indigo-500/20"><Music size={14} /> AI МУЗЫКА</button>
             <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black"><Upload size={16} /> ЗАГРУЗИТЬ</button>
          </div>
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} multiple accept="image/*,audio/*" className="hidden" />
        </div>

        {filter === 'ai_img' ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-8 animate-in zoom-in">
             <div className="w-full max-w-2xl bg-slate-900/50 border border-indigo-500/20 p-8 rounded-[3rem] shadow-2xl backdrop-blur-xl">
                <h3 className="text-sm font-black text-indigo-400 uppercase tracking-widest mb-6 flex items-center gap-2"><Sparkles size={16} /> Генерация окружения</h3>
                <div className="space-y-4">
                   <textarea value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} placeholder="Опишите фон (напр: Заброшенный мостик космического корабля)..." className="w-full h-32 bg-black/40 border border-slate-700 rounded-2xl p-4 text-white text-sm outline-none focus:border-indigo-500 transition-all resize-none shadow-inner" />
                   <div className="flex justify-between items-center">
                      <p className="text-[9px] text-slate-600 uppercase font-black">Powered by Pollinations AI</p>
                      <button disabled={isGenerating || !aiPrompt.trim()} onClick={generateAIImage} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-black rounded-xl flex items-center gap-2 transition-all">
                         {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />} {isGenerating ? 'ГЕНЕРАЦИЯ...' : 'ГЕНЕРИРОВАТЬ'}
                      </button>
                   </div>
                </div>
             </div>
             {generatedPreview && (
               <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4">
                    <div className="aspect-video rounded-3xl overflow-hidden border-2 border-indigo-500/50 shadow-2xl group relative">
                       <img src={generatedPreview} className="w-full h-full object-cover" />
                       <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                          <button onClick={saveGeneratedAsset} className="px-6 py-2 bg-emerald-600 text-white text-xs font-black rounded-xl flex items-center gap-2"><Check size={16} /> СОХРАНИТЬ</button>
                          <button onClick={() => setGeneratedPreview(null)} className="px-6 py-2 bg-slate-800 text-white text-xs font-black rounded-xl flex items-center gap-2"><X size={16} /> ОТМЕНА</button>
                       </div>
                    </div>
               </div>
             )}
          </div>
        ) : (
          <>
            <div className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input type="text" placeholder="Поиск по названию..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2.5 pl-12 pr-4 text-xs outline-none focus:ring-1 focus:ring-indigo-500 transition-all" />
              </div>
              <div className="flex p-1 bg-slate-800 rounded-xl border border-slate-700">
                {(['all', 'image', 'audio'] as const).map(f => (
                  <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>
                    {f === 'all' ? 'Все' : f === 'image' ? 'Изображения' : 'Звуки'}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 pb-10">
                {filteredAssets.map(asset => (
                  <div key={asset.id} className="group relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-all flex flex-col shadow-lg">
                    <div className="aspect-square bg-slate-800 flex items-center justify-center overflow-hidden">
                      {asset.type === 'image' ? ( <img src={asset.data} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /> ) : ( <Music size={40} className="text-slate-600" /> )}
                      <div className="absolute inset-0 bg-indigo-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all">
                         <button onClick={() => downloadAsset(asset)} className="w-10 h-10 bg-indigo-500 text-white rounded-full flex items-center justify-center hover:scale-110 transition-all"><Download size={18} /></button>
                         {onSelect && ( <button onClick={() => onSelect(asset)} className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center hover:scale-110 transition-all"><Check size={18} /></button> )}
                         <button onClick={() => deleteAsset(asset.id)} className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center hover:scale-110 transition-all"><Trash2 size={18} /></button>
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-[10px] font-bold text-slate-200 truncate">{asset.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MediaLibrary;
