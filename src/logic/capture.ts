import { Pokemon } from "../interfaces";

export function getPokeball(wins: number): { name: string; multiplier: number } {
  if (wins >= 25) {
    return { name: "Ultra Ball", multiplier: 2 };
  }
  if (wins >= 10) {
    return { name: "Great Ball", multiplier: 1.5 };
  }
  return { name: "Poké Ball", multiplier: 1 };
}

export function calculateCaptureChance(pokemon: Pokemon, pokeballMultiplier: number): boolean {

  const chance = ((pokemon.captureRate + 1) / 256) * pokeballMultiplier * 3;

  return Math.random() < chance;
}