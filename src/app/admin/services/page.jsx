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

const availableIcons = [
    { label: 'Route / Itinerary', value: 'fa-thin fa-route' },
    { label: 'Flight / Plane', value: 'fa-thin fa-plane-departure' },
    { label: 'Hotel / Stay', value: 'fa-thin fa-hotel' },
    { label: 'Visa / Passport', value: 'fa-thin fa-passport' },
    { label: 'Transfer / Vehicle', value: 'fa-thin fa-van-shuttle' },
    { label: 'Support / Headset', value: 'fa-thin fa-headset' },
    { label: 'Compass / Adventure', value: 'fa-thin fa-compass' },
    { label: 'Camera / Sightseeing', value: 'fa-thin fa-camera' },
    { label: 'Ship / Cruise', value: 'fa-thin fa-ship' },
    { label: 'Shield / Insurance', value: 'fa-thin fa-shield-check' },
    { label: 'Luggage / Baggage', value: 'fa-thin fa-suitcase-rolling' },
    { label: 'Map / Location', value: 'fa-thin fa-map-location-dot' },
];

const emptyService = {
    title: '',
    subtitle: '',
    icon: 'fa-thin fa-route',
    image: '',
    desc: '',
    overview: '',
    features: [''],
    badge: '',
    order: 1,
    status: 'Active',
};

export default function AdminServicesPage() {
    const [servicesList, setServicesList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [modalMode, setModalMode] = useState(null); // 'create' | 'edit' | null
    const [currentService, setCurrentService] = useState(emptyService);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        getCollectionItems('services').then((data) => {
            if (isMounted) {
                setServicesList(data);
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

    const filteredServices = servicesList.filter((s) => {
        const query = searchTerm.toLowerCase();
        return (
            (s.title || '').toLowerCase().includes(query) ||
            (s.subtitle || '').toLowerCase().includes(query) ||
            (s.desc || '').toLowerCase().includes(query)
        );
    });

    function openCreate() {
        setCurrentService({
            ...emptyService,
            id: `serv-${Date.now()}`,
            order: servicesList.length + 1,
        });
        setModalMode('create');
        setMessage(null);
    }

    function openEdit(service) {
        setCurrentService({
            ...emptyService,
            ...service,
            features: service.features || emptyService.features,
        });
        setModalMode('edit');
        setMessage(null);
    }

    async function handleStatusChange(service, newStatus) {
        try {
            await updateCollectionItem('services', service.id, { status: newStatus });
            setServicesList((prev) => prev.map((s) => (s.id === service.id ? { ...s, status: newStatus } : s)));
            setMessage({ type: 'success', text: `Status for "${service.title}" updated to "${newStatus}".` });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update status: ' + error.message });
        }
    }

    async function handleDelete(service) {
        if (!window.confirm(`Are you sure you want to delete service "${service.title}"?`)) return;
        try {
            await deleteCollectionItem('services', service.id);
            setServicesList((prev) => prev.filter((s) => s.id !== service.id));
            setMessage({ type: 'success', text: `Service "${service.title}" deleted.` });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to delete service: ' + error.message });
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            if (modalMode === 'create') {
                const created = await addCollectionItem('services', currentService);
                setServicesList((prev) => [...prev, created]);
                setMessage({ type: 'success', text: `Service "${currentService.title}" created successfully.` });
            } else {
                const updated = await updateCollectionItem('services', currentService.id, currentService);
                setServicesList((prev) => prev.map((s) => (s.id === currentService.id ? { ...s, ...updated } : s)));
                setMessage({ type: 'success', text: `Service "${currentService.title}" updated successfully.` });
            }
            setModalMode(null);
        } catch (error) {
            alert('Failed to save service: ' + error.message);
        } finally {
            setSaving(false);
        }
    }

    return (
        <AdminShell
            title="Services Management"
            description="Manage agency services, icons, feature inclusions, and service details."
        >
            {/* Toolbar */}
            <div className="admin-toolbar">
                <input
                    type="search"
                    className="admin-search"
                    placeholder="Search services by title, description…"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="button" className="admin-primary-button" onClick={openCreate}>
                    <i className="fa-light fa-plus"></i> Add New Service
                </button>
            </div>

            {message && <div style={{ marginBottom: '14px' }} className={`admin-hero-message ${message.type}`}>{message.text}</div>}

            {/* Table */}
            {loading ? (
                <div className="admin-card admin-empty">Loading services database…</div>
            ) : filteredServices.length === 0 ? (
                <div className="admin-card admin-empty">
                    <p>No services found matching &quot;{searchTerm}&quot;.</p>
                </div>
            ) : (
                <div className="admin-card admin-table-wrap">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Icon & Service Title</th>
                                <th>Subtitle</th>
                                <th>Badge Label</th>
                                <th>Key Features</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredServices.map((service) => (
                                <tr key={service.id || service.title}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '8px',
                                                background: '#ecfeff',
                                                color: '#00aeb6',
                                                display: 'grid',
                                                placeItems: 'center',
                                                fontSize: '18px',
                                                border: '1px solid #cffafe'
                                            }}>
                                                {service.icon && <i className={service.icon}></i>}
                                            </div>
                                            <div>
                                                <strong>{service.title}</strong>
                                                <div style={{ fontSize: '12px', color: 'var(--admin-muted)', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {service.desc}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span style={{ fontSize: '12px', color: 'var(--admin-ink)' }}>
                                            {service.subtitle || '—'}
                                        </span>
                                    </td>
                                    <td>
                                        {service.badge ? (
                                            <span className="admin-badge" style={{ background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' }}>
                                                {service.badge}
                                            </span>
                                        ) : '—'}
                                    </td>
                                    <td>
                                        <span style={{ fontSize: '12px', color: 'var(--admin-muted)' }}>
                                            {(service.features || []).length} Inclusions
                                        </span>
                                    </td>
                                    <td>
                                        <select
                                            value={service.status || 'Active'}
                                            onChange={(e) => handleStatusChange(service, e.target.value)}
                                            className={`admin-badge ${service.status === 'Active' ? '' : service.status === 'Draft' ? 'pending' : 'cancelled'}`}
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
                                            <option value="Active">Active / Live</option>
                                            <option value="Draft">Draft</option>
                                            <option value="Disabled">Disabled</option>
                                        </select>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                                            <button
                                                type="button"
                                                className="admin-upload-btn"
                                                style={{ height: '30px', padding: '0 10px' }}
                                                onClick={() => openEdit(service)}
                                                title="Edit Service"
                                            >
                                                <i className="fa-light fa-pen-to-square"></i> Edit
                                            </button>
                                            <button
                                                type="button"
                                                className="admin-upload-btn"
                                                style={{ height: '30px', padding: '0 10px', color: '#dc2626', borderColor: '#fecaca' }}
                                                onClick={() => handleDelete(service)}
                                                title="Delete Service"
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
                                    {modalMode === 'create' ? 'Add New Travel Service' : `Edit Service: ${currentService.title}`}
                                </h3>
                                <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--admin-muted)' }}>
                                    Configure service title, vector icon, description, badge, and experience inclusions.
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
                                    <label>Service Title *</label>
                                    <input
                                        required
                                        value={currentService.title}
                                        onChange={(e) => setCurrentService({ ...currentService, title: e.target.value })}
                                        placeholder="e.g. Custom Tour Packages"
                                    />
                                </div>
                                <div className="admin-form-field">
                                    <label>Subtitle / Tagline</label>
                                    <input
                                        value={currentService.subtitle}
                                        onChange={(e) => setCurrentService({ ...currentService, subtitle: e.target.value })}
                                        placeholder="e.g. Personalized Itineraries & Holidays"
                                    />
                                </div>
                                <div className="admin-form-field">
                                    <label>Select Icon *</label>
                                    <select
                                        value={currentService.icon}
                                        onChange={(e) => setCurrentService({ ...currentService, icon: e.target.value })}
                                    >
                                        {availableIcons.map((ic) => (
                                            <option key={ic.value} value={ic.value}>
                                                {ic.label} ({ic.value})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="admin-form-field">
                                    <label>Badge / Highlight Tag</label>
                                    <input
                                        value={currentService.badge}
                                        onChange={(e) => setCurrentService({ ...currentService, badge: e.target.value })}
                                        placeholder="e.g. Top Popular, Best Rates, 24x7 Live"
                                    />
                                </div>
                                <div className="admin-form-field">
                                    <label>Display Sort Order</label>
                                    <input
                                        type="number"
                                        value={currentService.order}
                                        onChange={(e) => setCurrentService({ ...currentService, order: parseInt(e.target.value) || 1 })}
                                    />
                                </div>
                                <div className="admin-form-field">
                                    <label>Publication Status</label>
                                    <select
                                        value={currentService.status}
                                        onChange={(e) => setCurrentService({ ...currentService, status: e.target.value })}
                                    >
                                        <option value="Active">Active / Live</option>
                                        <option value="Draft">Draft</option>
                                        <option value="Disabled">Disabled</option>
                                    </select>
                                </div>
                            </div>

                            {/* Service Cover Artwork */}
                            <div className="admin-form-field full">
                                <label>Banner Artwork (Service Details Hero)</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    {currentService.image ? (
                                        <img
                                            src={currentService.image}
                                            alt=""
                                            style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--admin-line)' }}
                                        />
                                    ) : (
                                        <span
                                            style={{ width: '48px', height: '48px', borderRadius: '6px', border: '1px solid var(--admin-line)', flexShrink: 0, background: 'repeating-linear-gradient(45deg, #eef2f7, #eef2f7 6px, #e2e8f0 6px, #e2e8f0 12px)' }}
                                        ></span>
                                    )}
                                    <input
                                        value={currentService.image || ''}
                                        onChange={(e) => setCurrentService({ ...currentService, image: e.target.value })}
                                        placeholder="/assets/img/destination/... or ImageKit URL"
                                        style={{ flex: 1 }}
                                    />
                                    <ImageUpload
                                        folder="/wayouts/services"
                                        onUploaded={(url) => setCurrentService({ ...currentService, image: url })}
                                    />
                                </div>
                            </div>

                            {/* Short Card Description */}
                            <div className="admin-form-field full">
                                <label>Short Card Summary *</label>
                                <textarea
                                    required
                                    rows="2"
                                    value={currentService.desc}
                                    onChange={(e) => setCurrentService({ ...currentService, desc: e.target.value })}
                                    placeholder="Brief 1-2 sentence description shown on the grid card..."
                                />
                            </div>

                            {/* Overview */}
                            <div className="admin-form-field full">
                                <label>Detailed Service Overview</label>
                                <textarea
                                    rows="3"
                                    value={currentService.overview}
                                    onChange={(e) => setCurrentService({ ...currentService, overview: e.target.value })}
                                    placeholder="Full narrative explaining the offering on the service details page..."
                                />
                            </div>

                            {/* Features list */}
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <label style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--admin-ink)' }}>
                                        Experience Inclusions / Highlights
                                    </label>
                                    <button
                                        type="button"
                                        className="admin-upload-btn"
                                        style={{ height: '26px', padding: '0 8px', fontSize: '11px' }}
                                        onClick={() => setCurrentService({ ...currentService, features: [...(currentService.features || []), ''] })}
                                    >
                                        + Add Feature
                                    </button>
                                </div>
                                <div style={{ display: 'grid', gap: '8px' }}>
                                    {(currentService.features || []).map((feat, index) => (
                                        <div key={index} style={{ display: 'flex', gap: '8px' }}>
                                            <input
                                                value={feat}
                                                onChange={(e) => {
                                                    const next = [...(currentService.features || [])];
                                                    next[index] = e.target.value;
                                                    setCurrentService({ ...currentService, features: next });
                                                }}
                                                placeholder="e.g. Personalized stays tailored to your travel style"
                                                style={{ flex: 1, padding: '7px 10px', borderRadius: '6px', border: '1px solid var(--admin-line)', fontSize: '13px' }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const next = (currentService.features || []).filter((_, i) => i !== index);
                                                    setCurrentService({ ...currentService, features: next });
                                                }}
                                                style={{ border: '1px solid #fecaca', background: '#fee2e2', color: '#dc2626', borderRadius: '6px', width: '30px', height: '36px', cursor: 'pointer' }}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
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
                                    {saving ? 'Saving…' : modalMode === 'create' ? 'Create Service' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminShell>
    );
}
