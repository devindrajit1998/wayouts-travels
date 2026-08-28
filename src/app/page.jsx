'use client';

import { useState, useEffect } from 'react';
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
import { defaultHomeContent, getHomeContent } from '../lib/homeContent';

export default function Page() {
    const [content, setContent] = useState(defaultHomeContent);

    useEffect(() => {
        let isMounted = true;
        getHomeContent().then((data) => {
            if (isMounted && data) setContent(data);
        });
        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <>
            <Navbar active="home" />
            <div id="smooth-content">
                <main className="o-hidden">
                    {content.hero.visible !== false && <Hero content={content.hero} />}
                    {content.about.visible !== false && <AboutSection content={content.about} />}
                    {content.featuredTours.visible !== false && <FeaturedTours content={content.featuredTours} />}
                    {content.services.visible !== false && <ServicesSection content={content.services} />}
                    {content.ticker.visible !== false && <ScrollingTicker content={content.ticker} />}
                    {content.testimonials.visible !== false && <TestimonialsSection content={content.testimonials} />}
                    {content.faqs.visible !== false && <FaqsSection content={content.faqs} />}
                    {content.blog.visible !== false && <BlogSection content={content.blog} />}
                </main>
                <Footer />
            </div>
        </>
    );
}
