import rawQuestions from './personal_questions.json';
import { PersonalQuestionItem } from '../types';

export const PERSONAL_QUESTIONS: PersonalQuestionItem[] = rawQuestions as PersonalQuestionItem[];

const usedQuestions = new Set<string>();

export function getNextPersonalQuestion(): PersonalQuestionItem {
    let available = PERSONAL_QUESTIONS.filter((q) => !usedQuestions.has(q.id));

    if (available.length === 0) {
        usedQuestions.clear();
        available = PERSONAL_QUESTIONS;
    }

    const randomIndex = Math.floor(Math.random() * available.length);
    const picked = available[randomIndex];

    usedQuestions.add(picked.id);
    return picked;
}