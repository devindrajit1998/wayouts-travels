'use client';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageBanner from '../components/PageBanner';
import ServicesGrid from '../components/ServicesGrid';

export default function ServicesPage() {
    return (
        <>
            <Navbar active="services" />
            <div id="smooth-content">
                <main className="o-hidden">
                    <PageBanner
                        subtitle="Premium Travel Services"
                        title="Discover services that make"
                        highlight="travel effortless"
                        bgImage="/assets/img/destination/02.jpg"
                    />
                    <ServicesGrid />
                </main>
                <Footer />
            </div>
        </>
    );
}
