
export type SceneType = 'normal' | 'choice' | 'end';

export type ConditionType = 'item' | 'relationship' | 'flag' | 'variable' | 'time' | 'quest' | 'scene';
export type ConditionOperator = 'gt' | 'lt' | 'eq' | 'gte' | 'lte' | 'has' | 'has_not' | 'set' | 'not_set' | 'at_scene' | 'quest_status' | 'quest_stage';

export interface RuleCondition {
  id: string;
  type: ConditionType;
  targetId?: string;
  operator: ConditionOperator;
  value?: string | number | boolean;
}

export type ActionType = 
  | 'give_item' | 'remove_item' 
  | 'mod_relationship' | 'set_flag' 
  | 'mod_variable' | 'play_sound' | 'stop_sound'
  | 'change_scene' | 'show_msg'
  | 'start_quest' | 'end_quest'
  | 'advance_quest' | 'fail_quest'
  | 'join_party' | 'leave_party'
  | 'use_item'
  | 'set_timer';

export interface RuleAction {
  id: string;
  type: ActionType;
  targetId?: string;
  value?: string | number | boolean;
  volume?: number;
}

export interface Choice {
  id: string;
  text: string;
  conditions: RuleCondition[];
  logicOperator: 'AND' | 'OR';
  actions: RuleAction[];
  elseActions: RuleAction[];
}

export interface Rule {
  id: string;
  type: 'condition' | 'action';
  logic: string;
}

export interface Scene {
  id: string;
  title: string;
  content: string;
  type: SceneType;
  folder?: string; 
  backgroundUrl: string;
  ambientUrl?: string;
  backgroundFit?: 'cover' | 'contain' | 'fill';
  choices: Choice[];
  rules: Rule[];
  tags: string[];
  position: { x: number; y: number };
}

export interface CharacterTrigger {
  id: string;
  name: string;
  conditions: RuleCondition[];
  actions: RuleAction[];
  isOneTime: boolean;
  priority: number;
}

export interface Character {
  id: string;
  name: string;
  role: string;
  description: string;
  avatar: string;
  initialRelationship: number;
  traits: Record<string, number>;
  relationships: Record<string, number>;
  triggers: CharacterTrigger[];
  colorTag: string;
}

export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type ItemCategory = 'weapon' | 'potion' | 'key' | 'document' | 'quest' | 'misc';

export interface Item {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: ItemCategory;
  rarity: ItemRarity;
  weight: number;
  value: number;
  isUsable: boolean;
  isConsumable: boolean;
  isDiscardable: boolean;
  useConditions: RuleCondition[];
  useActions: RuleAction[];
}

export type VariableValueType = 'boolean' | 'number' | 'string' | 'list' | 'timer';

export interface VariableGroup {
  id: string;
  name: string;
  parentGroupId?: string;
  color?: string;
}

export interface VariableDependency {
  variableId: string;
  type: 'requires' | 'conflicts';
}

export interface ProjectVariable {
  id: string;
  name: string;
  type: VariableValueType;
  defaultValue: any;
  priority: number;
  groupId?: string; 
  isTemporary: boolean;
  resetAfterScenes: number;
  min?: number;
  max?: number;
  step?: number;
  pattern?: string;
  allowedValues?: string[];
  autoIncrement?: number;
  dependencies: VariableDependency[];
}

export type QuestStatus = 'not_started' | 'active' | 'completed' | 'failed';
export type QuestStageType = 'dialogue' | 'collect' | 'reach_location' | 'variable_check';

export interface QuestStage {
  id: string;
  title: string;
  description: string;
  type: QuestStageType;
  conditions: RuleCondition[];
  completionActions: RuleAction[];
  nextStageIds: string[];
  position: { x: number; y: number };
}

export interface Quest {
  id: string;
  name: string;
  description: string;
  icon: string;
  startConditions: RuleCondition[];
  onStartActions: RuleAction[];
  onCompleteActions: RuleAction[];
  onFailActions: RuleAction[];
  stages: QuestStage[];
  initialStageIds: string[];
}

export type AssetType = 'image' | 'audio';

export interface MediaAsset {
  id: string;
  name: string;
  type: AssetType;
  data: string;
  mimeType: string;
  tags: string[];
}

export interface ProjectSettings {
  autosaveEnabled: boolean;
  autosaveInterval: number;
  editorFontSize: number;
  editorTheme: 'dark' | 'contrast';
  defaultLanguage: 'ru' | 'en';
  isPublished: boolean;
  hudInventoryEnabled: boolean;
  hudCompanionsEnabled: boolean;
  hudQuestsEnabled: boolean;
  hudSettingsEnabled: boolean;
  ttsEnabled: boolean;
  defaultVoice: string;
  ttsSpeed?: number;
  globalSoundtrackId?: string; // ID of the asset to play on game start
}

export interface Project {
  id: string;
  name: string;
  description: string;
  startSceneId: string;
  startingParty: string[]; 
  scenes: Scene[];
  characters: Character[];
  items: Item[];
  quests: Quest[];
  assets: MediaAsset[];
  variables: ProjectVariable[];
  variableGroups: VariableGroup[];
  settings: ProjectSettings;
  flags: Record<string, boolean>; 
}

export interface GameState {
  currentSceneId: string;
  history: string[];
  inventory: string[];
  party: string[];
  triggeredIds: string[];
  variableValues: Record<string, any>;
  variableTTLs: Record<string, number>; 
  relationships: Record<string, number>;
  questStates: Record<string, { status: QuestStatus, currentStageIds: string[] }>;
  flags: Record<string, boolean>; 
  changeLog: any[];
  activeTrackId?: string;
  currentTrackUrl?: string; // Global persistent track URL
  isPaused?: boolean;
}
