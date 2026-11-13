// jsdom cannot play sound, so the game's `new Audio(src)` is replaced by this
// recorder. Tests read `volume`, `paused` and the play/pause counters.
export class FakeAudio {
    static instances = [];

    constructor(src) {
        this.src = src;
        this.volume = 1;
        this.currentTime = 0;
        this.paused = true;
        this.playCount = 0;
        this.pauseCount = 0;
        FakeAudio.instances.push(this);
    }

    play() {
        this.paused = false;
        this.playCount++;
        return Promise.resolve();
    }

    pause() {
        this.paused = true;
        this.pauseCount++;
    }

    addEventListener() {}
}
