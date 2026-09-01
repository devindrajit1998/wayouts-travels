'use client';

import { useState, useEffect } from 'react';
import { getHomeContent } from '../../lib/homeContent';
import { getCollectionItems } from '../../lib/firestoreService';
import { LoadingState, ErrorState, EmptyState } from './DataState';

/**
 * Data-driven Blog section. Section copy is editable from /admin/home (Blog tab);
 * post items are pulled live from the Firestore 'posts' collection — the single
 * source of truth.
 */
export default function BlogSection({ content: initialContent = null }) {
    const [content, setContent] = useState(initialContent);
    const [sectionError, setSectionError] = useState(null);
    const [postsList, setPostsList] = useState(null);
    const [listError, setListError] = useState(null);

    useEffect(() => {
        if (initialContent) return;
        let isMounted = true;
        getHomeContent()
            .then((home) => {
                if (isMounted) setContent(home ? home.blog : null);
            })
            .catch((err) => {
                console.error('Failed to load blog section:', err.message);
                if (isMounted) setSectionError(err);
            });
        return () => {
            isMounted = false;
        };
    }, [initialContent]);

    useEffect(() => {
        let isMounted = true;
        getCollectionItems('posts')
            .then((items) => {
                if (isMounted) setPostsList(items);
            })
            .catch((err) => {
                console.error('Failed to load blog posts:', err.message);
                if (isMounted) setListError(err);
            });
        return () => {
            isMounted = false;
        };
    }, []);

    if (sectionError) {
        return <ErrorState label="We could not load the blog section. Please try again." />;
    }
    if (!content) {
        return <LoadingState label="Loading blog…" />;
    }

    const { subtitle, titlePart1, titlePart2 } = content;

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
                    {listError ? (
                        <div className="col-md-12">
                            <ErrorState label="We could not load the blog posts. Please try again." minHeight="200px" />
                        </div>
                    ) : postsList === null ? (
                        <div className="col-md-12">
                            <LoadingState label="Loading blog posts…" minHeight="200px" />
                        </div>
                    ) : postsList.length === 0 ? (
                        <div className="col-md-12">
                            <EmptyState label="No blog posts available yet." minHeight="200px" />
                        </div>
                    ) : (
                        postsList.slice(0, 3).map((post, index) => (
                            <div className={`col-md-4 ${index === 0 ? 'duru-slide-left' : index === 1 ? 'duru-slide-up' : 'duru-slide-right'}`} key={post.id || index}>
                                <div
                                    className={`item bg-img ${index === 1 ? 'active' : ''}`}
                                    data-background={post.image}
                                    style={post.image ? { backgroundImage: `url(${post.image})` } : undefined}
                                >
                                    <div className="content">
                                        <div className="info">
                                            <a href="/blog"><span><i className="ti-time"></i>{post.date}</span></a>
                                        </div>
                                        <a href={`/post?id=${post.id || ''}`}>
                                            <h5>{post.title}</h5>
                                        </a>
                                        {post.excerpt ? <p>{post.excerpt}</p> : null}
                                        <div className="arrow"><a href={`/post?id=${post.id || ''}`}><i className="ti-arrow-top-right"></i></a></div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}
