'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { auth } from '../../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { getCollectionItems } from '../../lib/firestoreService';
import { isAdminUser } from '../../lib/authUtils';

const navGroups = [
    {
        label: 'Workspace',
        items: [
            { href: '/admin', label: 'Dashboard', icon: 'fa-grid-2' },
            { href: '/admin/pages', label: 'Pages CMS', icon: 'fa-browser' },
        ],
    },
    {
        label: 'Catalog & Content',
        items: [
            { href: '/admin/tours', label: 'Tours & Packages', icon: 'fa-route' },
            { href: '/admin/destinations', label: 'Destinations', icon: 'fa-location-dot' },
            { href: '/admin/posts', label: 'Blog & Articles', icon: 'fa-newspaper' },
            { href: '/admin/services', label: 'Services', icon: 'fa-bell-concierge' },
            { href: '/admin/testimonials', label: 'Testimonials & Reviews', icon: 'fa-star' },
            { href: '/admin/faqs', label: 'FAQs', icon: 'fa-circle-question' },
            { href: '/admin/team', label: 'Team Experts', icon: 'fa-user-group' },
        ],
    },
    {
        label: 'Operations & Inbox',
        items: [
            { href: '/admin/bookings', label: 'Bookings', icon: 'fa-calendar-check' },
            { href: '/admin/customers', label: 'Customers', icon: 'fa-users' },
            { href: '/admin/inquiries', label: 'Contact Inquiries', icon: 'fa-messages' },
            { href: '/admin/subscribers', label: 'Newsletter Leads', icon: 'fa-envelope' },
        ],
    },
    {
        label: 'System',
        items: [
            { href: '/admin/settings', label: 'Settings & Brand', icon: 'fa-gear' },
        ],
    },
];

export default function AdminShell({ title, description, children }) {
    const pathname = usePathname();
    const [user, setUser] = useState(null);
    const [authorized, setAuthorized] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([
        { id: 1, title: 'New Booking from Kolkata', text: 'Sourav Banerjee booked Kashmir & Ladakh Paradise (₹49,998)', time: '10m ago', unread: true, link: '/admin/bookings', icon: 'fa-calendar-check', color: '#00c2cb' },
        { id: 2, title: 'Inbound Inquiry', text: 'Arindam Bose: Corporate Team Retreat in Sikkim', time: '1h ago', unread: true, link: '/admin/inquiries', icon: 'fa-message-dots', color: '#3b82f6' },
        { id: 3, title: 'New Newsletter Lead', text: 'debjani.kol@gmail.com subscribed via website footer', time: '3h ago', unread: false, link: '/admin/subscribers', icon: 'fa-envelope', color: '#10b981' }
    ]);
    const notifRef = useRef(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (!currentUser) {
                window.location.href = '/account';
                return;
            }
            if (!isAdminUser(currentUser)) {
                // If regular customer attempts to access /admin, redirect immediately to /dashboard
                window.location.href = '/dashboard';
                return;
            }
            setUser(currentUser);
            setAuthorized(true);
            setAuthLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // Close notification dropdown when clicked outside
    useEffect(() => {
        function handleClickOutside(e) {
            if (notifRef.current && !notifRef.current.contains(e.target)) {
                setShowNotifications(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    async function handleSignOut(e) {
        e.preventDefault();
        try {
            await signOut(auth);
        } catch (err) {
            console.error('Sign out error:', err);
        }
        window.location.href = '/account';
    }

    const unreadCount = notifications.filter((n) => n.unread).length;

    function markAllAsRead() {
        setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    }

    const userPhoto = user?.photoURL;
    const displayName = user?.displayName || (user?.email ? user.email.split('@')[0] : 'Admin');
    const initials = displayName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || 'AD';

    if (authLoading || !authorized) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#09204c', color: '#fff', fontFamily: 'sans-serif' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '32px', marginBottom: '16px', color: '#00c2cb' }}>
                        <i className="fa-solid fa-circle-notch fa-spin"></i>
                    </div>
                    <h4>Verifying Admin Authorization...</h4>
                </div>
            </div>
        );
    }

    return (
        <main className="admin-page">
            <aside className="admin-sidebar">
                <a href="/" aria-label="Open Wayouts website">
                    <img className="admin-sidebar-logo" src="/assets/img/wayouts-logo.png" alt="Wayouts" />
                </a>

                {navGroups.map((group) => (
                    <div key={group.label}>
                        <div className="admin-nav-label">{group.label}</div>
                        <nav className="admin-nav" aria-label={group.label}>
                            {group.items.map((item) => (
                                <a className={pathname === item.href ? 'active' : ''} href={item.href} key={item.href}>
                                    <i className={`fa-light ${item.icon}`}></i><span>{item.label}</span>
                                </a>
                            ))}
                        </nav>
                    </div>
                ))}

                <div className="admin-sidebar-footer">
                    <a href="/" target="_blank" rel="noopener noreferrer">
                        <i className="fa-light fa-arrow-up-right-from-square"></i><span>View website</span>
                    </a>
                    <a href="/account" onClick={handleSignOut}>
                        <i className="fa-light fa-arrow-right-from-bracket"></i><span>Sign out</span>
                    </a>
                </div>
            </aside>
            <section className="admin-main">
                <header className="admin-header">
                    <div>
                        <h1>{title}</h1>
                        <p>{description}</p>
                    </div>
                    <div className="admin-actions">
                        {/* Notifications Dropdown */}
                        <div style={{ position: 'relative' }} ref={notifRef}>
                            <button
                                className="admin-icon-button"
                                type="button"
                                aria-label="Notifications"
                                onClick={() => setShowNotifications(!showNotifications)}
                                style={{ position: 'relative' }}
                            >
                                <i className="fa-light fa-bell"></i>
                                {unreadCount > 0 && (
                                    <span style={{
                                        position: 'absolute',
                                        top: '-4px',
                                        right: '-4px',
                                        width: '18px',
                                        height: '18px',
                                        borderRadius: '50%',
                                        background: '#ef4444',
                                        color: '#fff',
                                        fontSize: '10px',
                                        fontWeight: 800,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: '2px solid #fff'
                                    }}>
                                        {unreadCount}
                                    </span>
                                )}
                            </button>

                            {showNotifications && (
                                <div style={{
                                    position: 'absolute',
                                    top: '46px',
                                    right: 0,
                                    width: '320px',
                                    background: '#ffffff',
                                    borderRadius: '16px',
                                    boxShadow: '0 12px 36px rgba(9, 32, 76, 0.16)',
                                    border: '1px solid #e2e8f0',
                                    zIndex: 1000,
                                    overflow: 'hidden'
                                }}>
                                    <div style={{ padding: '14px 18px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <strong style={{ fontSize: '14px', color: '#09204c' }}>Notifications</strong>
                                        {unreadCount > 0 && (
                                            <button
                                                type="button"
                                                onClick={markAllAsRead}
                                                style={{ border: 0, background: 'transparent', color: '#00aeb6', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}
                                            >
                                                Mark all read
                                            </button>
                                        )}
                                    </div>
                                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                        {notifications.map((n) => (
                                            <a
                                                key={n.id}
                                                href={n.link}
                                                onClick={() => setShowNotifications(false)}
                                                style={{
                                                    display: 'flex',
                                                    gap: '12px',
                                                    padding: '12px 18px',
                                                    borderBottom: '1px solid #f8fafc',
                                                    background: n.unread ? '#f0fdfa' : '#ffffff',
                                                    textDecoration: 'none',
                                                    transition: 'background 0.2s ease'
                                                }}
                                            >
                                                <div style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    borderRadius: '8px',
                                                    background: n.color + '15',
                                                    color: n.color,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '14px',
                                                    flexShrink: 0
                                                }}>
                                                    <i className={`fa-light ${n.icon}`}></i>
                                                </div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#09204c', lineHeight: 1.2 }}>{n.title}</div>
                                                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px', lineHeight: 1.3, whiteSpace: 'normal' }}>{n.text}</div>
                                                    <small style={{ fontSize: '10px', color: '#94a3b8', marginTop: '4px', display: 'block' }}>{n.time}</small>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                    <a
                                        href="/admin/bookings"
                                        onClick={() => setShowNotifications(false)}
                                        style={{ display: 'block', padding: '10px', textAlign: 'center', background: '#f8fafc', color: '#09204c', fontSize: '12px', fontWeight: 600, textDecoration: 'none', borderTop: '1px solid #f1f5f9' }}
                                    >
                                        View All Activity →
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Profile Pill with Google / Uploaded Photo Avatar */}
                        <a className="admin-profile" href="/admin/settings">
                            {userPhoto ? (
                                <img
                                    src={userPhoto}
                                    alt={displayName}
                                    style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                                />
                            ) : (
                                <span className="admin-avatar">{initials}</span>
                            )}
                            <span style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {displayName}
                            </span>
                        </a>
                    </div>
                </header>
                {children}
            </section>
        </main>
    );
}
