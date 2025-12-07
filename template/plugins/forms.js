WrappedElement.prototype.formData = function () {
    const fd = new FormData(this.el);
    const formDataObj = {};

    for (const [name, value] of fd.entries()) {
        const el = this.el.elements[name];

        if (
            el instanceof RadioNodeList ||
            ((el instanceof NodeList || Array.isArray(el)) && el.length > 1)
        ) {
            const values = Array.from(this.el.querySelectorAll(`[name="${name}"]`))
                .filter(i => i.checked)
                .map(i => i.value);
            formDataObj[name] = values;
        }
        else if (el instanceof HTMLInputElement && el.type === "file") {
            formDataObj[name] = el.files.length === 1 ? el.files[0] : Array.from(el.files);
        }
        else {
            formDataObj[name] = value;
        }
    }

    return { formData: fd, formDataObj };
};


WrappedElement.prototype.onSubmit = function (callback, options = {}) {
    const { preventDefault = true } = options;

    this.el.addEventListener("submit", e => {
        if (preventDefault) e.preventDefault();

        const { formData, formDataObj } = this.formData();

        callback({
            event: e,
            target: new WrappedElement(e.target),
            currentTarget: this,
            formData,
            formDataObj
        });
    });
    return this;
}

WrappedElement.prototype.fillForm = function (values) {
    for (const [name, value] of Object.entries(values)) {
        const el = this.el.elements[name];
        if (!el) continue;

        if (
            el instanceof RadioNodeList ||
            ((el instanceof NodeList || Array.isArray(el)) && el.length > 1)
        ) {
            Array.from(el).forEach(i => {
                if (i.type === "checkbox" || i.type === "radio") {
                    i.checked = Array.isArray(value) ? value.includes(i.value) : i.value === value;
                } else {
                    i.value = value;
                }
            });
        }
        else if (el instanceof HTMLSelectElement && el.multiple) {
            const values = Array.isArray(value) ? value : [value];
            Array.from(el.options).forEach(opt => {
                opt.selected = values.includes(opt.value);
            });
        }
        else if (el.type === "checkbox" || el.type === "radio") {
            el.checked = Array.isArray(value) ? value.includes(el.value) : el.value === value;
        }
        else if (el.type !== "file") {
            el.value = value;
        }
    }

    return this;
};

WrappedElement.prototype.resetForm = function () {
    this.el.reset();
    return this;
};
