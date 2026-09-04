## 2025-05-18 - Map-based bulk updates in Zustand store
**Learning:** Replacing nested `.find()` inside `array.map()` with a pre-constructed `Map` for bulk ID lookups reduces store update complexity from O(N * U) to O(N + U), improving performance by ~11x during drag-and-drop actions.
**Action:** Always pre-build a `Map` when matching an array of updates/lookups against a target array in Zustand store actions or React components.
