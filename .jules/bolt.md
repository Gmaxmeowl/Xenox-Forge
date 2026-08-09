# Bolt's Performance Journal

## 2025-02-15 - GraphView Scene Lookup Optimization
**Learning:** Performing multiple nested `Array.prototype.find` linear lookups on a large list of scenes during interactive rendering and state/mouse drag handlers causes significant UI lag and frames dropped because of $O(N)$ lookup complexity. Utilizing a memoized React `Map` created via `useMemo` optimizes lookups to $O(1)$ constant time.
**Action:** When working with rendering layers like SVG connections and node connectors that undergo frequent updates during mouse interactions, always map the nodes to a memoized Map lookup structure instead of using inline search lookups.
