# 🎯 LiteWing-JS

**Write vanilla JavaScript, but better**

`litewing.js` is **not a framework**. It's a thin, lightweight wrapper that makes vanilla JavaScript **more readable, less repetitive, and still performant**. Nothing more. Nothing less.

```javascript
import { ref, ready } from 'litewing.min.js';

ready(() => {
    ref('#button')
        .onClick((e, target) => {
            target.addClass('active').text('Clicked!');
        }).text('Click Me');
});
```


## 💭 What is LiteWing?

You're already writing vanilla JavaScript. LiteWing just makes it **nicer, cleaner, and easier to read**.

### Without LiteWing

```javascript
const button = document.querySelector('#button');
button.addEventListener('click', (e) => {
    e.target.classList.add('active');
    e.target.textContent = 'Clicked!';
});
button.textContent = 'Click Me';
```

### With LiteWing

```javascript
ref('#button')
    .onClick((e, target) => {
        target.addClass('active').text('Clicked!');
    }).text('Click Me');
```

**Same result. Same performance. Less boilerplate.**


## 💡 Philosophy

### Vanilla JS First

LiteWing **never replaces native JavaScript**. It's purely **syntactic sugar for readability**, not a framework.

* **Zero-overhead:** No magic. No runtime. No dependencies.
* **Minimal core:** Only essential DOM operations, events, and traversal.
* **Plugin-based:** Need extra functionality? Add a plugin. Don’t need it? Core stays small (~2–3 KB minified).

### The Problem

Modern frameworks are powerful but heavy. jQuery is convenient but outdated. Vanilla JS is fast but verbose.

### The Solution

LiteWing gives **clear, concise syntax** that runs as **pure native JavaScript** with **zero runtime cost**.


## 🎯 When to Use LiteWing

✅ **Perfect for:**

* Server-rendered apps (PHP, Go, Python, Express, Rails)
* Adding interactivity to static sites
* WordPress, Shopify, or any CMS
* Progressive enhancement
* Multi-page applications (MPAs)

❌ **Not suitable for:**

* Complex SPAs with state management → Use React/Vue
* Apps requiring virtual DOM → Use a framework
* Projects already using a framework → Stick with it

**Rule of thumb:** If vanilla JS works there, LiteWing works there.


## 🔌 Plugin System

LiteWing **stays minimal by default**. Only include what you need:

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


# 📝 Documentation

## 1️⃣ Installation

```bash
# Clone the repo
git clone https://github.com/gokhanaltun/litewing-js.git
cd litewing-js

# Install dependencies
npm install

# Build core + plugins
npm run build
```

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
    import { ref } from './litewing.min.js';
    
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

# ⚠️ Documentation in progress. Core plugins documentation coming soon.
