import { LupusRoleDefinition, LupusRoleId } from '../types';

export const LUPUS_ROLES: Record<LupusRoleId, LupusRoleDefinition> = {
    contadino: {
        id: 'contadino',
        name: 'Contadino',
        team: 'villaggio',
        badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        description: 'Non hai poteri notturni. Di giorno discuti, ascolta i sospetti e vota per scoprire ed eliminare tutti i lupi.'
    },
    lupo: {
        id: 'lupo',
        name: 'Lupo',
        team: 'lupi',
        badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
        description: 'Ti svegli di notte con gli altri lupi. Vi coalizzate in silenzio per scegliere una vittima da sbranare senza farvi scoprire di giorno.'
    },
    angelo: {
        id: 'angelo',
        name: 'Angelo',
        team: 'villaggio',
        badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
        description: 'Ti svegli ogni notte e scegli una persona da proteggere: se i lupi la attaccano durante quella notte, non morirà.'
    },
    veggente: {
        id: 'veggente',
        name: 'Veggente',
        team: 'villaggio',
        badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
        description: 'Ti svegli ogni notte e indichi una persona al narratore, che ti rivelerà silenziosamente se è un lupo oppure un innocente.'
    },
    sgualdrina: {
        id: 'sgualdrina',
        name: 'Sgualdrina',
        team: 'villaggio',
        badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
        description: 'Ti svegli ogni notte e scegli una persona con cui andare a letto per salvarti dai lupi. Attenzione: se scegli un lupo, muori sul colpo!'
    },
    mitomane: {
        id: 'mitomane',
        name: 'Mitomane',
        team: 'villaggio',
        badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        description: 'Durante la notte puoi scegliere di rubare l’identità di un personaggio già morto. Il narratore annuncerà di giorno se hai cambiato ruolo o meno.'
    },
    sindaco: {
        id: 'sindaco',
        name: 'Sindaco',
        team: 'villaggio',
        badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        description: 'Sei un cittadino speciale: i lupi non possono sbranarti durante la notte. Puoi essere eliminato solo con il voto del villaggio di giorno.'
    },
    lupo_mannaro: {
        id: 'lupo_mannaro',
        name: 'Lupo Mannaro',
        team: 'solitario',
        badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
        description: 'Giochi da solo! Ti svegli ogni 3 notti e puoi sbranare chiunque, anche gli altri lupi. Il tuo attacco è letale e inarrestabile.'
    },
    piromane: {
        id: 'piromane',
        name: 'Piromane',
        team: 'solitario',
        badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
        description: 'Ogni notte cospargi di benzina una persona diversa. Dalla terza notte in poi puoi decidere di accendere la miccia e bruciarle tutte insieme!'
    }
};