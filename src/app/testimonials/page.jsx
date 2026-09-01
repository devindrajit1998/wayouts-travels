'use client';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageBanner from '../components/PageBanner';
import TestimonialsGrid from '../components/TestimonialsGrid';
import { LoadingState, ErrorState } from '../components/DataState';
import { usePageMeta } from '../../lib/usePageMeta';

export default function TestimonialsPage() {
    const { data: pageMeta, loading, error, retry } = usePageMeta('testimonials');

    return (
        <>
            <Navbar active="testimonials" />
            <div id="smooth-content">
                <main className="o-hidden">
                    {error ? (
                        <ErrorState label="We could not load the testimonials page content. Please try again." onRetry={retry} />
                    ) : loading ? (
                        <LoadingState label="Loading testimonials…" />
                    ) : !pageMeta ? (
                        <ErrorState label="Testimonials page content has not been published yet." onRetry={retry} />
                    ) : (
                        <>
                            <PageBanner
                                subtitle={pageMeta.bannerSubtitle}
                                title={pageMeta.bannerTitle}
                                highlight={pageMeta.bannerHighlight}
                                bgImage={pageMeta.bannerImage}
                            />
                            <TestimonialsGrid />
                        </>
                    )}
                </main>
                <Footer />
            </div>
        </>
    );
}
