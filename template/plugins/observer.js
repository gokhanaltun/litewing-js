const mutationObserverCallbacks = new Map();
const intersectionObserverCallbacks = new Map();

const mutationObserver = new MutationObserver(mutations => {
    mutations.forEach(m => {
        const cb = mutationObserverCallbacks.get(m.target);

        if (cb) cb.callback(m, cb);
    });
});

const intersectionObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
        const cb = intersectionObserverCallbacks.get(e.target);
        if (cb) cb(e);
    });
});

let isMutationObserverActive = false;
function startMutationObserver() {
    if (!isMutationObserverActive) {
        mutationObserver.observe(document.body, { childList: true, subtree: true });
        isMutationObserverActive = true;
    }
}

function addMutationObserverCallback(el, event, callback) {
    startMutationObserver();
    const cb = existsMutationObserverCallback(el);
    if (cb) {
        if (!cb.events.includes(event)) cb.events.push(event);
    } else {
        mutationObserverCallbacks.set(el, { events: [event], callback });
    }
}

function existsMutationObserverCallback(el) {
    if (mutationObserverCallbacks.has(el)) return mutationObserverCallbacks.get(el);
    return null;
}

function removeMutationObserverCallback(el, event) {
    const cb = existsMutationObserverCallback(el);
    if (cb) {
        if (cb.events.length == 1 && cb.events.includes(event)) {
            mutationObserverCallbacks.delete(el);
        } else if (cb.events.length > 1 && cb.events.includes(event)) {
            const index = cb.events.findIndex(e => e === event);
            if (index !== -1) {
                cb.events.splice(index, 1);
            }
        }
    }
}

function addIntersectionObserverCallback(el, callback) {
    if (!existsIntersectionObserverCallback(el)) {
        intersectionObserverCallbacks.set(el, callback);
        intersectionObserver.observe(el);
    }
}

function existsIntersectionObserverCallback(el) {
    if (intersectionObserverCallbacks.has(el)) return intersectionObserverCallbacks.get(el);
    return null;
}

function removeIntersectionObserverCallback(el) {
    if (existsIntersectionObserverCallback(el)) {
        intersectionObserverCallbacks.delete(el);
        intersectionObserver.unobserve(el);
    }
}
