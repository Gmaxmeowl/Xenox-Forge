
import React, { useEffect } from 'react';
import { useStore } from './store/useStore.ts';
import EditorLayout from './modules/editor/EditorLayout.tsx';
import PlayerEngine from './modules/player/PlayerEngine.tsx';

const App: React.FC = () => {
  // Performance: Using targeted selectors to prevent re-renders on unrelated store changes
  const mode = useStore(s => s.mode);
  const isPublished = useStore(s => s.project?.settings?.isPublished);
  const loadExternalStory = useStore(s => s.loadExternalStory);
  const setMode = useStore(s => s.setMode);
  const startGame = useStore(s => s.startGame);

  useEffect(() => {
    if (typeof loadExternalStory === 'function') {
      loadExternalStory();
    }
  }, [loadExternalStory]);

  useEffect(() => {
    if (isPublished) {
      if (typeof setMode === 'function') setMode('player');
      if (typeof startGame === 'function') startGame();
    }
  }, [isPublished, setMode, startGame]);

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 flex flex-col">
      {mode === 'editor' && !isPublished ? (
        <EditorLayout />
      ) : (
        <PlayerEngine />
      )}
    </div>
  );
};

export default App;
