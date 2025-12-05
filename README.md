# 🎯 Refine.js

**Write vanilla JavaScript, but better**

Refine.js is **not a framework**. It's a thin, lightweight wrapper that makes vanilla JavaScript **more readable, less repetitive, and still performant**. Nothing more. Nothing less.

```javascript
import { ref, ready } from 'refine-js';

ready(() => {
    ref('#button')
        .onClick((e, target) => {
            target.addClass('active').text('Clicked!');
        }).text('Click Me');
});
```

---

## 💭 What is Refine.js?

You're already writing vanilla JavaScript. Refine.js just makes it **nicer, cleaner, and easier to read**.

### Without Refine

```javascript
const button = document.querySelector('#button');
button.addEventListener('click', (e) => {
    e.target.classList.add('active');
    e.target.textContent = 'Clicked!';
});
button.textContent = 'Click Me';
```

### With Refine

```javascript
ref('#button')
    .onClick((e, target) => {
        target.addClass('active').text('Clicked!');
    }).text('Click Me');
```

**Same result. Same performance. Less boilerplate.**

---

## 💡 Philosophy

### Vanilla JS First

Refine.js **never replaces native JavaScript**. If vanilla JS works, Refine works. It’s purely **syntactic sugar for readability**, not a runtime or framework.

* **Zero-overhead:** No magic. No runtime. No dependencies.
* **Minimal core:** Only essential DOM operations, events, and traversal.
* **Plugin-based:** Need extra functionality? Add a plugin. Don’t need it? Core stays small (~2–3 KB minified).

### The Problem

Modern frameworks are powerful but heavy. jQuery is convenient but outdated. Vanilla JS is fast but verbose.

### The Solution

Refine.js gives **clear, concise syntax** that runs as **pure native JavaScript** with **zero runtime cost**.

---

## 🎯 When to Use Refine.js

✅ **Perfect for:**
- Server-rendered apps (PHP, Go, Python, Express, Rails)
- Adding interactivity to static sites
- WordPress, Shopify, or any CMS
- Progressive enhancement
- Multi-page applications (MPAs)

❌ **Not suitable for:**
- Complex SPAs with state management → Use React/Vue
- Apps requiring virtual DOM → Use a framework
- Projects already using a framework → Stick with it

**Rule of thumb:** If vanilla JS works there, Refine works there.

---

## ✅ Core Features (Always Included)

* **DOM Selection:** `ref()`, `refAll()`, `refMult()`
* **Events:** `onClick()`, `onChange()`, `onInput()`, `onSubmit()`
* **Classes:** `addClass()`, `removeClass()`, `toggleClass()`, `hasClass()`
* **Content:** `text()`, `html()`, `append()`, `prepend()`, `remove()`
* **Attributes & Props:** `attr()`, `data()`, `prop()`
* **Visibility:** `show()`, `hide()`, `toggle()`
* **Traversal:** `parent()`, `closest()`, `next()`, `prev()`, `find()`, `findAll()`
* **Utilities:** `ready()`, `asyncReady()`

---

## 🔌 Plugin System

Refine.js **stays minimal by default**. Only include what you need:

```bash
# Add a plugin
npm run add [plugin-name]

# Remove a plugin
npm run remove [plugin-name]

# List installed plugins
npm run list

# Build core + plugins
npm run build
```

Every plugin is **opt-in**, so your final bundle stays as small as possible.

---

# 📝 Documentation


## 1️⃣ Installation

```bash
# Clone the repo
git clone https://github.com/gokhanaltun/refine-js.git
cd refine-js

# Install dependencies
npm install

# Build core + plugins
npm run build
```

## 2️⃣ Quick Start
💡 After running the build, the minified file `refine.min.js` will be generated in the build/ folder.
You can now include this file in your project, for example in an HTML file:

```html
<script type="module">
    import { ref, ready } from 'refine.min.js';

    ready(() => {
        const btn = ref('#button');

        btn.onClick((e, el) => {
            el.addClass('active').text('Clicked!');
        });

        ref('#input').onInput((e, el) => {
            console.log(el.text());
        });
    });
</script>
```
Javascript file example:

```javascript
import { ref, ready } from 'refine.min.js';

ready(() => {
    const btn = ref('#button');

    btn.onClick((e, el) => {
        el.addClass('active').text('Clicked!');
    });

    ref('#input').onInput((e, el) => {
        console.log(el.text());
    });
});
```

---

## 3️⃣ Core API

### DOM Selection

| Method                                | Description                                           | Example                                      |
| ------------------------------------- | ----------------------------------------------------- | -------------------------------------------- |
| `ref(selector, refAttr = false)`      | Select a single element and return a `WrappedElement` | `ref('#myDiv').addClass('visible');`         |
| `refAll(selector, refAttr = false)`   | Select all matching elements, returns array           | `refAll('.items').forEach(el => el.hide());` |
| `refMult(selectors, refAttr = false)` | Select multiple elements at once                     | `const [a,b] = refMult('#a','#b');`        |

---

### Events

| Method         | Description                         | Example                                                      |
| -------------- | ----------------------------------- | ------------------------------------------------------------ |
| `onClick(fn)`  | Adds click event listener           | `ref('#btn').onClick((e, el) => el.toggle());`               |
| `onChange(fn)` | Adds change event listener          | `ref('#input').onChange((e, el) => console.log(el.text()));` |
| `onInput(fn)`  | Adds input event listener           | `ref('#input').onInput((e, el) => el.text('typing'));`       |
| `onSubmit(fn)` | Adds submit event listener to forms | `ref('form').onSubmit((e, el) => e.preventDefault());`       |

---

### Classes

| Method                     | Description                  | Example                                    |
| -------------------------- | ---------------------------- | ------------------------------------------ |
| `addClass(name)`           | Add CSS class                | `ref('#box').addClass('active');`          |
| `removeClass(name)`        | Remove CSS class             | `ref('#box').removeClass('active');`       |
| `toggleClass(name, force)` | Toggle class, optional force | `ref('#box').toggleClass('active');`       |
| `hasClass(name)`           | Check if class exists        | `if(ref('#box').hasClass('active')) {...}` |

---

### Content Manipulation

| Method             | Description               | Example                                   |
| ------------------ | ------------------------- | ----------------------------------------- |
| `text(value)`      | Get or set textContent    | `ref('#title').text('Hello');`            |
| `html(value)`      | Get or set innerHTML      | `ref('#container').html('<p>Hi</p>');`    |
| `append(content)`  | Append string or element  | `ref('#list').append('<li>Item</li>');`   |
| `prepend(content)` | Prepend string or element | `ref('#list').prepend('<li>Start</li>');` |
| `remove()`         | Remove element from DOM   | `ref('#old').remove();`                   |

---

### Attributes & Properties

| Method              | Description              | Example                                   |
| ------------------- | ------------------------ | ----------------------------------------- |
| `attr(name, value)` | Get/set attribute        | `ref('#img').attr('src', 'image.png');`   |
| `data(key, value)`  | Get/set data-* attribute | `ref('#el').data('id', '123');`           |
| `prop(name, value)` | Get/set property         | `ref('#checkbox').prop('checked', true);` |

---

### Visibility

| Method     | Description          | Example                 |
| ---------- | -------------------- | ----------------------- |
| `show()`   | Make element visible | `ref('#box').show();`   |
| `hide()`   | Hide element         | `ref('#box').hide();`   |
| `toggle()` | Toggle visibility    | `ref('#box').toggle();` |

---

### Traversal

| Method              | Description                       | Example                                |
| ------------------- | --------------------------------- | -------------------------------------- |
| `parent()`          | Returns parent element            | `ref('#child').parent();`              |
| `closest(selector)` | Returns closest matching ancestor | `ref('#child').closest('.container');` |
| `next()`            | Returns next sibling              | `ref('#item').next();`                 |
| `prev()`            | Returns previous sibling          | `ref('#item').prev();`                 |
| `find(selector)`    | Returns first matching child      | `ref('#container').find('.inner');`    |
| `findAll(selector)` | Returns all matching children     | `ref('#container').findAll('.inner');` |

---

### Utilities

| Method           | Description               | Example                                  |
| ---------------- | ------------------------- | ---------------------------------------- |
| `ready(fn)`      | DOMContentLoaded listener | `ready(() => console.log('DOM ready'));` |
| `asyncReady(fn)` | Promise-based DOM ready   | `await asyncReady(() => doSomething());` |

---

## 4️⃣ Custom Plugins

You can create your own plugin by adding a JS file in the `plugins/` folder.  

```javascript
// plugins/tooltip.js
// Must extend WrappedElement
WrappedElement.prototype.tooltip = function(text) {
    this.el.setAttribute('title', text);
    return this; // Always return `this` if no other value is needed
};
```

Then, add it to your project:

```bash
npm run add tooltip
npm run build
```

Now you can use it like this:

```javascript
import { ref, ready } from 'refine-js';

ready(() => {
    ref('#button').tooltip('Click me!');
});
```

**Important:** The plugin name you use with the CLI must match the file name (without `.js`). For example, a file named `tooltip.js` will be added with:

```bash
npm run add tooltip
```
--- 

## 📦 Real-World Example
```html
<!-- your-template.html (PHP, Django, EJS, etc.) -->
<form id="contact-form">
    <input type="email" id="email" required>
    <textarea id="message" required></textarea>
    <button type="submit">Send</button>
</form>
<div id="status"></div>

<script type="module">
    import { ref } from './refine.min.js';
    
    ref('#contact-form').onSubmit(async (e) => {
        e.preventDefault();
        
        const email = ref('#email').prop('value');
        const message = ref('#message').prop('value');
        
        ref('#status').text('Sending...').show();
        
        const response = await fetch('/api/contact', {
            method: 'POST',
            body: JSON.stringify({ email, message })
        });
        
        if (response.ok) {
            ref('#status').text('Message sent!').addClass('success');
            ref('#contact-form')[0].reset();
        }
    });
</script>
```