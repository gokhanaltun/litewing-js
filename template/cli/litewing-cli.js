#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { minify } from 'terser';

const CONFIG_FILE = path.resolve(process.cwd(), 'litewing.config.json');
const CORE_DIR = path.resolve(process.cwd(), 'core');
const PLUGINS_DIR = path.resolve(process.cwd(), 'plugins');

function loadConfig() {
    if (!fs.existsSync(CONFIG_FILE)) {
        fs.writeFileSync(CONFIG_FILE, JSON.stringify({ out: "", corePlugins: [], plugins: [] }, null, 2));
    }
    return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
}

function saveConfig(config) {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}

const args = process.argv.slice(2);
const command = args[0];
const pluginName = args[1];

if (!command) {
    console.log("Usage: npm run <add|remove|list|build> <plugin-name>");
    process.exit(1);
}

const config = loadConfig();

// ─────────────────────────────────────────────
// ADD PLUGIN
// ─────────────────────────────────────────────
async function addPlugin(name) {
    if (!name) {
        console.log("Specify a plugin name to add");
        process.exit(1);
    }

    if (config.plugins.includes(name)) {
        console.log(`⚠️ Plugin "${name}" already exists`);
        return;
    }

    const pluginPath = path.join(PLUGINS_DIR, `${name}.js`);

    if (!fs.existsSync(pluginPath)) {
        console.log(`❌ Plugin "${name}" not found: ${pluginPath}`);
        process.exit(1);
    }

    config.plugins.push(name);
    saveConfig(config);
    console.log(`✅ Plugin "${name}" added`);
}

// ─────────────────────────────────────────────
// BUILD
// ─────────────────────────────────────────────
async function addPluginsToCoreCode(coreCode, pluginBasePath, plugins) {
    for (const plugin of plugins) {

        const pluginPath = path.join(pluginBasePath, `${plugin}.js`);

        if (!fs.existsSync(pluginPath)) {
            console.log(`❌ Plugin "${plugin}" not found, skipping.`);
            continue;
        }

        try {
            const code = fs.readFileSync(pluginPath, 'utf-8');
            coreCode += `\n\n// --- plugin: ${plugin} ---\n${code}`;
        } catch (err) {
            console.log(`❌ Error reading plugin "${plugin}": ${err.message}`);
        }
    }

    return coreCode;
}

async function build() {
    const coreFilePath = path.join(CORE_DIR, 'core.js');

    if (!fs.existsSync(coreFilePath)) {
        console.log(`❌ core.js not found`);
        process.exit(1);
    }

    let coreCode = fs.readFileSync(coreFilePath, 'utf-8');

    const corePluginsBase = path.join(CORE_DIR, "plugins");
    const addedCorePlugins = await addPluginsToCoreCode(coreCode, corePluginsBase, config.corePlugins);

    const pluginsBase = path.join(PLUGINS_DIR);
    const addedPlugins = await addPluginsToCoreCode(addedCorePlugins, pluginsBase, config.plugins);

    coreCode = addedPlugins;

    const minified = await minify(coreCode, {
        ecma: 2020,
        compress: true,
        mangle: true
    });

    let BUILD_DIR;

    const outPath = config.out.trim();

    if (path.isAbsolute(outPath)) {
        BUILD_DIR = outPath;
    } else {
        BUILD_DIR = path.resolve(process.cwd(), outPath);
    }

    const BUILD_FILE = path.join(BUILD_DIR, 'litewing.min.js');

    fs.mkdirSync(BUILD_DIR, { recursive: true });

    fs.writeFileSync(BUILD_FILE, minified.code);

    console.log(`✅ Build completed: ${BUILD_FILE}`);
}

// ─────────────────────────────────────────────
// COMMAND ROUTER
// ─────────────────────────────────────────────
switch (command) {
    case 'add':
        await addPlugin(pluginName);
        break;

    case 'remove':
        if (!pluginName) {
            console.log("Specify a plugin name to remove");
            process.exit(1);
        }
        const index = config.plugins.indexOf(pluginName);
        if (index !== -1) {
            config.plugins.splice(index, 1);
            saveConfig(config);
            console.log(`✅ Plugin "${pluginName}" removed`);
        } else {
            console.log(`⚠️ Plugin "${pluginName}" not found`);
        }
        break;

    case 'list':
        console.log("Installed plugins:", config.plugins.join(', ') || "None");
        break;

    case 'build':
        await build();
        break;

    default:
        console.log("Unknown command:", command);
        console.log("Usage: npm run <add|remove|list|build> <plugin-name>");
        process.exit(1);
}
