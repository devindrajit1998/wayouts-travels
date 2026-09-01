'use client';

import { useState, useEffect } from 'react';
import AdminShell from '../AdminShell';
import ImageUpload from '../../components/ImageUpload';
import {
    getCollectionItems,
    addCollectionItem,
    updateCollectionItem,
    deleteCollectionItem
} from '../../../lib/firestoreService';

const emptyReview = {
    name: '',
    location: '',
    avatar: '',
    tourName: '',
    rating: 5,
    date: '',
    title: '',
    comment: '',
    featured: true,
    status: 'Approved',
};

export default function AdminTestimonialsPage() {
    const [reviewsList, setReviewsList] = useState([]);
    const [toursList, setToursList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [modalMode, setModalMode] = useState(null); // 'create' | 'edit' | null
    const [currentReview, setCurrentReview] = useState(emptyReview);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        Promise.all([
            getCollectionItems('testimonials'),
            getCollectionItems('tours'),
        ]).then(([revsData, toursData]) => {
            if (isMounted) {
                setReviewsList(revsData);
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

    const filteredReviews = reviewsList.filter((r) => {
        const query = searchTerm.toLowerCase();
        return (
            (r.name || '').toLowerCase().includes(query) ||
            (r.tourName || '').toLowerCase().includes(query) ||
            (r.comment || '').toLowerCase().includes(query) ||
            (r.location || '').toLowerCase().includes(query)
        );
    });

    function openCreate() {
        const d = new Date();
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const today = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;

        setCurrentReview({
            ...emptyReview,
            id: `rev-${Date.now()}`,
            date: today,
            tourName: toursList[0]?.name || '',
        });
        setModalMode('create');
        setMessage(null);
    }

    function openEdit(review) {
        setCurrentReview({
            ...emptyReview,
            ...review,
        });
        setModalMode('edit');
        setMessage(null);
    }

    async function handleStatusChange(review, newStatus) {
        try {
            await updateCollectionItem('testimonials', review.id, { status: newStatus });
            setReviewsList((prev) => prev.map((r) => (r.id === review.id ? { ...r, status: newStatus } : r)));
            setMessage({ type: 'success', text: `Review by "${review.name}" updated to "${newStatus}".` });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update status: ' + error.message });
        }
    }

    async function handleDelete(review) {
        if (!window.confirm(`Are you sure you want to delete review from "${review.name}"?`)) return;
        try {
            await deleteCollectionItem('testimonials', review.id);
            setReviewsList((prev) => prev.filter((r) => r.id !== review.id));
            setMessage({ type: 'success', text: `Review from "${review.name}" deleted.` });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to delete review: ' + error.message });
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            if (modalMode === 'create') {
                const created = await addCollectionItem('testimonials', currentReview);
                setReviewsList((prev) => [created, ...prev]);
                setMessage({ type: 'success', text: `Review added successfully.` });
            } else {
                const updated = await updateCollectionItem('testimonials', currentReview.id, currentReview);
                setReviewsList((prev) => prev.map((r) => (r.id === currentReview.id ? { ...r, ...updated } : r)));
                setMessage({ type: 'success', text: `Review updated successfully.` });
            }
            setModalMode(null);
        } catch (error) {
            alert('Failed to save review: ' + error.message);
        } finally {
            setSaving(false);
        }
    }

    return (
        <AdminShell
            title="Testimonials & Reviews"
            description="Moderate traveler ratings, holiday feedback, reviewer photos, and approval status."
        >
            {/* Toolbar */}
            <div className="admin-toolbar">
                <input
                    type="search"
                    className="admin-search"
                    placeholder="Search reviews by guest name, tour package, city…"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="button" className="admin-primary-button" onClick={openCreate}>
                    <i className="fa-light fa-plus"></i> Add New Review
                </button>
            </div>

            {message && <div style={{ marginBottom: '14px' }} className={`admin-hero-message ${message.type}`}>{message.text}</div>}

            {/* Table */}
            {loading ? (
                <div className="admin-card admin-empty">Loading testimonials…</div>
            ) : filteredReviews.length === 0 ? (
                <div className="admin-card admin-empty">
                    <p>No reviews found matching &quot;{searchTerm}&quot;.</p>
                </div>
            ) : (
                <div className="admin-card admin-table-wrap">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Guest Profile</th>
                                <th>Tour Package</th>
                                <th>Rating</th>
                                <th>Review Headline & Comment</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReviews.map((rev) => (
                                <tr key={rev.id || rev.name}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            {rev.avatar ? (
                                                <img
                                                    src={rev.avatar}
                                                    alt=""
                                                    style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--admin-line)' }}
                                                />
                                            ) : (
                                                <span
                                                    style={{ width: '38px', height: '38px', borderRadius: '50%', border: '1px solid var(--admin-line)', flexShrink: 0, background: 'repeating-linear-gradient(45deg, #eef2f7, #eef2f7 6px, #e2e8f0 6px, #e2e8f0 12px)' }}
                                                ></span>
                                            )}
                                            <div>
                                                <strong>{rev.name}</strong>
                                                <small style={{ display: 'block', color: 'var(--admin-muted)' }}>{rev.location}</small>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="admin-badge" style={{ background: '#f8fafc', color: '#1e293b' }}>
                                            {rev.tourName || '—'}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ color: '#eab308', display: 'flex', gap: '2px', fontSize: '13px' }}>
                                            {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                                                <i key={i} className="fa-solid fa-star"></i>
                                            ))}
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ maxWidth: '320px' }}>
                                            {rev.title && <strong style={{ display: 'block', fontSize: '13px', color: 'var(--admin-ink)' }}>{rev.title}</strong>}
                                            <p style={{ margin: 0, fontSize: '12px', color: 'var(--admin-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                &quot;{rev.comment}&quot;
                                            </p>
                                        </div>
                                    </td>
                                    <td>
                                        <small style={{ color: 'var(--admin-muted)' }}>{rev.date || '—'}</small>
                                    </td>
                                    <td>
                                        <select
                                            value={rev.status || 'Approved'}
                                            onChange={(e) => handleStatusChange(rev, e.target.value)}
                                            className={`admin-badge ${rev.status === 'Approved' ? '' : rev.status === 'Pending' ? 'pending' : 'cancelled'}`}
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
                                            <option value="Approved">Approved / Live</option>
                                            <option value="Pending">Pending Review</option>
                                            <option value="Rejected">Rejected</option>
                                        </select>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                                            <button
                                                type="button"
                                                className="admin-upload-btn"
                                                style={{ height: '30px', padding: '0 10px' }}
                                                onClick={() => openEdit(rev)}
                                                title="Edit Review"
                                            >
                                                <i className="fa-light fa-pen-to-square"></i> Edit
                                            </button>
                                            <button
                                                type="button"
                                                className="admin-upload-btn"
                                                style={{ height: '30px', padding: '0 10px', color: '#dc2626', borderColor: '#fecaca' }}
                                                onClick={() => handleDelete(rev)}
                                                title="Delete Review"
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
                                    {modalMode === 'create' ? 'Add Guest Review' : `Edit Review: ${currentReview.name}`}
                                </h3>
                                <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--admin-muted)' }}>
                                    Configure reviewer details, tour linkage, star rating, and testimonial quote.
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
                                    <label>Guest Full Name *</label>
                                    <input
                                        required
                                        value={currentReview.name}
                                        onChange={(e) => setCurrentReview({ ...currentReview, name: e.target.value })}
                                        placeholder="e.g. Aarav Sharma"
                                    />
                                </div>
                                <div className="admin-form-field">
                                    <label>Location / City</label>
                                    <input
                                        value={currentReview.location}
                                        onChange={(e) => setCurrentReview({ ...currentReview, location: e.target.value })}
                                        placeholder="e.g. Mumbai, India"
                                    />
                                </div>
                                <div className="admin-form-field">
                                    <label>Tour Package Experienced</label>
                                    <select
                                        value={currentReview.tourName}
                                        onChange={(e) => setCurrentReview({ ...currentReview, tourName: e.target.value })}
                                    >
                                        <option value="">-- General Agency Review --</option>
                                        {toursList.map((t) => (
                                            <option key={t.id || t.name} value={t.name}>
                                                {t.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="admin-form-field">
                                    <label>Star Rating (1 - 5)</label>
                                    <select
                                        value={currentReview.rating}
                                        onChange={(e) => setCurrentReview({ ...currentReview, rating: parseInt(e.target.value) || 5 })}
                                    >
                                        <option value="5">★★★★★ (5 Stars - Outstanding)</option>
                                        <option value="4">★★★★☆ (4 Stars - Very Good)</option>
                                        <option value="3">★★★☆☆ (3 Stars - Average)</option>
                                        <option value="2">★★☆☆☆ (2 Stars - Below Expectations)</option>
                                        <option value="1">★☆☆☆☆ (1 Star - Poor)</option>
                                    </select>
                                </div>
                                <div className="admin-form-field">
                                    <label>Review Date</label>
                                    <input
                                        value={currentReview.date}
                                        onChange={(e) => setCurrentReview({ ...currentReview, date: e.target.value })}
                                        placeholder="e.g. 28 Aug 2026"
                                    />
                                </div>
                                <div className="admin-form-field">
                                    <label>Moderation Status</label>
                                    <select
                                        value={currentReview.status}
                                        onChange={(e) => setCurrentReview({ ...currentReview, status: e.target.value })}
                                    >
                                        <option value="Approved">Approved / Live</option>
                                        <option value="Pending">Pending Review</option>
                                        <option value="Rejected">Rejected</option>
                                    </select>
                                </div>
                            </div>

                            {/* Guest Avatar */}
                            <div className="admin-form-field full">
                                <label>Guest Profile Photo / Avatar</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    {currentReview.avatar ? (
                                        <img
                                            src={currentReview.avatar}
                                            alt=""
                                            style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--admin-line)' }}
                                        />
                                    ) : (
                                        <span
                                            style={{ width: '42px', height: '42px', borderRadius: '50%', border: '1px solid var(--admin-line)', flexShrink: 0, background: 'repeating-linear-gradient(45deg, #eef2f7, #eef2f7 6px, #e2e8f0 6px, #e2e8f0 12px)' }}
                                        ></span>
                                    )}
                                    <input
                                        value={currentReview.avatar || ''}
                                        onChange={(e) => setCurrentReview({ ...currentReview, avatar: e.target.value })}
                                        placeholder="/assets/img/team/... or ImageKit URL"
                                        style={{ flex: 1 }}
                                    />
                                    <ImageUpload
                                        folder="/wayouts/testimonials"
                                        onUploaded={(url) => setCurrentReview({ ...currentReview, avatar: url })}
                                    />
                                </div>
                            </div>

                            {/* Review Title */}
                            <div className="admin-form-field full">
                                <label>Review Headline / Title</label>
                                <input
                                    value={currentReview.title}
                                    onChange={(e) => setCurrentReview({ ...currentReview, title: e.target.value })}
                                    placeholder="e.g. Unforgettable Himalayan Experience"
                                />
                            </div>

                            {/* Comment */}
                            <div className="admin-form-field full">
                                <label>Review Feedback / Detailed Testimonial *</label>
                                <textarea
                                    required
                                    rows="3"
                                    value={currentReview.comment}
                                    onChange={(e) => setCurrentReview({ ...currentReview, comment: e.target.value })}
                                    placeholder="Write guest testimonial narrative..."
                                />
                            </div>

                            <div className="admin-form-field" style={{ alignContent: 'center' }}>
                                <label className="admin-setting-row" style={{ padding: '4px 0', border: 0 }}>
                                    <span>
                                        <strong>Feature on Homepage Showcase</strong>
                                        <small>Display in primary testimonial slider</small>
                                    </span>
                                    <input
                                        type="checkbox"
                                        checked={currentReview.featured}
                                        onChange={(e) => setCurrentReview({ ...currentReview, featured: e.target.checked })}
                                    />
                                </label>
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
                                    {saving ? 'Saving…' : modalMode === 'create' ? 'Add Testimonial' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminShell>
    );
}
