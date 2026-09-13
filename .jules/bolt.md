## 2026-09-13 - Graph Edge Lookups Optimization
**Learning:** Performing array `.find()` lookups per choice action inside SVG edge rendering loops creates an $O(N \times E)$ bottleneck on every re-render (such as during node drags). Converting to a memoized `Map` (`sceneMap`) reduced edge calculation time from 1,200.83ms to 39.24ms (~30.6x speedup) for 1,000 scenes.
**Action:** Always memoize node/item lookup maps when rendering visual graphs or SVG connection paths in React components.
