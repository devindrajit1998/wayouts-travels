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

const emptyDestination = {
    name: '',
    region: '',
    packages: '',
    travelers: '',
    startingPrice: '',
    bestSeason: '',
    featured: false,
    image: '',
    description: '',
    status: 'Published',
};

export default function AdminDestinationsPage() {
    const [destinationsList, setDestinationsList] = useState([]);
    const [toursList, setToursList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [modalMode, setModalMode] = useState(null); // 'create' | 'edit' | null
    const [currentDest, setCurrentDest] = useState(emptyDestination);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        Promise.all([
            getCollectionItems('destinations'),
            getCollectionItems('tours'),
        ]).then(([destsData, toursData]) => {
            if (isMounted) {
                setDestinationsList(destsData);
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

    // Helper to calculate live packages count & lowest starting price for a destination
    function getDynamicStats(destName) {
        if (!destName) return null;
        const matching = toursList.filter(
            (t) => (t.destination || '').toLowerCase().includes(destName.toLowerCase())
        );
        return {
            count: matching.length,
            label: matching.length > 0 ? `${matching.length} Tour Package${matching.length > 1 ? 's' : ''}` : '0 Packages',
            prices: matching.map((t) => t.price).filter(Boolean),
        };
    }

    const filteredDestinations = destinationsList.filter((d) => {
        const query = searchTerm.toLowerCase();
        return (
            (d.name || '').toLowerCase().includes(query) ||
            (d.region || '').toLowerCase().includes(query) ||
            (d.packages || '').toLowerCase().includes(query) ||
            (d.startingPrice || '').toLowerCase().includes(query)
        );
    });

    function openCreate() {
        setCurrentDest({ ...emptyDestination, id: `dest-${Date.now()}` });
        setModalMode('create');
        setMessage(null);
    }

    function openEdit(dest) {
        setCurrentDest({
            ...emptyDestination,
            ...dest,
        });
        setModalMode('edit');
        setMessage(null);
    }

    async function handleStatusChange(dest, newStatus) {
        try {
            await updateCollectionItem('destinations', dest.id, { status: newStatus });
            setDestinationsList((prev) => prev.map((d) => (d.id === dest.id ? { ...d, status: newStatus } : d)));
            setMessage({ type: 'success', text: `Status for "${dest.name}" changed to "${newStatus}".` });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update status: ' + error.message });
        }
    }

    async function handleDelete(dest) {
        if (!window.confirm(`Are you sure you want to delete destination "${dest.name}"?`)) return;
        try {
            await deleteCollectionItem('destinations', dest.id);
            setDestinationsList((prev) => prev.filter((d) => d.id !== dest.id));
            setMessage({ type: 'success', text: `Destination "${dest.name}" deleted successfully.` });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to delete: ' + error.message });
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            if (modalMode === 'create') {
                const created = await addCollectionItem('destinations', currentDest);
                setDestinationsList((prev) => [created, ...prev]);
                setMessage({ type: 'success', text: `Destination "${currentDest.name}" added and published.` });
            } else {
                const updated = await updateCollectionItem('destinations', currentDest.id, currentDest);
                setDestinationsList((prev) => prev.map((d) => (d.id === currentDest.id ? { ...d, ...updated } : d)));
                setMessage({ type: 'success', text: `Destination "${currentDest.name}" updated successfully.` });
            }
            setModalMode(null);
        } catch (error) {
            alert('Failed to save destination: ' + error.message);
        } finally {
            setSaving(false);
        }
    }

    return (
        <AdminShell
            title="Destinations Catalog"
            description="Manage global countries, regions, tour package counts, and starting pricing for destinations."
        >
            {/* Toolbar */}
            <div className="admin-toolbar">
                <input
                    type="search"
                    className="admin-search"
                    placeholder="Search destinations by country, region, packages…"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="button" className="admin-primary-button" onClick={openCreate}>
                    <i className="fa-light fa-plus"></i> Add New Destination
                </button>
            </div>

            {message && <div style={{ marginBottom: '14px' }} className={`admin-hero-message ${message.type}`}>{message.text}</div>}

            {/* Table */}
            {loading ? (
                <div className="admin-card admin-empty">Loading destinations database…</div>
            ) : filteredDestinations.length === 0 ? (
                <div className="admin-card admin-empty">
                    <p>No destinations found matching &quot;{searchTerm}&quot;.</p>
                </div>
            ) : (
                <div className="admin-card admin-table-wrap">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Destination</th>
                                <th>Region</th>
                                <th>Packages Count</th>
                                <th>Starting Price (INR)</th>
                                <th>Annual Travelers</th>
                                <th>Featured</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDestinations.map((dest) => (
                                <tr key={dest.id || dest.name}>
                                    <td>
                                        <div className="admin-list-main">
                                            {dest.image ? (
                                                <img
                                                    className="admin-thumb"
                                                    src={dest.image}
                                                    alt=""
                                                />
                                            ) : (
                                                <span className="admin-thumb admin-thumb-empty"></span>
                                            )}
                                            <div>
                                                <strong>{dest.name}</strong>
                                                {dest.bestSeason && (
                                                    <span style={{ display: 'block', fontSize: '11px', color: 'var(--admin-muted)' }}>
                                                        Best: {dest.bestSeason}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td>{dest.region}</td>
                                    <td>
                                        <strong>{dest.packages}</strong>
                                    </td>
                                    <td>
                                        <strong style={{ color: 'var(--admin-primary)' }}>{dest.startingPrice || '—'}</strong>
                                    </td>
                                    <td>{dest.travelers || '—'}</td>
                                    <td>
                                        <span className={`admin-badge ${dest.featured ? '' : 'pending'}`}>
                                            {dest.featured ? 'Yes' : 'No'}
                                        </span>
                                    </td>
                                    <td>
                                        <select
                                            value={dest.status || 'Published'}
                                            onChange={(e) => handleStatusChange(dest, e.target.value)}
                                            className={`admin-badge ${dest.status === 'Published' ? '' : dest.status === 'Draft' ? 'pending' : 'cancelled'}`}
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
                                            <option value="Published">Published</option>
                                            <option value="Draft">Draft</option>
                                            <option value="Archived">Archived</option>
                                        </select>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                                            <button
                                                type="button"
                                                className="admin-upload-btn"
                                                style={{ height: '30px', padding: '0 10px' }}
                                                onClick={() => openEdit(dest)}
                                                title="Edit Destination"
                                            >
                                                <i className="fa-light fa-pen-to-square"></i> Edit
                                            </button>
                                            <button
                                                type="button"
                                                className="admin-upload-btn"
                                                style={{ height: '30px', padding: '0 10px', color: '#dc2626', borderColor: '#fecaca' }}
                                                onClick={() => handleDelete(dest)}
                                                title="Delete Destination"
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
                                    {modalMode === 'create' ? 'Add New Destination' : `Edit: ${currentDest.name}`}
                                </h3>
                                <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--admin-muted)' }}>
                                    Configure country/city, geographic region, packages count, and banner artwork.
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
                                    <label>Destination Name *</label>
                                    <input
                                        required
                                        value={currentDest.name}
                                        onChange={(e) => setCurrentDest({ ...currentDest, name: e.target.value })}
                                        placeholder="e.g. Greece, Thailand, Iceland"
                                    />
                                </div>
                                <div className="admin-form-field">
                                    <label>Geographic Region *</label>
                                    <select
                                        value={currentDest.region}
                                        onChange={(e) => setCurrentDest({ ...currentDest, region: e.target.value })}
                                    >
                                        <option value="North India">North India (Himalayas, Delhi, Punjab, UP)</option>
                                        <option value="South India">South India (Kerala, Tamil Nadu, Karnataka, AP)</option>
                                        <option value="West India">West India (Rajasthan, Goa, Gujarat, Maharashtra)</option>
                                        <option value="East India">East India (West Bengal, Odisha, Bihar, Jharkhand)</option>
                                        <option value="Northeast India">Northeast India (Sikkim, Assam, Meghalaya, Arunachal)</option>
                                        <option value="Central India">Central India (Madhya Pradesh, Chhattisgarh)</option>
                                        <option value="Islands & UTs">Islands & UTs (Andaman, Lakshadweep, Ladakh)</option>
                                        <option value="International">International (Short Haul / Asia / Europe)</option>
                                    </select>
                                </div>
                                <div className="admin-form-field">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <label>Tour Packages Count Label *</label>
                                        {currentDest.name && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const stats = getDynamicStats(currentDest.name);
                                                    if (stats) setCurrentDest({ ...currentDest, packages: stats.label });
                                                }}
                                                style={{ border: 0, background: 'transparent', color: 'var(--admin-primary)', fontSize: '11px', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                                            >
                                                ⚡ Auto-calc ({getDynamicStats(currentDest.name)?.count || 0} tours)
                                            </button>
                                        )}
                                    </div>
                                    <input
                                        required
                                        value={currentDest.packages}
                                        onChange={(e) => setCurrentDest({ ...currentDest, packages: e.target.value })}
                                        placeholder="e.g. 4+ Tour Packages"
                                    />
                                </div>
                                <div className="admin-form-field">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <label>Starting Price in INR (₹)</label>
                                        {currentDest.name && getDynamicStats(currentDest.name)?.prices?.length > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const stats = getDynamicStats(currentDest.name);
                                                    if (stats?.prices?.[0]) setCurrentDest({ ...currentDest, startingPrice: stats.prices[0] });
                                                }}
                                                style={{ border: 0, background: 'transparent', color: 'var(--admin-primary)', fontSize: '11px', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                                            >
                                                ⚡ From Tours ({getDynamicStats(currentDest.name).prices[0]})
                                            </button>
                                        )}
                                    </div>
                                    <input
                                        value={currentDest.startingPrice}
                                        onChange={(e) => setCurrentDest({ ...currentDest, startingPrice: e.target.value })}
                                        placeholder="e.g. ₹39,999"
                                    />
                                </div>
                                <div className="admin-form-field">
                                    <label>Annual Travelers Count</label>
                                    <input
                                        value={currentDest.travelers}
                                        onChange={(e) => setCurrentDest({ ...currentDest, travelers: e.target.value })}
                                        placeholder="e.g. 1,240+"
                                    />
                                </div>
                                <div className="admin-form-field">
                                    <label>Best Season to Visit</label>
                                    <input
                                        value={currentDest.bestSeason}
                                        onChange={(e) => setCurrentDest({ ...currentDest, bestSeason: e.target.value })}
                                        placeholder="e.g. May – October"
                                    />
                                </div>
                                <div className="admin-form-field">
                                    <label>Publication Status</label>
                                    <select
                                        value={currentDest.status}
                                        onChange={(e) => setCurrentDest({ ...currentDest, status: e.target.value })}
                                    >
                                        <option value="Published">Published / Live</option>
                                        <option value="Draft">Draft / Hidden</option>
                                        <option value="Archived">Archived</option>
                                    </select>
                                </div>
                                <div className="admin-form-field" style={{ alignContent: 'center' }}>
                                    <label className="admin-setting-row" style={{ padding: '4px 0', border: 0 }}>
                                        <span>
                                            <strong>Featured Destination</strong>
                                            <small>Showcase in highlights</small>
                                        </span>
                                        <input
                                            type="checkbox"
                                            checked={currentDest.featured}
                                            onChange={(e) => setCurrentDest({ ...currentDest, featured: e.target.checked })}
                                        />
                                    </label>
                                </div>
                            </div>

                            {/* Destination Image */}
                            <div className="admin-form-field full">
                                <label>Destination Showcase Image</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    {currentDest.image ? (
                                        <img
                                            src={currentDest.image}
                                            alt=""
                                            style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--admin-line)' }}
                                        />
                                    ) : (
                                        <span
                                            style={{ width: '48px', height: '48px', borderRadius: '6px', border: '1px solid var(--admin-line)', flexShrink: 0, background: 'repeating-linear-gradient(45deg, #eef2f7, #eef2f7 6px, #e2e8f0 6px, #e2e8f0 12px)' }}
                                        ></span>
                                    )}
                                    <input
                                        value={currentDest.image || ''}
                                        onChange={(e) => setCurrentDest({ ...currentDest, image: e.target.value })}
                                        placeholder="/assets/img/destination/... or ImageKit URL"
                                        style={{ flex: 1 }}
                                    />
                                    <ImageUpload
                                        folder="/wayouts/destinations"
                                        onUploaded={(url) => setCurrentDest({ ...currentDest, image: url })}
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div className="admin-form-field full">
                                <label>Short Description / Narrative</label>
                                <textarea
                                    rows="3"
                                    value={currentDest.description}
                                    onChange={(e) => setCurrentDest({ ...currentDest, description: e.target.value })}
                                    placeholder="Write a brief synopsis about this travel destination..."
                                />
                            </div>

                            {/* Modal Save Footer */}
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
                                    {saving ? 'Saving…' : modalMode === 'create' ? 'Add Destination' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminShell>
    );
}
