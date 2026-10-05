import React, { useState, useEffect } from 'react';
import { Player, ImpostorPlayerRole, ImpostorWordItem, ImpostorPhase } from '../types';
import { getNextImpostorWord } from '../data/words';
import {
    ChevronUp,
    ShieldCheck,
    Ghost,
    ArrowRight,
    RotateCcw,
    Home,
    Skull,
    Trophy
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ImpostorGameProps {
    activePlayers: Player[];
    impostorsCount: number;
    onExit: () => void;
}

export const ImpostorGame: React.FC<ImpostorGameProps> = ({
                                                              activePlayers,
                                                              impostorsCount = 1,
                                                              onExit
                                                          }) => {
    const [currentWordItem, setCurrentWordItem] = useState<ImpostorWordItem>({ word: '', clue: '' });
    const [roles, setRoles] = useState<ImpostorPlayerRole[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [phase, setPhase] = useState<ImpostorPhase>('pass');
    const [isCardRevealed, setIsCardRevealed] = useState<boolean>(false);
    const [starterPlayer, setStarterPlayer] = useState<Player | null>(null);
    const [lastVotedResult, setLastVotedResult] = useState<{ name: string; isImpostor: boolean } | null>(null);
    const [winnerMessage, setWinnerMessage] = useState<string | null>(null);

    const startNewRound = () => {
        const selectedWord = getNextImpostorWord();
        setCurrentWordItem(selectedWord);

        const actualImpostors = Math.min(impostorsCount, Math.max(1, activePlayers.length - 1));
        const shuffled = [...activePlayers].sort(() => 0.5 - Math.random());
        const impostorIds = new Set(shuffled.slice(0, actualImpostors).map(p => p.id));

        const initialRoles: ImpostorPlayerRole[] = activePlayers.map(p => ({
            player: p,
            isImpostor: impostorIds.has(p.id),
            hasViewed: false,
            isEliminated: false,
        }));

        setRoles(initialRoles);
        setCurrentIndex(0);
        setPhase('pass');
        setIsCardRevealed(false);
        setLastVotedResult(null);
        setWinnerMessage(null);

        const randomStarter = activePlayers[Math.floor(Math.random() * activePlayers.length)];
        setStarterPlayer(randomStarter);
    };

    useEffect(() => {
        startNewRound();
    }, [impostorsCount]);

    const handleConfirmExit = () => {
        if (window.confirm('Vuoi davvero tornare al menu principale?')) {
            onExit();
        }
    };

    const handleConfirmRestart = () => {
        if (window.confirm('Vuoi riavviare la manche con una nuova parola?')) {
            startNewRound();
        }
    };

    const currentPlayerRole = roles[currentIndex];

    const handleNextPlayer = () => {
        setIsCardRevealed(false);
        if (currentIndex + 1 < roles.length) {
            setCurrentIndex(prev => prev + 1);
            setPhase('pass');
        } else {
            setPhase('starter');
        }
    };

    const handleVotePlayer = (playerId: string) => {
        const updatedRoles = roles.map(r => {
            if (r.player.id === playerId) {
                return { ...r, isEliminated: true };
            }
            return r;
        });

        const eliminated = roles.find(r => r.player.id === playerId);
        if (eliminated) {
            setLastVotedResult({
                name: eliminated.player.name,
                isImpostor: eliminated.isImpostor,
            });
        }

        setRoles(updatedRoles);

        const remainingPlayers = updatedRoles.filter(r => !r.isEliminated);
        const remainingImpostors = remainingPlayers.filter(r => r.isImpostor);

        if (remainingImpostors.length === 0) {
            setWinnerMessage('I Cittadini hanno eliminato tutti gli impostori!');
            setPhase('game_over');
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            return;
        }

        if (remainingPlayers.length <= remainingImpostors.length * 2) {
            setWinnerMessage("Gli Impostori hanno retto fino alla fine e vincono la partita!");
            setPhase('game_over');
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            return;
        }
    };

    const handleImpostorGuessedWord = () => {
        setWinnerMessage(`L'Impostore ha indovinato la parola "${currentWordItem.word}" e vince!`);
        setPhase('game_over');
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    };

    return (
        <div className="flex flex-col h-full bg-slate-950 text-white relative">

            {/* HEADER SAFE AREA PER DYNAMIC ISLAND / NOTCH */}
            {phase !== 'game_over' && (
                <div className="pt-12 pb-2 px-5 flex items-center justify-between border-b border-slate-900 bg-slate-950/80 backdrop-blur-md z-40">
                    <button
                        onClick={handleConfirmExit}
                        className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 active:text-white active:scale-90 transition-all"
                        title="Esci al menu"
                    >
                        <Home size={18} />
                    </button>

                    <div className="flex-1 px-4 text-center">
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
              L'Impostore
            </span>
                    </div>

                    <button
                        onClick={handleConfirmRestart}
                        className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 active:text-white active:scale-90 transition-all"
                        title="Ricomincia manche"
                    >
                        <RotateCcw size={18} />
                    </button>
                </div>
            )}

            {/* 1. FASE PASSAGGIO E REVEAL */}
            {phase === 'pass' && currentPlayerRole && (
                <div className="flex-1 flex flex-col justify-between p-6">
                    <div className="text-center pt-2">
            <span className="text-xs uppercase font-bold tracking-widest text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">
              Giocatore {currentIndex + 1} di {roles.length}
            </span>
                        <h2 className="text-xl font-black mt-3">Passa il telefono a</h2>
                        <p className="text-2xl font-extrabold text-blue-400 mt-1">{currentPlayerRole.player.name}</p>
                    </div>

                    <div className="relative w-full flex flex-col items-center my-auto">
                        {!isCardRevealed ? (
                            <div
                                onClick={() => setIsCardRevealed(true)}
                                className="w-full h-64 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-900/70 border-2 border-dashed border-blue-500/40 p-6 flex flex-col items-center justify-center cursor-pointer active:scale-95 transition-all shadow-xl"
                            >
                                <div className="w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center mb-3 text-blue-400 animate-bounce">
                                    <ChevronUp size={28} />
                                </div>
                                <h3 className="text-base font-bold text-slate-200">Tocca o scorri per vedere</h3>
                                <p className="text-xs text-slate-400 mt-1">Copri lo schermo dagli altri!</p>
                            </div>
                        ) : (
                            <div className="w-full min-h-[280px] rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-2xl transition-all duration-300 animate-in fade-in zoom-in-95 bg-slate-900 border border-slate-800">
                                {currentPlayerRole.isImpostor ? (
                                    <div className="space-y-4">
                                        <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                                            <Ghost size={30} />
                                        </div>
                                        <div>
                      <span className="text-xs uppercase font-bold tracking-wider text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
                        Sei l'Impostore!
                      </span>
                                            <h3 className="text-xs text-slate-400 mt-3 font-semibold uppercase tracking-wider">Il tuo indizio:</h3>
                                            <div className="mt-2 p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
                                                <p className="text-base font-bold text-amber-300">"{currentWordItem.clue}"</p>
                                            </div>
                                            <p className="text-[11px] text-slate-400 mt-3">
                                                Ascolta cosa dicono gli altri e difenditi senza tradirti.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                                            <ShieldCheck size={30} />
                                        </div>
                                        <div>
                      <span className="text-xs uppercase font-bold tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                        Sei Safe!
                      </span>
                                            <p className="text-xs text-slate-400 mt-3 font-semibold uppercase tracking-wider">Parola Segreta:</p>
                                            <h3 className="text-2xl font-black text-white mt-1">{currentWordItem.word}</h3>
                                            <p className="text-[11px] text-slate-400 mt-3">
                                                Non essere troppo palese per non aiutare l'impostore!
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="pt-2">
                        {isCardRevealed && (
                            <button
                                onClick={handleNextPlayer}
                                className="w-full py-4 rounded-2xl bg-blue-600 active:scale-95 text-white font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all"
                            >
                                <span>Ho visto, passa avanti</span>
                                <ArrowRight size={18} />
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* 2. FASE CHI COMINCIA */}
            {phase === 'starter' && starterPlayer && (
                <div className="flex-1 flex flex-col justify-between p-6 text-center">
                    <div className="pt-2">
            <span className="text-xs uppercase font-bold tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
              Ruoli Rivelati
            </span>
                        <h2 className="text-2xl font-black mt-3">Chi comincia?</h2>
                        <p className="text-xs text-slate-400 mt-1">Estratto a sorte per il primo giro</p>
                    </div>

                    <div className="my-auto p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col items-center">
                        <div className={`w-18 h-18 rounded-2xl flex items-center justify-center text-3xl font-black mb-3 shadow-lg ${starterPlayer.avatarColor}`}>
                            {starterPlayer.name.charAt(0).toUpperCase()}
                        </div>
                        <h3 className="text-2xl font-black text-white">{starterPlayer.name}</h3>
                        <p className="text-xs text-slate-400 mt-2 max-w-[220px]">
                            Dì una parola o breve frase collegata al tema, poi proseguite in senso orario.
                        </p>
                    </div>

                    <button
                        onClick={() => setPhase('discussion')}
                        className="w-full py-4 rounded-2xl bg-blue-600 active:scale-95 text-white font-bold text-sm tracking-wider uppercase shadow-lg shadow-blue-600/30 transition-all"
                    >
                        Vai alla Votazione
                    </button>
                </div>
            )}

            {/* 3. FASE DISCUSSIONE & VOTAZIONE */}
            {phase === 'discussion' && (
                <div className="flex-1 flex flex-col p-5 overflow-y-auto no-scrollbar space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                        <div>
                            <h2 className="text-base font-bold">Votazione</h2>
                            <p className="text-xs text-slate-400">Eliminate un sospettato</p>
                        </div>
                        <span className="text-xs px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-blue-400 font-mono">
              {roles.filter(r => !r.isEliminated).length} vivi
            </span>
                    </div>

                    {lastVotedResult && (
                        <div className={`p-3 rounded-2xl border text-xs flex items-center justify-between ${
                            lastVotedResult.isImpostor
                                ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                                : 'bg-slate-900 border-slate-800 text-slate-300'
                        }`}>
                            <span><strong>{lastVotedResult.name}</strong> eliminato!</span>
                            <span className="font-bold">
                {lastVotedResult.isImpostor ? 'ERA UN IMPOSTORE! 🔥' : 'ERA INNOCENTE! 🛡️'}
              </span>
                        </div>
                    )}

                    <div className="space-y-2 flex-1">
                        {roles.map((r) => (
                            <div
                                key={r.player.id}
                                className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                                    r.isEliminated
                                        ? 'bg-slate-950/40 border-slate-900 text-slate-600 opacity-50'
                                        : 'bg-slate-900/80 border-slate-800 text-white'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white ${r.player.avatarColor}`}>
                                        {r.player.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <span className="text-sm font-semibold block">{r.player.name}</span>
                                        <span className="text-[10px] text-slate-400">
                      {r.isEliminated ? (r.isImpostor ? 'Impostore Eliminato' : 'Innocente Eliminato') : 'In gioco'}
                    </span>
                                    </div>
                                </div>

                                {!r.isEliminated && (
                                    <button
                                        onClick={() => handleVotePlayer(r.player.id)}
                                        className="px-3 py-1.5 rounded-xl bg-rose-600/10 border border-rose-600/30 text-rose-400 text-xs font-semibold active:bg-rose-600 active:text-white transition-all flex items-center gap-1"
                                    >
                                        <Skull size={13} />
                                        <span>Elimina</span>
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="pt-2 border-t border-slate-900">
                        <button
                            onClick={handleImpostorGuessedWord}
                            className="w-full py-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold tracking-wide active:scale-95 transition-all"
                        >
                            L'Impostore ha indovinato la parola a voce!
                        </button>
                    </div>
                </div>
            )}

            {/* 4. FASE FINE PARTITA */}
            {phase === 'game_over' && (
                <div className="flex-1 flex flex-col justify-between p-6 text-center pt-12">
                    <div>
                        <div className="w-16 h-16 mx-auto rounded-3xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-3 shadow-lg">
                            <Trophy size={32} />
                        </div>
                        <h2 className="text-2xl font-black text-white">Fine Manche!</h2>
                        <p className="text-sm font-semibold text-emerald-400 mt-2 px-4">{winnerMessage}</p>
                    </div>

                    <div className="my-auto p-5 rounded-3xl bg-slate-900 border border-slate-800 text-left space-y-3">
                        <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400">La parola era:</span>
                            <p className="text-xl font-extrabold text-white mt-0.5">{currentWordItem.word}</p>
                        </div>
                        <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400">L'indizio per l'impostore:</span>
                            <p className="text-xs font-medium text-amber-300 mt-0.5">"{currentWordItem.clue}"</p>
                        </div>
                        <div className="pt-2 border-t border-slate-800">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">Ruoli impostore:</span>
                            <div className="flex flex-wrap gap-1.5">
                                {roles.filter(r => r.isImpostor).map(r => (
                                    <span key={r.player.id} className="text-xs px-2.5 py-1 bg-rose-500/20 border border-rose-500/30 text-rose-300 rounded-lg font-bold">
                    {r.player.name}
                  </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2 pt-2">
                        <button
                            onClick={startNewRound}
                            className="w-full py-4 rounded-2xl bg-blue-600 active:scale-95 text-white font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all"
                        >
                            <RotateCcw size={18} />
                            <span>Nuova Manche</span>
                        </button>
                        <button
                            onClick={onExit}
                            className="w-full py-3.5 rounded-2xl bg-slate-900 active:scale-95 text-slate-300 font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 border border-slate-800 transition-all"
                        >
                            <Home size={18} />
                            <span>Menu Principale</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};