'use client';

import { useState, useEffect } from 'react';
import { getCollectionItems } from '../../lib/firestoreService';

const fallbackTeam = [
    { name: 'Ananya Roy', role: 'Kolkata Head of Domestic Holidays', img: '/assets/img/team/1.jpg' },
    { name: 'Rohit Sen', role: 'Senior Kashmir & Ladakh Specialist', img: '/assets/img/team/2.jpg' },
    { name: 'Pooja Bhattacharya', role: 'Kerala & South India Curator', img: '/assets/img/team/3.jpg' },
    { name: 'Debashis Das', role: 'Flight & Luxury Logistics Expert', img: '/assets/img/team/4.jpg' },
];

export default function TeamSection({ title = 'Meet the Wayouts Team', subtitle = 'Travel Advisors' }) {
    const [teamList, setTeamList] = useState(fallbackTeam);

    useEffect(() => {
        let isMounted = true;
        getCollectionItems('team', []).then((items) => {
            if (isMounted && items && items.length > 0) {
                const mapped = items.map((m) => ({
                    name: m.name || m.fullName,
                    role: m.role || m.designation || 'Holiday Specialist',
                    img: m.image || m.img || '/assets/img/team/1.jpg'
                }));
                setTeamList(mapped);
            }
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
                        <div className="section-subtitle wow fadeInRight">{subtitle}</div>
                        <div className="section-title d-rotate wow"><span className="rotate-text">{title}</span></div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="swiper team-slider">
                            <div className="swiper-wrapper">
                                {teamList.map((member, index) => (
                                    <div className="swiper-slide" key={index}>
                                        <div className="item">
                                            <div className="wrapper">
                                                <div className="img"><img src={member.img} className="img-fluid" alt={member.name} /></div>
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
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
