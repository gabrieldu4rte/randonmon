import React, { useState, useEffect, useCallback } from 'react';
import { Pokemon, Move } from '../interfaces';
import { getPokemonDetails } from '../api/pokeapi';
import { calculateDamage } from '../logic/battle';
import { applyStatusEffect, processEndOfTurnStatusEffects, canMove, calculateSpecialMoveEffects } from '../logic/statusEffects';
import { PokemonCard } from './Pokemon/PokemonCard';
import { calculateStatsForLevel } from '../logic/progression';
import BattleBackground from '../assets/background.jpg';

interface BattleScreenProps {
  playerTeam: Pokemon[];
  activePokemonIndex: number;
  wins: number;
  onBattleEnd: (didPlayerWin: boolean, defeatedEnemy: Pokemon | null, finalPlayerHp: number) => void;
  onSwitchPokemon: (newIndex: number) => void;
  onPlayerPokemonFaint: () => void;
  onPlayerHpUpdate: (newHp: number) => void;
  endOfBattleMessages: string[];
  onMessageSequenceEnd: () => void;
}

export const BattleScreen: React.FC<BattleScreenProps> = ({
  playerTeam,
  activePokemonIndex,
  wins,
  onBattleEnd,
  onSwitchPokemon,
  onPlayerPokemonFaint,
  onPlayerHpUpdate,
  endOfBattleMessages,
  onMessageSequenceEnd,
}) => {
  const playerPokemon = playerTeam[activePokemonIndex];

  const [enemyPokemon, setEnemyPokemon] = useState<Pokemon | null>(null);
  const [enemyCurrentHp, setEnemyCurrentHp] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [turnInProgress, setTurnInProgress] = useState(true);
  const [battleOver, setBattleOver] = useState(false);
  const [actionView, setActionView] = useState<'moves' | 'pokemon'>('moves');
  const [isForcedSwitch, setIsForcedSwitch] = useState(false);

  useEffect(() => {
    if (battleOver && endOfBattleMessages.length > 0) {
      setTurnInProgress(true);
      let currentIndex = 0;
      const showNextMessage = () => {
        if (currentIndex < endOfBattleMessages.length) {
          setMessage(endOfBattleMessages[currentIndex]);
          currentIndex++;
          setTimeout(showNextMessage, 2000);
        } else {
          onMessageSequenceEnd();
        }
      };
      setTimeout(showNextMessage, 2000);
    }
  }, [battleOver, endOfBattleMessages, onMessageSequenceEnd]);

  const processEndOfTurn = useCallback(() => {
    if (!enemyPokemon || !playerPokemon) return;

    let messages: string[] = [];

    const playerStatus = processEndOfTurnStatusEffects(playerPokemon);
    if (playerStatus.message) {
      messages.push(playerStatus.message);
      onPlayerHpUpdate(playerPokemon.currentHp);
    }

    const enemyStatus = processEndOfTurnStatusEffects(enemyPokemon);
    if (enemyStatus.message) {
      messages.push(enemyStatus.message);
      setEnemyCurrentHp(enemyPokemon.currentHp);
    }

    if (messages.length > 0) {
      let messageIndex = 0;
      const showNextStatusMessage = () => {
        if (messageIndex < messages.length) {
          setMessage(messages[messageIndex]);
          messageIndex++;
          setTimeout(showNextStatusMessage, 1500);
        } else {
          if (playerPokemon.currentHp === 0) {
            onPlayerPokemonFaint();
            setMessage(`${playerPokemon.name} fainted!`);

            const hasOtherPokemon = playerTeam.some((p) => p.currentHp > 0 && p.id !== playerPokemon.id);
            if (hasOtherPokemon) {
              setIsForcedSwitch(true);
              setActionView('pokemon');
              setIsPlayerTurn(true);
              setTurnInProgress(false);
            } else {
              setBattleOver(true);
              onBattleEnd(false, null, 0);
            }
          } else if (enemyPokemon.currentHp === 0) {
            setBattleOver(true);
            setMessage(`${enemyPokemon.name} fainted!`);
            onBattleEnd(true, enemyPokemon, playerPokemon.currentHp);
          } else {
            setIsPlayerTurn(true);
            setTurnInProgress(false);
            setMessage(`What will ${playerPokemon.name} do?`);
          }
        }
      };
      showNextStatusMessage();
    } else {
      setIsPlayerTurn(true);
      setTurnInProgress(false);
      setMessage(`What will ${playerPokemon.name} do?`);
    }
  }, [enemyPokemon, playerPokemon, playerTeam, onPlayerPokemonFaint, onBattleEnd, onPlayerHpUpdate]);

  useEffect(() => {
    const fetchEnemy = async () => {
      setTurnInProgress(true);
      setMessage("Searching for opponent...");
      const randomId = Math.floor(Math.random() * 251) + 1;
      const enemyData = await getPokemonDetails(randomId);

      const baseLevel = Math.max(playerPokemon.level - 1, 3);
      const levelVariation = Math.floor(Math.random() * 3) - 1;
      const winsBonus = Math.floor(wins * 0.5); 
      enemyData.level = Math.max(3, baseLevel + levelVariation + winsBonus);

      enemyData.stats = calculateStatsForLevel(enemyData.baseStats, enemyData.level, false);
      enemyData.currentHp = enemyData.stats.hp;
      setEnemyPokemon(enemyData);
      setEnemyCurrentHp(enemyData.stats.hp);

      setIsPlayerTurn(true);
      setMessage(`A wild ${enemyData.name} appeared!`);
      setTurnInProgress(false);
    };
    fetchEnemy();
  }, []); 

  const handleEnemyMove = useCallback(() => {
    if (!enemyPokemon || battleOver || !playerPokemon) return;

    const { canMove: enemyCanMove, message: moveBlockMessage, statusEffect } = canMove(enemyPokemon);
    if (!enemyCanMove) {
      setTurnInProgress(true);
      setMessage(moveBlockMessage);

      if (statusEffect && statusEffect.message) {
        setTimeout(() => {
          setMessage(statusEffect.message);
          if (statusEffect.damage > 0) {
            setEnemyCurrentHp(enemyPokemon.currentHp);
          }
          setTimeout(() => {
            processEndOfTurn();
          }, 1500);
        }, 1500);
      } else {
        setTimeout(() => {
          processEndOfTurn();
        }, 2000);
      }
      return;
    }
    if (statusEffect && statusEffect.message) {
      setTurnInProgress(true);
      setMessage(statusEffect.message);
      setTimeout(() => {

        executeEnemyMoveAction();
      }, 1500);
      return;
    }

    executeEnemyMoveAction();

    function executeEnemyMoveAction() {
      if (!enemyPokemon || battleOver || !playerPokemon) return;

      setTurnInProgress(true);
      const randomMove = enemyPokemon.moves[Math.floor(Math.random() * enemyPokemon.moves.length)];
      setMessage(`${enemyPokemon.name} used ${randomMove.name}!`);

      setTimeout(() => {
        if (randomMove.damage_class === 'status') {
        
          const { message: statusMessage } = applyStatusEffect(playerPokemon, randomMove, enemyPokemon);
          if (statusMessage) {
            setMessage(statusMessage);
          }

          setTimeout(() => {
            processEndOfTurn();
          }, 1500);
        } else {
          const { damage: baseDamage, effectivenessMessage } = calculateDamage(enemyPokemon, playerPokemon, randomMove);
          const { damage: finalDamage, messages, attackerHpChange, attackerFainted } = calculateSpecialMoveEffects(randomMove, enemyPokemon, playerPokemon, baseDamage);

          const newPlayerHp = Math.max(0, playerPokemon.currentHp - finalDamage);

          let newEnemyHp = enemyPokemon.currentHp;

          const isDrainMove = randomMove.effect && randomMove.effect.toLowerCase().includes('drain');
          
          const isRecoilMove = randomMove.effect && randomMove.effect.toLowerCase().includes('recoil');

          if (isDrainMove && attackerHpChange > 0) {
            
            newEnemyHp = Math.min(enemyPokemon.stats.hp, enemyPokemon.currentHp + attackerHpChange);
          } else if (isRecoilMove && attackerHpChange < 0) {
            
            newEnemyHp = Math.max(0, enemyPokemon.currentHp + attackerHpChange);
          }
          

          onPlayerHpUpdate(newPlayerHp);
          enemyPokemon.currentHp = newEnemyHp;
          setEnemyCurrentHp(newEnemyHp);

          
          enemyPokemon.lastMoveUsed = randomMove.name;

          
          let allMessages = [];
          if (effectivenessMessage) allMessages.push(effectivenessMessage);
          allMessages = allMessages.concat(messages);

          
          if (randomMove.effect && randomMove.effect_chance && randomMove.effect_chance < 100) {
            
            if (!randomMove.effect.toLowerCase().includes('heal')) {
              const { message: secondaryMessage } = applyStatusEffect(playerPokemon, randomMove, enemyPokemon);
              if (secondaryMessage) allMessages.push(secondaryMessage);
            }
          }

          let messageIndex = 0;
          const showNextMessage = () => {
            if (messageIndex < allMessages.length) {
              setMessage(allMessages[messageIndex]);
              messageIndex++;
              setTimeout(showNextMessage, 1500);
            } else {
              
              if (newEnemyHp === 0 || attackerFainted) {
                setBattleOver(true);
                setMessage(`${enemyPokemon.name} fainted!`);
                onBattleEnd(true, enemyPokemon, playerPokemon.currentHp);
              } else if (newPlayerHp === 0) {
                onPlayerPokemonFaint();
                setMessage(`${playerPokemon.name} fainted!`);

                const hasOtherPokemon = playerTeam.some((p) => p.currentHp > 0 && p.id !== playerPokemon.id);

                if (hasOtherPokemon) {
                  setIsForcedSwitch(true);
                  setActionView('pokemon');
                  setIsPlayerTurn(true);
                  setTurnInProgress(false);
                } else {
                  setBattleOver(true);
                  onBattleEnd(false, null, 0);
                }
              } else {
                processEndOfTurn();
              }
            }
          };

          if (allMessages.length > 0) {
            setTimeout(showNextMessage, 1500);
          } else {
            setTimeout(() => {
              if (newEnemyHp === 0 || attackerFainted) {
                setBattleOver(true);
                setMessage(`${enemyPokemon.name} fainted!`);
                onBattleEnd(true, enemyPokemon, playerPokemon.currentHp);
              } else if (newPlayerHp === 0) {
                onPlayerPokemonFaint();
                setMessage(`${playerPokemon.name} fainted!`);

                const hasOtherPokemon = playerTeam.some((p) => p.currentHp > 0 && p.id !== playerPokemon.id);

                if (hasOtherPokemon) {
                  setIsForcedSwitch(true);
                  setActionView('pokemon');
                  setIsPlayerTurn(true);
                  setTurnInProgress(false);
                } else {
                  setBattleOver(true);
                  onBattleEnd(false, null, 0);
                }
              } else {
                processEndOfTurn();
              }
            }, 1500);
          }
        }
      }, 1200);
    } 
  }, [enemyPokemon, playerPokemon, battleOver, playerTeam, onPlayerPokemonFaint, onBattleEnd, onPlayerHpUpdate]);

  useEffect(() => {
  
    if (!isPlayerTurn && !turnInProgress && !battleOver && enemyPokemon) {
      handleEnemyMove();
    }
  }, [isPlayerTurn, turnInProgress, battleOver, handleEnemyMove]);

  const handlePlayerMove = (move: Move) => {
    if (!isPlayerTurn || !enemyPokemon || !enemyCurrentHp || turnInProgress || battleOver) return;

    const { canMove: playerCanMove, message: moveBlockMessage, statusEffect } = canMove(playerPokemon);
    if (!playerCanMove) {
      setTurnInProgress(true);
      setMessage(moveBlockMessage);

      if (statusEffect && statusEffect.message) {
        setTimeout(() => {
          setMessage(statusEffect.message);
          if (statusEffect.damage > 0) {
            onPlayerHpUpdate(playerPokemon.currentHp);
          }
          setTimeout(() => {
            setIsPlayerTurn(false);
            setTurnInProgress(false);
          }, 1500);
        }, 1500);
      } else {
        setTimeout(() => {
          setIsPlayerTurn(false);
          setTurnInProgress(false);
        }, 2000);
      }
      return;
    }

    
    if (statusEffect && statusEffect.message) {
      setTurnInProgress(true);
      setMessage(statusEffect.message);
      setTimeout(() => {
        
        executeTurnWithPriority(move);
      }, 1500);
      return;
    }

    executeTurnWithPriority(move);
  };

  const executeTurnWithPriority = (playerMove: Move) => {
    executePlayerMove(playerMove);
  };

  const executePlayerMove = (move: Move) => {
    if (!enemyPokemon || !enemyCurrentHp) return;

    setTurnInProgress(true);
    setMessage(`${playerPokemon.name} used ${move.name}!`);

    setTimeout(() => {
      if (move.damage_class === 'status') {
        
        const { message: statusMessage, damage: selfDamage } = applyStatusEffect(enemyPokemon, move, playerPokemon);

        
        if (selfDamage && selfDamage > 0) {
          onPlayerHpUpdate(playerPokemon.currentHp);
        }

        if (statusMessage) {
          setMessage(statusMessage);
        }

        setTimeout(() => {
          setIsPlayerTurn(false);
          setTurnInProgress(false);
        }, 1500);
      } else {
       
        const { damage: baseDamage, effectivenessMessage } = calculateDamage(playerPokemon, enemyPokemon, move);
        const { damage: finalDamage, messages, attackerHpChange, attackerFainted } = calculateSpecialMoveEffects(move, playerPokemon, enemyPokemon, baseDamage);

        const newEnemyHp = Math.max(0, enemyCurrentHp - finalDamage);
        
        let newPlayerHp = playerPokemon.currentHp;

        
        const isDrainMove = move.effect && move.effect.toLowerCase().includes('drain');
        
        const isRecoilMove = move.effect && move.effect.toLowerCase().includes('recoil');

        if (isDrainMove && attackerHpChange > 0) {
          
          newPlayerHp = Math.min(playerPokemon.stats.hp, playerPokemon.currentHp + attackerHpChange);
        } else if (isRecoilMove && attackerHpChange < 0) {
          
          newPlayerHp = Math.max(0, playerPokemon.currentHp + attackerHpChange);
        }
        

        setEnemyCurrentHp(newEnemyHp);
        enemyPokemon.currentHp = newEnemyHp; 
        playerPokemon.currentHp = newPlayerHp;
        onPlayerHpUpdate(newPlayerHp);

     
        playerPokemon.lastMoveUsed = move.name;

        let allMessages = [];
        if (effectivenessMessage) allMessages.push(effectivenessMessage);
        allMessages = allMessages.concat(messages);

        
        if (move.effect && move.effect_chance && move.effect_chance < 100) {
          
          if (!move.effect.toLowerCase().includes('heal')) {
            const { message: secondaryMessage } = applyStatusEffect(enemyPokemon, move, playerPokemon);
            if (secondaryMessage) allMessages.push(secondaryMessage);
          }
        }

        let messageIndex = 0;
        const showNextMessage = () => {
          if (messageIndex < allMessages.length) {
            setMessage(allMessages[messageIndex]);
            messageIndex++;
            setTimeout(showNextMessage, 1500);
          } else {
            
            if (newPlayerHp === 0 || attackerFainted) {
              if (attackerFainted) {
                onPlayerPokemonFaint();
                setMessage(`${playerPokemon.name} fainted!`);
              }

              const hasOtherPokemon = playerTeam.some((p) => p.currentHp > 0 && p.id !== playerPokemon.id);

              if (hasOtherPokemon && newPlayerHp === 0) {
                setIsForcedSwitch(true);
                setActionView('pokemon');
                setIsPlayerTurn(true);
                setTurnInProgress(false);
              } else if (newPlayerHp === 0) {
                setBattleOver(true);
                onBattleEnd(false, null, 0);
              }
            } else if (newEnemyHp === 0) {
              setBattleOver(true);
              setMessage(`${enemyPokemon.name} fainted!`);
              onBattleEnd(true, enemyPokemon, playerPokemon.currentHp);
            } else {
              setIsPlayerTurn(false);
              setTurnInProgress(false);
            }
          }
        };

        if (allMessages.length > 0) {
          setTimeout(showNextMessage, 1500);
        } else {
          setTimeout(() => {
            if (newPlayerHp === 0) {
              onPlayerPokemonFaint();
              setMessage(`${playerPokemon.name} fainted!`);

              const hasOtherPokemon = playerTeam.some((p) => p.currentHp > 0 && p.id !== playerPokemon.id);

              if (hasOtherPokemon) {
                setIsForcedSwitch(true);
                setActionView('pokemon');
                setIsPlayerTurn(true);
                setTurnInProgress(false);
              } else {
                setBattleOver(true);
                onBattleEnd(false, null, 0);
              }
            } else if (newEnemyHp === 0) {
              setBattleOver(true);
              setMessage(`${enemyPokemon.name} fainted!`);
              onBattleEnd(true, enemyPokemon, playerPokemon.currentHp);
            } else {
              setIsPlayerTurn(false);
              setTurnInProgress(false);
            }
          }, 1500);
        }
      }
    }, 1200);
  };

  const executeSwitch = (newIndex: number) => {
    if (turnInProgress || battleOver) return;

    const oldPokemonName = playerPokemon.name;
    const newPokemonName = playerTeam[newIndex].name;

    setTurnInProgress(true);
    setMessage(`${oldPokemonName}, come back! Go, ${newPokemonName}!`);

    setTimeout(() => {
      onSwitchPokemon(newIndex);
      setActionView('moves');

      if (isForcedSwitch) {
        setIsForcedSwitch(false);
        setIsPlayerTurn(true);
        setTurnInProgress(false);
        setMessage(`What will ${playerPokemon.name} do?`);
      } else {
        setIsPlayerTurn(false);
        setTurnInProgress(false);
      }
    }, 2000);
  };

  if (!enemyPokemon) {
    return <div className="w-full h-screen bg-gray-800 flex items-center justify-center text-white text-2xl animate-pulse">Searching for opponent...</div>;
  }

  return (
    <div
      className="w-full h-screen flex flex-col p-4 overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url(${BattleBackground})` }}>
      <div className="flex justify-between items-start">
        <PokemonCard pokemon={playerPokemon} currentHp={playerPokemon.currentHp} isPlayer />
        <PokemonCard pokemon={enemyPokemon} currentHp={enemyCurrentHp || 0} />
      </div>
      <div className="flex-grow relative flex justify-between items-end">
        <div className="absolute bottom-0 left-[10%] w-1/2 flex justify-center">
          <img src={playerPokemon.sprites.back_default} alt={playerPokemon.name} className="w-64 h-64 object-contain" />
        </div>
        <div className="absolute bottom-[5%] right-[10%] w-1/2 flex justify-center">
          <img src={enemyPokemon.sprites.front_default} alt={enemyPokemon.name} className="w-56 h-56 object-contain" />
        </div>
      </div>

      <div className="bg-gray-100 h-48 border-t-8 border-gray-400 p-4 grid grid-cols-2 gap-4">
        <div className="bg-white border-4 border-gray-300 rounded-lg flex items-center justify-center p-4">
          <p className="text-2xl font-semibold text-gray-800">{message}</p>
        </div>

        <div className="h-full">
          {isPlayerTurn && !battleOver && (
            <>
              {actionView === 'moves' ? (
                <div className="grid grid-cols-2 gap-3 h-full">
                  {playerPokemon.moves.map(move => (
                    <button key={move.name} onClick={() => handlePlayerMove(move)} disabled={turnInProgress}
                      className="bg-white hover:bg-gray-200 border-4 border-gray-400 text-gray-800 font-bold text-lg py-2 px-4 rounded-lg capitalize shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed transform hover:scale-105">
                      {move.name}
                    </button>
                  ))}
                  <button onClick={() => setActionView('pokemon')} disabled={turnInProgress || playerTeam.length <= 1}
                    className="col-span-2 bg-yellow-500 hover:bg-yellow-600 border-4 border-yellow-700 text-white font-bold text-lg py-2 px-4 rounded-lg shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed">
                    Switch Pokémon
                  </button>
                </div>
              ) : (
                <div className="h-full overflow-y-auto grid grid-cols-2 gap-3 pr-2 content-start">
                  {playerTeam.map((pokemon, index) => {
                    if (index === activePokemonIndex && !isForcedSwitch) return null;
                    return (
                      <button key={pokemon.id} onClick={() => executeSwitch(index)} disabled={pokemon.currentHp <= 0}
                        className="bg-white hover:bg-gray-200 border-4 border-gray-400 text-gray-800 font-bold text-lg py-2 px-4 rounded-lg capitalize shadow-md disabled:bg-gray-400 disabled:text-gray-600 disabled:cursor-not-allowed">
                        {pokemon.name} <span className="text-sm">({pokemon.currentHp}/{pokemon.stats.hp} HP)</span>
                      </button>
                    )
                  })}
                  {!isForcedSwitch && (
                    <button onClick={() => setActionView('moves')}
                      className="bg-gray-500 hover:bg-gray-600 border-4 border-gray-700 text-white font-bold text-lg py-2 px-4 rounded-lg shadow-md">
                      Back to Moves
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};