import { state } from './state.js';

export function sortBomb() {
    if ((!state.isBombVisible) && (areChancesAmong(5)))
        return 'bomb';
    if ((state.isBombVisible) && (areChancesAmong(10)))
        return 'hideBomb';
    return false;
}

export function sortMolotov() {
    return (areChancesAmong(10));
}

function areChancesAmong(percetage) {
    return (Math.floor((Math.random() * 100) + 1) <= percetage);
}
