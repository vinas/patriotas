import { state } from './state.js';
import {
    MIN_OFFICER_MOVE_RATE, BASE_CHAR_SIZE, BASE_ITEM_SIZE, BASE_CATCH_TOLERANCE,
    BASE_CROSS_BORDER_TOLERANCE, BASE_THROW_SPEED
} from './constants.js';
import { scaleToMap, scaleToMapExact } from './geometry.js';

export function resizeMapAndItems() {
    calculateMeasurements();
    resizeVisualElements();
}

function calculateMeasurements() {
    state.mapSize = document.getElementById('background').clientWidth;
    state.crossBorderTolerance = scaleToMap(BASE_CROSS_BORDER_TOLERANCE);
    state.catchTolerance = scaleToMap(BASE_CATCH_TOLERANCE);
    state.charSize = scaleToMap(BASE_CHAR_SIZE);
    state.itemSize = scaleToMap(BASE_ITEM_SIZE);
    state.throwSpeed = scaleToMap(BASE_THROW_SPEED);
    state.speedTable = setSpeedTable(scaleToMap(MIN_OFFICER_MOVE_RATE));
}

function setSpeedTable(minMoveRate) {
    const step = scaleToMapExact;
    return [
        [0, 0],
        [minMoveRate, 0],
        [minMoveRate + step(1), 0],
        [minMoveRate + step(2), minMoveRate],
        [minMoveRate + step(3), minMoveRate],
        [minMoveRate + step(3), minMoveRate + step(1)],
        [minMoveRate + step(3), minMoveRate + step(2)],
        [minMoveRate + step(3), minMoveRate + step(3)],
        [minMoveRate + step(4), minMoveRate + step(3)],
        [minMoveRate + step(4), minMoveRate + step(4)],
        [minMoveRate + step(5), minMoveRate + step(4)],
        [minMoveRate + step(5), minMoveRate + step(5)],
        [minMoveRate + step(6), minMoveRate + step(5)],
        [minMoveRate + step(6), minMoveRate + step(6)],
        [minMoveRate + step(7), minMoveRate + step(6)],
        [minMoveRate + step(7), minMoveRate + step(7)],
        [minMoveRate + step(8), minMoveRate + step(7)],
        [minMoveRate + step(8), minMoveRate + step(8)],
        [minMoveRate + step(9), minMoveRate + step(8)]
    ];
}

function resizeVisualElements() {
    const root = document.documentElement.style;
    root.setProperty('--map', state.mapSize + 'px');
    root.setProperty('--char', state.charSize + 'px');
    root.setProperty('--item', state.itemSize + 'px');

    const presentationImage = document.getElementById('presentationImage'),
        bustedEndGameImage = document.getElementById('bustedEndGameImage'),
        timeUpEndGameImage = document.getElementById('timeUpEndGameImage'),
        endGameMessage = document.getElementById('endGameMessage'),
        busted = document.getElementById('busted'),
        timeUp = document.getElementById('timeUp');

    document.getElementById('presentation').style.height = state.mapSize+'px';

    presentationImage.style.width = state.mapSize+'px';
    presentationImage.style.height = state.mapSize+'px';

    bustedEndGameImage.style.width = state.mapSize+'px';
    bustedEndGameImage.style.height = state.mapSize+'px';
    timeUpEndGameImage.style.width = state.mapSize+'px';
    timeUpEndGameImage.style.height = state.mapSize+'px';

    endGameMessage.style.fontSize = scaleToMap(18)+'px';

    busted.style.width = state.mapSize+'px';
    busted.style.height = state.mapSize+'px';
    timeUp.style.width = state.mapSize+'px';
    timeUp.style.height = state.mapSize+'px';
}

function setClassProp(className, prop, value)
{
    const els = document.getElementsByClassName(className);
    for (let i = 0; i < els.length; i++) {
        els[i].style[prop] = value;
    }
}
