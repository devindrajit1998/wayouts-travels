'use client';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageBanner from '../components/PageBanner';
import ContactForm from '../components/ContactForm';

export default function ContactPage() {
    const contactMeta = [
        { icon: 'fa-solid fa-phone-volume', text: '+1 123 4567 8910' },
        { icon: 'fa-solid fa-envelope', text: 'info@wayouts.com' },
        { icon: 'fa-solid fa-location-dot', text: '113893 Noble Blvd. NY, USA' },
    ];

    return (
        <>
            <Navbar active="contact" />
            <div id="smooth-content">
                <main className="o-hidden">
                    <PageBanner
                        subtitle="Talk To Our Team"
                        title="Get personalized travel support"
                        highlight="today!"
                        bgImage="/assets/img/destination/03.jpg"
                        postMeta={contactMeta}
                    />
                    <ContactForm />
                </main>
                <Footer />
            </div>
        </>
    );
}
