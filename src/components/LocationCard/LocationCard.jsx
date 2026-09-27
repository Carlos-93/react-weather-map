import { formatCityTime, formatCoordinates, formatRelativeTime, formatUtcOffset } from '../../utils/format';
import { useTranslation } from 'react-i18next';
import { MapPin } from 'lucide-react';

import ExternalLink from '../ExternalLink/ExternalLink';
import useNow from '../../hooks/useNow';
import Card from '../Card/Card';
import './LocationCard.css';

export default function LocationCard({ data, index }) {
    const { t, i18n } = useTranslation();
    const language = i18n.resolvedLanguage;
    const now = useNow();
    const { coord, timezone, dt, id } = data;

    return (
        <Card icon={MapPin} title={t('location.title')} index={index} className="card--location">
            <dl className="facts facts--columns">
                <div>
                    <dt>{t('location.coordinates')}</dt>
                    <dd>{formatCoordinates(coord, language, t('compass', { returnObjects: true }))}</dd>
                </div>

                <div>
                    <dt>{t('location.timeZone')}</dt>
                    <dd>{formatUtcOffset(timezone)}</dd>
                </div>

                <div>
                    <dt>{t('location.measured')}</dt>
                    <dd>{formatRelativeTime(dt, now, language)} ({formatCityTime(dt, timezone, language)})</dd>
                </div>
            </dl>

            <div className="card__links">
                <ExternalLink href={`https://www.openstreetmap.org/?mlat=${coord.lat}&mlon=${coord.lon}#map=11/${coord.lat}/${coord.lon}`}>
                    {t('location.map')}
                </ExternalLink>
                <ExternalLink href={`https://openweathermap.org/city/${id}`}>{t('location.openWeather')}</ExternalLink>
            </div>
        </Card>
    );
}