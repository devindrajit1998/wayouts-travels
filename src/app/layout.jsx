import './admin.css';
import ScriptLoader from './components/ScriptLoader';
import Preloader from './components/Preloader';
import Cursor from './components/Cursor';
import ProgressWrap from './components/ProgressWrap';

export const metadata = {
    title: 'Wayouts — Luxury Travel & Adventure Tours',
    description: 'Wayouts Luxury Travel Agency and Tour Operator',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" type="image/x-icon" href="/assets/img/favicon.ico" />
                <link rel="preconnect" href="https://fonts.googleapis.com/" />
                <link rel="preconnect" href="https://fonts.gstatic.com/" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;500;600;700&family=Barlow+Semi+Condensed:wght@300;400;500;600;700&display=swap"
                    rel="stylesheet"
                />
                <link rel="stylesheet" href="/assets/css/plugins.css" />
                <link rel="stylesheet" href="/assets/css/style.css" />
            </head>
            <body>
                {/* Preloader */}
                <Preloader />
                {/* Cursor */}
                <Cursor />
                {/* Progress scroll totop */}
                <ProgressWrap />
                {/* Smooth-wrapper */}
                <div id="smooth-wrapper">{children}</div>
                {/* Scripts (loaded sequentially after mount, in original order) */}
                <ScriptLoader />
            </body>
        </html>
    );
}
