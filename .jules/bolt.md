## 2025-05-14 - [GraphView Performance Optimization]
**Learning:** The GraphView rendering logic for edges was using nested `.find()` calls on the scenes array, leading to O(N^2) complexity. Additionally, all scene nodes were re-rendering during drag operations because they weren't memoized and received unstable inline arrow functions as props.
**Action:** Use a memoized Map (`useMemo`) for O(1) scene lookups during rendering. Extract node logic into a `React.memo` component and ensure all callbacks passed as props are stabilized with `useCallback`.
