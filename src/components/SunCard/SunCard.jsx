import { formatCityTime, formatDuration } from '../../utils/format';
import { Sun, Sunrise, Sunset } from 'lucide-react';

import useNow from '../../hooks/useNow';
import Card from '../Card/Card';
import './SunCard.css';

// Half circle from the left horizon (sunrise) to the right one (sunset)
const ARC = 'M20 90 A80 80 0 0 1 180 90';

function sunStatus(nowSeconds, sunrise, sunset) {
    if (nowSeconds < sunrise) return `Amanece en ${formatDuration(sunrise - nowSeconds)}`;
    if (nowSeconds <= sunset) return `Quedan ${formatDuration(sunset - nowSeconds)} de luz`;
    return 'El sol ya se ha puesto';
}

// Component for displaying sunrise, sunset and day length, with a visual representation of the sun's path
export default function SunCard({ sunrise, sunset, timezone, index }) {
    const nowSeconds = Math.floor(useNow() / 1000);
    const dayLength = sunset - sunrise;
    const progress = dayLength > 0 ? (nowSeconds - sunrise) / dayLength : 0;
    const clamped = Math.min(Math.max(progress, 0), 1);
    const isDaytime = progress >= 0 && progress <= 1;
    const angle = Math.PI * clamped;

    return (
        <Card icon={Sun} title="Sol" index={index} className="card--wide sun">
            <svg className={isDaytime ? 'sun-path' : 'sun-path sun-path--night'} viewBox="0 0 200 100" aria-hidden="true">
                <path className="sun-path__track" d={ARC} pathLength="1" />
                <path className="sun-path__progress" d={ARC} pathLength="1" style={{ '--progress': clamped }} />
                <line className="sun-path__horizon" x1="4" y1="90" x2="196" y2="90" />
                {isDaytime && (
                    <circle className="sun-path__sun" cx={100 - 80 * Math.cos(angle)} cy={90 - 80 * Math.sin(angle)} r="7" />
                )}
            </svg>
            
            <p className="card__hint">{sunStatus(nowSeconds, sunrise, sunset)}</p>
            <dl className="facts facts--columns">
                <div>
                    <dt><Sunrise aria-hidden="true" />Amanecer</dt>
                    <dd>{formatCityTime(sunrise, timezone)}</dd>
                </div>

                <div>
                    <dt><Sunset aria-hidden="true" />Atardecer</dt>
                    <dd>{formatCityTime(sunset, timezone)}</dd>
                </div>
                
                <div>
                    <dt>Horas de luz</dt>
                    <dd>{formatDuration(dayLength)}</dd>
                </div>
            </dl>
        </Card>
    );
}