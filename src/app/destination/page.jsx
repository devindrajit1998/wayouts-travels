'use client';

import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageBanner from '../components/PageBanner';
import ScrollingTicker from '../components/ScrollingTicker';
import DestinationsGrid from '../components/DestinationsGrid';
import { defaultPagesContent, getPagesContent } from '../../lib/pagesContent';

export default function DestinationPage() {
    const [pageMeta, setPageMeta] = useState(defaultPagesContent.destinations);

    useEffect(() => {
        let isMounted = true;
        getPagesContent().then((data) => {
            if (isMounted && data?.destinations) {
                setPageMeta(data.destinations);
            }
        });
        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <>
            <Navbar active="destination" />
            <div id="smooth-content">
                <main className="o-hidden">
                    <PageBanner
                        subtitle={pageMeta.bannerSubtitle || 'EXPLORE OUR TOURS'}
                        title={pageMeta.bannerTitle || "Explore the world's"}
                        highlight={pageMeta.bannerHighlight || 'best destinations'}
                        bgImage={pageMeta.bannerImage || '/assets/img/destination/02.jpg'}
                    />
                    <ScrollingTicker />
                    <DestinationsGrid />
                </main>
                <Footer />
            </div>
        </>
    );
}
