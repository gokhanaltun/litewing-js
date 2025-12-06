# 🎯 LiteWing-JS

**Write vanilla JavaScript, but better**

`litewing.js` is **not a framework**. It's a thin, lightweight wrapper that makes vanilla JavaScript **more readable, less repetitive, and still performant**. Nothing more. Nothing less.

```javascript
import { ref, ready } from 'litewing.min.js';

ready(() => {
    ref('#button').onClick(({event, target, currentTarget}) => {
        target.addClass('active').text('Clicked!');
    }).text('Click Me');
});
```
---

## 💭 What is LiteWing?

You're already writing vanilla JavaScript. LiteWing just makes it **nicer, cleaner, and easier to read**.

### Without LiteWing

```javascript
const btn = document.querySelector('#button');
btn.addEventListener('click', (e) => {
    e.target.classList.add('active');
    e.target.textContent = 'Clicked!';
});
```

### With LiteWing

```javascript
ref('#button').onClick(({target}) => {
    target.addClass('active').text('Clicked!');
});
```

**Same result. Same performance. Less boilerplate.**

---

## 💡 Philosophy

### 1. Intentionally Boring

LiteWing avoids abstractions and keeps everything predictable.

* **No magic:** Every method maps directly to native JavaScript
* **No runtime:** Just syntactic sugar
* **No lock-in:** You’re always writing real JavaScript

```javascript
// LiteWing method:
ref('#el').addClass('active');

// Native equivalent:
document.querySelector('#el').classList.add('active');
```

---

### 2. The Problem

Modern frontend tools often create more complexity than they remove:

* ❌ Frameworks are **overkill** for simple interactions
* ❌ jQuery is **outdated** and heavy
* ❌ Vanilla JavaScript becomes **verbose** and repetitive

---

### 3. The LiteWing Approach

LiteWing keeps things light, readable, and future-proof:

* ✅ **Readable:** Chainable API, less boilerplate
* ✅ **Tiny:** ~3KB minified
* ✅ **Honest:** No hidden behavior
* ✅ **Timeless:** Built on web standards

--- 

## 🎯 When to Use LiteWing

| ✔️ Perfect For                                         | ❌ Not Suitable For                                 |
| ------------------------------------------------------ | -------------------------------------------------- |
| Server-rendered apps (PHP, Go, Python, Rails, Express) | Complex SPAs with state management (use React/Vue) |
| Adding interactivity to static sites                   | Apps requiring a virtual DOM architecture          |
| WordPress, Shopify, or any CMS                         | Projects already using a frontend framework        |
| Progressive enhancement                                | Highly dynamic UI-heavy applications               |
| Multi-page applications (MPAs)                         | Framework ecosystems that expect components        |

**Rule of thumb:**
If vanilla JS works there, LiteWing works there.

---

## 🔌 Plugin System

LiteWing **stays minimal by default**. Only include what you need:

```json
{
  "out": "dist",
  "corePlugins": ["events", "classes", "attributes", "contents", "actions", "traversal"],
  "optionalPlugins": [],
  "userPlugins": {
    "path": "",
    "plugins": []
  }
}
```

Every plugin is **opt-in**, so your final bundle stays as small as possible.

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
    import { ref } from './litewing.min.js';
    
    ref('#contact-form').onSubmit(async ({event}) => {
        event.preventDefault();
        
        const email = ref('#email').prop('value');
        const message = ref('#message').prop('value');
        
        ref('#status').text('Sending...').show();
        
        const response = await fetch('/api/contact', {
            method: 'POST',
            body: JSON.stringify({ email, message })
        });
        
        if (response.ok) {
            ref('#status').text('Message sent!').addClass('success');
            ref('#contact-form').reset();
        }
    });
</script>
```
--- 

# 📝 Documentation

- [Get Started](./docs/get-started.md)
- [Plugins](./docs/plugins/plugins.md)

