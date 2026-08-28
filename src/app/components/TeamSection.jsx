export default function TeamSection({ title = 'Meet the Wayouts Team', subtitle = 'Travel Advisors' }) {
    const members = [
        { name: 'Jason Walker', role: 'Adventure Specialist', img: '/assets/img/team/1.jpg' },
        { name: 'Emma Watson', role: 'Tour Manager', img: '/assets/img/team/2.jpg' },
        { name: 'David Smith', role: 'Luxury Guide', img: '/assets/img/team/3.jpg' },
        { name: 'Sophia Miller', role: 'Travel Consultant', img: '/assets/img/team/4.jpg' },
    ];

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
                                {members.map((member, index) => (
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
