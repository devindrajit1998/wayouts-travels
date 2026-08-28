'use client';

import AdminShell from './AdminShell';
import { bookings, tours } from './adminData';

const bars = [42, 58, 48, 72, 61, 85, 68, 94, 77, 88, 73, 100];

export default function AdminDashboard() {
    return (
        <AdminShell title="Good morning, Emily" description="Here is what is happening with your travel business today.">
            <div className="admin-grid stats">
                <div className="admin-card admin-stat"><div><span className="admin-stat-label">Total revenue</span><strong className="admin-stat-value">₹69,40,000</strong><span className="admin-stat-change"><i className="fa-light fa-arrow-trend-up"></i> 12.8% this month</span></div><span className="admin-stat-icon"><i className="fa-light fa-chart-line"></i></span></div>
                <div className="admin-card admin-stat"><div><span className="admin-stat-label">Total bookings</span><strong className="admin-stat-value">248</strong><span className="admin-stat-change"><i className="fa-light fa-arrow-trend-up"></i> 8.4% this month</span></div><span className="admin-stat-icon"><i className="fa-light fa-calendar-check"></i></span></div>
                <div className="admin-card admin-stat"><div><span className="admin-stat-label">Active travelers</span><strong className="admin-stat-value">1,864</strong><span className="admin-stat-change"><i className="fa-light fa-arrow-trend-up"></i> 6.2% this month</span></div><span className="admin-stat-icon"><i className="fa-light fa-users"></i></span></div>
                <div className="admin-card admin-stat"><div><span className="admin-stat-label">Average rating</span><strong className="admin-stat-value">4.9 / 5</strong><span className="admin-stat-change"><i className="fa-light fa-star"></i> From 186 reviews</span></div><span className="admin-stat-icon"><i className="fa-light fa-sparkles"></i></span></div>
            </div>
            <div className="admin-grid two">
                <div className="admin-card">
                    <div className="admin-card-title"><h2>Revenue overview</h2><a href="/admin/bookings">View bookings <i className="fa-light fa-arrow-up-right"></i></a></div>
                    <div className="admin-chart">{bars.map((height, index) => <span className="admin-bar" style={{ height: `${height}%` }} key={index}></span>)}</div>
                    <div className="admin-chart-labels"><span>Jan</span><span>Mar</span><span>May</span><span>Jul</span><span>Sep</span><span>Nov</span></div>
                </div>
                <div className="admin-card">
                    <div className="admin-card-title"><h2>Popular tours</h2><a href="/admin/tours">View all</a></div>
                    <div className="admin-list">{tours.slice(0, 3).map((tour) => <div className="admin-list-item" key={tour.name}><div className="admin-list-main"><img className="admin-thumb" src={tour.image} alt="" /><div><strong>{tour.name}</strong><span>{tour.bookings} bookings this month</span></div></div><span className="admin-price">{tour.price}</span></div>)}</div>
                </div>
            </div>
            <div className="admin-card admin-dashboard-bookings">
                <div className="admin-card-title"><h2>Recent bookings</h2><a href="/admin/bookings">See all bookings <i className="fa-light fa-arrow-up-right"></i></a></div>
                <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Booking</th><th>Guest</th><th>Tour</th><th>Departure</th><th>Amount</th><th>Status</th></tr></thead><tbody>{bookings.slice(0, 4).map((booking) => <tr key={booking.id}><td><strong>{booking.id}</strong></td><td>{booking.guest}</td><td>{booking.tour}</td><td>{booking.date}</td><td>{booking.amount}</td><td><span className={`admin-badge ${booking.status === 'Pending' ? 'pending' : booking.status === 'Cancelled' ? 'cancelled' : ''}`}>{booking.status}</span></td></tr>)}</tbody></table></div>
            </div>
        </AdminShell>
    );
}
