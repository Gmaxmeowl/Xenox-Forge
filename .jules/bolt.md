## 2026-10-14 - Map Lookup Optimization in React Render Loops
**Learning:** Nested array `.find()` lookups inside SVG edge loops during graph rendering cause $O(N \times E)$ frame times, causing noticeable stutter during canvas dragging.
**Action:** Always memoize array-to-Map lookup indexes (`useMemo`) when rendering graph edges or relationships.
