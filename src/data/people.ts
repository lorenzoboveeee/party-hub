import rawPeopleWords from './people_words.json';
import { ImpostorWordItem } from '../types';

export const PEOPLE_WORDS: ImpostorWordItem[] = rawPeopleWords as ImpostorWordItem[];

const usedPeopleWords = new Set<string>();

/**
 * Estrae un personaggio famoso/VIP senza ripetizioni finché la pool non è esaurita.
 */
export function getNextPeopleWord(): ImpostorWordItem {
    let available = PEOPLE_WORDS.filter((item) => !usedPeopleWords.has(item.word));

    if (available.length === 0) {
        usedPeopleWords.clear();
        available = PEOPLE_WORDS;
    }

    const randomIndex = Math.floor(Math.random() * available.length);
    const picked = available[randomIndex];

    usedPeopleWords.add(picked.word);
    return picked;
}