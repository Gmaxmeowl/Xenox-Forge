
import React, { useState, useMemo } from 'react';
import { 
  Box, Code2, GitBranch, Users, Package, Settings, Play, Save, Search,
  ChevronLeft, ChevronRight, PlusCircle, Database, FolderOpen, BookOpen, Download, Upload, MonitorIcon, ChevronDown, Folder, Trash2, Rocket, Bug, Sparkles, Music
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { translations } from '../../translations';
import { Scene } from '../../types';
import GraphView from './GraphView';
import SceneEditor from './SceneEditor';
import MediaLibrary from './MediaLibrary';
import CharacterEditor from './CharacterEditor';
import InventoryEditor from './InventoryEditor';
import VariablesEditor from './VariablesEditor';
import QuestEditor from './QuestEditor';
import DebuggerView from './DebuggerView';
import AIAssistantView from './AIAssistantView';
import SoundtrackEditor from './SoundtrackEditor';

const EditorLayout: React.FC = () => {
  const { 
    project, startGame, selectedSceneId, selectScene, addScene, deleteScene,
    language, setLanguage, activeView, setActiveView,
    saveProjectLocally, exportProjectAsJson, importProjectFromJson
  } = useStore();
  
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [showSaveMenu, setShowSaveMenu] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['Main', 'Sectors', 'Other']));

  const t = translations[language].editor;

  const groupedScenes = useMemo(() => {
    const groups: Record<string, Scene[]> = {};
    project.scenes.forEach(s => {
      const folder = s.folder || 'Other';
      if (!groups[folder]) groups[folder] = [];
      groups[folder].push(s);
    });
    return groups;
  }, [project.scenes]);

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.nexus';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          importProjectFromJson(event.target.result as string);
        }
      };
      reader.readAsText(file);
    };
    input.click();
    setShowSaveMenu(false);
  };

  const renderContent = () => {
    switch (activeView) {
      case 'graph': return <GraphView />;
      case 'editor': return <SceneEditor />;
      case 'assets': return <MediaLibrary />;
      case 'characters': return <CharacterEditor />;
      case 'inventory': return <InventoryEditor />;
      case 'variables': return <VariablesEditor />;
      case 'quests': return <QuestEditor />;
      case 'debug': return <DebuggerView />;
      case 'ai': return <AIAssistantView />;
      case 'soundtracks': return <SoundtrackEditor />;
      default: return <GraphView />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950">
      <header className="h-14 border-b border-slate-800 flex items-center justify-between px-4 bg-slate-900/50 backdrop-blur-md relative z-[60]">
        <div className="flex items-center gap-4">
          <div className="p-1.5 bg-indigo-500/10 rounded-lg">
            <Box size={20} className="text-indigo-500" />
          </div>
          <div className="flex flex-col -space-y-1">
            <span className="font-bold text-sm tracking-tight text-white">{t.title}</span>
            <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">XenoX Engine v2.5 PRO</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
             <button onClick={() => setLanguage('ru')} className={`px-2 py-1 text-[10px] font-bold rounded transition-all uppercase ${language === 'ru' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}>RU</button>
             <button onClick={() => setLanguage('en')} className={`px-2 py-1 text-[10px] font-bold rounded transition-all uppercase ${language === 'en' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}>EN</button>
          </div>
          
          <button onClick={() => startGame()} className="flex items-center gap-2 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-indigo-500/20 active:scale-95">
            <Play size={14} fill="currentColor" /> {t.playtest}
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setShowSaveMenu(!showSaveMenu)} 
              className={`p-2 rounded-lg transition-all border ${showSaveMenu ? 'bg-indigo-600 text-white border-indigo-500' : 'text-slate-400 hover:bg-slate-800 border-slate-700'}`}
            >
              <Save size={18} />
            </button>
            {showSaveMenu && (
              <div className="absolute right-0 mt-3 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 z-[100]">
                <div className="p-3 border-b border-slate-800 bg-black/20 text-[10px] font-black uppercase tracking-widest text-slate-500">Проект: {project.name}</div>
                <div className="p-1.5 space-y-0.5">
                   <button onClick={() => { saveProjectLocally(); setShowSaveMenu(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-slate-300 hover:bg-slate-800 rounded-lg transition-colors group">
                     <MonitorIcon size={14} className="group-hover:text-indigo-400 transition-colors" /> Сохранить локально
                   </button>
                   <button onClick={() => { exportProjectAsJson(); setShowSaveMenu(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-slate-300 hover:bg-slate-800 rounded-lg transition-colors group">
                     <Download size={14} className="group-hover:text-indigo-400 transition-colors" /> Экспорт (.nexus)
                   </button>
                   <div className="h-px bg-slate-800 my-1 mx-2" />
                   <button onClick={() => { exportProjectAsJson(true); setShowSaveMenu(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-emerald-400 hover:bg-emerald-800/20 rounded-lg transition-colors group">
                     <Rocket size={14} /> Собрать финальную версию
                   </button>
                   <button onClick={handleImport} className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-indigo-400 hover:bg-indigo-800/20 rounded-lg transition-colors group">
                     <Upload size={14} /> Импорт проекта
                   </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="h-11 border-b border-slate-800 bg-slate-900/80 flex items-center px-4 gap-2 text-xs font-bold text-slate-400">
        {[
          { id: 'graph', icon: GitBranch, label: t.graph },
          { id: 'editor', icon: Code2, label: t.sceneEditor },
          { id: 'assets', icon: FolderOpen, label: 'Медиа' },
          { id: 'characters', icon: Users, label: 'Спутники' },
          { id: 'inventory', icon: Package, label: 'Инвентарь' },
          { id: 'quests', icon: BookOpen, label: 'Квесты' },
          { id: 'variables', icon: Database, label: 'Данные' },
          { id: 'debug', icon: Bug, label: 'Отладка' },
          { id: 'ai', icon: Sparkles, label: 'AI помощник' },
          { id: 'soundtracks', icon: Music, label: 'Саундтреки' },
        ].map(btn => (
          <button 
            key={btn.id} 
            onClick={() => setActiveView(btn.id as any)} 
            className={`flex items-center gap-2 px-3 h-full border-b-2 transition-all relative ${activeView === btn.id ? 'text-indigo-400 border-indigo-400 bg-indigo-500/5' : 'border-transparent hover:text-slate-200 hover:bg-slate-800/50'}`}
          >
            <btn.icon size={14} className={activeView === btn.id ? 'animate-pulse' : ''} />
            <span className="whitespace-nowrap">{btn.label}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 flex overflow-hidden">
        <aside className={`border-r border-slate-800 bg-slate-900/30 transition-all flex flex-col ${leftSidebarOpen ? 'w-64' : 'w-12'}`}>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {leftSidebarOpen && (
              <div className="p-2 space-y-1">
                <div className="flex items-center justify-between px-2 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800/50 mb-2">
                  <span>СЦЕНЫ ПОВЕСТВОВАНИЯ</span>
                  <button onClick={() => { addScene(); setActiveView('editor'); }} className="text-indigo-400 hover:text-white transition-all transform hover:rotate-90">
                    <PlusCircle size={16} />
                  </button>
                </div>
                {Object.entries(groupedScenes).map(([folder, scenes]) => (
                  <div key={folder} className="space-y-0.5">
                    <button 
                      onClick={() => {
                        const next = new Set(expandedFolders);
                        if (next.has(folder)) next.delete(folder); else next.add(folder);
                        setExpandedFolders(next);
                      }} 
                      className="w-full flex items-center gap-2 px-2 py-2 text-[10px] font-black text-slate-400 hover:text-white uppercase transition-colors group"
                    >
                      <ChevronDown size={14} className={`transition-transform duration-300 ${expandedFolders.has(folder) ? '' : '-rotate-90 text-slate-600'}`} />
                      <Folder size={14} className="text-indigo-500/50 group-hover:text-indigo-500 transition-colors" />
                      {folder} <span className="ml-auto text-[9px] text-slate-600">{(scenes as Scene[]).length}</span>
                    </button>
                    {expandedFolders.has(folder) && (scenes as Scene[]).map(s => (
                      <div key={s.id} className="group relative px-1">
                        <button 
                          onClick={() => { selectScene(s.id); setActiveView('editor'); }} 
                          className={`w-full text-left pl-8 pr-10 py-2 rounded-lg text-[11px] font-medium truncate transition-all ${selectedSceneId === s.id && activeView === 'editor' ? 'bg-indigo-600/20 text-indigo-300 border-l-2 border-indigo-500' : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300'}`}
                        >
                          {s.title || 'Untitled Scene'}
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); if(confirm('Delete scene?')) deleteScene(s.id); }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-700 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button 
            onClick={() => setLeftSidebarOpen(!leftSidebarOpen)} 
            className="h-10 border-t border-slate-800 flex items-center justify-center text-slate-500 hover:text-white transition-colors bg-black/20"
          >
            {leftSidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </aside>
        <main className="flex-1 relative flex flex-col bg-slate-950 overflow-hidden shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default EditorLayout;
