import rawQuestions from './stima_questions.json';
import { StimaQuestionItem } from '../types';

export const STIMA_QUESTIONS: StimaQuestionItem[] = rawQuestions as StimaQuestionItem[];

const usedQuestions = new Set<string>();

export function getNextStimaQuestion(): StimaQuestionItem {
    let available = STIMA_QUESTIONS.filter((q) => !usedQuestions.has(q.id));

    if (available.length === 0) {
        usedQuestions.clear();
        available = STIMA_QUESTIONS;
    }

    const randomIndex = Math.floor(Math.random() * available.length);
    const picked = available[randomIndex];

    usedQuestions.add(picked.id);
    return picked;
}