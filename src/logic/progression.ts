import { Pokemon } from "../interfaces";

const XP_PER_LEVEL = 100;

export function calculateStatsForLevel(baseStats: Pokemon['stats'], level: number, isPlayer: boolean = false): Pokemon['stats'] {
  const calculatedStats = { ...baseStats };
  
  const hpIV = isPlayer ? 20 : 10; 
  calculatedStats.hp = Math.floor(((baseStats.hp + hpIV) * 2 * level) / 100) + level + 10;
  
  
  (Object.keys(baseStats) as Array<keyof typeof baseStats>).forEach(stat => {
    if (stat !== 'hp') {
      const iv = isPlayer ? 20 : 10; 
      calculatedStats[stat] = Math.floor(((baseStats[stat] + iv) * 2 * level) / 100) + 5;
    }
  });
  
  return calculatedStats;
}

export function calculateExperienceGain(victoriousPokemon: Pokemon, defeatedPokemon: Pokemon): number {
  const xp = Math.floor((defeatedPokemon.level * 70) / victoriousPokemon.level);
  return Math.max(10, xp);
}

export function checkForLevelUp(pokemon: Pokemon): { leveledUp: boolean; newPokemon: Pokemon; levelUpMessage: string } {
  let newPokemon = { ...pokemon };
  let leveledUp = false;

  while (newPokemon.experience >= newPokemon.experienceToNextLevel) {
    leveledUp = true;
    newPokemon.level++;
    newPokemon.experience -= newPokemon.experienceToNextLevel;
    newPokemon.experienceToNextLevel += XP_PER_LEVEL;
  }
  
  if (leveledUp) {
    newPokemon.stats = calculateStatsForLevel(newPokemon.baseStats, newPokemon.level, true);
    
    newPokemon.currentHp = newPokemon.stats.hp;
  }
  
  let levelUpMessage = '';
  if (leveledUp) {
    levelUpMessage = `${newPokemon.name} grew to level ${newPokemon.level}!`;
  }

  return { leveledUp, newPokemon, levelUpMessage };
}