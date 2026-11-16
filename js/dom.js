export function element(id) {
    return document.getElementById(id);
}

export function hideElements(el) {
    setDisplay(el, 'none');
}

export function showElements(el) {
    setDisplay(el, 'block');
}

// Accepts an id, an element, or an array of either.
function setDisplay(el, value) {
    if (Array.isArray(el)) {
        el.forEach(function(item) {
            setDisplay(item, value);
        });
        return;
    }
    const target = typeof el === 'string' ? element(el) : el;
    target.style.display = value;
}
