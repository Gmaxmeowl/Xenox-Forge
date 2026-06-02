## 2026-06-02 - Map-based lookup optimization for Graph and Store

**Learning:** In a graph-based editor where connections (edges) are derived from nested data (choices -> actions -> targetId), O(N^2) or O(N*M) bottlenecks quickly emerge in React render loops and Zustand store updates. Replacing `.find()` with memoized `Map` lookups is essential for maintaining 60fps during interactions like dragging or connecting nodes, especially as the number of scenes/stages grows beyond 100.

**Action:** Always check for nested `.find()` or `.filter()` calls inside `.map()` or `.flatMap()` within React components and Zustand `set` functions. Implement memoized Map-based lookups for any array that serves as a target for multiple ID-based resolutions.
