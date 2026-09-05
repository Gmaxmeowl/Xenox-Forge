## 2026-09-05 - Map-based O(1) Bulk Position Lookups in Store State

**Learning:** In interactive graph editors where position dragging emits updates continuously, using `updates.find(u => u.id === item.id)` inside a `.map()` over large collections results in $O(N \times U)$ complexity per drag event. Constructing a single `Map` beforehand (`if (!map.has(u.id)) map.set(...)`) reduces time complexity to $O(N + U)$ while preserving exact $Array.prototype.find()$ first-match ordering semantics.
**Action:** When handling bulk state updates over arrays in store methods, construct a lookup `Map` first using explicit `map.has(key)` checks.
