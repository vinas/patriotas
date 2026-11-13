import { state } from './state.js';
import { MINMOVINGRATE } from './constants.js';
import { crossMultiply, crossMultiplyExact } from './geometry.js';

export function resizeMapAndItems() {
    calculateMeasurements();
    resizeVisualElements();
}


function calculateMeasurements() {
    state.MAPSIZE = document.getElementById('background').clientWidth;
    state.CROSSBORDERTOLERANCE = crossMultiply(state.CROSSBORDERTOLERANCE);
    state.CATCHTOLERANCE = crossMultiply(state.CATCHTOLERANCE);
    state.CHARSIZE = crossMultiply(state.CHARSIZE);
    state.ITEMSIZE = crossMultiply(state.ITEMSIZE);
    state.THROWSPEED = crossMultiply(state.THROWSPEED);
    state.SPEEDTABLE = setSpeedTable(crossMultiply(MINMOVINGRATE));
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

    document.getElementById('presentation').style.height = state.MAPSIZE+'px';
    document.getElementById('timeBox').style.paddingLeft = crossMultiply(10)+'px';
    document.getElementById('scoreBox').style.paddingLeft = crossMultiply(69)+'px';
    document.getElementById('scoreBox2').style.paddingLeft = crossMultiply(147)+'px';
    document.getElementById('items').style.paddingTop = crossMultiply(5)+'px';
    document.getElementById('barLeft').style.fontSize = crossMultiply(10)+'px';

    presentationImage.style.width = state.MAPSIZE+'px';
    presentationImage.style.height = state.MAPSIZE+'px';

    bustedEndGameImage.style.width = state.MAPSIZE+'px';
    bustedEndGameImage.style.height = state.MAPSIZE+'px';
    timeUpEndGameImage.style.width = state.MAPSIZE+'px';
    timeUpEndGameImage.style.height = state.MAPSIZE+'px';

    setas.style.width = crossMultiply(48)+'px';
    setas.style.height = crossMultiply(70)+'px';
    setas.style.paddingLeft = crossMultiply(8)+'px';

    thiefInstruction.style.width = crossMultiply(99)+'px';
    thiefInstruction.style.height = crossMultiply(86)+'px';
    thiefInstruction.style.paddingLeft = crossMultiply(135)+'px';

    difficultyBox.style.paddingLeft = crossMultiply(250)+'px';
    difficultyBox.style.width = crossMultiply(95)+'px';

    barraInfo.style.width = state.MAPSIZE+'px';
    barraInfo.style.height = crossMultiply(100)+'px';
    barraInfo.style.top = state.MAPSIZE+'px';
    barraInfo.style.borderBottomWidth = crossMultiply(5)+'px';
    barraInfo.style.paddingTop = crossMultiply(5)+'px';
    barraInfo.style.paddingBottom = crossMultiply(5)+'px';

    busted.style.width = state.MAPSIZE+'px';
    busted.style.height = state.MAPSIZE+'px';
    timeUp.style.width = state.MAPSIZE+'px';
    timeUp.style.height = state.MAPSIZE+'px';

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
    document.getElementById('background').style.height = state.MAPSIZE+'px';
    state.BackgroundImg.style.width = state.MAPSIZE+"px";
    state.BackgroundImg.style.height = state.MAPSIZE+"px";
    state.BackgroundImg.style.opacity = '0.6';

    setClassProp('personagem', 'width', state.CHARSIZE+'px');
    setClassProp('personagem', 'height', state.CHARSIZE+'px');

    setClassProp('item', 'width', state.ITEMSIZE+'px');
    setClassProp('item', 'height', state.ITEMSIZE+'px');
}

function setClassProp(className, prop, value)
{
    const els = document.getElementsByClassName(className);
    for (let i = 0; i < els.length; i++) {
        els[i].style[prop] = value;
    }
}
