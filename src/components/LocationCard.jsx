import { MapPin } from 'lucide-react';

import useNow from '../hooks/useNow';
import { formatCityTime, formatCoordinates, formatRelativeTime, formatUtcOffset } from '../utils/format';
import Card from './Card';
import ExternalLink from './ExternalLink';

export default function LocationCard({ data, index }) {
    const now = useNow();
    const { coord, timezone, dt, id } = data;

    return (
        <Card icon={MapPin} title="Ubicación" index={index} className="card--location">
            <dl className="facts facts--columns">
                <div>
                    <dt>Coordenadas</dt>
                    <dd>{formatCoordinates(coord)}</dd>
                </div>
                <div>
                    <dt>Zona horaria</dt>
                    <dd>{formatUtcOffset(timezone)}</dd>
                </div>
                <div>
                    <dt>Datos medidos</dt>
                    <dd>{formatRelativeTime(dt, now)} ({formatCityTime(dt, timezone)})</dd>
                </div>
            </dl>
            <div className="card__links">
                <ExternalLink href={`https://www.openstreetmap.org/?mlat=${coord.lat}&mlon=${coord.lon}#map=11/${coord.lat}/${coord.lon}`}>
                    Ver en el mapa
                </ExternalLink>
                <ExternalLink href={`https://openweathermap.org/city/${id}`}>Ver en OpenWeather</ExternalLink>
            </div>
        </Card>
    );
}
