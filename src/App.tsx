import React, { useState } from 'react';
import { GameState, Pokemon } from './interfaces';
import { InitialSelection } from './components/InitialSelection';
import { BattleScreen } from './components/BattleScreen';
import { PostBattleScreen } from './components/PostBattleScreen';
import { calculateExperienceGain, checkForLevelUp } from './logic/progression';
import { calculateCaptureChance, getPokeball } from './logic/capture';

function App() {
  const [gameState, setGameState] = useState<GameState>({
    playerTeam: [],
    activePokemonIndex: 0,
    enemyPokemon: null,
    wins: 0,
    gamePhase: 'initial-selection',
  });

  const [battleEndMessages, setBattleEndMessages] = useState<string[]>([]);
  const [postBattleMessage, setPostBattleMessage] = useState('');

  const handlePokemonSelected = (pokemon: Pokemon) => {
    setGameState(prevState => ({
      ...prevState,
      playerTeam: [pokemon],
      gamePhase: 'battle',
    }));
  };

  const handleBattleEnd = (didPlayerWin: boolean, defeatedEnemy: Pokemon | null, finalPlayerHp: number) => {
    const newTeam = JSON.parse(JSON.stringify(gameState.playerTeam));
    let activePokemon = newTeam[gameState.activePokemonIndex];
    activePokemon.currentHp = finalPlayerHp;

    if (didPlayerWin && defeatedEnemy) {
      const messages: string[] = [];
      const xpGained = calculateExperienceGain(activePokemon, defeatedEnemy);
      messages.push(`${activePokemon.name} gained ${xpGained} experience points!`);
      activePokemon.experience += xpGained;

      const { leveledUp, newPokemon, levelUpMessage } = checkForLevelUp(activePokemon);
      if (leveledUp) {
        messages.push(levelUpMessage);
        newPokemon.currentHp = finalPlayerHp;
        activePokemon = newPokemon;
      }
      
      newTeam[gameState.activePokemonIndex] = activePokemon;
      setBattleEndMessages(messages); 
      
      setGameState(prevState => ({
        ...prevState,
        playerTeam: newTeam,
        enemyPokemon: defeatedEnemy,
      }));
    } else {
      setGameState(prevState => ({ 
        ...prevState, 
        playerTeam: newTeam, 
        gamePhase: 'game-over' 
      }));
    }
  };

  const handleMessageSequenceEnd = () => {
    setGameState(prevState => ({ ...prevState, gamePhase: 'post-battle' }));
  };

  const startNextBattle = () => {
    setBattleEndMessages([]);
    setPostBattleMessage('');
    setGameState(prevState => ({ 
      ...prevState, 
      wins: prevState.wins + 1,
      gamePhase: 'battle' 
    }));
  };

  const handleHeal = () => {
    const newTeam = [...gameState.playerTeam];
    const activePokemon = newTeam[gameState.activePokemonIndex];
    const oldHp = activePokemon.currentHp;
    activePokemon.currentHp = Math.min(activePokemon.stats.hp, oldHp + 50);
    
    setGameState(prevState => ({ ...prevState, playerTeam: newTeam }));
    setPostBattleMessage(`${activePokemon.name} was healed!`);
  };

  const handleCapture = () => {
    if (!gameState.enemyPokemon) return;
    const pokeball = getPokeball(gameState.wins);
    const success = calculateCaptureChance(gameState.enemyPokemon, pokeball.multiplier);

    if (success && gameState.playerTeam.length < 6) {
      const newTeam = [...gameState.playerTeam, gameState.enemyPokemon];
      setGameState(prevState => ({ ...prevState, playerTeam: newTeam }));
      setPostBattleMessage(`Gotcha! ${gameState.enemyPokemon.name} was caught!`);
    } else if (success) {
      setPostBattleMessage(`Caught! But you don't have more room for Pokémon.`);
    } else {
      setPostBattleMessage(`Oh, no! The Pokémon escaped!`);
    }
  };

  const handleBonus = () => {
    const stats: (keyof Pokemon['stats'])[] = ['attack', 'defense', 'speed'];
    const randomStat = stats[Math.floor(Math.random() * stats.length)];

    const newTeam = [...gameState.playerTeam];
    const activePokemon = newTeam[gameState.activePokemonIndex];
    activePokemon.stats[randomStat] += 2;

    setGameState(prevState => ({ ...prevState, playerTeam: newTeam }));
    setPostBattleMessage(`${activePokemon.name} received a bonus on ${randomStat}!`);
  };

  const renderGamePhase = () => {
    const { gamePhase, playerTeam, activePokemonIndex, enemyPokemon, wins } = gameState;

    switch (gamePhase) {
      case 'initial-selection':
        return <InitialSelection onPokemonSelected={handlePokemonSelected} />;
      case 'battle':
        return (
          <BattleScreen 
            key={wins}
            playerPokemon={playerTeam[activePokemonIndex]} 
            onBattleEnd={handleBattleEnd} 
            wins={wins}
            endOfBattleMessages={battleEndMessages}
            onMessageSequenceEnd={handleMessageSequenceEnd}
          />
        );
      case 'post-battle':
        return (
          <PostBattleScreen
            wins={wins}
            defeatedPokemon={enemyPokemon!}
            onHeal={handleHeal}
            onCapture={handleCapture}
            onBonus={handleBonus}
            feedbackMessage={postBattleMessage}
            onNextBattle={startNextBattle}
          />
        );
      case 'game-over':
        return <div className="text-white text-5xl font-bold">GAME OVER</div>;
      default:
        return <div className="text-white text-2xl animate-pulse">Loading...</div>;
    }
  };

  return (
    <main className="bg-gray-900 min-h-screen flex items-center justify-center font-sans">
      {renderGamePhase()}
    </main>
  );
}

export default App;