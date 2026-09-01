'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { LoadingState, ErrorState, EmptyState } from '../components/DataState';
import { getCollectionItems } from '../../lib/firestoreService';

function PostArticleContent() {
    const searchParams = useSearchParams();
    const postId = searchParams.get('id');

    const [post, setPost] = useState(null);
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        setError(null);
        getCollectionItems('posts')
            .then((items) => {
                if (!isMounted) return;
                const list = Array.isArray(items) ? items : [];
                setPosts(list);
                const match = postId ? list.find((p) => p.id === postId) : list[0];
                setPost(match || null);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Failed to load article:', err.message);
                if (!isMounted) return;
                setError(err);
                setLoading(false);
            });
        return () => {
            isMounted = false;
        };
    }, [postId, reloadKey]);

    if (loading) {
        return <LoadingState label="Loading article…" minHeight="60vh" />;
    }
    if (error) {
        return (
            <ErrorState
                label="We could not load this article. Please try again."
                onRetry={() => setReloadKey((k) => k + 1)}
                minHeight="60vh"
            />
        );
    }
    if (!post) {
        const emptyLabel =
            posts.length === 0
                ? 'No articles have been published yet.'
                : 'This article could not be found. It may have been removed.';
        return <EmptyState label={emptyLabel} minHeight="60vh" />;
    }

    const leadText = post.leadText || post.excerpt || '';
    const hasComment = Boolean(post.commentUser || post.commentText);

    return (
        <main className="o-hidden">
            {/* Header Banner */}
            <header className="pg-hero section-padding">
                <div className="container">
                    <div className="row mb-60 justify-content-center">
                        <div className="col-md-8 text-center">
                            {post.category && <div className="section-subtitle">{post.category}</div>}
                            <div className="section-title">{post.title}</div>
                            {(post.author || post.date) && (
                                <div className="post" style={{ marginTop: '16px', display: 'inline-flex', alignItems: 'center', gap: '16px' }}>
                                    {post.author && (
                                        <div className="author" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            {post.authorAvatar && (
                                                <img
                                                    src={post.authorAvatar}
                                                    alt={post.author}
                                                    className="avatar"
                                                    style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                                                />
                                            )}
                                            <span>{post.author}</span>
                                        </div>
                                    )}
                                    {post.date && (
                                        <div className="date-comment"> <i className="ti-calendar"></i> {post.date}</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="container-fluid">
                    <div className="height1">
                        <div className="radius-mask">
                            <div
                                className="bg-img height2"
                                style={post.image ? { backgroundImage: `url(${post.image})` } : undefined}
                                data-speed="0.5"
                                data-lag="0"
                            ></div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Post Content */}
            <section className="post section-padding">
                <div className="container">
                    {(leadText || post.leadQuote) && (
                        <div className="row mb-30">
                            <div className="col-lg-8 col-md-12">
                                {leadText && (
                                    <p>
                                        <span className="first-letter">{leadText[0]}</span>
                                        {leadText.slice(1)}
                                    </p>
                                )}
                            </div>
                            {post.leadQuote && (
                                <div className="col-lg-3 offset-lg-1 col-md-12 mb-30">
                                    <blockquote className="vert-move">
                                        <p>{post.leadQuote}</p>
                                        {post.leadQuoteCite && <cite>{post.leadQuoteCite}</cite>}
                                    </blockquote>
                                </div>
                            )}
                        </div>
                    )}

                    {(post.bodyParagraph1 || post.bodyParagraph2) && (
                        <div className="row justify-content-center mb-60 pt-30">
                            {post.bodyParagraph1 && (
                                <div className="col-md-6">
                                    <p>{post.bodyParagraph1}</p>
                                </div>
                            )}
                            {post.bodyParagraph2 && (
                                <div className="col-md-5 offset-md-1">
                                    <p>{post.bodyParagraph2}</p>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="post-comment-section">
                        <div className="row justify-content-center">
                            {/* Comment */}
                            {hasComment && (
                                <div className="col-md-6 mb-30">
                                    <div className="post-comment-wrap">
                                        {post.commentAvatar && (
                                            <div className="post-user-comment"><img src={post.commentAvatar} alt="" /></div>
                                        )}
                                        <div className="post-user-content">
                                            <h5>
                                                {post.commentUser}
                                                {post.commentRole && <span>[ {post.commentRole} ]</span>}
                                            </h5>
                                            {post.commentText && (
                                                <p>{post.commentText} <i className="fa-solid fa-thumbs-up"></i></p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Inquiry Form */}
                            <div className="col-md-5 offset-md-1">
                                <h5 className="mb-30">Plan A Trip Like This</h5>
                                <div style={{ display: 'grid', gap: '16px' }}>
                                    <p>Interested in exploring this destination? Reach out to our dedicated holiday curators.</p>
                                    <a href="/contact" className="butn-arrow">
                                        <span className="btn-text">Get Itinerary & Quote</span>
                                        <span className="arrow-wrap">
                                            <span className="arrow-inner">
                                                <i className="ti-arrow-right"></i>
                                                <i className="ti-arrow-right"></i>
                                            </span>
                                        </span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default function PostPage() {
    return (
        <>
            <Navbar active="blog" extendedPages={false} />
            <div id="smooth-content">
                <Suspense fallback={<LoadingState label="Loading article…" minHeight="60vh" />}>
                    <PostArticleContent />
                </Suspense>
                <Footer />
            </div>
        </>
    );
}
