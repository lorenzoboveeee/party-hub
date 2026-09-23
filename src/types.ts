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
    | 'stima';

export interface GameInfo {
    id: GameId;
    title: string;
    subtitle: string;
    badge: string;
    minPlayers: number;
    maxPlayers: number;
    accentGradient: string;
    iconName: 'ghost' | 'trophy' | 'users' | 'moon' | 'target';
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
    regularQuestion: string;   // La domanda che hanno tutti
    impostorQuestion: string;  // La domanda che ha solo l'impostore (su scala simile ma tema diverso)
    realAnswer: number;        // Il valore reale (opzionale per curiosità a fine partita)
    unit?: string;             // es. "km", "anni", "persone"
}

export interface StimaPlayerAnswer {
    player: Player;
    isImpostor: boolean;
    question: string;
    answer: number;
}

export type StimaPhase = 'pass' | 'input' | 'board' | 'reveal';