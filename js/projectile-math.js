export function setNewThrowItemPos(shooterX, shooterY, item, target, incline, variation) {
    if (item[0] != target[0]) {
        item[0] = setItemNewCoord(item[0], target[0]);
        item[1] = Math.round(incline * (item[0] - shooterX) + shooterY);
    } else {
        item[1] = setItemNewCoord(item[1], target[1]);
    }
    return item;

    function setItemNewCoord(sourceCoord, destCoord) {
        return (sourceCoord < destCoord) ? sourceCoord + variation : sourceCoord - variation;
    }

}

export function stepAlongX(speed, incline) {
    return Math.sqrt(speed / (parseFloat(Math.pow(incline,2)+1)));
}

export function slope(itemPos, targetPos) {
    const deltaX = targetPos[0] - itemPos[0],
        deltaY = targetPos[1] - itemPos[1];
    return (deltaX != 0) ? (deltaY/deltaX).toFixed(4) : 0;
}
