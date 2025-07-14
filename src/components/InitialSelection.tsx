import React, { useEffect, useState } from 'react';
import { Pokemon } from '../interfaces';
import { getRandomPokemonList } from '../api/pokeapi';

interface InitialSelectionProps {
  onPokemonSelected: (pokemon: Pokemon) => void;
}

export const InitialSelection: React.FC<InitialSelectionProps> = ({ onPokemonSelected }) => {
  const [pokemonOptions, setPokemonOptions] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPokemon = async () => {
      setLoading(true);
      const pokemonList = await getRandomPokemonList(3);
      setPokemonOptions(pokemonList);
      setLoading(false);
    };

    fetchPokemon();
  }, []);

  if (loading) {
    return <div className="text-white text-2xl">Loading Pokémon...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold text-white mb-8">Choose your starter Pokémon!</h1>
      <div className="flex gap-8">
        {pokemonOptions.map((pokemon) => (
          <div
            key={pokemon.id}
            className="bg-gray-700 p-6 rounded-lg text-center text-white cursor-pointer transform hover:scale-105 transition-transform duration-300"
            onClick={() => onPokemonSelected(pokemon)}
          >
            <h2 className="text-2xl font-bold capitalize mb-4">{pokemon.name}</h2>
            <img src={pokemon.sprites.front_default} alt={pokemon.name} className="w-40 h-40 mx-auto" />
          </div>
        ))}
      </div>
    </div>
  );
};