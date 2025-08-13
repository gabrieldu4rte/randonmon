export const MOVE_DATABASE: { [key: string]: { effect: string; effect_chance?: number; description: string } } = {

  'thunder-wave': {
    effect: 'paralysis',
    effect_chance: 100,
    description: 'Paralyzes the target, reducing speed and potentially preventing movement'
  },
  'toxic': {
    effect: 'badly poison',
    effect_chance: 100,
    description: 'Badly poisons the target, damage increases each turn'
  },
  'poison-powder': {
    effect: 'poison',
    effect_chance: 75,
    description: 'Poisons the target'
  },
  'poisongas': {
    effect: 'poison',
    effect_chance: 80,
    description: 'Poisons the target'
  },
  'sleep-powder': {
    effect: 'sleep',
    effect_chance: 75,
    description: 'Puts the target to sleep'
  },
  'spore': {
    effect: 'sleep',
    effect_chance: 100,
    description: 'Puts the target to sleep with 100% accuracy'
  },
  'lovely-kiss': {
    effect: 'sleep',
    effect_chance: 75,
    description: 'Puts the target to sleep'
  },
  'sing': {
    effect: 'sleep',
    effect_chance: 55,
    description: 'Puts the target to sleep'
  },
  'hypnosis': {
    effect: 'sleep',
    effect_chance: 60,
    description: 'Puts the target to sleep'
  },
  'confuse-ray': {
    effect: 'confusion',
    effect_chance: 100,
    description: 'Confuses the target'
  },
  'supersonic': {
    effect: 'confusion',
    effect_chance: 55,
    description: 'Confuses the target'
  },
  'sweet-kiss': {
    effect: 'confusion',
    effect_chance: 75,
    description: 'Confuses the target'
  },
  'stun-spore': {
    effect: 'paralysis',
    effect_chance: 75,
    description: 'Paralyzes the target'
  },


  'swords-dance': {
    effect: 'sharply raise user attack',
    effect_chance: 100,
    description: 'Sharply raises the user\'s Attack stat'
  },
  'defense-curl': {
    effect: 'raise user defense',
    effect_chance: 100,
    description: 'Raises the user\'s Defense stat'
  },
  'harden': {
    effect: 'raise user defense',
    effect_chance: 100,
    description: 'Raises the user\'s Defense stat'
  },
  'withdraw': {
    effect: 'raise user defense',
    effect_chance: 100,
    description: 'Raises the user\'s Defense stat'
  },
  'agility': {
    effect: 'sharply raise user speed',
    effect_chance: 100,
    description: 'Sharply raises the user\'s Speed stat'
  },
  'amnesia': {
    effect: 'sharply raise user special-defense',
    effect_chance: 100,
    description: 'Sharply raises the user\'s Special Defense stat'
  },
  'barrier': {
    effect: 'sharply raise user defense',
    effect_chance: 100,
    description: 'Sharply raises the user\'s Defense stat'
  },
  'meditate': {
    effect: 'raise user attack',
    effect_chance: 100,
    description: 'Raises the user\'s Attack stat'
  },
  'sharpen': {
    effect: 'raise user attack',
    effect_chance: 100,
    description: 'Raises the user\'s Attack stat'
  },
  'curse': {
    effect: 'raise user attack and defense lower user speed',
    effect_chance: 100,
    description: 'Raises Attack and Defense but lowers Speed'
  },


  'growl': {
    effect: 'lower attack',
    effect_chance: 100,
    description: 'Lowers the target\'s Attack stat'
  },
  'tail-whip': {
    effect: 'lower defense',
    effect_chance: 100,
    description: 'Lowers the target\'s Defense stat'
  },
  'leer': {
    effect: 'lower defense',
    effect_chance: 100,
    description: 'Lowers the target\'s Defense stat'
  },
  'string-shot': {
    effect: 'lower speed',
    effect_chance: 100,
    description: 'Lowers the target\'s Speed stat'
  },
  'sand-attack': {
    effect: 'lower accuracy',
    effect_chance: 100,
    description: 'Lowers the target\'s accuracy'
  },
  'smokescreen': {
    effect: 'lower accuracy',
    effect_chance: 100,
    description: 'Lowers the target\'s accuracy'
  },
  'flash': {
    effect: 'lower accuracy',
    effect_chance: 100,
    description: 'Lowers the target\'s accuracy'
  },
  'screech': {
    effect: 'sharply lower defense',
    effect_chance: 100,
    description: 'Sharply lowers the target\'s Defense stat'
  },


  'recover': {
    effect: 'heal 50%',
    effect_chance: 100,
    description: 'Restores up to half of the user\'s maximum HP'
  },
  'roost': {
    effect: 'heal 50%',
    effect_chance: 100,
    description: 'Restores up to half of the user\'s maximum HP'
  },
  'rest': {
    effect: 'heal full and sleep user',
    effect_chance: 100,
    description: 'Restores all HP but puts the user to sleep for 2 turns'
  },
  'soft-boiled': {
    effect: 'heal 50%',
    effect_chance: 100,
    description: 'Restores up to half of the user\'s maximum HP'
  },
  'milk-drink': {
    effect: 'heal 50%',
    effect_chance: 100,
    description: 'Restores up to half of the user\'s maximum HP'
  },

  'double-slap': {
    effect: 'multi-hit 2-5',
    effect_chance: 100,
    description: 'Hits 2-5 times in one turn'
  },
  'fury-attack': {
    effect: 'multi-hit 2-5',
    effect_chance: 100,
    description: 'Hits 2-5 times in one turn'
  },
  'pin-missile': {
    effect: 'multi-hit 2-5',
    effect_chance: 100,
    description: 'Hits 2-5 times in one turn'
  },
  'spike-cannon': {
    effect: 'multi-hit 2-5',
    effect_chance: 100,
    description: 'Hits 2-5 times in one turn'
  },
  'barrage': {
    effect: 'multi-hit 2-5',
    effect_chance: 100,
    description: 'Hits 2-5 times in one turn'
  },
  'fury-swipes': {
    effect: 'multi-hit 2-5',
    effect_chance: 100,
    description: 'Hits 2-5 times in one turn'
  },


  'quick-attack': {
    effect: 'priority +1',
    effect_chance: 100,
    description: 'Always goes first'
  },


  'take-down': {
    effect: 'recoil 25%',
    effect_chance: 100,
    description: 'User takes recoil damage equal to 1/4 of damage dealt'
  },
  'double-edge': {
    effect: 'recoil 33%',
    effect_chance: 100,
    description: 'User takes recoil damage equal to 1/3 of damage dealt'
  },
  'submission': {
    effect: 'recoil 25%',
    effect_chance: 100,
    description: 'User takes recoil damage equal to 1/4 of damage dealt'
  },


  'absorb': {
    effect: 'drain 50%',
    effect_chance: 100,
    description: 'User recovers half the damage dealt'
  },
  'mega-drain': {
    effect: 'drain 50%',
    effect_chance: 100,
    description: 'User recovers half the damage dealt'
  },
  'giga-drain': {
    effect: 'drain 50%',
    effect_chance: 100,
    description: 'User recovers half the damage dealt'
  },
  'leech-life': {
    effect: 'drain 50%',
    effect_chance: 100,
    description: 'User recovers half the damage dealt'
  },
  'dream-eater': {
    effect: 'drain 50%',
    effect_chance: 100,
    description: 'User recovers half the damage dealt, only works on sleeping targets'
  },


  'fissure': {
    effect: 'ohko',
    effect_chance: 30,
    description: 'One-hit KO move that fails if target is higher level'
  },
  'guillotine': {
    effect: 'ohko',
    effect_chance: 30,
    description: 'One-hit KO move that fails if target is higher level'
  },
  'horn-drill': {
    effect: 'ohko',
    effect_chance: 30,
    description: 'One-hit KO move that fails if target is higher level'
  },


  'seismic-toss': {
    effect: 'level damage',
    effect_chance: 100,
    description: 'Deals damage equal to user\'s level'
  },
  'night-shade': {
    effect: 'level damage',
    effect_chance: 100,
    description: 'Deals damage equal to user\'s level'
  },
  'dragon-rage': {
    effect: 'fixed 40',
    effect_chance: 100,
    description: 'Always deals exactly 40 damage'
  },
  'sonic-boom': {
    effect: 'fixed 20',
    effect_chance: 100,
    description: 'Always deals exactly 20 damage'
  },

  
  'slash': {
    effect: 'high critical',
    effect_chance: 100,
    description: 'High critical hit ratio'
  },
  'razor-leaf': {
    effect: 'high critical',
    effect_chance: 100,
    description: 'High critical hit ratio'
  },
  'crabhammer': {
    effect: 'high critical',
    effect_chance: 100,
    description: 'High critical hit ratio'
  },
  'karate-chop': {
    effect: 'high critical',
    effect_chance: 100,
    description: 'High critical hit ratio'
  },


  'thunder': {
    effect: 'paralysis',
    effect_chance: 10,
    description: 'May paralyze the target'
  },
  'thunderbolt': {
    effect: 'paralysis',
    effect_chance: 10,
    description: 'May paralyze the target'
  },
  'fire-blast': {
    effect: 'burn',
    effect_chance: 10,
    description: 'May burn the target'
  },
  'flamethrower': {
    effect: 'burn',
    effect_chance: 10,
    description: 'May burn the target'
  },
  'ice-beam': {
    effect: 'freeze',
    effect_chance: 10,
    description: 'May freeze the target'
  },
  'blizzard': {
    effect: 'freeze',
    effect_chance: 10,
    description: 'May freeze the target'
  },
  'sludge-bomb': {
    effect: 'poison',
    effect_chance: 30,
    description: 'May poison the target'
  },
  'psychic': {
    effect: 'lower special-defense',
    effect_chance: 10,
    description: 'May lower the target\'s Special Defense'
  },
  'rock-slide': {
    effect: 'flinch',
    effect_chance: 30,
    description: 'May cause the target to flinch'
  },
  'headbutt': {
    effect: 'flinch',
    effect_chance: 30,
    description: 'May cause the target to flinch'
  },
  'stomp': {
    effect: 'flinch',
    effect_chance: 30,
    description: 'May cause the target to flinch'
  },

 
  'bind': {
    effect: 'bind',
    effect_chance: 100,
    description: 'Binds the target for 4-5 turns'
  },
  'wrap': {
    effect: 'bind',
    effect_chance: 100,
    description: 'Binds the target for 4-5 turns'
  },
  'fire-spin': {
    effect: 'bind',
    effect_chance: 100,
    description: 'Traps the target in a vortex of fire for 4-5 turns'
  },
  'clamp': {
    effect: 'bind',
    effect_chance: 100,
    description: 'Binds the target for 4-5 turns'
  },


  'double-team': {
    effect: 'raise user evasion',
    effect_chance: 100,
    description: 'Raises the user\'s evasiveness'
  },
  'minimize': {
    effect: 'sharply raise user evasion',
    effect_chance: 100,
    description: 'Sharply raises the user\'s evasiveness'
  },

 
  'solar-beam': {
    effect: 'charge turn',
    effect_chance: 100,
    description: 'Charges on first turn, attacks on second'
  },
  'skull-bash': {
    effect: 'charge turn raise defense',
    effect_chance: 100,
    description: 'Charges and raises Defense on first turn, attacks on second'
  },
  'sky-attack': {
    effect: 'charge turn',
    effect_chance: 100,
    description: 'Charges on first turn, attacks on second'
  },


  'self-destruct': {
    effect: 'explode',
    effect_chance: 100,
    description: 'User faints but deals massive damage'
  },
  'explosion': {
    effect: 'explode',
    effect_chance: 100,
    description: 'User faints but deals massive damage'
  },


  'transform': {
    effect: 'transform',
    effect_chance: 100,
    description: 'User transforms into the target'
  },
  'mimic': {
    effect: 'copy move',
    effect_chance: 100,
    description: 'Copies one of the target\'s moves'
  },


  'disable': {
    effect: 'disable last move',
    effect_chance: 100,
    description: 'Prevents the target from using its last move'
  },
  'haze': {
    effect: 'reset all stats',
    effect_chance: 100,
    description: 'Resets all stat changes for both Pokemon'
  },
  'mist': {
    effect: 'prevent stat reduction',
    effect_chance: 100,
    description: 'Prevents stat reduction for 5 turns'
  },
  'light-screen': {
    effect: 'halve special damage',
    effect_chance: 100,
    description: 'Halves special damage for 5 turns'
  },
  'reflect': {
    effect: 'halve physical damage',
    effect_chance: 100,
    description: 'Halves physical damage for 5 turns'
  },

 
  'substitute': {
    effect: 'substitute',
    effect_chance: 100,
    description: 'Creates a substitute using 1/4 of max HP'
  },
  'protect': {
    effect: 'protect',
    effect_chance: 100,
    description: 'Protects from attacks this turn'
  },
  'detect': {
    effect: 'protect',
    effect_chance: 100,
    description: 'Protects from attacks this turn'
  },
};