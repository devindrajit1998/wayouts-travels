'use client';

import { useState, useEffect } from 'react';
import AdminShell from '../AdminShell';
import {
    getCollectionItems,
    addCollectionItem,
    updateCollectionItem,
    deleteCollectionItem
} from '../../../lib/firestoreService';

const emptyBooking = {
    guest: '',
    email: '',
    phone: '',
    tour: '',
    travelers: 2,
    departureDate: '',
    amount: '',
    paymentStatus: 'Pending',
    bookingDate: '',
    specialRequests: '',
    status: 'Confirmed',
};

export default function AdminBookingsPage() {
    const [bookingsList, setBookingsList] = useState([]);
    const [toursList, setToursList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [modalMode, setModalMode] = useState(null); // 'create' | 'edit' | null
    const [currentBooking, setCurrentBooking] = useState(emptyBooking);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        Promise.all([
            getCollectionItems('bookings'),
            getCollectionItems('tours'),
        ]).then(([bookingsData, toursData]) => {
            if (isMounted) {
                setBookingsList(bookingsData);
                setToursList(toursData);
                setLoading(false);
            }
        }).catch((err) => {
            console.error('Failed to load from Firestore:', err.message);
            if (isMounted) {
                setMessage({ type: 'error', text: 'Failed to load data from Firestore: ' + err.message });
                setLoading(false);
            }
        });
        return () => {
            isMounted = false;
        };
    }, []);

    const filteredBookings = bookingsList.filter((b) => {
        const query = searchTerm.toLowerCase();
        return (
            (b.id || '').toLowerCase().includes(query) ||
            (b.guest || '').toLowerCase().includes(query) ||
            (b.tour || '').toLowerCase().includes(query) ||
            (b.email || '').toLowerCase().includes(query) ||
            (b.phone || '').toLowerCase().includes(query)
        );
    });

    function openCreate() {
        const d = new Date();
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const today = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;

        setCurrentBooking({
            ...emptyBooking,
            id: `WY-${Math.floor(1000 + Math.random() * 9000)}`,
            tour: toursList[0]?.name || '',
            bookingDate: today,
            departureDate: `${d.getDate() + 15} ${months[(d.getMonth() + 1) % 12]} ${d.getFullYear()}`,
        });
        setModalMode('create');
        setMessage(null);
    }

    function openEdit(booking) {
        setCurrentBooking({
            ...emptyBooking,
            ...booking,
        });
        setModalMode('edit');
        setMessage(null);
    }

    async function handleStatusChange(booking, newStatus) {
        try {
            await updateCollectionItem('bookings', booking.id, { status: newStatus });
            setBookingsList((prev) => prev.map((b) => (b.id === booking.id ? { ...b, status: newStatus } : b)));
            setMessage({ type: 'success', text: `Booking ${booking.id} status updated to "${newStatus}".` });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update status: ' + error.message });
        }
    }

    async function handleDelete(booking) {
        if (!window.confirm(`Are you sure you want to delete booking ${booking.id} (${booking.guest})?`)) return;
        try {
            await deleteCollectionItem('bookings', booking.id);
            setBookingsList((prev) => prev.filter((b) => b.id !== booking.id));
            setMessage({ type: 'success', text: `Booking ${booking.id} deleted.` });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to delete booking: ' + error.message });
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            if (modalMode === 'create') {
                const created = await addCollectionItem('bookings', currentBooking);
                setBookingsList((prev) => [created, ...prev]);
                setMessage({ type: 'success', text: `Booking ${currentBooking.id} created successfully.` });
            } else {
                const updated = await updateCollectionItem('bookings', currentBooking.id, currentBooking);
                setBookingsList((prev) => prev.map((b) => (b.id === currentBooking.id ? { ...b, ...updated } : b)));
                setMessage({ type: 'success', text: `Booking ${currentBooking.id} updated successfully.` });
            }
            setModalMode(null);
        } catch (error) {
            alert('Failed to save booking: ' + error.message);
        } finally {
            setSaving(false);
        }
    }

    return (
        <AdminShell
            title="Bookings & Reservations"
            description="Manage client reservations, travel departure dates, payment values in INR (₹), and guest requests."
        >
            {/* Toolbar */}
            <div className="admin-toolbar">
                <input
                    type="search"
                    className="admin-search"
                    placeholder="Search bookings by ID, guest name, tour package, phone…"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="button" className="admin-primary-button" onClick={openCreate}>
                    <i className="fa-light fa-plus"></i> New Reservation
                </button>
            </div>

            {message && <div style={{ marginBottom: '14px' }} className={`admin-hero-message ${message.type}`}>{message.text}</div>}

            {/* Table */}
            {loading ? (
                <div className="admin-card admin-empty">Loading bookings database…</div>
            ) : filteredBookings.length === 0 ? (
                <div className="admin-card admin-empty">
                    <p>No bookings found matching &quot;{searchTerm}&quot;.</p>
                </div>
            ) : (
                <div className="admin-card admin-table-wrap">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Booking ID</th>
                                <th>Guest Details</th>
                                <th>Tour Package</th>
                                <th>Departure Date</th>
                                <th>Amount (₹) / Payment</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBookings.map((b) => (
                                <tr key={b.id}>
                                    <td>
                                        <strong style={{ color: 'var(--admin-primary)', fontFamily: 'monospace', fontSize: '13px' }}>
                                            {b.id}
                                        </strong>
                                        <small style={{ display: 'block', color: 'var(--admin-muted)' }}>Booked: {b.bookingDate || '—'}</small>
                                    </td>
                                    <td>
                                        <div>
                                            <strong>{b.guest}</strong>
                                            <div style={{ fontSize: '12px', color: 'var(--admin-muted)' }}>
                                                {b.phone || b.email} {b.travelers ? `(${b.travelers} Pax)` : ''}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="admin-badge" style={{ background: '#f8fafc', color: '#1e293b' }}>
                                            {b.tour || '—'}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: 600, color: 'var(--admin-ink)', fontSize: '13px' }}>
                                            {b.departureDate || 'TBD'}
                                        </div>
                                    </td>
                                    <td>
                                        <strong style={{ display: 'block', color: 'var(--admin-ink)' }}>{b.amount}</strong>
                                        <span style={{
                                            fontSize: '11px',
                                            fontWeight: 600,
                                            color: b.paymentStatus === 'Paid' ? '#166534' : b.paymentStatus === 'Partially Paid' ? '#ca8a04' : '#dc2626'
                                        }}>
                                            {b.paymentStatus || 'Pending'}
                                        </span>
                                    </td>
                                    <td>
                                        <select
                                            value={b.status || 'Confirmed'}
                                            onChange={(e) => handleStatusChange(b, e.target.value)}
                                            className={`admin-badge ${b.status === 'Confirmed' ? '' : b.status === 'Pending' ? 'pending' : 'cancelled'}`}
                                            style={{
                                                border: '1px solid transparent',
                                                cursor: 'pointer',
                                                fontWeight: 600,
                                                outline: 'none',
                                                appearance: 'auto',
                                                padding: '3px 8px',
                                                borderRadius: '16px',
                                            }}
                                            title="Click to change status"
                                        >
                                            <option value="Confirmed">Confirmed</option>
                                            <option value="Pending">Pending</option>
                                            <option value="Completed">Completed</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                                            <button
                                                type="button"
                                                className="admin-upload-btn"
                                                style={{ height: '30px', padding: '0 10px' }}
                                                onClick={() => openEdit(b)}
                                                title="Edit Reservation"
                                            >
                                                <i className="fa-light fa-pen-to-square"></i> Edit
                                            </button>
                                            <button
                                                type="button"
                                                className="admin-upload-btn"
                                                style={{ height: '30px', padding: '0 10px', color: '#dc2626', borderColor: '#fecaca' }}
                                                onClick={() => handleDelete(b)}
                                                title="Delete Reservation"
                                            >
                                                <i className="fa-light fa-trash-can"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Create / Edit Modal */}
            {modalMode && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(9, 32, 76, 0.65)', zIndex: 2000, display: 'grid', placeItems: 'center', padding: '20px', overflowY: 'auto' }}>
                    <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', width: 'min(720px, 100%)', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 60px rgba(0,0,0,0.3)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--admin-line)', paddingBottom: '12px', marginBottom: '16px' }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--admin-ink)' }}>
                                    {modalMode === 'create' ? 'Create Reservation' : `Edit Booking: ${currentBooking.id}`}
                                </h3>
                                <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--admin-muted)' }}>
                                    Configure guest details, selected tour, departure dates, and payment values in INR.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setModalMode(null)}
                                style={{ border: 0, background: 'transparent', cursor: 'pointer', fontSize: '20px', color: 'var(--admin-muted)' }}
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
                            <div className="admin-form-grid">
                                <div className="admin-form-field">
                                    <label>Booking Reference ID *</label>
                                    <input
                                        required
                                        value={currentBooking.id}
                                        onChange={(e) => setCurrentBooking({ ...currentBooking, id: e.target.value })}
                                        placeholder="e.g. WY-1049"
                                    />
                                </div>
                                <div className="admin-form-field">
                                    <label>Guest Full Name *</label>
                                    <input
                                        required
                                        value={currentBooking.guest}
                                        onChange={(e) => setCurrentBooking({ ...currentBooking, guest: e.target.value })}
                                        placeholder="e.g. Aarav Sharma"
                                    />
                                </div>
                                <div className="admin-form-field">
                                    <label>Email Address *</label>
                                    <input
                                        type="email"
                                        required
                                        value={currentBooking.email}
                                        onChange={(e) => setCurrentBooking({ ...currentBooking, email: e.target.value })}
                                        placeholder="guest@example.com"
                                    />
                                </div>
                                <div className="admin-form-field">
                                    <label>Phone / WhatsApp Number</label>
                                    <input
                                        value={currentBooking.phone}
                                        onChange={(e) => setCurrentBooking({ ...currentBooking, phone: e.target.value })}
                                        placeholder="+91 98201 23456"
                                    />
                                </div>
                                <div className="admin-form-field">
                                    <label>Tour Package *</label>
                                    <select
                                        value={currentBooking.tour}
                                        onChange={(e) => setCurrentBooking({ ...currentBooking, tour: e.target.value })}
                                    >
                                        <option value="">-- Select Tour Package --</option>
                                        {toursList.map((t) => (
                                            <option key={t.id || t.name} value={t.name}>
                                                {t.name}{t.price ? ` (${t.price})` : ''}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="admin-form-field">
                                    <label>Number of Travelers (Pax)</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={currentBooking.travelers}
                                        onChange={(e) => setCurrentBooking({ ...currentBooking, travelers: parseInt(e.target.value) || 1 })}
                                    />
                                </div>
                                <div className="admin-form-field">
                                    <label>Departure Date</label>
                                    <input
                                        value={currentBooking.departureDate}
                                        onChange={(e) => setCurrentBooking({ ...currentBooking, departureDate: e.target.value })}
                                        placeholder="e.g. 15 Sep 2026"
                                    />
                                </div>
                                <div className="admin-form-field">
                                    <label>Total Value in INR (₹) *</label>
                                    <input
                                        required
                                        value={currentBooking.amount}
                                        onChange={(e) => setCurrentBooking({ ...currentBooking, amount: e.target.value })}
                                        placeholder="e.g. ₹49,998"
                                    />
                                </div>
                                <div className="admin-form-field">
                                    <label>Payment Status</label>
                                    <select
                                        value={currentBooking.paymentStatus}
                                        onChange={(e) => setCurrentBooking({ ...currentBooking, paymentStatus: e.target.value })}
                                    >
                                        <option value="Paid">Paid / Cleared</option>
                                        <option value="Partially Paid">Partially Paid / Deposit</option>
                                        <option value="Pending">Payment Pending</option>
                                        <option value="Refunded">Refunded</option>
                                    </select>
                                </div>
                                <div className="admin-form-field">
                                    <label>Booking Status</label>
                                    <select
                                        value={currentBooking.status}
                                        onChange={(e) => setCurrentBooking({ ...currentBooking, status: e.target.value })}
                                    >
                                        <option value="Confirmed">Confirmed</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </div>
                            </div>

                            <div className="admin-form-field full">
                                <label>Special Requests & Dietary Requirements</label>
                                <textarea
                                    rows="3"
                                    value={currentBooking.specialRequests}
                                    onChange={(e) => setCurrentBooking({ ...currentBooking, specialRequests: e.target.value })}
                                    placeholder="e.g. Vegetarian meal preferences, airport pickup arrival flight number, anniversary room decoration..."
                                />
                            </div>

                            {/* Modal Footer */}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid var(--admin-line)', paddingTop: '16px', marginTop: '8px' }}>
                                <button
                                    type="button"
                                    onClick={() => setModalMode(null)}
                                    className="admin-upload-btn"
                                    disabled={saving}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="admin-primary-button"
                                    disabled={saving}
                                >
                                    {saving ? 'Saving…' : modalMode === 'create' ? 'Create Booking' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminShell>
    );
}
