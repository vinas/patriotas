import { isMobilePortrait } from './setup.js';
import { init } from './game.js';
import { errorNotMobile } from './display.js';

document.addEventListener("DOMContentLoaded", function(event) {
    if (isMobilePortrait()) {
        init();
    } else {
        errorNotMobile();
    }
});
