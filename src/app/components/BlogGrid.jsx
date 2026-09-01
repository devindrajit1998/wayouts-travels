'use client';

import { useState, useEffect } from 'react';
import BlogSidebar from './BlogSidebar';
import { getCollectionItems } from '../../lib/firestoreService';
import { LoadingState, ErrorState, EmptyState } from './DataState';

export default function BlogGrid() {
    const [posts, setPosts] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;
        getCollectionItems('posts')
            .then((data) => {
                if (isMounted) setPosts(data);
            })
            .catch((err) => {
                console.error('Failed to load blog posts:', err.message);
                if (isMounted) setError(err);
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
                            {error ? (
                                <div className="col-md-12">
                                    <ErrorState label="We could not load the blog posts. Please try again." minHeight="200px" />
                                </div>
                            ) : posts === null ? (
                                <div className="col-md-12">
                                    <LoadingState label="Loading blog posts…" minHeight="200px" />
                                </div>
                            ) : posts.length === 0 ? (
                                <div className="col-md-12">
                                    <EmptyState label="No blog posts available yet." minHeight="200px" />
                                </div>
                            ) : (
                                posts.map((post, index) => (
                                    <div className="col-md-6" key={post.id || index}>
                                        <div
                                            className="item bg-img mb-30"
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
                        {posts && posts.length > 0 && (
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
                        )}
                    </div>
                    <div className="col-lg-4 col-md-12">
                        <BlogSidebar />
                    </div>
                </div>
            </div>
        </section>
    );
}
