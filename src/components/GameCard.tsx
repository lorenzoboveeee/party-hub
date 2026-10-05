import React from 'react';
import { GameInfo } from '../types';
import { Ghost, Trophy, Users, Moon, Target, UserCheck, ChevronRight } from 'lucide-react';

interface GameCardProps {
    game: GameInfo;
    activePlayersCount: number;
    onSelect: (game: GameInfo) => void;
}

export const GameCard: React.FC<GameCardProps> = ({ game, activePlayersCount, onSelect }) => {
    const isPlayable = activePlayersCount >= game.minPlayers && activePlayersCount <= game.maxPlayers;

    const getIcon = () => {
        switch (game.iconName) {
            case 'ghost':
                return <Ghost size={26} className="text-white" />;
            case 'trophy':
                return <Trophy size={26} className="text-white" />;
            case 'users':
                return <Users size={26} className="text-white" />;
            case 'moon':
                return <Moon size={26} className="text-white" />;
            case 'target':
                return <Target size={26} className="text-white" />;
            case 'user-check':
                return <UserCheck size={26} className="text-white" />;
            default:
                return <Target size={26} className="text-white" />;
        }
    };

    return (
        <div
            onClick={() => onSelect(game)}
            className="p-4 rounded-3xl bg-slate-900 border border-slate-800/90 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-between shadow-lg hover:border-slate-700"
        >
            <div className="flex items-center gap-3.5">
                <div className={`w-13 h-13 rounded-2xl bg-gradient-to-br ${game.accentGradient} flex items-center justify-center shadow-md shrink-0`}>
                    {getIcon()}
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-base text-white tracking-tight leading-tight">{game.title}</h3>
                        <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {game.badge}
            </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 leading-snug line-clamp-1">{game.subtitle}</p>
                    <div className="flex items-center gap-2 mt-1.5">
            <span className={`text-[10px] font-semibold ${isPlayable ? 'text-emerald-400' : 'text-slate-500'}`}>
              {game.minPlayers}-{game.maxPlayers} giocatori
            </span>
                    </div>
                </div>
            </div>

            <div className="text-slate-600 pl-2">
                <ChevronRight size={20} />
            </div>
        </div>
    );
};