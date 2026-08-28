'use client';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageBanner from '../components/PageBanner';
import TeamSection from '../components/TeamSection';

export default function TeamPage() {
    return (
        <>
            <Navbar active="team" />
            <div id="smooth-content">
                <main className="o-hidden">
                    <PageBanner
                        subtitle="Our Travel Experts"
                        title="Meet the experts behind"
                        highlight="every journey"
                        bgImage="/assets/img/destination/01.jpg"
                    />
                    <TeamSection title="Wayouts Team" subtitle="Travel Advisors" />
                </main>
                <Footer />
            </div>
        </>
    );
}
