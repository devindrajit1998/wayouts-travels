'use client';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageBanner from '../components/PageBanner';
import ContactForm from '../components/ContactForm';
import { LoadingState, ErrorState } from '../components/DataState';
import { usePageMeta } from '../../lib/usePageMeta';

export default function ContactPage() {
    const { data: pageMeta, loading, error, retry } = usePageMeta('contact');

    const contactMeta = pageMeta
        ? [
            { icon: 'fa-solid fa-phone-volume', text: pageMeta.phone },
            { icon: 'fa-solid fa-envelope', text: pageMeta.email },
            { icon: 'fa-solid fa-location-dot', text: pageMeta.address },
        ].filter((item) => Boolean(item.text))
        : [];

    return (
        <>
            <Navbar active="contact" />
            <div id="smooth-content">
                <main className="o-hidden">
                    {error ? (
                        <ErrorState label="We could not load the contact page content. Please try again." onRetry={retry} />
                    ) : loading ? (
                        <LoadingState label="Loading contact page…" />
                    ) : !pageMeta ? (
                        <ErrorState label="Contact page content has not been published yet." onRetry={retry} />
                    ) : (
                        <>
                            <PageBanner
                                subtitle={pageMeta.bannerSubtitle}
                                title={pageMeta.bannerTitle}
                                highlight={pageMeta.bannerHighlight}
                                bgImage={pageMeta.bannerImage}
                                postMeta={contactMeta}
                            />
                            <ContactForm headline={pageMeta.formHeadline} />
                        </>
                    )}
                </main>
                <Footer />
            </div>
        </>
    );
}
