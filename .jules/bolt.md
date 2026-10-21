## 2026-10-21 - Memoize Scene Lookup Map in GraphView
**Learning:** In React components rendering dense graphs (like interactive story scene connections), calling `.find()` inside nested loops (`flatMap`) scale quadratically $O(E \times N)$. Memoizing a `Map<string, Scene>` with `useMemo` drops iteration time from ~1,455ms to ~105ms for 1,000 scenes.
**Action:** Use `useMemo` at top-level component scope to build ID lookups instead of inline IIFEs or array searching inside render loops.
