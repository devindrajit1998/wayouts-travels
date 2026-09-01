'use client';

import { useState, useEffect } from 'react';
import { getCollectionItems } from '../../lib/firestoreService';
import { LoadingState, ErrorState } from './DataState';

export default function BlogSidebar() {
    const [posts, setPosts] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;
        getCollectionItems('posts')
            .then((items) => {
                if (isMounted) setPosts(items);
            })
            .catch((err) => {
                console.error('Failed to load recent posts:', err.message);
                if (isMounted) setError(err);
            });
        return () => {
            isMounted = false;
        };
    }, []);

    const recentPosts = posts ? posts.slice(0, 3) : null;
    const categories = posts
        ? Array.from(new Set(posts.map((p) => p.category).filter(Boolean)))
        : null;
    const tags = posts
        ? Array.from(new Set(posts.flatMap((p) => (Array.isArray(p.tags) ? p.tags : [])).filter(Boolean)))
        : null;

    return (
        <div className="blog-sidebar row">
            <div className="col-md-12">
                <div className="widget search">
                    <form onSubmit={(e) => e.preventDefault()}>
                        <input type="text" name="search" placeholder="Type here ..." />
                        <button type="submit"><i className="fa-light fa-magnifying-glass" aria-hidden="true"></i></button>
                    </form>
                </div>
            </div>
            <div className="col-md-12">
                <div className="widget">
                    <div className="widget-title">
                        <h6>Recent Posts</h6>
                    </div>
                    {error ? (
                        <ErrorState label="We could not load the recent posts." minHeight="120px" />
                    ) : recentPosts === null ? (
                        <LoadingState label="Loading recent posts…" minHeight="120px" />
                    ) : recentPosts.length === 0 ? (
                        <p style={{ color: '#6b7280', fontSize: '13px' }}>No posts yet.</p>
                    ) : (
                        <ul className="recent">
                            {recentPosts.map((post, index) => (
                                <li key={post.id || index}>
                                    <div className="thum"><img src={post.image} className="img-fluid" alt={post.title} /></div>
                                    <a href={`/post?id=${post.id || ''}`}>{post.title}</a>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
            {categories && categories.length > 0 && (
                <div className="col-md-12">
                    <div className="widget">
                        <div className="widget-title">
                            <h6>Categories</h6>
                        </div>
                        <ul>
                            {categories.map((cat, index) => (
                                <li key={index}><a href="#"><i className="fa-light fa-angle-right"></i>{cat}</a></li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
            {tags && tags.length > 0 && (
                <div className="col-md-12">
                    <div className="widget">
                        <div className="widget-title">
                            <h6>Tags</h6>
                        </div>
                        <ul className="tags">
                            {tags.map((tag, index) => (
                                <li key={index}><a href="#">{tag}</a></li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}
