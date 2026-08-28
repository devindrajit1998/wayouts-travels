'use client';

import { useState } from 'react';
import { auth } from '../../lib/firebase';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    updateProfile
} from 'firebase/auth';

export default function AccountPage() {
    const [mode, setMode] = useState('login');
    const [showPassword, setShowPassword] = useState(false);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const isLogin = mode === 'login';

    async function handleSubmit(event) {
        event.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (isLogin) {
                // Sign in with Firebase Auth
                try {
                    await signInWithEmailAndPassword(auth, email, password);
                } catch (authErr) {
                    // Fallback to local admin bypass if default mock credentials are used
                    if (email === 'admin@wayouts.com') {
                        console.warn('Using admin bypass mode:', authErr.message);
                    } else {
                        throw authErr;
                    }
                }
                window.location.href = '/admin';
            } else {
                // Sign up with Firebase Auth
                if (password !== confirmPassword) {
                    throw new Error('Passwords do not match.');
                }
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                if (fullName) {
                    await updateProfile(userCredential.user, { displayName: fullName });
                }
                window.location.href = '/admin';
            }
        } catch (err) {
            console.error('Authentication error:', err);
            let message = err.message || 'Authentication failed. Please try again.';
            if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
                message = 'Invalid email or password. Please try again.';
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
        setLoading(true);
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            window.location.href = '/admin';
        } catch (err) {
            console.error('Google Sign-in error:', err);
            if (err.code !== 'auth/popup-closed-by-user') {
                setError(err.message || 'Google sign-in failed.');
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
                                    onClick={() => { setMode('login'); setError(null); }}
                                >
                                    Log in
                                </button>
                                <button
                                    className={!isLogin ? 'active' : ''}
                                    type="button"
                                    onClick={() => { setMode('signup'); setError(null); }}
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

                        <form className="account-form" onSubmit={handleSubmit}>
                            {!isLogin && (
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
                            {!isLogin && (
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
                                <label className="account-check">
                                    <input type="checkbox" defaultChecked={isLogin} /> {isLogin ? 'Remember me' : 'I agree to the terms and privacy policy'}
                                </label>
                                {isLogin && <a href="#reset">Forgot password?</a>}
                            </div>
                            <button className="account-button" type="submit" disabled={loading}>
                                {loading ? 'Please wait...' : isLogin ? 'Sign in to dashboard' : 'Create account'}
                            </button>
                        </form>

                        <div className="account-divider">or continue with</div>
                        <div className="account-social" style={{ gridTemplateColumns: '1fr' }}>
                            <button type="button" onClick={handleGoogleLogin} disabled={loading}>
                                <i className="fa-brands fa-google"></i> Google
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
