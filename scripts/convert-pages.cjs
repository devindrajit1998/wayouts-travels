const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const routes = {
    'index.html': '',
    'about.html': 'about',
    'tours.html': 'tours',
    'destination.html': 'destination',
    'services.html': 'services',
    'blog.html': 'blog',
    'contact.html': 'contact',
    'team.html': 'team',
    'team-details.html': 'team-details',
    'testimonials.html': 'testimonials',
    'faq.html': 'faq',
    'tour-details.html': 'tour-details',
    'service-details.html': 'service-details',
    'post.html': 'post',
};

const active = {
    'index.html': 'home',
    'about.html': 'about',
    'tours.html': 'tours',
    'destination.html': 'destination',
    'services.html': 'services',
    'blog.html': 'blog',
    'contact.html': 'contact',
    'team.html': 'team',
    'team-details.html': 'team-details',
    'testimonials.html': 'testimonials',
    'faq.html': 'faq',
    'tour-details.html': '',
    'service-details.html': '',
    'post.html': '',
};

function transform(html) {
    return html
        .replace(/\r/g, '')
        .replace(/<!--([\s\S]*?)-->/g, '{/*$1*/}')
        .replace(/\bclass=/g, 'className=')
        .replace(/\bfor=/g, 'htmlFor=')
        .replace(/\bxlink:href=/g, 'xlinkHref=')
        .replace(/\btabindex=/gi, 'tabIndex=')
        .replace(/\bmaxlength=/gi, 'maxLength=')
        .replace(/\bcellpadding=/gi, 'cellPadding=')
        .replace(/\bcellspacing=/gi, 'cellSpacing=')
        .replace(/\bcolspan=/gi, 'colSpan=')
        .replace(/\browspan=/gi, 'rowSpan=')
        .replace(/\bautocomplete=/gi, 'autoComplete=')
        .replace(/\breadonly\b/gi, 'readOnly')
        .replace(/\brequired\s*=\s*(["'])\1/gi, 'required')
        .replace(/\bautoplay=/gi, 'autoPlay=')
        .replace(/\bmuted=/gi, 'muted=')
        .replace(/\bdata-background=(['"])assets\//g, 'data-background=$1/assets/')
        .replace(/(\s(?:src|href|xlinkHref|data-src)=(['"]))assets\//g, '$1/assets/')
        .replace(/(\s(?:href|action)=)(['"])(index-2|index|about|tours|destination|services|blog|contact|team-details|team|testimonials|faq|tour-details|service-details|post)\.html\2/g, (_, attribute, quote, page) => {
            const route = page === 'index-2' || page === 'index' ? '/' : `/${page}`;
            return `${attribute}${quote}${route}${quote}`;
        })
        .replace(/<(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)([^>]*?)(?<!\/)\s*>/gi, '<$1$2 />')
        .replace(/style="display:\s*block;?"/g, 'style={{ display: \'block\' }}');
}

for (const [file, route] of Object.entries(routes)) {
    const source = fs.readFileSync(path.join(root, file), 'utf8');
    const match = source.match(/<main\b[\s\S]*?<\/main>/i);
    if (!match) throw new Error(`No main found in ${file}`);
    const body = transform(match[0]);
    const destination = route ? path.join(root, 'src', 'app', route, 'page.jsx') : path.join(root, 'src', 'app', 'page.jsx');
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    const extended = file === 'index.html';
    const componentPath = route ? '../components' : './components';
    const output = `'use client';\n\nimport Navbar from '${componentPath}/Navbar';\nimport Footer from '${componentPath}/Footer';\n\nexport default function Page() {\n  return (\n    <>\n      <Navbar active="${active[file]}" extendedPages={${extended}} />\n      <div id="smooth-content">\n        ${body}\n        <Footer />\n      </div>\n    </>\n  );\n}\n`;
    fs.writeFileSync(destination, output);
}
console.log(`Generated ${Object.keys(routes).length} route pages.`);
