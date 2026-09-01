'use client';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageBanner from '../components/PageBanner';
import AboutSection from '../components/AboutSection';
import ServicesSection from '../components/ServicesSection';
import ScrollingTicker from '../components/ScrollingTicker';
import TestimonialsSection from '../components/TestimonialsSection';
import TeamSection from '../components/TeamSection';
import { LoadingState, ErrorState } from '../components/DataState';
import { usePageMeta } from '../../lib/usePageMeta';

export default function AboutPage() {
    const { data: pageMeta, loading, error, retry } = usePageMeta('about');

    return (
        <>
            <Navbar active="about" />
            <div id="smooth-content">
                <main className="o-hidden">
                    {error ? (
                        <ErrorState label="We could not load the about page content. Please try again." onRetry={retry} />
                    ) : loading ? (
                        <LoadingState label="Loading about page…" />
                    ) : !pageMeta ? (
                        <ErrorState label="About page content has not been published yet." onRetry={retry} />
                    ) : (
                        <>
                            <PageBanner
                                subtitle={pageMeta.bannerSubtitle}
                                title={pageMeta.bannerTitle}
                                highlight={pageMeta.bannerHighlight}
                                bgImage={pageMeta.bannerImage}
                            />
                            <AboutSection />
                            <ServicesSection />
                            <ScrollingTicker />
                            <TestimonialsSection />
                            <TeamSection />
                        </>
                    )}
                </main>
                <Footer />
            </div>
        </>
    );
}
