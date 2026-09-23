import rawWords from './impostor_words.json';
import { ImpostorWordItem } from '../types';

export const IMPOSTOR_WORDS: ImpostorWordItem[] = rawWords as ImpostorWordItem[];

// Memoria per tenere traccia delle parole già usate nella sessione corrente
const usedWords = new Set<string>();

/**
 * Estrae una parola casuale dalla pool senza mai ripeterla finché non sono finite tutte.
 */
export function getNextImpostorWord(): ImpostorWordItem {
    let available = IMPOSTOR_WORDS.filter((item) => !usedWords.has(item.word));

    // Se tutte le parole della pool sono state usate, resetta la cronologia
    if (available.length === 0) {
        usedWords.clear();
        available = IMPOSTOR_WORDS;
    }

    const randomIndex = Math.floor(Math.random() * available.length);
    const picked = available[randomIndex];

    usedWords.add(picked.word);
    return picked;
}