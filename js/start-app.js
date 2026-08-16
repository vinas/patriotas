document.addEventListener("DOMContentLoaded", function(event) {

    setup = Setup();
    events = Events();
    geometry = Geometry();
    officerAI = OfficerAI();
    projectileMath = ProjectileMath();
    spawnChance = SpawnChance();
    dateUtils = DateUtils();
    dom = Dom();
    display = Display();
    sounds = Sounds();
    motion = Motion();
    controls = Controls();
    resizer = Resizer();
    game = Game();

    if (setup.isMobile()) {
         game.init();
    } else {
        display.errorNotMobile();
    }
});
