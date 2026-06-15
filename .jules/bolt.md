## 2025-05-15 - Graph rendering optimization with Map lookups
**Learning:** Using `Array.find` inside nested loops for rendering graph edges (O(N^2) complexity) causes significant performance degradation as the number of scenes grows. Memoizing a `Map` of scenes by ID reduces lookup complexity to O(1) and overall rendering to O(N).
**Action:** Always prefer Map lookups for entity resolution by ID in complex UI components like graph editors. Combine this with granular Zustand selectors to minimize re-renders.
