import React from 'react';
import { Pokemon } from '../../interfaces';

interface PokemonCardProps {
  pokemon: Pokemon;
  currentHp: number;
  isPlayer?: boolean;
}

export const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, currentHp, isPlayer = false }) => {
  const hpPercentage = (currentHp / pokemon.stats.hp) * 100;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'burn': return 'bg-red-500 text-white';
      case 'freeze': return 'bg-blue-400 text-white';
      case 'paralysis': return 'bg-yellow-500 text-black';
      case 'poison': return 'bg-purple-500 text-white';
      case 'badly-poison': return 'bg-purple-700 text-white';
      case 'sleep': return 'bg-gray-600 text-white';
      case 'confusion': return 'bg-pink-500 text-white';
      case 'flinch': return 'bg-orange-500 text-white';
      case 'bind': return 'bg-brown-500 text-white';
      case 'taunt': return 'bg-red-700 text-white';
      case 'disable': return 'bg-gray-700 text-white';
      case 'encore': return 'bg-green-600 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="bg-gray-200 bg-opacity-90 rounded-lg p-3 w-72 border-4 border-gray-400 shadow-xl">
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-2">
          <span className="capitalize text-2xl font-bold text-gray-800">{pokemon.name}</span>
          {pokemon.statusCondition && (
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border-2 ${getStatusColor(pokemon.statusCondition.type)}`}>
              {pokemon.statusCondition.type.toUpperCase()}
            </span>
          )}
        </div>
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