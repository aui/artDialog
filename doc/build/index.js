const fs = require('fs');
const path = require('path');
const MarkdownIt = require('markdown-it');
const md = new MarkdownIt({
    html: true
});
const source = path.resolve(__dirname, '..', 'index.md');
const templateSource = path.resolve(__dirname, '..', 'template', 'index.html');
const output = path.resolve(__dirname, '..', 'index.html');
const content = fs.readFileSync(source, 'utf8');
const templateContent = fs.readFileSync(templateSource, 'utf8');

const html = md.render(content);
const template = (string, data) => string.replace(/\$\{([^\}]*?)\}/g, ($0, key) => String(data[key]));
const result = template(templateContent, {
    title: 'artDialog',
    content: html
});

fs.writeFileSync(output, result, 'utf8');
console.log('ok');