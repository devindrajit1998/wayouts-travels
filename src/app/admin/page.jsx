'use client';

import { useState, useEffect } from 'react';
import AdminShell from './AdminShell';
import { getCollectionItems } from '../../lib/firestoreService';

export default function AdminDashboard() {
    const [bookingsList, setBookingsList] = useState([]);
    const [toursList, setToursList] = useState([]);
    const [customersCount, setCustomersCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(null);

    useEffect(() => {
        let isMounted = true;
        Promise.all([
            getCollectionItems('bookings'),
            getCollectionItems('tours'),
            getCollectionItems('customers')
        ]).then(([bookingsData, toursData, customersData]) => {
            if (isMounted) {
                setBookingsList(Array.isArray(bookingsData) ? bookingsData : []);
                setToursList(Array.isArray(toursData) ? toursData : []);
                setCustomersCount(Array.isArray(customersData) ? customersData.length : 0);
                setLoading(false);
            }
        }).catch((err) => {
            console.error('Failed to load dashboard data from Firestore:', err.message);
            if (isMounted) {
                setLoadError(err);
                setLoading(false);
            }
        });
        return () => {
            isMounted = false;
        };
    }, []);

    // Calculate total live revenue from bookings
    const totalRevenue = bookingsList.reduce((acc, curr) => {
        const cleaned = (curr.amount || '').toString().replace(/[^0-9]/g, '');
        const num = parseInt(cleaned, 10) || 0;
        return acc + num;
    }, 0);

    const formattedRevenue = `₹${totalRevenue.toLocaleString('en-IN')}`;

    if (loading) {
        return (
            <AdminShell title="Operations Dashboard" description="Live overview of bookings, active tours, and traveler metrics.">
                <div className="admin-card admin-empty">Loading dashboard data from Firestore…</div>
            </AdminShell>
        );
    }

    if (loadError) {
        return (
            <AdminShell title="Operations Dashboard" description="Live overview of bookings, active tours, and traveler metrics.">
                <div className="admin-card admin-empty">
                    <p>Failed to load dashboard data from Firestore: {loadError.message}</p>
                    <p style={{ fontSize: '13px' }}>Please verify your Firebase connection and reload this page.</p>
                </div>
            </AdminShell>
        );
    }

    return (
        <AdminShell title="Operations Dashboard" description="Live overview of bookings, active tours, and traveler metrics.">
            <div className="admin-grid stats">
                <div className="admin-card admin-stat">
                    <div>
                        <span className="admin-stat-label">Total Revenue</span>
                        <strong className="admin-stat-value">{formattedRevenue}</strong>
                        <span className="admin-stat-change"><i className="fa-light fa-arrow-trend-up"></i> Live calculation</span>
                    </div>
                    <span className="admin-stat-icon"><i className="fa-light fa-chart-line"></i></span>
                </div>
                <div className="admin-card admin-stat">
                    <div>
                        <span className="admin-stat-label">Total Bookings</span>
                        <strong className="admin-stat-value">{bookingsList.length}</strong>
                        <span className="admin-stat-change"><i className="fa-light fa-arrow-trend-up"></i> Active reservations</span>
                    </div>
                    <span className="admin-stat-icon"><i className="fa-light fa-calendar-check"></i></span>
                </div>
                <div className="admin-card admin-stat">
                    <div>
                        <span className="admin-stat-label">Registered Travelers</span>
                        <strong className="admin-stat-value">{customersCount}</strong>
                        <span className="admin-stat-change"><i className="fa-light fa-users"></i> Firestore customers</span>
                    </div>
                    <span className="admin-stat-icon"><i className="fa-light fa-users"></i></span>
                </div>
                <div className="admin-card admin-stat">
                    <div>
                        <span className="admin-stat-label">Active Tour Packages</span>
                        <strong className="admin-stat-value">{toursList.length}</strong>
                        <span className="admin-stat-change"><i className="fa-light fa-sparkles"></i> Domestic catalog</span>
                    </div>
                    <span className="admin-stat-icon"><i className="fa-light fa-route"></i></span>
                </div>
            </div>

            <div className="admin-grid two">
                <div className="admin-card">
                    <div className="admin-card-title">
                        <h2>Revenue Growth</h2>
                        <a href="/admin/bookings">View bookings <i className="fa-light fa-arrow-up-right"></i></a>
                    </div>
                    <div className="admin-chart">
                        {bookingsList.length === 0 && (
                            <p style={{ color: 'var(--admin-muted)', padding: '12px 0', fontSize: '13px' }}>No bookings in Firestore yet — revenue chart unavailable.</p>
                        )}
                        {bookingsList.slice(0, 12).map((booking, index) => {
                            const cleaned = (booking.amount || '').toString().replace(/[^0-9]/g, '');
                            const num = parseInt(cleaned, 10) || 0;
                            const max = Math.max(...bookingsList.map((b) => {
                                const c = (b.amount || '').toString().replace(/[^0-9]/g, '');
                                return parseInt(c, 10) || 0;
                            }), 1);
                            return <span className="admin-bar" style={{ height: `${Math.max((num / max) * 100, 4)}%` }} key={booking.id || index} title={`${booking.id || 'Booking'}: ${booking.amount || '—'}`}></span>;
                        })}
                    </div>
                    {bookingsList.length > 0 && (
                        <div className="admin-chart-labels">
                            <span>Latest</span><span>→</span><span>Oldest</span>
                        </div>
                    )}
                </div>
                <div className="admin-card">
                    <div className="admin-card-title">
                        <h2>Catalog Tours</h2>
                        <a href="/admin/tours">View all</a>
                    </div>
                    <div className="admin-list">
                        {toursList.length === 0 && !loading && (
                            <p style={{ color: 'var(--admin-muted)', padding: '12px 0', fontSize: '13px' }}>No tours in Firestore. Click &quot;View all&quot; to add.</p>
                        )}
                        {toursList.slice(0, 4).map((tour, idx) => (
                            <div className="admin-list-item" key={tour.id || idx}>
                                <div className="admin-list-main">
                                    {tour.image && <img className="admin-thumb" src={tour.image} alt="" />}
                                    <div>
                                        <strong>{tour.name || tour.title}</strong>
                                        <span>{tour.destination || tour.location}</span>
                                    </div>
                                </div>
                                <span className="admin-price">{tour.price}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="admin-card admin-dashboard-bookings">
                <div className="admin-card-title">
                    <h2>Recent Bookings</h2>
                    <a href="/admin/bookings">See all bookings <i className="fa-light fa-arrow-up-right"></i></a>
                </div>
                <div className="admin-table-wrap">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Booking ID</th>
                                <th>Guest / Email</th>
                                <th>Tour Package</th>
                                <th>Departure</th>
                                <th>Amount</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookingsList.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '24px', color: 'var(--admin-muted)' }}>
                                        No bookings recorded yet.
                                    </td>
                                </tr>
                            )}
                            {bookingsList.slice(0, 6).map((booking, idx) => (
                                <tr key={booking.id || idx}>
                                    <td><strong>{booking.bookingId || booking.id}</strong></td>
                                    <td>{booking.customer || booking.name || booking.guest || booking.email}</td>
                                    <td>{booking.tour}</td>
                                    <td>{booking.departureDate || booking.date}</td>
                                    <td><strong style={{ color: 'var(--admin-primary)' }}>{booking.amount}</strong></td>
                                    <td>
                                        <span className={`admin-badge ${booking.status === 'Confirmed' ? '' : booking.status === 'Pending' ? 'pending' : 'cancelled'}`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminShell>
    );
}
