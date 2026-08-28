'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Loads all template scripts sequentially in the EXACT order used by the
 * original HTML pages. Order is critical:
 *   jQuery -> migrate -> plugins -> imagesLoaded -> GSAP -> ScrollSmoother ->
 *   ScrollTrigger -> smoother-script -> springer -> lenis -> three ->
 *   hover-effect -> custom.js
 *
 * Runs after React has mounted the full page DOM (useEffect).
 * Skips heavy smooth-scroll/webGL scripts when navigating within /admin or /account
 * so admin pages retain fast, instantaneous native browser scrolling.
 */

const FRONTEND_SCRIPTS = [
    '/assets/js/jquery-3.6.0.min.js',
    '/assets/js/jquery-migrate-3.4.0.min.js',
    '/assets/js/plugins.js',
    '/assets/js/imagesloaded.pkgd.min.js',
    '/assets/js/gsap.min.js',
    '/assets/js/ScrollSmoother.min.js',
    '/assets/js/ScrollTrigger.min.js',
    '/assets/js/smoother-script.js',
    '/assets/js/springer.min.js',
    '/assets/js/lenis.min.js',
    '/assets/js/three.min.js',
    '/assets/js/hover-effect.umd.js',
    '/assets/js/custom.js',
];

const ADMIN_SCRIPTS = [
    '/assets/js/jquery-3.6.0.min.js',
    '/assets/js/plugins.js',
];

function loadScript(src) {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
            return resolve();
        }
        const script = document.createElement('script');
        script.src = src;
        script.async = false;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
        document.body.appendChild(script);
    });
}

export default function ScriptLoader() {
    const pathname = usePathname();
    const isAdminOrAccount = pathname?.startsWith('/admin') || pathname?.startsWith('/account');

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const scriptList = isAdminOrAccount ? ADMIN_SCRIPTS : FRONTEND_SCRIPTS;
                for (const src of scriptList) {
                    if (cancelled) return;
                    await loadScript(src);
                }
                
                // If on public frontend and window is complete, replicate preloader toggle
                if (!isAdminOrAccount && !cancelled && document.readyState === 'complete') {
                    document.body.classList.add('loaded');
                    setTimeout(() => {
                        document.body.classList.remove('loaded');
                    }, 1500);
                }
            } catch (err) {
                console.error(err);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [pathname, isAdminOrAccount]);

    return null;
}
