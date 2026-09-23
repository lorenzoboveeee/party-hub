import React from 'react';
import { GameInfo } from '../types';
import { Ghost, Trophy, Users, Moon, Target, ChevronRight } from 'lucide-react';

interface GameCardProps {
    game: GameInfo;
    activePlayersCount: number;
    onSelect: (game: GameInfo) => void;
}

export const GameCard: React.FC<GameCardProps> = ({ game, activePlayersCount, onSelect }) => {
    const isPlayable = activePlayersCount >= game.minPlayers && activePlayersCount <= game.maxPlayers;

    const renderIcon = () => {
        switch (game.iconName) {
            case 'ghost': return <Ghost className="w-6 h-6 text-white" />;
            case 'trophy': return <Trophy className="w-6 h-6 text-white" />;
            case 'users': return <Users className="w-6 h-6 text-white" />;
            case 'moon': return <Moon className="w-6 h-6 text-white" />;
            case 'target': return <Target className="w-6 h-6 text-white" />;
        }
    };

    return (
        <div
            onClick={() => onSelect(game)}
            className="group relative overflow-hidden rounded-3xl p-4 bg-slate-900/90 border border-slate-800/80 active:scale-[0.98] transition-all duration-150 cursor-pointer shadow-lg hover:border-slate-700"
        >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${game.accentGradient} opacity-20 blur-2xl pointer-events-none rounded-full`} />

            <div className="flex items-start justify-between">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${game.accentGradient} flex items-center justify-center shadow-md shadow-blue-950/50`}>
                    {renderIcon()}
                </div>

                <span className="text-[11px] font-medium tracking-wide px-2.5 py-1 rounded-full bg-slate-800/90 text-slate-300 border border-slate-700/60">
          {game.badge}
        </span>
            </div>

            <div className="mt-4">
                <h3 className="text-lg font-bold text-white tracking-tight flex items-center justify-between">
                    <span>{game.title}</span>
                    <ChevronRight size={18} className="text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
                </h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5 line-clamp-1">{game.subtitle}</p>
            </div>

            <div className="mt-3.5 pt-3 border-t border-slate-800/70 flex items-center justify-between text-xs">
        <span className="text-slate-400 font-mono text-[11px]">
          {game.minPlayers}-{game.maxPlayers} giocatori
        </span>

                {isPlayable ? (
                    <span className="text-emerald-400 font-medium text-[11px] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Pronto
          </span>
                ) : (
                    <span className="text-amber-400/80 text-[11px]">
            {activePlayersCount < game.minPlayers ? `Minimo ${game.minPlayers}` : 'Troppi'}
          </span>
                )}
            </div>
        </div>
    );
};