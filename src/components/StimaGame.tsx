import React, { useState, useEffect } from 'react';
import { Player, StimaQuestionItem, StimaPlayerAnswer, StimaPhase } from '../types';
import { getNextStimaQuestion } from '../data/stima';
import {
    Home,
    RotateCcw,
    ChevronUp,
    ArrowRight,
    Target,
    Trophy,
    Eye,
    Delete
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface StimaGameProps {
    activePlayers: Player[];
    impostorsCount: number;
    onExit: () => void;
}

function formatItalianNumber(n: number): string {
    if (isNaN(n) || n === 0) return '0';
    if (n >= 1000000000000) {
        const val = (n / 1000000000000).toLocaleString('it-IT', { maximumFractionDigits: 2 });
        return `${val} Bilioni`;
    }
    if (n >= 1000000000) {
        const val = (n / 1000000000).toLocaleString('it-IT', { maximumFractionDigits: 2 });
        return `${val} Miliardi`;
    }
    if (n >= 1000000) {
        const val = (n / 1000000).toLocaleString('it-IT', { maximumFractionDigits: 2 });
        return `${val} Milioni`;
    }
    return n.toLocaleString('it-IT', { maximumFractionDigits: 2 });
}

export const StimaGame: React.FC<StimaGameProps> = ({
                                                        activePlayers,
                                                        impostorsCount = 1,
                                                        onExit
                                                    }) => {
    const [currentQuestion, setCurrentQuestion] = useState<StimaQuestionItem | null>(null);
    const [answers, setAnswers] = useState<StimaPlayerAnswer[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [phase, setPhase] = useState<StimaPhase>('pass');
    const [isQuestionRevealed, setIsQuestionRevealed] = useState<boolean>(false);

    // Valore input testuale corrente nel keypad
    const [inputBuffer, setInputBuffer] = useState<string>('0');

    const parsedCurrentValue = Math.max(0, parseFloat(inputBuffer.replace(',', '.')) || 0);

    const startNewRound = () => {
        const q = getNextStimaQuestion();
        setCurrentQuestion(q);

        // Seleziona gli indici degli impostori
        const actualImpostors = Math.min(impostorsCount, Math.max(1, activePlayers.length - 1));
        const shuffledIndexes = [...Array(activePlayers.length).keys()].sort(() => 0.5 - Math.random());
        const impostorIndexes = new Set(shuffledIndexes.slice(0, actualImpostors));

        const initialAnswers: StimaPlayerAnswer[] = activePlayers.map((player, idx) => {
            const isImp = impostorIndexes.has(idx);
            return {
                player,
                isImpostor: isImp,
                question: isImp ? q.impostorQuestion : q.regularQuestion,
                answer: 0,
            };
        });

        setAnswers(initialAnswers);
        setCurrentIndex(0);
        setPhase('pass');
        setIsQuestionRevealed(false);
        setInputBuffer('0');
    };

    useEffect(() => {
        startNewRound();
    }, [impostorsCount]);

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
        if (parsedCurrentValue <= 0) {
            if (!window.confirm('Vuoi davvero confermare 0 come stima?')) return;
        }
        const updated = [...answers];
        updated[currentIndex].answer = parsedCurrentValue;
        setAnswers(updated);
        setIsQuestionRevealed(false);

        if (currentIndex + 1 < answers.length) {
            setCurrentIndex((prev) => prev + 1);
            setInputBuffer('0');
            setPhase('pass');
        } else {
            setPhase('board');
            confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
        }
    };

    // Funzioni tastierino
    const handleDigit = (digit: string) => {
        setInputBuffer((prev) => {
            if (prev === '0' && digit !== ',') return digit;
            if (prev.length >= 15) return prev;
            return prev + digit;
        });
    };

    const handleComma = () => {
        setInputBuffer((prev) => {
            if (prev.includes(',')) return prev;
            return prev + ',';
        });
    };

    const handleDelete = () => {
        setInputBuffer((prev) => {
            if (prev.length <= 1) return '0';
            return prev.slice(0, -1);
        });
    };

    const handleClear = () => {
        setInputBuffer('0');
    };

    const handleMultiplier = (multiplier: number) => {
        const numeric = parseFloat(inputBuffer.replace(',', '.')) || 0;
        if (numeric === 0) return;
        const multiplied = numeric * multiplier;
        if (multiplied > 1000000000000000) return; // Limite massimo 1 biliardo
        setInputBuffer(multiplied.toString().replace('.', ','));
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

            {/* 1. FASE PASSAGGIO E INSERIMENTO STIMA TRAMITE KEYPAD */}
            {phase === 'pass' && currentTurn && (
                <div className="flex-1 flex flex-col justify-between p-4 overflow-y-auto no-scrollbar">
                    <div className="text-center pt-1">
            <span className="text-[11px] uppercase font-bold tracking-widest text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">
              Giocatore {currentIndex + 1} di {answers.length}
            </span>
                        <h2 className="text-lg font-black mt-2">Passa il telefono a</h2>
                        <p className="text-2xl font-extrabold text-blue-400">{currentTurn.player.name}</p>
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
                            <div className="w-full rounded-3xl p-4 flex flex-col justify-between text-center shadow-2xl transition-all duration-300 animate-in fade-in zoom-in-95 bg-slate-900 border border-slate-800">
                                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-3 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20">
                    Domanda Segreta
                  </span>
                                    <h3 className="text-sm font-bold text-white mt-2 leading-snug px-1">
                                        "{currentTurn.question}"
                                    </h3>
                                </div>

                                {/* DISPLAY NUMERO */}
                                <div className="mt-3 py-2 px-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
                                    <div className="text-left overflow-hidden">
                                        <span className="text-[10px] text-slate-500 uppercase font-bold block">Stima Digitata</span>
                                        <div className="text-xl font-black text-amber-300 font-mono truncate">
                                            {inputBuffer}
                                        </div>
                                    </div>
                                    <div className="text-right pl-2">
                                        <span className="text-[9px] text-slate-400 block font-semibold">Lettura estesa</span>
                                        <span className="text-xs font-bold text-emerald-400 truncate max-w-[130px] block">
                      {formatItalianNumber(parsedCurrentValue)}
                    </span>
                                    </div>
                                </div>

                                {/* TASTI RAPIDI MOLTIPLICATORI */}
                                <div className="grid grid-cols-4 gap-1.5 mt-2.5">
                                    <button
                                        onClick={() => handleMultiplier(1000)}
                                        className="py-1.5 rounded-xl bg-slate-800 border border-slate-700 active:bg-blue-600 text-xs font-bold text-blue-300 active:text-white"
                                    >
                                        + Mila (k)
                                    </button>
                                    <button
                                        onClick={() => handleMultiplier(1000000)}
                                        className="py-1.5 rounded-xl bg-slate-800 border border-slate-700 active:bg-blue-600 text-xs font-bold text-blue-300 active:text-white"
                                    >
                                        + Mln (M)
                                    </button>
                                    <button
                                        onClick={() => handleMultiplier(1000000000)}
                                        className="py-1.5 rounded-xl bg-slate-800 border border-slate-700 active:bg-blue-600 text-xs font-bold text-blue-300 active:text-white"
                                    >
                                        + Mld (B)
                                    </button>
                                    <button
                                        onClick={() => handleMultiplier(1000000000000)}
                                        className="py-1.5 rounded-xl bg-slate-800 border border-slate-700 active:bg-blue-600 text-xs font-bold text-blue-300 active:text-white"
                                    >
                                        + Bilione
                                    </button>
                                </div>

                                {/* TASTIERINO TOUCH (KEYPAD) */}
                                <div className="grid grid-cols-3 gap-1.5 mt-2.5">
                                    {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                                        <button
                                            key={digit}
                                            onClick={() => handleDigit(digit)}
                                            className="py-3 rounded-2xl bg-slate-950/80 border border-slate-800 active:bg-slate-800 text-lg font-bold font-mono text-white active:scale-95 transition-transform"
                                        >
                                            {digit}
                                        </button>
                                    ))}
                                    <button
                                        onClick={handleComma}
                                        className="py-3 rounded-2xl bg-slate-950/80 border border-slate-800 active:bg-slate-800 text-lg font-bold font-mono text-slate-300 active:scale-95"
                                    >
                                        ,
                                    </button>
                                    <button
                                        onClick={() => handleDigit('0')}
                                        className="py-3 rounded-2xl bg-slate-950/80 border border-slate-800 active:bg-slate-800 text-lg font-bold font-mono text-white active:scale-95"
                                    >
                                        0
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="py-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 active:bg-rose-600 text-rose-300 active:text-white flex items-center justify-center active:scale-95"
                                    >
                                        <Delete size={20} />
                                    </button>
                                </div>

                                <div className="flex justify-end mt-1">
                                    <button
                                        onClick={handleClear}
                                        className="text-[11px] text-slate-500 hover:text-rose-400 font-semibold px-2 py-0.5"
                                    >
                                        Azzera Tutto
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="pt-2">
                        {isQuestionRevealed && (
                            <button
                                onClick={handleConfirmAnswer}
                                className="w-full py-3.5 rounded-2xl bg-blue-600 active:scale-95 text-white font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all"
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
                            Confrontate le risposte: chi ha una stima incompatibile o sospetta?
                        </p>
                    </div>

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
                            <Eye size={16} /> Rivela gli Impostori
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
                    Impostore:
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