WrappedElement.prototype.onMount = function (fn) {
    if (this.el) {
        const isInDOM = document.body.contains(this.el);
        if (isInDOM) fn(this);
        addMutationObserverCallback(this.el, "onMount", (mutation, cb) => {
            if (cb.events.includes("onMount") && Array.from(mutation.addedNodes).includes(this.el)) fn(this);
        });
    }

    return this;
};

WrappedElement.prototype.onUnmount = function (fn) {
    if (this.el) {
        addMutationObserverCallback(this.el, "onUnmount", (mutation, cb) => {
            if (cb.events.includes("onUnmount") && Array.from(mutation.removedNodes).includes(this.el)) fn(this);
        });
    }

    return this;
};

WrappedElement.prototype.onVisible = function (fn) {
    if (this.el) {
        addIntersectionObserverCallback(this.el, entry => {
            if (entry.isIntersecting) fn(this);
        });
    }

    return this;
};

WrappedElement.prototype.removeOnMount = function () {
    removeMutationObserverCallback(this.el, "onMount");
    return this;
}

WrappedElement.prototype.removeOnUnmount = function () {
    removeMutationObserverCallback(this.el, "onUnmount");
    return this;
}

WrappedElement.prototype.removeOnVisible = function () {
    removeIntersectionObserverCallback(this.el);
    return this;
}