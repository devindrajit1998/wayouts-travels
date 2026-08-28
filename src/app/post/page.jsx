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
                            <div className="col-md-6 text-center">
                                <div className="section-subtitle">Latest Travel News</div>
                                <div className="section-title">Experience the luxury of modern <i>Dubai</i></div>
                                <div className="post">
                                    <div className="author"> <img src="/assets/img/team/tst1.jpg" alt="" className="avatar" /> <span>Emily Brown</span> </div>
                                    <div className="date-comment"> <i className="ti-calendar"></i> 27 Dec 2026</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="container-fluid">
                        <div className="height1">
                            <div className="radius-mask">
                                <div
                                    className="bg-img height2"
                                    data-background="/assets/img/destination/03.jpg"
                                    style={{ backgroundImage: 'url(/assets/img/destination/03.jpg)' }}
                                    data-speed="0.5"
                                    data-lag="0"
                                ></div>
                            </div>
                        </div>
                    </div>
                </header>
                {/* Post */}
                <section className="post section-padding">
                    <div className="container">
                        <div className="row mb-30">
                            <div className="col-lg-8 col-md-12">
                                <p><span className="first-letter">E</span>Experience the vibrant charm of Dubai, where futuristic architecture meets rich culture and world-class luxury. Discover iconic landmarks such as the Burj Khalifa, Palm Jumeirah, and Dubai Marina, each offering a unique perspective of this extraordinary city.</p>
                            </div>
                            <div className="col-lg-3 offset-lg-1 col-md-12 mb-30">
                                <blockquote className="vert-move">
                                    <p>Dubai is not a city, it’s a vision of the future.</p> <cite>Anonymous</cite>
                                </blockquote>
                            </div>
                        </div>
                        {/* Image */}
                        <section className="image-stack">
                            <div className="image-stack-wrapper">
                                <div className="image-stack-card"> <img src="/assets/img/insta/01.jpg" alt="" /> </div>
                                <div className="image-stack-card"> <img src="/assets/img/insta/02.jpg" alt="" /> </div>
                                <div className="image-stack-card"> <img src="/assets/img/insta/03.jpg" alt="" /> </div>
                                <div className="image-stack-card"> <img src="/assets/img/insta/04.jpg" alt="" /> </div>
                                <div className="image-stack-card"> <img src="/assets/img/insta/05.jpg" alt="" /> </div>
                            </div>
                        </section>
                        <div className="row justify-content-center mb-60 pt-30">
                            <div className="col-md-6">
                                <p>From desert safaris and traditional souks to luxury shopping malls and fine dining experiences, Dubai offers something for every type of traveler. Whether you are seeking adventure, relaxation, or cultural exploration, this dynamic destination promises unforgettable moments at every turn.</p>
                            </div>
                            <div className="col-md-5 offset-md-1">
                                <p>Immerse yourself in the energy of the city and experience the perfect blend of tradition and modernity that defines Dubai today. As day turns into night, Dubai transforms into a glowing masterpiece of lights, offering unforgettable dining, entertainment, and leisure experiences.</p>
                            </div>
                        </div>
                        <div className="post-comment-section">
                            <div className="row justify-content-center">
                                {/* Comment */}
                                <div className="col-md-6 mb-30">
                                    <div className="post-comment-wrap">
                                        <div className="post-user-comment"><img src="/assets/img/team/g1.jpg" alt="" /></div>
                                        <div className="post-user-content">
                                            <h5>Emily Brown <span>[ Traveler ]</span></h5>
                                            <p>Dubai was an unforgettable journey, where modern luxury meets rich tradition. Every moment felt unique, from the skyline views to the desert experiences. <i className="fa-solid fa-thumbs-up"></i></p>
                                        </div>
                                    </div>
                                </div>
                                {/* Contact Form */}
                                <div className="col-md-5 offset-md-1">
                                    <h5 className="mb-30">Leave a Reply</h5>
                                    <form method="post">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group"> <span className="form-icon"><i className="fa-light fa-face-smile"></i></span>
                                                    <input type="text" name="name" id="name" placeholder="Your name" required />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group"> <span className="form-icon"><i className="fa-light fa-envelope"></i></span>
                                                    <input type="email" name="email" id="email" placeholder="Your email" required />
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="form-group form-textarea"> <span className="form-icon"><i className="fa-light fa-comment"></i></span>
                                                    <textarea name="message" id="message" cols="30" rows="3" placeholder="Message" required></textarea>
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <button className="butn-arrow"><span className="btn-text">Read more</span> <span className="arrow-wrap">
                                                        <span className="arrow-inner">
                                                            <i className="ti-arrow-right"></i>
                                                            <i className="ti-arrow-right"></i>
                                                        </span> </span>
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                 {/* Next & Prev */}
                <section className="nex-prv">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-5 rest">
                                <div className="prv">
                                    <div className="img bg-img" data-background="/assets/img/blog/1.jpg">
                                        <div className="text-left ontop">
                                            <h5><a href="/post">Exploring the hidden Maldives paradise</a></h5>
                                        </div>
                                        <div className="overly"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-2 text-center rest">
                                <a href="/blog" className="all-works d-flex align-items-center"> <span className="icon full-width ti-layout-grid3"></span> </a>
                            </div>
                            <div className="col-md-5 rest">
                                <div className="nxt">
                                    <div className="img bg-img" data-background="/assets/img/blog/2.jpg">
                                        <div className="text-right ontop">
                                            <h5><a href="/post">Journey through Canada’s wild beauty</a></h5>
                                        </div>
                                        <div className="overly"></div>
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
