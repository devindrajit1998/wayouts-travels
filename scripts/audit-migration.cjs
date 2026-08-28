const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const appDir = path.join(root, 'src', 'app');
const publicDir = path.join(root, 'public');

const expectedScripts = [
    '/assets/js/jquery-3.6.0.min.js',
    '/assets/js/jquery-migrate-3.4.0.min.js',
    '/assets/js/plugins.js',
    '/assets/js/imagesloaded.pkgd.min.js',
    '/assets/js/gsap.min.js',
    '/assets/js/ScrollSmoother.min.js',
    '/assets/js/ScrollTrigger.min.js',
    '/assets/js/smoother-script.js',
    '/assets/js/springer.min.js',
    '/assets/js/lenis.min.js',
    '/assets/js/three.min.js',
    '/assets/js/hover-effect.umd.js',
    '/assets/js/custom.js',
];

function walk(directory, extension) {
    return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const entryPath = path.join(directory, entry.name);
        if (entry.isDirectory()) {
            return walk(entryPath, extension);
        }
        return !extension || entryPath.endsWith(extension) ? [entryPath] : [];
    });
}

function relative(file) {
    return path.relative(root, file).replaceAll('\\', '/');
}

const errors = [];
const warnings = [];
const jsxFiles = walk(appDir, '.jsx');
const assetReferencePattern = /(?:src|href|data-background|data-src)=(?:"|')([^"']+)(?:"|')/g;
const internalHtmlPattern = /(?:href|action)=(?:"|')((?!\/assets\/)[^"']+\.html(?:[?#][^"']*)?)(?:"|')/g;

for (const file of jsxFiles) {
    const source = fs.readFileSync(file, 'utf8');
    let match;

    while ((match = internalHtmlPattern.exec(source))) {
        errors.push(`${relative(file)} contains unresolved HTML link: ${match[1]}`);
    }

    while ((match = assetReferencePattern.exec(source))) {
        const reference = match[1];
        if (!reference.startsWith('/assets/')) {
            continue;
        }

        const cleanReference = reference.split(/[?#]/, 1)[0];
        const relativeAssetPath = cleanReference.slice(1);
        const assetPath = path.join(publicDir, relativeAssetPath);
        if (!fs.existsSync(assetPath)) {
            const sourceAssetPath = path.join(root, relativeAssetPath);
            const message = `${relative(file)} references missing asset: ${reference}`;
            if (fs.existsSync(sourceAssetPath)) {
                errors.push(message);
            } else {
                warnings.push(`${message} (also missing from the original template)`);
            }
        }
    }
}

const scriptLoaderPath = path.join(appDir, 'components', 'ScriptLoader.jsx');
const scriptLoader = fs.readFileSync(scriptLoaderPath, 'utf8');
let previousIndex = -1;
for (const script of expectedScripts) {
    const currentIndex = scriptLoader.indexOf(`'${script}'`);
    if (currentIndex === -1) {
        errors.push(`ScriptLoader is missing: ${script}`);
        continue;
    }
    if (currentIndex < previousIndex) {
        errors.push(`ScriptLoader has an incorrect script order near: ${script}`);
    }
    previousIndex = currentIndex;

    const scriptPath = path.join(publicDir, script.slice(1));
    if (!fs.existsSync(scriptPath)) {
        errors.push(`Public script is missing: ${script}`);
    }
}

const navbarPath = path.join(appDir, 'components', 'Navbar.jsx');
const navbar = fs.readFileSync(navbarPath, 'utf8');
if (navbar.includes("['/404', '404 Page']") && !fs.existsSync(path.join(appDir, '404', 'page.jsx'))) {
    warnings.push('Navbar links to /404, but src/app/404/page.jsx does not exist.');
}

console.log(`Audited ${jsxFiles.length} JSX files.`);
console.log(`Verified ${expectedScripts.length} legacy scripts and their load order.`);

if (warnings.length) {
    console.log('\nWarnings:');
    warnings.forEach((warning) => console.log(`- ${warning}`));
}

if (errors.length) {
    console.error('\nErrors:');
    errors.forEach((error) => console.error(`- ${error}`));
    process.exitCode = 1;
} else {
    console.log('\nStatic migration audit passed.');
}
