import { auth } from './firebase';

/**
 * Reads admin emails exclusively from environment variables.
 * Zero hardcoded email addresses in source code.
 */
export function getAdminEmails() {
    const envEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS || '';
    return envEmails
        .split(',')
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean);
}

/**
 * Checks if the current authenticated user's email is present in the env whitelist.
 */
export function isAdminUser(userOrEmail) {
    if (!userOrEmail) return false;
    const email = typeof userOrEmail === 'string' ? userOrEmail : userOrEmail?.email;
    if (!email) return false;

    const admins = getAdminEmails();
    if (admins.length === 0) return false;

    return admins.includes(email.trim().toLowerCase());
}
