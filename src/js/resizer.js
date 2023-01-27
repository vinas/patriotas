function Resizer()
{
    this.resizeMapAndItems = resizeMapAndItems;

    return this;

    function resizeMapAndItems() {
        calculateMeasurements();
        resizeVisualElements();
    }


    function calculateMeasurements() {
        MAPSIZE = document.getElementById('background').clientWidth;
        CROSSBORDERTOLERANCE = calc.crossMultiply(CROSSBORDERTOLERANCE);
        CATCHTOLERANCE = calc.crossMultiply(CATCHTOLERANCE);
        CHARSIZE = calc.crossMultiply(CHARSIZE);
        ITEMSIZE = calc.crossMultiply(ITEMSIZE);
        THROWSPEED = calc.crossMultiply(THROWSPEED);
        SPEEDTABLE = setSpeedTable(calc.crossMultiply(MINMOVINGRATE));
    }

    function setSpeedTable(minMoveRate) {
        return new Array(
            new Array(0, 0),
            new Array(minMoveRate, 0),
            new Array(minMoveRate + calc.crossMultiply(1), 0),
            new Array(minMoveRate + calc.crossMultiply(2), minMoveRate),
            new Array(minMoveRate + calc.crossMultiply(3), minMoveRate),
            new Array(minMoveRate + calc.crossMultiply(3), minMoveRate + calc.crossMultiply(1)),
            new Array(minMoveRate + calc.crossMultiply(3), minMoveRate + calc.crossMultiply(2)),
            new Array(minMoveRate + calc.crossMultiply(3), minMoveRate + calc.crossMultiply(3)),
            new Array(minMoveRate + calc.crossMultiply(4), minMoveRate + calc.crossMultiply(3)),
            new Array(minMoveRate + calc.crossMultiply(4), minMoveRate + calc.crossMultiply(4)),
            new Array(minMoveRate + calc.crossMultiply(5), minMoveRate + calc.crossMultiply(4)),
            new Array(minMoveRate + calc.crossMultiply(5), minMoveRate + calc.crossMultiply(5)),
            new Array(minMoveRate + calc.crossMultiply(6), minMoveRate + calc.crossMultiply(5)),
            new Array(minMoveRate + calc.crossMultiply(6), minMoveRate + calc.crossMultiply(6)),
            new Array(minMoveRate + calc.crossMultiply(7), minMoveRate + calc.crossMultiply(6)),
            new Array(minMoveRate + calc.crossMultiply(7), minMoveRate + calc.crossMultiply(7)),
            new Array(minMoveRate + calc.crossMultiply(8), minMoveRate + calc.crossMultiply(7)),
            new Array(minMoveRate + calc.crossMultiply(8), minMoveRate + calc.crossMultiply(8)),
            new Array(minMoveRate + calc.crossMultiply(9), minMoveRate + calc.crossMultiply(8))
        );
    }

    function resizeVisualElements() {
        resizeGamePlayElements();

        var presentationImage = document.getElementById('presentationImage'),
            bustedEndGameImage = document.getElementById('bustedEndGameImage'),
            timeUpEndGameImage = document.getElementById('timeUpEndGameImage'),
            setas = document.getElementById('setas'),
            thiefInstruction = document.getElementById('thiefInstruction'),
            dificultyBox = document.getElementById('dificultyBox'),
            barraInfo = document.getElementById('barraInfo'),
            busted = document.getElementById('busted'),
            timeUp = document.getElementById('timeUp'),
            slideLabel = document.getElementById('slideLabel'),
            collectLabel = document.getElementById('collectLabel');
            //loginButton = document.getElementById('loginButton'),
            //loginStatus = document.getElementById('loginStatus');

        document.getElementById('presentation').style.height = MAPSIZE+'px';
        document.getElementById('timeBox').style.paddingLeft = calc.crossMultiply(10)+'px';
        document.getElementById('scoreBox').style.paddingLeft = calc.crossMultiply(80)+'px';
        document.getElementById('scoreBox2').style.paddingLeft = calc.crossMultiply(160)+'px';
        document.getElementById('items').style.paddingTop = calc.crossMultiply(5)+'px';
        document.getElementById('barLeft').style.fontSize = calc.crossMultiply(10)+'px';
        document.getElementById('ranking').style.width = MAPSIZE+'px';
        document.getElementById('ranking').style.height = MAPSIZE+'px';

        presentationImage.style.width = MAPSIZE+'px';
        presentationImage.style.height = MAPSIZE+'px';

        bustedEndGameImage.style.width = MAPSIZE+'px';
        bustedEndGameImage.style.height = MAPSIZE+'px';
        timeUpEndGameImage.style.width = MAPSIZE+'px';
        timeUpEndGameImage.style.height = MAPSIZE+'px';

        setas.style.width = calc.crossMultiply(48)+'px';
        setas.style.height = calc.crossMultiply(70)+'px';
        setas.style.paddingLeft = calc.crossMultiply(8)+'px';

        thiefInstruction.style.width = calc.crossMultiply(99)+'px';
        thiefInstruction.style.height = calc.crossMultiply(86)+'px';
        thiefInstruction.style.paddingLeft = calc.crossMultiply(135)+'px';

        dificultyBox.style.paddingLeft = calc.crossMultiply(300)+'px';
        dificultyBox.style.width = calc.crossMultiply(95)+'px';

        barraInfo.style.width = MAPSIZE+'px';
        barraInfo.style.height = calc.crossMultiply(100)+'px';
        barraInfo.style.top = MAPSIZE+'px';
        barraInfo.style.borderBottomWidth = calc.crossMultiply(5)+'px';
        barraInfo.style.paddingTop = calc.crossMultiply(5)+'px';
        barraInfo.style.paddingBottom = calc.crossMultiply(5)+'px';

        busted.style.width = MAPSIZE+'px';
        busted.style.height = MAPSIZE+'px';
        timeUp.style.width = MAPSIZE+'px';
        timeUp.style.height = MAPSIZE+'px';

        slideLabel.style.fontSize = calc.crossMultiply(18)+'px';
        slideLabel.style.paddingLeft = calc.crossMultiply(70)+'px';

        collectLabel.style.paddingLeft = calc.crossMultiply(250)+'px';
        collectLabel.style.fontSize = calc.crossMultiply(18)+'px';
        collectLabel.style.width = calc.crossMultiply(115)+'px';

        /*loginButton.style.top = calc.crossMultiply(407)+'px';
        loginButton.style.left = calc.crossMultiply(63)+'px';
        loginButton.style.width = calc.crossMultiply(180)+'px';
        loginButton.style.height = calc.crossMultiply(55)+'px';
        loginButton.style.fontSize = calc.crossMultiply(18)+'px';

        loginStatus.style.left = calc.crossMultiply(73)+'px';
        loginStatus.style.top = calc.crossMultiply(359)+'px';
        loginStatus.style.fontSize = calc.crossMultiply(20)+'px';*/

        setClassProp('barItem', 'width', calc.crossMultiply(25)+'px');
        setClassProp('barItem', 'height', calc.crossMultiply(25)+'px');
        setClassProp('barItem', 'padding-right', calc.crossMultiply(12)+'px');
        setClassProp('barItem', 'padding-top', calc.crossMultiply(10)+'px');

        setClassProp('actionButton', 'width', calc.crossMultiply(100)+'px');
        setClassProp('actionButton', 'height', calc.crossMultiply(100)+'px');

        setClassProp('mostrador', 'font-size', calc.crossMultiply(32)+'px');
        setClassProp('mostrador', 'padding-top', calc.crossMultiply(8)+'px');
        setClassProp('tituloMostrador', 'font-size', calc.crossMultiply(17)+'px');

        setClassProp('action', 'font-size', calc.crossMultiply(14)+'px');
        setClassProp('action', 'padding-top', calc.crossMultiply(5)+'px');
        setClassProp('action', 'min-width', calc.crossMultiply(20)+'px');
        setClassProp('action', 'max-width', calc.crossMultiply(90)+'px');

        setClassProp('counter1', 'font-size', calc.crossMultiply(14)+'px');

        setClassProp('rankingButton', 'left', calc.crossMultiply(252)+'px');
        setClassProp('rankingButton', 'top', calc.crossMultiply(404)+'px');
        setClassProp('rankingButton', 'width', calc.crossMultiply(181)+'px');
        setClassProp('rankingButton', 'height', calc.crossMultiply(49)+'px');
        setClassProp('rankingButton', 'font-size', calc.crossMultiply(16)+'px');
        setClassProp('rankingButton', 'padding-top', calc.crossMultiply(7)+'px');
    }

    function resizeGamePlayElements()
    {
        document.getElementById('background').style.height = MAPSIZE+'px';
        BackgroundImg.style.width = MAPSIZE+"px";
        BackgroundImg.style.height = MAPSIZE+"px";
        BackgroundImg.style.opacity = '0.6';

        setClassProp('personagem', 'width', CHARSIZE+'px');
        setClassProp('personagem', 'height', CHARSIZE+'px');

        setClassProp('item', 'width', ITEMSIZE+'px');
        setClassProp('item', 'height', ITEMSIZE+'px');
    }

    function setClassProp(className, prop, value)
    {
        var els = document.getElementsByClassName(className),
            i;
        for (i = 0; i < els.length; i++) {
            els[i].style[prop] = value;
        }
    }
}
