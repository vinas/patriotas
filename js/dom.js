export function element(el) {
    if (isString(el)) return document.getElementById(el);
    return false;
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
    const target = isString(el) ? element(el) : el;
    target.style.display = value;
}

function isString(va) {
    return (typeof va === 'string' || va instanceof String);
}
