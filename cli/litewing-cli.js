#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { minify } from 'terser';

const CONFIG_FILE = path.resolve(process.cwd(), 'litewing.config.json');

let __filename = fileURLToPath(import.meta.url);
let __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, "..");
const templatePath = path.join(PROJECT_ROOT, "template");
const CORE_DIR = path.join(templatePath, "core");
const CORE_PLUGINS_DIR = path.join(CORE_DIR, "plugins");
const PLUGINS_DIR = path.join(templatePath, "plugins");

// ----------------------------
// CONFIG LOAD
// ----------------------------
function loadConfig() {
	const templateConfig = path.join(templatePath, "litewing.config.json");

	if (!fs.existsSync(CONFIG_FILE)) {
		if (!fs.existsSync(templateConfig)) {
			console.log("❌ template config not found");
			return;
		}
		fs.copyFileSync(templateConfig, CONFIG_FILE);
		console.log(`ℹ️ litewing.config.json created`);
	}
	try {
		return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
	} catch {
		console.log("⚠️ Config could not be parsed, recreating...");
		fs.unlinkSync(CONFIG_FILE);
		fs.copyFileSync(templateConfig, CONFIG_FILE);
		console.log(`ℹ️ litewing.config.json created`);
		try {
			return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
		} catch (err) {
			throw new Error(`❌ Config could not be parsed: ${err}`);
		}
	}
}

let config;

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

async function build() {
	if (!config) {
		try {
			config = loadConfig();
		} catch (err) {
			console.log(err);
			return;
		}
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
	const minified = await minify(code, { ecma: 2020, compress: true, mangle: true });

	fs.mkdirSync(resolvedOutDir, { recursive: true });
	const outFile = path.join(resolvedOutDir, "litewing.min.js");
	fs.writeFileSync(outFile, minified.code);

	console.log(`✅ Build done → ${outFile}`);
}

// ----------------------------
// COMMAND ROUTER
// ----------------------------
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
	case "init":
		try {
			config = loadConfig();
		} catch (err) {
			console.log(err);
		}
		break;

	case "build":
		await build();
		break;

	default:
		console.log("Unknown command:", command);
		console.log("Usage: npx litewing <init|build>");
}
