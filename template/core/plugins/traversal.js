WrappedElement.prototype.parent = function () {
    return new WrappedElement(this.el.parentElement);
}

WrappedElement.prototype.closest = function (selector) {
    return new WrappedElement(this.el.closest(selector));
}

WrappedElement.prototype.next = function () {
    return new WrappedElement(this.el.nextElementSibling);
}

WrappedElement.prototype.prev = function () {
    return new WrappedElement(this.el.previousElementSibling);
}

WrappedElement.prototype.find = function (selector) {
    return new WrappedElement(this.el.querySelector(selector));
}

WrappedElement.prototype.findAll = function (selector) {
    return Array.from(this.el.querySelectorAll(selector)).map(el => new WrappedElement(el));
}