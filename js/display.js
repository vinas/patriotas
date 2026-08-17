function Display()
{
    const Money = dom.element('money'),
        PointsCounter = dom.element('points'),
        Subtitle1 = dom.element('actionSubtitle1'),
        Subtitle2 = dom.element('actionSubtitle2'),
        Subtitle3 = dom.element('actionSubtitle3'),
        Busted = dom.element('busted'),
        TimeUp = dom.element('timeUp');

    this.bombFeedback = bombFeedback;
    this.clock = clock;
    this.clockFeedback = clockFeedback;
    this.gameInfo = gameInfo;
    this.flash = flash;

    this.molotovCounter = molotovCounter;
    this.hideInGameElements = hideInGameElements;
    this.hideMolotov = hideMolotov;
    this.hideOfficer2 = hideOfficer2;

    this.money = money;
    this.molotov = molotov;
    this.molotovFeedback = molotovFeedback;
    this.showInGameElements = showInGameElements;
    this.hideGameValues = hideGameValues;
    this.startPressedTimer = startPressedTimer;
    this.show2ndPoliceman = show2ndPoliceman;
    this.setNewBackground = setNewBackground;
    this.mirrorObj = mirrorObj;
    this.updatePointsDisplay = updatePointsDisplay;
    this.updateDifficultyDisplay = updateDifficultyDisplay;
    this.restorePolicemen = restorePolicemen;
    this.relocateCharacters = relocateCharacters;
    this.hideClock = hideClock;
    this.busted = busted;
    this.timeUp = timeUp;
    this.bomb = bomb;
    this.hideBomb = hideBomb;
    this.loadingButton = loadingButton;
    this.startButton = startButton;
    this.errorNotMobile = errorNotMobile;
    this.objectAt = objectAt;

    return this;

    function errorNotMobile() {
        dom.hideElements(['barraInfo', 'presentation']);
        dom.element('background').innerHTML = '<br/><br/>&nbsp;&nbsp;&nbsp;Apenas no celular, no modo retrato!<br/><br/>=(';
    }

    function loadingButton() {
        dom.hideElements(['resetGame']);
        dom.showElements('loading');
    }

    function startButton() {
        dom.hideElements(['loading', 'musicToggle']);
        dom.showElements('resetGame');
    }

    function bomb() {
        bombPos = geometry.randomCoords();
        displayItem(Bomb, bombPos);
        isBombVisible = true;
    }

    function bombFeedback() {
        motion.throwItem(Bomb, bombPos, officers[0].pos, endBombFeedback);
        function endBombFeedback() {
            bombSound.play();
            hideBomb();
            flashOfficers();
            flash(CurrLevel);
            showFeedback(officers[0].element, Subtitle1, 'devagar');
            if (officerAI.isTwoPolicemenLevel()) {
                showFeedback(officers[1].element, Subtitle1, 'devagar');
            }
        }
    }

    function busted() {
        dom.element('endGameMessage').innerHTML = getBustedMessage();
        dom.showElements(Busted);
    }

    function clock() {
        clockPos = geometry.randomCoords();
        displayItem(Clock, clockPos);
        isClockVisible = true;
    }

    function clockFeedback() {
        clockSound.play();
        showFeedback(Thief, Subtitle3, 'tempo +10');
    }

    function gameInfo() {
        PointsCounter.innerHTML = '0';
        BackgroundImg.setAttribute('src', 'img/background_v2.jpg');
        officers[0].element.setAttribute('src', 'img/guarda.gif');
        Subtitle1.innerHTML = '';
        CurrLevel.innerHTML = currLevel;
        Time.innerHTML = time;
    }

    function flash(obj, color) {
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
        officers.forEach(function(officer, index) {
            if (index === 1 && !officerAI.isTwoPolicemenLevel()) return;
            flash(officer.element);
        });
    }



    function money() {
        moneyPos = geometry.randomCoords();
        displayItem(Money, moneyPos);
    }

    function hideOfficer2() {
        dom.hideElements([officers[1].counter, officers[1].element]);
        officers[1].element.setAttribute("src", "img/juiz.gif");
    }

    function objectAt(obj, posArr) {
        obj.style.left = posArr[0];
        obj.style.top = posArr[1];
    }

    function hideClock()
    {
        dom.hideElements(Clock);
        isClockVisible = false;
    }

    function relocateCharacters()
    {
        objectAt(Thief, thiefPosArr);
        objectAt(officers[0].element, officers[0].pos);
        objectAt(officers[1].element, officers[1].pos);
    }

    function restorePolicemen() {
        const sprites = ['img/guarda.gif', 'img/juiz.gif'];
        officers.forEach(function(officer, index) {
            if (index === 1 && !officerAI.isTwoPolicemenLevel()) return;
            officer.element.setAttribute("src", sprites[index]);
            dom.hideElements(officer.counter);
        });
    }

    function molotovCounter() {
        officers.forEach(function(officer, index) {
            if (index === 1 && !officerAI.isTwoPolicemenLevel()) return;
            objectAt(
                officer.counter,
                [
                    (officer.pos[0] - 5),
                    (officer.pos[1] - 5)
                ]
            );
            officer.counter.innerHTML = molotovTime;
            dom.showElements(officer.counter);
        });
    }

    function hideMolotov()
    {
        dom.hideElements(Molotov);
        isMolotovVisible = false;
    }

    function updateDifficultyDisplay() {
        CurrLevel.innerHTML = currLevel;
        flash(CurrLevel);
    }

    function updatePointsDisplay() {
        PointsCounter.innerHTML = points;
        flash(PointsCounter);
    }

    function timeUp() {
        dom.showElements(TimeUp);
    }

    function burnDaPolice() {
        const fireSprites = ['img/guarda_fogo_02.gif', 'img/juiz_fogo.gif'];
        const subtitles = [Subtitle1, Subtitle2];
        officers.forEach(function(officer, index) {
            if (index === 1 && !officerAI.isTwoPolicemenLevel()) return;
            officer.element.setAttribute('src', fireSprites[index]);
            showFeedback(officer.element, subtitles[index], "queimando");
        });
    }

    function hideInGameElements() {
        dom.hideElements([
            'instructionsBar',
            'presentation',
            Clock,
            Molotov,
            officers[0].counter,
            officers[1].counter,
            Busted,
            TimeUp,
            officers[1].element
        ]);
    }

    function showInGameElements() {
        dom.showElements(['scoreBar', Thief, officers[0].element, Money, 'musicToggle']);
        dom.hideElements(['resetGame']);
    }

    function hideGameValues() {
        dom.hideElements([Thief, officers[0].element, officers[1].element, Money, Clock, Molotov, Bomb, 'musicToggle']);
    }

    function startPressedTimer() {
        const button = dom.element('resetGame');
        button.setAttribute('src', 'img/start_over.png');
        setTimeout(function() {
           button.setAttribute('src', 'img/start.png');
        }, 300);
    }

    function show2ndPoliceman() {
        if (molotovTime > 0) {
            officers[1].element.setAttribute('src', 'img/juiz_fogo.gif');
        }
        officerAI.officer2StartPos();
        objectAt(officers[1].element, officers[1].pos);
        dom.showElements(officers[1].element);
    }

    function setNewBackground() {
        BackgroundImg.setAttribute(
            "src",
            "img/"+sortBackground()
        );
    }

    function mirrorObj(objeto, escala) {
        objeto.style.transform = "scaleX("+escala+")";
    }

    function hideBomb() {
        dom.hideElements(Bomb);
        isBombVisible = false;
    }

    function molotov() {
        molotovPos = geometry.randomCoords();
        displayItem(Molotov, molotovPos);
        isMolotovVisible = true;
    }

    function molotovFeedback() {
        motion.throwItem(Molotov, molotovPos, officers[0].pos, endMolotovFeedback);

        function endMolotovFeedback()
        {
            bombSound.play();
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
        } while (BackgroundImg.getAttribute("src") == "url(img/"+backgrounds[rand]+")");
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
            messagePosition = geometry.messagePos(objectPosition);
            objectAt(subtitleObj, messagePosition);
        }
    }

    function displayItem(obj, arrPosition)
    {
        objectAt(obj, arrPosition);
        dom.showElements(obj);
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

}
