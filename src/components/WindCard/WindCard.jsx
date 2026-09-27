import { compassPoint, describe, toKmh } from '../../utils/format';
import { useTranslation } from 'react-i18next';
import { WIND_SCALE } from '../../constants';
import { Wind } from 'lucide-react';

import Card from '../Card/Card';
import './WindCard.css';

const TICKS = Array.from({ length: 36 }, (_, index) => index * 10);

// `points` is the translated compass rose: north, east, south and west are points 0, 4, 8 and 12
function Compass({ degrees, points }) {
    return (
        <svg className="compass" viewBox="0 0 120 120" aria-hidden="true">
            <circle className="compass__ring" cx="60" cy="60" r="54" />
            {TICKS.map((angle) => (
                <line
                    key={angle}
                    className={angle % 90 ? 'compass__tick' : 'compass__tick compass__tick--major'}
                    x1="60" y1="8" x2="60"
                    y2={angle % 90 ? 13 : 16}
                    transform={`rotate(${angle} 60 60)`}
                />
            ))}
            <text x="60" y="26">{points[0]}</text>
            <text x="95" y="61">{points[4]}</text>
            <text x="60" y="96">{points[8]}</text>
            <text x="25" y="61">{points[12]}</text>
            {/* The arrow points where the wind blows to, opposite the direction it comes from */}
            <g className="compass__needle" style={{ '--rotation': `${degrees + 180}deg` }}>
                <path d="M60 30 L67 52 L60 48 L53 52 Z" />
                <line x1="60" y1="48" x2="60" y2="88" />
            </g>
            <circle className="compass__center" cx="60" cy="60" r="3.5" />
        </svg>
    );
}

export default function WindCard({ wind, index }) {
    const { t } = useTranslation();
    const points = t('compass', { returnObjects: true });
    const speed = toKmh(wind.speed);

    return (
        <Card icon={Wind} title={t('wind.title')} index={index} className="card--wide wind">
            <div className="wind__body">
                <div className="wind__readings">
                    <p className="metric">
                        <span className="metric__value">{speed}</span>
                        <span className="metric__unit">km/h</span>
                    </p>
                    <p className="card__hint">{t(`scales.wind.${describe(speed, WIND_SCALE)}`)}</p>
                    <dl className="facts">
                        <div>
                            <dt>{t('wind.direction')}</dt>
                            <dd>{t('wind.from', { point: compassPoint(wind.deg, points), degrees: wind.deg })}</dd>
                        </div>
                        {wind.gust !== undefined && (
                            <div>
                                <dt>{t('wind.gusts')}</dt>
                                <dd>{toKmh(wind.gust)} km/h</dd>
                            </div>
                        )}
                    </dl>
                </div>
                <Compass degrees={wind.deg} points={points} />
            </div>
        </Card>
    );
}