'use client';

import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageBanner from '../components/PageBanner';
import ServicesGrid from '../components/ServicesGrid';
import { defaultPagesContent, getPagesContent } from '../../lib/pagesContent';

export default function ServicesPage() {
    const [pageMeta, setPageMeta] = useState(defaultPagesContent.services);

    useEffect(() => {
        let isMounted = true;
        getPagesContent().then((data) => {
            if (isMounted && data?.services) {
                setPageMeta(data.services);
            }
        });
        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <>
            <Navbar active="services" />
            <div id="smooth-content">
                <main className="o-hidden">
                    <PageBanner
                        subtitle={pageMeta.bannerSubtitle || 'PREMIUM TRAVEL SERVICES'}
                        title={pageMeta.bannerTitle || 'Discover services that make'}
                        highlight={pageMeta.bannerHighlight || 'travel effortless'}
                        bgImage={pageMeta.bannerImage || '/assets/img/destination/05.jpg'}
                    />
                    <ServicesGrid quoteText={pageMeta.quoteText} />
                </main>
                <Footer />
            </div>
        </>
    );
}
