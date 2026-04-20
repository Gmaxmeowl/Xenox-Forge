## 2025-05-22 - [Algorithmic Bottleneck in State Updates]
**Learning:** The Zustand store previously used nested `.find()` calls within `.map()` for bulk updates (e.g., `updateScenesPositions`). This resulted in $O(N \times U)$ complexity, where $N$ is the total number of scenes and $U$ is the number of updates. During dragging operations, $U$ can be large, leading to noticeable UI stutter in complex stories.
**Action:** Always refactor bulk list updates to use a lookup Map or Object to achieve $O(N + U)$ complexity.

## 2025-05-22 - [React Graph Rendering Bottleneck]
**Learning:** Rendering thousands of SVG paths in `GraphView.tsx` on every mouse move (even if the paths didn't change) is a major performance drain. Combined with broad state selectors that trigger re-renders on unrelated project changes, this makes the visual editor feel sluggish.
**Action:** Use granular selectors for Zustand state and wrap expensive JSX generations (like SVG edges) in `useMemo` to isolate them from frequent mouse-tracking updates.
