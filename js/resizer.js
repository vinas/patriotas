import { state } from './state.js';
import { MIN_OFFICER_MOVE_RATE } from './constants.js';
import { crossMultiply, crossMultiplyExact } from './geometry.js';

export function resizeMapAndItems() {
    calculateMeasurements();
    resizeVisualElements();
}


function calculateMeasurements() {
    state.mapSize = document.getElementById('background').clientWidth;
    state.crossBorderTolerance = crossMultiply(state.crossBorderTolerance);
    state.catchTolerance = crossMultiply(state.catchTolerance);
    state.charSize = crossMultiply(state.charSize);
    state.itemSize = crossMultiply(state.itemSize);
    state.throwSpeed = crossMultiply(state.throwSpeed);
    state.speedTable = setSpeedTable(crossMultiply(MIN_OFFICER_MOVE_RATE));
}

function setSpeedTable(minMoveRate) {
    const step = crossMultiplyExact;
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
    resizeGamePlayElements();

    const presentationImage = document.getElementById('presentationImage'),
        bustedEndGameImage = document.getElementById('bustedEndGameImage'),
        timeUpEndGameImage = document.getElementById('timeUpEndGameImage'),
        setas = document.getElementById('setas'),
        thiefInstruction = document.getElementById('thiefInstruction'),
        difficultyBox = document.getElementById('difficultyBox'),
        barraInfo = document.getElementById('barraInfo'),
        busted = document.getElementById('busted'),
        timeUp = document.getElementById('timeUp'),
        slideLabel = document.getElementById('slideLabel'),
        collectLabel = document.getElementById('collectLabel');

    document.getElementById('presentation').style.height = state.mapSize+'px';
    document.getElementById('timeBox').style.paddingLeft = crossMultiply(10)+'px';
    document.getElementById('scoreBox').style.paddingLeft = crossMultiply(69)+'px';
    document.getElementById('scoreBox2').style.paddingLeft = crossMultiply(147)+'px';
    document.getElementById('items').style.paddingTop = crossMultiply(5)+'px';
    document.getElementById('barLeft').style.fontSize = crossMultiply(10)+'px';

    presentationImage.style.width = state.mapSize+'px';
    presentationImage.style.height = state.mapSize+'px';

    bustedEndGameImage.style.width = state.mapSize+'px';
    bustedEndGameImage.style.height = state.mapSize+'px';
    timeUpEndGameImage.style.width = state.mapSize+'px';
    timeUpEndGameImage.style.height = state.mapSize+'px';

    setas.style.width = crossMultiply(48)+'px';
    setas.style.height = crossMultiply(70)+'px';
    setas.style.paddingLeft = crossMultiply(8)+'px';

    thiefInstruction.style.width = crossMultiply(99)+'px';
    thiefInstruction.style.height = crossMultiply(86)+'px';
    thiefInstruction.style.paddingLeft = crossMultiply(135)+'px';

    difficultyBox.style.paddingLeft = crossMultiply(250)+'px';
    difficultyBox.style.width = crossMultiply(95)+'px';

    barraInfo.style.width = state.mapSize+'px';
    barraInfo.style.height = crossMultiply(100)+'px';
    barraInfo.style.top = state.mapSize+'px';
    barraInfo.style.borderBottomWidth = crossMultiply(5)+'px';
    barraInfo.style.paddingTop = crossMultiply(5)+'px';
    barraInfo.style.paddingBottom = crossMultiply(5)+'px';

    busted.style.width = state.mapSize+'px';
    busted.style.height = state.mapSize+'px';
    timeUp.style.width = state.mapSize+'px';
    timeUp.style.height = state.mapSize+'px';

    slideLabel.style.fontSize = crossMultiply(18)+'px';
    slideLabel.style.paddingLeft = crossMultiply(70)+'px';

    collectLabel.style.paddingLeft = crossMultiply(250)+'px';
    collectLabel.style.fontSize = crossMultiply(18)+'px';
    collectLabel.style.width = crossMultiply(115)+'px';

    setClassProp('barItem', 'width', crossMultiply(25)+'px');
    setClassProp('barItem', 'height', crossMultiply(25)+'px');
    setClassProp('barItem', 'padding-right', crossMultiply(12)+'px');
    setClassProp('barItem', 'padding-top', crossMultiply(10)+'px');

    setClassProp('actionButton', 'width', crossMultiply(100)+'px');
    setClassProp('actionButton', 'height', crossMultiply(100)+'px');

    setClassProp('statValue', 'font-size', crossMultiply(26)+'px');
    setClassProp('statValue', 'padding-top', crossMultiply(8)+'px');
    setClassProp('statLabel', 'font-size', crossMultiply(14)+'px');

    setClassProp('action', 'font-size', crossMultiply(14)+'px');
    setClassProp('action', 'padding-top', crossMultiply(5)+'px');
    setClassProp('action', 'min-width', crossMultiply(20)+'px');
    setClassProp('action', 'max-width', crossMultiply(90)+'px');

    setClassProp('counter1', 'font-size', crossMultiply(14)+'px');
}

function resizeGamePlayElements()
{
    document.getElementById('background').style.height = state.mapSize+'px';
    state.backgroundEl.style.width = state.mapSize+"px";
    state.backgroundEl.style.height = state.mapSize+"px";
    state.backgroundEl.style.opacity = '0.6';

    setClassProp('personagem', 'width', state.charSize+'px');
    setClassProp('personagem', 'height', state.charSize+'px');

    setClassProp('item', 'width', state.itemSize+'px');
    setClassProp('item', 'height', state.itemSize+'px');
}

function setClassProp(className, prop, value)
{
    const els = document.getElementsByClassName(className);
    for (let i = 0; i < els.length; i++) {
        els[i].style[prop] = value;
    }
}
