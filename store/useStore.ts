
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { get as idbGet, set as idbSet, del } from 'idb-keyval';
import { 
  Project, Scene, Character, Item, Quest, GameState, RuleAction, Choice, 
  ProjectVariable, RuleCondition, MediaAsset, QuestStage, VariableGroup, ProjectSettings 
} from '../types';

const STORAGE_KEY = 'xenox_forge_project_db';

const idbStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      return (await idbGet(name)) || null;
    } catch (e) {
      console.error("IDB Load Error:", e);
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      await idbSet(name, value);
    } catch (e) {
      console.error("IDB Save Error:", e);
    }
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name);
  },
};

const generateHardcoreProject = (): Project => {
  return {
    id: 'xenox_project_' + Date.now(),
    name: 'XENOX HORROR: Labyrinth',
    description: 'Interactive Story Engine Project',
    startSceneId: 's0',
    startingParty: [],
    scenes: [
      {
        id: 's0',
        title: 'Начало',
        content: 'Добро пожаловать в XenoX Forge. Это ваша первая сцена. Отредактируйте её, чтобы начать историю.',
        type: 'choice',
        folder: 'Main',
        backgroundUrl: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9',
        choices: [],
        rules: [],
        tags: ['start'],
        position: { x: 100, y: 100 }
      }
    ],
    characters: [],
    items: [],
    quests: [],
    assets: [],
    variables: [{ id: 'sanity', name: 'Рассудок', type: 'number', defaultValue: 100, priority: 1, isTemporary: false, resetAfterScenes: 0, dependencies: [] }],
    variableGroups: [],
    settings: { 
      autosaveEnabled: true, 
      autosaveInterval: 5, 
      editorFontSize: 14, 
      editorTheme: 'dark', 
      defaultLanguage: 'ru',
      isPublished: false,
      hudInventoryEnabled: true,
      hudCompanionsEnabled: true,
      hudQuestsEnabled: true,
      hudSettingsEnabled: true,
      ttsEnabled: true,
      defaultVoice: 'Charon'
    },
    flags: {}
  };
};

const sanitizeProject = (p: any): Project => {
  const base = generateHardcoreProject();
  return {
    ...base,
    ...p,
    scenes: (p.scenes || []).map((s: any) => ({
      ...s,
      choices: (s.choices || []).map((c: any) => ({
        ...c,
        conditions: c.conditions || [],
        actions: c.actions || [],
        elseActions: c.elseActions || []
      })),
      rules: s.rules || [],
      tags: s.tags || [],
      content: s.content || ''
    })),
    characters: p.characters || [],
    items: p.items || [],
    quests: (p.quests || []).map((q: any) => ({
      ...q,
      stages: (q.stages || []).map((st: any) => ({
        ...st,
        conditions: st.conditions || [],
        completionActions: st.completionActions || [],
        nextStageIds: st.nextStageIds || [],
        position: st.position || { x: 100, y: 100 }
      })),
      initialStageIds: q.initialStageIds || []
    })),
    assets: p.assets || [],
    variables: p.variables || [],
    variableGroups: p.variableGroups || [],
    settings: { ...base.settings, ...(p.settings || {}) }
  };
};

interface AppState {
  mode: 'editor' | 'player';
  language: 'ru' | 'en';
  activeView: 'graph' | 'editor' | 'characters' | 'inventory' | 'variables' | 'assets' | 'quests' | 'debug' | 'ai' | 'soundtracks';
  project: Project;
  history: { past: Project[], future: Project[] };
  gameState: GameState | null;
  selectedSceneId: string | null;
  selectedQuestId: string | null;
  selectedItemId: string | null;
  selectedCharacterId: string | null;
  selectedVariableId: string | null;
  validationResults: any[];
  debugSession: { breakpoints: any[] };

  setMode: (mode: 'editor' | 'player') => void;
  setActiveView: (view: AppState['activeView']) => void;
  setLanguage: (lang: 'ru' | 'en') => void;
  updateScene: (id: string, updates: Partial<Scene>) => void;
  selectScene: (id: string | null) => void;
  addScene: () => void;
  deleteScene: (id: string) => void;
  setStartScene: (id: string) => void;
  updateScenesPositions: (updates: { id: string, position: { x: number, y: number } }[]) => void;
  updateSettings: (updates: Partial<ProjectSettings>) => void;
  addQuest: () => void;
  selectQuest: (id: string | null) => void;
  updateQuest: (id: string, updates: Partial<Quest>) => void;
  deleteQuest: (id: string) => void;
  addQuestStage: (questId: string) => void;
  updateQuestStage: (questId: string, stageId: string, updates: Partial<QuestStage>) => void;
  deleteQuestStage: (questId: string, stageId: string) => void;
  updateQuestStagesPositions: (questId: string, updates: { id: string, position: { x: number, y: number } }[]) => void;
  selectItem: (id: string | null) => void;
  addItem: () => void;
  updateItem: (id: string, updates: Partial<Item>) => void;
  deleteItem: (id: string) => void;
  selectCharacter: (id: string | null) => void;
  addCharacter: () => void;
  updateCharacter: (id: string, updates: Partial<Character>) => void;
  deleteCharacter: (id: string) => void;
  selectVariable: (id: string | null) => void;
  addVariable: () => void;
  updateVariable: (id: string, updates: Partial<ProjectVariable>) => void;
  deleteVariable: (id: string) => void;
  addVariableGroup: () => void;
  updateVariableGroup: (id: string, updates: Partial<VariableGroup>) => void;
  deleteVariableGroup: (id: string) => void;
  addAsset: (asset: Omit<MediaAsset, 'id' | 'tags'>) => void;
  deleteAsset: (id: string) => void;
  saveProjectLocally: () => void;
  exportProjectAsJson: (forPlayer?: boolean) => void;
  importProjectFromJson: (json: string) => void;
  loadExternalStory: () => Promise<void>;
  startGame: () => void;
  makeChoice: (choice: Choice) => void;
  resetGame: () => void;
  quickSave: () => void;
  quickLoad: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  undo: () => void;
  redo: () => void;
  commitHistory: () => void;
  runValidation: () => void;
  executeDebugCommand: (cmd: string) => string;
  toggleBreakpoint: (targetId: string, type: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      mode: 'editor', language: 'ru', activeView: 'graph',
      project: generateHardcoreProject(),
      history: { past: [], future: [] },
      gameState: null, selectedSceneId: 's0', selectedQuestId: null,
      selectedItemId: null, selectedCharacterId: null, selectedVariableId: null,
      validationResults: [], debugSession: { breakpoints: [] },

      setMode: (mode) => set({ mode }),
      setActiveView: (activeView) => set({ activeView }),
      setLanguage: (language) => set({ language }),
      updateSettings: (upd) => set(s => ({ project: { ...s.project, settings: { ...s.project.settings, ...upd } } })),
      updateScene: (id, upd) => set(s => ({ project: { ...s.project, scenes: s.project.scenes.map(sc => sc.id === id ? { ...sc, ...upd } : sc) } })),
      selectScene: (id) => set({ selectedSceneId: id }),
      addScene: () => set(s => {
        const id = `s_${Date.now()}`;
        const newScene = { id, title: 'Новая сцена', content: '', type: 'normal' as const, backgroundUrl: '', choices: [], rules: [], tags: [], position: { x: 100, y: 100 } };
        const nextProject = { ...s.project, scenes: [...(s.project.scenes || []), newScene] };
        if (!nextProject.startSceneId) nextProject.startSceneId = id;
        return { project: sanitizeProject(nextProject), selectedSceneId: id };
      }),
      deleteScene: (id) => set(s => {
        const nextScenes = (s.project.scenes || []).filter(sc => sc.id !== id);
        let nextStartId = s.project.startSceneId;
        if (nextStartId === id) nextStartId = nextScenes[0]?.id || '';
        return { project: { ...s.project, scenes: nextScenes, startSceneId: nextStartId }, selectedSceneId: s.selectedCharacterId === id ? null : s.selectedSceneId };
      }),
      setStartScene: (id) => set(s => ({ project: { ...s.project, startSceneId: id } })),
      updateScenesPositions: (updates) => set(s => ({ project: { ...s.project, scenes: (s.project.scenes || []).map(scene => { const update = updates.find(u => u.id === scene.id); return update ? { ...scene, position: update.position } : scene; }) } })),
      addQuest: () => set(s => ({ project: { ...s.project, quests: [...(s.project.quests || []), { id: `q_${Date.now()}`, name: 'Новый квест', description: '', icon: '📜', stages: [], initialStageIds: [], startConditions: [], onStartActions: [], onCompleteActions: [], onFailActions: [] }] } })),
      selectQuest: (id) => set({ selectedQuestId: id }),
      updateQuest: (id, upd) => set(s => ({ project: { ...s.project, quests: (s.project.quests || []).map(q => q.id === id ? { ...q, ...upd } : q) } })),
      deleteQuest: (id) => set(s => {
        const newQuests = (s.project.quests || []).filter(q => q.id !== id);
        return { 
          project: { ...s.project, quests: newQuests }, 
          selectedQuestId: s.selectedQuestId === id ? null : s.selectedQuestId
        };
      }),
      addQuestStage: (questId) => set(s => {
        const stageId = `stg_${Date.now()}`;
        const nextQuests = (s.project.quests || []).map(q => {
          if (q.id !== questId) return q;
          const newStage: QuestStage = { 
            id: stageId, 
            title: 'Новый этап', 
            description: '', 
            type: 'dialogue' as const, 
            conditions: [], 
            completionActions: [], 
            nextStageIds: [],
            position: { x: 100, y: 100 }
          };
          const nextStages = [...(q.stages || []), newStage];
          return {
            ...q,
            stages: nextStages,
            initialStageIds: q.initialStageIds.length === 0 ? [stageId] : q.initialStageIds
          };
        });
        return { project: { ...s.project, quests: nextQuests } };
      }),
      updateQuestStage: (questId, stageId, upd) => set(s => ({ project: { ...s.project, quests: (s.project.quests || []).map(q => q.id === questId ? { ...q, stages: (q.stages || []).map(st => st.id === stageId ? { ...st, ...upd } : st) } : q) } })),
      deleteQuestStage: (questId, stageId) => set(s => {
        const nextQuests = (s.project.quests || []).map(q => {
          if (q.id !== questId) return q;
          
          const nextStages = (q.stages || [])
            .filter(st => st.id !== stageId)
            .map(st => ({
              ...st,
              nextStageIds: (st.nextStageIds || []).filter(nid => nid !== stageId)
            }));
            
          const nextInitial = (q.initialStageIds || []).filter(nid => nid !== stageId);
          
          return {
            ...q,
            stages: nextStages,
            initialStageIds: nextInitial
          };
        });
        
        return { 
          project: { ...s.project, quests: nextQuests } 
        };
      }),
      updateQuestStagesPositions: (questId, updates) => set(s => ({
        project: {
          ...s.project,
          quests: s.project.quests.map(q => q.id === questId ? {
            ...q,
            stages: q.stages.map(st => {
              const upd = updates.find(u => u.id === st.id);
              return upd ? { ...st, position: upd.position } : st;
            })
          } : q)
        }
      })),
      selectItem: (id) => set({ selectedItemId: id }),
      addItem: () => set(s => ({ project: { ...s.project, items: [...(s.project.items || []), { id: `i_${Date.now()}`, name: 'Новый предмет', icon: '📦', description: '', category: 'misc', rarity: 'common', weight: 1, value: 10, isUsable: true, isConsumable: false, isDiscardable: true, useConditions: [], useActions: [] }] } })),
      updateItem: (id, upd) => set(s => ({ project: { ...s.project, items: (s.project.items || []).map(i => i.id === id ? { ...i, ...upd } : i) } })),
      deleteItem: (id) => set(s => ({ project: { ...s.project, items: (s.project.items || []).filter(i => i.id !== id) }, selectedItemId: null })),
      selectCharacter: (id) => set({ selectedCharacterId: id }),
      addCharacter: () => set(s => ({ project: { ...s.project, characters: [...(s.project.characters || []), { id: `ch_${Date.now()}`, name: 'Новый персонаж', role: 'Спутник', description: '', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + Date.now(), initialRelationship: 50, traits: {}, relationships: {}, triggers: [], colorTag: '#6366f1' }] } })),
      updateCharacter: (id, upd) => set(s => ({ project: { ...s.project, characters: (s.project.characters || []).map(c => c.id === id ? { ...c, ...upd } : c) } })),
      deleteCharacter: (id) => set(s => ({ project: { ...s.project, characters: (s.project.characters || []).filter(c => c.id !== id) }, selectedCharacterId: null })),
      selectVariable: (id) => set({ selectedVariableId: id }),
      addVariable: () => set(s => {
        const id = `v_${Date.now()}`;
        return { project: { ...s.project, variables: [...(s.project.variables || []), { id, name: 'NewVar', type: 'number', defaultValue: 0, priority: 1, isTemporary: false, resetAfterScenes: 0, dependencies: [] }] }, selectedVariableId: id };
      }),
      updateVariable: (id, upd) => set(s => ({ project: { ...s.project, variables: (s.project.variables || []).map(v => v.id === id ? { ...v, ...upd } : v) } })),
      deleteVariable: (id) => set(s => ({ project: { ...s.project, variables: (s.project.variables || []).filter(v => v.id !== id) }, selectedVariableId: s.selectedVariableId === id ? null : s.selectedVariableId })),
      addVariableGroup: () => set(s => ({ project: { ...s.project, variableGroups: [...(s.project.variableGroups || []), { id: `vg_${Date.now()}`, name: 'Новая группа', color: '#4f46e5' }] } })),
      updateVariableGroup: (id, upd) => set(s => ({ project: { ...s.project, variableGroups: (s.project.variableGroups || []).map(g => g.id === id ? { ...g, ...upd } : g) } })),
      deleteVariableGroup: (id) => set(s => ({ project: { ...s.project, variableGroups: (s.project.variableGroups || []).filter(g => g.id !== id) } })),
      addAsset: (asset) => set(s => ({ project: { ...s.project, assets: [...(s.project.assets || []), { ...asset, id: `ast_${Date.now()}`, tags: [] }] } })),
      deleteAsset: (id) => set(s => {
        const nextAssets = (s.project.assets || []).filter(a => a.id !== id);
        const nextSettings = { ...s.project.settings };
        if (nextSettings.globalSoundtrackId === id) delete nextSettings.globalSoundtrackId;
        return { project: { ...s.project, assets: nextAssets, settings: nextSettings } };
      }),

      saveProjectLocally: async () => {
        const { project } = get();
        try {
          await idbSet('manual_backup_project', JSON.stringify(project));
          alert('Проект сохранен в защищенном хранилище IndexedDB!');
        } catch (e) {
          console.error("Save error:", e);
        }
      },
      exportProjectAsJson: (forPlayer = false) => {
        const { project } = get();
        const exportData = JSON.parse(JSON.stringify(project));
        if (forPlayer) exportData.settings.isPublished = true;
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = forPlayer ? 'story.json' : `${project.name.replace(/\s+/g, '_')}_SOURCE.nexus`;
        a.click();
      },
      importProjectFromJson: (jsonStr) => {
        try {
          const imported = JSON.parse(jsonStr);
          if (imported.scenes) {
            const sanitized = sanitizeProject(imported);
            set({ project: sanitized, selectedSceneId: sanitized.startSceneId || null, history: { past: [], future: [] } });
            if (sanitized.settings?.isPublished) {
              set({ mode: 'player' });
              get().startGame();
            } else {
              set({ mode: 'editor' });
            }
          }
        } catch (e) { console.error('Import Error:', e); }
      },
      loadExternalStory: async () => {
        try {
          const response = await fetch('story.json');
          if (response.ok) {
            const data = await response.json();
            get().importProjectFromJson(JSON.stringify(data));
          }
        } catch (e) {}
      },
      startGame: () => {
        const { project } = get();
        const sanitized = sanitizeProject(project);
        if (!sanitized.startSceneId) return;
        const initialVars: Record<string, any> = {};
        sanitized.variables.forEach(v => { initialVars[v.id] = v.defaultValue; });
        
        // Initial global track from settings
        let startTrackUrl = undefined;
        if (sanitized.settings.globalSoundtrackId) {
          const asset = sanitized.assets.find(a => a.id === sanitized.settings.globalSoundtrackId);
          if (asset) startTrackUrl = asset.data;
        }

        set({ 
          project: sanitized, 
          mode: 'player', 
          gameState: { 
            currentSceneId: sanitized.startSceneId, 
            history: [], 
            inventory: [], 
            party: [], 
            triggeredIds: [], 
            variableValues: initialVars, 
            variableTTLs: {}, 
            relationships: {}, 
            questStates: {}, 
            flags: {}, 
            changeLog: [],
            currentTrackUrl: startTrackUrl
          } 
        });
      },
      makeChoice: (choice) => set(s => {
        if (!s.gameState) return {};
        const state = s.gameState;
        const project = s.project;
        const nextState = { ...state };
        const newInventory = [...(state.inventory || [])];
        const newParty = [...(state.party || [])];
        const newVars = { ...(state.variableValues || {}) };
        const newRels = { ...(state.relationships || {}) };
        const newQuests = { ...(state.questStates || {}) };
        let newGlobalTrack = state.currentTrackUrl;

        const processActions = (actions: RuleAction[]) => {
          (actions || []).forEach(a => { 
            if (a.type === 'change_scene' && a.targetId) nextState.currentSceneId = (a.targetId as string); 
            if (a.type === 'give_item' && a.targetId && !newInventory.includes(a.targetId)) newInventory.push(a.targetId);
            if (a.type === 'remove_item' && a.targetId) { const idx = newInventory.indexOf(a.targetId); if (idx > -1) newInventory.splice(idx, 1); }
            if (a.type === 'mod_variable' && a.targetId) { const current = Number(newVars[a.targetId] || 0); newVars[a.targetId] = current + Number(a.value || 0); }
            if (a.type === 'mod_relationship' && a.targetId) { const char = project.characters.find(c => c.id === a.targetId); const current = Number(newRels[a.targetId] ?? (char?.initialRelationship || 0)); newRels[a.targetId] = current + Number(a.value || 0); }
            if (a.type === 'join_party' && a.targetId && !newParty.includes(a.targetId)) newParty.push(a.targetId);
            if (a.type === 'leave_party' && a.targetId) { const idx = newParty.indexOf(a.targetId); if (idx > -1) newParty.splice(idx, 1); }
            
            // Audio Events
            if (a.type === 'play_sound' && a.targetId) newGlobalTrack = (a.targetId as string);
            if (a.type === 'stop_sound') newGlobalTrack = undefined;

            // Quest Actions
            if (a.type === 'start_quest' && a.targetId) { 
               const q = project.quests.find(quest => quest.id === a.targetId); 
               if (q) newQuests[a.targetId] = { status: 'active', currentStageIds: q.initialStageIds || [] }; 
            }
            if (a.type === 'fail_quest' && a.targetId) {
               if (newQuests[a.targetId]) newQuests[a.targetId].status = 'failed';
            }
            if (a.type === 'end_quest' && a.targetId) {
               if (newQuests[a.targetId]) newQuests[a.targetId].status = 'completed';
            }
            if (a.type === 'advance_quest' && a.targetId) {
               const questId = (a.targetId as string);
               const q = project.quests.find(quest => quest.id === questId);
               if (q && newQuests[questId]) {
                 const currentStageId = newQuests[questId].currentStageIds[0];
                 const stage = q.stages.find(st => st.id === currentStageId);
                 if (stage && stage.nextStageIds.length > 0) {
                    newQuests[questId].currentStageIds = [stage.nextStageIds[0]];
                 } else {
                    newQuests[questId].status = 'completed';
                 }
               }
            }
          });
        };

        processActions(choice.actions);
        return { gameState: { ...nextState, inventory: newInventory, party: newParty, variableValues: newVars, relationships: newRels, questStates: newQuests, currentTrackUrl: newGlobalTrack, history: [...(state.history || []), state.currentSceneId] } };
      }),
      resetGame: () => { const { project } = get(); if (project.settings.isPublished) get().startGame(); else set({ mode: 'editor', gameState: null }); },
      quickSave: async () => { const { gameState } = get(); if (gameState) await idbSet('xenox_forge_quicksave', JSON.stringify(gameState)); },
      quickLoad: async () => { const saved = await idbGet('xenox_forge_quicksave'); if (saved) set({ gameState: JSON.parse(saved as string) }); },
      pauseGame: () => set(s => ({ gameState: s.gameState ? { ...s.gameState, isPaused: true } : null })),
      resumeGame: () => set(s => ({ gameState: s.gameState ? { ...s.gameState, isPaused: false } : null })),
      commitHistory: () => set(state => {
        const newPast = [...state.history.past, state.project];
        if (newPast.length > 50) newPast.shift();
        return { history: { past: newPast, future: [] } };
      }),
      undo: () => set(state => {
        if (state.history.past.length === 0) return {};
        const previous = state.history.past[state.history.past.length - 1];
        const newPast = state.history.past.slice(0, -1);
        return { project: previous, history: { past: newPast, future: [state.project, ...state.history.future] } };
      }),
      redo: () => set(state => {
        if (state.history.future.length === 0) return {};
        const next = state.history.future[0];
        const newFuture = state.history.future.slice(1);
        return { project: next, history: { past: [...state.history.past, state.project], future: newFuture } };
      }),
      runValidation: () => {
        const { project } = get();
        const results: any[] = [];
        (project.scenes || []).forEach(s => { 
           if (s.type === 'choice' && (s.choices || []).length < 2) results.push({ id: `err_ch_${s.id}`, type: 'warning', message: `Scene "${s.title}" needs 2+ choices.`, targetId: s.id }); 
        });
        (project.quests || []).forEach(q => {
           if (q.stages.length === 0) results.push({ id: `err_q_${q.id}`, type: 'error', message: `Quest "${q.name}" has no stages.`, targetId: q.id });
        });
        set({ validationResults: results });
      },
      executeDebugCommand: (cmd) => {
        const args = cmd.split(' ');
        const base = args[0].toLowerCase();
        if (base === 'set' && args.length >= 3) {
           const { gameState } = get();
           if (gameState) {
              const varId = args[1];
              const val = isNaN(Number(args[2])) ? args[2] : (args[2] === 'true' ? true : (args[2] === 'false' ? false : args[2]));
              set({ gameState: { ...gameState, variableValues: { ...gameState.variableValues, [varId]: val } } });
              return `Variable ${varId} set to ${val}`;
           }
        }
        return `Unknown: ${base}`;
      },
      toggleBreakpoint: (id, type) => set(s => { const exists = (s.debugSession.breakpoints || []).some(b => b.targetId === id); return { debugSession: { ...s.debugSession, breakpoints: exists ? s.debugSession.breakpoints.filter(b => b.targetId !== id) : [...(s.debugSession.breakpoints || []), { targetId: id, type }] } }; })
    }),
    { 
      name: STORAGE_KEY,
      storage: createJSONStorage(() => idbStorage as any),
      partialize: (state) => ({ project: state.project, gameState: state.gameState, mode: state.mode, language: state.language, activeView: state.activeView }),
    }
  )
);
