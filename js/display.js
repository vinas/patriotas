import { state } from './state.js';
import { assetUrl } from './assets.js';
import { CLOCK_BONUS_TIME } from './constants.js';
import { element, showElements, hideElements } from './dom.js';
import { randomCoords, messagePos } from './geometry.js';
import { throwItem } from './motion.js';
import { isTwoPolicemenLevel, activeOfficers, officer2StartPos } from './officer-ai.js';

const Money = element('money'),
    PointsCounter = element('points'),
    Subtitle1 = element('actionSubtitle1'),
    Subtitle2 = element('actionSubtitle2'),
    Subtitle3 = element('actionSubtitle3'),
    Busted = element('busted'),
    TimeUp = element('timeUp');

const DEFAULT_BACKGROUND = 'img/background_v2.jpg';

export function errorNotMobile() {
    hideElements(['barraInfo', 'presentation']);
    element('background').innerHTML = '<br/><br/>&nbsp;&nbsp;&nbsp;Apenas no celular, no modo retrato!<br/><br/>=(';
}

export function showStartButton() {
    hideElements(['loading', 'loadingPercent', 'musicToggle']);
    showElements('resetGame');
}

export function showLoadProgress(percent) {
    element('loadingPercent').innerHTML = 'carregando ' + percent + '%';
}

export function spawnBomb() {
    state.bombPos = randomCoords();
    displayItem(state.bombEl, state.bombPos);
    state.isBombVisible = true;
    state.isBombThrown = false;
}

export function throwBomb() {
    throwItem(state.bombEl, state.bombPos, state.officers[0].pos, endBombFeedback);
    function endBombFeedback() {
        state.bombSound.play();
        hideBomb();
        flashOfficers();
        flash(state.levelEl);
        showFeedback(state.officers[0].element, Subtitle1, 'devagar');
        if (isTwoPolicemenLevel()) {
            showFeedback(state.officers[1].element, Subtitle1, 'devagar');
        }
    }
}

export function showBustedScreen() {
    element('endGameMessage').innerHTML = getBustedMessage();
    showElements(Busted);
}

export function spawnClock() {
    state.clockPos = randomCoords();
    displayItem(state.clockEl, state.clockPos);
    state.isClockVisible = true;
}

export function showClockBonus() {
    state.clockSound.play();
    showFeedback(state.thiefEl, Subtitle3, 'tempo +' + CLOCK_BONUS_TIME);
}

export function resetHud() {
    PointsCounter.innerHTML = '0';
    showBackground(DEFAULT_BACKGROUND);
    state.officers[0].element.setAttribute('src', assetUrl(state.officers[0].sprite));
    Subtitle1.innerHTML = '';
    renderLevel();
    state.timeEl.innerHTML = state.time;
}

export function flash(obj, color) {
    let flashCount = 0;
    color = (!color) ? '#FFD61F' : color;

    flashThis();

    function flashThis() {
        obj.style.backgroundColor = (flashCount % 2 == 0) ? color : '';
        flashCount++;
        if (flashCount < 6) {
            setTimeout(function() {
                flashThis();
            }, 100);
        }
    }
}

function flashOfficers() {
    activeOfficers().forEach(function(officer) {
        flash(officer.element);
    });
}



export function spawnMoney() {
    state.moneyPos = randomCoords();
    displayItem(Money, state.moneyPos);
}

export function hideOfficer2() {
    hideElements([state.officers[1].counter, state.officers[1].element]);
    state.officers[1].element.setAttribute('src', assetUrl(state.officers[1].sprite));
}

export function placeElement(obj, posArr) {
    obj.style.left = posArr[0] + 'px';
    obj.style.top = posArr[1] + 'px';
}

export function hideClock()
{
    hideElements(state.clockEl);
    state.isClockVisible = false;
}

export function relocateCharacters()
{
    placeElement(state.thiefEl, state.thiefPos);
    placeElement(state.officers[0].element, state.officers[0].pos);
    placeElement(state.officers[1].element, state.officers[1].pos);
}

export function restorePolicemen() {
    activeOfficers().forEach(function(officer) {
        officer.element.setAttribute('src', assetUrl(officer.sprite));
        hideElements(officer.counter);
    });
}

export function showFreezeCounters() {
    activeOfficers().forEach(function(officer) {
        placeElement(
            officer.counter,
            [
                (officer.pos[0] - 5),
                (officer.pos[1] - 5)
            ]
        );
        officer.counter.innerHTML = state.molotovTime;
        showElements(officer.counter);
    });
}

export function hideMolotov()
{
    hideElements(state.molotovEl);
    state.isMolotovVisible = false;
}

export function renderLevel() {
    state.levelEl.innerHTML = state.currLevel;
}

export function updateDifficultyDisplay() {
    renderLevel();
    flash(state.levelEl);
}

export function updatePointsDisplay() {
    PointsCounter.innerHTML = state.points;
    flash(PointsCounter);
}

export function showTimeUpScreen() {
    showElements(TimeUp);
}

function burnOfficers() {
    const subtitles = [Subtitle1, Subtitle2];
    activeOfficers().forEach(function(officer, index) {
        officer.element.setAttribute('src', assetUrl(officer.fireSprite));
        showFeedback(officer.element, subtitles[index], "queimando");
    });
}

export function hideInGameElements() {
    hideElements([
        'instructionsBar',
        'presentation',
        state.clockEl,
        state.molotovEl,
        state.officers[0].counter,
        state.officers[1].counter,
        Busted,
        TimeUp,
        state.officers[1].element
    ]);
}

export function showInGameElements() {
    showElements(['scoreBar', state.thiefEl, state.officers[0].element, Money, 'musicToggle']);
    hideElements(['resetGame']);
}

export function hideGameValues() {
    hideElements([state.thiefEl, state.officers[0].element, state.officers[1].element, Money, state.clockEl, state.molotovEl, state.bombEl, 'musicToggle']);
}

export function startPressedTimer() {
    const button = element('resetGame');
    button.setAttribute('src', assetUrl('img/start_over.png'));
    setTimeout(function() {
       button.setAttribute('src', assetUrl('img/start.png'));
    }, 300);
}

export function show2ndPoliceman() {
    if (state.molotovTime > 0) {
        state.officers[1].element.setAttribute('src', assetUrl(state.officers[1].fireSprite));
    }
    officer2StartPos();
    placeElement(state.officers[1].element, state.officers[1].pos);
    showElements(state.officers[1].element);
}

export function setNewBackground() {
    showBackground('img/' + pickBackground());
}

export function faceDirection(el, scaleX) {
    el.style.transform = 'scaleX(' + scaleX + ')';
}

export function hideBomb() {
    hideElements(state.bombEl);
    state.isBombVisible = false;
}

export function spawnMolotov() {
    state.molotovPos = randomCoords();
    displayItem(state.molotovEl, state.molotovPos);
    state.isMolotovVisible = true;
    state.isMolotovThrown = false;
}

export function throwMolotov() {
    throwItem(state.molotovEl, state.molotovPos, state.officers[0].pos, endMolotovFeedback);

    function endMolotovFeedback()
    {
        state.bombSound.play();
        hideMolotov();
        burnOfficers();
    }
}

function showBackground(path) {
    state.currentBackground = path;
    state.backgroundEl.setAttribute('src', assetUrl(path));
}

function pickBackground() {
    const backgrounds = [
        'bkg_01.jpg',
        'bkg_02.jpg',
        'bkg_03.jpg',
        'bkg_04.jpg',
        'bkg_05.jpg',
        'bkg_06.jpg',
        'bkg_07.jpg',
        'bkg_08.jpg',
        'bkg_09.jpg',
        'bkg_10.jpg',
        'bkg_11.jpg',
        'bkg_12.jpg',
        'background_v2.jpg'
    ];
    const candidates = backgrounds.filter(function(name) {
        return 'img/' + name !== state.currentBackground;
    });
    return candidates[Math.floor(Math.random() * candidates.length)];
}

function showFeedback(refObj, subtitleObj, message) {
    let objectPosition,
        messagePosition,
        counter = 0,
        interval;

    blinkMsg();

    function blinkMsg()
    {
        positionSubtitle();
        interval = (counter % 2 == 0) ? 800 : 300;
        subtitleObj.innerHTML = (counter % 2 == 0) ? message : '';
        counter++;
        if (counter < 6) {
            setTimeout(function() {
                blinkMsg();
            }, interval);
        }
    }

    function positionSubtitle()
    {
        objectPosition = getObjectPosition(refObj);
        messagePosition = messagePos(objectPosition);
        placeElement(subtitleObj, messagePosition);
    }
}

function displayItem(obj, arrPosition)
{
    placeElement(obj, arrPosition);
    showElements(obj);
}

function getObjectPosition(obj)
{
    return [
            parseFloat(obj.style.left),
            parseFloat(obj.style.top)
        ];
}

function getBustedMessage() {
    const messages = [];
    messages.push("foi mal!");
    messages.push("terrorismo é crime");
    messages.push("vandalismo é crime");
    messages.push("olavo estava errado");
    messages.push("*muuuuu*");
    messages.push("sem anistia");
    messages.push("* perdel*, mané !");
    messages.push("prisaum terrabolista");
    messages.push("agora vai tomar vacina");
    messages.push("sem mugido, hein !");
    messages.push("quem pagou seu hotel, fio ?");
    messages.push("e o bozo na disney?");
    messages.push("micheque ora por vc");
    messages.push("51 aptos no dinheiro !");
    messages.push("e o churrasco no quartel ?");
    messages.push("cagadas acontecem! veja o flávio");
    messages.push("mito ? ajuda psiquiátrica !");
    return messages[Math.floor(Math.random() * messages.length)];
}
