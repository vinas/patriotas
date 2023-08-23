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

        fastTheme.addEventListener('ended', function() {
            this.currentTime = 0;
            this.play();
        }, false);

        slowTheme.addEventListener('ended', function() {
            this.currentTime = 0;
            this.play();
        }, false);

        endGameSound.addEventListener('ended', function() {
            loadingTheme.play();
        });
    }

    function prepareSounds() {
        fastTheme.volume = 0;
        slowTheme.volume = 0;
        endGameSound.volume = 0;
        loadingTheme.volume = 0;
        bombSound.volume = 0;
        clockSound.volume = 0;
        coinSound.volume = 0;

        loadingTheme.play();
        fastTheme.play();
        fastTheme.pause();
        slowTheme.play();
        slowTheme.pause();
        endGameSound.play();
        endGameSound.pause();
        bombSound.play();
        bombSound.pause();
        clockSound.play();
        clockSound.pause();
        coinSound.play();
        coinSound.pause();

        fastTheme.currentTime = 0;
        slowTheme.currentTime = 0;
        endGameSound.currentTime = 0;
        loadingTheme.currentTime = 18;
        bombSound.currentTime = 0;
        clockSound.currentTime = 0;
        coinSound.currentTime = 0;

        fastTheme.volume = 1;
        slowTheme.volume = 1;
        endGameSound.volume = 1;
        loadingTheme.volume = 1;
        bombSound.volume = 1;
        clockSound.volume = 1;
        coinSound.volume = 1;
    }

}
