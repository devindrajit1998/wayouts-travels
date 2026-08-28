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

const initialTeam = [
    {
        id: 'tm-1',
        name: 'Emily White',
        role: 'Travel Director & Founder',
        specialization: 'Luxury Escapes & Northern Himalayas',
        email: 'emily@wayouts.com',
        phone: '+91 98765 43210',
        tours: 18,
        experience: '12+ Years',
        image: '/assets/img/team/tst1.jpg',
        bio: 'Over a decade designing high-end bespoke holiday experiences across Kashmir, Ladakh, and international luxury retreats.',
        socialInstagram: 'https://instagram.com',
        socialLinkedin: 'https://linkedin.com',
        featured: true,
        status: 'Active',
    },
    {
        id: 'tm-2',
        name: 'Daniel Scott',
        role: 'Senior Expeditions Guide',
        specialization: 'Wildlife Safaris & Trekking',
        email: 'daniel@wayouts.com',
        phone: '+91 98765 43211',
        tours: 24,
        experience: '9+ Years',
        image: '/assets/img/team/1.jpg',
        bio: 'Certified wilderness first-responder leading high-altitude Himalayan treks and national park tiger safaris.',
        socialInstagram: 'https://instagram.com',
        socialLinkedin: 'https://linkedin.com',
        featured: true,
        status: 'Active',
    },
    {
        id: 'tm-3',
        name: 'Sarah Kim',
        role: 'Destination Specialist',
        specialization: 'Cultural Heritage & Royal Circuits',
        email: 'sarah@wayouts.com',
        phone: '+91 98765 43212',
        tours: 15,
        experience: '7+ Years',
        image: '/assets/img/team/3.jpg',
        bio: 'Specializing in historical architecture, culinary trails, and authentic cultural encounters in Rajasthan and South India.',
        socialInstagram: 'https://instagram.com',
        socialLinkedin: 'https://linkedin.com',
        featured: true,
        status: 'Active',
    },
    {
        id: 'tm-4',
        name: 'Michael Reed',
        role: 'Guest Experience & Concierge',
        specialization: 'VIP Logistics & Wellness',
        email: 'michael@wayouts.com',
        phone: '+91 98765 43213',
        tours: 11,
        experience: '6+ Years',
        image: '/assets/img/team/4.jpg',
        bio: 'Dedicated to ensuring seamless 24/7 airport handling, luxury villa stays, and bespoke on-ground hospitality.',
        socialInstagram: 'https://instagram.com',
        socialLinkedin: 'https://linkedin.com',
        featured: false,
        status: 'Active',
    },
];

const emptyMember = {
    name: '',
    role: 'Travel Advisor',
    specialization: 'Domestic & International Tours',
    email: '',
    phone: '',
    tours: 0,
    experience: '5+ Years',
    image: '/assets/img/team/1.jpg',
    bio: '',
    socialInstagram: '',
    socialLinkedin: '',
    featured: true,
    status: 'Active',
};

export default function AdminTeamPage() {
    const [teamList, setTeamList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [modalMode, setModalMode] = useState(null); // 'create' | 'edit' | null
    const [currentMember, setCurrentMember] = useState(emptyMember);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        getCollectionItems('team', initialTeam).then((data) => {
            if (isMounted) {
                setTeamList(data);
                setLoading(false);
            }
        });
        return () => {
            isMounted = false;
        };
    }, []);

    const filteredTeam = teamList.filter((m) => {
        const query = searchTerm.toLowerCase();
        return (
            (m.name || '').toLowerCase().includes(query) ||
            (m.role || '').toLowerCase().includes(query) ||
            (m.specialization || '').toLowerCase().includes(query) ||
            (m.email || '').toLowerCase().includes(query)
        );
    });

    function openCreate() {
        setCurrentMember({
            ...emptyMember,
            id: `tm-${Date.now()}`,
        });
        setModalMode('create');
        setMessage(null);
    }

    function openEdit(member) {
        setCurrentMember({
            ...emptyMember,
            ...member,
        });
        setModalMode('edit');
        setMessage(null);
    }

    async function handleStatusChange(member, newStatus) {
        try {
            await updateCollectionItem('team', member.id, { status: newStatus });
            setTeamList((prev) => prev.map((m) => (m.id === member.id ? { ...m, status: newStatus } : m)));
            setMessage({ type: 'success', text: `Status for "${member.name}" set to "${newStatus}".` });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update status: ' + error.message });
        }
    }

    async function handleDelete(member) {
        if (!window.confirm(`Are you sure you want to remove "${member.name}" from the team?`)) return;
        try {
            await deleteCollectionItem('team', member.id);
            setTeamList((prev) => prev.filter((m) => m.id !== member.id));
            setMessage({ type: 'success', text: `Team member "${member.name}" removed.` });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to delete member: ' + error.message });
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            if (modalMode === 'create') {
                const created = await addCollectionItem('team', currentMember);
                setTeamList((prev) => [...prev, created]);
                setMessage({ type: 'success', text: `Team member "${currentMember.name}" added successfully.` });
            } else {
                const updated = await updateCollectionItem('team', currentMember.id, currentMember);
                setTeamList((prev) => prev.map((m) => (m.id === currentMember.id ? { ...m, ...updated } : m)));
                setMessage({ type: 'success', text: `Profile for "${currentMember.name}" updated.` });
            }
            setModalMode(null);
        } catch (error) {
            alert('Failed to save team member: ' + error.message);
        } finally {
            setSaving(false);
        }
    }

    return (
        <AdminShell
            title="Team Experts & Guides"
            description="Manage travel consultants, mountain leaders, concierge guides, contact info, and showcase profiles."
        >
            {/* Toolbar */}
            <div className="admin-toolbar">
                <input
                    type="search"
                    className="admin-search"
                    placeholder="Search experts by name, role, specialization, email…"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="button" className="admin-primary-button" onClick={openCreate}>
                    <i className="fa-light fa-plus"></i> Add Team Expert
                </button>
            </div>

            {message && <div style={{ marginBottom: '14px' }} className={`admin-hero-message ${message.type}`}>{message.text}</div>}

            {/* Table */}
            {loading ? (
                <div className="admin-card admin-empty">Loading team profiles…</div>
            ) : filteredTeam.length === 0 ? (
                <div className="admin-card admin-empty">
                    <p>No team members found matching &quot;{searchTerm}&quot;.</p>
                </div>
            ) : (
                <div className="admin-card admin-table-wrap">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Expert Profile</th>
                                <th>Designation / Role</th>
                                <th>Specialization</th>
                                <th>Assigned Tours</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTeam.map((member) => (
                                <tr key={member.id || member.name}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <img
                                                src={member.image || '/assets/img/team/1.jpg'}
                                                alt=""
                                                style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--admin-line)' }}
                                            />
                                            <div>
                                                <strong>{member.name}</strong>
                                                <small style={{ display: 'block', color: 'var(--admin-muted)' }}>{member.email || member.phone || 'Staff'}</small>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="admin-badge" style={{ background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' }}>
                                            {member.role}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ fontSize: '13px', color: 'var(--admin-ink)' }}>
                                            {member.specialization || 'General Advisory'}
                                        </div>
                                        <small style={{ color: 'var(--admin-muted)' }}>Exp: {member.experience || '5+ Years'}</small>
                                    </td>
                                    <td>
                                        <span style={{ fontWeight: 600, color: 'var(--admin-ink)', fontSize: '13px' }}>
                                            {member.tours || 0} Guided Tours
                                        </span>
                                    </td>
                                    <td>
                                        <select
                                            value={member.status || 'Active'}
                                            onChange={(e) => handleStatusChange(member, e.target.value)}
                                            className={`admin-badge ${member.status === 'Active' ? '' : member.status === 'Away' ? 'pending' : 'cancelled'}`}
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
                                            <option value="Active">Active / On-Duty</option>
                                            <option value="Away">Away / On-Leave</option>
                                            <option value="Inactive">Inactive</option>
                                        </select>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                                            <button
                                                type="button"
                                                className="admin-upload-btn"
                                                style={{ height: '30px', padding: '0 10px' }}
                                                onClick={() => openEdit(member)}
                                                title="Edit Profile"
                                            >
                                                <i className="fa-light fa-pen-to-square"></i> Edit
                                            </button>
                                            <button
                                                type="button"
                                                className="admin-upload-btn"
                                                style={{ height: '30px', padding: '0 10px', color: '#dc2626', borderColor: '#fecaca' }}
                                                onClick={() => handleDelete(member)}
                                                title="Delete Profile"
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
                                    {modalMode === 'create' ? 'Add Team Expert' : `Edit: ${currentMember.name}`}
                                </h3>
                                <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--admin-muted)' }}>
                                    Configure staff name, designation, specialization, contact channels, and biography.
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
                                    <label>Full Name *</label>
                                    <input
                                        required
                                        value={currentMember.name}
                                        onChange={(e) => setCurrentMember({ ...currentMember, name: e.target.value })}
                                        placeholder="e.g. Emily White"
                                    />
                                </div>
                                <div className="admin-form-field">
                                    <label>Designation / Role *</label>
                                    <input
                                        required
                                        value={currentMember.role}
                                        onChange={(e) => setCurrentMember({ ...currentMember, role: e.target.value })}
                                        placeholder="e.g. Senior Guide, Travel Director"
                                    />
                                </div>
                                <div className="admin-form-field">
                                    <label>Specialization Domain</label>
                                    <input
                                        value={currentMember.specialization}
                                        onChange={(e) => setCurrentMember({ ...currentMember, specialization: e.target.value })}
                                        placeholder="e.g. Wildlife Safaris & Trekking"
                                    />
                                </div>
                                <div className="admin-form-field">
                                    <label>Experience Duration</label>
                                    <input
                                        value={currentMember.experience}
                                        onChange={(e) => setCurrentMember({ ...currentMember, experience: e.target.value })}
                                        placeholder="e.g. 8+ Years"
                                    />
                                </div>
                                <div className="admin-form-field">
                                    <label>Direct Email Address</label>
                                    <input
                                        type="email"
                                        value={currentMember.email}
                                        onChange={(e) => setCurrentMember({ ...currentMember, email: e.target.value })}
                                        placeholder="expert@wayouts.com"
                                    />
                                </div>
                                <div className="admin-form-field">
                                    <label>Phone / WhatsApp Number</label>
                                    <input
                                        value={currentMember.phone}
                                        onChange={(e) => setCurrentMember({ ...currentMember, phone: e.target.value })}
                                        placeholder="+91 98765 43210"
                                    />
                                </div>
                                <div className="admin-form-field">
                                    <label>Tours Handled Count</label>
                                    <input
                                        type="number"
                                        value={currentMember.tours}
                                        onChange={(e) => setCurrentMember({ ...currentMember, tours: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                                <div className="admin-form-field">
                                    <label>Duty Status</label>
                                    <select
                                        value={currentMember.status}
                                        onChange={(e) => setCurrentMember({ ...currentMember, status: e.target.value })}
                                    >
                                        <option value="Active">Active / On-Duty</option>
                                        <option value="Away">Away / On-Leave</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>

                            {/* Profile Picture */}
                            <div className="admin-form-field full">
                                <label>Profile Photo / Headshot</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <img
                                        src={currentMember.image || '/assets/img/team/1.jpg'}
                                        alt=""
                                        style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--admin-line)' }}
                                    />
                                    <input
                                        value={currentMember.image || ''}
                                        onChange={(e) => setCurrentMember({ ...currentMember, image: e.target.value })}
                                        placeholder="/assets/img/team/... or ImageKit URL"
                                        style={{ flex: 1 }}
                                    />
                                    <ImageUpload
                                        folder="/wayouts/team"
                                        onUploaded={(url) => setCurrentMember({ ...currentMember, image: url })}
                                    />
                                </div>
                            </div>

                            {/* Bio */}
                            <div className="admin-form-field full">
                                <label>Expert Bio & Background</label>
                                <textarea
                                    rows="3"
                                    value={currentMember.bio}
                                    onChange={(e) => setCurrentMember({ ...currentMember, bio: e.target.value })}
                                    placeholder="Brief background on travel experience, guided expeditions, and credentials..."
                                />
                            </div>

                            {/* Social Links */}
                            <div className="admin-form-grid">
                                <div className="admin-form-field">
                                    <label>Instagram URL</label>
                                    <input
                                        value={currentMember.socialInstagram}
                                        onChange={(e) => setCurrentMember({ ...currentMember, socialInstagram: e.target.value })}
                                        placeholder="https://instagram.com/..."
                                    />
                                </div>
                                <div className="admin-form-field">
                                    <label>LinkedIn URL</label>
                                    <input
                                        value={currentMember.socialLinkedin}
                                        onChange={(e) => setCurrentMember({ ...currentMember, socialLinkedin: e.target.value })}
                                        placeholder="https://linkedin.com/in/..."
                                    />
                                </div>
                            </div>

                            <div className="admin-form-field" style={{ alignContent: 'center' }}>
                                <label className="admin-setting-row" style={{ padding: '4px 0', border: 0 }}>
                                    <span>
                                        <strong>Feature on About & Home Page Carousel</strong>
                                        <small>Display in primary team expert swiper</small>
                                    </span>
                                    <input
                                        type="checkbox"
                                        checked={currentMember.featured}
                                        onChange={(e) => setCurrentMember({ ...currentMember, featured: e.target.checked })}
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
                                    {saving ? 'Saving…' : modalMode === 'create' ? 'Add Member' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminShell>
    );
}
