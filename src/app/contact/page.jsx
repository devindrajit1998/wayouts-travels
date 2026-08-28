'use client';

import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageBanner from '../components/PageBanner';
import ContactForm from '../components/ContactForm';
import { defaultPagesContent, getPagesContent } from '../../lib/pagesContent';

export default function ContactPage() {
    const [pageMeta, setPageMeta] = useState(defaultPagesContent.contact);

    useEffect(() => {
        let isMounted = true;
        getPagesContent().then((data) => {
            if (isMounted && data?.contact) {
                setPageMeta(data.contact);
            }
        });
        return () => {
            isMounted = false;
        };
    }, []);

    const contactMeta = [
        { icon: 'fa-solid fa-phone-volume', text: pageMeta.phone || '+1 123 4567 8910' },
        { icon: 'fa-solid fa-envelope', text: pageMeta.email || 'info@wayouts.com' },
        { icon: 'fa-solid fa-location-dot', text: pageMeta.address || '113893 Noble Blvd. NY, USA' },
    ];

    return (
        <>
            <Navbar active="contact" />
            <div id="smooth-content">
                <main className="o-hidden">
                    <PageBanner
                        subtitle={pageMeta.bannerSubtitle || 'Talk To Our Team'}
                        title={pageMeta.bannerTitle || 'Get personalized travel support'}
                        highlight={pageMeta.bannerHighlight || 'today!'}
                        bgImage={pageMeta.bannerImage || '/assets/img/destination/03.jpg'}
                        postMeta={contactMeta}
                    />
                    <ContactForm headline={pageMeta.formHeadline} />
                </main>
                <Footer />
            </div>
        </>
    );
}
