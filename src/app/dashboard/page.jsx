'use client';

import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageBanner from '../components/PageBanner';
import { auth, db } from '../../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function CustomerDashboard() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(null);
    const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' | 'profile' | 'wishlist'
    const [customerBookings, setCustomerBookings] = useState([]);
    const [customerProfile, setCustomerProfile] = useState({
        name: '',
        email: '',
        phone: '',
        city: '',
        tier: '',
        spent: '',
        trips: 0
    });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (!currentUser) {
                // If not logged in, redirect to login page
                window.location.href = '/account';
                return;
            }

            setUser(currentUser);
            setCustomerProfile((prev) => ({
                ...prev,
                name: currentUser.displayName || currentUser.email?.split('@')[0] || '',
                email: currentUser.email || '',
            }));

            // Fetch live customer bookings from Firestore
            try {
                const q = query(collection(db, 'bookings'), where('email', '==', currentUser.email));
                const snap = await getDocs(q);
                const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
                setCustomerBookings(list);
            } catch (err) {
                console.error('Could not fetch user bookings:', err.message);
                setLoadError(err);
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    async function handleSignOut() {
        await signOut(auth);
        window.location.href = '/';
    }

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#09204c', color: '#fff', fontFamily: 'sans-serif' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '32px', marginBottom: '16px', color: '#00c2cb' }}>
                        <i className="fa-solid fa-circle-notch fa-spin"></i>
                    </div>
                    <h4>Loading your Traveler Dashboard...</h4>
                </div>
            </div>
        );
    }

    if (loadError) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#09204c', color: '#fff', fontFamily: 'sans-serif' }}>
                <div style={{ textAlign: 'center', padding: '0 24px' }}>
                    <div style={{ fontSize: '32px', marginBottom: '16px', color: '#f59e0b' }}>
                        <i className="fa-solid fa-triangle-exclamation"></i>
                    </div>
                    <h4>We could not load your bookings</h4>
                    <p style={{ color: '#cbd5e1', fontSize: '14px' }}>{loadError.message}</p>
                    <button type="button" onClick={() => window.location.reload()} style={{ marginTop: '16px', padding: '10px 24px', borderRadius: '999px', border: 'none', background: '#00c2cb', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const initials = user?.displayName
        ? user.displayName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
        : user?.email ? user.email.slice(0, 2).toUpperCase() : 'TR';

    return (
        <>
            <Navbar active="dashboard" />
            <div id="smooth-content">
                <main className="o-hidden">
                    <PageBanner
                        subtitle="MEMBER PORTAL"
                        title="Welcome Back,"
                        highlight={customerProfile.name}
                        bgImage="/assets/img/destination/01.jpg"
                    />

                    <section className="section-padding" style={{ background: '#f8fafc', minHeight: '600px' }}>
                        <div className="container">
                            <div className="row">
                                {/* Left Member Profile Sidebar Card */}
                                <div className="col-lg-4 col-md-12 mb-30">
                                    <div style={{
                                        background: '#fff',
                                        borderRadius: '24px',
                                        padding: '36px 28px',
                                        boxShadow: '0 10px 30px rgba(9, 32, 76, 0.06)',
                                        textAlign: 'center',
                                        border: '1px solid #e2e8f0'
                                    }}>
                                        <div style={{
                                            width: '90px',
                                            height: '90px',
                                            borderRadius: '50%',
                                            background: 'linear-gradient(135deg, #09204c 0%, #00aeb6 100%)',
                                            color: '#fff',
                                            fontSize: '32px',
                                            fontWeight: 800,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            margin: '0 auto 16px',
                                            boxShadow: '0 8px 20px rgba(0, 194, 203, 0.3)'
                                        }}>
                                            {initials}
                                        </div>
                                        <h4 style={{ margin: '0 0 4px', color: '#09204c', fontWeight: 700 }}>{customerProfile.name}</h4>
                                        <p style={{ color: '#64748b', fontSize: '14px', margin: '0 0 14px' }}>{customerProfile.email}</p>
                                        <span style={{
                                            display: 'inline-block',
                                            padding: '4px 14px',
                                            borderRadius: '999px',
                                            background: '#e0f2fe',
                                            color: '#0284c7',
                                            fontSize: '12px',
                                            fontWeight: 700,
                                            textTransform: 'uppercase',
                                            letterSpacing: '1px',
                                            marginBottom: '24px'
                                        }}>
                                            {customerProfile.tier}
                                        </span>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '16px 0', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', marginBottom: '24px' }}>
                                            <div>
                                                <small style={{ color: '#64748b', fontSize: '12px', textTransform: 'uppercase', display: 'block' }}>City</small>
                                                <strong style={{ color: '#09204c', fontSize: '14px' }}>{customerProfile.city}</strong>
                                            </div>
                                            <div>
                                                <small style={{ color: '#64748b', fontSize: '12px', textTransform: 'uppercase', display: 'block' }}>Total Trips</small>
                                                <strong style={{ color: '#00aeb6', fontSize: '16px' }}>{customerBookings.length}</strong>
                                            </div>
                                        </div>

                                        <div style={{ display: 'grid', gap: '8px' }}>
                                            <button
                                                type="button"
                                                onClick={() => setActiveTab('bookings')}
                                                style={{
                                                    padding: '12px 18px',
                                                    borderRadius: '12px',
                                                    border: '0',
                                                    background: activeTab === 'bookings' ? '#09204c' : '#f8fafc',
                                                    color: activeTab === 'bookings' ? '#fff' : '#09204c',
                                                    fontWeight: 600,
                                                    textAlign: 'left',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '12px',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease'
                                                }}
                                            >
                                                <i className="fa-light fa-calendar-check" style={{ color: activeTab === 'bookings' ? '#00c2cb' : '#64748b' }}></i>
                                                My Trips & Bookings
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setActiveTab('profile')}
                                                style={{
                                                    padding: '12px 18px',
                                                    borderRadius: '12px',
                                                    border: '0',
                                                    background: activeTab === 'profile' ? '#09204c' : '#f8fafc',
                                                    color: activeTab === 'profile' ? '#fff' : '#09204c',
                                                    fontWeight: 600,
                                                    textAlign: 'left',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '12px',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease'
                                                }}
                                            >
                                                <i className="fa-light fa-user-gear" style={{ color: activeTab === 'profile' ? '#00c2cb' : '#64748b' }}></i>
                                                Profile Details
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleSignOut}
                                                style={{
                                                    padding: '12px 18px',
                                                    borderRadius: '12px',
                                                    border: '1px solid #fee2e2',
                                                    background: '#fff',
                                                    color: '#dc2626',
                                                    fontWeight: 600,
                                                    textAlign: 'left',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '12px',
                                                    cursor: 'pointer',
                                                    marginTop: '12px'
                                                }}
                                            >
                                                <i className="fa-light fa-arrow-right-from-bracket"></i>
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Content Panel */}
                                <div className="col-lg-8 col-md-12">
                                    {activeTab === 'bookings' && (
                                        <div style={{ background: '#fff', borderRadius: '24px', padding: '36px', boxShadow: '0 10px 30px rgba(9, 32, 76, 0.06)', border: '1px solid #e2e8f0' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                                <div>
                                                    <h3 style={{ margin: '0 0 4px', color: '#09204c', fontSize: '24px', fontWeight: 700 }}>My Bookings & Reservations</h3>
                                                    <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Manage your upcoming vacations, itineraries, and payment status.</p>
                                                </div>
                                                <a href="/tours" className="btn-tour" style={{ padding: '10px 20px', borderRadius: '999px', background: '#00c2cb', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '13px' }}>
                                                    + Book New Tour
                                                </a>
                                            </div>

                                            {customerBookings.length === 0 && (
                                                <div style={{ padding: '40px 20px', textAlign: 'center', color: '#64748b' }}>
                                                    <i className="fa-regular fa-folder-open" style={{ fontSize: '32px', marginBottom: '12px', display: 'block' }}></i>
                                                    <p style={{ margin: 0, fontWeight: 600, color: '#09204c' }}>No bookings yet</p>
                                                    <p style={{ margin: '4px 0 0', fontSize: '14px' }}>Your reservations will appear here once you book a tour.</p>
                                                </div>
                                            )}

                                            {customerBookings.map((b, i) => (
                                                <div key={i} style={{ padding: '20px', borderRadius: '16px', background: '#f8fafc', border: '1px solid #e2e8f0', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                                                        <div>
                                                            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, letterSpacing: '0.5px' }}>BOOKING #{b.bookingId || b.id}</span>
                                                            <h5 style={{ margin: '4px 0 0', color: '#09204c', fontWeight: 700, fontSize: '18px' }}>{b.tour}</h5>
                                                        </div>
                                                        <span style={{
                                                            padding: '4px 12px',
                                                            borderRadius: '999px',
                                                            fontSize: '12px',
                                                            fontWeight: 700,
                                                            background: b.status === 'Confirmed' ? '#dcfce7' : '#fef3c7',
                                                            color: b.status === 'Confirmed' ? '#15803d' : '#b45309'
                                                        }}>
                                                            {b.status}
                                                        </span>
                                                    </div>

                                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', paddingTop: '8px', borderTop: '1px solid #e2e8f0' }}>
                                                        <div>
                                                            <small style={{ color: '#64748b', fontSize: '11px', display: 'block', textTransform: 'uppercase' }}>Departure Date</small>
                                                            <strong style={{ color: '#09204c', fontSize: '13px' }}>{b.departureDate || '—'}</strong>
                                                        </div>
                                                        <div>
                                                            <small style={{ color: '#64748b', fontSize: '11px', display: 'block', textTransform: 'uppercase' }}>Travelers</small>
                                                            <strong style={{ color: '#09204c', fontSize: '13px' }}>{b.travelers || '—'}</strong>
                                                        </div>
                                                        <div>
                                                            <small style={{ color: '#64748b', fontSize: '11px', display: 'block', textTransform: 'uppercase' }}>Total Amount</small>
                                                            <strong style={{ color: '#00aeb6', fontSize: '15px' }}>{b.amount}</strong>
                                                        </div>
                                                        <div>
                                                            <small style={{ color: '#64748b', fontSize: '11px', display: 'block', textTransform: 'uppercase' }}>Payment</small>
                                                            <strong style={{ color: '#09204c', fontSize: '13px' }}>{b.paymentStatus || '—'}</strong>
                                                        </div>
                                                    </div>

                                                    {b.specialRequests && (
                                                        <div style={{ background: '#fff', padding: '10px 14px', borderRadius: '8px', fontSize: '12px', color: '#475569', border: '1px solid #e2e8f0' }}>
                                                            <strong>Special Note:</strong> {b.specialRequests}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {activeTab === 'profile' && (
                                        <div style={{ background: '#fff', borderRadius: '24px', padding: '36px', boxShadow: '0 10px 30px rgba(9, 32, 76, 0.06)', border: '1px solid #e2e8f0' }}>
                                            <h3 style={{ margin: '0 0 4px', color: '#09204c', fontSize: '24px', fontWeight: 700 }}>Personal Information</h3>
                                            <p style={{ margin: '0 0 24px', color: '#64748b', fontSize: '14px' }}>Update your contact preferences for trip updates and vouchers.</p>

                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                                <div>
                                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#09204c', textTransform: 'uppercase', marginBottom: '6px' }}>Full Name</label>
                                                    <input type="text" readOnly value={customerProfile.name} style={{ width: '100%', height: '44px', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', color: '#09204c', fontSize: '14px' }} />
                                                </div>
                                                <div>
                                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#09204c', textTransform: 'uppercase', marginBottom: '6px' }}>Email Address</label>
                                                    <input type="email" readOnly value={customerProfile.email} style={{ width: '100%', height: '44px', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', color: '#09204c', fontSize: '14px' }} />
                                                </div>
                                                <div>
                                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#09204c', textTransform: 'uppercase', marginBottom: '6px' }}>Home City / State</label>
                                                    <input type="text" readOnly value={customerProfile.city} style={{ width: '100%', height: '44px', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', color: '#09204c', fontSize: '14px' }} />
                                                </div>
                                                <div>
                                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#09204c', textTransform: 'uppercase', marginBottom: '6px' }}>Membership Status</label>
                                                    <input type="text" readOnly value={customerProfile.tier} style={{ width: '100%', height: '44px', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', color: '#09204c', fontSize: '14px', fontWeight: 700 }} />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
                <Footer />
            </div>
        </>
    );
}
