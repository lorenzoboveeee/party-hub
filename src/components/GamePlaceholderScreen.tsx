import React from 'react';
import { GameInfo, Player } from '../types';
import { ArrowLeft, Play } from 'lucide-react';

interface GamePlaceholderScreenProps {
    game: GameInfo;
    activePlayers: Player[];
    onBack: () => void;
}

export const GamePlaceholderScreen: React.FC<GamePlaceholderScreenProps> = ({
                                                                                game,
                                                                                activePlayers,
                                                                                onBack,
                                                                            }) => {
    return (
        <div className="flex flex-col h-full bg-slate-950 p-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-900">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-xs font-semibold text-slate-400 active:text-white py-1.5 pr-3"
                >
                    <ArrowLeft size={18} /> Esci
                </button>
                <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-900 text-blue-400 border border-slate-800">
          {game.title}
        </span>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className={`w-16 h-16 rounded-3xl bg-gradient-to-br ${game.accentGradient} flex items-center justify-center shadow-xl`}>
                    <Play size={28} className="text-white fill-white ml-0.5" />
                </div>

                <div>
                    <h2 className="text-xl font-black text-white">{game.title}</h2>
                    <p className="text-xs text-slate-400 mt-1 max-w-[240px]">
                        Questa schermata è vuota. Qui integreremo logica, round e interfaccia di gioco.
                    </p>
                </div>

                <div className="w-full bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3.5 mt-4">
                    <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-2">
                        In campo ({activePlayers.length})
                    </p>
                    <div className="flex flex-wrap justify-center gap-1.5">
                        {activePlayers.map((p) => (
                            <span key={p.id} className="text-xs px-2.5 py-1 bg-slate-800 text-slate-300 rounded-lg">
                {p.name}
              </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};