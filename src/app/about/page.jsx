'use client';

import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageBanner from '../components/PageBanner';
import AboutSection from '../components/AboutSection';
import ServicesSection from '../components/ServicesSection';
import ScrollingTicker from '../components/ScrollingTicker';
import TestimonialsSection from '../components/TestimonialsSection';
import TeamSection from '../components/TeamSection';
import { defaultPagesContent, getPagesContent } from '../../lib/pagesContent';

export default function AboutPage() {
    const [pageMeta, setPageMeta] = useState(defaultPagesContent.about);

    useEffect(() => {
        let isMounted = true;
        getPagesContent().then((data) => {
            if (isMounted && data?.about) {
                setPageMeta(data.about);
            }
        });
        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <>
            <Navbar active="about" />
            <div id="smooth-content">
                <main className="o-hidden">
                    <PageBanner
                        subtitle={pageMeta.bannerSubtitle || 'About Wayouts'}
                        title={pageMeta.bannerTitle || 'Discover the world with'}
                        highlight={pageMeta.bannerHighlight || 'Wayouts travel agency'}
                        bgImage={pageMeta.bannerImage || '/assets/img/7.jpg'}
                    />
                    <AboutSection />
                    <ServicesSection />
                    <ScrollingTicker />
                    <TestimonialsSection />
                    <TeamSection />
                </main>
                <Footer />
            </div>
        </>
    );
}
