## 2025-03-29 - [GraphView Performance Patterns]
**Learning:** In `GraphView.tsx`, resolving edge targets using nested `find` calls inside a `flatMap` resulted in quadratic-like performance ($O(E \times N)$). Using a memoized `Map` for constant-time lookups optimizes this to $O(E + N)$. Additionally, utilizing granular store selectors for `scenes` and `startSceneId` prevents the entire component from re-rendering on unrelated project state updates (e.g., changes to characters, items, or quests).
**Action:** Always prefer memoized lookup Maps for array-based associations in render loops and use granular selectors for large Zustand stores.

## 2025-03-29 - [Zustand Bulk Update Optimization]
**Learning:** In `store/useStore.ts`, optimizing bulk updates (like `updateScenesPositions`) by converting the updates array into a lookup Object/Map reduces complexity from $O(N \times U)$ to $O(N + U)$, which is critical for smooth dragging interactions in the editor.
**Action:** Use `Object.fromEntries(updates.map(u => [u.id, u.value]))` to create a lookup map before iterating over the main state array in bulk update actions.
