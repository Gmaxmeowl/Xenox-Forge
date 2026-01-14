
import React, { useEffect } from 'react';
import { useStore } from './store/useStore.ts';
import EditorLayout from './modules/editor/EditorLayout.tsx';
import PlayerEngine from './modules/player/PlayerEngine.tsx';

const App: React.FC = () => {
  const store = useStore();
  
  const mode = store.mode;
  const project = store.project;
  const loadExternalStory = store.loadExternalStory;
  const setMode = store.setMode;
  const startGame = store.startGame;

  useEffect(() => {
    if (typeof loadExternalStory === 'function') {
      loadExternalStory();
    }
  }, [loadExternalStory]);

  useEffect(() => {
    if (project?.settings?.isPublished) {
      if (typeof setMode === 'function') setMode('player');
      if (typeof startGame === 'function') startGame();
    }
  }, [project?.settings?.isPublished, setMode, startGame]);

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 flex flex-col">
      {mode === 'editor' && !project?.settings?.isPublished ? (
        <EditorLayout />
      ) : (
        <PlayerEngine />
      )}
    </div>
  );
};

export default App;
