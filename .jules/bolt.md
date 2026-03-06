# Bolt's Performance Journal

## 2025-05-14 - [O(N^2) Bottleneck in GraphView and Store Updates]
**Learning:** Found O(E * N) complexity in `GraphView.tsx` where every edge rendering performed an `Array.find` on scenes. Also identified O(N * U) complexity in store update functions (`updateScenesPositions`) where each scene in the project was checked against an array of updates using `Array.find`.
**Action:** Use `useMemo` to create lookup Maps for O(1) access in render loops. Use lookup Objects/Maps in store update logic to achieve O(N + U) complexity instead of O(N * U).
