'use client';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageBanner from '../components/PageBanner';
import AboutSection from '../components/AboutSection';
import ServicesSection from '../components/ServicesSection';
import ScrollingTicker from '../components/ScrollingTicker';
import TestimonialsSection from '../components/TestimonialsSection';
import TeamSection from '../components/TeamSection';

export default function AboutPage() {
    return (
        <>
            <Navbar active="about" />
            <div id="smooth-content">
                <main className="o-hidden">
                    <PageBanner
                        subtitle="About Wayouts"
                        title="Discover the world with"
                        highlight="Wayouts travel agency"
                        bgImage="/assets/img/7.jpg"
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
