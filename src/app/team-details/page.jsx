'use client';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Page() {
  return (
    <>
      <Navbar active="team-details" extendedPages={false} />
      <div id="smooth-content">
        <main className="o-hidden">
                {/* Header Banner */}
                <header className="pg-hero section-padding">
                    <div className="container">
                        <div className="row mb-60 justify-content-center">
                            <div className="col-md-5 text-center">
                                <div className="section-subtitle">Jason Walker</div>
                                <div className="section-title">I'm a professional <i>Adventure Specialist</i></div>
                            </div>
                        </div>
                    </div>
                    <div className="container-fluid">
                        <div className="height1">
                            <div className="radius-mask">
                                <div
                                    className="bg-img height2"
                                    data-background="/assets/img/destination/01.jpg"
                                    style={{ backgroundImage: 'url(/assets/img/destination/01.jpg)' }}
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
                            <div className="col-md-4 mb-30 duru-slide-up"> <img src="/assets/img/team/1.jpg" className="img-fluid mb-0" alt="" />
                                <div className="wrap">
                                    <h3>Jason Walker</h3>
                                    <h5>Adventure Specialist</h5>
                                    <div className="cont">
                                        <div className="coll">
                                            <h6>Email:</h6>
                                        </div>
                                        <div className="coll">
                                            <p>walker@wayouts.com</p>
                                        </div>
                                    </div>
                                    <div className="cont mb-30">
                                        <div className="coll">
                                            <h6>Call:</h6>
                                        </div>
                                        <div className="coll">
                                            <p>+1 123 567 8910</p>
                                        </div>
                                    </div>
                                    <div className="social-icon"> <a href="#"><i className="fa-brands fa-instagram"></i></a> <a href="#"><i className="fab fa-x-twitter"></i></a> <a href="#"><i className="fa-brands fa-facebook-f"></i></a> <a href="#"><i className="fa-brands fa-pinterest"></i></a> </div>
                                </div>
                            </div>
                            <div className="col-md-6 offset-md-1">
                                <div className="content">
                                    <div className="section-subtitle wow fadeInRight">Jason Walker</div>
                                    <div className="section-title d-rotate wow"><span className="rotate-text">I'm a professional <i>Adventure Specialist</i></span></div>
                                    <p>With over 10 years of experience in the travel industry, Jason Walker helps travelers discover unique destinations and create unforgettable journeys tailored to their interests and lifestyles. From mountain expeditions to cultural tours across Europe, Asia, and South America, he specializes in designing authentic travel experiences that combine adventure, comfort, and local discovery.</p>
                                    <p>For Ethan, travel is about more than visiting new places—it's about creating meaningful memories and connecting people with the world. His expertise, attention to detail, and passion for exploration ensure every trip is carefully planned from start to finish.</p>
                                    <ul className="page-list list-unstyled mb-30">
                                        <li>
                                            <div className="page-list-icon"> <span className="ti-check"></span> </div>
                                            <div className="page-list-text">
                                                <p>10+ years in global travel planning</p>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="page-list-icon"> <span className="ti-check"></span> </div>
                                            <div className="page-list-text">
                                                <p>Adventure and experiential travel specialist</p>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="page-list-icon"> <span className="ti-check"></span> </div>
                                            <div className="page-list-text">
                                                <p>Expert in customized itineraries and destination planning</p>
                                            </div>
                                        </li>
                                    </ul>
                                    <ul className="nav nav-tabs simpl-bord mt-60" id="myTab" role="tablist">
                                        <li className="nav-item" role="presentation"> <span className="nav-link cursor-pointer" id="experience-tab" data-bs-toggle="tab" data-bs-target="#experience">Experience</span> </li>
                                        <li className="nav-item" role="presentation"> <span className="nav-link cursor-pointer" id="education-tab" data-bs-toggle="tab" data-bs-target="#education">Education</span> </li>
                                        <li className="nav-item" role="presentation"> <span className="nav-link active cursor-pointer" id="awards-tab" data-bs-toggle="tab" data-bs-target="#awards">Awards</span> </li>
                                    </ul>
                                    <div className="tab-content" id="myTabContent">
                                        <div className="tab-pane fade" id="experience" role="tabpanel" aria-labelledby="experience-tab">
                                            <p>Ethan has curated and managed travel experiences across multiple continents, working with solo travelers, families, and group tours seeking unique and memorable adventures.</p>
                                            <p>As an Adventure Specialist, he oversees itinerary development, destination research, and traveler support, ensuring every journey delivers exceptional experiences, seamless logistics, and lasting memories.</p>
                                        </div>
                                        <div className="tab-pane fade" id="education" role="tabpanel" aria-labelledby="education-tab">
                                            <ul className="page-list list-unstyled mb-30">
                                                <li>
                                                    <div className="page-list-icon"><span className="ti-check"></span></div>
                                                    <div className="page-list-text">
                                                        <p>Bachelor of Tourism & Hospitality Management</p>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="page-list-icon"><span className="ti-check"></span></div>
                                                    <div className="page-list-text">
                                                        <p>Certified Travel Consultant (CTC)</p>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="tab-pane fade show active" id="awards" role="tabpanel" aria-labelledby="awards-tab">
                                            <ul className="page-list list-unstyled mb-30">
                                                <li>
                                                    <div className="page-list-icon"><span className="ti-check"></span></div>
                                                    <div className="page-list-text">
                                                        <p>Travel Excellence Award 2023</p>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="page-list-icon"><span className="ti-check"></span></div>
                                                    <div className="page-list-text">
                                                        <p>Outstanding Tour Planning Recognition 2021</p>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* Team */}
                <section className="team section-padding">
                    <div className="bg-text-style3 duru-slide-up">Experts</div>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12 text-center mb-30">
                                <div className="section-subtitle wow fadeInRight">Travel Advisors</div>
                                <div className="section-title d-rotate wow"><span className="rotate-text">Meet the Wayouts Team</span></div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="swiper team-slider">
                                    <div className="swiper-wrapper">
                                        <div className="swiper-slide">
                                            <div className="item">
                                                <div className="wrapper">
                                                    <div className="img"><img src="/assets/img/team/2.jpg" className="img-fluid" alt="" /></div>
                                                    <div className="icon"> <a href="/team-details" className="arrow"><span className="fa-solid fa-info default-icon"></span><span className="ti-arrow-top-right hover-icon"></span></a></div>
                                                </div>
                                                <div className="text">
                                                    <h4 className="name">Mia Taylor</h4>
                                                    <h6 className="position">Customer Success Manager</h6>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="swiper-slide">
                                            <div className="item">
                                                <div className="wrapper">
                                                    <div className="img"><img src="/assets/img/team/3.jpg" className="img-fluid" alt="" /></div>
                                                    <div className="icon"> <a href="/team-details" className="arrow"><span className="fa-solid fa-info default-icon"></span><span className="ti-arrow-top-right hover-icon"></span></a></div>
                                                </div>
                                                <div className="text">
                                                    <h4 className="name">Frank Mitchell</h4>
                                                    <h6 className="position">Operations Director</h6>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="swiper-slide">
                                            <div className="item">
                                                <div className="wrapper">
                                                    <div className="img"><img src="/assets/img/team/4.jpg" className="img-fluid" alt="" /></div>
                                                    <div className="icon"> <a href="/team-details" className="arrow"><span className="fa-solid fa-info default-icon"></span><span className="ti-arrow-top-right hover-icon"></span></a></div>
                                                </div>
                                                <div className="text">
                                                    <h4 className="name">Jesica Brown</h4>
                                                    <h6 className="position">Travel Designer</h6>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="swiper-slide">
                                            <div className="item">
                                                <div className="wrapper">
                                                    <div className="img"><img src="/assets/img/team/1.jpg" className="img-fluid" alt="" /></div>
                                                    <div className="icon"> <a href="/team-details" className="arrow"><span className="fa-solid fa-info default-icon"></span><span className="ti-arrow-top-right hover-icon"></span></a></div>
                                                </div>
                                                <div className="text">
                                                    <h4 className="name">Jason Walker</h4>
                                                    <h6 className="position">Adventure Specialist</h6>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        <Footer />
      </div>
    </>
  );
}
