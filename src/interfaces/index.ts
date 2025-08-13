
export interface Move {
  name: string;
  power: number | null;
  priority: number;
  pp: number;
  type: string;
  damage_class: 'physical' | 'special' | 'status';
  effect?: string;
  effect_chance?: number;
}

export interface StatusCondition {
  type: 'burn' | 'freeze' | 'paralysis' | 'poison' | 'badly-poison' | 'sleep' | 'confusion' | 'flinch' | 'bind' | 'taunt' | 'encore' | 'disable';
  turnsRemaining?: number;
  moveDisabled?: string;
  bindingMove?: string;
  poisonCounter?: number;
}

export interface StatModifiers {
  attack: number;
  defense: number;
  'special-attack': number;
  'special-defense': number;
  speed: number;
  accuracy: number;
  evasion: number;
}

export interface Pokemon {
  id: number;
  name: string;
  level: number;
  stats: {
    hp: number;
    attack: number;
    defense: number;
    'special-attack': number;
    'special-defense': number;
    speed: number;
  };
  baseStats: {
    hp: number;
    attack: number;
    defense: number;
    'special-attack': number;
    'special-defense': number;
    speed: number;
  };
  currentHp: number;
  moves: Move[];
  sprites: {
    front_default: string;
    back_default: string;
  };
  types: string[];
  experience: number;
  experienceToNextLevel: number;
  captureRate: number;
  statusCondition?: StatusCondition;
  statModifiers: StatModifiers;
  hasSubstitute?: boolean;
  substituteHp?: number;
  isProtected?: boolean;
  lastMoveUsed?: string;
  chargingMove?: string;
}

export interface GameState {
  playerTeam: Pokemon[];
  activePokemonIndex: number;
  enemyPokemon: Pokemon | null;
  wins: number;
  gamePhase: 'initial-selection' | 'battle' | 'post-battle' | 'learning-move' | 'game-over';
}