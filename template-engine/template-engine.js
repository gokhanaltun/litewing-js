import * as parse5 from "parse5";

const VARIABLE_REGEX = /\{\{(.*?)\}\}/g;

// --- PARSING (AYRIŞTIRMA) ve TRANSFORMATION (DÖNÜŞTÜRME) KISMI ---
function processTextNode(text) {
    if (text.trim() === '') return null;
    const parts = [];
    let lastIndex = 0;
    let match;
    while ((match = VARIABLE_REGEX.exec(text)) !== null) {
        if (match.index > lastIndex) {
            parts.push({ type: 'TEXT', content: text.substring(lastIndex, match.index) });
        }
        parts.push({ type: 'VARIABLE', expression: match[1].trim() });
        lastIndex = match.index + match[0].length;
    }
    if (lastIndex < text.length) {
        parts.push({ type: 'TEXT', content: text.substring(lastIndex) });
    }
    if (parts.length === 1 && parts[0].type === 'TEXT') {
        return parts[0];
    }
    return { type: 'TEXT_WITH_VARS', parts };
}

function processNode(node) {
    if (node.nodeName === '#comment' || (node.nodeName === '#text' && node.value.trim() === '')) {
        return null;
    }
    if (node.nodeName === '#documentType') {
        return { type: 'DOCTYPE', name: node.name, publicId: node.publicId, systemId: node.systemId };
    }
    if (node.nodeName === '#text') {
        return processTextNode(node.value);
    }
    if (node.nodeName !== '#document' && node.nodeName !== '#documentFragment') {
        const attrs = (node.attrs || []).reduce((acc, attr) => ({ ...acc, [attr.name]: attr.value }), {});

        if (node.nodeName === 'template') {
            if (attrs.for) {
                const [iterator, , source] = attrs.for.split(' ');
                return { type: 'FOR_LOOP', iterator, source, children: [] };
            }
            if (attrs.if) {
                return { type: 'IF_BLOCK', condition: attrs.if, children: [] };
            }
            if (attrs['else-if']) {
                return { type: 'ELSE_IF_BRANCH', condition: attrs['else-if'], children: [] };
            }
            if (Object.keys(attrs).includes('else')) {
                return { type: 'ELSE_BRANCH', children: [] };
            }
        }

        return {
            type: 'ELEMENT',
            tagName: node.tagName,
            attrs: node.attrs || [],
            children: []
        };
    }
    return { type: 'ROOT', nodeName: node.nodeName, children: [] };
}

function walk(node) {
    const newAstNode = processNode(node);
    if (newAstNode === null) {
        return null;
    }

    // DÜZELTME: template etiketleri için parse5 childNodes yerine content kullanır
    let childNodesToProcess = node.childNodes;

    // Eğer bu bir template node ise ve content property'si varsa, onu kullan
    if (node.nodeName === 'template' && node.content) {
        childNodesToProcess = node.content.childNodes;
    }

    if (childNodesToProcess && childNodesToProcess.length > 0) {
        const processedChildren = childNodesToProcess.map(walk);
        newAstNode.children = processedChildren.filter(child => child !== null);
    }

    return newAstNode;
}

function consolidateConditionals(children) {
    const newChildren = [];
    for (let i = 0; i < children.length; i++) {
        const node = children[i];
        if (node.type === 'IF_BLOCK') {
            const conditionalGroup = { type: 'CONDITIONAL_GROUP', branches: [] };
            conditionalGroup.branches.push({
                type: 'IF_BRANCH',
                condition: node.condition,
                children: node.children
            });
            let j = i + 1;
            while (j < children.length) {
                const nextNode = children[j];
                if (nextNode.type === 'ELSE_IF_BRANCH' || nextNode.type === 'ELSE_BRANCH') {
                    conditionalGroup.branches.push(nextNode);
                    j++;
                } else {
                    break;
                }
            }
            i = j - 1;
            newChildren.push(conditionalGroup);
        } else {
            newChildren.push(node);
        }
    }
    return newChildren;
}

function cleanAST(node) {
    if (node.children) {
        node.children = node.children.map(cleanAST).filter(n => n !== null);
        node.children = consolidateConditionals(node.children);
    }
    return node;
}


// --- CODE GENERATION (KOD ÜRETİMİ) KISMI ---
function escapeHtml(input) {
    if (input == null) return '';

    // 1) String'e çevir
    let s = String(input);

    // 2) Unicode normalize et (bypass karakterleri temizler)
    s = s.normalize('NFC');

    // 3) HTML entity'leri decode et (saldırganın encode ederek bypass etmesini önler)
    s = s.replace(/&#(\d+);?/g, (_, code) => String.fromCharCode(code));
    s = s.replace(/&#x([0-9a-fA-F]+);?/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));

    // 4) Encode et (sadece HTML text node için uygun)
    return s
        .replace(/&/g, "&amp;") // önce ampersand!
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function escapeAttribute(value) {
    if (value == null) return '';
    // text node için kullandığın escape fonksiyonunu çağır
    let s = escapeHtml(value);
    // attribute-specific ekler
    s = s.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    return s;
}

function generateAttrs(attrs) {
    if (!attrs || attrs.length === 0) return '';
    return ' ' + attrs.map(attr => `${attr.name}="${escapeAttribute(attr.value)}"`).join(' ');
}

function generateChildren(children, indentation = 4) {
    if (!children || children.length === 0) return '';

    // Optimizasyon: Ardışık statik içerikleri birleştir
    const optimized = [];
    let buffer = [];

    for (const child of children) {
        // Statik içerik mi kontrol et (TEXT veya ELEMENT ama dinamik içerik yok)
        if (canOptimize(child)) {
            buffer.push(child);
        } else {
            // Buffer'ı boşalt
            if (buffer.length > 0) {
                optimized.push({ type: 'STATIC_BLOCK', children: buffer });
                buffer = [];
            }
            optimized.push(child);
        }
    }

    // Kalan buffer'ı boşalt
    if (buffer.length > 0) {
        optimized.push({ type: 'STATIC_BLOCK', children: buffer });
    }

    return optimized.map(child => generateCode(child, indentation)).join('\n');
}

function canOptimize(node) {
    if (!node) return false;

    // Sadece TEXT ve ELEMENT'leri optimize et
    if (node.type === 'TEXT') return true;
    if (node.type === 'TEXT_WITH_VARS') return false; // Dinamik
    if (node.type === 'FOR_LOOP' || node.type === 'CONDITIONAL_GROUP') return false;

    // ELEMENT ise, çocuklarını kontrol et
    if (node.type === 'ELEMENT') {
        if (!node.children || node.children.length === 0) return true;
        return node.children.every(canOptimize);
    }

    return false;
}

function renderStatic(node) {
    switch (node.type) {
        case 'TEXT':
            return node.content;

        case 'ELEMENT':
            const startTag = `<${node.tagName}${generateAttrs(node.attrs)}>`;
            const endTag = `</${node.tagName}>`;
            let content = '';

            if (node.children && node.children.length > 0) {
                content = node.children.map(renderStatic).join('');
            }

            return startTag + content + endTag;

        default:
            return '';
    }
}


function generateCode(node, indentation = 4) {
    const indent = ' '.repeat(indentation);

    switch (node.type) {
        case 'ROOT':
            return generateChildren(node.children, indentation);

        case 'DOCTYPE':
            return `${indent}__html.push("<!DOCTYPE html>");`;

        case 'STATIC_BLOCK':
            // Tüm statik içeriği tek bir string'de birleştir
            const staticContent = node.children.map(renderStatic).join('');
            return `${indent}__html.push(${JSON.stringify(staticContent)});`;

        case 'ELEMENT':
            const startTag = `<${node.tagName}${generateAttrs(node.attrs)}>`;
            const endTag = `</${node.tagName}>`;

            let code = `${indent}__html.push(${JSON.stringify(startTag)});`;

            if (node.children && node.children.length > 0) {
                code += '\n' + generateChildren(node.children, indentation);
            }

            code += `\n${indent}__html.push(${JSON.stringify(endTag)});`;
            return code;

        case 'TEXT':
            return `${indent}__html.push(${JSON.stringify(node.content)});`;

        case 'TEXT_WITH_VARS':
            return node.parts.map(part => {
                if (part.type === 'TEXT') {
                    return `${indent}__html.push(${JSON.stringify(part.content)});`;
                } else if (part.type === 'VARIABLE') {
                    return `${indent}__html.push(escapeHtml(${part.expression}));`;
                }
                return '';
            }).join('\n');

        case 'FOR_LOOP':
            let loopCode = `${indent}for (const ${node.iterator} of ${node.source}) {`;
            if (node.children && node.children.length > 0) {
                loopCode += '\n' + generateChildren(node.children, indentation + 4);
            }
            loopCode += `\n${indent}}`;
            return loopCode;

        case 'CONDITIONAL_GROUP':
            return node.branches.map((branch, index) => {
                let condition = '';
                if (branch.type === 'IF_BRANCH') {
                    condition = `if (${branch.condition}) {`;
                } else if (branch.type === 'ELSE_IF_BRANCH') {
                    condition = `else if (${branch.condition}) {`;
                } else if (branch.type === 'ELSE_BRANCH') {
                    condition = `else {`;
                } else {
                    return '';
                }

                let branchCode = index === 0 ? `${indent}${condition}` : ` ${condition}`;

                if (branch.children && branch.children.length > 0) {
                    branchCode += '\n' + generateChildren(branch.children, indentation + 4);
                }

                branchCode += `\n${indent}}`;

                return branchCode;
            }).join('');

        default:
            return `${indent}/* HATA: Bilinmeyen düğüm tipi: ${node.type} */`;
    }
}

function compile(ast, name) {
    const generatedBody = generateCode(ast, 4);

    return `import escape from './sterilization.js';
export function ${name}(data, escapeHtml) {
  // Çıktı dizisi
  let __html = [];
  
  // escapeHtml fonksiyonu tanımla
  if (escapeHtml === undefined || escapeHtml === null) {
    escapeHtml = (s) => escape(s);
  } else if (escapeHtml === false) { 
    // Escaping'i kapat
    escapeHtml = (s) => s;
  }

  // AST'den üretilen kod
${generatedBody}

  // Tüm parçaları birleştir ve döndür
  return __html.join('');
}`;
}

export default function compileTemplate(template, name) {
    const htmlAST = parse5.parse(template);
    const initialAST = walk(htmlAST);
    const finalAST = cleanAST(initialAST);
    return compile(finalAST, name);
}
