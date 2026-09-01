'use client';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageBanner from '../components/PageBanner';
import ServicesGrid from '../components/ServicesGrid';
import { LoadingState, ErrorState } from '../components/DataState';
import { usePageMeta } from '../../lib/usePageMeta';

export default function ServicesPage() {
    const { data: pageMeta, loading, error, retry } = usePageMeta('services');

    return (
        <>
            <Navbar active="services" />
            <div id="smooth-content">
                <main className="o-hidden">
                    {error ? (
                        <ErrorState label="We could not load the services page content. Please try again." onRetry={retry} />
                    ) : loading ? (
                        <LoadingState label="Loading services…" />
                    ) : !pageMeta ? (
                        <ErrorState label="Services page content has not been published yet." onRetry={retry} />
                    ) : (
                        <>
                            <PageBanner
                                subtitle={pageMeta.bannerSubtitle}
                                title={pageMeta.bannerTitle}
                                highlight={pageMeta.bannerHighlight}
                                bgImage={pageMeta.bannerImage}
                            />
                            <ServicesGrid quoteText={pageMeta.quoteText} />
                        </>
                    )}
                </main>
                <Footer />
            </div>
        </>
    );
}
