/**
 * One-time Firebase seeding runner.
 *
 * Usage: node scripts/seed-firebase.mjs [--force]
 *
 * - Loads NEXT_PUBLIC_FIREBASE_* vars from .env.local
 * - Writes siteContent/home, siteContent/pages-meta, siteSettings/general
 * - Writes every collection document from scripts/seed-data.mjs
 * - Idempotent: existing documents are skipped unless --force is passed
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { initializeApp, deleteApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, writeBatch, serverTimestamp } from 'firebase/firestore';
import { homeContent, pagesContent, siteSettings, collections } from './seed-data.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const force = process.argv.includes('--force');

// --- Load .env.local manually (no dotenv dependency) ---
const envPath = resolve(__dirname, '..', '.env.local');
if (!existsSync(envPath)) {
    console.error('ERROR: .env.local not found at', envPath);
    process.exit(1);
}
for (const line of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (match && !process.env[match[1]]) {
        process.env[match[1]] = match[2];
    }
}

const required = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID',
];
const missing = required.filter((key) => !process.env[key]);
if (missing.length > 0) {
    console.error('ERROR: Missing required Firebase env vars:', missing.join(', '));
    process.exit(1);
}

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let created = 0;
let skipped = 0;

async function seedDocument(collectionName, docId, data) {
    const ref = doc(db, collectionName, docId);
    const snap = await getDoc(ref);
    if (snap.exists() && !force) {
        skipped++;
        console.log(`  SKIP  ${collectionName}/${docId} (already exists)`);
        return;
    }
    await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true });
    created++;
    console.log(`  ${snap.exists() ? 'FORCE-WROTE' : 'CREATED'}  ${collectionName}/${docId}`);
}

async function seedCollection(collectionName, items) {
    console.log(`\nSeeding collection "${collectionName}" (${items.length} items)...`);
    let batch = writeBatch(db);
    let ops = 0;
    for (const item of items) {
        const { id, ...data } = item;
        const ref = doc(db, collectionName, id);
        const snap = await getDoc(ref);
        if (snap.exists() && !force) {
            skipped++;
            console.log(`  SKIP  ${collectionName}/${id} (already exists)`);
            continue;
        }
        batch.set(ref, { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }, { merge: true });
        created++;
        console.log(`  ${snap.exists() ? 'FORCE-WROTE' : 'CREATED'}  ${collectionName}/${id}`);
        ops++;
        if (ops >= 450) {
            await batch.commit();
            batch = writeBatch(db);
            ops = 0;
        }
    }
    if (ops > 0) {
        await batch.commit();
    }
}

async function main() {
    console.log(`Seeding Firebase project: ${firebaseConfig.projectId}${force ? ' (FORCE MODE)' : ''}\n`);

    console.log('Seeding single documents...');
    await seedDocument('siteContent', 'home', homeContent);
    await seedDocument('siteContent', 'pages-meta', pagesContent);
    await seedDocument('siteSettings', 'general', siteSettings);

    for (const [name, items] of Object.entries(collections)) {
        await seedCollection(name, items);
    }

    console.log(`\nDone. Created/written: ${created}, skipped (already existed): ${skipped}`);
}

main()
    .catch((error) => {
        console.error('\nSEEDING FAILED:', error.message);
        process.exitCode = 1;
    })
    .finally(async () => {
        await deleteApp(app);
    });
