'use client';

import { useState, useEffect } from 'react';
import AdminShell from '../AdminShell';
import {
    getCollectionItems,
    addCollectionItem,
    updateCollectionItem,
    deleteCollectionItem
} from '../../../lib/firestoreService';

const emptySubscriber = {
    email: '',
    source: 'Manual Admin Entry',
    date: '',
    city: '',
    status: 'Subscribed',
};

export default function AdminSubscribersPage() {
    const [subscribersList, setSubscribersList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [modalMode, setModalMode] = useState(null); // 'create' | 'edit' | null
    const [currentSub, setCurrentSub] = useState(emptySubscriber);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        getCollectionItems('subscribers').then((data) => {
            if (isMounted) {
                setSubscribersList(data);
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

    const filteredSubscribers = subscribersList.filter((s) => {
        const query = searchTerm.toLowerCase();
        return (
            (s.email || '').toLowerCase().includes(query) ||
            (s.source || '').toLowerCase().includes(query) ||
            (s.city || '').toLowerCase().includes(query)
        );
    });

    function openCreate() {
        const d = new Date();
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const today = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;

        setCurrentSub({
            ...emptySubscriber,
            id: `sub-${Date.now()}`,
            date: today,
        });
        setModalMode('create');
        setMessage(null);
    }

    function openEdit(sub) {
        setCurrentSub({
            ...emptySubscriber,
            ...sub,
        });
        setModalMode('edit');
        setMessage(null);
    }

    async function handleStatusChange(sub, newStatus) {
        try {
            await updateCollectionItem('subscribers', sub.id, { status: newStatus });
            setSubscribersList((prev) => prev.map((s) => (s.id === sub.id ? { ...s, status: newStatus } : s)));
            setMessage({ type: 'success', text: `Subscriber "${sub.email}" marked as "${newStatus}".` });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update status: ' + error.message });
        }
    }

    async function handleDelete(sub) {
        if (!window.confirm(`Are you sure you want to remove "${sub.email}" from subscribers?`)) return;
        try {
            await deleteCollectionItem('subscribers', sub.id);
            setSubscribersList((prev) => prev.filter((s) => s.id !== sub.id));
            setMessage({ type: 'success', text: `Subscriber "${sub.email}" removed.` });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to remove subscriber: ' + error.message });
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            if (modalMode === 'create') {
                const created = await addCollectionItem('subscribers', currentSub);
                setSubscribersList((prev) => [created, ...prev]);
                setMessage({ type: 'success', text: `Subscriber "${currentSub.email}" added successfully.` });
            } else {
                const updated = await updateCollectionItem('subscribers', currentSub.id, currentSub);
                setSubscribersList((prev) => prev.map((s) => (s.id === currentSub.id ? { ...s, ...updated } : s)));
                setMessage({ type: 'success', text: `Subscriber updated successfully.` });
            }
            setModalMode(null);
        } catch (error) {
            alert('Failed to save subscriber: ' + error.message);
        } finally {
            setSaving(false);
        }
    }

    function handleExportCSV() {
        const rows = [
            ['Email Address', 'Acquisition Source', 'Location', 'Subscription Date', 'Status'],
            ...filteredSubscribers.map((s) => [s.email, s.source, s.city || '', s.date, s.status])
        ];
        const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `wayouts_subscribers_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <AdminShell
            title="Newsletter Leads & Subscribers"
            description="Manage newsletter subscribers, lead generation sources, broadcast status, and CSV export."
        >
            {/* Toolbar */}
            <div className="admin-toolbar">
                <input
                    type="search"
                    className="admin-search"
                    placeholder="Search subscribers by email, source, city…"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button type="button" className="admin-upload-btn" onClick={handleExportCSV}>
                        <i className="fa-light fa-file-arrow-down"></i> Export CSV
                    </button>
                    <button type="button" className="admin-primary-button" onClick={openCreate}>
                        <i className="fa-light fa-plus"></i> Add Subscriber
                    </button>
                </div>
            </div>

            {message && <div style={{ marginBottom: '14px' }} className={`admin-hero-message ${message.type}`}>{message.text}</div>}

            {/* Table */}
            {loading ? (
                <div className="admin-card admin-empty">Loading subscribers database…</div>
            ) : filteredSubscribers.length === 0 ? (
                <div className="admin-card admin-empty">
                    <p>No subscribers found matching &quot;{searchTerm}&quot;.</p>
                </div>
            ) : (
                <div className="admin-card admin-table-wrap">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Subscriber Email</th>
                                <th>Acquisition Source</th>
                                <th>Location</th>
                                <th>Subscription Date</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSubscribers.map((sub) => (
                                <tr key={sub.id || sub.email}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <i className="fa-light fa-envelope" style={{ color: 'var(--admin-primary)', fontSize: '15px' }}></i>
                                            <strong style={{ fontSize: '13px' }}>{sub.email}</strong>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="admin-badge" style={{ background: '#f8fafc', color: '#1e293b' }}>
                                            {sub.source || '—'}
                                        </span>
                                    </td>
                                    <td>
                                        <span style={{ fontSize: '12px', color: 'var(--admin-ink)' }}>{sub.city || '—'}</span>
                                    </td>
                                    <td>
                                        <small style={{ color: 'var(--admin-muted)' }}>{sub.date}</small>
                                    </td>
                                    <td>
                                        <select
                                            value={sub.status || 'Subscribed'}
                                            onChange={(e) => handleStatusChange(sub, e.target.value)}
                                            className={`admin-badge ${sub.status === 'Subscribed' ? '' : 'cancelled'}`}
                                            style={{
                                                border: '1px solid transparent',
                                                cursor: 'pointer',
                                                fontWeight: 600,
                                                outline: 'none',
                                                appearance: 'auto',
                                                padding: '3px 8px',
                                                borderRadius: '16px',
                                            }}
                                            title="Click to toggle status"
                                        >
                                            <option value="Subscribed">Subscribed / Active</option>
                                            <option value="Unsubscribed">Unsubscribed</option>
                                        </select>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                                            <button
                                                type="button"
                                                className="admin-upload-btn"
                                                style={{ height: '30px', padding: '0 10px' }}
                                                onClick={() => openEdit(sub)}
                                                title="Edit Subscriber"
                                            >
                                                <i className="fa-light fa-pen-to-square"></i> Edit
                                            </button>
                                            <button
                                                type="button"
                                                className="admin-upload-btn"
                                                style={{ height: '30px', padding: '0 10px', color: '#dc2626', borderColor: '#fecaca' }}
                                                onClick={() => handleDelete(sub)}
                                                title="Remove Subscriber"
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
                    <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', width: 'min(600px, 100%)', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 60px rgba(0,0,0,0.3)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--admin-line)', paddingBottom: '12px', marginBottom: '16px' }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--admin-ink)' }}>
                                    {modalMode === 'create' ? 'Add Subscriber' : `Edit: ${currentSub.email}`}
                                </h3>
                                <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--admin-muted)' }}>
                                    Configure subscriber email, source channel, and newsletter broadcast status.
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
                            <div className="admin-form-field full">
                                <label>Email Address *</label>
                                <input
                                    type="email"
                                    required
                                    value={currentSub.email}
                                    onChange={(e) => setCurrentSub({ ...currentSub, email: e.target.value })}
                                    placeholder="traveler@example.com"
                                />
                            </div>

                            <div className="admin-form-grid">
                                <div className="admin-form-field">
                                    <label>Acquisition Source</label>
                                    <select
                                        value={currentSub.source}
                                        onChange={(e) => setCurrentSub({ ...currentSub, source: e.target.value })}
                                    >
                                        <option value="Homepage Footer">Homepage Footer</option>
                                        <option value="Blog Newsletter Box">Blog Newsletter Box</option>
                                        <option value="Destination Guide Popup">Destination Guide Popup</option>
                                        <option value="Tour Deals Banner">Tour Deals Banner</option>
                                        <option value="Manual Admin Entry">Manual Admin Entry</option>
                                    </select>
                                </div>
                                <div className="admin-form-field">
                                    <label>Location / City</label>
                                    <input
                                        value={currentSub.city}
                                        onChange={(e) => setCurrentSub({ ...currentSub, city: e.target.value })}
                                        placeholder="e.g. Mumbai, India"
                                    />
                                </div>
                                <div className="admin-form-field">
                                    <label>Subscription Status</label>
                                    <select
                                        value={currentSub.status}
                                        onChange={(e) => setCurrentSub({ ...currentSub, status: e.target.value })}
                                    >
                                        <option value="Subscribed">Subscribed / Active</option>
                                        <option value="Unsubscribed">Unsubscribed</option>
                                    </select>
                                </div>
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
                                    {saving ? 'Saving…' : modalMode === 'create' ? 'Add Subscriber' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminShell>
    );
}
