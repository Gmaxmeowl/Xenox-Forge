## 2025-05-18 - Memoize O(1) Map Lookups for Graph Edges
**Learning:** In node/graph canvas editors (such as `GraphView.tsx`), rendering connections between nodes via nested `.flatMap()` with `array.find()` runs $O(N^2)$ array scans on every render frame (including `mousemove` events during drag and drop).
**Action:** Always wrap node arrays in a memoized `Map` (`useMemo(() => new Map(items.map(i => [i.id, i])), [items])`) to convert edge resolution lookups to $O(1)$.
