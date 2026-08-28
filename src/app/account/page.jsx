'use client';

import { useState } from 'react';
import { auth } from '../../lib/firebase';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    updateProfile,
    sendPasswordResetEmail
} from 'firebase/auth';
import { addCollectionItem } from '../../lib/firestoreService';
import { isAdminUser } from '../../lib/authUtils';

export default function AccountPage() {
    const [mode, setMode] = useState('login'); // 'login' | 'signup' | 'reset'
    const [showPassword, setShowPassword] = useState(false);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const isLogin = mode === 'login';
    const isReset = mode === 'reset';

    async function handleSubmit(event) {
        event.preventDefault();
        setError(null);
        setSuccessMessage(null);
        setLoading(true);

        try {
            if (isReset) {
                // Send Password Reset Link
                await sendPasswordResetEmail(auth, email);
                setSuccessMessage('Password reset link sent to your email. Check your inbox!');
            } else if (isLogin) {
                // Sign in securely with Firebase Auth
                const cred = await signInWithEmailAndPassword(auth, email, password);
                const loggedInUserEmail = cred.user.email;

                // Admin role route vs Customer traveler route determined solely by ENV
                if (isAdminUser(loggedInUserEmail)) {
                    window.location.href = '/admin';
                } else {
                    window.location.href = '/dashboard';
                }
            } else {
                // Sign up with Firebase Auth
                if (password !== confirmPassword) {
                    throw new Error('Passwords do not match.');
                }
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                if (fullName) {
                    await updateProfile(userCredential.user, { displayName: fullName });
                }

                // Register user into Firestore customers collection
                try {
                    const d = new Date();
                    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    const today = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
                    await addCollectionItem('customers', {
                        name: fullName || 'New Traveler',
                        email: email,
                        phone: '',
                        city: 'Kolkata, India',
                        trips: 0,
                        spent: '₹0',
                        joined: today,
                        tier: 'Silver Member',
                        status: 'Active',
                    });
                } catch (e) {
                    console.warn('Customer registry sync error:', e);
                }

                // New registered users redirect based on role
                if (isAdminUser(email)) {
                    window.location.href = '/admin';
                } else {
                    window.location.href = '/dashboard';
                }
            }
        } catch (err) {
            console.error('Authentication error:', err);
            let message = err.message || 'Authentication failed. Please try again.';
            if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
                message = 'Invalid email or password. Please check your credentials.';
            } else if (err.code === 'auth/email-already-in-use') {
                message = 'This email is already registered. Please log in instead.';
            } else if (err.code === 'auth/weak-password') {
                message = 'Password should be at least 6 characters.';
            }
            setError(message);
        } finally {
            setLoading(false);
        }
    }

    async function handleGoogleLogin() {
        setError(null);
        setSuccessMessage(null);
        setLoading(true);
        try {
            const provider = new GoogleAuthProvider();
            provider.setCustomParameters({ prompt: 'select_account' });
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Sync user to Firestore customers collection if new
            try {
                const d = new Date();
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                const today = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
                await addCollectionItem('customers', {
                    name: user.displayName || 'Google Explorer',
                    email: user.email,
                    phone: user.phoneNumber || '',
                    city: 'Kolkata, India',
                    trips: 0,
                    spent: '₹0',
                    joined: today,
                    tier: 'Silver Member',
                    status: 'Active',
                });
            } catch (e) {
                console.warn('Customer registry sync error:', e);
            }

            // Google users redirect: Admin vs Customer
            if (isAdminUser(user.email)) {
                window.location.href = '/admin';
            } else {
                window.location.href = '/dashboard';
            }
        } catch (err) {
            console.error('Google Sign-in error:', err);
            if (err.code !== 'auth/popup-closed-by-user' && err.code !== 'auth/cancelled-popup-request') {
                setError(err.message || 'Google sign-in failed. Please verify your connection.');
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="account-page">
            <header className="account-header">
                <a href="/" aria-label="Wayouts home">
                    <img className="account-header-logo" src="/assets/img/wayouts-logo.png" alt="Wayouts" />
                </a>
                <a className="account-home-link" href="/"><i className="fa-light fa-arrow-left"></i> Back to home</a>
            </header>
            <div className="account-card">
                <section className="account-brand">
                    <div className="account-brand-content">
                        <span className="account-kicker">Welcome to Wayouts</span>
                        <h1>Explore the world with <em>Wayouts</em></h1>
                        <p>Join millions of travelers discovering custom holiday packages, luxury tours, and unforgettable adventures.</p>
                    </div>
                    <div className="account-benefits">
                        <span><i className="fa-solid fa-check"></i> Exclusive member-only discounts & deals</span>
                        <span><i className="fa-solid fa-check"></i> Instant bookings with flexible cancellation</span>
                        <span><i className="fa-solid fa-check"></i> 24/7 dedicated travel concierge support</span>
                    </div>
                </section>

                <section className="account-panel">
                    <div className="account-panel-inner">
                        <div className="account-topline">
                            <div className="account-tabs">
                                <button
                                    className={isLogin ? 'active' : ''}
                                    type="button"
                                    onClick={() => { setMode('login'); setError(null); setSuccessMessage(null); }}
                                >
                                    Log in
                                </button>
                                <button
                                    className={mode === 'signup' ? 'active' : ''}
                                    type="button"
                                    onClick={() => { setMode('signup'); setError(null); setSuccessMessage(null); }}
                                >
                                    Sign up
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div style={{ padding: '10px 14px', background: '#fee2e2', color: '#b91c1c', borderRadius: '8px', fontSize: '13px', marginBottom: '14px', border: '1px solid #fca5a5' }}>
                                {error}
                            </div>
                        )}

                        {successMessage && (
                            <div style={{ padding: '10px 14px', background: '#dcfce7', color: '#15803d', borderRadius: '8px', fontSize: '13px', marginBottom: '14px', border: '1px solid #86efac' }}>
                                {successMessage}
                            </div>
                        )}

                        <form className="account-form" onSubmit={handleSubmit}>
                            {mode === 'signup' && (
                                <div className="account-field">
                                    <label htmlFor="full-name">Full name</label>
                                    <input
                                        id="full-name"
                                        type="text"
                                        placeholder="Enter your full name"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        required
                                    />
                                </div>
                            )}
                            <div className="account-field">
                                <label htmlFor="email">Email address</label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            {!isReset && (
                                <div className="account-field">
                                    <label htmlFor="password">Password</label>
                                    <div className="account-password-wrap">
                                        <input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                        <button
                                            type="button"
                                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            <i className={`fa-light ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                        </button>
                                    </div>
                                </div>
                            )}
                            {mode === 'signup' && (
                                <div className="account-field">
                                    <label htmlFor="confirm-password">Confirm password</label>
                                    <input
                                        id="confirm-password"
                                        type="password"
                                        placeholder="Repeat your password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            )}
                            <div className="account-row">
                                {isLogin && (
                                    <>
                                        <label className="account-check">
                                            <input type="checkbox" defaultChecked /> Remember me
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => { setMode('reset'); setError(null); setSuccessMessage(null); }}
                                            style={{ background: 'transparent', border: 0, color: 'var(--admin-primary)', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}
                                        >
                                            Forgot password?
                                        </button>
                                    </>
                                )}
                                {isReset && (
                                    <button
                                        type="button"
                                        onClick={() => { setMode('login'); setError(null); setSuccessMessage(null); }}
                                        style={{ background: 'transparent', border: 0, color: 'var(--admin-primary)', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}
                                    >
                                        ← Back to Log in
                                    </button>
                                )}
                            </div>
                            <button className="account-button" type="submit" disabled={loading}>
                                {loading ? 'Please wait...' : isReset ? 'Send reset link' : isLogin ? 'Sign in to dashboard' : 'Create account'}
                            </button>
                        </form>

                        {!isReset && (
                            <>
                                <div className="account-divider">or continue with</div>
                                <div className="account-social" style={{ gridTemplateColumns: '1fr' }}>
                                    <button
                                        type="button"
                                        onClick={handleGoogleLogin}
                                        disabled={loading}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '10px',
                                            height: '46px',
                                            border: '1px solid #cbd5e1',
                                            borderRadius: '10px',
                                            background: '#fff',
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            color: '#1e293b',
                                            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24">
                                            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                                            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                                            <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                                            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                                        </svg>
                                        <span>Continue with Google</span>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}
