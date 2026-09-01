'use client';

import { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './components/Hero';
import AboutSection from './components/AboutSection';
import FeaturedTours from './components/FeaturedTours';
import ServicesSection from './components/ServicesSection';
import ScrollingTicker from './components/ScrollingTicker';
import TestimonialsSection from './components/TestimonialsSection';
import FaqsSection from './components/FaqsSection';
import BlogSection from './components/BlogSection';
import { LoadingState, ErrorState } from './components/DataState';
import { getHomeContent } from '../lib/homeContent';

export default function Page() {
    const [content, setContent] = useState(null);
    const [error, setError] = useState(null);
    const [reloadKey, setReloadKey] = useState(0);

    const loadContent = useCallback(() => {
        let isMounted = true;
        setContent(null);
        setError(null);
        getHomeContent()
            .then((data) => {
                if (isMounted) setContent(data);
            })
            .catch((err) => {
                console.error('Failed to load home content:', err.message);
                if (isMounted) setError(err);
            });
        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => loadContent(), [loadContent, reloadKey]);

    const retry = () => setReloadKey((k) => k + 1);

    return (
        <>
            <Navbar active="home" />
            <div id="smooth-content">
                <main className="o-hidden">
                    {error ? (
                        <ErrorState label="We could not load the home page content. Please try again." onRetry={retry} />
                    ) : !content ? (
                        <LoadingState label="Loading home page…" />
                    ) : (
                        <>
                            {content.hero?.visible !== false && <Hero content={content.hero} />}
                            {content.about?.visible !== false && <AboutSection content={content.about} />}
                            {content.featuredTours?.visible !== false && <FeaturedTours content={content.featuredTours} />}
                            {content.services?.visible !== false && <ServicesSection content={content.services} />}
                            {content.ticker?.visible !== false && <ScrollingTicker content={content.ticker} />}
                            {content.testimonials?.visible !== false && <TestimonialsSection content={content.testimonials} />}
                            {content.faqs?.visible !== false && <FaqsSection content={content.faqs} />}
                            {content.blog?.visible !== false && <BlogSection content={content.blog} />}
                        </>
                    )}
                </main>
                <Footer />
            </div>
        </>
    );
}
