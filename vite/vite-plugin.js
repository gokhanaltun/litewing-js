#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { minify } from 'terser';

let __filename = fileURLToPath(import.meta.url);
let __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, "..");
const templatePath = path.join(PROJECT_ROOT, "template");
const CORE_DIR = path.join(templatePath, "core");
const CORE_PLUGINS_DIR = path.join(CORE_DIR, "plugins");
const PLUGINS_DIR = path.join(templatePath, "plugins");
const defaultConfig = {
    "out": "dist",
    "minify": true,
    "corePlugins": ["events", "classes", "attributes", "contents", "actions", "traversal"],
    "optionalPlugins": [],
    "userPlugins": {
        "path": "",
        "plugins": []
    }
}

// ----------------------------
// CONFIG LOAD
// ----------------------------
function loadConfig() {
    const templateConfig = path.join(templatePath, "litewing.config.json");

    if (!fs.existsSync(templateConfig)) {
        return defaultConfig;
    }

    try {
        return JSON.parse(fs.readFileSync(templateConfig, 'utf-8'));
    } catch {
        return defaultConfig;
    }
}

// ----------------------------
// BUILD PROCESS
// ----------------------------
async function appendPlugins(code, baseDir, names) {
    if (!names || !Array.isArray(names)) return code;

    for (const name of names) {
        const pluginPath = path.join(baseDir, `${name}.js`);

        if (!fs.existsSync(pluginPath)) {
            console.log(`⚠️ Plugin missing: ${pluginPath}`);
            continue;
        }

        code += `\n\n// --- plugin: ${name} ---\n`;
        code += fs.readFileSync(pluginPath, "utf8");
    }

    return code;
}

async function build(options = {}) {
    let config;

    if (options && Object.keys(options).length) {
        config = options;

    } else {
        config = loadConfig();
    }

    const outDir = config.out && config.out.trim() ? config.out : "dist";
    const resolvedOutDir = path.isAbsolute(outDir)
        ? outDir
        : path.resolve(process.cwd(), outDir);

    const coreFile = path.join(CORE_DIR, 'core.js');
    if (!fs.existsSync(coreFile)) {
        console.log("❌ core.js not found");
        process.exit(1);
    }

    let code = fs.readFileSync(coreFile, 'utf8');

    // Core plugins
    if (config.corePlugins && config.corePlugins.length) {
        code = await appendPlugins(code, CORE_PLUGINS_DIR, config.corePlugins);
    }

    // Optional plugins
    if (config.optionalPlugins && config.optionalPlugins.length) {
        code = await appendPlugins(code, PLUGINS_DIR, config.optionalPlugins);
    }

    // User plugins
    if (config.userPlugins && Array.isArray(config.userPlugins.plugins) && config.userPlugins.plugins.length) {
        const userPath = config.userPlugins.path && config.userPlugins.path.trim()
            ? path.resolve(process.cwd(), config.userPlugins.path)
            : null;

        if (userPath) {
            code = await appendPlugins(code, userPath, config.userPlugins.plugins);
        }
    }

    // Minify
    const minified = config.minify ? await minify(code, { ecma: 2020, compress: true, mangle: true }) : code;
    const outputCode = config.minify ? minified.code : code;

    fs.mkdirSync(resolvedOutDir, { recursive: true });
    const outFile = path.join(resolvedOutDir, "litewing.min.js");
    fs.writeFileSync(outFile, outputCode);

    console.log(`✅ Build done → ${outFile}`);
}

export default function LiteWingVite(options = {}) {
    return {
        name: 'litewing-vite',

        async buildStart() {
            await build(options);
        },

        async generateBundle() {
            await build(options);
        }
    };
}