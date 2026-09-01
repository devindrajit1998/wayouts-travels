'use client';

import { useState, useEffect } from 'react';
import AdminShell from '../AdminShell';
import {
    getCollectionItems,
    addCollectionItem,
    updateCollectionItem,
    deleteCollectionItem
} from '../../../lib/firestoreService';

const emptyFaq = {
    question: '',
    category: 'Booking & Customization',
    icon: 'fa-thin fa-circle-question',
    answer: '',
    order: 1,
    status: 'Published',
};

const faqCategories = [
    'Booking & Customization',
    'Payments & Pricing',
    'Flights & Visa',
    'Cancellations & Refunds',
    'Customer Support',
    'Safety & Travel Advisory'
];

export default function AdminFaqsPage() {
    const [faqsList, setFaqsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [modalMode, setModalMode] = useState(null); // 'create' | 'edit' | null
    const [currentFaq, setCurrentFaq] = useState(emptyFaq);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        getCollectionItems('faqs').then((data) => {
            if (isMounted) {
                setFaqsList(data);
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

    const filteredFaqs = faqsList.filter((f) => {
        const query = searchTerm.toLowerCase();
        return (
            (f.question || '').toLowerCase().includes(query) ||
            (f.category || '').toLowerCase().includes(query) ||
            (f.answer || '').toLowerCase().includes(query)
        );
    });

    function openCreate() {
        setCurrentFaq({
            ...emptyFaq,
            id: `faq-${Date.now()}`,
            order: faqsList.length + 1,
        });
        setModalMode('create');
        setMessage(null);
    }

    function openEdit(faq) {
        setCurrentFaq({
            ...emptyFaq,
            ...faq,
        });
        setModalMode('edit');
        setMessage(null);
    }

    async function handleStatusChange(faq, newStatus) {
        try {
            await updateCollectionItem('faqs', faq.id, { status: newStatus });
            setFaqsList((prev) => prev.map((f) => (f.id === faq.id ? { ...f, status: newStatus } : f)));
            setMessage({ type: 'success', text: `FAQ status updated to "${newStatus}".` });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update status: ' + error.message });
        }
    }

    async function handleDelete(faq) {
        if (!window.confirm(`Are you sure you want to delete this FAQ?`)) return;
        try {
            await deleteCollectionItem('faqs', faq.id);
            setFaqsList((prev) => prev.filter((f) => f.id !== faq.id));
            setMessage({ type: 'success', text: 'FAQ deleted successfully.' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to delete FAQ: ' + error.message });
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            if (modalMode === 'create') {
                const created = await addCollectionItem('faqs', currentFaq);
                setFaqsList((prev) => [...prev, created]);
                setMessage({ type: 'success', text: 'FAQ question created successfully.' });
            } else {
                const updated = await updateCollectionItem('faqs', currentFaq.id, currentFaq);
                setFaqsList((prev) => prev.map((f) => (f.id === currentFaq.id ? { ...f, ...updated } : f)));
                setMessage({ type: 'success', text: 'FAQ question updated successfully.' });
            }
            setModalMode(null);
        } catch (error) {
            alert('Failed to save FAQ: ' + error.message);
        } finally {
            setSaving(false);
        }
    }

    return (
        <AdminShell
            title="FAQs Management"
            description="Manage frequently asked questions, categorized answers, ordering, and publication status."
        >
            {/* Toolbar */}
            <div className="admin-toolbar">
                <input
                    type="search"
                    className="admin-search"
                    placeholder="Search FAQs by question, category, answer…"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="button" className="admin-primary-button" onClick={openCreate}>
                    <i className="fa-light fa-plus"></i> Add New FAQ
                </button>
            </div>

            {message && <div style={{ marginBottom: '14px' }} className={`admin-hero-message ${message.type}`}>{message.text}</div>}

            {/* Table */}
            {loading ? (
                <div className="admin-card admin-empty">Loading FAQs database…</div>
            ) : filteredFaqs.length === 0 ? (
                <div className="admin-card admin-empty">
                    <p>No FAQs found matching &quot;{searchTerm}&quot;.</p>
                </div>
            ) : (
                <div className="admin-card admin-table-wrap">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th style={{ width: '40px' }}>#</th>
                                <th>Question & Answer</th>
                                <th>Category</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredFaqs.map((faq, idx) => (
                                <tr key={faq.id || idx}>
                                    <td>
                                        <span style={{ fontWeight: 600, color: 'var(--admin-muted)', fontSize: '12px' }}>
                                            {faq.order || idx + 1}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ maxWidth: '480px' }}>
                                            <strong style={{ fontSize: '14px', color: 'var(--admin-ink)', display: 'block', marginBottom: '4px' }}>
                                                {faq.question}
                                            </strong>
                                            <p style={{ margin: 0, fontSize: '12px', color: 'var(--admin-muted)', lineHeight: '1.4' }}>
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="admin-badge" style={{ background: '#f1f5f9', color: '#334155' }}>
                                            {faq.category || '—'}
                                        </span>
                                    </td>
                                    <td>
                                        <select
                                            value={faq.status || 'Published'}
                                            onChange={(e) => handleStatusChange(faq, e.target.value)}
                                            className={`admin-badge ${faq.status === 'Published' ? '' : 'pending'}`}
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
                                            <option value="Published">Published / Live</option>
                                            <option value="Draft">Draft / Hidden</option>
                                        </select>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                                            <button
                                                type="button"
                                                className="admin-upload-btn"
                                                style={{ height: '30px', padding: '0 10px' }}
                                                onClick={() => openEdit(faq)}
                                                title="Edit FAQ"
                                            >
                                                <i className="fa-light fa-pen-to-square"></i> Edit
                                            </button>
                                            <button
                                                type="button"
                                                className="admin-upload-btn"
                                                style={{ height: '30px', padding: '0 10px', color: '#dc2626', borderColor: '#fecaca' }}
                                                onClick={() => handleDelete(faq)}
                                                title="Delete FAQ"
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
                    <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', width: 'min(680px, 100%)', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 60px rgba(0,0,0,0.3)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--admin-line)', paddingBottom: '12px', marginBottom: '16px' }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--admin-ink)' }}>
                                    {modalMode === 'create' ? 'Add FAQ Question' : 'Edit FAQ Question'}
                                </h3>
                                <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--admin-muted)' }}>
                                    Configure question text, category, response answer, and sort order.
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
                                <label>FAQ Question Title *</label>
                                <input
                                    required
                                    value={currentFaq.question}
                                    onChange={(e) => setCurrentFaq({ ...currentFaq, question: e.target.value })}
                                    placeholder="e.g. How do I customize an Indian tour package with Wayouts?"
                                />
                            </div>

                            <div className="admin-form-grid">
                                <div className="admin-form-field">
                                    <label>Category *</label>
                                    <select
                                        value={currentFaq.category}
                                        onChange={(e) => setCurrentFaq({ ...currentFaq, category: e.target.value })}
                                    >
                                        {faqCategories.map((c) => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="admin-form-field">
                                    <label>Display Sort Order</label>
                                    <input
                                        type="number"
                                        value={currentFaq.order}
                                        onChange={(e) => setCurrentFaq({ ...currentFaq, order: parseInt(e.target.value) || 1 })}
                                    />
                                </div>
                                <div className="admin-form-field">
                                    <label>Publication Status</label>
                                    <select
                                        value={currentFaq.status}
                                        onChange={(e) => setCurrentFaq({ ...currentFaq, status: e.target.value })}
                                    >
                                        <option value="Published">Published / Live</option>
                                        <option value="Draft">Draft / Hidden</option>
                                    </select>
                                </div>
                            </div>

                            <div className="admin-form-field full">
                                <label>Detailed Answer *</label>
                                <textarea
                                    required
                                    rows="4"
                                    value={currentFaq.answer}
                                    onChange={(e) => setCurrentFaq({ ...currentFaq, answer: e.target.value })}
                                    placeholder="Provide a clear, helpful answer for prospective travelers..."
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
                                    {saving ? 'Saving…' : modalMode === 'create' ? 'Create FAQ' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminShell>
    );
}
