'use client';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageBanner from '../components/PageBanner';
import FaqContent from '../components/FaqContent';
import { LoadingState, ErrorState } from '../components/DataState';
import { usePageMeta } from '../../lib/usePageMeta';

export default function FaqPage() {
    const { data: pageMeta, loading, error, retry } = usePageMeta('faq');

    return (
        <>
            <Navbar active="faq" />
            <div id="smooth-content">
                <main className="o-hidden">
                    {error ? (
                        <ErrorState label="We could not load the FAQ page content. Please try again." onRetry={retry} />
                    ) : loading ? (
                        <LoadingState label="Loading FAQs…" />
                    ) : !pageMeta ? (
                        <ErrorState label="FAQ page content has not been published yet." onRetry={retry} />
                    ) : (
                        <>
                            <PageBanner
                                subtitle={pageMeta.bannerSubtitle}
                                title={pageMeta.bannerTitle}
                                highlight={pageMeta.bannerHighlight}
                                bgImage={pageMeta.bannerImage}
                            />
                            <FaqContent />
                        </>
                    )}
                </main>
                <Footer />
            </div>
        </>
    );
}
