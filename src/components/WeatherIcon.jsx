import { useEffect, useRef } from 'react';

import { WEATHER_ICONS } from '../constants';

// Inline SVG instead of <img>: its SMIL animations ignore CSS, so reduced motion pauses them from script
export default function WeatherIcon({ code, className = '' }) {
    const ref = useRef(null);
    const svg = WEATHER_ICONS[code] ?? WEATHER_ICONS['03d'];

    useEffect(() => {
        if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) ref.current.querySelector('svg').pauseAnimations();
    }, [svg]);

    // The markup comes from the bundled @meteocons/svg package, never from user input
    return <span ref={ref} className={`weather-icon ${className}`} aria-hidden="true" dangerouslySetInnerHTML={{ __html: svg }} />;
}
