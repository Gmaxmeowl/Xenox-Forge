## 2026-06-14 - Bulk Position Update Bottleneck
**Learning:** Bulk updates in Zustand store using `.map()` with an internal `.find()` for lookups create an (N \times U)$ bottleneck (where N is total items and U is updates). This causes significant UI lag when dragging multiple nodes in the GraphView or QuestEditor.
**Action:** Always use a pre-constructed `Map` for lookups when performing bulk updates in the store to achieve (N + U)$ complexity. Ensure strict `!== undefined` checks when retrieving from the map to handle falsy but valid values.
