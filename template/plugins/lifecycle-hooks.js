WrappedElement.prototype.onMount = function (fn) {
    const elExists = () => this.el && document.body.contains(this.el);

    if (elExists()) {
        fn(this);
    } else {
        const observer = new MutationObserver(() => {
            if (elExists()) {
                fn(this);
                observer.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    return this;
};

WrappedElement.prototype.onUnmount = function (fn) {
    const observer = new MutationObserver(() => {
        if (!document.body.contains(this.el)) {
            fn(this);
            observer.disconnect();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return this;
};

WrappedElement.prototype.onVisible = function (fn, options = {}) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) fn(this);
        });
    }, options);

    observer.observe(this.el);

    return this;
};
