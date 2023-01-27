function Controls()
{
    var pos = {},
    touchUpPos = {};

    this.loadControlsHandlers = loadControlsHandlers;

    return this;

    function loadControlsHandlers() {
        preventDblClick();
        handlePressedKey();
        handleResetButton();
        // handleLoginButton();
        // handleRankingButton();
        handleControlSwipes();
        handleSwipePresentation();
    }

    function preventDblClick() {
        document.addEventListener('dblclick', function() {
            return false;
        });
    }

    function handlePressedKey() {
        document.addEventListener('keydown', function(e) {
            pressedKey = e.which;
        });
    }

    function handleResetButton() {
        document.getElementById('resetGame').addEventListener('click', function() {
            // var justOpened = document.getElementById('justOpened');
            // if (justOpened.value == 1) {
                handleSounds();
            //     document.getElementById('presentationImage')
            //         .setAttribute('src', 'img/detalhes.gif');
            //     justOpened.value = 0;
            //     return;
            // }
            display.startPressedTimmer();
            game.resetGame();
        });
    }

    function handleLoginButton() {
        document.getElementById('login').addEventListener('click', function() {
            login.checkFbLogin();
        });
    }

    function handleRankingButton() {
        document.getElementById('rankingButton').addEventListener('click', function() {
            document.getElementById('ranking').style.display = 'block';
            document.getElementById('ranking').innerHTML = 'loading...';
        });
    }

    function handleControlSwipes() {
        document.addEventListener("touchstart", function(obj) {
            fingerHandler(
                'down',
                {
                    x: obj.touches[0].clientX,
                    y: obj.touches[0].clientY
                }
            );
        });
        document.addEventListener("mousedown", function(obj) {
            fingerHandler('down', obj);
        });
        document.addEventListener("touchend", function(obj) {
            fingerHandler('up', touchUpPos, handleSwipe);
            touchUpPos = {};
        });
        document.addEventListener("touchmove", function(obj) {
            touchUpPos.x = obj.touches[0].clientX;
            touchUpPos.y = obj.touches[0].clientY;
        });
        document.addEventListener("mouseup", function(obj) {
            fingerHandler('up', obj, handleSwipe);
        });

    }

    function handleSwipe() {
        if (pos.up.time - pos.down.time < 500) {
            if (Math.abs(pos.up.x - pos.down.x) > Math.abs(pos.up.y - pos.down.y)) {
                if (pos.up.x > pos.down.x) {
                    // console.log('identified: right');
                    pressedKey = 39;
                } else {
                    // console.log('identified: left');
                    pressedKey = 37;
                }
            } else {
                if (pos.up.y > pos.down.y) {
                    // console.log('identified: down');
                    pressedKey = 40;
                } else {
                    // console.log('identified: up');
                    pressedKey = 38;
                }
            }

        }
    }

    function handleSwipePresentation() {
        // TO DO
        // TO DO
        // TO DO
        // TO DO
        // TO DO
        // TO DO
        // TO DO
        // TO DO
        /*$('#presentation').on('swipeleft', function() {
            if (document.getElementById('justOpened').value == 0) {
                var presentation = $(this);
                presentation.animate({
                        left: parseInt(presentation.css('left'), 10) == 0 ?
                        -presentation.outerWidth() :
                        0
                    },
                    1000,
                    function() { resetGame() }
                );
            }
        });*/
    }

    function fingerHandler(action, obj, callback) {
        var x, y;
        x = obj.x;
        y = obj.y;
        pos[action] = {
            x: x,
            y: y,
            time: Date.now()
        };
        if (callback) callback();
    }

}
