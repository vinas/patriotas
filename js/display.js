import { state } from './state.js';
import { element, showElements, hideElements } from './dom.js';
import { randomCoords, messagePos } from './geometry.js';
import { throwItem } from './motion.js';
import { isTwoPolicemenLevel, officer2StartPos } from './officer-ai.js';

const Money = element('money'),
    PointsCounter = element('points'),
    Subtitle1 = element('actionSubtitle1'),
    Subtitle2 = element('actionSubtitle2'),
    Subtitle3 = element('actionSubtitle3'),
    Busted = element('busted'),
    TimeUp = element('timeUp');

export function errorNotMobile() {
    hideElements(['barraInfo', 'presentation']);
    element('background').innerHTML = '<br/><br/>&nbsp;&nbsp;&nbsp;Apenas no celular, no modo retrato!<br/><br/>=(';
}

export function loadingButton() {
    hideElements(['resetGame']);
    showElements('loading');
}

export function startButton() {
    hideElements(['loading', 'musicToggle']);
    showElements('resetGame');
}

export function bomb() {
    state.bombPos = randomCoords();
    displayItem(state.Bomb, state.bombPos);
    state.isBombVisible = true;
    state.isBombThrown = false;
}

export function bombFeedback() {
    throwItem(state.Bomb, state.bombPos, state.officers[0].pos, endBombFeedback);
    function endBombFeedback() {
        state.bombSound.play();
        hideBomb();
        flashOfficers();
        flash(state.CurrLevel);
        showFeedback(state.officers[0].element, Subtitle1, 'devagar');
        if (isTwoPolicemenLevel()) {
            showFeedback(state.officers[1].element, Subtitle1, 'devagar');
        }
    }
}

export function busted() {
    element('endGameMessage').innerHTML = getBustedMessage();
    showElements(Busted);
}

export function clock() {
    state.clockPos = randomCoords();
    displayItem(state.Clock, state.clockPos);
    state.isClockVisible = true;
}

export function clockFeedback() {
    state.clockSound.play();
    showFeedback(state.Thief, Subtitle3, 'tempo +10');
}

export function gameInfo() {
    PointsCounter.innerHTML = '0';
    state.BackgroundImg.setAttribute('src', 'img/background_v2.jpg');
    state.officers[0].element.setAttribute('src', 'img/guarda.gif');
    Subtitle1.innerHTML = '';
    state.CurrLevel.innerHTML = state.currLevel;
    state.Time.innerHTML = state.time;
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
    state.officers.forEach(function(officer, index) {
        if (index === 1 && !isTwoPolicemenLevel()) return;
        flash(officer.element);
    });
}



export function money() {
    state.moneyPos = randomCoords();
    displayItem(Money, state.moneyPos);
}

export function hideOfficer2() {
    hideElements([state.officers[1].counter, state.officers[1].element]);
    state.officers[1].element.setAttribute("src", "img/juiz.gif");
}

export function objectAt(obj, posArr) {
    obj.style.left = posArr[0];
    obj.style.top = posArr[1];
}

export function hideClock()
{
    hideElements(state.Clock);
    state.isClockVisible = false;
}

export function relocateCharacters()
{
    objectAt(state.Thief, state.thiefPosArr);
    objectAt(state.officers[0].element, state.officers[0].pos);
    objectAt(state.officers[1].element, state.officers[1].pos);
}

export function restorePolicemen() {
    const sprites = ['img/guarda.gif', 'img/juiz.gif'];
    state.officers.forEach(function(officer, index) {
        if (index === 1 && !isTwoPolicemenLevel()) return;
        officer.element.setAttribute("src", sprites[index]);
        hideElements(officer.counter);
    });
}

export function molotovCounter() {
    state.officers.forEach(function(officer, index) {
        if (index === 1 && !isTwoPolicemenLevel()) return;
        objectAt(
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
    hideElements(state.Molotov);
    state.isMolotovVisible = false;
}

export function updateDifficultyDisplay() {
    state.CurrLevel.innerHTML = state.currLevel;
    flash(state.CurrLevel);
}

export function updatePointsDisplay() {
    PointsCounter.innerHTML = state.points;
    flash(PointsCounter);
}

export function timeUp() {
    showElements(TimeUp);
}

function burnDaPolice() {
    const fireSprites = ['img/guarda_fogo_02.gif', 'img/juiz_fogo.gif'];
    const subtitles = [Subtitle1, Subtitle2];
    state.officers.forEach(function(officer, index) {
        if (index === 1 && !isTwoPolicemenLevel()) return;
        officer.element.setAttribute('src', fireSprites[index]);
        showFeedback(officer.element, subtitles[index], "queimando");
    });
}

export function hideInGameElements() {
    hideElements([
        'instructionsBar',
        'presentation',
        state.Clock,
        state.Molotov,
        state.officers[0].counter,
        state.officers[1].counter,
        Busted,
        TimeUp,
        state.officers[1].element
    ]);
}

export function showInGameElements() {
    showElements(['scoreBar', state.Thief, state.officers[0].element, Money, 'musicToggle']);
    hideElements(['resetGame']);
}

export function hideGameValues() {
    hideElements([state.Thief, state.officers[0].element, state.officers[1].element, Money, state.Clock, state.Molotov, state.Bomb, 'musicToggle']);
}

export function startPressedTimer() {
    const button = element('resetGame');
    button.setAttribute('src', 'img/start_over.png');
    setTimeout(function() {
       button.setAttribute('src', 'img/start.png');
    }, 300);
}

export function show2ndPoliceman() {
    if (state.molotovTime > 0) {
        state.officers[1].element.setAttribute('src', 'img/juiz_fogo.gif');
    }
    officer2StartPos();
    objectAt(state.officers[1].element, state.officers[1].pos);
    showElements(state.officers[1].element);
}

export function setNewBackground() {
    state.BackgroundImg.setAttribute(
        "src",
        "img/"+sortBackground()
    );
}

export function mirrorObj(objeto, escala) {
    objeto.style.transform = "scaleX("+escala+")";
}

export function hideBomb() {
    hideElements(state.Bomb);
    state.isBombVisible = false;
}

export function molotov() {
    state.molotovPos = randomCoords();
    displayItem(state.Molotov, state.molotovPos);
    state.isMolotovVisible = true;
}

export function molotovFeedback() {
    throwItem(state.Molotov, state.molotovPos, state.officers[0].pos, endMolotovFeedback);

    function endMolotovFeedback()
    {
        state.bombSound.play();
        hideMolotov();
        burnDaPolice();
    }
}

function sortBackground() {
    let rand;
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
    do {
        rand = Math.floor(Math.random() * backgrounds.length);
    } while (state.BackgroundImg.getAttribute("src") == "url(img/"+backgrounds[rand]+")");
    return backgrounds[rand];
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
        objectAt(subtitleObj, messagePosition);
    }
}

function displayItem(obj, arrPosition)
{
    objectAt(obj, arrPosition);
    showElements(obj);
}

function getObjectPosition(obj)
{
    return [
            obj.style.left.replace(new RegExp("px", 'g'), ""),
            obj.style.top.replace(new RegExp("px", 'g'), "")
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
