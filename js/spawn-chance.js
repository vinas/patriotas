import { state } from './state.js';

export function sortBombAppears() {
    return (!state.isBombVisible) && areChancesAmong(5);
}

export function sortBombVanishes() {
    return state.isBombVisible && areChancesAmong(10);
}

export function sortMolotov() {
    return (areChancesAmong(10));
}

function areChancesAmong(percetage) {
    return (Math.floor((Math.random() * 100) + 1) <= percetage);
}
