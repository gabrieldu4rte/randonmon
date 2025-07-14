
export interface Move {
  name: string;
  power: number | null;
  priority: number;
  pp: number;
  type: string;
  damage_class: 'physical' | 'special' | 'status';
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
}

export interface GameState {
  playerTeam: Pokemon[];
  activePokemonIndex: number;
  enemyPokemon: Pokemon | null;
  wins: number;
  gamePhase: 'initial-selection' | 'battle' | 'post-battle' | 'learning-move' | 'game-over';
}