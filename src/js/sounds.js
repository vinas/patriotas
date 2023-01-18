function Sounds() {
    this.handleSounds = handleSounds;

    return this;

    function handleSounds() {
        loadSounEvents();
        prepareSounds();
    }

    function loadSounEvents() {
        loadingTheme.addEventListener('ended', function() {
            this.currentTime = 0;
            this.play();
        }, false);

        musicTheme.addEventListener('ended', function() {
            this.currentTime = 0;
            this.play();
        }, false);

        endGameSound.addEventListener('ended', function() {
            loadingTheme.play();
        });
    }

    function prepareSounds() {
        musicTheme.volume = 0;
        endGameSound.volume = 0;
        loadingTheme.volume = 0;
        bombSound.volume = 0;
        clockSound.volume = 0;
        coinSound.volume = 0;

        loadingTheme.play();
        musicTheme.play();
        musicTheme.pause();
        endGameSound.play();
        endGameSound.pause();
        bombSound.play();
        bombSound.pause();
        clockSound.play();
        clockSound.pause();
        coinSound.play();
        coinSound.pause();

        musicTheme.currentTime = 0;
        endGameSound.currentTime = 0;
        loadingTheme.currentTime = 0;
        bombSound.currentTime = 0;
        clockSound.currentTime = 0;
        coinSound.currentTime = 0;

        musicTheme.volume = 1;
        endGameSound.volume = 1;
        loadingTheme.volume = 1;
        bombSound.volume = 1;
        clockSound.volume = 1;
        coinSound.volume = 1;
    }

}
