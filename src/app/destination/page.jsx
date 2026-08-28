'use client';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageBanner from '../components/PageBanner';
import ScrollingTicker from '../components/ScrollingTicker';
import DestinationsGrid from '../components/DestinationsGrid';

export default function DestinationPage() {
    return (
        <>
            <Navbar active="destination" />
            <div id="smooth-content">
                <main className="o-hidden">
                    <PageBanner
                        subtitle="Explore Our Tours"
                        title="Explore the world's"
                        highlight="best destinations"
                        bgImage="/assets/img/destination/05.jpg"
                    />
                    <ScrollingTicker />
                    <DestinationsGrid />
                </main>
                <Footer />
            </div>
        </>
    );
}
