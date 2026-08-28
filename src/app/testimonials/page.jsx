'use client';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageBanner from '../components/PageBanner';
import TestimonialsGrid from '../components/TestimonialsGrid';

export default function TestimonialsPage() {
    return (
        <>
            <Navbar active="testimonials" />
            <div id="smooth-content">
                <main className="o-hidden">
                    <PageBanner
                        subtitle="What Clients Say"
                        title="What our travelers say"
                        highlight="about us"
                        bgImage="/assets/img/destination/01.jpg"
                    />
                    <TestimonialsGrid />
                </main>
                <Footer />
            </div>
        </>
    );
}
