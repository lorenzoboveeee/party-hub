import { GameInfo } from '../types';

export const GAMES_LIST: GameInfo[] = [
    {
        id: 'impostor',
        title: "L'Impostore",
        subtitle: 'Parola segreta, indizio bilanciato e bluff',
        badge: 'Party Classic',
        minPlayers: 3,
        maxPlayers: 16,
        accentGradient: 'from-blue-600 to-indigo-700',
        iconName: 'ghost',
        description: "Tutti conoscono la parola segreta, l'impostore ha solo un indizio secco. Scopri chi bluffa prima che restino in 2!"
    },
    {
        id: 'impostor_football',
        title: 'Impostore Football',
        subtitle: 'Calciatori, squadre, trofei e stadi',
        badge: 'Calcio & Serie A',
        minPlayers: 3,
        maxPlayers: 16,
        accentGradient: 'from-sky-500 to-blue-700',
        iconName: 'trophy',
        description: 'Dedicato a chi mastica calcio: descrivi campioni storici o club senza svelare il nome al babbone.'
    },
    {
        id: 'impostor_people',
        title: 'Impostore People',
        subtitle: 'Amici, conoscenti e VIP noti a tutti',
        badge: 'Gossip & Friends',
        minPlayers: 3,
        maxPlayers: 16,
        accentGradient: 'from-cyan-500 to-teal-700',
        iconName: 'users',
        description: 'La parola segreta è una persona della comitiva. L’impostore è al buio e deve improvvisare.'
    },
    {
        id: 'lupus',
        title: 'Lupus in Fabula',
        subtitle: 'Notte, giorno e tradimenti di villaggio',
        badge: 'Ruoli Segreti',
        minPlayers: 7,
        maxPlayers: 20,
        accentGradient: 'from-indigo-600 to-violet-800',
        iconName: 'moon',
        description: 'Il villaggio dorme, i lupi sbranano. Veggente, guardie, sindaco e piromane al tavolo.'
    },
    {
        id: 'stima',
        title: 'Stima al Millimetro',
        subtitle: 'Indovina il numero più vicino al vero',
        badge: 'Numeri & Trivia',
        minPlayers: 2,
        maxPlayers: 12,
        accentGradient: 'from-blue-700 to-slate-900',
        iconName: 'target',
        description: 'Chi spara la cifra più vicina al numero reale vince il round.'
    }
];