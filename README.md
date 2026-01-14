🌌 XenoX Forge v2.5 PRO: Профессиональная среда разработки интерактивного контента
XenoX Forge — это высокотехнологичный движок и визуальный редактор, созданный для проектирования глубоких, разветвленных и иммерсивных повествовательных миров. Платформа объединяет визуальное программирование, сложные системы отношений и передовые нейросетевые инструменты в одном интерфейсе.
✨ Ключевые Возможности
1. Визуальная Архитектура (Graph Flow)
Узловое проектирование: Создавайте структуру сюжета на бесконечном холсте. Визуализируйте связи между сценами и последствия выборов.
Snap-to-Grid & Auto-linking: Быстрое прототипирование с магнитной сеткой и интеллектуальным связыванием узлов.
Инспектор Сцен: Мощный контекстный редактор для каждой ноды, позволяющий настраивать фон, музыку и логику в один клик.
2. Нейросетевой Комплект (AI Intelligence)
AI Writer (Gemini): Генерация и расширение текстов сценария прямо в редакторе. ИИ учитывает контекст персонажей и лор вашего мира.
Neural Voice (TTS): Продвинутая озвучка текста пятью уникальными личностями (Kore, Zephyr, Charon, Fenrir, Puck) с использованием моделей Gemini 2.5 Flash.
Visual Generative Engine: Создание атмосферных фонов и аватаров персонажей по текстовому описанию через интеграцию с Pollinations AI.
3. Глубокая Игровая Логика
Память Мира (Global Variables): Система глобальных переменных (числа, флаги, строки) с поддержкой временных состояний и зависимостей.
Система Инвентаря: Предметы с категориями редкости, весом и настраиваемыми эффектами при использовании.
Квестовый Движок: Многоэтапные сюжетные линии с визуальным отслеживанием прогресса и ветвлением целей.
4. Динамические Спутники
Система Отношений: Персонажи помнят ваши действия. Уровень лояльности динамически влияет на доступные варианты выбора.
Авто-триггеры: Настройка поведения персонажей через систему "Если-То", позволяющая NPC реагировать на изменения в мире без ручного кодинга.
5. Иммерсивный Player Engine
Кинематографичный интерфейс: Эффект печатающегося текста, поддержка эмбиент-звука и визуальных эффектов.
Интеллектуальный HUD: Динамические окна инвентаря, группы и журнала квестов, доступные игроку в реальном времени.
Система Сохранений: Встроенная поддержка быстрых сохранений (QuickSave/QuickLoad) через IndexedDB.
🌌 XenoX Forge v2.5 PRO: Professional Interactive Storytelling Engine
XenoX Forge is a high-end Integrated Development Environment (IDE) tailored for narrative designers and interactive fiction creators. It bridges the gap between visual design and complex logic, offering a seamless experience from the first draft to the final release.
✨ Core Features
1. Visual Node Architecture (Graph Flow)
Node-Based Logic: Map out your story on an infinite canvas. Visualize complex branching paths and narrative consequences.
Productivity Tools: Snap-to-grid UI, undo/redo history, and intuitive drag-and-drop linking for rapid prototyping.
Scene Inspector: A deep context-sensitive editor for every node to manage backgrounds, ambients, and logic triggers.
2. Neural Integration Suite (AI Powered)
Neural Narrative (Gemini): Expand your prose with an AI assistant that understands your world's context, characters, and items.
Voice Core (TTS): Professional-grade text-to-speech with 5 distinct AI personalities (Kore, Zephyr, Charon, Fenrir, Puck) powered by Gemini 2.5 Flash models.
AI Asset Forge: Generate cinematic environments and character avatars instantly via integrated neural networks (Pollinations AI).
3. Sophisticated Game Logic
World State Memory: A robust variable system (Numbers, Booleans, Strings) with support for temporary flags and complex dependencies.
RPG-Grade Inventory: Item management including rarity tiers, weights, and customizable "on-use" action logic.
Quest Orchestrator: Multi-stage plotline management with visual progress tracking and branching objectives.
4. Living Companion System
Affinity Tracking: Characters evolve based on player decisions. Loyalty levels dynamically gate story paths and interactions.
Behavioral Triggers: Script NPC reactions using a visual "If-Then" system, allowing companions to respond to world events automatically.
5. Immersive Player Engine
Cinematic Playback: High-performance text rendering with typing effects, ambient sound layering, and smooth transitions.
Dynamic HUD: Real-time access to inventory, party stats, and quest logs through a sleek, futuristic interface.
State Persistence: Native QuickSave and QuickLoad support utilizing encrypted local storage (IndexedDB).
Tech Stack: React 19, TypeScript, Zustand 5, Tailwind CSS, Google Gemini API, Pollinations AI, IndexedDB.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
