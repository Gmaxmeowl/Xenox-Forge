# Bolt's Performance Journal

## 2025-01-24 - Initial Assessment
**Learning:** Found O(N*U) bottleneck in store updates for scene positions and O(N*E) bottleneck in GraphView edge rendering. Store updates are called on every mouse move during drag, making them high-frequency targets.
**Action:** Plan to refactor bulk updates to use Map lookups for O(N+U) complexity.
