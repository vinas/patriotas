function Setup() {
    this.clearGameValues = clearGameValues;
    this.setAll = setAll;
    this.resetAllValues = resetAllValues;
    this.setVisualElements = setVisualElements;
    this.loadContent = loadContent;
    this.isMobile = isMobile;

    return this;

    function isMobile() {
        var check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);

        return check && isPortrait();
    };
    
    function isPortrait() {
        return window.innerWidth <= window.innerHeight;
    }

    function loadContent() {
     var ImgsToPreload = new Array(
            'img/detalhes.gif',
            'img/start_over.png',
            'img/guarda_fogo_02.gif',
            'img/juiz_fogo.gif',
            'img/background_v2.jpg',
            'img/bkg_01.jpg',
            'img/bkg_02.jpg',
            'img/bkg_03.jpg',
            'img/bkg_04.jpg',
            'img/bkg_05.jpg',
            'img/bkg_06.jpg',
            'img/bkg_07.jpg',
            'img/bkg_08.jpg',
            'img/bkg_09.jpg',
            'img/bkg_10.jpg',
            'img/bkg_11.jpg',
            'img/bkg_12.jpg',
            'img/busted.png',
            'img/timeisup_01.png',
            'img/start.png',
            'img/molotov_v2.png',
            'img/money2.png',
            'img/bomb_v2.png'
        );
        preloadImages(ImgsToPreload);
        setSounds(handleLogin);
    }

    function handleLogin() {
        // var accessCode = login.checkForFbAccessCode(),
        //     loginAttempts = 0;
        // if (accessCode && !user.fbId) {
        //     display.loadingButton();
        //     login.getFbAccessToken(accessCode);
        //     waitForUserInfo();
        //     return;
        // } else {
        //     display.loginButton();
        // }
        display.startButton();

        function waitForUserInfo() {
            setTimeout(function() {
                if (user.fbId) {
                    display.startButton();
                    return;
                }
                loginAttempts++;
                if (loginAttempts < 32) {
                    waitForUserInfo();
                    return;
                }
                display.loginButton();
            }, 250);
        }
    }

    function setSounds(callback) {
        fastTheme = new Audio('audio/8bit_sparks.mp3');
        slowTheme = new Audio('audio/hino_nacional.mp3'),
        endGameSound = new Audio('audio/endGame.mp3');
        loadingTheme = new Audio('audio/hino_independencia.mp3');
        bombSound = new Audio('audio/bomb.mp3');
        clockSound = new Audio('audio/crank-1.mp3');
        coinSound = new Audio('audio/coin1.wav');

        callback();
    }

    function preloadImages(images) {
        var img;
        for (i = 0; i < images.length; i++) {
            img = new Image();
            img.src = images[i];
        }
    }

    function setVisualElements() {
        setCharacters();
        setGameItems();
        setDisplayItems();
    }

    function clearGameValues() {
        time = 0;
        isClockVisible = false;
        isMolotovVisible = false;
        isBombVisible = false;
        currLevel = 1;
        points = 0;
        molotovTime = 0;
    }

    function resetAllValues() {
        clearGameValues();
        setOfficersStartCoords();
        time = STANDARDTIME;
        pressedKey = false;
        thiefMoveRate = calc.crossMultiply(STANDTHIEFMOVRATE);
        officerMoveRate[0] = SPEEDTABLE[1][0];
        officerMoveRate[1] = SPEEDTABLE[1][1];
        thiefPosArr[0] = 0;
        thiefPosArr[1] = 0;
        lastChangedLevel = 0;
    }

    function setAll() {
        applySettings();
        focusSettings();

        function applySettings() {
            // $.mobile.ajaxEnabled = false;
            // $.mobile.loader.prototype.options.disabled = true;
            // $.mobile.loading('hide');
            // $.mobile.loading().hide();
            // $.mobile.loadingMessage = false;
            // $.event.special.swipe.horizontalDistanceThreshold = SWIPEDISTANCE;
            // $.event.special.swipe.verticalDistanceThreshold = SWIPEDISTANCE;
        }

        function focusSettings() {
            window.onblur = function() {
                fastTheme.pause();
                slowTheme.pause();
                loadingTheme.pause();
                endGameSound.pause();
            };

            window.onfocus = function() {
                if (gameOn) {
                    slowTheme.play();
                    return;
                }
                loadingTheme.play();
            };
        }

    }

    function setCharacters() {
        Thief = document.getElementById('thief');
        Officer1 = document.getElementById('officer1');
        Officer2 = document.getElementById('officer2');
    }

    function setGameItems() {
        Molotov = document.getElementById('molotov');
        Clock = document.getElementById('clock');
        Bomb = document.getElementById('bomb');
        Counter1 = document.getElementById('counter1');
        Counter2 = document.getElementById('counter2');
    }

    function setDisplayItems() {
        BackgroundImg = document.getElementById('backgroundImage');
        CurrLevel = document.getElementById('fase');
        Time = document.getElementById('time');
    }

    function setOfficersStartCoords()
    {
        var coord = MAPSIZE - CHARSIZE;
        officerPosArr[0][0] = coord;
        officerPosArr[0][1] = coord;
        officerPosArr[1][0] = coord;
        officerPosArr[1][1] = coord;
    }

}