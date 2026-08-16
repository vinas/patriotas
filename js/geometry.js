function Geometry()
{
    this.crossMultiply = crossMultiply;
    this.messagePos = messagePos;
    this.nextThiefPosition = nextThiefPosition;
    this.randomCoords = randomCoords;
    this.reached = reached;

    return this;

    function crossMultiply(actual) {
        return Math.floor((actual / 500) * MAPSIZE);
    }

    function messagePos(objPosArr) {
        const ninety = crossMultiply(90),
            thirty = crossMultiply(30);
        let leftPos = parseInt(objPosArr[0]),
            topPos = parseInt(objPosArr[1]) + CHARSIZE;
        if ((leftPos + ninety) >= MAPSIZE)
            leftPos = parseInt(objPosArr[0]) - ((leftPos + ninety) - MAPSIZE);
        if ((topPos + thirty) >= MAPSIZE)
            topPos = parseInt(objPosArr[1]) - thirty;
        return [leftPos, topPos];
    }

    function nextThiefPosition(posArr, movRate, direction) {
        let level;
        switch (direction) {
            case 'left':
                posArr[0] = posArr[0] - movRate;
                level = 0;
                break;
            case 'right':
                posArr[0] = posArr[0] + movRate;
                level = 0;
                break;
            case 'up':
                posArr[1] = posArr[1] - movRate;
                level = 1;
                break;
            case 'down':
                posArr[1] = posArr[1] + movRate;
                level = 1;
        }
        posArr[level] = adjustCrossBorder(posArr[level])
        return posArr;
    }

    function randomCoords() {
        return [
                Math.floor((Math.random() * (MAPSIZE - ITEMSIZE))),
                Math.floor((Math.random() * (MAPSIZE - ITEMSIZE)))
            ];
    }

    function reached(hunter, hunterSize, prey, preySize) {
        return (
                (
                    (hunter[0] >= (prey[0] - hunterSize))
                    && (hunter[0] < (prey[0] + preySize))
                )
                && (
                    (hunter[1] >= (prey[1] - hunterSize))
                    && (hunter[1] < (prey[1] + preySize))
                )
            );
    }

    function adjustCrossBorder(pos) {
        if (pos > MAPSIZE)
            return -CROSSBORDERTOLERANCE;
        if (pos <= (-CHARSIZE + CROSSBORDERTOLERANCE))
            return MAPSIZE - CROSSBORDERTOLERANCE;
        return pos;
    }
}
