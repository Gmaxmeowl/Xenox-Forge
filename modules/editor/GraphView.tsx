
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useStore } from '../../store/useStore';
import { 
  Magnet, Undo2, Redo2, GitMerge, Plus, Star, Settings2, X, Layers
} from 'lucide-react';
// Added missing import for SceneEditor
import SceneEditor from './SceneEditor';

interface Point { x: number; y: number; }

const GRID_SIZE = 24;
const NODE_WIDTH = 208;

const GraphView: React.FC = () => {
  const project = useStore(s => s.project);
  const selectedSceneId = useStore(s => s.selectedSceneId);
  const selectScene = useStore(s => s.selectScene);
  const updateScenesPositions = useStore(s => s.updateScenesPositions);
  const commitHistory = useStore(s => s.commitHistory);
  const undo = useStore(s => s.undo);
  const redo = useStore(s => s.redo);
  const addScene = useStore(s => s.addScene);
  const updateScene = useStore(s => s.updateScene);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [showInspector, setShowInspector] = useState(false);
  
  const [connectingFromId, setConnectingFromId] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState<Point>({ x: 0, y: 0 });
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const dragInfo = useRef<{
    startX: number;
    startY: number;
    initialPositions: Map<string, Point>;
  } | null>(null);

  const getMousePos = (e: MouseEvent | React.MouseEvent): Point => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left + containerRef.current.scrollLeft,
      y: e.clientY - rect.top + containerRef.current.scrollTop
    };
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const pos = getMousePos(e);
    
    if (connectingFromId) {
      setMousePos(pos);
      return;
    }

    if (dragInfo.current) {
      const dx = pos.x - dragInfo.current.startX;
      const dy = pos.y - dragInfo.current.startY;
      
      const updates = Array.from(dragInfo.current.initialPositions.entries()).map(([id, initial]) => {
        let nx = initial.x + dx;
        let ny = initial.y + dy;
        if (snapToGrid) {
          nx = Math.round(nx / GRID_SIZE) * GRID_SIZE;
          ny = Math.round(ny / GRID_SIZE) * GRID_SIZE;
        }
        return { id, position: { x: nx, y: ny } };
      });
      updateScenesPositions(updates);
    }
  }, [snapToGrid, updateScenesPositions, connectingFromId]);

  const handleMouseUp = useCallback(() => {
    if (connectingFromId && hoveredNodeId && connectingFromId !== hoveredNodeId) {
      const sourceScene = project.scenes.find(s => s.id === connectingFromId);
      const targetScene = project.scenes.find(s => s.id === hoveredNodeId);
      
      if (sourceScene && targetScene) {
        commitHistory();
        const newChoiceId = `c_${Date.now()}`;
        const newChoices = [...sourceScene.choices, {
          id: newChoiceId,
          text: `Переход в ${targetScene.title || 'локацию'}`,
          conditions: [],
          logicOperator: 'AND' as const,
          actions: [{ id: `act_${Date.now()}`, type: 'change_scene' as const, targetId: targetScene.id }],
          elseActions: []
        }];
        updateScene(sourceScene.id, { choices: newChoices });
      }
    }

    setConnectingFromId(null);
    dragInfo.current = null;
    setIsDragging(false);
  }, [connectingFromId, hoveredNodeId, project.scenes, updateScene, commitHistory]);

  useEffect(() => {
    if (isDragging || connectingFromId) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, connectingFromId, handleMouseMove, handleMouseUp]);

  const startDragging = (e: React.MouseEvent, sceneId: string) => {
    if (connectingFromId) return;
    e.stopPropagation();
    const pos = getMousePos(e);
    commitHistory();
    selectScene(sceneId);

    const initialPositions = new Map<string, Point>();
    const s = project.scenes.find(sc => sc.id === sceneId);
    if (s) initialPositions.set(sceneId, { ...s.position });

    dragInfo.current = { startX: pos.x, startY: pos.y, initialPositions };
    setIsDragging(true);
  };

  const startConnecting = (e: React.MouseEvent, sceneId: string) => {
    e.stopPropagation();
    e.preventDefault();
    const pos = getMousePos(e);
    setConnectingFromId(sceneId);
    setMousePos(pos);
  };

  const openInspector = (id: string) => {
    selectScene(id);
    setShowInspector(true);
  };

  return (
    <div className="w-full h-full relative overflow-hidden flex bg-slate-950">
      <div className="flex-1 relative overflow-hidden flex flex-col">
        <div className="absolute top-4 left-4 z-30 flex items-center gap-2 p-1.5 bg-slate-900/90 backdrop-blur-xl border border-white/5 rounded-xl shadow-2xl">
          <button onClick={() => setSnapToGrid(!snapToGrid)} className={`p-2 rounded-lg transition-all ${snapToGrid ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-500 hover:bg-slate-800'}`} title="Привязка к сетке">
            <Magnet size={18} />
          </button>
          <div className="w-px h-6 bg-slate-800 mx-1" />
          <button onClick={undo} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all" title="Undo (Ctrl+Z)">
            <Undo2 size={18} />
          </button>
          <button onClick={redo} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all" title="Redo (Ctrl+Shift+Z)">
            <Redo2 size={18} />
          </button>
          <div className="w-px h-6 bg-slate-800 mx-1" />
          <button onClick={() => { commitHistory(); addScene(); }} className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all">
            <Plus size={16} /> Сцена
          </button>
        </div>

        <div 
          ref={containerRef}
          className="flex-1 w-full h-full bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] relative overflow-auto cursor-crosshair"
          onMouseDown={() => { if(!isDragging && !connectingFromId) { selectScene(null); setShowInspector(false); } }}
        >
          <div className="min-w-[5000px] min-h-[5000px] relative pointer-events-none">
            <svg className="absolute inset-0 w-full h-full overflow-visible">
              <defs>
                <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orientation="auto">
                  <polygon points="0 0, 8 3, 0 6" fill="#1e293b" />
                </marker>
                <marker id="arrowhead-active" markerWidth="8" markerHeight="6" refX="8" refY="3" orientation="auto">
                  <polygon points="0 0, 8 3, 0 6" fill="#6366f1" />
                </marker>
              </defs>
              
              {project.scenes.flatMap(scene => 
                (scene.choices || []).flatMap(choice => 
                  (choice.actions || []).filter(a => a.type === 'change_scene').map(action => {
                    const target = project.scenes.find(s => s.id === action.targetId);
                    if (!target) return null;
                    const isHighlighted = selectedSceneId === scene.id || selectedSceneId === target.id;
                    
                    return (
                      <path 
                        key={`${scene.id}-${choice.id}-${action.id}`}
                        d={`M ${scene.position.x + NODE_WIDTH/2} ${scene.position.y + 100} C ${scene.position.x + NODE_WIDTH/2} ${scene.position.y + 160}, ${target.position.x + NODE_WIDTH/2} ${target.position.y - 50}, ${target.position.x + NODE_WIDTH/2} ${target.position.y}`}
                        stroke={isHighlighted ? "#6366f1" : "#1e293b"} 
                        strokeWidth={isHighlighted ? "3" : "1.5"}
                        fill="none"
                        markerEnd={isHighlighted ? "url(#arrowhead-active)" : "url(#arrowhead)"}
                        className="transition-all duration-300"
                      />
                    );
                  })
                )
              )}

              {connectingFromId && (
                <line 
                  x1={(project.scenes.find(s => s.id === connectingFromId)?.position.x || 0) + (NODE_WIDTH - 20)}
                  y1={(project.scenes.find(s => s.id === connectingFromId)?.position.y || 0) + 120}
                  x2={mousePos.x}
                  y2={mousePos.y}
                  stroke="#6366f1"
                  strokeWidth="3"
                  strokeDasharray="5,5"
                  className="animate-[dash_1s_linear_infinite]"
                />
              )}
            </svg>

            {project.scenes.map(scene => {
              const isSelected = selectedSceneId === scene.id;
              const isStart = project.startSceneId === scene.id;
              const isHovered = hoveredNodeId === scene.id;
              
              return (
                <div 
                  key={scene.id}
                  onMouseDown={(e) => startDragging(e, scene.id)}
                  onMouseEnter={() => setHoveredNodeId(scene.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  className={`absolute w-52 bg-slate-900 border-2 rounded-[2rem] p-5 shadow-2xl pointer-events-auto select-none transition-all group ${
                    isSelected 
                      ? 'border-indigo-500 ring-8 ring-indigo-500/10 z-20 scale-105' 
                      : isHovered && connectingFromId ? 'border-indigo-400 ring-4 ring-indigo-400/20 z-30 scale-110' : 'border-slate-800 hover:border-slate-700 z-10'
                  }`}
                  style={{ left: scene.position.x, top: scene.position.y }}
                >
                  {isStart && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-lg ring-4 ring-slate-950">
                      <Star size={10} fill="currentColor" />
                      <span className="text-[8px] font-black uppercase tracking-tighter">START</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest truncate max-w-[100px]">ID: {scene.id}</span>
                    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button 
                        onClick={(e) => { e.stopPropagation(); openInspector(scene.id); }}
                        className="p-1.5 bg-slate-800 text-slate-400 hover:text-indigo-400 rounded-lg transition-colors shadow-lg"
                        title="Настройки сцены"
                       >
                          <Settings2 size={12} />
                       </button>
                    </div>
                  </div>
                  
                  <h4 className="text-[11px] font-black text-slate-100 mb-4 line-clamp-2 uppercase tracking-tight leading-tight group-hover:text-indigo-300 transition-colors">{scene.title || 'Безымянная сцена'}</h4>
                  
                  <div className="flex justify-between items-center text-[9px] text-slate-600 border-t border-white/5 pt-4 font-bold uppercase">
                    <span className="flex items-center gap-1.5"><GitMerge size={10} className="text-purple-500"/> {(scene.choices || []).length}</span>
                    <div className={`h-2 w-2 rounded-full ${scene.type === 'normal' ? 'bg-blue-500' : scene.type === 'choice' ? 'bg-purple-500' : 'bg-red-500'} shadow-lg`} />
                  </div>

                  <button 
                    onMouseDown={(e) => startConnecting(e, scene.id)}
                    className="absolute -bottom-3 -right-3 w-10 h-10 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full flex items-center justify-center shadow-xl border-4 border-slate-950 transition-transform hover:scale-125 cursor-alias z-40"
                    title="Тяни для создания связи"
                  >
                     <Plus size={18} strokeWidth={4} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {showInspector && selectedSceneId && (
        <div className="w-[500px] border-l border-slate-800 bg-slate-950 flex flex-col shadow-[-20px_0_40px_rgba(0,0,0,0.4)] animate-in slide-in-from-right duration-300 z-[100]">
           <div className="p-6 border-b border-white/5 flex items-center justify-between bg-slate-900/30">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-indigo-600/10 rounded-lg text-indigo-400">
                    <Layers size={18} />
                 </div>
                 <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">Конструктор Сцены</h3>
              </div>
              <button 
                onClick={() => setShowInspector(false)}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-all"
              >
                 <X size={20} />
              </button>
           </div>
           <div className="flex-1 overflow-hidden">
              <SceneEditor />
           </div>
        </div>
      )}

      <style>{`
        @keyframes dash {
          to { stroke-dashoffset: -10; }
        }
      `}</style>
    </div>
  );
};

export default GraphView;
