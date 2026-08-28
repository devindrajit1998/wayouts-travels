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

const initialTours = [
    {
        id: 'tour-1',
        name: 'Maldives Paradise Escape',
        bannerSubtitle: 'Explore Our Tours',
        destination: 'Maldives, Asia',
        duration: '6 Days - 5 Nights',
        tourDate: '26.05.2027',
        price: '₹39,999',
        rating: '4.9',
        reviewsCount: '128',
        groupSize: '15 - 20 People',
        featured: true,
        image: '/assets/img/destination/01.jpg',
        gallery: [
            '/assets/img/destination/a.jpg',
            '/assets/img/destination/b.jpg',
            '/assets/img/destination/c.jpg',
            '/assets/img/destination/d.jpg'
        ],
        overview: 'Escape to pure paradise with our Maldives Paradise Escape tour. Experience crystal-clear turquoise waters, white sandy beaches, and luxurious island resorts. This carefully designed package offers the perfect balance of relaxation, adventure, and unforgettable tropical beauty.',
        highlights: [
            'Stay in a five star beachfront resort',
            'Direct access to private beaches',
            'Sunset cruises and dolphin watching'
        ],
        bestTimeToVisit: 'November – April (dry season, best weather conditions)',
        whoIsItFor: 'Couples, honeymooners, families, and luxury travel lovers',
        included: ['Daily breakfast', 'Guided island activities', 'Welcome assistance on arrival'],
        excluded: ['International flights', 'Personal expenses', 'Optional tours & activities'],
        status: 'Completed',
    },
    {
        id: 'tour-2',
        name: 'Dubai Luxury Journey',
        bannerSubtitle: 'Explore Our Tours',
        destination: 'Dubai, UAE',
        duration: '5 Days - 4 Nights',
        tourDate: '15.09.2026',
        price: '₹55,999',
        rating: '4.8',
        reviewsCount: '94',
        groupSize: '12 - 16 People',
        featured: true,
        image: '/assets/img/destination/03.jpg',
        gallery: [
            '/assets/img/destination/03.jpg',
            '/assets/img/destination/a.jpg',
            '/assets/img/destination/b.jpg'
        ],
        overview: 'Discover futuristic architecture, luxury desert safaris, and vibrant gold souks in modern Dubai.',
        highlights: ['Burj Khalifa Observation Deck', 'Desert Safari with BBQ Dinner', 'Dubai Marina Yacht Tour'],
        bestTimeToVisit: 'October – April (pleasant desert climate)',
        whoIsItFor: 'Luxury seekers, shoppers, families, and architectural enthusiasts',
        included: ['4-Star Luxury Hotel', 'Desert Safari with Transfers', 'City Sightseeing Tour'],
        excluded: ['Visa Fee', 'International Airfare'],
        status: 'Active',
    },
    {
        id: 'tour-3',
        name: 'Canadian Nature Tour',
        bannerSubtitle: 'Explore Our Tours',
        destination: 'Banff, Canada',
        duration: '7 Days - 6 Nights',
        tourDate: '10.07.2026',
        price: '₹63,999',
        rating: '4.9',
        reviewsCount: '86',
        groupSize: '10 - 15 People',
        featured: true,
        image: '/assets/img/destination/02.jpg',
        gallery: [
            '/assets/img/destination/02.jpg',
            '/assets/img/destination/c.jpg'
        ],
        overview: 'Immerse yourself in the breathtaking Canadian Rockies, turquoise glacier lakes, and alpine wildlife trails.',
        highlights: ['Lake Louise & Moraine Lake Tour', 'Icefields Parkway Scenic Drive', 'Banff Gondola Ride'],
        bestTimeToVisit: 'June – September (hiking and emerald lakes season)',
        whoIsItFor: 'Hikers, photographers, nature lovers, and adventure seekers',
        included: ['Lodge Accommodation', 'Park Entry Permits', 'Professional Mountain Guide'],
        excluded: ['Flight Tickets', 'Personal Gear'],
        status: 'Active',
    },
    {
        id: 'tour-4',
        name: 'Greek Paradise Tour',
        bannerSubtitle: 'Explore Our Tours',
        destination: 'Santorini, Greece',
        duration: '7 Days - 6 Nights',
        tourDate: '18.06.2026',
        price: '₹71,999',
        rating: '4.8',
        reviewsCount: '112',
        groupSize: '12 - 18 People',
        featured: false,
        image: '/assets/img/destination/05.jpg',
        gallery: [
            '/assets/img/destination/05.jpg',
            '/assets/img/destination/d.jpg'
        ],
        overview: 'Wander whitewashed cliffside villages, azure waters, volcanic beaches, and world-famous Aegean sunsets.',
        highlights: ['Oia Sunset Walking Tour', 'Catamaran Caldera Cruise', 'Local Wine Tasting Tour'],
        bestTimeToVisit: 'May – October (warm Aegean sunshine)',
        whoIsItFor: 'Couples, honeymooners, culture lovers, and foodies',
        included: ['Boutique Hotel Stay', 'Daily Continental Breakfast', 'Catamaran Cruise with Lunch'],
        excluded: ['Airfare', 'Personal Shopping'],
        status: 'Draft',
    },
];

const emptyTour = {
    name: '',
    bannerSubtitle: 'Explore Our Tours',
    destination: '',
    duration: '6 Days - 5 Nights',
    tourDate: '26.05.2027',
    price: '₹49,999',
    rating: '4.9',
    reviewsCount: '50',
    groupSize: '15 - 20 People',
    featured: false,
    image: '/assets/img/destination/01.jpg',
    gallery: [
        '/assets/img/destination/a.jpg',
        '/assets/img/destination/b.jpg',
        '/assets/img/destination/c.jpg',
        '/assets/img/destination/d.jpg'
    ],
    overview: '',
    highlights: [''],
    bestTimeToVisit: '',
    whoIsItFor: '',
    included: [''],
    excluded: [''],
    status: 'Active',
};

export default function AdminToursPage() {
    const [toursList, setToursList] = useState([]);
    const [destinationsList, setDestinationsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [modalMode, setModalMode] = useState(null); // 'create' | 'edit' | null
    const [currentTour, setCurrentTour] = useState(emptyTour);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        Promise.all([
            getCollectionItems('tours', initialTours),
            getCollectionItems('destinations', [
                { name: 'Kashmir & Ladakh', region: 'North India' },
                { name: 'Kerala & Backwaters', region: 'South India' },
                { name: 'Rajasthan & Golden Triangle', region: 'North India' },
                { name: 'Goa Coastline', region: 'West India' },
                { name: 'Sikkim & Darjeeling', region: 'East & Northeast India' },
                { name: 'Andaman & Nicobar Islands', region: 'Islands & Coastal India' },
            ]),
        ]).then(([toursData, destsData]) => {
            if (isMounted) {
                setToursList(toursData);
                setDestinationsList(destsData);
                setLoading(false);
            }
        });
        return () => {
            isMounted = false;
        };
    }, []);

    const filteredTours = toursList.filter((t) => {
        const query = searchTerm.toLowerCase();
        return (
            (t.name || '').toLowerCase().includes(query) ||
            (t.destination || '').toLowerCase().includes(query) ||
            (t.price || '').toLowerCase().includes(query)
        );
    });

    function openCreate() {
        setCurrentTour({ ...emptyTour, id: `tour-${Date.now()}` });
        setModalMode('create');
        setMessage(null);
    }

    function openEdit(tour) {
        setCurrentTour({
            ...emptyTour,
            ...tour,
            highlights: tour.highlights?.length ? tour.highlights : [''],
            included: tour.included?.length ? tour.included : [''],
            excluded: tour.excluded?.length ? tour.excluded : [''],
            gallery: tour.gallery || [],
        });
        setModalMode('edit');
        setMessage(null);
    }

    async function handleStatusChange(tour, newStatus) {
        try {
            await updateCollectionItem('tours', tour.id, { status: newStatus });
            setToursList((prev) => prev.map((t) => (t.id === tour.id ? { ...t, status: newStatus } : t)));
            setMessage({ type: 'success', text: `Status for "${tour.name}" changed to "${newStatus}".` });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update status: ' + error.message });
        }
    }

    async function handleDelete(tour) {
        if (!window.confirm(`Are you sure you want to delete "${tour.name}"?`)) return;
        try {
            await deleteCollectionItem('tours', tour.id);
            setToursList((prev) => prev.filter((t) => t.id !== tour.id));
            setMessage({ type: 'success', text: `Tour "${tour.name}" deleted successfully.` });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to delete: ' + error.message });
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        // Filter out blank array items
        const cleanPayload = {
            ...currentTour,
            highlights: currentTour.highlights.filter((h) => h && h.trim()),
            included: currentTour.included.filter((i) => i && i.trim()),
            excluded: currentTour.excluded.filter((e) => e && e.trim()),
        };

        try {
            if (modalMode === 'create') {
                const created = await addCollectionItem('tours', cleanPayload);
                setToursList((prev) => [created, ...prev]);
                setMessage({ type: 'success', text: `Tour "${cleanPayload.name}" created and published.` });
            } else {
                const updated = await updateCollectionItem('tours', cleanPayload.id, cleanPayload);
                setToursList((prev) => prev.map((t) => (t.id === cleanPayload.id ? { ...t, ...updated } : t)));
                setMessage({ type: 'success', text: `Tour "${cleanPayload.name}" updated successfully.` });
            }
            setModalMode(null);
        } catch (error) {
            alert('Failed to save tour: ' + error.message);
        } finally {
            setSaving(false);
        }
    }

    function updateArrayItem(field, index, value) {
        const next = [...(currentTour[field] || [])];
        next[index] = value;
        setCurrentTour({ ...currentTour, [field]: next });
    }

    function addArrayItem(field) {
        setCurrentTour({ ...currentTour, [field]: [...(currentTour[field] || []), ''] });
    }

    function removeArrayItem(field, index) {
        const next = (currentTour[field] || []).filter((_, i) => i !== index);
        setCurrentTour({ ...currentTour, [field]: next });
    }

    return (
        <AdminShell
            title="Tours & Packages"
            description="Create, edit, organize itineraries, pricing, and live availability for all travel packages."
        >
            {/* Toolbar */}
            <div className="admin-toolbar">
                <input
                    type="search"
                    className="admin-search"
                    placeholder="Search tours by name, destination, price…"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="button" className="admin-primary-button" onClick={openCreate}>
                    <i className="fa-light fa-plus"></i> Add New Tour Package
                </button>
            </div>

            {message && <div style={{ marginBottom: '14px' }} className={`admin-hero-message ${message.type}`}>{message.text}</div>}

            {/* Table */}
            {loading ? (
                <div className="admin-card admin-empty">Loading tours database…</div>
            ) : filteredTours.length === 0 ? (
                <div className="admin-card admin-empty">
                    <p>No tours found matching &quot;{searchTerm}&quot;.</p>
                </div>
            ) : (
                <div className="admin-card admin-table-wrap">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Tour Package</th>
                                <th>Destination</th>
                                <th>Duration</th>
                                <th>Price (INR)</th>
                                <th>Rating</th>
                                <th>Featured</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTours.map((tour) => (
                                <tr key={tour.id || tour.name}>
                                    <td>
                                        <div className="admin-list-main">
                                            <img
                                                className="admin-thumb"
                                                src={tour.image || '/assets/img/destination/01.jpg'}
                                                alt=""
                                            />
                                            <div>
                                                <strong>{tour.name}</strong>
                                                {tour.groupSize && (
                                                    <span style={{ display: 'block', fontSize: '11px', color: 'var(--admin-muted)' }}>
                                                        {tour.groupSize}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td>{tour.destination}</td>
                                    <td>{tour.duration}</td>
                                    <td>
                                        <strong style={{ color: 'var(--admin-primary)' }}>{tour.price}</strong>
                                    </td>
                                    <td>
                                        <span className="admin-rating">★ {tour.rating || '4.9'}</span>
                                    </td>
                                    <td>
                                        <span className={`admin-badge ${tour.featured ? '' : 'pending'}`}>
                                            {tour.featured ? 'Yes' : 'No'}
                                        </span>
                                    </td>
                                    <td>
                                        <select
                                            value={tour.status || 'Active'}
                                            onChange={(e) => handleStatusChange(tour, e.target.value)}
                                            className={`admin-badge ${tour.status === 'Active' ? '' : tour.status === 'Completed' ? 'completed-badge' : tour.status === 'Draft' ? 'pending' : 'cancelled'}`}
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
                                            <option value="Completed">Completed</option>
                                            <option value="Draft">Draft</option>
                                            <option value="Sold Out">Sold Out</option>
                                        </select>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                                            <button
                                                type="button"
                                                className="admin-upload-btn"
                                                style={{ height: '30px', padding: '0 10px' }}
                                                onClick={() => openEdit(tour)}
                                                title="Edit Tour Package"
                                            >
                                                <i className="fa-light fa-pen-to-square"></i> Edit
                                            </button>
                                            <button
                                                type="button"
                                                className="admin-upload-btn"
                                                style={{ height: '30px', padding: '0 10px', color: '#dc2626', borderColor: '#fecaca' }}
                                                onClick={() => handleDelete(tour)}
                                                title="Delete Tour"
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

            {/* Comprehensive Create / Edit Modal */}
            {modalMode && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(9, 32, 76, 0.65)', zIndex: 2000, display: 'grid', placeItems: 'center', padding: '20px', overflowY: 'auto' }}>
                    <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', width: 'min(760px, 100%)', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 60px rgba(0,0,0,0.3)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--admin-line)', paddingBottom: '12px', marginBottom: '16px' }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--admin-ink)' }}>
                                    {modalMode === 'create' ? 'Add New Tour Package' : `Edit: ${currentTour.name}`}
                                </h3>
                                <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--admin-muted)' }}>
                                    Configure marketing details, live pricing in INR (₹), highlights, and inclusions.
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
                            {/* Basic Info */}
                            <div className="admin-form-grid">
                                <div className="admin-form-field">
                                    <label>Tour Title *</label>
                                    <input
                                        required
                                        value={currentTour.name}
                                        onChange={(e) => setCurrentTour({ ...currentTour, name: e.target.value })}
                                        placeholder="e.g. Maldives Paradise Escape"
                                    />
                                </div>
                                <div className="admin-form-field">
                                    <label>Destination Location *</label>
                                    <select
                                        required
                                        value={currentTour.destination}
                                        onChange={(e) => setCurrentTour({ ...currentTour, destination: e.target.value })}
                                    >
                                        <option value="">-- Select Destination --</option>
                                        {destinationsList.map((d) => {
                                            const val = d.region ? `${d.name} (${d.region})` : d.name;
                                            return (
                                                <option key={d.id || d.name} value={val}>
                                                    {d.name} {d.region ? `— ${d.region}` : ''}
                                                </option>
                                            );
                                        })}
                                        {currentTour.destination && !destinationsList.some((d) => `${d.name} (${d.region})` === currentTour.destination || d.name === currentTour.destination) && (
                                            <option value={currentTour.destination}>{currentTour.destination}</option>
                                        )}
                                    </select>
                                </div>
                                <div className="admin-form-field">
                                    <label>Duration *</label>
                                    <input
                                        required
                                        value={currentTour.duration}
                                        onChange={(e) => setCurrentTour({ ...currentTour, duration: e.target.value })}
                                        placeholder="e.g. 6 Days - 5 Nights"
                                    />
                                </div>
                                <div className="admin-form-field">
                                    <label>Price in INR (₹) *</label>
                                    <input
                                        required
                                        value={currentTour.price}
                                        onChange={(e) => setCurrentTour({ ...currentTour, price: e.target.value })}
                                        placeholder="e.g. ₹39,999"
                                    />
                                </div>
                                <div className="admin-form-field">
                                    <label>Group Size</label>
                                    <input
                                        value={currentTour.groupSize}
                                        onChange={(e) => setCurrentTour({ ...currentTour, groupSize: e.target.value })}
                                        placeholder="e.g. 12 People Max"
                                    />
                                </div>
                                <div className="admin-form-field">
                                    <label>Star Rating</label>
                                    <input
                                        value={currentTour.rating}
                                        onChange={(e) => setCurrentTour({ ...currentTour, rating: e.target.value })}
                                        placeholder="e.g. 4.9"
                                    />
                                </div>
                                <div className="admin-form-field">
                                    <label>Status</label>
                                    <select
                                        value={currentTour.status}
                                        onChange={(e) => setCurrentTour({ ...currentTour, status: e.target.value })}
                                    >
                                        <option value="Active">Active / Published</option>
                                        <option value="Draft">Draft / Hidden</option>
                                        <option value="Sold Out">Sold Out</option>
                                    </select>
                                </div>
                                <div className="admin-form-field" style={{ alignContent: 'center' }}>
                                    <label className="admin-setting-row" style={{ padding: '4px 0', border: 0 }}>
                                        <span>
                                            <strong>Featured Tour</strong>
                                            <small>Highlight on Home page</small>
                                        </span>
                                        <input
                                            type="checkbox"
                                            checked={currentTour.featured}
                                            onChange={(e) => setCurrentTour({ ...currentTour, featured: e.target.checked })}
                                        />
                                    </label>
                                </div>
                            </div>

                            {/* Featured Image */}
                            <div className="admin-form-field full">
                                <label>Featured Thumbnail Image</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <img
                                        src={currentTour.image || '/assets/img/destination/01.jpg'}
                                        alt=""
                                        style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--admin-line)' }}
                                    />
                                    <input
                                        value={currentTour.image || ''}
                                        onChange={(e) => setCurrentTour({ ...currentTour, image: e.target.value })}
                                        placeholder="/assets/img/... or ImageKit URL"
                                        style={{ flex: 1 }}
                                    />
                                    <ImageUpload
                                        folder="/wayouts/tours"
                                        onUploaded={(url) => setCurrentTour({ ...currentTour, image: url })}
                                    />
                                </div>
                            </div>

                            {/* Overview */}
                            <div className="admin-form-field full">
                                <label>Tour Overview Narrative</label>
                                <textarea
                                    rows="3"
                                    value={currentTour.overview}
                                    onChange={(e) => setCurrentTour({ ...currentTour, overview: e.target.value })}
                                    placeholder="Describe the overall journey, experience, and destination atmosphere..."
                                />
                            </div>

                            {/* Key Highlights */}
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <label style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--admin-ink)' }}>
                                        Key Highlights
                                    </label>
                                    <button
                                        type="button"
                                        className="admin-upload-btn"
                                        style={{ height: '26px', padding: '0 8px', fontSize: '11px' }}
                                        onClick={() => addArrayItem('highlights')}
                                    >
                                        + Add Highlight
                                    </button>
                                </div>
                                <div style={{ display: 'grid', gap: '6px' }}>
                                    {currentTour.highlights.map((highlight, index) => (
                                        <div key={index} style={{ display: 'flex', gap: '8px' }}>
                                            <input
                                                value={highlight}
                                                onChange={(e) => updateArrayItem('highlights', index, e.target.value)}
                                                placeholder="e.g. Stay in 5-star ocean villa"
                                                style={{ flex: 1, padding: '7px 10px', borderRadius: '6px', border: '1px solid var(--admin-line)', fontSize: '13px' }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeArrayItem('highlights', index)}
                                                style={{ border: '1px solid #fecaca', background: '#fee2e2', color: '#dc2626', borderRadius: '6px', width: '32px', cursor: 'pointer' }}
                                                title="Remove highlight"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Inclusions & Exclusions */}
                            <div className="admin-form-grid">
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                        <label style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--admin-ink)' }}>
                                            Included
                                        </label>
                                        <button
                                            type="button"
                                            className="admin-upload-btn"
                                            style={{ height: '26px', padding: '0 8px', fontSize: '11px' }}
                                            onClick={() => addArrayItem('included')}
                                        >
                                            + Add
                                        </button>
                                    </div>
                                    <div style={{ display: 'grid', gap: '6px' }}>
                                        {currentTour.included.map((item, index) => (
                                            <div key={index} style={{ display: 'flex', gap: '8px' }}>
                                                <input
                                                    value={item}
                                                    onChange={(e) => updateArrayItem('included', index, e.target.value)}
                                                    placeholder="e.g. Airport Transfers"
                                                    style={{ flex: 1, padding: '7px 10px', borderRadius: '6px', border: '1px solid var(--admin-line)', fontSize: '13px' }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeArrayItem('included', index)}
                                                    style={{ border: '1px solid #fecaca', background: '#fee2e2', color: '#dc2626', borderRadius: '6px', width: '30px', cursor: 'pointer' }}
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                        <label style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--admin-ink)' }}>
                                            Excluded
                                        </label>
                                        <button
                                            type="button"
                                            className="admin-upload-btn"
                                            style={{ height: '26px', padding: '0 8px', fontSize: '11px' }}
                                            onClick={() => addArrayItem('excluded')}
                                        >
                                            + Add
                                        </button>
                                    </div>
                                    <div style={{ display: 'grid', gap: '6px' }}>
                                        {currentTour.excluded.map((item, index) => (
                                            <div key={index} style={{ display: 'flex', gap: '8px' }}>
                                                <input
                                                    value={item}
                                                    onChange={(e) => updateArrayItem('excluded', index, e.target.value)}
                                                    placeholder="e.g. Personal Expenses"
                                                    style={{ flex: 1, padding: '7px 10px', borderRadius: '6px', border: '1px solid var(--admin-line)', fontSize: '13px' }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeArrayItem('excluded', index)}
                                                    style={{ border: '1px solid #fecaca', background: '#fee2e2', color: '#dc2626', borderRadius: '6px', width: '30px', cursor: 'pointer' }}
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Additional Details from Screenshot */}
                            <div className="admin-form-grid">
                                <div className="admin-form-field">
                                    <label>Tour Date *</label>
                                    <input
                                        value={currentTour.tourDate || ''}
                                        onChange={(e) => setCurrentTour({ ...currentTour, tourDate: e.target.value })}
                                        placeholder="e.g. 26.05.2027"
                                    />
                                </div>
                                <div className="admin-form-field">
                                    <label>Banner Subtitle</label>
                                    <input
                                        value={currentTour.bannerSubtitle || ''}
                                        onChange={(e) => setCurrentTour({ ...currentTour, bannerSubtitle: e.target.value })}
                                        placeholder="e.g. Explore Our Tours"
                                    />
                                </div>
                                <div className="admin-form-field full">
                                    <label>Best Time to Visit</label>
                                    <input
                                        value={currentTour.bestTimeToVisit || ''}
                                        onChange={(e) => setCurrentTour({ ...currentTour, bestTimeToVisit: e.target.value })}
                                        placeholder="e.g. November – April (dry season, best weather conditions)"
                                    />
                                </div>
                                <div className="admin-form-field full">
                                    <label>Who is it for?</label>
                                    <input
                                        value={currentTour.whoIsItFor || ''}
                                        onChange={(e) => setCurrentTour({ ...currentTour, whoIsItFor: e.target.value })}
                                        placeholder="e.g. Couples, honeymooners, families, and luxury travel lovers"
                                    />
                                </div>
                            </div>

                            {/* Gallery Images (Bottom Swiper Carousel) */}
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <label style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--admin-ink)' }}>
                                        Tour Bottom Gallery (Image Showcase)
                                    </label>
                                    <button
                                        type="button"
                                        className="admin-upload-btn"
                                        style={{ height: '26px', padding: '0 8px', fontSize: '11px' }}
                                        onClick={() => addArrayItem('gallery')}
                                    >
                                        + Add Image URL
                                    </button>
                                </div>
                                <div style={{ display: 'grid', gap: '8px' }}>
                                    {(currentTour.gallery || []).map((imgUrl, index) => (
                                        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            {imgUrl ? (
                                                <img src={imgUrl} alt="" style={{ width: '38px', height: '38px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--admin-line)' }} />
                                            ) : (
                                                <span style={{ width: '38px', height: '38px', background: '#e2e8f0', borderRadius: '4px' }}></span>
                                            )}
                                            <input
                                                value={imgUrl}
                                                onChange={(e) => updateArrayItem('gallery', index, e.target.value)}
                                                placeholder="/assets/img/destination/... or ImageKit URL"
                                                style={{ flex: 1, padding: '7px 10px', borderRadius: '6px', border: '1px solid var(--admin-line)', fontSize: '13px' }}
                                            />
                                            <ImageUpload
                                                folder="/wayouts/tours"
                                                onUploaded={(url) => updateArrayItem('gallery', index, url)}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeArrayItem('gallery', index)}
                                                style={{ border: '1px solid #fecaca', background: '#fee2e2', color: '#dc2626', borderRadius: '6px', width: '30px', height: '36px', cursor: 'pointer' }}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
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
                                    {saving ? 'Saving Tour…' : modalMode === 'create' ? 'Publish Tour Package' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminShell>
    );
}
