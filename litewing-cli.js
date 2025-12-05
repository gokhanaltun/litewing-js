#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);
const projectName = args[0];

if (!projectName) {
  console.log("Usage: npx create-refine <project-name>");
  process.exit(1);
}

const targetPath = path.resolve(process.cwd(), projectName);
if (fs.existsSync(targetPath)) {
  console.log("Error: folder already exists.");
  process.exit(1);
}

fs.mkdirSync(targetPath);

const templatePath = path.join(__dirname, "./template");

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const item of fs.readdirSync(src)) {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    const stat = fs.statSync(srcPath);
    if (stat.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

copyDir(templatePath, targetPath);

console.log(`✅ Refine project created at ${targetPath}`);
console.log(`cd ${projectName} && npm install`);
