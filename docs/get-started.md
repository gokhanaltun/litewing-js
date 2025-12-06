# 🏁 Get Started with LiteWing

LiteWing is a **minimal DOM wrapper** that makes vanilla JS **more readable, less repetitive, and performant**.
The Core JS provides basic element selection and DOM readiness functions. All other functionality comes via plugins.

---

## 1️⃣ Installation

### Option 1: CLI

```bash
# Initialize LiteWing
npx litewing init

# Configure plugins in litewing.config.json
{
  "out": "dist",
  "corePlugins": [
    "events",
    "classes",
    "traversal"
  ],
  "optionalPlugins": [],
  "userPlugins": {
    "path": "",
    "plugins": []
  }
}

# Build 
npx litewing build

# Output: ./dist/litewing.min.js (~3.3 KB with core plugins)
```

### Option 2: Vite Plugin

```bash
npm install -D litewing
```

```javascript
// vite.config.js
import LitewingVite from 'litewing/vite/vite-plugin.js';

export default {
  plugins: [
    LitewingVite({
      out: 'dist',
      optionalPlugins: ['lifecycle-hooks']
    })
  ]
}
```

---

## 2️⃣ Core JS: WrappedElement and Element Selection

The core of LiteWing is the **WrappedElement** class. Each DOM element is wrapped and has its own **state** object.

```javascript
import { WrappedElement, ref, refAll, refMult } from './litewing.min.js';

// Select a single element
const btn = ref('#button');

// Select multiple elements
const inputs = refAll('input');

// Select multiple elements using multiple selectors
const [emailInput, messageInput] = refMult('#email', '#message');

// State usage
btn.state.clicked = false;
```

> ⚡ **Note:** Each element has its own state object. Plugins or user code can store data in this object.

---

## 3️⃣ Core Ready Functions

Run code when the DOM is fully loaded or for async tasks:

```javascript
import { ready, asyncReady, ref } from './litewing.min.js';
// ready
ready(() => {
    ref('#button').el.textContent = 'DOM is ready!';
});

// async ready
await asyncReady();
```

* **ready(fn)** → standard DOMContentLoaded
* **asyncReady(fn)** → Promise/async-friendly, supports async/await

---

## 4️⃣ Core Workflow Example

```html
<button id="clickMe">Click Me</button>
```

```javascript
import { ref, ready } from './litewing.min.js';

ready(() => {
    const btn = ref('#clickMe');

    // Use element state
    btn.state.clicked = false;

    // Simple click handler
    btn.el.addEventListener('click', () => {
        btn.state.clicked = true;
        btn.el.textContent = 'Clicked!';
    });

    console.log('Button ready. Initial state:', btn.state.clicked);
});
```

> This example demonstrates **state management** and element reference usage **without any plugins**.

---

## 5️⃣ Mini Core API Reference

| Function                | Description                 | Example                               |
| ----------------------- | --------------------------- | ------------------------------------- |
| `ref(selector)`         | Select a single element     | `const btn = ref('#btn');`            |
| `refAll(selector)`      | NodeList → WrappedElement[] | `const inputs = refAll('input');`     |
| `refMult(...selectors)` | Select multiple selectors   | `const [a,b] = refMult('#a','#b');`   |
| `ready(fn)`             | Run after DOMContentLoaded  | `ready(() => console.log('ready'))`   |
| `asyncReady(fn)`        | Async-ready wrapper         | `await asyncReady(() => fetchData())` |
| `WrappedElement.state`  | Per-element state object    | `btn.state.clicked = true`            |

---

Core JS is minimal and provides only:

* **State per element**
* **Element references**
* **Ready functions**

--- 

## 6️⃣ Next Step: [Plugins > ](./plugins/plugins.md)

