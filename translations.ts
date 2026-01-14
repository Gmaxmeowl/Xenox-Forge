
export const translations = {
  ru: {
    editor: {
      title: "XenoX Forge v2.5",
      searchPlaceholder: "Поиск по всему проекту...",
      autosave: "Автосохранение в",
      playtest: "Тестировать",
      graph: "Структура",
      sceneEditor: "Сценарий",
      characters: "Спутники",
      inventory: "Предметы",
      variables: "Память мира",
      quests: "Сюжеты",
      scenes: "Сцены",
      globalTags: "Теги",
      engineStatus: "ДВИЖОК",
      statusLive: "АКТИВЕН",
      validating: "Проверка проекта...",
      checkingOrphaned: "Ошибок не найдено.",
      ready: "Готов к работе.",
      help: "Справка"
    },
    variablesEditor: {
      title: "Память мира",
      groups: "Категории",
      allVariables: "Все данные",
      addVar: "СОЗДАТЬ ДАННУЮ"
    },
    help: {
      title: "Руководство XenoX Forge",
      intro: "Добро пожаловать в XenoX. Основные концепции:",
      sections: [
        {
          title: "Визуальная Структура",
          desc: "Используйте 'Структуру' для построения путей. Сцены — это узлы, связанные через выборы."
        },
        {
          title: "Логика Сюжета",
          desc: "Вы можете менять ход истории, проверяя предметы или 'Память мира' в редакторе."
        },
        {
          title: "Система Спутников",
          desc: "Персонажи могут помнить ваши поступки и менять отношение к вам автоматически."
        }
      ]
    },
    questsEditor: {
      title: "Редактор сюжета",
      noQuest: "Линии сюжета отсутствуют",
      noQuestDesc: "Создайте цели, чтобы игрок понимал, что делать дальше.",
      addQuest: "СОЗДАТЬ СЮЖЕТ",
      questName: "Название",
      description: "Описание",
      stages: "ЭТАПЫ ИСТОРИИ",
      addStage: "Добавить шаг",
      stageTitle: "Заголовок шага",
      stageType: "Тип",
      nextStages: "Следом",
      triggers: "СОБЫТИЯ",
      startConditions: "Требования",
      onStart: "Старт",
      onComplete: "Успех",
      onFail: "Провал",
      stageTypes: {
        dialogue: "Беседа",
        collect: "Находка",
        reach_location: "Место",
        variable_check: "Условие"
      }
    },
    inventoryEditor: {
      title: "Каталог вещей",
      noItem: "Склад пуст",
      noItemDesc: "Создайте предметы, которые игрок сможет найти.",
      addItem: "СОЗДАТЬ ВЕЩЬ",
      itemName: "Название",
      category: "Тип",
      rarity: "Ценность",
      properties: "СВОЙСТВА",
      usable: "Используемое",
      consumable: "Исчезает при использовании",
      discardable: "Можно выбросить",
      logic: "ЛОГИКА",
      addEffect: "Эффект",
      weight: "Вес",
      value: "Цена",
      categories: {
        weapon: "Экипировка",
        potion: "Расходник",
        key: "Ключ",
        document: "Записка",
        quest: "Сюжетный",
        misc: "Разное"
      },
      rarities: {
        common: "Обычный",
        uncommon: "Необычный",
        rare: "Редкий",
        epic: "Эпический",
        legendary: "Легендарный"
      }
    },
    sceneEditor: {
      selectScene: "Выберите сцену в списке слева",
      sceneTitle: "Название сцены",
      normal: "Повествование",
      choice: "Развилка",
      end: "Финал",
      normalDesc: "Линейная сцена. Переход происходит по нажатию кнопки 'Далее'.",
      choiceDesc: "Сцена требует от игрока выбора одного из нескольких путей.",
      endDesc: "Точка, где история заканчивается. Дальше путей нет.",
      storyPlaceholder: "Однажды в далекой-далекой галактике...",
      choices: "ВАРИАНТЫ ДЕЙСТВИЙ",
      nextBranch: "Переход к...",
      playerChoicePlaceholder: "Что скажет или сделает игрок?",
      linkToScene: "Связать с...",
      typeInfo: "ТИП СЦЕНЫ"
    },
    player: {
      observation: "Осмотреться",
      inventory: "Сумка",
      affinities: "Группа",
      codex: "Архив",
      quests: "Задачи",
      activeQuests: "В процессе",
      completedQuests: "Завершено",
      preferences: "Настройки",
      textSpeed: "Скорость текста",
      slow: "ПЛАВНО",
      instant: "МГНОВЕННО",
      displayMode: "Стиль",
      darkMode: "Ночь",
      sepia: "Старина",
      abandonJourney: "Выход",
      traveler: "Герой"
    }
  },
  en: {
    editor: {
      title: "XenoX Forge v2.5",
      searchPlaceholder: "Search project...",
      autosave: "Autosaved at",
      playtest: "Playtest",
      graph: "Flow",
      sceneEditor: "Scenario",
      characters: "Companions",
      inventory: "Items",
      variables: "World State",
      quests: "Plotlines",
      scenes: "Scenes",
      globalTags: "Tags",
      engineStatus: "ENGINE",
      statusLive: "ACTIVE",
      validating: "Validating...",
      checkingOrphaned: "No errors found.",
      ready: "Ready.",
      help: "Help"
    },
    variablesEditor: {
      title: "World State",
      groups: "Groups",
      allVariables: "All Data",
      addVar: "CREATE DATA"
    },
    help: {
      title: "XenoX Forge Guide",
      intro: "Welcome to XenoX. Core concepts:",
      sections: [
        {
          title: "Visual Structure",
          desc: "Use the 'Flow' tab to map out player journeys. Scenes are nodes connected by choices."
        },
        {
          title: "Logic & Conditions",
          desc: "Gate player choices by checking items or 'World State' in the editor."
        },
        {
          title: "Companion System",
          desc: "Characters can join parties or change loyalty automatically based on story events."
        }
      ]
    },
    questsEditor: {
      title: "Quest Editor",
      noQuest: "No plotlines logged",
      noQuestDesc: "Create objectives to guide the player through your story.",
      addQuest: "CREATE PLOT",
      questName: "Quest Title",
      description: "Description",
      stages: "STORY STEPS",
      addStage: "Add Step",
      stageTitle: "Step Title",
      stageType: "Type",
      nextStages: "Next",
      triggers: "EVENTS",
      startConditions: "Requirements",
      onStart: "Start",
      onComplete: "Success",
      onFail: "Fail",
      stageTypes: {
        dialogue: "Dialogue",
        collect: "Finding",
        reach_location: "Location",
        variable_check: "Logic"
      }
    },
    inventoryEditor: {
      title: "Item Catalog",
      noItem: "Storage is empty",
      noItemDesc: "Create items for the player to find and use.",
      addItem: "CREATE ITEM",
      itemName: "Item Name",
      category: "Category",
      rarity: "Value",
      properties: "PROPERTIES",
      usable: "Usable",
      consumable: "Used up on use",
      discardable: "Can be dropped",
      logic: "LOGIC",
      addEffect: "Effect",
      weight: "Weight",
      value: "Value",
      categories: {
        weapon: "Equipment",
        potion: "Consumable",
        key: "Key Item",
        document: "Note",
        quest: "Quest Item",
        misc: "Misc"
      },
      rarities: {
        common: "Common",
        uncommon: "Uncommon",
        rare: "Rare",
        epic: "Epic",
        legendary: "Legendary"
      }
    },
    sceneEditor: {
      selectScene: "Select a scene on the left",
      sceneTitle: "Scene Title",
      normal: "Narrative",
      choice: "Branch",
      end: "Finale",
      normalDesc: "Linear node. Transition happens on 'Next' button.",
      choiceDesc: "Requires at least 2 player options to branch the story.",
      endDesc: "The conclusion of a path. No exits.",
      storyPlaceholder: "Write the text for this scene...",
      choices: "PLAYER CHOICES",
      nextBranch: "Leads to...",
      playerChoicePlaceholder: "What will the player do?",
      linkToScene: "Link to...",
      typeInfo: "NODE TYPE"
    },
    player: {
      observation: "Observe",
      inventory: "Inventory",
      affinities: "Companions",
      codex: "Archives",
      quests: "Objectives",
      activeQuests: "In Progress",
      completedQuests: "Completed",
      preferences: "Settings",
      textSpeed: "Text Speed",
      slow: "SLOW",
      instant: "INSTANT",
      displayMode: "Style",
      darkMode: "Dark",
      sepia: "Sepia",
      abandonJourney: "Exit",
      traveler: "Protagonist"
    }
  }
};
