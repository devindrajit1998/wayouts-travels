import { getPageContent, savePageContent } from './siteContent';

/**
 * Structured content models for all core public pages:
 * 1. Home (via homeContent.js)
 * 2. About
 * 3. Tours
 * 4. Destinations
 * 5. Services
 * (Plus supporting pages: Blog, Contact, FAQs, Team, Testimonials)
 */
export const defaultPagesContent = {
    about: {
        pageTitle: 'About Wayouts India',
        bannerSubtitle: 'ABOUT WAYOUTS',
        bannerTitle: 'Discover Incredible India with',
        bannerHighlight: 'Wayouts Luxury Travels',
        bannerImage: '/assets/img/7.jpg',
        
        // Narrative section
        aboutSubtitle: 'WHO WE ARE',
        aboutTitlePart1: 'Crafting Bespoke Journeys',
        aboutTitlePart2: 'Across India & Beyond',
        aboutDescription: 'Headquartered in India with dedicated operations assisting travelers from Kolkata and nationwide, Wayouts curates personalized holidays, private Himalayan expeditions, royal palace retreats, and serene backwater cruises.',
        aboutImage1: '/assets/img/a4.jpg',
        aboutImage2: '/assets/img/a2.jpg',
        counterValue: '12,500+',
        counterLabel: 'Happy Indian Travelers',
        
        // Experience / Services banner
        experienceTitle1: 'Get ready to explore and',
        experienceTitle2: 'discover India’s rich heritage.',
        experienceBgImage: '/assets/img/destination/01.jpg',
        
        // Team Intro
        teamSubtitle: 'OUR EXPERTS',
        teamTitle1: 'Meet our India',
        teamTitle2: 'Travel Designers',
    },
    tours: {
        pageTitle: 'Tours & Packages India',
        bannerSubtitle: 'EXPLORE OUR TOURS',
        bannerTitle: 'Discover',
        bannerHighlight: 'unforgettable journeys across India',
        bannerImage: '/assets/img/destination/01.jpg',
        
        // Section Header
        sectionSubtitle: 'POPULAR DOMESTIC ITINERARIES',
        sectionTitle1: 'Handcrafted luxury tours &',
        sectionTitle2: 'holiday packages in India.',
    },
    destinations: {
        pageTitle: 'Indian Destinations',
        bannerSubtitle: 'EXPLORE OUR DESTINATIONS',
        bannerTitle: "Explore India's most",
        bannerHighlight: 'enchanting destinations',
        bannerImage: '/assets/img/destination/02.jpg',
        
        // Ticker & Grid Info
        sectionSubtitle: 'POPULAR INDIAN REGIONS',
        sectionTitle1: 'Handcrafted itineraries across',
        sectionTitle2: 'the Himalayas, Backwaters & Coasts.',
    },
    services: {
        pageTitle: 'Premium Travel Services India',
        bannerSubtitle: 'OUR TRAVEL SERVICES',
        bannerTitle: 'Discover services that make',
        bannerHighlight: 'Indian travel effortless',
        bannerImage: '/assets/img/destination/05.jpg',
        
        // Bottom Quote Banner
        quoteText: 'WAYOUTS transforms journeys into unforgettable Indian experiences.',
    },
    blog: {
        pageTitle: 'Incredible India Travel Journal',
        bannerSubtitle: 'LATEST TRAVEL STORIES',
        bannerTitle: 'Inspiring stories for your next',
        bannerHighlight: 'Indian adventure',
        bannerImage: '/assets/img/destination/03.jpg',
    },
    post: {
        pageTitle: 'Kashmir Valley Travel Guide',
        bannerSubtitle: 'LATEST TRAVEL STORIES',
        bannerTitle: 'Top 7 Hidden Valleys of Kashmir You',
        bannerHighlight: 'Must Explore',
        authorName: 'Sourav Banerjee',
        authorRole: 'Traveler from Kolkata',
        authorAvatar: '/assets/img/team/tst1.jpg',
        postDate: '28 Aug 2026',
        bannerImage: '/assets/img/destination/03.jpg',
        leadQuote: 'Kashmir is not just a destination; it is an unforgettable emotion of pine valleys and snowy peaks.',
        leadQuoteCite: 'Anonymous Explorer',
        leadText1: 'Beyond Dal Lake and standard tourist trails, Kashmir offers pristine pine meadows, gushing trout streams, and glacier passes in Aru, Betaab Valley, and Gurez.',
        bodyParagraph1: 'From staying in authentic wooden houseboats on Nigeen Lake to taking the high-altitude Gulmarg Gondola above the clouds, Kashmir remains India’s crowning jewel for mountain enthusiasts and romantic getaways.',
        bodyParagraph2: 'Savor traditional Kashmiri Wazwan cuisine, sip steaming Kehwa by the fireplace, and explore apple orchards under the gentle autumn sun.',
        commentUser: 'Dr. Subhashis Mukherjee',
        commentRole: 'Traveler from Kolkata',
        commentAvatar: '/assets/img/team/g1.jpg',
        commentText: 'Our trip to Kashmir with Wayouts was arranged to perfection. The local chauffeur and private houseboat stay exceeded all our expectations.',
    },
    contact: {
        pageTitle: 'Contact Wayouts Travels',
        bannerSubtitle: 'TALK TO OUR INDIA TRAVEL EXPERTS',
        bannerTitle: 'Get personalized holiday planning',
        bannerHighlight: 'support today!',
        bannerImage: '/assets/img/destination/03.jpg',
        formHeadline: 'Plan Your Next Indian Getaway!',
        phone: '+91 98765 43210',
        email: 'contact@wayouts.com',
        address: '402, Signature One, S.G. Highway, Ahmedabad & Salt Lake, Kolkata, India',
    },
    faq: {
        pageTitle: 'Frequently Asked Questions',
        bannerSubtitle: 'Popular Questions',
        bannerTitle: 'Everything you need to know about',
        bannerHighlight: 'booking with Wayouts India',
        bannerImage: '/assets/img/destination/05.jpg',
    },
    team: {
        pageTitle: 'Our Travel Experts & Guides',
        bannerSubtitle: 'Meet The Team',
        bannerTitle: 'Passionate travel designers &',
        bannerHighlight: 'local Indian guides',
        bannerImage: '/assets/img/destination/02.jpg',
    },
    testimonials: {
        pageTitle: 'Client Testimonials',
        bannerSubtitle: 'Traveler Stories',
        bannerTitle: 'What our happy guests say',
        bannerHighlight: 'about their journeys across India',
        bannerImage: '/assets/img/destination/01.jpg',
    },
};

const PAGES_DOC_ID = 'pages-meta';

export async function getPagesContent() {
    return getPageContent(PAGES_DOC_ID, defaultPagesContent);
}

export async function savePagesContent(content) {
    return savePageContent(PAGES_DOC_ID, defaultPagesContent, content);
}
