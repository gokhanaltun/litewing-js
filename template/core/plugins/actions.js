WrappedElement.prototype.show = function () {
    this.el.style.display = '';
    return this;
}

WrappedElement.prototype.hide = function () {
    this.el.style.display = 'none';
    return this;
}

WrappedElement.prototype.toggle = function () {
    this.el.style.display = this.el.style.display === 'none' ? '' : 'none';
    return this;
}

WrappedElement.prototype.remove = function () {
    this.el.remove();
    return this;
}