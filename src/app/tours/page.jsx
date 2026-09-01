'use client';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageBanner from '../components/PageBanner';
import ToursGrid from '../components/ToursGrid';
import { LoadingState, ErrorState } from '../components/DataState';
import { usePageMeta } from '../../lib/usePageMeta';

export default function ToursPage() {
    const { data: pageMeta, loading, error, retry } = usePageMeta('tours');

    return (
        <>
            <Navbar active="tours" />
            <div id="smooth-content">
                <main className="o-hidden">
                    {error ? (
                        <ErrorState label="We could not load the tours page content. Please try again." onRetry={retry} />
                    ) : loading ? (
                        <LoadingState label="Loading tours…" />
                    ) : !pageMeta ? (
                        <ErrorState label="Tours page content has not been published yet." onRetry={retry} />
                    ) : (
                        <>
                            <PageBanner
                                subtitle={pageMeta.bannerSubtitle}
                                title={pageMeta.bannerTitle}
                                highlight={pageMeta.bannerHighlight}
                                bgImage={pageMeta.bannerImage}
                            />
                            <ToursGrid
                                subtitle={pageMeta.sectionSubtitle}
                                title1={pageMeta.sectionTitle1}
                                title2={pageMeta.sectionTitle2}
                            />
                        </>
                    )}
                </main>
                <Footer />
            </div>
        </>
    );
}
