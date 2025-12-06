# Get Started

## Installation

### Option 1: CLI

```bash
# Init litewing
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

Output: `./dist/litewing.min.js` (~3.3-N KB depending on plugins)
```


### Option 2: Vite Plugin

```bash
# Install litewing
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