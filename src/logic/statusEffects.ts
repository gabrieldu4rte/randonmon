import { Pokemon, Move, StatModifiers } from "../interfaces";

export const DEFAULT_STAT_MODIFIERS: StatModifiers = {
  attack: 0,
  defense: 0,
  'special-attack': 0,
  'special-defense': 0,
  speed: 0,
  accuracy: 0,
  evasion: 0,
};

export function applyStatModifier(baseStat: number, modifier: number): number {
  const multiplier = modifier >= 0
    ? (2 + modifier) / 2
    : 2 / (2 + Math.abs(modifier));
  return Math.floor(baseStat * multiplier);
}

export function getModifiedStats(pokemon: Pokemon) {
  return {
    attack: applyStatModifier(pokemon.stats.attack, pokemon.statModifiers.attack),
    defense: applyStatModifier(pokemon.stats.defense, pokemon.statModifiers.defense),
    'special-attack': applyStatModifier(pokemon.stats['special-attack'], pokemon.statModifiers['special-attack']),
    'special-defense': applyStatModifier(pokemon.stats['special-defense'], pokemon.statModifiers['special-defense']),
    speed: applyStatModifier(pokemon.stats.speed, pokemon.statModifiers.speed),
  };
}

export function applyStatusEffect(pokemon: Pokemon, move: Move, user?: Pokemon): { success: boolean; message: string; damage?: number } {
  if (!move.effect) {
    return { success: false, message: '' };
  }

  if (move.effect_chance && Math.random() * 100 > move.effect_chance) {
    return { success: false, message: '' };
  }

  const effect = move.effect.toLowerCase();

  if (effect.includes('burn')) {
    if (pokemon.statusCondition?.type === 'burn') {
      return { success: false, message: `${pokemon.name} is already burned!` };
    }
    if (pokemon.types.includes('fire')) {
      return { success: false, message: `${pokemon.name} cannot be burned!` };
    }
    pokemon.statusCondition = { type: 'burn' };
    return { success: true, message: `${pokemon.name} was burned!` };
  }

  if (effect.includes('freeze')) {
    if (pokemon.statusCondition?.type === 'freeze') {
      return { success: false, message: `${pokemon.name} is already frozen!` };
    }
    if (pokemon.types.includes('ice')) {
      return { success: false, message: `${pokemon.name} cannot be frozen!` };
    }
    pokemon.statusCondition = { type: 'freeze' };
    return { success: true, message: `${pokemon.name} was frozen solid!` };
  }

  if (effect.includes('paralysis') || effect.includes('paralyze')) {
    if (pokemon.statusCondition?.type === 'paralysis') {
      return { success: false, message: `${pokemon.name} is already paralyzed!` };
    }
    if (pokemon.types.includes('electric')) {
      return { success: false, message: `${pokemon.name} cannot be paralyzed!` };
    }
    pokemon.statusCondition = { type: 'paralysis' };
    return { success: true, message: `${pokemon.name} is paralyzed! It may be unable to move!` };
  }

  if (effect.includes('badly poison')) {
    if (pokemon.statusCondition?.type === 'badly-poison' || pokemon.statusCondition?.type === 'poison') {
      return { success: false, message: `${pokemon.name} is already poisoned!` };
    }
    if (pokemon.types.includes('poison') || pokemon.types.includes('steel')) {
      return { success: false, message: `${pokemon.name} cannot be poisoned!` };
    }
    pokemon.statusCondition = { type: 'badly-poison', poisonCounter: 1 };
    return { success: true, message: `${pokemon.name} was badly poisoned!` };
  }

  if (effect.includes('poison')) {
    if (pokemon.statusCondition?.type === 'poison' || pokemon.statusCondition?.type === 'badly-poison') {
      return { success: false, message: `${pokemon.name} is already poisoned!` };
    }
    if (pokemon.types.includes('poison') || pokemon.types.includes('steel')) {
      return { success: false, message: `${pokemon.name} cannot be poisoned!` };
    }
    pokemon.statusCondition = { type: 'poison' };
    return { success: true, message: `${pokemon.name} was poisoned!` };
  }

  if (effect.includes('sleep')) {
    if (pokemon.statusCondition?.type === 'sleep') {
      return { success: false, message: `${pokemon.name} is already asleep!` };
    }
    pokemon.statusCondition = { type: 'sleep', turnsRemaining: Math.floor(Math.random() * 3) + 1 };
    return { success: true, message: `${pokemon.name} fell asleep!` };
  }

  if (effect.includes('confusion')) {
    if (pokemon.statusCondition?.type === 'confusion') {
      return { success: false, message: `${pokemon.name} is already confused!` };
    }
    pokemon.statusCondition = { type: 'confusion', turnsRemaining: Math.floor(Math.random() * 4) + 2 };
    return { success: true, message: `${pokemon.name} became confused!` };
  }

  if (effect.includes('flinch')) {
    pokemon.statusCondition = { type: 'flinch', turnsRemaining: 1 };
    return { success: true, message: `${pokemon.name} flinched!` };
  }

  if (effect.includes('bind')) {
    pokemon.statusCondition = { type: 'bind', turnsRemaining: Math.floor(Math.random() * 2) + 4, bindingMove: move.name };
    return { success: true, message: `${pokemon.name} was trapped!` };
  }

  if (effect.includes('user')) {
    const target = user || pokemon;
    return applyStatModification(target, effect);
  }

  if (effect.includes('attack') || effect.includes('defense') || effect.includes('speed') ||
    effect.includes('special-attack') || effect.includes('special-defense') ||
    effect.includes('accuracy') || effect.includes('evasion')) {
    return applyStatModification(pokemon, effect);
  }

  if (effect.includes('heal')) {
    if (!user) {
      return { success: false, message: 'No user specified for healing move!' };
    }

    if (effect.includes('full')) {
      const healAmount = user.stats.hp - user.currentHp;
      if (healAmount === 0) {
        return { success: false, message: `${user.name}'s HP is already full!` };
      }
      user.currentHp = user.stats.hp;

      if (effect.includes('sleep')) {
        user.statusCondition = { type: 'sleep', turnsRemaining: 2 };
        return { success: true, message: `${user.name} recovered all HP and fell asleep!` };
      }
      return { success: true, message: `${user.name} recovered all HP!` };
    }

    const healPercent = effect.includes('50%') ? 0.5 : 0.5;
    const healAmount = Math.floor(user.stats.hp * healPercent);
    const actualHeal = Math.min(healAmount, user.stats.hp - user.currentHp);

    if (actualHeal === 0) {
      return { success: false, message: `${user.name}'s HP is already full!` };
    }

    user.currentHp += actualHeal;
    return { success: true, message: `${user.name} recovered HP!` };
  }

  if (effect.includes('substitute')) {
    if (user && !user.hasSubstitute) {
      const cost = Math.floor(user.stats.hp / 4);
      if (user.currentHp <= cost) {
        return { success: false, message: `${user.name} doesn't have enough HP to create a substitute!` };
      }
      user.currentHp -= cost;
      user.hasSubstitute = true;
      user.substituteHp = cost;
      return { success: true, message: `${user.name} created a substitute!`, damage: cost };
    }
    return { success: false, message: `${user?.name || pokemon.name} already has a substitute!` };
  }

  if (effect.includes('protect')) {
    if (user) {
      user.isProtected = true;
      return { success: true, message: `${user.name} protected itself!` };
    }
  }

  if (effect.includes('taunt')) {
    pokemon.statusCondition = { type: 'taunt', turnsRemaining: 3 };
    return { success: true, message: `${pokemon.name} was taunted!` };
  }

  if (effect.includes('disable')) {
    if (pokemon.lastMoveUsed) {
      pokemon.statusCondition = { type: 'disable', turnsRemaining: 4, moveDisabled: pokemon.lastMoveUsed };
      return { success: true, message: `${pokemon.name}'s ${pokemon.lastMoveUsed} was disabled!` };
    }
    return { success: false, message: 'But it failed!' };
  }

  if (effect.includes('encore')) {
    if (pokemon.lastMoveUsed) {
      pokemon.statusCondition = { type: 'encore', turnsRemaining: 3, moveDisabled: pokemon.lastMoveUsed };
      return { success: true, message: `${pokemon.name} received an encore!` };
    }
    return { success: false, message: 'But it failed!' };
  }

  return { success: false, message: '' };
}

function applyStatModification(pokemon: Pokemon, effect: string): { success: boolean; message: string } {
  const stages = effect.includes('sharply') ? 2 : 1;
  const isDecrease = effect.includes('lower') || effect.includes('decrease');
  const change = isDecrease ? -stages : stages;

  let statName = '';
  let statKey: keyof StatModifiers = 'attack';

  if (effect.includes('attack')) {
    statName = 'Attack';
    statKey = 'attack';
  } else if (effect.includes('defense')) {
    statName = 'Defense';
    statKey = 'defense';
  } else if (effect.includes('special-attack')) {
    statName = 'Special Attack';
    statKey = 'special-attack';
  } else if (effect.includes('special-defense')) {
    statName = 'Special Defense';
    statKey = 'special-defense';
  } else if (effect.includes('speed')) {
    statName = 'Speed';
    statKey = 'speed';
  } else if (effect.includes('accuracy')) {
    statName = 'accuracy';
    statKey = 'accuracy';
  } else if (effect.includes('evasion')) {
    statName = 'evasiveness';
    statKey = 'evasion';
  }

  if (effect.includes('and')) {
    const results: string[] = [];
    const effects = effect.split(' and ');

    for (const singleEffect of effects) {
      const result = applyStatModification(pokemon, singleEffect.trim());
      if (result.success) {
        results.push(result.message);
      }
    }

    if (results.length > 0) {
      return { success: true, message: results.join(' ') };
    }
    return { success: false, message: '' };
  }

  if (pokemon.statModifiers[statKey] + change > 6) {
    return { success: false, message: `${pokemon.name}'s ${statName} won't go any higher!` };
  }
  if (pokemon.statModifiers[statKey] + change < -6) {
    return { success: false, message: `${pokemon.name}'s ${statName} won't go any lower!` };
  }

  pokemon.statModifiers[statKey] += change;
  const direction = change > 0 ? 'rose' : 'fell';
  const amount = Math.abs(change) > 1 ? ' sharply' : '';
  return { success: true, message: `${pokemon.name}'s ${statName}${amount} ${direction}!` };
}

export function processEndOfTurnStatusEffects(pokemon: Pokemon): { damage: number; message: string; cured: boolean } {
  if (!pokemon.statusCondition) {
    return { damage: 0, message: '', cured: false };
  }

  const status = pokemon.statusCondition;

  switch (status.type) {
    case 'burn':
      const burnDamage = Math.floor(pokemon.stats.hp / 16);
      pokemon.currentHp = Math.max(0, pokemon.currentHp - burnDamage);
      return { damage: burnDamage, message: `${pokemon.name} is hurt by its burn!`, cured: false };

    case 'poison':
      const poisonDamage = Math.floor(pokemon.stats.hp / 8);
      pokemon.currentHp = Math.max(0, pokemon.currentHp - poisonDamage);
      return { damage: poisonDamage, message: `${pokemon.name} is hurt by poison!`, cured: false };

    case 'badly-poison':
      const badlyPoisonDamage = Math.floor(pokemon.stats.hp * (status.poisonCounter || 1) / 16);
      pokemon.currentHp = Math.max(0, pokemon.currentHp - badlyPoisonDamage);
      if (status.poisonCounter) status.poisonCounter++;
      return { damage: badlyPoisonDamage, message: `${pokemon.name} is hurt by poison!`, cured: false };

    case 'bind':
      if (status.turnsRemaining && status.turnsRemaining > 0) {
        status.turnsRemaining--;
        const bindDamage = Math.floor(pokemon.stats.hp / 16);
        pokemon.currentHp = Math.max(0, pokemon.currentHp - bindDamage);

        if (status.turnsRemaining === 0) {
          pokemon.statusCondition = undefined;
          return { damage: bindDamage, message: `${pokemon.name} was freed from ${status.bindingMove}!`, cured: true };
        }
        return { damage: bindDamage, message: `${pokemon.name} is trapped by ${status.bindingMove}!`, cured: false };
      }
      break;

    case 'taunt':
    case 'disable':
    case 'encore':
      if (status.turnsRemaining && status.turnsRemaining > 0) {
        status.turnsRemaining--;
        if (status.turnsRemaining === 0) {
          pokemon.statusCondition = undefined;
          return { damage: 0, message: `${pokemon.name} is no longer affected by ${status.type}!`, cured: true };
        }
      }
      break;
  }

  return { damage: 0, message: '', cured: false };
}

export function processStatusCondition(pokemon: Pokemon): { damage: number; message: string; cured: boolean } {
  return processEndOfTurnStatusEffects(pokemon);
}

export function canMove(pokemon: Pokemon): { canMove: boolean; message: string; statusEffect?: { damage: number; message: string; cured: boolean } } {
  if (!pokemon.statusCondition) {
    return { canMove: true, message: '' };
  }

  const status = pokemon.statusCondition;

  switch (status.type) {
    case 'freeze':
      if (Math.random() < 0.2) {
        pokemon.statusCondition = undefined;
        return {
          canMove: true,
          message: '',
          statusEffect: { damage: 0, message: `${pokemon.name} thawed out!`, cured: true }
        };
      }
      return { canMove: false, message: `${pokemon.name} is frozen solid!` };

    case 'sleep':
      if (status.turnsRemaining && status.turnsRemaining > 0) {
        status.turnsRemaining--;
        if (status.turnsRemaining === 0) {
          pokemon.statusCondition = undefined;
          return {
            canMove: true,
            message: '',
            statusEffect: { damage: 0, message: `${pokemon.name} woke up!`, cured: true }
          };
        }
        return { canMove: false, message: `${pokemon.name} is fast asleep!` };
      }
      return { canMove: false, message: `${pokemon.name} is fast asleep!` };

    case 'paralysis':
      if (Math.random() < 0.25) {
        return { canMove: false, message: `${pokemon.name} is paralyzed and cannot move!` };
      }
      return { canMove: true, message: '' };

    case 'flinch':
      pokemon.statusCondition = undefined;
      return { canMove: false, message: `${pokemon.name} flinched and couldn't move!` };

    case 'bind':
      return { canMove: true, message: '' };

    case 'confusion':
      if (status.turnsRemaining && status.turnsRemaining > 0) {
        status.turnsRemaining--;
        if (status.turnsRemaining === 0) {
          pokemon.statusCondition = undefined;
          return {
            canMove: true,
            message: '',
            statusEffect: { damage: 0, message: `${pokemon.name} snapped out of its confusion!`, cured: true }
          };
        }

        if (Math.random() < 0.33) {
          const confusionDamage = Math.floor(pokemon.stats.hp / 8);
          pokemon.currentHp = Math.max(0, pokemon.currentHp - confusionDamage);
          return {
            canMove: false,
            message: `${pokemon.name} is confused!`,
            statusEffect: { damage: confusionDamage, message: `${pokemon.name} hurt itself in its confusion!`, cured: false }
          };
        }
        return { canMove: true, message: `${pokemon.name} is confused!` };
      }
      return { canMove: true, message: '' };

    default:
      return { canMove: true, message: '' };
  }
}

export function calculateSpecialMoveEffects(move: Move, attacker: Pokemon, defender: Pokemon, baseDamage: number): {
  damage: number;
  messages: string[];
  attackerHpChange: number;
  attackerFainted: boolean;
} {
  if (!move.effect) {
    return { damage: baseDamage, messages: [], attackerHpChange: 0, attackerFainted: false };
  }

  const effect = move.effect.toLowerCase();
  const messages: string[] = [];
  let finalDamage = baseDamage;
  let attackerHpChange = 0;
  let attackerFainted = false;

  if (effect.includes('multi-hit')) {
    const hits = Math.floor(Math.random() * 4) + 2; 
    finalDamage = baseDamage * hits;
    messages.push(`Hit ${hits} times!`);
  }

  if (effect.includes('recoil')) {
    const recoilPercent = effect.includes('25%') ? 0.25 : effect.includes('33%') ? 0.33 : 0.25;
    const recoilDamage = Math.floor(finalDamage * recoilPercent);
    attackerHpChange = -recoilDamage;
    messages.push(`${attacker.name} took recoil damage!`);
  }

  if (effect.includes('drain')) {
    const drainPercent = 0.5;
    const healAmount = Math.floor(finalDamage * drainPercent);
    const actualHeal = Math.min(healAmount, attacker.stats.hp - attacker.currentHp);
    if (actualHeal > 0) {
      attackerHpChange = actualHeal;
      messages.push(`${attacker.name} drained HP!`);
    }
  }

  if (effect.includes('ohko')) {
    if (attacker.level >= defender.level) {
      finalDamage = defender.currentHp;
      messages.push("It's a one-hit KO!");
    } else {
      finalDamage = 0;
      messages.push("But it failed!");
    }
  }

  if (effect.includes('level damage')) {
    finalDamage = attacker.level;
  }
  if (effect.includes('fixed 40')) {
    finalDamage = 40;
  }
  if (effect.includes('fixed 20')) {
    finalDamage = 20;
  }

  if (effect.includes('explode')) {
    attackerHpChange = -attacker.currentHp; 
    attackerFainted = true;
    finalDamage = Math.floor(finalDamage * 2); 
    messages.push(`${attacker.name} fainted from the explosion!`);
  }

  if (effect.includes('high critical')) {
    if (Math.random() < 0.125) { 
      finalDamage = Math.floor(finalDamage * 1.5);
      messages.push("A critical hit!");
    }
  }

  return { damage: finalDamage, messages, attackerHpChange, attackerFainted };
}