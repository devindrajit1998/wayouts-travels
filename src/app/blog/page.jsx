'use client';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageBanner from '../components/PageBanner';
import BlogGrid from '../components/BlogGrid';
import { LoadingState, ErrorState } from '../components/DataState';
import { usePageMeta } from '../../lib/usePageMeta';

export default function BlogPage() {
    const { data: pageMeta, loading, error, retry } = usePageMeta('blog');

    return (
        <>
            <Navbar active="blog" />
            <div id="smooth-content">
                <main className="o-hidden">
                    {error ? (
                        <ErrorState label="We could not load the blog page content. Please try again." onRetry={retry} />
                    ) : loading ? (
                        <LoadingState label="Loading blog…" />
                    ) : !pageMeta ? (
                        <ErrorState label="Blog page content has not been published yet." onRetry={retry} />
                    ) : (
                        <>
                            <PageBanner
                                subtitle={pageMeta.bannerSubtitle}
                                title={pageMeta.bannerTitle}
                                highlight={pageMeta.bannerHighlight}
                                bgImage={pageMeta.bannerImage}
                            />
                            <BlogGrid />
                        </>
                    )}
                </main>
                <Footer />
            </div>
        </>
    );
}
