'use client';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageBanner from '../components/PageBanner';
import ToursGrid from '../components/ToursGrid';

export default function ToursPage() {
    return (
        <>
            <Navbar active="tours" />
            <div id="smooth-content">
                <main className="o-hidden">
                    <PageBanner
                        subtitle="Explore Our Tours"
                        title="Discover"
                        highlight="unforgettable journeys across the world"
                        bgImage="/assets/img/destination/01.jpg"
                    />
                    <ToursGrid />
                </main>
                <Footer />
            </div>
        </>
    );
}
