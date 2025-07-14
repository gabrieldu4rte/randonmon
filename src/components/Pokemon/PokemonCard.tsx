import React from 'react';
import { Pokemon } from '../../interfaces';

interface PokemonCardProps {
  pokemon: Pokemon;
  currentHp: number;
  isPlayer?: boolean;
}

export const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, currentHp, isPlayer = false }) => {
  const hpPercentage = (currentHp / pokemon.stats.hp) * 100;

  return (
    <div className="bg-gray-200 bg-opacity-90 rounded-lg p-3 w-72 border-4 border-gray-400 shadow-xl">
      <div className="flex justify-between items-center mb-1">
        <span className="capitalize text-2xl font-bold text-gray-800">{pokemon.name}</span>
        <span className="text-2xl font-bold text-gray-800">Lv{pokemon.level}</span>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="bg-yellow-400 text-yellow-800 text-xs font-bold px-2 py-0.5 rounded-full border-2 border-yellow-600">HP</span>
        <div className="w-full bg-gray-900 rounded-full h-4 border-2 border-gray-500">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${hpPercentage > 50 ? 'bg-green-500' : hpPercentage > 20 ? 'bg-yellow-500' : 'bg-red-500'}`}
            style={{ width: `${hpPercentage}%` }}
          ></div>
        </div>
      </div>

      {isPlayer && (
        <div className="flex justify-end mt-1">
          <span className="text-lg font-bold text-gray-700">{currentHp} / {pokemon.stats.hp}</span>
        </div>
      )}
    </div>
  );
};