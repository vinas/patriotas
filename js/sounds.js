import { state } from './state.js';

export function unlockAudio() {
    loadSoundEvents();
    primeSounds();
}

function loadSoundEvents() {
    [state.loadingTheme, state.fastTheme, state.slowTheme].forEach(function(theme) {
        theme.loop = true;
    });

    state.endGameSound.addEventListener('ended', function() {
        state.loadingTheme.currentTime = Math.floor(Math.random() * 2) == 1 ? 18 : 49;
        state.loadingTheme.play();
    });
}

// Browsers only let sounds play after a user tap: play and pause every one of
// them silently during the first tap so they can be started freely later.
function primeSounds() {
    const themes = [state.fastTheme, state.slowTheme, state.loadingTheme];
    const effects = [state.endGameSound, state.bombSound, state.clockSound, state.coinSound];
    const all = themes.concat(effects);

    all.forEach(function(sound) {
        sound.volume = 0;
    });

    // The loading theme keeps playing; everything else is paused again right away.
    state.loadingTheme.play();
    all.filter(function(sound) {
        return sound !== state.loadingTheme;
    }).forEach(function(sound) {
        sound.play();
        sound.pause();
    });

    all.forEach(function(sound) {
        sound.currentTime = 0;
    });
    state.loadingTheme.currentTime = 18;

    applyMusicVolume();
    effects.forEach(function(effect) {
        effect.volume = 1;
    });
}

export function applyMusicVolume() {
    const volume = state.musicMuted ? 0 : 1;
    [state.fastTheme, state.slowTheme, state.loadingTheme].forEach(function(theme) {
        theme.volume = volume;
    });
}

export function toggleMusic() {
    state.musicMuted = !state.musicMuted;
    applyMusicVolume();
    document.getElementById('musicToggle').classList.toggle('muted', state.musicMuted);
}
