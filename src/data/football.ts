import rawFootballWords from './football_words.json';
import { ImpostorWordItem } from '../types';

export const FOOTBALL_WORDS: ImpostorWordItem[] = rawFootballWords as ImpostorWordItem[];

const usedFootballWords = new Set<string>();

/**
 * Estrae un calciatore/squadra/stadio senza ripetizioni finché la pool non è esaurita.
 */
export function getNextFootballWord(): ImpostorWordItem {
    let available = FOOTBALL_WORDS.filter((item) => !usedFootballWords.has(item.word));

    if (available.length === 0) {
        usedFootballWords.clear();
        available = FOOTBALL_WORDS;
    }

    const randomIndex = Math.floor(Math.random() * available.length);
    const picked = available[randomIndex];

    usedFootballWords.add(picked.word);
    return picked;
}