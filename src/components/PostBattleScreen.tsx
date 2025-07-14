import React from 'react';
import { Pokemon } from '../interfaces';

interface PostBattleScreenProps {
  wins: number;
  defeatedPokemon: Pokemon;
  onHeal: () => void;
  onCapture: () => void;
  onBonus: () => void;
  feedbackMessage: string;
  onNextBattle: () => void;
}

export const PostBattleScreen: React.FC<PostBattleScreenProps> = ({ 
  wins, 
  defeatedPokemon,
  onHeal, 
  onCapture, 
  onBonus,
  feedbackMessage,
  onNextBattle,
}) => {

  return (
    <div className="bg-gray-800 p-8 rounded-lg shadow-xl text-white text-center w-full max-w-4xl">
      {!feedbackMessage ? (
        <div>
          <h1 className="text-4xl font-bold mb-2">Win!</h1>
          <p className="text-lg mb-6">Choose your reward:</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={onHeal}
              className="bg-green-600 hover:bg-green-700 p-6 rounded-lg text-left transform hover:scale-105 transition-transform duration-300"
            >
              <h2 className="text-2xl font-bold mb-2">Heal</h2>
              <p>Restore your Pokémon HP.</p>
            </button>
            <button
              onClick={onCapture}
              className="bg-red-600 hover:bg-red-700 p-6 rounded-lg text-left transform hover:scale-105 transition-transform duration-300"
            >
              <h2 className="text-2xl font-bold mb-2">Capture {defeatedPokemon.name}</h2>
              <p>Try to capture the fallen Pokémon.</p>
            </button>
            <button
              onClick={onBonus}
              className="bg-blue-600 hover:bg-blue-700 p-6 rounded-lg text-left transform hover:scale-105 transition-transform duration-300"
            >
              <h2 className="text-2xl font-bold mb-2">Attribute Bonus</h2>
              <p>Receive a random bonus on one atribbute.</p>
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h1 className="text-4xl font-bold mb-6">{feedbackMessage}</h1>
          <button 
            onClick={onNextBattle}
            className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg text-2xl font-bold"
          >
            Next Battle
          </button>
        </div>
      )}
    </div>
  );
};