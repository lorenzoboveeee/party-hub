import React, { useState } from 'react';
import { Player, LupusRoleId, LupusAssignedRole, LupusPhase } from '../types';
import { LUPUS_ROLES } from '../data/lupusRoles';
import {
    Home,
    RotateCcw,
    Plus,
    Minus,
    ChevronUp,
    ArrowRight,
    Eye,
    EyeOff,
    Moon,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface LupusGameProps {
    activePlayers: Player[];
    onExit: () => void;
}

export const LupusGame: React.FC<LupusGameProps> = ({ activePlayers, onExit }) => {
    const [phase, setPhase] = useState<LupusPhase>('setup');

    // Configurazione contatori ruoli di default
    const [roleCounts, setRoleCounts] = useState<Record<LupusRoleId, number>>(() => {
        const counts: Record<LupusRoleId, number> = {
            contadino: Math.max(0, activePlayers.length - 3),
            lupo: 2,
            veggente: 1,
            angelo: 0,
            sgualdrina: 0,
            mitomane: 0,
            sindaco: 0,
            lupo_mannaro: 0,
            piromane: 0,
        };
        return counts;
    });

    const [assignedRoles, setAssignedRoles] = useState<LupusAssignedRole[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [isCardRevealed, setIsCardRevealed] = useState<boolean>(false);

    // Set di ID giocatori con ruolo attualmente mostrato a schermo nella tabella finale
    const [revealedPlayerIds, setRevealedPlayerIds] = useState<Set<string>>(new Set());

    const totalAssigned = Object.values(roleCounts).reduce((a, b) => a + b, 0);
    const targetPlayers = activePlayers.length;
    const isSetupValid = totalAssigned === targetPlayers;

    const handleUpdateCount = (roleId: LupusRoleId, delta: number) => {
        setRoleCounts((prev) => {
            const nextVal = Math.max(0, (prev[roleId] || 0) + delta);
            return { ...prev, [roleId]: nextVal };
        });
    };

    const handleStartAssignment = () => {
        if (!isSetupValid) return;

        // Crea il mazzo di ruoli
        const deck: LupusRoleId[] = [];
        (Object.keys(roleCounts) as LupusRoleId[]).forEach((rId) => {
            for (let i = 0; i < roleCounts[rId]; i++) {
                deck.push(rId);
            }
        });

        // Mischia i ruoli
        const shuffledDeck = deck.sort(() => 0.5 - Math.random());

        // Assegna a ciascun giocatore attivo
        const assignments: LupusAssignedRole[] = activePlayers.map((player, idx) => ({
            player,
            role: LUPUS_ROLES[shuffledDeck[idx]],
        }));

        setAssignedRoles(assignments);
        setCurrentIndex(0);
        setIsCardRevealed(false);
        setPhase('pass');
    };

    const handleNextPlayer = () => {
        setIsCardRevealed(false);
        if (currentIndex + 1 < assignedRoles.length) {
            setCurrentIndex((prev) => prev + 1);
        } else {
            setPhase('table');
            confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
        }
    };

    const toggleRevealPlayer = (playerId: string) => {
        setRevealedPlayerIds((prev) => {
            const next = new Set(prev);
            if (next.has(playerId)) {
                next.delete(playerId);
            } else {
                next.add(playerId);
            }
            return next;
        });
    };

    const handleConfirmExit = () => {
        if (window.confirm('Vuoi tornare al menu principale?')) {
            onExit();
        }
    };

    const handleConfirmRestart = () => {
        if (window.confirm('Vuoi riassegnare i ruoli da capo?')) {
            setPhase('setup');
            setCurrentIndex(0);
            setIsCardRevealed(false);
            setRevealedPlayerIds(new Set());
        }
    };

    const currentAssignment = assignedRoles[currentIndex];

    return (
        <div className="flex flex-col h-full bg-slate-950 text-white relative">

            {/* HEADER SAFE PER DYNAMIC ISLAND / NOTCH */}
            <div className="pt-12 pb-2 px-5 flex items-center justify-between border-b border-slate-900 bg-slate-950/80 backdrop-blur-md z-40">
                <button
                    onClick={handleConfirmExit}
                    className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 active:text-white active:scale-90 transition-all"
                    title="Esci al menu"
                >
                    <Home size={18} />
                </button>

                <div className="flex-1 px-4 text-center">
          <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400 flex items-center justify-center gap-1.5">
            <Moon size={12} /> Lupus in Fabula
          </span>
                </div>

                <button
                    onClick={handleConfirmRestart}
                    className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 active:text-white active:scale-90 transition-all"
                    title="Riavvia"
                >
                    <RotateCcw size={18} />
                </button>
            </div>

            {/* 1. SETUP DEI RUOLI */}
            {phase === 'setup' && (
                <div className="flex-1 flex flex-col p-5 overflow-y-auto no-scrollbar space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-900">
                        <div>
                            <h2 className="text-lg font-bold">Componi il Mazzo</h2>
                            <p className="text-xs text-slate-400">Distribuisci i ruoli per il tavolo</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full border text-xs font-mono font-bold flex items-center gap-1.5 ${
                            isSetupValid
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                        }`}>
                            {isSetupValid ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
                            <span>{totalAssigned} / {targetPlayers}</span>
                        </div>
                    </div>

                    <div className="space-y-2 flex-1">
                        {(Object.keys(LUPUS_ROLES) as LupusRoleId[]).map((roleId) => {
                            const r = LUPUS_ROLES[roleId];
                            const count = roleCounts[roleId] || 0;

                            return (
                                <div
                                    key={roleId}
                                    className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between"
                                >
                                    <div className="flex-1 pr-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-white">{r.name}</span>
                                            <span className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md border ${r.badgeColor}`}>
                        {r.team}
                      </span>
                                        </div>
                                        <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{r.description}</p>
                                    </div>

                                    <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800/80">
                                        <button
                                            onClick={() => handleUpdateCount(roleId, -1)}
                                            disabled={count <= 0}
                                            className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center text-slate-300 disabled:opacity-30 active:scale-90"
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <span className="w-5 text-center text-xs font-mono font-bold text-white">
                      {count}
                    </span>
                                        <button
                                            onClick={() => handleUpdateCount(roleId, 1)}
                                            className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white active:scale-90"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="pt-2 border-t border-slate-900">
                        <button
                            disabled={!isSetupValid}
                            onClick={handleStartAssignment}
                            className="w-full py-4 rounded-2xl bg-indigo-600 active:scale-95 disabled:opacity-40 disabled:active:scale-100 text-white font-bold text-sm tracking-wider uppercase shadow-lg shadow-indigo-600/30 transition-all"
                        >
                            {isSetupValid
                                ? 'Distribuisci i Ruoli'
                                : totalAssigned < targetPlayers
                                    ? `Aggiungi altri ${targetPlayers - totalAssigned} ruoli`
                                    : `Togli ${totalAssigned - targetPlayers} ruoli in eccesso`}
                        </button>
                    </div>
                </div>
            )}

            {/* 2. FASE PASSAGGIO E REVEAL PRIVATO */}
            {phase === 'pass' && currentAssignment && (
                <div className="flex-1 flex flex-col justify-between p-6">
                    <div className="text-center pt-2">
            <span className="text-xs uppercase font-bold tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">
              Giocatore {currentIndex + 1} di {assignedRoles.length}
            </span>
                        <h2 className="text-xl font-black mt-3">Passa il telefono a</h2>
                        <p className="text-2xl font-extrabold text-indigo-400 mt-1">{currentAssignment.player.name}</p>
                    </div>

                    <div className="relative w-full flex flex-col items-center my-auto">
                        {!isCardRevealed ? (
                            <div
                                onClick={() => setIsCardRevealed(true)}
                                className="w-full h-64 rounded-3xl bg-gradient-to-b from-slate-900 to-indigo-950/30 border-2 border-dashed border-indigo-500/40 p-6 flex flex-col items-center justify-center cursor-pointer active:scale-95 transition-all shadow-xl"
                            >
                                <div className="w-12 h-12 rounded-full bg-indigo-600/20 flex items-center justify-center mb-3 text-indigo-400 animate-bounce">
                                    <ChevronUp size={28} />
                                </div>
                                <h3 className="text-base font-bold text-slate-200">Tocca per scoprire il tuo ruolo</h3>
                                <p className="text-xs text-slate-400 mt-1">Non farti vedere da nessuno!</p>
                            </div>
                        ) : (
                            <div className="w-full min-h-[300px] rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-2xl transition-all duration-300 animate-in fade-in zoom-in-95 bg-slate-900 border border-slate-800">
                <span className={`text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full border mb-3 ${currentAssignment.role.badgeColor}`}>
                  Fazione: {currentAssignment.role.team}
                </span>

                                <h3 className="text-3xl font-black text-white">{currentAssignment.role.name}</h3>

                                <div className="mt-3 p-4 bg-slate-950/80 rounded-2xl border border-slate-800 text-left">
                                    <p className="text-xs font-semibold text-slate-300 leading-relaxed">
                                        {currentAssignment.role.description}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="pt-2">
                        {isCardRevealed && (
                            <button
                                onClick={handleNextPlayer}
                                className="w-full py-4 rounded-2xl bg-indigo-600 active:scale-95 text-white font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
                            >
                                <span>Ruolo memorizzato, avanti</span>
                                <ArrowRight size={18} />
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* 3. TAVOLO DI GIOCO / LISTA CON OCCHIO PER MEMORIA */}
            {phase === 'table' && (
                <div className="flex-1 flex flex-col p-5 overflow-y-auto no-scrollbar space-y-4">
                    <div className="border-b border-slate-900 pb-2 flex items-center justify-between">
                        <div>
                            <h2 className="text-base font-bold text-white">Partita in Corso</h2>
                            <p className="text-xs text-slate-400">Giocate a voce! Clicca l'occhio per sbirciare</p>
                        </div>
                        <span className="text-xs px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono rounded-lg">
              {assignedRoles.length} giocatori
            </span>
                    </div>

                    <div className="space-y-2 flex-1">
                        {assignedRoles.map(({ player, role }) => {
                            const isRevealed = revealedPlayerIds.has(player.id);

                            return (
                                <div
                                    key={player.id}
                                    className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between transition-all"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white ${player.avatarColor}`}>
                                            {player.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <span className="text-sm font-semibold block text-white">{player.name}</span>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                {isRevealed ? (
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${role.badgeColor}`}>
                            {role.name}
                          </span>
                                                ) : (
                                                    <span className="text-[11px] text-slate-600 font-mono tracking-widest">
                            ••••••••
                          </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => toggleRevealPlayer(player.id)}
                                        className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 active:text-white transition-colors"
                                        title={isRevealed ? "Nascondi ruolo" : "Mostra ruolo dimenticato"}
                                    >
                                        {isRevealed ? <EyeOff size={16} className="text-amber-400" /> : <Eye size={16} />}
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    <div className="pt-2 border-t border-slate-900 flex gap-2">
                        <button
                            onClick={handleConfirmRestart}
                            className="flex-1 py-3.5 rounded-2xl bg-indigo-600 active:scale-95 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                        >
                            <RotateCcw size={15} /> Nuova Partita
                        </button>
                        <button
                            onClick={onExit}
                            className="py-3.5 px-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 font-bold text-xs uppercase tracking-wider"
                        >
                            Esci
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};