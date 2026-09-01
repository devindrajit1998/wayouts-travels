'use client';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageBanner from '../components/PageBanner';
import ScrollingTicker from '../components/ScrollingTicker';
import DestinationsGrid from '../components/DestinationsGrid';
import { LoadingState, ErrorState } from '../components/DataState';
import { usePageMeta } from '../../lib/usePageMeta';

export default function DestinationPage() {
    const { data: pageMeta, loading, error, retry } = usePageMeta('destinations');

    return (
        <>
            <Navbar active="destination" />
            <div id="smooth-content">
                <main className="o-hidden">
                    {error ? (
                        <ErrorState label="We could not load the destinations page content. Please try again." onRetry={retry} />
                    ) : loading ? (
                        <LoadingState label="Loading destinations…" />
                    ) : !pageMeta ? (
                        <ErrorState label="Destinations page content has not been published yet." onRetry={retry} />
                    ) : (
                        <>
                            <PageBanner
                                subtitle={pageMeta.bannerSubtitle}
                                title={pageMeta.bannerTitle}
                                highlight={pageMeta.bannerHighlight}
                                bgImage={pageMeta.bannerImage}
                            />
                            <ScrollingTicker />
                            <DestinationsGrid />
                        </>
                    )}
                </main>
                <Footer />
            </div>
        </>
    );
}
