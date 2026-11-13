import { state } from './state.js';
import { MIN_OFFICER_MOVE_RATE } from './constants.js';
import { scaleToMap, scaleToMapExact } from './geometry.js';

export function resizeMapAndItems() {
    calculateMeasurements();
    resizeVisualElements();
}


function calculateMeasurements() {
    state.mapSize = document.getElementById('background').clientWidth;
    state.crossBorderTolerance = scaleToMap(state.crossBorderTolerance);
    state.catchTolerance = scaleToMap(state.catchTolerance);
    state.charSize = scaleToMap(state.charSize);
    state.itemSize = scaleToMap(state.itemSize);
    state.throwSpeed = scaleToMap(state.throwSpeed);
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
    document.getElementById('timeBox').style.paddingLeft = scaleToMap(10)+'px';
    document.getElementById('scoreBox').style.paddingLeft = scaleToMap(69)+'px';
    document.getElementById('scoreBox2').style.paddingLeft = scaleToMap(147)+'px';
    document.getElementById('items').style.paddingTop = scaleToMap(5)+'px';
    document.getElementById('barLeft').style.fontSize = scaleToMap(10)+'px';

    presentationImage.style.width = state.mapSize+'px';
    presentationImage.style.height = state.mapSize+'px';

    bustedEndGameImage.style.width = state.mapSize+'px';
    bustedEndGameImage.style.height = state.mapSize+'px';
    timeUpEndGameImage.style.width = state.mapSize+'px';
    timeUpEndGameImage.style.height = state.mapSize+'px';

    setas.style.width = scaleToMap(48)+'px';
    setas.style.height = scaleToMap(70)+'px';
    setas.style.paddingLeft = scaleToMap(8)+'px';

    thiefInstruction.style.width = scaleToMap(99)+'px';
    thiefInstruction.style.height = scaleToMap(86)+'px';
    thiefInstruction.style.paddingLeft = scaleToMap(135)+'px';

    difficultyBox.style.paddingLeft = scaleToMap(250)+'px';
    difficultyBox.style.width = scaleToMap(95)+'px';

    barraInfo.style.width = state.mapSize+'px';
    barraInfo.style.height = scaleToMap(100)+'px';
    barraInfo.style.top = state.mapSize+'px';
    barraInfo.style.borderBottomWidth = scaleToMap(5)+'px';
    barraInfo.style.paddingTop = scaleToMap(5)+'px';
    barraInfo.style.paddingBottom = scaleToMap(5)+'px';

    busted.style.width = state.mapSize+'px';
    busted.style.height = state.mapSize+'px';
    timeUp.style.width = state.mapSize+'px';
    timeUp.style.height = state.mapSize+'px';

    slideLabel.style.fontSize = scaleToMap(18)+'px';
    slideLabel.style.paddingLeft = scaleToMap(70)+'px';

    collectLabel.style.paddingLeft = scaleToMap(250)+'px';
    collectLabel.style.fontSize = scaleToMap(18)+'px';
    collectLabel.style.width = scaleToMap(115)+'px';

    setClassProp('barItem', 'width', scaleToMap(25)+'px');
    setClassProp('barItem', 'height', scaleToMap(25)+'px');
    setClassProp('barItem', 'padding-right', scaleToMap(12)+'px');
    setClassProp('barItem', 'padding-top', scaleToMap(10)+'px');

    setClassProp('actionButton', 'width', scaleToMap(100)+'px');
    setClassProp('actionButton', 'height', scaleToMap(100)+'px');

    setClassProp('statValue', 'font-size', scaleToMap(26)+'px');
    setClassProp('statValue', 'padding-top', scaleToMap(8)+'px');
    setClassProp('statLabel', 'font-size', scaleToMap(14)+'px');

    setClassProp('action', 'font-size', scaleToMap(14)+'px');
    setClassProp('action', 'padding-top', scaleToMap(5)+'px');
    setClassProp('action', 'min-width', scaleToMap(20)+'px');
    setClassProp('action', 'max-width', scaleToMap(90)+'px');

    setClassProp('counter1', 'font-size', scaleToMap(14)+'px');
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
