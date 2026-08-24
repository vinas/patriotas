import { state } from './state.js';

export function handleSounds() {
    loadSounEvents();
    prepareSounds();
}

function loadSounEvents() {
    state.loadingTheme.addEventListener('ended', function() {
        this.currentTime = 0;
        this.play();
    }, false);

    state.fastTheme.addEventListener('ended', function() {
        this.currentTime = 0;
        this.play();
    }, false);

    state.slowTheme.addEventListener('ended', function() {
        this.currentTime = 0;
        this.play();
    }, false);

    state.endGameSound.addEventListener('ended', function() {
        state.loadingTheme.currentTime = Math.floor(Math.random() * 2) == 1 ? 18 : 49;
        state.loadingTheme.play();
    });
}

function prepareSounds() {
    state.fastTheme.volume = 0;
    state.slowTheme.volume = 0;
    state.endGameSound.volume = 0;
    state.loadingTheme.volume = 0;
    state.bombSound.volume = 0;
    state.clockSound.volume = 0;
    state.coinSound.volume = 0;

    state.loadingTheme.play();
    state.fastTheme.play();
    state.fastTheme.pause();
    state.slowTheme.play();
    state.slowTheme.pause();
    state.endGameSound.play();
    state.endGameSound.pause();
    state.bombSound.play();
    state.bombSound.pause();
    state.clockSound.play();
    state.clockSound.pause();
    state.coinSound.play();
    state.coinSound.pause();

    state.fastTheme.currentTime = 0;
    state.slowTheme.currentTime = 0;
    state.endGameSound.currentTime = 0;
    state.loadingTheme.currentTime = 18;
    state.bombSound.currentTime = 0;
    state.clockSound.currentTime = 0;
    state.coinSound.currentTime = 0;

    state.fastTheme.volume = state.musicMuted ? 0 : 1;
    state.slowTheme.volume = state.musicMuted ? 0 : 1;
    state.endGameSound.volume = 1;
    state.loadingTheme.volume = state.musicMuted ? 0 : 1;
    state.bombSound.volume = 1;
    state.clockSound.volume = 1;
    state.coinSound.volume = 1;
}

export function toggleMusic() {
    state.musicMuted = !state.musicMuted;
    const vol = state.musicMuted ? 0 : 1;
    state.fastTheme.volume = vol;
    state.slowTheme.volume = vol;
    state.loadingTheme.volume = vol;
    const btn = document.getElementById('musicToggle');
    if (state.musicMuted) {
        btn.classList.add('muted');
    } else {
        btn.classList.remove('muted');
    }
}
