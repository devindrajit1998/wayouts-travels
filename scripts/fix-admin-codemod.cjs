/**
 * Codemod: make the 11 admin CRUD pages strictly Firestore-only.
 * 1. Remove dead `const initialXxx = [...]` arrays (already replaced by Firestore fetches).
 * 2. Fix broken two-arg getCollectionItems('x', []) calls (second arg is now orderField).
 * 3. Attach .catch() error handlers to the useEffect load chains.
 */
const fs = require('fs');
const path = require('path');

const pages = [
    'bookings',
    'customers',
    'destinations',
    'faqs',
    'inquiries',
    'posts',
    'services',
    'subscribers',
    'team',
    'testimonials',
    'tours',
];

const CATCH_BLOCK = [
    '        }).catch((err) => {',
    "            console.error('Failed to load from Firestore:', err.message);",
    '            if (isMounted) {',
    "                setMessage({ type: 'error', text: 'Failed to load data from Firestore: ' + err.message });",
    '                setLoading(false);',
    '            }',
    '        });',
    '        return () => {',
].join('\n');

const report = [];

for (const page of pages) {
    const file = path.join('src', 'app', 'admin', page, 'page.jsx');
    let content = fs.readFileSync(file, 'utf8');

    // 1. Remove dead initialXxx array (bracket-safe: nested arrays are indented, close is at column 0)
    const arrayRegex = /const initial[A-Za-z]+ = \[[\s\S]*?\n\];\n\n/;
    const hadArray = arrayRegex.test(content);
    content = content.replace(arrayRegex, '');

    // 2. Fix two-arg getCollectionItems calls
    const twoArgCalls = content.match(/getCollectionItems\('([a-z]+)', \[\]\)/g) || [];
    content = content.replace(/getCollectionItems\('([a-z]+)', \[\]\)/g, "getCollectionItems('$1')");

    // 3. Attach .catch() to the load chain (pattern: chain close + useEffect cleanup return)
    const target = '        });\n        return () => {';
    const occurrences = content.split(target).length - 1;
    let catchAdded = false;
    if (occurrences === 1) {
        content = content.replace(target, CATCH_BLOCK);
        catchAdded = true;
    }

    fs.writeFileSync(file, content);
    report.push(
        `${page}: arrayRemoved=${hadArray}, twoArgFixed=${twoArgCalls.length}, catchAdded=${catchAdded}` +
        (occurrences > 1 ? ` (WARNING: ${occurrences} chain-close matches)` : '') +
        (occurrences === 0 ? ' (WARNING: no chain-close match)' : '')
    );
}

console.log(report.join('\n'));
