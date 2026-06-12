## 2026-06-12 - Optimization Pattern: Map-based lookups for Graphs

**Learning:** Replacing nested `.find()` calls in React rendering loops and bulk state updates with pre-constructed `Map` lookups dramatically improves performance from $O(N \times U)$ or $O(E \times N)$ to $O(N + U)$ or $O(E)$. This is particularly critical in graph-based editors where connections (edges) are rendered by looking up node positions.

**Action:** Always check for repeated `.find()` calls in `flatMap` or loop structures within React components and `zustand` store actions. Use `useMemo` to construct a lookup `Map` for components and local `Map` for bulk update actions.
