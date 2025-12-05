WrappedElement.prototype.attr = function (name, value) {
    if (value === undefined) {
        return this.el.getAttribute(name);
    }

    this.el.setAttribute(name, value);
    return this;
}

WrappedElement.prototype.data = function (key, value) {
    if (value === undefined) {
        return this.el.dataset[key];
    }

    this.el.dataset[key] = value;
    return this;
}

WrappedElement.prototype.prop = function (name, value) {
    if (value === undefined) {
        return this.el[name];
    }

    this.el[name] = value;
    return this;
}