## 2024-11-20 - Map-based positional updates in store
**Learning:** Nested array search operations (.find inside .map) during high-frequency node dragging and stage positioning lead to performance degradation of O(N * U) complexity.
**Action:** Use Map-based lookups to pre-index the updates and replace `.find` with O(1) map retrieval `.get`, reducing complexity to O(N + U).
