## 2026-10-13 - Memoized Scene Map for SVG Edge Rendering in GraphView
**Learning:** Performing $O(N)$ `.find()` lookups per choice action inside nested `flatMap` iterations during SVG edge rendering scales quadratically $O(S^2 \cdot C)$ with scene count, causing heavy main thread lag. Memoizing a `Map<string, Scene>` via `useMemo` reduces target lookups to $O(1)$, yielding an ~8.18x speedup (1520ms -> 185ms for 1,000 scenes across 100 renders).
**Action:** Always memoize lookup maps (`useMemo(() => new Map(...))`) when resolving object references in multi-node graph canvas visualizations.
