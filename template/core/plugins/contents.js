WrappedElement.prototype.text = function (value) {
    if (value === undefined) {
        return this.el.textContent;
    }

    this.el.textContent = value;
    return this;
}

WrappedElement.prototype.html = function (value) {
    if (value === undefined) {
        return this.el.innerHTML;
    }

    this.el.innerHTML = value;
    return this;
}

WrappedElement.prototype.append = function (content) {
    if (typeof content === "string") {
        this.el.insertAdjacentHTML("beforeend", content);
    } else {
        this.el.appendChild(content instanceof WrappedElement ? content.el : content);
    }

    return this;
}

WrappedElement.prototype.prepend = function (content) {
    if (typeof content === "string") {
        this.el.insertAdjacentHTML("afterbegin", content);
    } else {
        this.el.insertBefore(content instanceof WrappedElement ? content.el : content, this.el.firstChild);
    }

    return this;
}