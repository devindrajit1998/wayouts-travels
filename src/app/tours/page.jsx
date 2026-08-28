'use client';

import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageBanner from '../components/PageBanner';
import ToursGrid from '../components/ToursGrid';
import { defaultPagesContent, getPagesContent } from '../../lib/pagesContent';

export default function ToursPage() {
    const [pageMeta, setPageMeta] = useState(defaultPagesContent.tours);

    useEffect(() => {
        let isMounted = true;
        getPagesContent().then((data) => {
            if (isMounted && data?.tours) {
                setPageMeta(data.tours);
            }
        });
        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <>
            <Navbar active="tours" />
            <div id="smooth-content">
                <main className="o-hidden">
                    <PageBanner
                        subtitle={pageMeta.bannerSubtitle || 'EXPLORE OUR TOURS'}
                        title={pageMeta.bannerTitle || 'Discover'}
                        highlight={pageMeta.bannerHighlight || 'unforgettable journeys across the world'}
                        bgImage={pageMeta.bannerImage || '/assets/img/destination/01.jpg'}
                    />
                    <ToursGrid
                        subtitle={pageMeta.sectionSubtitle}
                        title1={pageMeta.sectionTitle1}
                        title2={pageMeta.sectionTitle2}
                    />
                </main>
                <Footer />
            </div>
        </>
    );
}
