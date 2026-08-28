'use client';

import { useState, useEffect } from 'react';
import AdminShell from '../AdminShell';
import {
    getCollectionItems,
    addCollectionItem,
    updateCollectionItem,
    deleteCollectionItem
} from '../../../lib/firestoreService';

const initialInquiries = [
    {
        id: 'inq-1',
        from: 'Rajesh Nair',
        email: 'rajesh.nair@example.com',
        phone: '+91 98401 55667',
        subject: 'Custom family package for Kashmir in October',
        channel: 'Website Form',
        date: '27 Aug 2026',
        travelers: '4 Adults, 1 Child',
        budget: '₹1,50,000 - ₹2,000,000',
        message: 'Looking for a 6N/7D trip covering Srinagar, Gulmarg, and Pahalgam with 4-star hotels and private Innova Crysta.',
        status: 'New',
    },
    {
        id: 'inq-2',
        from: 'Sunita Menon',
        email: 'sunita.m@example.com',
        phone: '+91 98230 44556',
        subject: 'Kerala honeymoon package with luxury houseboat',
        channel: 'WhatsApp Inquiry',
        date: '26 Aug 2026',
        travelers: '2 Adults',
        budget: '₹80,000 - ₹1,20,000',
        message: 'Need a honeymoon package with private pool villa in Munnar and 1 night on a luxury Alleppey houseboat.',
        status: 'Replied',
    },
    {
        id: 'inq-3',
        from: 'Amitabh Choudhary',
        email: 'amitabh.c@example.com',
        phone: '+91 98100 99887',
        subject: 'Corporate group tour to Rajasthan',
        channel: 'Email Direct',
        date: '25 Aug 2026',
        travelers: '18 Adults',
        budget: '₹8,00,000+',
        message: 'Organizing annual executive retreat in Jaipur and Udaipur. Need conference room facilities and gala dinner.',
        status: 'In Progress',
    },
    {
        id: 'inq-4',
        from: 'Divya Patel',
        email: 'divya.patel@example.com',
        phone: '+91 97250 11234',
        subject: 'Scuba diving & stay at Andaman',
        channel: 'Website Form',
        date: '24 Aug 2026',
        travelers: '2 Adults',
        budget: '₹90,000',
        message: 'Inquiring about Havelock Island scuba diving certification and 5 nights beach resort package.',
        status: 'Closed',
    },
];

const emptyInquiry = {
    from: '',
    email: '',
    phone: '',
    subject: '',
    channel: 'Website Form',
    date: '28 Aug 2026',
    travelers: '2 Adults',
    budget: '₹50,000 - ₹1,00,000',
    message: '',
    status: 'New',
};

export default function AdminInquiriesPage() {
    const [inquiriesList, setInquiriesList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [modalMode, setModalMode] = useState(null); // 'create' | 'edit' | null
    const [currentInquiry, setCurrentInquiry] = useState(emptyInquiry);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        getCollectionItems('inquiries', initialInquiries).then((data) => {
            if (isMounted) {
                setInquiriesList(data);
                setLoading(false);
            }
        });
        return () => {
            isMounted = false;
        };
    }, []);

    const filteredInquiries = inquiriesList.filter((i) => {
        const query = searchTerm.toLowerCase();
        return (
            (i.from || '').toLowerCase().includes(query) ||
            (i.subject || '').toLowerCase().includes(query) ||
            (i.email || '').toLowerCase().includes(query) ||
            (i.phone || '').toLowerCase().includes(query) ||
            (i.channel || '').toLowerCase().includes(query)
        );
    });

    function openCreate() {
        const d = new Date();
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const today = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;

        setCurrentInquiry({
            ...emptyInquiry,
            id: `inq-${Date.now()}`,
            date: today,
        });
        setModalMode('create');
        setMessage(null);
    }

    function openEdit(inquiry) {
        setCurrentInquiry({
            ...emptyInquiry,
            ...inquiry,
        });
        setModalMode('edit');
        setMessage(null);
    }

    async function handleStatusChange(inquiry, newStatus) {
        try {
            await updateCollectionItem('inquiries', inquiry.id, { status: newStatus });
            setInquiriesList((prev) => prev.map((i) => (i.id === inquiry.id ? { ...i, status: newStatus } : i)));
            setMessage({ type: 'success', text: `Inquiry status updated to "${newStatus}".` });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update status: ' + error.message });
        }
    }

    async function handleDelete(inquiry) {
        if (!window.confirm(`Are you sure you want to delete inquiry from "${inquiry.from}"?`)) return;
        try {
            await deleteCollectionItem('inquiries', inquiry.id);
            setInquiriesList((prev) => prev.filter((i) => i.id !== inquiry.id));
            setMessage({ type: 'success', text: `Inquiry from "${inquiry.from}" deleted.` });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to delete inquiry: ' + error.message });
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            if (modalMode === 'create') {
                const created = await addCollectionItem('inquiries', currentInquiry);
                setInquiriesList((prev) => [created, ...prev]);
                setMessage({ type: 'success', text: `Inquiry from "${currentInquiry.from}" recorded.` });
            } else {
                const updated = await updateCollectionItem('inquiries', currentInquiry.id, currentInquiry);
                setInquiriesList((prev) => prev.map((i) => (i.id === currentInquiry.id ? { ...i, ...updated } : i)));
                setMessage({ type: 'success', text: `Inquiry updated successfully.` });
            }
            setModalMode(null);
        } catch (error) {
            alert('Failed to save inquiry: ' + error.message);
        } finally {
            setSaving(false);
        }
    }

    return (
        <AdminShell
            title="Contact Inquiries & Leads"
            description="Manage inbound traveler consultation requests, channels, budget estimates, and follow-up status."
        >
            {/* Toolbar */}
            <div className="admin-toolbar">
                <input
                    type="search"
                    className="admin-search"
                    placeholder="Search inquiries by traveler name, subject, email, phone…"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="button" className="admin-primary-button" onClick={openCreate}>
                    <i className="fa-light fa-plus"></i> Record Inbound Lead
                </button>
            </div>

            {message && <div style={{ marginBottom: '14px' }} className={`admin-hero-message ${message.type}`}>{message.text}</div>}

            {/* Table */}
            {loading ? (
                <div className="admin-card admin-empty">Loading inquiries database…</div>
            ) : filteredInquiries.length === 0 ? (
                <div className="admin-card admin-empty">
                    <p>No inquiries found matching &quot;{searchTerm}&quot;.</p>
                </div>
            ) : (
                <div className="admin-card admin-table-wrap">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Traveler / Lead</th>
                                <th>Subject & Inquiry Details</th>
                                <th>Channel</th>
                                <th>Budget / Pax</th>
                                <th>Received Date</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredInquiries.map((inq) => (
                                <tr key={inq.id || inq.from}>
                                    <td>
                                        <div>
                                            <strong>{inq.from}</strong>
                                            <small style={{ display: 'block', color: 'var(--admin-muted)' }}>{inq.phone || inq.email}</small>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ maxWidth: '340px' }}>
                                            <strong style={{ display: 'block', fontSize: '13px', color: 'var(--admin-ink)' }}>
                                                {inq.subject}
                                            </strong>
                                            <p style={{ margin: 0, fontSize: '12px', color: 'var(--admin-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {inq.message}
                                            </p>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="admin-badge" style={{ background: '#f8fafc', color: '#1e293b' }}>
                                            {inq.channel || 'Website'}
                                        </span>
                                    </td>
                                    <td>
                                        <span style={{ fontWeight: 600, color: 'var(--admin-ink)', fontSize: '12px' }}>
                                            {inq.budget || 'Custom'}
                                        </span>
                                        <small style={{ display: 'block', color: 'var(--admin-muted)' }}>{inq.travelers}</small>
                                    </td>
                                    <td>
                                        <small style={{ color: 'var(--admin-muted)' }}>{inq.date}</small>
                                    </td>
                                    <td>
                                        <select
                                            value={inq.status || 'New'}
                                            onChange={(e) => handleStatusChange(inq, e.target.value)}
                                            className={`admin-badge ${inq.status === 'New' ? 'pending' : inq.status === 'Replied' || inq.status === 'Closed' ? '' : 'cancelled'}`}
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
                                            <option value="New">New Lead</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Replied">Replied / Proposal Sent</option>
                                            <option value="Closed">Closed / Converted</option>
                                        </select>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                                            <button
                                                type="button"
                                                className="admin-upload-btn"
                                                style={{ height: '30px', padding: '0 10px' }}
                                                onClick={() => openEdit(inq)}
                                                title="View / Edit Inquiry"
                                            >
                                                <i className="fa-light fa-eye"></i> Details
                                            </button>
                                            <button
                                                type="button"
                                                className="admin-upload-btn"
                                                style={{ height: '30px', padding: '0 10px', color: '#dc2626', borderColor: '#fecaca' }}
                                                onClick={() => handleDelete(inq)}
                                                title="Delete Inquiry"
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
                                    {modalMode === 'create' ? 'Record Inbound Inquiry' : `Inquiry: ${currentInquiry.from}`}
                                </h3>
                                <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--admin-muted)' }}>
                                    Configure inquiry contact channels, destination request, budget estimate, and notes.
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
                                    <label>Lead / Traveler Name *</label>
                                    <input
                                        required
                                        value={currentInquiry.from}
                                        onChange={(e) => setCurrentInquiry({ ...currentInquiry, from: e.target.value })}
                                        placeholder="e.g. Rajesh Nair"
                                    />
                                </div>
                                <div className="admin-form-field">
                                    <label>Inquiry Subject *</label>
                                    <input
                                        required
                                        value={currentInquiry.subject}
                                        onChange={(e) => setCurrentInquiry({ ...currentInquiry, subject: e.target.value })}
                                        placeholder="e.g. Custom family package for Kashmir in October"
                                    />
                                </div>
                                <div className="admin-form-field">
                                    <label>Email Address *</label>
                                    <input
                                        type="email"
                                        required
                                        value={currentInquiry.email}
                                        onChange={(e) => setCurrentInquiry({ ...currentInquiry, email: e.target.value })}
                                        placeholder="rajesh@example.com"
                                    />
                                </div>
                                <div className="admin-form-field">
                                    <label>Phone / WhatsApp Number</label>
                                    <input
                                        value={currentInquiry.phone}
                                        onChange={(e) => setCurrentInquiry({ ...currentInquiry, phone: e.target.value })}
                                        placeholder="+91 98401 55667"
                                    />
                                </div>
                                <div className="admin-form-field">
                                    <label>Source Channel</label>
                                    <select
                                        value={currentInquiry.channel}
                                        onChange={(e) => setCurrentInquiry({ ...currentInquiry, channel: e.target.value })}
                                    >
                                        <option value="Website Form">Website Form</option>
                                        <option value="WhatsApp Inquiry">WhatsApp Inquiry</option>
                                        <option value="Email Direct">Email Direct</option>
                                        <option value="Phone Call">Phone Call</option>
                                        <option value="Social Media">Instagram / Facebook</option>
                                    </select>
                                </div>
                                <div className="admin-form-field">
                                    <label>Group Size / Travelers</label>
                                    <input
                                        value={currentInquiry.travelers}
                                        onChange={(e) => setCurrentInquiry({ ...currentInquiry, travelers: e.target.value })}
                                        placeholder="e.g. 4 Adults, 1 Child"
                                    />
                                </div>
                                <div className="admin-form-field">
                                    <label>Estimated Budget in INR (₹)</label>
                                    <input
                                        value={currentInquiry.budget}
                                        onChange={(e) => setCurrentInquiry({ ...currentInquiry, budget: e.target.value })}
                                        placeholder="e.g. ₹1,50,000 - ₹2,00,000"
                                    />
                                </div>
                                <div className="admin-form-field">
                                    <label>Inquiry Status</label>
                                    <select
                                        value={currentInquiry.status}
                                        onChange={(e) => setCurrentInquiry({ ...currentInquiry, status: e.target.value })}
                                    >
                                        <option value="New">New Lead</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Replied">Replied / Proposal Sent</option>
                                        <option value="Closed">Closed / Converted</option>
                                    </select>
                                </div>
                            </div>

                            <div className="admin-form-field full">
                                <label>Detailed Message / Custom Itinerary Requirements</label>
                                <textarea
                                    rows="4"
                                    value={currentInquiry.message}
                                    onChange={(e) => setCurrentInquiry({ ...currentInquiry, message: e.target.value })}
                                    placeholder="Write traveler requirements, flight preferences, hotel category..."
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
                                    {saving ? 'Saving…' : modalMode === 'create' ? 'Record Lead' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminShell>
    );
}
