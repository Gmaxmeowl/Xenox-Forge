
/** @jsx React.createElement */
/** @jsxFrag React.Fragment */
import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../store/useStore';
import { translations } from '../../translations';
import { 
  Play, Pause, RotateCcw, Activity, Terminal, AlertTriangle, 
  ShieldAlert, ChevronRight, Database, Terminal as TerminalIcon, CheckCircle, Ghost, Code
} from 'lucide-react';

const DebuggerView: React.FC = () => {
  const { 
    project, gameState, debugSession, startGame, pauseGame, resumeGame, resetGame,
    validationResults, runValidation, executeDebugCommand, toggleBreakpoint
  } = useStore();
  
  const [commandInput, setCommandInput] = useState('');
  const [commandLogs, setCommandLogs] = useState<{ id: string, text: string, type: 'in' | 'out' }[]>([]);
  const consoleEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    runValidation();
  }, []);

  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [commandLogs]);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim()) return;
    const result = executeDebugCommand(commandInput);
    const newIn = { id: Date.now() + '_in', text: `> ${commandInput}`, type: 'in' as const };
    const newOut = { id: Date.now() + '_out', text: result, type: 'out' as const };
    setCommandLogs(prev => [...prev, newIn, newOut].slice(-50));
    setCommandInput('');
  };

  const scene = project.scenes.find(s => s.id === gameState?.currentSceneId);

  return (
    <div className="flex-1 flex overflow-hidden bg-slate-950">
      <div className="flex-1 flex flex-col border-r border-slate-800">
         <div className="p-6 border-b border-slate-800 bg-slate-900/30 flex items-center justify-between">
            <div className="flex items-center gap-6">
               <h2 className="text-xl font-black uppercase tracking-widest text-white flex items-center gap-2">
                 <ShieldAlert size={24} className="text-amber-500" /> ДЕБАГ-ПАНЕЛЬ
               </h2>
               <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl shadow-inner">
                  {!gameState ? (
                    <button onClick={() => startGame()} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black rounded-lg transition-all">
                       <Play size={14} fill="currentColor" /> START_SIMULATION
                    </button>
                  ) : (
                    <div className="flex items-center gap-1">
                       <button onClick={gameState.isPaused ? resumeGame : pauseGame} className="p-2 text-slate-400 hover:text-white transition-colors">
                          {gameState.isPaused ? <Play size={18} fill="currentColor" className="text-emerald-500" /> : <Pause size={18} fill="currentColor" />}
                       </button>
                       <button onClick={resetGame} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                          <RotateCcw size={18} />
                       </button>
                    </div>
                  )}
               </div>
            </div>
         </div>

         <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
            {gameState ? (
              <section className="space-y-4">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                    <Code size={14} /> RAW_GAME_STATE
                 </label>
                 <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl font-mono text-[10px] text-indigo-400 overflow-x-auto">
                    <pre>{JSON.stringify({
                       scene: scene?.id,
                       vars: gameState.variableValues,
                       inventory: gameState.inventory,
                       quests: gameState.questStates
                    }, null, 2)}</pre>
                 </div>
              </section>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-slate-700 space-y-4">
                 <Ghost size={48} className="opacity-20" />
                 <p className="text-[10px] font-black uppercase tracking-widest">Симуляция не запущена</p>
              </div>
            )}

            <section className="space-y-6">
               <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                     <AlertTriangle size={14} className="text-red-400" /> ВАЛИДАЦИЯ
                  </h3>
                  <button onClick={runValidation} className="text-[10px] text-indigo-400 font-bold hover:text-indigo-300 uppercase">Re-scan</button>
               </div>
               <div className="space-y-2">
                  {validationResults.map(res => (
                    <div key={res.id} className={`p-3 rounded-xl border flex items-start gap-3 ${res.type === 'error' ? 'bg-red-500/5 border-red-500/20 text-red-400' : 'bg-amber-500/5 border-amber-500/20 text-amber-400'}`}>
                       <AlertTriangle size={14} className="mt-0.5" />
                       <div className="flex-1">
                          <p className="text-[10px] font-bold leading-tight">{res.message}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </section>
         </div>
      </div>

      <div className="w-[450px] flex flex-col bg-black/20">
         <div className="p-6 border-b border-slate-800 flex items-center gap-3">
            <TerminalIcon size={18} className="text-emerald-500" />
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">ENGINE_LOGS</h3>
         </div>
         <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-[11px] custom-scrollbar">
            {commandLogs.map(log => (
              <div key={log.id} className={`p-2 rounded-lg ${log.type === 'in' ? 'bg-slate-800/40 text-slate-400' : 'bg-emerald-500/5 text-emerald-400'}`}>
                 {log.text}
              </div>
            ))}
            <div ref={consoleEndRef} />
         </div>
         <div className="p-4 bg-slate-900 border-t border-slate-800">
            <form onSubmit={handleCommandSubmit} className="relative">
               <ChevronRight className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" size={14} />
               <input 
                 value={commandInput}
                 onChange={(e) => setCommandInput(e.target.value)}
                 placeholder="Type command..."
                 className="w-full bg-black border border-slate-700 rounded-xl py-3 pl-8 pr-4 text-xs font-mono text-emerald-400 outline-none"
               />
            </form>
         </div>
      </div>
    </div>
  );
};

export default DebuggerView;
