'use client';

import { useState } from 'react';
import { addCollectionItem } from '../../lib/firestoreService';

export default function ContactForm({
    headline = 'Get in touch!',
    image = '/assets/img/destination/b.jpg',
}) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null); // 'success' | 'error' | null

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        try {
            const d = new Date();
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const today = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;

            await addCollectionItem('inquiries', {
                from: name,
                email: email,
                subject: subject || 'General Travel Inquiry',
                notes: message,
                channel: 'Website Contact Form',
                date: today,
                status: 'New'
            });

            setStatus('success');
            setName('');
            setEmail('');
            setSubject('');
            setMessage('');
        } catch (err) {
            console.error('Contact form submission error:', err);
            setStatus('error');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="contact section-padding">
            <div className="container">
                <div className="row justify-content-center align-items-center">
                    <div className="col-md-4">
                        <div className="item-img duru-rotate-scale-reveal">
                            <img src={image} alt="" />
                        </div>
                    </div>
                    <div className="col-md-5 offset-md-1">
                        <div className="contact-form">
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-12 text-left">
                                        <h3>{headline}</h3>
                                        {status === 'success' && (
                                            <div style={{ padding: '10px 14px', background: '#dcfce7', color: '#15803d', borderRadius: '8px', fontSize: '13px', marginBottom: '14px', border: '1px solid #86efac' }}>
                                                Thank you! Your travel inquiry has been received. Our Kolkata team will contact you shortly.
                                            </div>
                                        )}
                                        {status === 'error' && (
                                            <div style={{ padding: '10px 14px', background: '#fee2e2', color: '#b91c1c', borderRadius: '8px', fontSize: '13px', marginBottom: '14px', border: '1px solid #fca5a5' }}>
                                                Unable to send message right now. Please try again or reach out on WhatsApp.
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <span className="form-icon"><i className="fa-light fa-face-smile"></i></span>
                                            <input
                                                type="text"
                                                name="name"
                                                id="name"
                                                placeholder="Your name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <span className="form-icon"><i className="fa-light fa-envelope"></i></span>
                                            <input
                                                type="email"
                                                name="email"
                                                id="email"
                                                placeholder="Your email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <span className="form-icon"><i className="fa-light fa-book"></i></span>
                                            <input
                                                type="text"
                                                name="subject"
                                                id="subject"
                                                placeholder="Destination / Subject"
                                                value={subject}
                                                onChange={(e) => setSubject(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="form-group form-textarea">
                                            <span className="form-icon"><i className="fa-light fa-comment"></i></span>
                                            <textarea
                                                name="message"
                                                id="message"
                                                cols="30"
                                                rows="3"
                                                placeholder="Tell us about your travel dates, group size, and preferences..."
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                required
                                            ></textarea>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <button className="butn-arrow" type="submit" disabled={loading}>
                                            <span className="btn-text">{loading ? 'Sending...' : 'Send message'}</span>
                                            <span className="arrow-wrap">
                                                <span className="arrow-inner">
                                                    <i className="ti-arrow-right"></i>
                                                    <i className="ti-arrow-right"></i>
                                                </span>
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
