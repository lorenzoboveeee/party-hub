import React, { useState } from 'react';
import { Player } from '../types';
import { UserPlus, Trash2, CheckCircle2, CircleDashed, Users } from 'lucide-react';

interface PlayerManagerProps {
    players: Player[];
    onAddPlayer: (name: string) => void;
    onRemovePlayer: (id: string) => void;
    onTogglePlayer: (id: string) => void;
}

export const PlayerManager: React.FC<PlayerManagerProps> = ({
                                                                players,
                                                                onAddPlayer,
                                                                onRemovePlayer,
                                                                onTogglePlayer,
                                                            }) => {
    const [newPlayerName, setNewPlayerName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPlayerName.trim().length > 0) {
            onAddPlayer(newPlayerName.trim());
            setNewPlayerName('');
        }
    };

    const activeCount = players.filter((p) => p.isActive).length;

    return (
        <div className="flex flex-col h-full px-5 py-4 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div>
                    <h2 className="text-xl font-bold tracking-tight text-white">Partecipanti</h2>
                    <p className="text-xs text-slate-400">Salvati automaticamente per sempre</p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 font-semibold text-xs">
                    <Users size={14} />
                    <span>{activeCount} / {players.length} attivi</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="text"
                    value={newPlayerName}
                    onChange={(e) => setNewPlayerName(e.target.value)}
                    placeholder="Nome partecipante..."
                    maxLength={18}
                    className="flex-1 bg-slate-900/90 border border-slate-700/80 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                />
                <button
                    type="submit"
                    disabled={!newPlayerName.trim()}
                    className="bg-blue-600 active:scale-95 disabled:opacity-40 disabled:active:scale-100 text-white px-5 rounded-2xl flex items-center justify-center transition-all duration-150"
                >
                    <UserPlus size={18} />
                </button>
            </form>

            <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 pr-0.5">
                {players.length === 0 ? (
                    <div className="h-48 flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-800 rounded-3xl">
                        <Users className="text-slate-600 mb-2" size={32} />
                        <p className="text-sm font-medium text-slate-400">Nessun giocatore salvato</p>
                        <p className="text-xs text-slate-600 mt-1">Aggiungi i tuoi amici sopra per iniziare!</p>
                    </div>
                ) : (
                    players.map((player) => (
                        <div
                            key={player.id}
                            className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-150 ${
                                player.isActive
                                    ? 'bg-slate-900/80 border-slate-800 text-white shadow-sm'
                                    : 'bg-slate-950/40 border-slate-900 text-slate-500 opacity-60'
                            }`}
                        >
                            <div
                                className="flex items-center gap-3 flex-1 cursor-pointer"
                                onClick={() => onTogglePlayer(player.id)}
                            >
                                <div
                                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white shadow-inner ${player.avatarColor}`}
                                >
                                    {player.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-sm leading-tight">{player.name}</span>
                                    <span className="text-[10px] text-slate-400">
                    {player.isActive ? 'In partita' : 'In panchina'}
                  </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => onTogglePlayer(player.id)}
                                    className="p-1.5 text-slate-400 hover:text-white transition-colors"
                                >
                                    {player.isActive ? (
                                        <CheckCircle2 size={18} className="text-emerald-400" />
                                    ) : (
                                        <CircleDashed size={18} className="text-slate-600" />
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onRemovePlayer(player.id)}
                                    className="p-1.5 text-slate-500 active:text-rose-400 transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};