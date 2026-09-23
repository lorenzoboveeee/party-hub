import React, { useState, useEffect, useId } from 'react';
import { Player, StimaQuestionItem, StimaPlayerAnswer, StimaPhase } from '../types';
import { getNextStimaQuestion } from '../data/stima';
import {
    Home,
    RotateCcw,
    ChevronUp,
    ArrowRight,
    Target,
    Trophy,
    Eye
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface StimaGameProps {
    activePlayers: Player[];
    onExit: () => void;
}

// Scala logaritmica continua: slider da 0 a 1200 corrisponde a 10^0 (1) fino a 10^12 (1 Bilione)
function sliderToLogValue(val: number): number {
    if (val <= 0) return 1;
    const exponent = (val / 1200) * 12; // esponente da 0 a 12
    const raw = Math.pow(10, exponent);

    if (raw < 20) return Math.round(raw);
    if (raw < 100) return Math.round(raw / 5) * 5;
    if (raw < 500) return Math.round(raw / 10) * 10;
    if (raw < 2000) return Math.round(raw / 50) * 50;
    if (raw < 10000) return Math.round(raw / 250) * 250;
    if (raw < 100000) return Math.round(raw / 1000) * 1000;
    if (raw < 1000000) return Math.round(raw / 10000) * 10000;
    if (raw < 10000000) return Math.round(raw / 100000) * 10000;
    if (raw < 100000000) return Math.round(raw / 1000000) * 1000000;
    if (raw < 1000000000) return Math.round(raw / 10000000) * 10000000;
    if (raw < 10000000000) return Math.round(raw / 100000000) * 100000000;
    if (raw < 100000000000) return Math.round(raw / 1000000000) * 1000000000;
    return Math.round(raw / 10000000000) * 10000000000;
}

function formatItalianNumber(n: number): string {
    if (n >= 1000000000000) {
        const val = (n / 1000000000000).toLocaleString('it-IT', { maximumFractionDigits: 1 });
        return `${val} ${n === 1000000000000 ? 'Bilione' : 'Bilioni'}`;
    }
    if (n >= 1000000000) {
        const val = (n / 1000000000).toLocaleString('it-IT', { maximumFractionDigits: 1 });
        return `${val} ${n === 1000000000 ? 'Miliardo' : 'Miliardi'}`;
    }
    if (n >= 1000000) {
        const val = (n / 1000000).toLocaleString('it-IT', { maximumFractionDigits: 1 });
        return `${val} ${n === 1000000 ? 'Milione' : 'Milioni'}`;
    }
    return n.toLocaleString('it-IT');
}

export const StimaGame: React.FC<StimaGameProps> = ({ activePlayers, onExit }) => {
    const sliderInputId = useId();
    const [currentQuestion, setCurrentQuestion] = useState<StimaQuestionItem | null>(null);
    const [answers, setAnswers] = useState<StimaPlayerAnswer[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [phase, setPhase] = useState<StimaPhase>('pass');
    const [isQuestionRevealed, setIsQuestionRevealed] = useState<boolean>(false);

    // Valore slider (0 -> 1200)
    const [sliderPos, setSliderPos] = useState<number>(150);
    const currentValue = sliderToLogValue(sliderPos);

    const startNewRound = () => {
        const q = getNextStimaQuestion();
        setCurrentQuestion(q);

        const impostorIndex = Math.floor(Math.random() * activePlayers.length);

        const initialAnswers: StimaPlayerAnswer[] = activePlayers.map((player, idx) => {
            const isImp = idx === impostorIndex;
            return {
                player,
                isImpostor: isImp,
                question: isImp ? q.impostorQuestion : q.regularQuestion,
                answer: 25,
            };
        });

        setAnswers(initialAnswers);
        setCurrentIndex(0);
        setPhase('pass');
        setIsQuestionRevealed(false);
        setSliderPos(150);
    };

    useEffect(() => {
        startNewRound();
    }, []);

    const handleConfirmExit = () => {
        if (window.confirm('Vuoi tornare al menu principale?')) {
            onExit();
        }
    };

    const handleConfirmRestart = () => {
        if (window.confirm('Vuoi riavviare con una nuova domanda?')) {
            startNewRound();
        }
    };

    const currentTurn = answers[currentIndex];

    const handleConfirmAnswer = () => {
        const updated = [...answers];
        updated[currentIndex].answer = currentValue;
        setAnswers(updated);
        setIsQuestionRevealed(false);

        if (currentIndex + 1 < answers.length) {
            setCurrentIndex((prev) => prev + 1);
            setSliderPos(150);
            setPhase('pass');
        } else {
            setPhase('board');
            confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-950 text-white relative">

            {/* HEADER SAFE AREA PER NOTCH / DYNAMIC ISLAND */}
            <div className="pt-12 pb-2 px-5 flex items-center justify-between border-b border-slate-900 bg-slate-950/80 backdrop-blur-md z-40">
                <button
                    onClick={handleConfirmExit}
                    className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 active:text-white active:scale-90 transition-all"
                >
                    <Home size={18} />
                </button>

                <div className="flex-1 px-4 text-center">
          <span className="text-[10px] uppercase font-bold tracking-widest text-blue-400 flex items-center justify-center gap-1.5">
            <Target size={12} /> Stima al Millimetro
          </span>
                </div>

                <button
                    onClick={handleConfirmRestart}
                    className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 active:text-white active:scale-90 transition-all"
                >
                    <RotateCcw size={18} />
                </button>
            </div>

            {/* 1. PASSAGGIO E INSERIMENTO STIMA */}
            {phase === 'pass' && currentTurn && (
                <div className="flex-1 flex flex-col justify-between p-6">
                    <div className="text-center pt-2">
            <span className="text-xs uppercase font-bold tracking-widest text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">
              Giocatore {currentIndex + 1} di {answers.length}
            </span>
                        <h2 className="text-xl font-black mt-3">Passa il telefono a</h2>
                        <p className="text-2xl font-extrabold text-blue-400 mt-1">{currentTurn.player.name}</p>
                    </div>

                    <div className="relative w-full flex flex-col items-center my-auto">
                        {!isQuestionRevealed ? (
                            <div
                                onClick={() => setIsQuestionRevealed(true)}
                                className="w-full h-64 rounded-3xl bg-gradient-to-b from-slate-900 to-blue-950/30 border-2 border-dashed border-blue-500/40 p-6 flex flex-col items-center justify-center cursor-pointer active:scale-95 transition-all shadow-xl"
                            >
                                <div className="w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center mb-3 text-blue-400 animate-bounce">
                                    <ChevronUp size={28} />
                                </div>
                                <h3 className="text-base font-bold text-slate-200">Tocca per leggere la domanda</h3>
                                <p className="text-xs text-slate-400 mt-1">Non far leggere agli altri!</p>
                            </div>
                        ) : (
                            <div className="w-full min-h-[320px] rounded-3xl p-6 flex flex-col justify-between text-center shadow-2xl transition-all duration-300 animate-in fade-in zoom-in-95 bg-slate-900 border border-slate-800">
                                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20">
                    La tua domanda segreta
                  </span>
                                    <h3 className="text-lg font-bold text-white mt-4 leading-snug">
                                        "{currentTurn.question}"
                                    </h3>
                                    <p className="text-[11px] text-slate-400 mt-2">
                                        Nessuno sa se questa è la domanda comune o quella dell'impostore.
                                    </p>
                                </div>

                                {/* SLIDER LOGARITMICO PULITO (1 -> 1.000 MILIARDI) */}
                                <div className="mt-6 pt-4 border-t border-slate-800 space-y-4">
                                    <div className="text-center">
                                        <span className="text-[11px] text-slate-400 uppercase font-semibold">La tua stima:</span>
                                        <div className="text-3xl font-black text-amber-300 mt-1 tracking-tight font-mono">
                                            {formatItalianNumber(currentValue)}
                                        </div>
                                    </div>

                                    <div className="px-1">
                                        <input
                                            id={sliderInputId}
                                            name="stima-log-slider"
                                            type="range"
                                            min={0}
                                            max={1200}
                                            step={1}
                                            value={sliderPos}
                                            onChange={(e) => setSliderPos(Number(e.target.value))}
                                            aria-label="Regola la tua stima"
                                            className="w-full h-3 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                        />
                                        <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1.5">
                                            <span>1</span>
                                            <span>1.000</span>
                                            <span>1 Mln</span>
                                            <span>1 Mld</span>
                                            <span>1 Bilione</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="pt-2">
                        {isQuestionRevealed && (
                            <button
                                onClick={handleConfirmAnswer}
                                className="w-full py-4 rounded-2xl bg-blue-600 active:scale-95 text-white font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all"
                            >
                                <span>Conferma Stima e Passa</span>
                                <ArrowRight size={18} />
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* 2. TABELLONE RISPOSTE COLLETTIVO */}
            {phase === 'board' && currentQuestion && (
                <div className="flex-1 flex flex-col p-5 overflow-y-auto no-scrollbar space-y-4">
                    <div className="p-4 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-center">
                        <span className="text-[10px] uppercase font-bold text-blue-400">Domanda del Gruppo:</span>
                        <h2 className="text-base font-extrabold text-white mt-1 leading-snug">
                            "{currentQuestion.regularQuestion}"
                        </h2>
                        <p className="text-[11px] text-slate-400 mt-1">
                            Uno di voi aveva una domanda diversa! Confrontate le cifre e trovate l'infiltrato.
                        </p>
                    </div>

                    {/* LISTA RISPOSTE */}
                    <div className="space-y-2 flex-1">
                        {answers.map(({ player, answer }) => (
                            <div
                                key={player.id}
                                className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white ${player.avatarColor}`}>
                                        {player.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-sm font-semibold text-white">{player.name}</span>
                                </div>

                                <div className="text-right">
                  <span className="text-base font-black text-amber-300 font-mono">
                    {formatItalianNumber(answer)}
                  </span>
                                    {currentQuestion.unit && (
                                        <span className="text-[10px] text-slate-400 block font-medium">
                      {currentQuestion.unit}
                    </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-2 border-t border-slate-900">
                        <button
                            onClick={() => setPhase('reveal')}
                            className="w-full py-4 rounded-2xl bg-amber-500 active:scale-95 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
                        >
                            <Eye size={16} /> Rivela chi era l'Impostore
                        </button>
                    </div>
                </div>
            )}

            {/* 3. SMASCHERAMENTO FINALE */}
            {phase === 'reveal' && currentQuestion && (
                <div className="flex-1 flex flex-col justify-between p-6 text-center pt-4">
                    <div>
                        <div className="w-16 h-16 mx-auto rounded-3xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-3 shadow-lg">
                            <Trophy size={32} />
                        </div>
                        <h2 className="text-2xl font-black text-white">Smascheramento!</h2>
                        <p className="text-xs text-slate-400 mt-1">Ecco le domande a confronto</p>
                    </div>

                    <div className="my-auto space-y-3 text-left">
                        {answers.filter(a => a.isImpostor).map(({ player, question, answer }) => (
                            <div key={player.id} className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-1.5">
                                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-rose-400">
                    L'Impostore era:
                  </span>
                                    <span className="text-xs font-mono font-bold text-amber-300">
                    Ha stimato: {formatItalianNumber(answer)}
                  </span>
                                </div>
                                <h3 className="text-lg font-black text-white">{player.name}</h3>
                                <p className="text-xs text-slate-300">
                                    <span className="text-slate-400">La sua domanda segreta era:</span><br />
                                    "{question}"
                                </p>
                            </div>
                        ))}

                        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
                            <span className="text-[10px] uppercase font-bold text-slate-400">Dato Reale Domanda Gruppo:</span>
                            <p className="text-base font-black text-emerald-400 font-mono mt-0.5">
                                {formatItalianNumber(currentQuestion.realAnswer)} {currentQuestion.unit || ''}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2 pt-2">
                        <button
                            onClick={startNewRound}
                            className="w-full py-4 rounded-2xl bg-blue-600 active:scale-95 text-white font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all"
                        >
                            <RotateCcw size={18} />
                            <span>Nuova Domanda</span>
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