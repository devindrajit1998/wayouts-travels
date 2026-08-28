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
                                <div className="section-subtitle">Explore Our Tours</div>
                                <div className="section-title">Maldives Paradise Escape</div>
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
                {/* Tour Details */}
                <section className="tour-details stsec section-padding">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-lg-6 col-md-12 mb-30">
                                <h4>Overview</h4>
                                <p className="mb-30">Escape to pure paradise with our Maldives Paradise Escape tour. Experience crystal-clear turquoise waters, white sandy beaches, and luxurious island resorts. This carefully designed package offers the perfect balance of relaxation, adventure, and unforgettable tropical beauty.</p>
                                <h4>Tour Highlights</h4>
                                <ul className="page-list list-unstyled mb-30">
                                    <li>
                                        <div className="page-list-icon"> <span className="ti-check"></span> </div>
                                        <div className="page-list-text">
                                            <p>Stay in a five star beachfront resort</p>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="page-list-icon"> <span className="ti-check"></span> </div>
                                        <div className="page-list-text">
                                            <p>Direct access to private beaches</p>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="page-list-icon"> <span className="ti-check"></span> </div>
                                        <div className="page-list-text">
                                            <p>Sunset cruises and dolphin watching</p>
                                        </div>
                                    </li>
                                </ul>
                                <h4>Best Time to Visit</h4>
                                <p className="mb-30">November – April (dry season, best weather conditions)</p>
                                <h4>Who is it for?</h4>
                                <p className="mb-30">Couples, honeymooners, families, and luxury travel lovers</p>
                                <h4>Included Services</h4>
                                <ul className="page-list list-unstyled mb-30">
                                    <li>
                                        <div className="page-list-icon"> <span className="ti-check"></span> </div>
                                        <div className="page-list-text">
                                            <p>Daily breakfast</p>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="page-list-icon"> <span className="ti-check"></span> </div>
                                        <div className="page-list-text">
                                            <p>Guided island activities</p>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="page-list-icon"> <span className="ti-check"></span> </div>
                                        <div className="page-list-text">
                                            <p>Welcome assistance on arrival</p>
                                        </div>
                                    </li>
                                </ul>
                                <h4>Not Included</h4>
                                <ul className="page-list list-unstyled">
                                    <li>
                                        <div className="page-list-icon"> <span className="ti-check"></span> </div>
                                        <div className="page-list-text">
                                            <p>International flights</p>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="page-list-icon"> <span className="ti-check"></span> </div>
                                        <div className="page-list-text">
                                            <p>Personal expenses</p>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="page-list-icon"> <span className="ti-check"></span> </div>
                                        <div className="page-list-text">
                                            <p>Optional tours & activities</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="col-lg-4 offset-lg-1 col-md-12">
                                <div className="cont stack-title">
                                    <h4>Tour Details</h4>
                                    <div className="item">
                                        <div className="icon"><i className="fa-light fa-calendar-alt"></i></div>
                                        <div className="title">Tour Date</div>
                                        <div className="value">26.05.2027</div>
                                    </div>
                                    <div className="item">
                                        <div className="icon"><i className="fa-light fa-people-group"></i></div>
                                        <div className="title">Group</div>
                                        <div className="value">15 - 20 People</div>
                                    </div>
                                    <div className="item">
                                        <div className="icon"><i className="fa-light fa-hourglass-start"></i></div>
                                        <div className="title">Duration</div>
                                        <div className="value">6 Days - 5 Nights</div>
                                    </div>
                                    <div className="item">
                                        <div className="icon"><i className="fa-light fa-map-marker-alt"></i></div>
                                        <div className="title">Location</div>
                                        <div className="value">Maldives, Asia</div>
                                    </div>
                                    <div className="item">
                                        <div className="icon status-completed"><i className="fa-light fa-circle-check"></i></div>
                                        <div className="title">Status</div>
                                        <div className="value status-completed">Completed</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* Gallery Scroll Image */}
                <section className="galleryscroll section-padding pt-0">
                    <div className="container-fluid p-0 box-right-7">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="swiper galleryscroll-slider">
                                    <div className="swiper-wrapper">
                                        <div className="swiper-slide">
                                            <div className="item">
                                                <a href="/assets/img/destination/a.jpg" title="" className="img-zoom">
                                                    <div className="img"> <img src="/assets/img/destination/a.jpg" className="img-fluid mx-auto d-block" alt="" /> </div>
                                                </a>
                                            </div>
                                        </div>
                                        <div className="swiper-slide">
                                            <div className="item">
                                                <a href="/assets/img/destination/b.jpg" title="" className="img-zoom">
                                                    <div className="img"> <img src="/assets/img/destination/b.jpg" className="img-fluid mx-auto d-block" alt="" /> </div>
                                                </a>
                                            </div>
                                        </div>
                                        <div className="swiper-slide">
                                            <div className="item">
                                                <a href="/assets/img/destination/c.jpg" title="" className="img-zoom">
                                                    <div className="img"> <img src="/assets/img/destination/c.jpg" className="img-fluid mx-auto d-block" alt="" /> </div>
                                                </a>
                                            </div>
                                        </div>
                                        <div className="swiper-slide">
                                            <div className="item">
                                                <a href="/assets/img/destination/d.jpg" title="" className="img-zoom">
                                                    <div className="img"> <img src="/assets/img/destination/d.jpg" className="img-fluid mx-auto d-block" alt="" /> </div>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
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
                                    <div className="img bg-img" data-background="/assets/img/destination/03.jpg">
                                        <div className="text-left ontop">
                                            <h5><a href="/tour-details">Dubai Luxury Journey</a></h5>
                                        </div>
                                        <div className="overly"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-2 text-center rest">
                                <a href="/tours" className="all-works d-flex align-items-center"> <span className="icon full-width ti-layout-grid3"></span> </a>
                            </div>
                            <div className="col-md-5 rest">
                                <div className="nxt">
                                    <div className="img bg-img" data-background="/assets/img/destination/02.jpg">
                                        <div className="text-right ontop">
                                            <h5><a href="/tour-details">Canadian Nature Tour</a></h5>
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
