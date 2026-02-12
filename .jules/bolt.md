## 2026-02-12 - [Zustand Granular Selectors]
**Learning:** The codebase heavily used full store subscriptions (useStore()), causing root-level re-renders on every state change. Implementing granular selectors (useStore(s => s.prop)) at the root and in heavy components like GraphView significantly reduces the re-render surface.
**Action:** Always prefer targeted Zustand selectors over full store subscriptions, especially in root components or performance-critical views.
