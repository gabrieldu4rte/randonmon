import axios from 'axios';
import { Pokemon, Move } from '../interfaces';
import { DEFAULT_STAT_MODIFIERS } from '../logic/statusEffects';
import { calculateStatsForLevel } from '../logic/progression';
import { MOVE_DATABASE } from '../data/moveDatabase';

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';

async function getMoveDetails(moveUrl: string): Promise<Move> {
  const response = await axios.get(moveUrl);
  const moveData = response.data;

  const moveName = moveData.name;
  const moveInfo = MOVE_DATABASE[moveName];

  return {
    name: moveData.name,
    power: moveData.power,
    priority: moveData.priority,
    pp: moveData.pp,
    type: moveData.type.name,
    damage_class: moveData.damage_class.name,
    effect: moveInfo?.effect,
    effect_chance: moveInfo?.effect_chance,
  };
}

export async function getPokemonDetails(id: number | string): Promise<Pokemon> {
  const speciesResponse = await axios.get(`${POKEAPI_BASE_URL}/pokemon-species/${id}`);
  const pokemonResponse = await axios.get(`${POKEAPI_BASE_URL}/pokemon/${id}`);

  const pokemonData = pokemonResponse.data;
  const speciesData = speciesResponse.data;

  const gen1And2Moves = pokemonData.moves.filter((moveInfo: any) => {
    return moveInfo.version_group_details.some((versionDetail: any) => {
      const versionGroup = versionDetail.version_group.name;
      return ['red-blue', 'yellow', 'gold-silver', 'crystal'].includes(versionGroup) &&
        versionDetail.move_learn_method.name === 'level-up';
    });
  });

  const allMoves = gen1And2Moves.length > 0 ? gen1And2Moves : pokemonData.moves.slice(0, 8);
  const selectedMoves = allMoves.sort(() => 0.5 - Math.random()).slice(0, 4);

  const movesPromises = selectedMoves.map((move: any) => getMoveDetails(move.move.url));
  const moves = await Promise.all(movesPromises);

  const baseStats = pokemonData.stats.reduce((acc: any, statInfo: any) => {
    acc[statInfo.stat.name] = statInfo.base_stat;
    return acc;
  }, {});

  const calculatedStats = calculateStatsForLevel(baseStats, 5, true);

  return {
    id: pokemonData.id,
    name: pokemonData.name,
    level: 5,
    stats: calculatedStats,
    baseStats: baseStats,
    currentHp: calculatedStats.hp,
    moves: moves,
    sprites: pokemonData.sprites,
    types: pokemonData.types.map((typeInfo: any) => typeInfo.type.name),
    experience: 0,
    experienceToNextLevel: 100,
    captureRate: speciesData.capture_rate,
    statModifiers: { ...DEFAULT_STAT_MODIFIERS },
  };
}

export async function getRandomPokemonList(count: number = 3): Promise<Pokemon[]> {
  const randomIds: number[] = [];
  while (randomIds.length < count) {
    const randomId = Math.floor(Math.random() * 151) + 1;
    if (!randomIds.includes(randomId)) {
      randomIds.push(randomId);
    }
  }

  const pokemonPromises = randomIds.map(id => getPokemonDetails(id));
  return Promise.all(pokemonPromises);
}