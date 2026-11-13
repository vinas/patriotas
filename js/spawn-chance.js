import { state } from './state.js';

export function rollBombAppears() {
    return (!state.isBombVisible) && rollPercent(5);
}

export function rollBombVanishes() {
    return state.isBombVisible && rollPercent(10);
}

export function rollMolotov() {
    return (rollPercent(10));
}

function rollPercent(percentage) {
    return (Math.floor((Math.random() * 100) + 1) <= percentage);
}
