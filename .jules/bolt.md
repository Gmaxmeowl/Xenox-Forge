## 2026-06-18 - Optimize Graph Edge Rendering
**Learning:** Nested array operations (like `.flatMap()` calling `.find()`) in React render loops lead to O(N^2) complexity, causing severe lag as the graph grows. Moving `useMemo` calls inside JSX expressions violates React hooks rules and can lead to initialization errors.
**Action:** Always pre-calculate lookup Maps using `useMemo` at the top level of the component and use them for O(1) lookups in the render path. Ensure hooks are declared in the correct order to avoid ReferenceErrors.
