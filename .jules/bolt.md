# Bolt's Journal - Critical Learnings Only

## 2025-01-24 - Quadratic Complexity in Graph Edge Rendering
**Learning:** In `GraphView.tsx`, resolving edge targets using nested `find` calls inside a `flatMap` resulted in quadratic-like performance ($O(E \times N)$). Using a memoized `Map` for constant-time lookups optimizes this to $O(E + N)$.
**Action:** Always check for repeated array scans within render loops or high-frequency callbacks and replace them with $O(1)$ lookups via a Map or Object.

## 2025-01-24 - Initializing Journal
**Learning:** Initializing the journal for the first time.
**Action:** Follow the mission to make things lightning fast.
