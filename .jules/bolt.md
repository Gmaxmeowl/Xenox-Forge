## 2025-02-23 - Map-based lookup for React graph SVG edge rendering
**Learning:** In React graph visualization components like `GraphView.tsx`, rendering SVG edge paths by searching target nodes with `Array.prototype.find()` scales quadratically as $O(N \cdot E)$. Memoizing a `Map<string, Scene>` key-value lookup reduces execution time by over ~30x–40x for large scene trees (e.g., 1.42s down to ~43-49ms for 1,000 nodes across 100 renders).
**Action:** Always memoize node/item dictionaries into a `Map` when performing repeated lookup queries across collections inside React component renders.
