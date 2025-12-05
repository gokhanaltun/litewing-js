WrappedElement.prototype.on = function(event, callback) {
    this.el.addEventListener(event, e => {
        callback({event: e, target: new WrappedElement(e.target), currentTarget: this});
    });
    return this;
}

WrappedElement.prototype.onClick = function(callback) {
    return this.on("click", callback);
}

WrappedElement.prototype.onChange = function(callback) {
    return this.on("change", callback);
}

WrappedElement.prototype.onInput = function(callback) {
    return this.on("input", callback);
}