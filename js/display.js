function Display()
{
    var Money = element('money'),
        PointsCounter = element('points'),
        Subtitle1 = element('actionSubtitle1'),
        Subtitle2 = element('actionSubtitle2'),
        Subtitle3 = element('actionSubtitle3'),
        Busted = element('busted'),
        TimeUp = element('timeUp');

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
    this.startPressedTimmer = startPressedTimmer;
    this.show2ndPoliceman = show2ndPoliceman;
    this.setNewBackground = setNewBackground;
    this.mirrorObj = mirrorObj;
    this.updatePointsDisplay = updatePointsDisplay;
    this.updateDificultyDisplay = updateDificultyDisplay;
    this.restorePolicemen = restorePolicemen;
    this.relocateCharacters = relocateCharacters;
    this.hideClock = hideClock;
    this.busted = busted;
    this.timeUp = timeUp;
    this.bomb = bomb;
    this.hideBomb = hideBomb;
    this.loadingButton = loadingButton;
    this.loginButton = loginButton;
    this.startButton = startButton;
    this.errorNotMobile = errorNotMobile;
    this.ranking = ranking;
    this.objectAt = objectAt;

    return this;

    function ranking(content) {
        var rankingItems = JSON.parse(content);
        var output = '<div class="rankingTitle">Ranking <label class="obs">&nbsp;until 01/09/2017</label></div>';
        var order;
        for (i = 0; i < rankingItems.length; i++) {
            order = i + 1;
            output += '<div class="rankingItem">' + order + setOrdinal(order) + ' - ' + rankingItems[i].name + ' - ' + rankingItems[i].score + '</div>';
        }
        element('ranking').innerHTML = output;
    }

    function errorNotMobile() {
        hideElements(['barraInfo', 'presentation']);
        element('background').innerHTML = '<br/><br/>&nbsp;&nbsp;&nbsp;Apenas no celular, no modo retrato!<br/><br/>=(';
    }

    function loadingButton() {
        // hideElements(['login', 'resetGame']);
        hideElements(['resetGame']);
        showElements('loading');
    }

    function loginButton() {
        hideElements(['resetGame', 'loading']);
        showElements('login');
    }

    function startButton() {
        // hideElements(['loading', 'login']);
        hideElements(['loading']);
        showElements('resetGame');
    }
    
    function bomb() {
        bombPos = calc.randomCoords();
        displayItem(Bomb, bombPos);
        isBombVisible = true;
    }

    function bombFeedback() {
        motion.throwItem(Bomb, bombPos, officerPosArr[0], endBombFeedback);
        function endBombFeedback() {
            bombSound.play();
            hideBomb();
            flashOfficers();
            flash(CurrLevel);
            showFeedback(Officer1, Subtitle1, 'devagar');
            if (calc.isTwoPolicemenLevel()) {
                showFeedback(Officer2, Subtitle1, 'devagar');
            }
        }
    }

    function busted() {
        element('endGameMessage').innerHTML = getBustedMessage();
        showElements(Busted);
    }

    function clock() {
        clockPos = calc.randomCoords();
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
        Officer1.setAttribute('src', 'img/guarda.gif');
        Subtitle1.innerHTML = '';
        CurrLevel.innerHTML = currLevel;
        Time.innerHTML = time;
    }

    function flash(obj, color) {
        var flashCount = 0;
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
        flash(Officer1);
        if (currLevel > TWOPOLICEMENLEVEL) flash(Officer2);
    }



    function money() {
        moneyPos = calc.randomCoords();
        displayItem(Money, moneyPos);
    }

    function hideOfficer2() {
        hideElements([Counter2, Officer2]);
        Officer2.setAttribute("src", "img/juiz.gif");
    }

    function objectAt(obj, posArr) {
        obj.style.left = posArr[0];
        obj.style.top = posArr[1];
    }

    function hideClock()
    {
        hideElements(Clock);
        isClockVisible = false;
    }

    function relocateCharacters()
    {
        objectAt(Thief, thiefPosArr);
        objectAt(Officer1, officerPosArr[0]);
        objectAt(Officer2, officerPosArr[1]);
    }

    function restorePolicemen() {
        Officer1.setAttribute("src", "img/guarda.gif");
        hideElements(Counter1);
        if (calc.isTwoPolicemenLevel()) {
            Officer2.setAttribute("src", "img/juiz.gif");
            hideElements(Counter2);
        }
    }

    function molotovCounter() {
        objectAt(
            Counter1,
            new Array(
                (officerPosArr[0][0] - 5),
                (officerPosArr[0][1] - 5)
            )
        );
        Counter1.innerHTML = molotovTime;
        showElements(Counter1);
        if (calc.isTwoPolicemenLevel()) {
            objectAt(
                Counter2,
                new Array(
                    (officerPosArr[1][0] - 5),
                    (officerPosArr[1][1] - 5)
                )
            );
            Counter2.innerHTML = molotovTime;
            showElements(Counter2);
        }
    }

    function hideMolotov()
    {
        hideElements(Molotov);
        isMolotovVisible = false;
    }

    function setThiefHorDirection(direction)
    {
        switch (direction) {
            case 'left':
                mirrorObj(Thief, '1');
                break;
            case 'right':
                mirrorObj(Thief, '-1');
                break;
        }
    }

    function updateDificultyDisplay() {
        CurrLevel.innerHTML = currLevel;
        flash(CurrLevel);
    }

    function updatePointsDisplay() {
        PointsCounter.innerHTML = points;
        flash(PointsCounter);
    }

    function timeUp() {
        showElements(TimeUp);
    }

    function burnDaPolice() {
        Officer1.setAttribute('src', 'img/guarda_fogo_02.gif');
        showFeedback(Officer1, Subtitle1, "queimando");
        if (calc.isTwoPolicemenLevel()) {
            Officer2.setAttribute('src', 'img/juiz_fogo.gif');
            showFeedback(Officer2, Subtitle2, "queimando");
        }
    }

    function hideInGameElements() {
        hideElements([
            'instructionsBar',
            'presentation',
            'ranking',
            Clock,
            Molotov,
            Counter1,
            Counter2,
            Busted,
            TimeUp,
            Officer2
        ]);
    }

    function showInGameElements() {
        showElements(['scoreBar', Thief, Officer1, Money]);
    }

    function hideGameValues() {
        hideElements([Thief, Officer1, Officer2, Money, Clock, Molotov, Bomb]);
    }

    function startPressedTimmer() {
        var button = element('resetGame');
        button.setAttribute('src', 'img/start_over.png');
        setTimeout(function() {
           button.setAttribute('src', 'img/start.png');
        }, 300);
    }

    function show2ndPoliceman() {
        police = Officer2;
        if (molotovTime > 0) {
            police.setAttribute('src', 'img/juiz_fogo.gif')
        }
        calc.officer2StartPos();
        objectAt(Officer2, officerPosArr[1]);
        showElements(police);
    }

    function setNewBackground() {
        BackgroundImg.setAttribute(
            "src",
            "img/"+sortBackground()
        );
    }

    function mirrorObj(objeto, escala) {
        objeto.style.MozTransform = "scaleX("+escala+")";
        objeto.style.webkitTransform = "scaleX("+escala+")";
        objeto.style.OTransform = "scaleX("+escala+")";
        objeto.style.transform = "scaleX("+escala+")";
        objeto.style.msFilter = "fliph";
        objeto.style.filter = "fliph";
    }

    function hideBomb() {
        hideElements(Bomb);
        isBombVisible = false;
    }

    function molotov() {
        molotovPos = calc.randomCoords();
        displayItem(Molotov, molotovPos);
        isMolotovVisible = true;
    }

    function molotovFeedback() {
        motion.throwItem(Molotov, molotovPos, officerPosArr[0], endMolotovFeedback);

        function endMolotovFeedback()
        {
            bombSound.play();
            hideMolotov();
            burnDaPolice();
        }
    }

    function sortBackground() {
        var rand;
        var backgrounds = new Array(
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
        );
        do {
            rand = Math.floor(Math.random() * backgrounds.length);
        } while (BackgroundImg.getAttribute("src") == "url(img/"+backgrounds[rand]+")");
        return backgrounds[rand];
    }

    function showFeedback(refObj, subtitleObj, message) {
        var objectPosition,
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
            messagePosition = calc.messagePos(objectPosition);
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
        return new Array(
                obj.style.left.replace(new RegExp("px", 'g'), ""),
                obj.style.top.replace(new RegExp("px", 'g'), "")
            );
    }

    function getBustedMessage() {
        var messages = [];
        messages.push("foi mal!");
        messages.push("terrorismo eh crime");
        messages.push("vandalismo eh crime");
        messages.push("olavo estava errado");
        messages.push("*muuuuu*");
        messages.push("sem anistia");
        messages.push("* perdel*, maneh !");
        messages.push("prisaum terrabolista");
        messages.push("agora vai tomar vacina");
        messages.push("sem mugido, hein !");
        messages.push("quem pagou seu hotel, fio ?");
        messages.push("e o bozo na disney?");
        messages.push("micheque ora por vc");
        messages.push("51 aptos no dinheiro !");
        messages.push("e o churrasco no quartel ?");
        messages.push("cagadas acontecem! veja o flavio");
        messages.push("mito ? ajuda psiquiatrica !");
        return messages[Math.floor(Math.random() * messages.length)];
    }

    function setOrdinal(order) {
        if (order > 3) return 'th';
        if (order == 1) return 'st';
        if (order == 2) return 'nd';
        if (order == 3) return 'rd';
    }

    function element(el) {
        if (isString(el)) return document.getElementById(el);
        return false;
    }

    function hideElements(el) {
        if (isString(el)) {
            element(el).style.display = 'none';
            return;
        }
        if (Array.isArray(el)) {
            for (i = 0; i < el.length; i++) {
                if (isString(el[i])) {
                    element(el[i]).style.display = 'none';
                    continue;
                }
                el[i].style.display = 'none';
            }
            return;
        }
        el.style.display = 'none';
    }

    function showElements(el) {
        if (isString(el)) {
            element(el).style.display = 'block';
            return;
        }
        if (Array.isArray(el)) {
            for (i = 0; i < el.length; i++) {
                if (isString(el[i])) {
                    element(el[i]).style.display = 'block';
                    continue;
                }
                el[i].style.display = 'block';
            }
            return;
        }
        el.style.display = 'block';
    }

    function isString(va) {
        return (typeof va === 'string' || va instanceof String);
    }

}
