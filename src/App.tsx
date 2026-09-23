import React, { useState, useEffect } from 'react';
import { Player, GameInfo, TabType } from './types';
import { GAMES_LIST } from './data/games';
import { GameCard } from './components/GameCard';
import { PlayerManager } from './components/PlayerManager';
import { GamePlaceholderScreen } from './components/GamePlaceholderScreen';
import { ImpostorGame } from './components/ImpostorGame';
import { ImpostorFootballGame } from './components/ImpostorFootballGame';
import { ImpostorPeopleGame } from './components/ImpostorPeopleGame';
import { LupusGame } from './components/LupusGame';
import { StimaGame } from './components/StimaGame';
import { Gamepad2, Users2, Sparkles, AlertCircle, ArrowLeft } from 'lucide-react';

const AVATAR_COLORS = [
    'bg-blue-600',
    'bg-sky-500',
    'bg-indigo-600',
    'bg-violet-600',
    'bg-teal-600',
    'bg-cyan-600',
];

const INITIAL_PLAYERS: Player[] = [
    { id: '1', name: 'Marco', avatarColor: 'bg-blue-600', isActive: true },
    { id: '2', name: 'Sofia', avatarColor: 'bg-indigo-600', isActive: true },
    { id: '3', name: 'Luca', avatarColor: 'bg-cyan-600', isActive: true },
    { id: '4', name: 'Chiara', avatarColor: 'bg-violet-600', isActive: true },
    { id: '5', name: 'Flavio', avatarColor: 'bg-sky-500', isActive: true },
    { id: '6', name: 'Zecco', avatarColor: 'bg-teal-600', isActive: true },
    { id: '7', name: 'Gerva', avatarColor: 'bg-rose-600', isActive: true },
];

export const App: React.FC = () => {
    const [currentTab, setCurrentTab] = useState<TabType>('games');
    const [selectedGame, setSelectedGame] = useState<GameInfo | null>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    const [players, setPlayers] = useState<Player[]>(() => {
        try {
            const saved = localStorage.getItem('party_hub_players_v1');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch {
            // fallback
        }
        return INITIAL_PLAYERS;
    });

    useEffect(() => {
        localStorage.setItem('party_hub_players_v1', JSON.stringify(players));
    }, [players]);

    const activePlayers = players.filter((p) => p.isActive);

    const handleAddPlayer = (name: string) => {
        const newPlayer: Player = {
            id: Date.now().toString(),
            name,
            avatarColor: AVATAR_COLORS[players.length % AVATAR_COLORS.length],
            isActive: true,
        };
        setPlayers((prev) => [...prev, newPlayer]);
    };

    const handleRemovePlayer = (id: string) => {
        setPlayers((prev) => prev.filter((p) => p.id !== id));
    };

    const handleTogglePlayer = (id: string) => {
        setPlayers((prev) =>
            prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
        );
    };

    return (
        <div className="w-screen h-screen bg-slate-950 flex items-center justify-center overflow-hidden">
            <main className="w-full max-w-[393px] h-full sm:h-[852px] sm:max-h-[852px] sm:rounded-[48px] bg-slate-950 border border-slate-800/80 shadow-2xl flex flex-col relative overflow-hidden">

                {/* Dynamic Island su desktop */}
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-50 pointer-events-none hidden sm:block border border-slate-900" />

                {!isPlaying && (
                    <header className="px-5 pt-12 pb-3 flex items-center justify-between border-b border-slate-900 bg-slate-950/80 backdrop-blur-md z-40">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-xl bg-blue-600 flex items-center justify-center font-black text-xs text-white shadow-md shadow-blue-500/20">
                                P
                            </div>
                            <h1 className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                                Party Hub <Sparkles size={14} className="text-blue-400" />
                            </h1>
                        </div>

                        <button
                            onClick={() => {
                                setSelectedGame(null);
                                setCurrentTab('players');
                            }}
                            className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-xs font-semibold text-slate-300 active:scale-95 transition-transform"
                        >
                            <Users2 size={13} className="text-blue-400" />
                            <span>{activePlayers.length} attivi</span>
                        </button>
                    </header>
                )}

                <div className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col">
                    {isPlaying && selectedGame ? (
                        selectedGame.id === 'impostor' ? (
                            <ImpostorGame
                                activePlayers={activePlayers}
                                onExit={() => setIsPlaying(false)}
                            />
                        ) : selectedGame.id === 'impostor_football' ? (
                            <ImpostorFootballGame
                                activePlayers={activePlayers}
                                onExit={() => setIsPlaying(false)}
                            />
                        ) : selectedGame.id === 'impostor_people' ? (
                            <ImpostorPeopleGame
                                activePlayers={activePlayers}
                                onExit={() => setIsPlaying(false)}
                            />
                        ) : selectedGame.id === 'lupus' ? (
                            <LupusGame
                                activePlayers={activePlayers}
                                onExit={() => setIsPlaying(false)}
                            />
                        ) : selectedGame.id === 'stima' ? (
                            <StimaGame
                                activePlayers={activePlayers}
                                onExit={() => setIsPlaying(false)}
                            />
                        ) : (
                            <GamePlaceholderScreen
                                game={selectedGame}
                                activePlayers={activePlayers}
                                onBack={() => setIsPlaying(false)}
                            />
                        )
                    ) : selectedGame ? (
                        <div className="p-5 flex flex-col h-full space-y-5">
                            <button
                                onClick={() => setSelectedGame(null)}
                                className="self-start flex items-center gap-1.5 text-xs font-semibold text-slate-400 active:text-white"
                            >
                                <ArrowLeft size={16} /> Torna ai giochi
                            </button>

                            <div className={`p-6 rounded-3xl bg-gradient-to-br ${selectedGame.accentGradient} text-white shadow-xl`}>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-black/25 px-2.5 py-1 rounded-full">
                  {selectedGame.badge}
                </span>
                                <h2 className="text-2xl font-black mt-3 tracking-tight">{selectedGame.title}</h2>
                                <p className="text-xs text-white/80 mt-1">{selectedGame.description}</p>
                            </div>

                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Partecipanti al round</h4>
                                <div className="flex flex-wrap gap-1.5 mb-3">
                                    {activePlayers.map((player) => (
                                        <span key={player.id} className="text-xs px-2.5 py-1 bg-slate-800 text-slate-200 rounded-lg">
                      {player.name}
                    </span>
                                    ))}
                                </div>

                                {activePlayers.length < selectedGame.minPlayers && (
                                    <div className="flex items-center gap-2 text-rose-400 text-xs bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl">
                                        <AlertCircle size={15} />
                                        <span>Attiva almeno {selectedGame.minPlayers} giocatori per iniziare.</span>
                                    </div>
                                )}
                            </div>

                            <div className="mt-auto pt-4">
                                <button
                                    disabled={activePlayers.length < selectedGame.minPlayers || activePlayers.length > selectedGame.maxPlayers}
                                    onClick={() => setIsPlaying(true)}
                                    className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 active:scale-95 disabled:opacity-40 disabled:active:scale-100 font-bold text-white shadow-lg shadow-blue-600/30 transition-all text-sm uppercase tracking-wider"
                                >
                                    Inizia Partita
                                </button>
                            </div>
                        </div>
                    ) : currentTab === 'games' ? (
                        <div className="p-4 space-y-3">
                            <div className="px-1 pt-1 pb-1">
                                <h2 className="text-lg font-bold text-white tracking-tight">Scegli il Gioco</h2>
                                <p className="text-xs text-slate-400">Seleziona e passa il telefono al gruppo</p>
                            </div>

                            <div className="space-y-3">
                                {GAMES_LIST.map((game) => (
                                    <GameCard
                                        key={game.id}
                                        game={game}
                                        activePlayersCount={activePlayers.length}
                                        onSelect={(g) => setSelectedGame(g)}
                                    />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <PlayerManager
                            players={players}
                            onAddPlayer={handleAddPlayer}
                            onRemovePlayer={handleRemovePlayer}
                            onTogglePlayer={handleTogglePlayer}
                        />
                    )}
                </div>

                {!selectedGame && !isPlaying && (
                    <nav className="safe-bottom px-6 py-2 bg-slate-950/90 backdrop-blur-md border-t border-slate-900 flex items-center justify-around z-40">
                        <button
                            onClick={() => setCurrentTab('games')}
                            className={`flex flex-col items-center gap-1 transition-colors ${
                                currentTab === 'games' ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'
                            }`}
                        >
                            <Gamepad2 size={20} />
                            <span className="text-[10px] font-semibold">Giochi</span>
                        </button>

                        <button
                            onClick={() => setCurrentTab('players')}
                            className={`flex flex-col items-center gap-1 transition-colors ${
                                currentTab === 'players' ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'
                            }`}
                        >
                            <Users2 size={20} />
                            <span className="text-[10px] font-semibold">Gruppo</span>
                        </button>
                    </nav>
                )}
            </main>
        </div>
    );
};

export default App;