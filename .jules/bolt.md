## 2024-05-20 - [GraphView Rendering Bottleneck]
**Learning:** Resolving edge targets using nested `.find()` calls inside `flatMap` in `GraphView.tsx` resulted in $O(E \times N)$ performance, where $E$ is the number of edges and $N$ is the number of scenes. This caused noticeable lag during node dragging as the entire edge list was re-calculated and re-rendered.
**Action:** Use a memoized `Map` for constant-time scene lookups to optimize the calculation to $O(E + N)$. Additionally, use granular store selectors to prevent re-renders when unrelated project data changes.

## 2024-05-20 - [Zustand Bulk Update Bottleneck]
**Learning:** Bulk updates in `useStore.ts` (e.g., `updateScenesPositions`) were implemented using `.find()` inside a `.map()`, leading to $O(S \times U)$ complexity (Scenes $\times$ Updates). This becomes a bottleneck when dragging multiple nodes or performing large imports.
**Action:** Convert the updates array into a lookup Object/Map using `Object.fromEntries` to reduce complexity to $O(S + U)$.
