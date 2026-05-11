## 2026-05-11 - [Graph Optimization]
**Learning:** React components rendering graphs with many edges benefit significantly from O(1) Map lookups for scene/stage data, especially when using SVG to draw lines between nodes.
**Action:** Always prefer memoized lookup maps over repeated .find() calls in render loops.
