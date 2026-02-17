# Bolt ⚡ Performance Journal

## 2024-11-20 - [Editor Drag Optimization]
**Learning:** Found several performance bottlenecks in the interactive story editor.
- **O(N^2) Render Loop:** Connection paths in GraphView.tsx were using nested loops with .find() on every render, causing lag as the number of scenes grew.
- **Full Store Subscriptions:** App.tsx and EditorLayout.tsx were subscribing to the entire store, causing the whole UI (sidebar, header, etc.) to re-render on every mouse move during a drag.
- **Persistence Pressure:** Every mouse move triggered a full project serialization and IndexedDB write via the persist middleware.

**Action:**
1. Use targeted selectors (e.g., useStore(s => s.property)) to isolate re-renders.
2. Use lookup Maps for O(N) scene lookups in both the store and the render loop.
3. Extract and memoize SceneNode components to prevent unnecessary re-renders.
