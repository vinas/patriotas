function Dom() {

    this.element = element;
    this.showElements = showElements;
    this.hideElements = hideElements;

    return this;

    function element(el) {
        if (isString(el)) return document.getElementById(el);
        return false;
    }

    function hideElements(el) {
        if (isString(el)) {
            element(el).style.display = 'none';
            return;
        }
        if (Array.isArray(el)) {
            for (let i = 0; i < el.length; i++) {
                if (isString(el[i])) {
                    element(el[i]).style.display = 'none';
                    continue;
                }
                el[i].style.display = 'none';
            }
            return;
        }
        el.style.display = 'none';
    }

    function showElements(el) {
        if (isString(el)) {
            element(el).style.display = 'block';
            return;
        }
        if (Array.isArray(el)) {
            for (let i = 0; i < el.length; i++) {
                if (isString(el[i])) {
                    element(el[i]).style.display = 'block';
                    continue;
                }
                el[i].style.display = 'block';
            }
            return;
        }
        el.style.display = 'block';
    }

    function isString(va) {
        return (typeof va === 'string' || va instanceof String);
    }

}
