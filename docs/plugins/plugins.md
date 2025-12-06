# 🔌 LiteWing Plugins

LiteWing is designed to be **minimal by default**, with extra functionality added via **plugins**.
All additional methods, event handling, actions, and traversal functions are implemented as plugins to keep the core small and flexible.

Plugins in LiteWing are divided into **three main types**:

---

## 1️⃣ Core Plugins

**Core plugins** provide essential DOM functionalities and are included in the default build.

* Examples:

  * **Actions:** `show()`, `hide()`, `toggle()`, `remove()`
  * **Events:** `on()`, `onClick()`, `onChange()`, `onInput()`
  * **Traversal:** `parent()`, `closest()`, `next()`, `prev()`, `find()`, `findAll()`

**Characteristics:**

* Included by default in the LiteWing build
* Provides basic DOM manipulation and traversal
* Can be excluded from the build via the `corePlugins` config list if not needed

```json
// litewing.config.json
{
  "corePlugins": [
    "events",
    "classes",
    "attributes",
    "contents",
    "actions",
    "traversal"
  ],
}
```

---

## 2️⃣ Optional Plugins

Optional plugins provide **additional features** that are not part of the core functionality but can enhance your workflow.

* Example: `lifecycle-hooks` (`onMount`, `onUnmount`, `onVisible`)

**Characteristics:**

* Not included by default
* Can be added at **build-time** via `optionalPlugins` in the config

```json
// litewing.config.json
{
  "optionalPlugins": [
    "lifecycle-hooks",
    "forms"
  ],
}
```
---

## 3️⃣ User Plugins

User plugins are **custom plugins** that developers create for their specific needs.

**Characteristics:**

* Can be added at **build-time** or **runtime**
* Allow extending `WrappedElement.prototype` with custom methods
* Build-time user plugins: listed in `userPlugins` config with path and plugin name
* Runtime user plugins: imported directly in your JS and executed to modify `WrappedElement.prototype`

```json
// litewing.config.json
{
    "userPlugins": {
        "path": "your-plugins-folder",
        "plugins": ["myPlugin1", "myPlugin2"]
    }
}
```

---

### ⚡ Summary Table

| Plugin Type | Included by Default? | How to Add                                         | Purpose                                     |
| ----------- | -------------------- | -------------------------------------------------- | ------------------------------------------- |
| Core        | ✅ Yes                | Build config (`corePlugins`)                       | Essential DOM operations                    |
| Optional    | ❌ No                 | Build config (`optionalPlugins`)  | Extra functionality (e.g., lifecycle hooks) |
| User        | ❌ No                 | Build config (`userPlugins`) or runtime import     | Custom developer-defined methods            |

Tamam Gökhan, o zaman **user plugins** kısmını detaylandıralım ve hem **build-time** hem **runtime** kullanımını örneklerle gösterelim. Aşağıdaki şekilde eklersen hem açıklayıcı hem de rehber niteliğinde olur:

---

## User Plugins (Extended)

User plugins are **custom plugins** that developers create for their specific needs.
There are two ways to use them: **build-time** or **runtime**.

---

### 3.1 Build-Time User Plugins

To include a user plugin in the LiteWing build:

1. Create a plugin file in your plugins folder, e.g. `myPlugin.js`:

```javascript
// your-plugins-folder/myPlugin.js

WrappedElement.prototype.highlight = function(color = 'yellow') {
    this.el.style.backgroundColor = color;
    return this;
};

WrappedElement.prototype.resetHighlight = function() {
    this.el.style.backgroundColor = '';
    return this;
};

```

2. Add it to your `litewing.config.json`:

```json
{
  "userPlugins": {
    "path": "your-plugins-folder",
    "plugins": ["myPlugin"]
  }
}
```

3. Run the build (`npx litewing build`).
   The plugin will be automatically included in the final `litewing.min.js` build.

**Usage after build:**

```javascript
import { ref } from './dist/litewing.min.js';

ref('#button').highlight('lime'); // custom method from user plugin
```

---

### 3.2 Runtime User Plugins

You can also load user plugins dynamically at runtime without including them in the build.

1. Write the plugin as a function that directly modifies `WrappedElement.prototype`:

```javascript
// your-plugins-folder/myPlugin.js
import { WrappedElement } from './litewing.min.js';

export default function myPlugin() {
    WrappedElement.prototype.highlight = function(color = 'yellow') {
        this.el.style.backgroundColor = color;
        return this;
    };

    WrappedElement.prototype.resetHighlight = function() {
        this.el.style.backgroundColor = '';
        return this;
    };
}
```

2. Import and run it in your JS file:

```javascript
import { ref } from './litewing.min.js';
import myPlugin from './your-plugins-folder/myPlugin.js';

myPlugin(); // attaches methods to WrappedElement

ref('#button').highlight('lime'); // works now at runtime
```

