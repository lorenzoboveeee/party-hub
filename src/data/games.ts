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
        subtitle: 'Amici, conoscenti e comitiva',
        badge: 'Gossip & Friends',
        minPlayers: 3,
        maxPlayers: 16,
        accentGradient: 'from-cyan-500 to-teal-700',
        iconName: 'users',
        description: 'La parola segreta è una persona del gruppo. L’impostore è al buio completo e deve improvvisare.'
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
        subtitle: 'Indovina il numero e smaschera chi è fuori scala',
        badge: 'Numeri & Trivia',
        minPlayers: 3,
        maxPlayers: 16,
        accentGradient: 'from-blue-700 to-slate-900',
        iconName: 'target',
        description: 'Tutti rispondono a una domanda numerica con il tastierino. Chi ha avuto la domanda fake spara cifre sospette!'
    },
    {
        id: 'stima_personal',
        title: 'Stima Personale',
        subtitle: 'Abitudini, frequenze e segreti del gruppo',
        badge: 'Abitudini & Gossip',
        minPlayers: 3,
        maxPlayers: 16,
        accentGradient: 'from-fuchsia-600 to-purple-800',
        iconName: 'user-check',
        description: 'Domande personali tipo "Quante volte fai la pipì a settimana?". L’impostore ha una domanda diversa e rischia di sputtanarsi!'
    }
];