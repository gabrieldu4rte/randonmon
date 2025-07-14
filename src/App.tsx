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
      activePokemonIndex: 0,
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
      messages.push(`${activePokemon.name} ganhou ${xpGained} XP!`);
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

  const handleSwitchPokemon = (newIndex: number) => {
    if (newIndex === gameState.activePokemonIndex || newIndex >= gameState.playerTeam.length) return;
    setGameState(prevState => ({
      ...prevState,
      activePokemonIndex: newIndex,
    }));
  };

  const handlePlayerPokemonFaint = () => {
    const newTeam = [...gameState.playerTeam];
    const faintedPokemon = newTeam[gameState.activePokemonIndex];
    if(faintedPokemon) faintedPokemon.currentHp = 0;
    setGameState(prevState => ({...prevState, playerTeam: newTeam}));
  };

  const handlePlayerHpUpdate = (newHp: number) => {
    const newTeam = [...gameState.playerTeam];
    const currentPokemon = newTeam[gameState.activePokemonIndex];
    if (currentPokemon) {
      currentPokemon.currentHp = newHp;
      setGameState(prevState => ({ ...prevState, playerTeam: newTeam }));
    }
  };

  const handleHeal = () => {
    const newTeam = [...gameState.playerTeam];
    const activePokemon = newTeam[gameState.activePokemonIndex];
    activePokemon.currentHp = activePokemon.stats.hp;
    
    setGameState(prevState => ({ ...prevState, playerTeam: newTeam }));
    setPostBattleMessage(`${activePokemon.name} foi totalmente curado!`);
  };

  const handleCapture = () => {
    if (!gameState.enemyPokemon) return;
    const pokeball = getPokeball(gameState.wins);
    const success = calculateCaptureChance(gameState.enemyPokemon, pokeball.multiplier);

    if (success && gameState.playerTeam.length < 6) {
      const newPokemon = { ...gameState.enemyPokemon };
      newPokemon.currentHp = newPokemon.stats.hp;
      const newTeam = [...gameState.playerTeam, newPokemon];
      setGameState(prevState => ({ ...prevState, playerTeam: newTeam }));
      setPostBattleMessage(`Você capturou ${gameState.enemyPokemon.name}!`);
    } else if (success) {
      setPostBattleMessage(`Capturado! Mas você não tem espaço para mais Pokémon.`);
    } else {
      setPostBattleMessage(`Ah, não! O Pokémon escapou!`);
    }
  };

  const handleBonus = () => {
    const stats: (keyof Pokemon['stats'])[] = ['attack', 'defense', 'speed'];
    const randomStat = stats[Math.floor(Math.random() * stats.length)];

    const newTeam = [...gameState.playerTeam];
    const activePokemon = newTeam[gameState.activePokemonIndex];
    activePokemon.stats[randomStat] += 2;

    setGameState(prevState => ({ ...prevState, playerTeam: newTeam }));
    setPostBattleMessage(`${activePokemon.name} recebeu um bônus em ${randomStat}!`);
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
            playerTeam={playerTeam}
            activePokemonIndex={activePokemonIndex}
            onSwitchPokemon={handleSwitchPokemon}
            onPlayerPokemonFaint={handlePlayerPokemonFaint}
            onPlayerHpUpdate={handlePlayerHpUpdate}
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
        return <div className="text-white text-5xl font-bold">FIM DE JOGO</div>;
      default:
        return <div className="text-white text-2xl animate-pulse">Carregando...</div>;
    }
  };

  return (
    <main className="bg-gray-900 min-h-screen flex items-center justify-center font-sans">
      {renderGamePhase()}
    </main>
  );
}

export default App;