
import axios from 'axios';
import { Pokemon, Move } from '../interfaces';

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';

async function getMoveDetails(moveUrl: string): Promise<Move> {
  const response = await axios.get(moveUrl);
  const moveData = response.data;
  return {
    name: moveData.name,
    power: moveData.power,
    priority: moveData.priority,
    pp: moveData.pp,
    type: moveData.type.name,
    damage_class: moveData.damage_class.name,
  };
}

export async function getPokemonDetails(id: number | string): Promise<Pokemon> {
  const speciesResponse = await axios.get(`${POKEAPI_BASE_URL}/pokemon-species/${id}`);
  const pokemonResponse = await axios.get(`${POKEAPI_BASE_URL}/pokemon/${id}`);
  
  const pokemonData = pokemonResponse.data;
  const speciesData = speciesResponse.data;

  const allMoves = pokemonData.moves.map((moveInfo: any) => moveInfo.move);
  const selectedMoves = allMoves.sort(() => 0.5 - Math.random()).slice(0, 4);
  
  const movesPromises = selectedMoves.map((move: any) => getMoveDetails(move.url));
  const moves = await Promise.all(movesPromises);

  const stats = pokemonData.stats.reduce((acc: any, statInfo: any) => {
    acc[statInfo.stat.name] = statInfo.base_stat;
    return acc;
  }, {});

  return {
    id: pokemonData.id,
    name: pokemonData.name,
    level: 5,
    stats: stats,
    currentHp: stats.hp,
    moves: moves,
    sprites: pokemonData.sprites,
    types: pokemonData.types.map((typeInfo: any) => typeInfo.type.name),
    experience: 0,
    experienceToNextLevel: 100,
    captureRate: speciesData.capture_rate,
  };
}

export async function getRandomPokemonList(count: number = 3): Promise<Pokemon[]> {
  const randomIds: number[] = [];
  while (randomIds.length < count) {
    const randomId = Math.floor(Math.random() * 1025) + 1;
    if (!randomIds.includes(randomId)) {
      randomIds.push(randomId);
    }
  }

  const pokemonPromises = randomIds.map(id => getPokemonDetails(id));
  return Promise.all(pokemonPromises);
}