export const bookings = [
    { id: 'WV-1048', guest: 'Olivia Martin', tour: 'Amalfi Coast Escape', date: 'Sep 12, 2026', amount: '$2,480', status: 'Confirmed' },
    { id: 'WV-1047', guest: 'Noah Williams', tour: 'Japan Discovery', date: 'Sep 18, 2026', amount: '$3,150', status: 'Pending' },
    { id: 'WV-1046', guest: 'Emma Johnson', tour: 'Bali Wellness Week', date: 'Oct 02, 2026', amount: '$1,890', status: 'Confirmed' },
    { id: 'WV-1045', guest: 'Liam Brown', tour: 'Swiss Alps Journey', date: 'Oct 09, 2026', amount: '$2,760', status: 'Cancelled' },
    { id: 'WV-1044', guest: 'Sophia Davis', tour: 'Paris City Break', date: 'Oct 14, 2026', amount: '$1,420', status: 'Confirmed' },
];

export const tours = [
    { name: 'Amalfi Coast Escape', destination: 'Italy', duration: '7 days', price: '$2,480', bookings: 38, image: '/assets/img/destination/01.jpg', status: 'Active' },
    { name: 'Japan Discovery', destination: 'Japan', duration: '10 days', price: '$3,150', bookings: 29, image: '/assets/img/destination/02.jpg', status: 'Active' },
    { name: 'Bali Wellness Week', destination: 'Indonesia', duration: '8 days', price: '$1,890', bookings: 44, image: '/assets/img/destination/03.jpg', status: 'Active' },
    { name: 'Swiss Alps Journey', destination: 'Switzerland', duration: '6 days', price: '$2,760', bookings: 21, image: '/assets/img/destination/05.jpg', status: 'Draft' },
];

export const destinations = [
    { name: 'Italy', region: 'Europe', tours: 8, travelers: '1,240', image: '/assets/img/destination/a.jpg', status: 'Published' },
    { name: 'Japan', region: 'Asia', tours: 6, travelers: '980', image: '/assets/img/destination/b.jpg', status: 'Published' },
    { name: 'Indonesia', region: 'Asia', tours: 5, travelers: '860', image: '/assets/img/destination/c.jpg', status: 'Published' },
    { name: 'Switzerland', region: 'Europe', tours: 4, travelers: '720', image: '/assets/img/destination/d.jpg', status: 'Draft' },
];

export const customers = [
    { name: 'Olivia Martin', email: 'olivia@example.com', trips: 4, spent: '$8,420', joined: 'Jan 18, 2026', initials: 'OM' },
    { name: 'Noah Williams', email: 'noah@example.com', trips: 2, spent: '$4,980', joined: 'Feb 07, 2026', initials: 'NW' },
    { name: 'Emma Johnson', email: 'emma@example.com', trips: 6, spent: '$12,340', joined: 'Mar 22, 2026', initials: 'EJ' },
    { name: 'Liam Brown', email: 'liam@example.com', trips: 3, spent: '$6,780', joined: 'Apr 11, 2026', initials: 'LB' },
];

export const inquiries = [
    { from: 'Mia Anderson', subject: 'Private group tour in Italy', channel: 'Website', date: 'Aug 27, 2026', status: 'New' },
    { from: 'James Wilson', subject: 'Airport transfer for Bali trip', channel: 'Email', date: 'Aug 26, 2026', status: 'Replied' },
    { from: 'Ava Thompson', subject: 'Family package availability', channel: 'Website', date: 'Aug 25, 2026', status: 'New' },
    { from: 'Ethan Moore', subject: 'Dietary requirements in Japan', channel: 'Email', date: 'Aug 24, 2026', status: 'Closed' },
];

export const reviews = [
    { guest: 'Olivia Martin', tour: 'Amalfi Coast Escape', rating: 5, excerpt: 'Every detail was thoughtfully arranged. Our guide was exceptional.', date: 'Aug 25, 2026', status: 'Published' },
    { guest: 'Emma Johnson', tour: 'Bali Wellness Week', rating: 5, excerpt: 'A calm, beautiful itinerary with just the right amount of adventure.', date: 'Aug 22, 2026', status: 'Published' },
    { guest: 'Noah Williams', tour: 'Japan Discovery', rating: 4, excerpt: 'Excellent hotels and local experiences. Communication was prompt.', date: 'Aug 19, 2026', status: 'Pending' },
];

export const posts = [
    { title: 'The essential guide to slow travel', category: 'Travel tips', author: 'Emily White', date: 'Aug 24, 2026', status: 'Published', image: '/assets/img/blog/1.jpg' },
    { title: 'Seven hidden places along the Amalfi Coast', category: 'Destinations', author: 'Daniel Scott', date: 'Aug 20, 2026', status: 'Published', image: '/assets/img/blog/2.jpg' },
    { title: 'What to pack for a wellness retreat', category: 'Inspiration', author: 'Sarah Kim', date: 'Aug 16, 2026', status: 'Draft', image: '/assets/img/blog/3.jpg' },
];

export const team = [
    { name: 'Emily White', role: 'Travel Director', email: 'emily@wayouts.com', tours: 18, image: '/assets/img/team/1.jpg', status: 'Active' },
    { name: 'Daniel Scott', role: 'Senior Guide', email: 'daniel@wayouts.com', tours: 24, image: '/assets/img/team/2.jpg', status: 'Active' },
    { name: 'Sarah Kim', role: 'Destination Specialist', email: 'sarah@wayouts.com', tours: 15, image: '/assets/img/team/3.jpg', status: 'Active' },
    { name: 'Michael Reed', role: 'Guest Experience', email: 'michael@wayouts.com', tours: 11, image: '/assets/img/team/4.jpg', status: 'Away' },
];
