'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { LoadingState, ErrorState, EmptyState } from '../components/DataState';
import { getCollectionItems } from '../../lib/firestoreService';

function TeamDetailsContent() {
    const searchParams = useSearchParams();
    const memberId = searchParams.get('id');

    const [member, setMember] = useState(null);
    const [team, setTeam] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        setError(null);
        getCollectionItems('team')
            .then((items) => {
                if (!isMounted) return;
                const list = Array.isArray(items) ? items : [];
                setTeam(list);
                const match = memberId ? list.find((m) => m.id === memberId) : list[0];
                setMember(match || null);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Failed to load team member:', err.message);
                if (!isMounted) return;
                setError(err);
                setLoading(false);
            });
        return () => {
            isMounted = false;
        };
    }, [memberId, reloadKey]);

    if (loading) {
        return <LoadingState label="Loading team member…" minHeight="60vh" />;
    }
    if (error) {
        return (
            <ErrorState
                label="We could not load this team member. Please try again."
                onRetry={() => setReloadKey((k) => k + 1)}
                minHeight="60vh"
            />
        );
    }
    if (!member) {
        const emptyLabel =
            team.length === 0
                ? 'No team members are available yet.'
                : 'This team member could not be found. They may no longer be listed.';
        return <EmptyState label={emptyLabel} minHeight="60vh" />;
    }

    const firstName = member.name ? member.name.split(' ')[0] : '';

    return (
        <main className="o-hidden">
            {/* Header Banner */}
            <header className="pg-hero section-padding">
                <div className="container">
                    <div className="row mb-60 justify-content-center">
                        <div className="col-md-6 text-center">
                            <div className="section-subtitle">{member.name}</div>
                            <div className="section-title">
                                Professional <i>{member.role}</i>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container-fluid">
                    <div className="height1">
                        <div className="radius-mask">
                            <div
                                className="bg-img height2"
                                style={member.image ? { backgroundImage: `url(${member.image})` } : undefined}
                                data-speed="0.5"
                                data-lag="0"
                            ></div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Team Details */}
            <section className="team-details section-padding">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-4 mb-30 duru-slide-up">
                            {member.image && (
                                <img
                                    src={member.image}
                                    className="img-fluid mb-0"
                                    alt={member.name}
                                    style={{ borderRadius: '12px', width: '100%', objectFit: 'cover' }}
                                />
                            )}
                            <div className="wrap" style={{ marginTop: '20px' }}>
                                <h3>{member.name}</h3>
                                {member.role && <h5>{member.role}</h5>}
                                {member.specialization && (
                                    <div className="cont">
                                        <div className="coll">
                                            <h6>Specialization:</h6>
                                        </div>
                                        <div className="coll">
                                            <p>{member.specialization}</p>
                                        </div>
                                    </div>
                                )}
                                {member.email && (
                                    <div className="cont">
                                        <div className="coll">
                                            <h6>Email:</h6>
                                        </div>
                                        <div className="coll">
                                            <p>{member.email}</p>
                                        </div>
                                    </div>
                                )}
                                {member.phone && (
                                    <div className="cont mb-30">
                                        <div className="coll">
                                            <h6>Call:</h6>
                                        </div>
                                        <div className="coll">
                                            <p>{member.phone}</p>
                                        </div>
                                    </div>
                                )}
                                {(member.socialInstagram || member.socialLinkedin) && (
                                    <div className="social-icon">
                                        {member.socialInstagram && (
                                            <a href={member.socialInstagram} target="_blank" rel="noopener noreferrer">
                                                <i className="fa-brands fa-instagram"></i>
                                            </a>
                                        )}
                                        {member.socialLinkedin && (
                                            <a href={member.socialLinkedin} target="_blank" rel="noopener noreferrer">
                                                <i className="fa-brands fa-linkedin-in"></i>
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="col-md-7 offset-md-1 duru-slide-up">
                            {member.bio && (
                                <>
                                    <h4>About {member.name}</h4>
                                    <p className="mb-30">{member.bio}</p>
                                </>
                            )}
                            {member.experience && (
                                <>
                                    <h4>Professional Experience</h4>
                                    <p className="mb-30">{member.experience}</p>
                                </>
                            )}
                            {member.tours && (
                                <>
                                    <h4>Guided Itineraries</h4>
                                    <p className="mb-30">{member.tours}</p>
                                </>
                            )}
                            {firstName && (
                                <div style={{ marginTop: '30px' }}>
                                    <a href="/contact" className="butn-arrow">
                                        <span className="btn-text">Connect with {firstName}</span>
                                        <span className="arrow-wrap">
                                            <span className="arrow-inner">
                                                <i className="ti-arrow-right"></i>
                                                <i className="ti-arrow-right"></i>
                                            </span>
                                        </span>
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default function TeamDetailsPage() {
    return (
        <>
            <Navbar active="team" extendedPages={false} />
            <div id="smooth-content">
                <Suspense fallback={<LoadingState label="Loading team member…" minHeight="60vh" />}>
                    <TeamDetailsContent />
                </Suspense>
                <Footer />
            </div>
        </>
    );
}
