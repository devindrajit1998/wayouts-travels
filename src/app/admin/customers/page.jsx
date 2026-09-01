'use client';

import { useState, useEffect } from 'react';
import AdminShell from '../AdminShell';
import {
    getCollectionItems,
    addCollectionItem,
    updateCollectionItem,
    deleteCollectionItem
} from '../../../lib/firestoreService';

const emptyCustomer = {
    name: '',
    email: '',
    phone: '',
    city: '',
    trips: 0,
    spent: '',
    joined: '',
    tier: '',
    status: 'Active',
    notes: '',
};

export default function AdminCustomersPage() {
    const [customersList, setCustomersList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [modalMode, setModalMode] = useState(null); // 'create' | 'edit' | null
    const [currentCustomer, setCurrentCustomer] = useState(emptyCustomer);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        getCollectionItems('customers').then((data) => {
            if (isMounted) {
                setCustomersList(data);
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

    const filteredCustomers = customersList.filter((c) => {
        const query = searchTerm.toLowerCase();
        return (
            (c.name || '').toLowerCase().includes(query) ||
            (c.email || '').toLowerCase().includes(query) ||
            (c.phone || '').toLowerCase().includes(query) ||
            (c.city || '').toLowerCase().includes(query) ||
            (c.tier || '').toLowerCase().includes(query)
        );
    });

    function getInitials(name) {
        return (name || '')
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2) || 'C';
    }

    function openCreate() {
        const d = new Date();
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const today = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;

        setCurrentCustomer({
            ...emptyCustomer,
            id: `cust-${Date.now()}`,
            joined: today,
        });
        setModalMode('create');
        setMessage(null);
    }

    function openEdit(customer) {
        setCurrentCustomer({
            ...emptyCustomer,
            ...customer,
        });
        setModalMode('edit');
        setMessage(null);
    }

    async function handleStatusChange(customer, newStatus) {
        try {
            await updateCollectionItem('customers', customer.id, { status: newStatus });
            setCustomersList((prev) => prev.map((c) => (c.id === customer.id ? { ...c, status: newStatus } : c)));
            setMessage({ type: 'success', text: `Customer "${customer.name}" status updated to "${newStatus}".` });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update status: ' + error.message });
        }
    }

    async function handleDelete(customer) {
        if (!window.confirm(`Are you sure you want to delete profile for "${customer.name}"?`)) return;
        try {
            await deleteCollectionItem('customers', customer.id);
            setCustomersList((prev) => prev.filter((c) => c.id !== customer.id));
            setMessage({ type: 'success', text: `Customer "${customer.name}" deleted.` });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to delete customer: ' + error.message });
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            if (modalMode === 'create') {
                const created = await addCollectionItem('customers', currentCustomer);
                setCustomersList((prev) => [created, ...prev]);
                setMessage({ type: 'success', text: `Customer profile for "${currentCustomer.name}" created.` });
            } else {
                const updated = await updateCollectionItem('customers', currentCustomer.id, currentCustomer);
                setCustomersList((prev) => prev.map((c) => (c.id === currentCustomer.id ? { ...c, ...updated } : c)));
                setMessage({ type: 'success', text: `Customer "${currentCustomer.name}" updated successfully.` });
            }
            setModalMode(null);
        } catch (error) {
            alert('Failed to save customer: ' + error.message);
        } finally {
            setSaving(false);
        }
    }

    return (
        <AdminShell
            title="Traveler Customer Accounts"
            description="Manage client profiles, booking histories, lifetime trip expenditures in INR, and membership tiers."
        >
            {/* Toolbar */}
            <div className="admin-toolbar">
                <input
                    type="search"
                    className="admin-search"
                    placeholder="Search customers by name, email, city, tier…"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="button" className="admin-primary-button" onClick={openCreate}>
                    <i className="fa-light fa-user-plus"></i> Add New Customer
                </button>
            </div>

            {message && <div style={{ marginBottom: '14px' }} className={`admin-hero-message ${message.type}`}>{message.text}</div>}

            {/* Table */}
            {loading ? (
                <div className="admin-card admin-empty">Loading customer database…</div>
            ) : filteredCustomers.length === 0 ? (
                <div className="admin-card admin-empty">
                    <p>No customers found matching &quot;{searchTerm}&quot;.</p>
                </div>
            ) : (
                <div className="admin-card admin-table-wrap">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Traveler Profile</th>
                                <th>City / State</th>
                                <th>Membership Tier</th>
                                <th>Trips / Lifetime Spend</th>
                                <th>Member Since</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCustomers.map((cust) => (
                                <tr key={cust.id || cust.email}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{
                                                width: '38px',
                                                height: '38px',
                                                borderRadius: '50%',
                                                background: 'linear-gradient(135deg, #09204c, #00aeb6)',
                                                color: '#fff',
                                                display: 'grid',
                                                placeItems: 'center',
                                                fontSize: '13px',
                                                fontWeight: 700
                                            }}>
                                                {getInitials(cust.name)}
                                            </div>
                                            <div>
                                                <strong>{cust.name}</strong>
                                                <small style={{ display: 'block', color: 'var(--admin-muted)' }}>{cust.email}</small>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ fontSize: '13px', color: 'var(--admin-ink)' }}>{cust.city}</div>
                                        <small style={{ color: 'var(--admin-muted)' }}>{cust.phone}</small>
                                    </td>
                                    <td>
                                        <span className="admin-badge" style={{
                                            background: cust.tier?.includes('VIP') ? '#fef3c7' : cust.tier?.includes('Platinum') ? '#f3e8ff' : '#ecfeff',
                                            color: cust.tier?.includes('VIP') ? '#92400e' : cust.tier?.includes('Platinum') ? '#6b21a8' : '#0e7490',
                                            border: '1px solid transparent'
                                        }}>
                                            {cust.tier || '—'}
                                        </span>
                                    </td>
                                    <td>
                                        <strong style={{ display: 'block', color: 'var(--admin-ink)' }}>{cust.spent}</strong>
                                        <small style={{ color: 'var(--admin-muted)' }}>{cust.trips || 0} Tours Completed</small>
                                    </td>
                                    <td>
                                        <small style={{ color: 'var(--admin-muted)' }}>{cust.joined}</small>
                                    </td>
                                    <td>
                                        <select
                                            value={cust.status || 'Active'}
                                            onChange={(e) => handleStatusChange(cust, e.target.value)}
                                            className={`admin-badge ${cust.status === 'Active' ? '' : 'pending'}`}
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
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                            <option value="Blocked">Blocked</option>
                                        </select>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                                            <button
                                                type="button"
                                                className="admin-upload-btn"
                                                style={{ height: '30px', padding: '0 10px' }}
                                                onClick={() => openEdit(cust)}
                                                title="Edit Customer"
                                            >
                                                <i className="fa-light fa-pen-to-square"></i> Edit
                                            </button>
                                            <button
                                                type="button"
                                                className="admin-upload-btn"
                                                style={{ height: '30px', padding: '0 10px', color: '#dc2626', borderColor: '#fecaca' }}
                                                onClick={() => handleDelete(cust)}
                                                title="Delete Customer"
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
                    <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', width: 'min(700px, 100%)', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 60px rgba(0,0,0,0.3)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--admin-line)', paddingBottom: '12px', marginBottom: '16px' }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--admin-ink)' }}>
                                    {modalMode === 'create' ? 'Add Customer Profile' : `Edit Profile: ${currentCustomer.name}`}
                                </h3>
                                <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--admin-muted)' }}>
                                    Configure traveler contact info, tier status, lifetime expenditure, and internal travel notes.
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
                                    <label>Customer Full Name *</label>
                                    <input
                                        required
                                        value={currentCustomer.name}
                                        onChange={(e) => setCurrentCustomer({ ...currentCustomer, name: e.target.value })}
                                        placeholder="e.g. Aarav Sharma"
                                    />
                                </div>
                                <div className="admin-form-field">
                                    <label>Email Address *</label>
                                    <input
                                        type="email"
                                        required
                                        value={currentCustomer.email}
                                        onChange={(e) => setCurrentCustomer({ ...currentCustomer, email: e.target.value })}
                                        placeholder="aarav@example.com"
                                    />
                                </div>
                                <div className="admin-form-field">
                                    <label>Phone / WhatsApp Number</label>
                                    <input
                                        value={currentCustomer.phone}
                                        onChange={(e) => setCurrentCustomer({ ...currentCustomer, phone: e.target.value })}
                                        placeholder="+91 98201 23456"
                                    />
                                </div>
                                <div className="admin-form-field">
                                    <label>City & State</label>
                                    <input
                                        value={currentCustomer.city}
                                        onChange={(e) => setCurrentCustomer({ ...currentCustomer, city: e.target.value })}
                                        placeholder="e.g. Mumbai, Maharashtra"
                                    />
                                </div>
                                <div className="admin-form-field">
                                    <label>Membership Tier</label>
                                    <select
                                        value={currentCustomer.tier}
                                        onChange={(e) => setCurrentCustomer({ ...currentCustomer, tier: e.target.value })}
                                    >
                                        <option value="Silver Member">Silver Member</option>
                                        <option value="Gold Member">Gold Member</option>
                                        <option value="Platinum Member">Platinum Member</option>
                                        <option value="VIP Elite">VIP Elite</option>
                                    </select>
                                </div>
                                <div className="admin-form-field">
                                    <label>Trips Completed</label>
                                    <input
                                        type="number"
                                        value={currentCustomer.trips}
                                        onChange={(e) => setCurrentCustomer({ ...currentCustomer, trips: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                                <div className="admin-form-field">
                                    <label>Lifetime Spent in INR (₹)</label>
                                    <input
                                        value={currentCustomer.spent}
                                        onChange={(e) => setCurrentCustomer({ ...currentCustomer, spent: e.target.value })}
                                        placeholder="e.g. ₹1,98,400"
                                    />
                                </div>
                                <div className="admin-form-field">
                                    <label>Account Status</label>
                                    <select
                                        value={currentCustomer.status}
                                        onChange={(e) => setCurrentCustomer({ ...currentCustomer, status: e.target.value })}
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                        <option value="Blocked">Blocked</option>
                                    </select>
                                </div>
                            </div>

                            <div className="admin-form-field full">
                                <label>Internal Agency Notes & Travel Preferences</label>
                                <textarea
                                    rows="3"
                                    value={currentCustomer.notes}
                                    onChange={(e) => setCurrentCustomer({ ...currentCustomer, notes: e.target.value })}
                                    placeholder="e.g. Likes mountain views, travels during Diwali holidays, prefers 5-star properties..."
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
                                    {saving ? 'Saving…' : modalMode === 'create' ? 'Create Customer' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminShell>
    );
}
