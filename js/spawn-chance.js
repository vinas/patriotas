function SpawnChance()
{
    this.sortBomb = sortBomb;
    this.sortMolotov = sortMolotov;

    return this;

    function sortBomb() {
        if ((!isBombVisible) && (areChancesAmong(5)))
            return 'bomb';
        if ((isBombVisible) && (areChancesAmong(10)))
            return 'hideBomb';
        return false;
    }

    function sortMolotov() {
        return (areChancesAmong(10));
    }

    function areChancesAmong(percetage) {
        return (Math.floor((Math.random() * 100) + 1) <= percetage);
    }
}
