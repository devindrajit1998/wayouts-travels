'use client';

import { useState, useEffect } from 'react';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

const defaultSettings = {
    enableInstantWhatsAppInquiry: true,
    whatsappNumber: '+91 98765 43210',
    enableSeasonalOffersBanner: false,
    seasonalBannerText: 'Diwali Early-Bird: Flat 15% Off On All Kashmir & Kerala Winter Packages! Use Code: DIWALI15',
};

export default function GlobalFeatures() {
    const [settings, setSettings] = useState(defaultSettings);
    const [bannerDismissed, setBannerDismissed] = useState(false);

    useEffect(() => {
        let isMounted = true;

        // Try local storage cache first for instant render
        try {
            const cached = localStorage.getItem('wayouts_site_settings');
            if (cached && isMounted) {
                setSettings((prev) => ({ ...prev, ...JSON.parse(cached) }));
            }
        } catch (e) {}

        // Then fetch latest from Firestore
        async function load() {
            try {
                if (db) {
                    const snap = await getDoc(doc(db, 'siteSettings', 'general'));
                    if (snap.exists() && isMounted) {
                        setSettings((prev) => ({ ...prev, ...snap.data() }));
                    }
                }
            } catch (err) {
                // Silently fallback to defaults
            }
        }
        load();

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        const isBannerActive = Boolean(settings.enableSeasonalOffersBanner && !bannerDismissed);
        if (isBannerActive) {
            document.documentElement.style.setProperty('--announcement-bar-height', '40px');
            document.body.classList.add('has-announcement-bar');
        } else {
            document.documentElement.style.setProperty('--announcement-bar-height', '0px');
            document.body.classList.remove('has-announcement-bar');
        }
        return () => {
            document.documentElement.style.setProperty('--announcement-bar-height', '0px');
            document.body.classList.remove('has-announcement-bar');
        };
    }, [settings.enableSeasonalOffersBanner, bannerDismissed]);

    const whatsappDigits = (settings.whatsappNumber || '+919876543210').replace(/\D/g, '');
    const whatsappLink = `https://wa.me/${whatsappDigits}?text=${encodeURIComponent('Hello Wayouts Travels, I would like to inquire about a tour package.')}`;

    return (
        <>
            {/* 1. Promotional Announcement Bar (Top of Website) */}
            {settings.enableSeasonalOffersBanner && !bannerDismissed && (
                <aside
                    aria-label="Seasonal announcement"
                    style={{
                        background: 'linear-gradient(90deg, #09204c 0%, #00aeb6 50%, #09204c 100%)',
                        color: '#ffffff',
                        height: '40px',
                        padding: '0 16px',
                        fontSize: '13px',
                        fontWeight: 600,
                        textAlign: 'center',
                        position: 'relative',
                        zIndex: 99999,
                        letterSpacing: '0.3px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                    }}
                >
                    <span>
                        <i className="fa-solid fa-sparkles" style={{ color: '#fef08a', marginRight: '6px' }}></i>
                        {settings.seasonalBannerText || 'Exclusive Seasonal Offers Available!'}
                    </span>
                    <a
                        href="/tours"
                        style={{
                            background: 'rgba(255,255,255,0.2)',
                            color: '#fff',
                            padding: '2px 10px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            textTransform: 'uppercase',
                            fontWeight: 700,
                            letterSpacing: '0.5px',
                            textDecoration: 'none',
                        }}
                    >
                        Explore Tours →
                    </a>
                    <button
                        type="button"
                        onClick={() => setBannerDismissed(true)}
                        aria-label="Dismiss announcement"
                        style={{
                            position: 'absolute',
                            right: '12px',
                            background: 'transparent',
                            border: 0,
                            color: 'rgba(255,255,255,0.8)',
                            cursor: 'pointer',
                            fontSize: '14px',
                            lineHeight: 1,
                        }}
                    >
                        ✕
                    </button>
                </aside>
            )}

            {/* 2. Instant WhatsApp Floating Widget */}
            {settings.enableInstantWhatsAppInquiry && (
                <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Chat on WhatsApp"
                    style={{
                        position: 'fixed',
                        bottom: '28px',
                        right: '28px',
                        zIndex: 99998,
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        background: '#25d366',
                        color: '#ffffff',
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: '30px',
                        boxShadow: '0 6px 20px rgba(37, 211, 102, 0.45)',
                        textDecoration: 'none',
                        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.1)';
                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(37, 211, 102, 0.6)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(37, 211, 102, 0.45)';
                    }}
                >
                    <i className="fa-brands fa-whatsapp"></i>
                </a>
            )}
        </>
    );
}
