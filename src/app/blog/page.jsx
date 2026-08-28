'use client';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageBanner from '../components/PageBanner';
import BlogGrid from '../components/BlogGrid';

export default function BlogPage() {
    return (
        <>
            <Navbar active="blog" />
            <div id="smooth-content">
                <main className="o-hidden">
                    <PageBanner
                        subtitle="Latest Travel News"
                        title="Stories that inspire your"
                        highlight="next adventure"
                        bgImage="/assets/img/destination/03.jpg"
                    />
                    <BlogGrid />
                </main>
                <Footer />
            </div>
        </>
    );
}
