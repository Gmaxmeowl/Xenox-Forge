# Bolt Journal - Learnings & Benchmarks

## 2025-05-18 - Optimize Quest Stage Edge Rendering in QuestEditor
**Learning:** In SVG canvas graph editors like `QuestEditor.tsx`, graph edge rendering requires looking up target nodes by ID inside a nested loop over nodes and outbound edges. Using `Array.prototype.find()` yields $O(N^2)$ complexity per render frame. Memoizing a `Map<string, QuestStage>` with `useMemo` reduces lookup time from $O(N^2)$ to $O(N)$ ($O(1)$ lookup per edge).
**Action:** Always wrap node lookups in graph SVG rendering layers in a memoized `Map` lookup key.
