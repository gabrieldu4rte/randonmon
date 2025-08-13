import { Pokemon, Move } from "../interfaces";
import { getModifiedStats } from "./statusEffects";

const typeChart: { [attacker: string]: { [defender: string]: number } } = {
  normal: {
    rock: 0.5,
    ghost: 0,
    steel: 0.5,
  },
  fire: {
    fire: 0.5,
    water: 0.5,
    grass: 2,
    ice: 2,
    bug: 2,
    rock: 0.5,
    dragon: 0.5,
    steel: 2,
  },
  water: {
    fire: 2,
    water: 0.5,
    grass: 0.5,
    ground: 2,
    rock: 2,
    dragon: 0.5,
  },
  electric: {
    water: 2,
    electric: 0.5,
    grass: 0.5,
    ground: 0,
    flying: 2,
    dragon: 0.5,
  },
  grass: {
    fire: 0.5,
    water: 2,
    grass: 0.5,
    poison: 0.5,
    ground: 2,
    flying: 0.5,
    bug: 0.5,
    rock: 2,
    dragon: 0.5,
    steel: 0.5,
  },
  ice: {
    fire: 0.5,
    water: 0.5,
    grass: 2,
    ice: 0.5,
    ground: 2,
    flying: 2,
    dragon: 2,
    steel: 0.5,
  },
  fighting: {
    normal: 2,
    ice: 2,
    rock: 2,
    dark: 2,
    steel: 2,
    poison: 0.5,
    flying: 0.5,
    psychic: 0.5,
    bug: 0.5,
    ghost: 0,
    fairy: 0.5,
  },
  poison: {
    grass: 2,
    poison: 0.5,
    ground: 0.5,
    rock: 0.5,
    ghost: 0.5,
    steel: 0,
    fairy: 2,
  },
  ground: {
    fire: 2,
    electric: 2,
    grass: 0.5,
    poison: 2,
    flying: 0,
    bug: 0.5,
    rock: 2,
    steel: 2,
  },
  flying: {
    electric: 0.5,
    grass: 2,
    fighting: 2,
    bug: 2,
    rock: 0.5,
    steel: 0.5,
  },
  psychic: {
    fighting: 2,
    poison: 2,
    psychic: 0.5,
    dark: 0,
    steel: 0.5,
  },
  bug: {
    fire: 0.5,
    grass: 2,
    fighting: 0.5,
    poison: 0.5,
    flying: 0.5,
    psychic: 2,
    ghost: 0.5,
    dark: 2,
    steel: 0.5,
    fairy: 0.5,
  },
  rock: {
    fire: 2,
    ice: 2,
    fighting: 0.5,
    ground: 0.5,
    flying: 2,
    bug: 2,
    steel: 0.5,
  },
  ghost: {
    normal: 0,
    psychic: 2,
    ghost: 2,
    dark: 0.5,
  },
  dragon: {
    dragon: 2,
    steel: 0.5,
    fairy: 0,
  },
  dark: {
    fighting: 0.5,
    psychic: 2,
    ghost: 2,
    dark: 0.5,
    fairy: 0.5,
  },
  steel: {
    fire: 0.5,
    water: 0.5,
    electric: 0.5,
    ice: 2,
    rock: 2,
    fairy: 2,
    steel: 0.5,
  },
  fairy: {
    fire: 0.5,
    fighting: 2,
    dragon: 2,
    dark: 2,
    poison: 0.5,
    steel: 0.5,
  },
};

function getTypeEffectiveness(attackerType: string, defenderTypes: string[]): number {
    let effectiveness = 1;
    for (const defenderType of defenderTypes) {
        if (typeChart[attackerType] && typeChart[attackerType][defenderType] !== undefined) {
            effectiveness *= typeChart[attackerType][defenderType];
        }
    }
    return effectiveness;
}

export function calculateDamage(attacker: Pokemon, defender: Pokemon, move: Move): { damage: number; effectivenessMessage: string } {
  if (move.power === null || move.damage_class === 'status') {
    return { damage: 0, effectivenessMessage: '' };
  }

  const isSpecial = move.damage_class === 'special';
  const attackerStats = getModifiedStats(attacker);
  const defenderStats = getModifiedStats(defender);
  const attackStat = isSpecial ? attackerStats['special-attack'] : attackerStats.attack;
  const defenseStat = isSpecial ? defenderStats['special-defense'] : defenderStats.defense;
  
  const stab = attacker.types.includes(move.type) ? 1.5 : 1;
  const effectiveness = getTypeEffectiveness(move.type, defender.types);
  const randomFactor = Math.random() * (1 - 0.85) + 0.85;

  const baseDamage = (((2 * attacker.level / 5 + 2) * move.power * (attackStat / defenseStat)) / 50) + 2;
  
  let finalDamage = Math.floor(baseDamage * stab * effectiveness * randomFactor);
  
  if (attacker.statusCondition?.type === 'burn' && !isSpecial) {
    finalDamage = Math.floor(finalDamage * 0.5);
  }
  
  let effectivenessMessage = '';
  if (effectiveness > 1) effectivenessMessage = "It's super effective!";
  if (effectiveness < 1 && effectiveness > 0) effectivenessMessage = "It's not very effective...";
  if (effectiveness === 0) effectivenessMessage = "No effect!";

  return { damage: finalDamage, effectivenessMessage };
}