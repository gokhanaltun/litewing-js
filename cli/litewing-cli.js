#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { minify } from 'terser';
import compileTemplate from '../template-engine/template-engine.js';

const CONFIG_FILE = path.resolve(process.cwd(), 'litewing.config.json');

let __filename = fileURLToPath(import.meta.url);
let __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, "..");
const templatePath = path.join(PROJECT_ROOT, "template");
const CORE_DIR = path.join(templatePath, "core");
const CORE_PLUGINS_DIR = path.join(CORE_DIR, "plugins");
const PLUGINS_DIR = path.join(templatePath, "plugins");
const templateEnginePath = path.join(PROJECT_ROOT, "template-engine");

const defaultConfig = {
	"out": "dist",
	"minify": true,
	"corePlugins": [
		"events",
		"classes",
		"attributes",
		"contents",
		"actions",
		"traversal"
	],
	"optionalPlugins": [],
	"userPlugins": {
		"path": "",
		"plugins": []
	},
	"template": {
		"src": "litewing-template",
		"out": "dist/litewing-template",
		"minify": true
	}
}

// ----------------------------
// CONFIG LOAD
// ----------------------------
function loadConfig() {
	const templateConfig = path.join(templatePath, "litewing.config.json");

	if (!fs.existsSync(CONFIG_FILE)) {
		fs.copyFileSync(templateConfig, CONFIG_FILE);
		console.log(`ℹ️ litewing.config.json created`);
	}

	try {
		const configFromFile = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
		let config = {
			...defaultConfig,
			...configFromFile
		}

		if (configFromFile.userPlugins && typeof configFromFile.userPlugins === 'object') {
			config.userPlugins = {
				...defaultConfig.userPlugins,
				...configFromFile.userPlugins
			};
		}

		if (configFromFile.template && typeof configFromFile.template === 'object') {
			config.template = {
				...defaultConfig.template,
				...configFromFile.template
			};
		}
		return config;
	} catch (err) {
		console.error("⚠️ Error parsing litewing.config.json:", err.message);
		return defaultConfig;
	}
}


// ----------------------------
// BUILD PROCESS
// ----------------------------
function appendPlugins(code, baseDir, names) {
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

async function compileCore() {
	const config = loadConfig();

	const resolvedOutDir = path.isAbsolute(config.out)
		? config.out
		: path.resolve(process.cwd(), config.out);

	const coreFile = path.join(CORE_DIR, 'core.js');
	if (!fs.existsSync(coreFile)) {
		console.log("❌ core.js not found");
		process.exit(1);
	}

	let code = fs.readFileSync(coreFile, 'utf8');

	// Core plugins
	code = appendPlugins(code, CORE_PLUGINS_DIR, config.corePlugins);

	// Optional plugins
	code = appendPlugins(code, PLUGINS_DIR, config.optionalPlugins);

	// User plugins
	if (Array.isArray(config.userPlugins.plugins)) {
		const userPath = path.resolve(process.cwd(), config.userPlugins.path);
		code = appendPlugins(code, userPath, config.userPlugins.plugins);
	}

	// Minify
	if (config.minify) {
		const minified = await minify(code, { ecma: 2020, compress: true, mangle: true });
		code = minified.code;
	}

	fs.mkdirSync(resolvedOutDir, { recursive: true });
	const outFile = path.join(resolvedOutDir, config.minify ? "litewing.min.js" : "litewing.js");
	fs.writeFileSync(outFile, code);

	console.log(`✅ Build done → ${outFile}`);
}

async function compileTemplates() {
	const config = loadConfig();
	if (fs.existsSync(config.template.src)) {
		const templates = getHtmlFiles(config.template.src);
		if (templates.length > 0) {
			fs.mkdirSync(config.template.out, { recursive: true });
			if (config.template.minify) {
				const sterilizationJS = fs.readFileSync(path.join(templateEnginePath, "sterilization.js"), "utf-8");
				const minifiedJS = await minify(sterilizationJS, { ecma: 2020, compress: true, mangle: true });
				fs.writeFileSync(path.join(config.template.out, "sterilization.min.js"), minifiedJS.code);
			} else {
				fs.copyFileSync(path.join(templateEnginePath, "sterilization.js"), path.join(config.template.out, "sterilization.js"));
			}
			for (const t of templates) {
				const templateStringContent = fs.readFileSync(t, "utf-8");
				const templateName = path.basename(t, ".html");
				let templateFunction = compileTemplate(templateStringContent, templateName);
				if (config.template.minify) {
					const minified = await minify(templateFunction, { ecma: 2020, compress: true, mangle: true });
					templateFunction = minified.code;
				}
				fs.writeFileSync(path.join(config.template.out, config.template.minify ? `${templateName}.min.js` : `${templateName}.js`), templateFunction);
			};
			console.log(`✅ Template build done → ${config.template.out}`);
		}
	}
}

function getHtmlFiles(dir) {
	let results = [];
	const items = fs.readdirSync(dir, { withFileTypes: true });

	for (const item of items) {
		const fullPath = path.join(dir, item.name);

		if (item.isDirectory()) {
			results.push(...getHtmlFiles(fullPath));
		} else if (item.isFile() && path.extname(item.name).toLowerCase() === ".html") {
			results.push(fullPath);
		}
	}

	return results;
}


// ----------------------------
// COMMAND ROUTER
// ----------------------------
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
	case "init":
		try {
			loadConfig();
		} catch (err) {
			console.log(err);
		}
		break;

	case "build":
		await compileCore();
		await compileTemplates();
		break;

	default:
		console.log("Unknown command:", command);
		console.log("Usage: npx litewing <init|build>");
}
