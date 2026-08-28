'use client';

import { useState, useEffect } from 'react';
import AdminShell from '../AdminShell';
import ImageUpload from '../../components/ImageUpload';
import { getDoc, setDoc, doc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

const defaultSettings = {
    // Brand & General
    agencyName: 'Wayouts Luxury Travels',
    tagline: 'Crafting Unforgettable Journeys Across India & Beyond',
    logoDark: '/assets/img/logo-dark.png',
    logoLight: '/assets/img/logo.png',
    favicon: '/assets/img/favicon.ico',
    primaryCurrency: 'INR (₹)',
    timezone: 'IST (UTC+05:30)',

    // Contact Info
    supportEmail: 'contact@wayouts.com',
    bookingHotline: '+91 98765 43210',
    whatsappNumber: '+91 98765 43210',
    headquartersAddress: '402, Signature One, S.G. Highway, Ahmedabad, Gujarat 380054, India',
    officeHours: 'Monday – Saturday: 9:30 AM – 7:30 PM',

    // Social Media Links
    instagramUrl: 'https://instagram.com/wayouts_travels',
    facebookUrl: 'https://facebook.com/wayoutstravels',
    youtubeUrl: 'https://youtube.com/@wayoutstravels',

    // Site Toggles & Features
    enableOnlineBookings: true,
    enableInstantWhatsAppInquiry: true,
    enableNewsletterPopup: true,
    enableSeasonalOffersBanner: false,
    seasonalBannerText: 'Diwali Early-Bird: Flat 15% Off On All Kashmir & Kerala Winter Packages! Use Code: DIWALI15',

    // SEO Defaults
    defaultMetaTitle: 'Wayouts — Luxury Travel & Adventure Tour Operator India',
    defaultMetaDescription: 'Discover handcrafted luxury holiday packages, private chauffeur tours, mountain expeditions, and tropical retreats with Wayouts Travels.',
    defaultKeywords: 'luxury tours india, kashmir holiday packages, kerala backwaters, rajasthan royal tour, travel agency india',
};

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState(defaultSettings);
    const [activeTab, setActiveTab] = useState('brand');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        let isMounted = true;
        async function fetchSettings() {
            try {
                if (db) {
                    const snap = await getDoc(doc(db, 'siteSettings', 'general'));
                    if (snap.exists() && isMounted) {
                        setSettings({ ...defaultSettings, ...snap.data() });
                    }
                }
            } catch (err) {
                console.warn('Could not load remote settings, using defaults:', err.message);
            } finally {
                if (isMounted) setLoading(false);
            }
        }
        fetchSettings();
        return () => {
            isMounted = false;
        };
    }, []);

    async function handleSave(e) {
        if (e) e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            if (db) {
                await setDoc(doc(db, 'siteSettings', 'general'), settings, { merge: true });
            }
            // Also store in localStorage as reliable client-side cache
            localStorage.setItem('wayouts_site_settings', JSON.stringify(settings));
            setMessage({ type: 'success', text: 'All settings and brand configurations saved successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to save settings: ' + error.message });
        } finally {
            setSaving(false);
        }
    }

    return (
        <AdminShell
            title="System & Brand Settings"
            description="Manage agency contact channels, logos, social profiles, SEO defaults, and website feature toggles."
        >
            {message && <div style={{ marginBottom: '14px' }} className={`admin-hero-message ${message.type}`}>{message.text}</div>}

            {/* Sub-Navigation Tabs */}
            <div className="admin-tabs" style={{ marginBottom: '20px' }}>
                <button
                    type="button"
                    className={`admin-tab ${activeTab === 'brand' ? 'active' : ''}`}
                    onClick={() => setActiveTab('brand')}
                >
                    <i className="fa-light fa-gem"></i> Brand & Logos
                </button>
                <button
                    type="button"
                    className={`admin-tab ${activeTab === 'contact' ? 'active' : ''}`}
                    onClick={() => setActiveTab('contact')}
                >
                    <i className="fa-light fa-address-book"></i> Contact Channels
                </button>
                <button
                    type="button"
                    className={`admin-tab ${activeTab === 'social' ? 'active' : ''}`}
                    onClick={() => setActiveTab('social')}
                >
                    <i className="fa-light fa-share-nodes"></i> Social Profiles
                </button>
                <button
                    type="button"
                    className={`admin-tab ${activeTab === 'toggles' ? 'active' : ''}`}
                    onClick={() => setActiveTab('toggles')}
                >
                    <i className="fa-light fa-sliders"></i> Features & Toggles
                </button>
                <button
                    type="button"
                    className={`admin-tab ${activeTab === 'seo' ? 'active' : ''}`}
                    onClick={() => setActiveTab('seo')}
                >
                    <i className="fa-light fa-chart-line"></i> Global SEO
                </button>
            </div>

            {loading ? (
                <div className="admin-card admin-empty">Loading settings configuration…</div>
            ) : (
                <form onSubmit={handleSave}>
                    {/* TAB 1: Brand & Logos */}
                    {activeTab === 'brand' && (
                        <div className="admin-card" style={{ display: 'grid', gap: '20px' }}>
                            <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--admin-ink)' }}>Brand Identity & Global Assets</h3>
                            <div className="admin-form-grid">
                                <div className="admin-form-field">
                                    <label>Agency / Brand Name *</label>
                                    <input
                                        required
                                        value={settings.agencyName}
                                        onChange={(e) => setSettings({ ...settings, agencyName: e.target.value })}
                                        placeholder="e.g. Wayouts Luxury Travels"
                                    />
                                </div>
                                <div className="admin-form-field">
                                    <label>Marketing Tagline</label>
                                    <input
                                        value={settings.tagline}
                                        onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                                        placeholder="e.g. Crafting Unforgettable Journeys..."
                                    />
                                </div>
                                <div className="admin-form-field">
                                    <label>Primary Currency</label>
                                    <input
                                        value={settings.primaryCurrency}
                                        onChange={(e) => setSettings({ ...settings, primaryCurrency: e.target.value })}
                                        placeholder="INR (₹)"
                                    />
                                </div>
                                <div className="admin-form-field">
                                    <label>Standard Operating Timezone</label>
                                    <input
                                        value={settings.timezone}
                                        onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                                        placeholder="IST (UTC+05:30)"
                                    />
                                </div>
                            </div>

                            {/* Logos Upload */}
                            <div style={{ display: 'grid', gap: '14px', borderTop: '1px solid var(--admin-line)', paddingTop: '16px' }}>
                                <div className="admin-form-field full">
                                    <label>Primary Logo (Dark Background)</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ background: '#09204c', padding: '6px 12px', borderRadius: '6px' }}>
                                            <img src={settings.logoLight} alt="" style={{ height: '24px', objectFit: 'contain' }} />
                                        </div>
                                        <input
                                            value={settings.logoLight}
                                            onChange={(e) => setSettings({ ...settings, logoLight: e.target.value })}
                                            style={{ flex: 1 }}
                                        />
                                        <ImageUpload
                                            folder="/wayouts/brand"
                                            onUploaded={(url) => setSettings({ ...settings, logoLight: url })}
                                        />
                                    </div>
                                </div>

                                <div className="admin-form-field full">
                                    <label>Alternative Logo (Light Background)</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ background: '#f8fafc', padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--admin-line)' }}>
                                            <img src={settings.logoDark} alt="" style={{ height: '24px', objectFit: 'contain' }} />
                                        </div>
                                        <input
                                            value={settings.logoDark}
                                            onChange={(e) => setSettings({ ...settings, logoDark: e.target.value })}
                                            style={{ flex: 1 }}
                                        />
                                        <ImageUpload
                                            folder="/wayouts/brand"
                                            onUploaded={(url) => setSettings({ ...settings, logoDark: url })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 2: Contact Channels */}
                    {activeTab === 'contact' && (
                        <div className="admin-card" style={{ display: 'grid', gap: '16px' }}>
                            <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--admin-ink)' }}>Customer Support & Office Details</h3>
                            <div className="admin-form-grid">
                                <div className="admin-form-field">
                                    <label>General Support Email *</label>
                                    <input
                                        type="email"
                                        required
                                        value={settings.supportEmail}
                                        onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                                        placeholder="contact@wayouts.com"
                                    />
                                </div>
                                <div className="admin-form-field">
                                    <label>Booking Phone Hotline *</label>
                                    <input
                                        required
                                        value={settings.bookingHotline}
                                        onChange={(e) => setSettings({ ...settings, bookingHotline: e.target.value })}
                                        placeholder="+91 98765 43210"
                                    />
                                </div>
                                <div className="admin-form-field">
                                    <label>WhatsApp Consultation Direct Number</label>
                                    <input
                                        value={settings.whatsappNumber}
                                        onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                                        placeholder="+91 98765 43210"
                                    />
                                </div>
                                <div className="admin-form-field">
                                    <label>Office Operating Hours</label>
                                    <input
                                        value={settings.officeHours}
                                        onChange={(e) => setSettings({ ...settings, officeHours: e.target.value })}
                                        placeholder="e.g. Monday – Saturday: 9:30 AM – 7:30 PM"
                                    />
                                </div>
                                <div className="admin-form-field full">
                                    <label>Headquarters Registered Office Address</label>
                                    <textarea
                                        rows="2"
                                        value={settings.headquartersAddress}
                                        onChange={(e) => setSettings({ ...settings, headquartersAddress: e.target.value })}
                                        placeholder="Complete physical office address..."
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 3: Social Profiles */}
                    {activeTab === 'social' && (
                        <div className="admin-card" style={{ display: 'grid', gap: '16px' }}>
                            <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--admin-ink)' }}>Social Media & Community Links</h3>
                            <div className="admin-form-grid">
                                <div className="admin-form-field">
                                    <label><i className="fa-brands fa-instagram" style={{ color: '#e1306c', marginRight: '6px' }}></i> Instagram URL</label>
                                    <input
                                        value={settings.instagramUrl}
                                        onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
                                        placeholder="https://instagram.com/..."
                                    />
                                </div>
                                <div className="admin-form-field">
                                    <label><i className="fa-brands fa-facebook" style={{ color: '#1877f2', marginRight: '6px' }}></i> Facebook Page URL</label>
                                    <input
                                        value={settings.facebookUrl}
                                        onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
                                        placeholder="https://facebook.com/..."
                                    />
                                </div>
                                <div className="admin-form-field">
                                    <label><i className="fa-brands fa-youtube" style={{ color: '#ff0000', marginRight: '6px' }}></i> YouTube Channel URL</label>
                                    <input
                                        value={settings.youtubeUrl}
                                        onChange={(e) => setSettings({ ...settings, youtubeUrl: e.target.value })}
                                        placeholder="https://youtube.com/@..."
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 4: Features & Toggles */}
                    {activeTab === 'toggles' && (
                        <div className="admin-card" style={{ display: 'grid', gap: '16px' }}>
                            <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--admin-ink)' }}>Website Feature Switches & Notification Banners</h3>
                            <div style={{ display: 'grid', gap: '10px' }}>
                                <label className="admin-setting-row">
                                    <span>
                                        <strong>Enable Online Booking Portal</strong>
                                        <small>Allow prospective travelers to submit direct reservations and package deposits.</small>
                                    </span>
                                    <input
                                        type="checkbox"
                                        checked={settings.enableOnlineBookings}
                                        onChange={(e) => setSettings({ ...settings, enableOnlineBookings: e.target.checked })}
                                    />
                                </label>

                                <label className="admin-setting-row">
                                    <span>
                                        <strong>Instant WhatsApp Quick Chat Widget</strong>
                                        <small>Display floating WhatsApp icon for direct traveler inquiries on mobile & desktop.</small>
                                    </span>
                                    <input
                                        type="checkbox"
                                        checked={settings.enableInstantWhatsAppInquiry}
                                        onChange={(e) => setSettings({ ...settings, enableInstantWhatsAppInquiry: e.target.checked })}
                                    />
                                </label>

                                <label className="admin-setting-row">
                                    <span>
                                        <strong>Newsletter Lead Generation Capture</strong>
                                        <small>Enable email capture forms across the footer and blog pages.</small>
                                    </span>
                                    <input
                                        type="checkbox"
                                        checked={settings.enableNewsletterPopup}
                                        onChange={(e) => setSettings({ ...settings, enableNewsletterPopup: e.target.checked })}
                                    />
                                </label>

                                <label className="admin-setting-row">
                                    <span>
                                        <strong>Seasonal Promotional Announcement Bar</strong>
                                        <small>Show top marquee/alert strip for festive discounts and seasonal deals.</small>
                                    </span>
                                    <input
                                        type="checkbox"
                                        checked={settings.enableSeasonalOffersBanner}
                                        onChange={(e) => setSettings({ ...settings, enableSeasonalOffersBanner: e.target.checked })}
                                    />
                                </label>

                                {settings.enableSeasonalOffersBanner && (
                                    <div className="admin-form-field full" style={{ marginTop: '8px' }}>
                                        <label>Promotional Announcement Message</label>
                                        <input
                                            value={settings.seasonalBannerText}
                                            onChange={(e) => setSettings({ ...settings, seasonalBannerText: e.target.value })}
                                            placeholder="e.g. Diwali Early-Bird: Flat 15% Off On All Kashmir & Kerala Winter Packages!"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* TAB 5: Global SEO */}
                    {activeTab === 'seo' && (
                        <div className="admin-card" style={{ display: 'grid', gap: '16px' }}>
                            <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--admin-ink)' }}>Search Engine Optimization & Metadata Defaults</h3>
                            <div className="admin-form-field full">
                                <label>Default Site Title Tag (&lt;title&gt;)</label>
                                <input
                                    value={settings.defaultMetaTitle}
                                    onChange={(e) => setSettings({ ...settings, defaultMetaTitle: e.target.value })}
                                    placeholder="Wayouts — Luxury Travel & Adventure Tour Operator India"
                                />
                            </div>
                            <div className="admin-form-field full">
                                <label>Default Meta Description</label>
                                <textarea
                                    rows="3"
                                    value={settings.defaultMetaDescription}
                                    onChange={(e) => setSettings({ ...settings, defaultMetaDescription: e.target.value })}
                                    placeholder="Brief description for Google search result snippets..."
                                />
                            </div>
                            <div className="admin-form-field full">
                                <label>Global Focus Keywords (Comma separated)</label>
                                <input
                                    value={settings.defaultKeywords}
                                    onChange={(e) => setSettings({ ...settings, defaultKeywords: e.target.value })}
                                    placeholder="luxury tours india, kashmir holiday packages, travel agency india"
                                />
                            </div>
                        </div>
                    )}

                    {/* Save Button Bar */}
                    <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <button
                            type="submit"
                            className="admin-primary-button"
                            disabled={saving}
                            style={{ padding: '10px 24px', fontSize: '14px' }}
                        >
                            <i className="fa-light fa-floppy-disk"></i> {saving ? 'Saving Settings…' : 'Save All Settings'}
                        </button>
                    </div>
                </form>
            )}
        </AdminShell>
    );
}
