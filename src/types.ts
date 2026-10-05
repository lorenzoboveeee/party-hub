export interface Player {
    id: string;
    name: string;
    avatarColor: string;
    isActive: boolean;
}

export type GameId =
    | 'impostor'
    | 'impostor_football'
    | 'impostor_people'
    | 'lupus'
    | 'stima'
    | 'stima_personal';

export interface GameInfo {
    id: GameId;
    title: string;
    subtitle: string;
    badge: string;
    minPlayers: number;
    maxPlayers: number;
    accentGradient: string;
    iconName: 'ghost' | 'trophy' | 'users' | 'moon' | 'target' | 'user-check';
    description: string;
}

export type TabType = 'games' | 'players';

export interface ImpostorWordItem {
    word: string;
    clue: string;
}

export interface ImpostorPlayerRole {
    player: Player;
    isImpostor: boolean;
    hasViewed: boolean;
    isEliminated: boolean;
}

export type ImpostorPhase =
    | 'pass'
    | 'reveal'
    | 'starter'
    | 'discussion'
    | 'game_over';

// --- TIPI LUPUS IN FABULA ---
export type LupusRoleId =
    | 'contadino'
    | 'lupo'
    | 'angelo'
    | 'veggente'
    | 'sgualdrina'
    | 'mitomane'
    | 'sindaco'
    | 'lupo_mannaro'
    | 'piromane';

export interface LupusRoleDefinition {
    id: LupusRoleId;
    name: string;
    team: 'villaggio' | 'lupi' | 'solitario';
    badgeColor: string;
    description: string;
}

export interface LupusAssignedRole {
    player: Player;
    role: LupusRoleDefinition;
}

export type LupusPhase = 'setup' | 'pass' | 'table';

// --- TIPI STIMA AL MILLIMETRO ---
export interface StimaQuestionItem {
    id: string;
    regularQuestion: string;
    impostorQuestion: string;
    realAnswer: number;
    unit?: string;
}

export interface StimaPlayerAnswer {
    player: Player;
    isImpostor: boolean;
    question: string;
    answer: number;
    isEliminated?: boolean;
}

export type StimaPhase = 'pass' | 'board' | 'voting' | 'reveal';

// --- TIPI STIMA PERSONALE ---
export interface PersonalQuestionItem {
    id: string;
    regularQuestion: string;
    impostorQuestion: string;
    unit?: string;
}

export interface PersonalPlayerAnswer {
    player: Player;
    isImpostor: boolean;
    question: string;
    answer: number;
    isEliminated?: boolean;
}

export type PersonalPhase = 'pass' | 'board' | 'voting' | 'reveal';