'use client';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Page() {
  return (
    <>
      <Navbar active="" extendedPages={false} />
      <div id="smooth-content">
        <main className="o-hidden">
                {/* Header Banner */}
                <header className="pg-hero section-padding">
                    <div className="container">
                        <div className="row mb-60 justify-content-center">
                            <div className="col-md-5 text-center">
                                <div className="section-subtitle">Hotel & Accommodation</div>
                                <div className="section-title">Find <i>the perfect stay</i> for every journey</div>
                            </div>
                        </div>
                    </div>
                    <div className="container-fluid">
                        <div className="height1">
                            <div className="radius-mask">
                                <div
                                    className="bg-img height2"
                                    data-background="/assets/img/destination/02.jpg"
                                    style={{ backgroundImage: 'url(/assets/img/destination/02.jpg)' }}
                                    data-speed="0.5"
                                    data-lag="0"
                                ></div>
                            </div>
                        </div>
                    </div>
                </header>
                {/* Services Details */}
                <div className="service-details section-padding pb-0">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-7 col-md-12">
                                <h4>Overview</h4>
                                <p className="mb-30">Discover carefully selected hotels and accommodations that combine comfort, quality, and convenience. Whether you're looking for a luxury resort, a boutique hotel, or a cozy stay, we help you find the perfect place to relax and enjoy your journey.</p>
                                <div className="row">
                                    <div className="col-md-12">
                                        <h4>Experience Includes</h4>
                                        <ul className="list-unstyled list">
                                            <li>
                                                <div className="list-icon"> <span className="ti-check"></span> </div>
                                                <div className="list-text">
                                                    <p>Personalized stays tailored to your travel style</p>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="list-icon"> <span className="ti-check"></span> </div>
                                                <div className="list-text">
                                                    <p>Carefully selected hotels with comfort and elegance</p>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="list-icon"> <span className="ti-check"></span> </div>
                                                <div className="list-text">
                                                    <p>Seamless blend of convenience, quality, and experience</p>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 offset-lg-1 col-md-12">
                                <blockquote className="vert-move">
                                    <p>At our travel agency, every journey is shaped by carefully crafted details that make your trip seamless and memorable.</p> <cite>Charles Eames</cite>
                                </blockquote>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Image */}
                <section className="image-stack pt-30">
                  <div className="image-stack-wrapper">
                    <div className="image-stack-card">
                      <img src="/assets/img/insta/01.jpg" alt="" />
                    </div>
                    <div className="image-stack-card">
                      <img src="/assets/img/insta/02.jpg" alt="" />
                    </div>
                    <div className="image-stack-card">
                      <img src="/assets/img/insta/03.jpg" alt="" />
                    </div>
                    <div className="image-stack-card">
                      <img src="/assets/img/insta/04.jpg" alt="" />
                    </div>
                    <div className="image-stack-card">
                      <img src="/assets/img/insta/05.jpg" alt="" />
                    </div>
                  </div>
                </section>
                {/* Services Details */}
                <section className="service-details section-padding pt-30">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-7 col-md-12">
                                <h4>Frequently Asked Questions</h4>
                                <ul className="accordion-box clearfix">
                                    <li className="accordion block">
                                        <div className="acc-btn">How do I make a hotel reservation?</div>
                                        <div className="acc-content">
                                            <div className="content">
                                                <p>You can easily book your stay through our website or by contacting our travel consultants for personalized assistance.</p> <i className="fa-thin fa-hotel"></i>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="accordion block">
                                        <div className="acc-btn">What is the check-in and check-out time?</div>
                                        <div className="acc-content">
                                            <div className="content">
                                                <p>Check-in and check-out times vary by hotel, but we always provide full details before your booking is confirmed.</p> <i className="fa-thin fa-calendar"></i>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="accordion block active-block">
                                        <div className="acc-btn active">Can I modify or cancel my booking?</div>
                                        <div className="acc-content" style={{ display: 'block' }}>
                                            <div className="content">
                                                <p>Yes, most reservations can be modified or canceled according to the hotel’s policy. Our team is here to assist you with any changes.</p> <i className="fa-thin fa-plane"></i>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
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
