'use client';

import { useState, useEffect } from 'react';
import { defaultHomeContent } from '../../lib/homeContent';
import { getCollectionItems } from '../../lib/firestoreService';

/**
 * Data-driven Blog section. Content is editable from /admin/home (Blog tab)
 * and pulls live items from Firestore 'posts' collection.
 */
export default function BlogSection({ content = defaultHomeContent.blog }) {
    const { subtitle, titlePart1, titlePart2 } = content;
    const [postsList, setPostsList] = useState(content.posts || defaultHomeContent.blog.posts);

    useEffect(() => {
        let isMounted = true;
        getCollectionItems('posts', []).then((items) => {
            if (isMounted && items && items.length > 0) {
                const mapped = items.slice(0, 3).map((p) => ({
                    title: p.title || p.name,
                    date: p.date || 'Aug 2026',
                    image: p.image || p.coverImage || '/assets/img/blog/1.jpg',
                    excerpt: p.excerpt || p.description || '',
                    blogLink: '/blog',
                    postLink: `/post?id=${p.id || ''}`
                }));
                setPostsList(mapped);
            }
        });
        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <section className="blog-home section-padding">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-12 text-center">
                        {subtitle ? <div className="section-subtitle wow fadeInRight">{subtitle}</div> : null}
                        {(titlePart1 || titlePart2) && (
                            <div className="section-title mb-30 d-rotate wow">
                                <span className="rotate-text">
                                    {titlePart1} {titlePart2 ? <i>{titlePart2}</i> : null}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="row">
                    {postsList.map((post, index) => (
                        <div className={`col-md-4 ${index === 0 ? 'duru-slide-left' : index === 1 ? 'duru-slide-up' : 'duru-slide-right'}`} key={index}>
                            <div
                                className={`item bg-img ${index === 1 ? 'active' : ''}`}
                                data-background={post.image}
                                style={post.image ? { backgroundImage: `url(${post.image})` } : undefined}
                            >
                                <div className="content">
                                    <div className="info">
                                        <a href={post.blogLink || '/blog'}><span><i className="ti-time"></i>{post.date}</span></a>
                                    </div>
                                    <a href={post.postLink || '/post'}>
                                        <h5>{post.title}</h5>
                                    </a>
                                    {post.excerpt ? <p>{post.excerpt}</p> : null}
                                    <div className="arrow"><a href={post.postLink || '/post'}><i className="ti-arrow-top-right"></i></a></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
