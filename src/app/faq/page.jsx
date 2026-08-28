'use client';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageBanner from '../components/PageBanner';
import FaqContent from '../components/FaqContent';

export default function FaqPage() {
    return (
        <>
            <Navbar active="faq" />
            <div id="smooth-content">
                <main className="o-hidden">
                    <PageBanner
                        subtitle="Frequently asked questions"
                        title="Find answers to your"
                        highlight="travel questions"
                        bgImage="/assets/img/7.jpg"
                    />
                    <FaqContent />
                </main>
                <Footer />
            </div>
        </>
    );
}
