'use client';

import { useState, useEffect } from 'react';
import { getCollectionItems } from '../../lib/firestoreService';
import { LoadingState, ErrorState, EmptyState } from './DataState';

export default function TeamSection({ title, subtitle }) {
    const [teamList, setTeamList] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;
        getCollectionItems('team')
            .then((items) => {
                if (isMounted) setTeamList(items);
            })
            .catch((err) => {
                console.error('Failed to load team members:', err.message);
                if (isMounted) setError(err);
            });
        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <section className="team section-padding">
            <div className="bg-text-style3 duru-slide-up">Experts</div>
            <div className="container">
                <div className="row">
                    <div className="col-md-12 text-center mb-30">
                        {subtitle ? <div className="section-subtitle wow fadeInRight">{subtitle}</div> : null}
                        {title ? (
                            <div className="section-title d-rotate wow"><span className="rotate-text">{title}</span></div>
                        ) : null}
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="swiper team-slider">
                            <div className="swiper-wrapper">
                                {error ? (
                                    <div className="col-md-12">
                                        <ErrorState label="We could not load the team members. Please try again." minHeight="200px" />
                                    </div>
                                ) : teamList === null ? (
                                    <div className="col-md-12">
                                        <LoadingState label="Loading team…" minHeight="200px" />
                                    </div>
                                ) : teamList.length === 0 ? (
                                    <div className="col-md-12">
                                        <EmptyState label="No team members available yet." minHeight="200px" />
                                    </div>
                                ) : (
                                    teamList.map((member, index) => (
                                        <div className="swiper-slide" key={member.id || index}>
                                            <div className="item">
                                                <div className="wrapper">
                                                    <div className="img"><img src={member.image} className="img-fluid" alt={member.name} /></div>
                                                    <div className="icon">
                                                        <a href="/team" className="arrow">
                                                            <span className="fa-solid fa-info default-icon"></span>
                                                            <span className="ti-arrow-top-right hover-icon"></span>
                                                        </a>
                                                    </div>
                                                </div>
                                                <div className="text">
                                                    <h4 className="name">{member.name}</h4>
                                                    <h6 className="position">{member.role}</h6>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
