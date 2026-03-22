## 2024-05-22 - [Algorithmic Optimization in Graph Rendering]
**Learning:** Resolving edge targets using nested `find` calls inside a `flatMap` resulted in quadratic-like performance ((E \times N)$). Using a memoized `Map` for constant-time lookups optimizes this to (E + N)$.
**Action:** Always prefer `Map` or `Record` for lookups within render loops or store updates involving large arrays.

## 2024-05-22 - [Zustand Selector Performance]
**Learning:** Broad store subscriptions (e.g., `useStore(s => s.project)`) trigger re-renders even when unrelated nested properties change.
**Action:** Use granular selectors (e.g., `useStore(s => s.project.scenes)`) to isolate component updates to only the necessary state slices.
