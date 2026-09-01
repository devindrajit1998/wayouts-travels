'use client';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageBanner from '../components/PageBanner';
import TeamSection from '../components/TeamSection';
import { LoadingState, ErrorState } from '../components/DataState';
import { usePageMeta } from '../../lib/usePageMeta';

export default function TeamPage() {
    const { data: pageMeta, loading, error, retry } = usePageMeta('team');

    return (
        <>
            <Navbar active="team" />
            <div id="smooth-content">
                <main className="o-hidden">
                    {error ? (
                        <ErrorState label="We could not load the team page content. Please try again." onRetry={retry} />
                    ) : loading ? (
                        <LoadingState label="Loading team…" />
                    ) : !pageMeta ? (
                        <ErrorState label="Team page content has not been published yet." onRetry={retry} />
                    ) : (
                        <>
                            <PageBanner
                                subtitle={pageMeta.bannerSubtitle}
                                title={pageMeta.bannerTitle}
                                highlight={pageMeta.bannerHighlight}
                                bgImage={pageMeta.bannerImage}
                            />
                            <TeamSection title={pageMeta.sectionTitle1} subtitle={pageMeta.sectionSubtitle} />
                        </>
                    )}
                </main>
                <Footer />
            </div>
        </>
    );
}
