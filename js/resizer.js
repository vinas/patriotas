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
        CROSSBORDERTOLERANCE = geometry.crossMultiply(CROSSBORDERTOLERANCE);
        CATCHTOLERANCE = geometry.crossMultiply(CATCHTOLERANCE);
        CHARSIZE = geometry.crossMultiply(CHARSIZE);
        ITEMSIZE = geometry.crossMultiply(ITEMSIZE);
        THROWSPEED = geometry.crossMultiply(THROWSPEED);
        SPEEDTABLE = setSpeedTable(geometry.crossMultiply(MINMOVINGRATE));
    }

    function setSpeedTable(minMoveRate) {
        return [
            [0, 0],
            [minMoveRate, 0],
            [minMoveRate + geometry.crossMultiply(1), 0],
            [minMoveRate + geometry.crossMultiply(2), minMoveRate],
            [minMoveRate + geometry.crossMultiply(3), minMoveRate],
            [minMoveRate + geometry.crossMultiply(3), minMoveRate + geometry.crossMultiply(1)],
            [minMoveRate + geometry.crossMultiply(3), minMoveRate + geometry.crossMultiply(2)],
            [minMoveRate + geometry.crossMultiply(3), minMoveRate + geometry.crossMultiply(3)],
            [minMoveRate + geometry.crossMultiply(4), minMoveRate + geometry.crossMultiply(3)],
            [minMoveRate + geometry.crossMultiply(4), minMoveRate + geometry.crossMultiply(4)],
            [minMoveRate + geometry.crossMultiply(5), minMoveRate + geometry.crossMultiply(4)],
            [minMoveRate + geometry.crossMultiply(5), minMoveRate + geometry.crossMultiply(5)],
            [minMoveRate + geometry.crossMultiply(6), minMoveRate + geometry.crossMultiply(5)],
            [minMoveRate + geometry.crossMultiply(6), minMoveRate + geometry.crossMultiply(6)],
            [minMoveRate + geometry.crossMultiply(7), minMoveRate + geometry.crossMultiply(6)],
            [minMoveRate + geometry.crossMultiply(7), minMoveRate + geometry.crossMultiply(7)],
            [minMoveRate + geometry.crossMultiply(8), minMoveRate + geometry.crossMultiply(7)],
            [minMoveRate + geometry.crossMultiply(8), minMoveRate + geometry.crossMultiply(8)],
            [minMoveRate + geometry.crossMultiply(9), minMoveRate + geometry.crossMultiply(8)]
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

        document.getElementById('presentation').style.height = MAPSIZE+'px';
        document.getElementById('timeBox').style.paddingLeft = geometry.crossMultiply(10)+'px';
        document.getElementById('scoreBox').style.paddingLeft = geometry.crossMultiply(95)+'px';
        document.getElementById('scoreBox2').style.paddingLeft = geometry.crossMultiply(185)+'px';
        document.getElementById('items').style.paddingTop = geometry.crossMultiply(5)+'px';
        document.getElementById('barLeft').style.fontSize = geometry.crossMultiply(10)+'px';

        presentationImage.style.width = MAPSIZE+'px';
        presentationImage.style.height = MAPSIZE+'px';

        bustedEndGameImage.style.width = MAPSIZE+'px';
        bustedEndGameImage.style.height = MAPSIZE+'px';
        timeUpEndGameImage.style.width = MAPSIZE+'px';
        timeUpEndGameImage.style.height = MAPSIZE+'px';

        setas.style.width = geometry.crossMultiply(48)+'px';
        setas.style.height = geometry.crossMultiply(70)+'px';
        setas.style.paddingLeft = geometry.crossMultiply(8)+'px';

        thiefInstruction.style.width = geometry.crossMultiply(99)+'px';
        thiefInstruction.style.height = geometry.crossMultiply(86)+'px';
        thiefInstruction.style.paddingLeft = geometry.crossMultiply(135)+'px';

        difficultyBox.style.paddingLeft = geometry.crossMultiply(310)+'px';
        difficultyBox.style.width = geometry.crossMultiply(95)+'px';

        barraInfo.style.width = MAPSIZE+'px';
        barraInfo.style.height = geometry.crossMultiply(100)+'px';
        barraInfo.style.top = MAPSIZE+'px';
        barraInfo.style.borderBottomWidth = geometry.crossMultiply(5)+'px';
        barraInfo.style.paddingTop = geometry.crossMultiply(5)+'px';
        barraInfo.style.paddingBottom = geometry.crossMultiply(5)+'px';

        busted.style.width = MAPSIZE+'px';
        busted.style.height = MAPSIZE+'px';
        timeUp.style.width = MAPSIZE+'px';
        timeUp.style.height = MAPSIZE+'px';

        slideLabel.style.fontSize = geometry.crossMultiply(18)+'px';
        slideLabel.style.paddingLeft = geometry.crossMultiply(70)+'px';

        collectLabel.style.paddingLeft = geometry.crossMultiply(250)+'px';
        collectLabel.style.fontSize = geometry.crossMultiply(18)+'px';
        collectLabel.style.width = geometry.crossMultiply(115)+'px';

        setClassProp('barItem', 'width', geometry.crossMultiply(25)+'px');
        setClassProp('barItem', 'height', geometry.crossMultiply(25)+'px');
        setClassProp('barItem', 'padding-right', geometry.crossMultiply(12)+'px');
        setClassProp('barItem', 'padding-top', geometry.crossMultiply(10)+'px');

        setClassProp('actionButton', 'width', geometry.crossMultiply(100)+'px');
        setClassProp('actionButton', 'height', geometry.crossMultiply(100)+'px');

        setClassProp('statValue', 'font-size', geometry.crossMultiply(32)+'px');
        setClassProp('statValue', 'padding-top', geometry.crossMultiply(8)+'px');
        setClassProp('statLabel', 'font-size', geometry.crossMultiply(17)+'px');

        setClassProp('action', 'font-size', geometry.crossMultiply(14)+'px');
        setClassProp('action', 'padding-top', geometry.crossMultiply(5)+'px');
        setClassProp('action', 'min-width', geometry.crossMultiply(20)+'px');
        setClassProp('action', 'max-width', geometry.crossMultiply(90)+'px');

        setClassProp('counter1', 'font-size', geometry.crossMultiply(14)+'px');
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
        const els = document.getElementsByClassName(className);
        for (let i = 0; i < els.length; i++) {
            els[i].style[prop] = value;
        }
    }
}
