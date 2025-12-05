class WrappedElement {
    #el;
    constructor(el) { this.#el = el; }
    get el() { return this.#el; }
}

export function ref(selector) {
    const el = document.querySelector(selector);
    return new WrappedElement(el);
}

export function refAll(selector) {
    const els = document.querySelectorAll(selector);
    return Array.from(els).map(el => new WrappedElement(el));
}

export function refMult(...selectors) {
    const els = [];
    for (const selector of selectors) els.push(ref(selector));
    return els;
}

export function ready(fn) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fn);
    } else {
        fn();
    }
}

export function asyncReady(fn) {
    return new Promise((resolve) => {
        const run = () => resolve(fn ? fn() : undefined);

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', run);
        } else {
            run();
        }
    });
}

export function loadPlugins(...plugins) {
    for (const plugin of plugins) plugin(WrappedElement);
}

export {WrappedElement};