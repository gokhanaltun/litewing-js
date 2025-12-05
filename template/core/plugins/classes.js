WrappedElement.prototype.addClass = function(name) {
    this.el.classList.add(name);
    return this;
}

WrappedElement.prototype.removeClass = function(name) {
    this.el.classList.remove(name);
    return this;
}

WrappedElement.prototype.hasClass = function(name) {
    return this.el.classList.contains(name);
}

WrappedElement.prototype.toggleClass = function(name, force = undefined) {
    this.el.classList.toggle(name, force);
    return this;
}
