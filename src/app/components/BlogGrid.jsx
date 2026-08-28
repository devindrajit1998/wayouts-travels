'use client';

import { useState, useEffect } from 'react';
import BlogSidebar from './BlogSidebar';
import { getCollectionItems } from '../../lib/firestoreService';

const fallbackPosts = [
    {
        title: 'Top 7 Hidden Valleys of Kashmir You Must Explore',
        desc: 'Beyond Dal Lake: Discover pristine pine meadows, gushing trout streams, and glacier passes in Aru and Betaab Valley.',
        date: '28 Aug 2026',
        img: '/assets/img/blog/1.jpg',
        href: '/post',
    },
    {
        title: 'A Culinary & Cultural Journey Through Old Kolkata to Darjeeling',
        desc: 'From colonial tea estates in the Himalayas to legendary street bites, experience the vibrant spirit of Eastern India.',
        date: '26 Aug 2026',
        img: '/assets/img/blog/2.jpg',
        href: '/post',
    },
    {
        title: 'The Ultimate Guide to Kerala Backwaters & Munnar Hills',
        desc: 'Plan the perfect monsoon and winter getaway amidst spice plantations, misty peaks, and serene lake cruises.',
        date: '24 Aug 2026',
        img: '/assets/img/blog/3.jpg',
        href: '/post',
    },
    {
        title: 'Rajasthan Forts & Desert Camps: Jodhpur to Jaisalmer',
        desc: 'Witness golden sand dunes under starry skies and live like royalty in preserved Rajput palaces.',
        date: '22 Aug 2026',
        img: '/assets/img/blog/4.jpg',
        href: '/post',
    },
    {
        title: 'Scuba Diving & Coral Trails in Andaman Islands',
        desc: 'Explore India’s premier marine sanctuary with turquoise crystal shallows and vibrant coral reefs.',
        date: '20 Aug 2026',
        img: '/assets/img/blog/1.jpg',
        href: '/post',
    },
    {
        title: 'Sikkim Monasteries & Kangchenjunga Sunrise Escapes',
        desc: 'Peaceful Himalayan retreats, ancient Buddhist gompas, and rhododendron valleys in Pelling and Gangtok.',
        date: '18 Aug 2026',
        img: '/assets/img/blog/2.jpg',
        href: '/post',
    },
];

export default function BlogGrid() {
    const [posts, setPosts] = useState(fallbackPosts);

    useEffect(() => {
        let isMounted = true;
        getCollectionItems('posts', []).then((data) => {
            if (isMounted && data && data.length > 0) {
                const mapped = data.map((p) => ({
                    title: p.title,
                    desc: p.excerpt || p.leadText1 || 'Travel journal article by Wayouts.',
                    date: p.date || p.publishDate || '28 Aug 2026',
                    img: p.image || p.bannerImage || '/assets/img/blog/1.jpg',
                    href: '/post',
                }));
                setPosts(mapped);
            }
        });
        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <section className="blog-home section-padding">
            <div className="container">
                <div className="row">
                    <div className="col-lg-8 col-md-12">
                        <div className="row">
                            {posts.map((post, index) => (
                                <div className="col-md-6" key={index}>
                                    <div
                                        className="item bg-img mb-30"
                                        data-background={post.img}
                                        style={{ backgroundImage: `url(${post.img})` }}
                                    >
                                        <div className="content">
                                            <div className="info">
                                                <a href="/blog"><span><i className="ti-time"></i>{post.date}</span></a>
                                            </div>
                                            <a href={post.href}>
                                                <h5>{post.title}</h5>
                                            </a>
                                            <p>{post.desc}</p>
                                            <div className="arrow"><a href={post.href}><i className="ti-arrow-top-right"></i></a></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="row">
                            <div className="col-md-12 text-center mt-30 mb-30">
                                <ul className="pagination-wrap">
                                    <li><a href="/blog"><i className="fa-light fa-angle-left"></i></a></li>
                                    <li><a href="/blog">1</a></li>
                                    <li><a href="/blog" className="active">2</a></li>
                                    <li><a href="/blog">3</a></li>
                                    <li><a href="/blog"><i className="fa-light fa-angle-right"></i></a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-12">
                        <BlogSidebar />
                    </div>
                </div>
            </div>
        </section>
    );
}
