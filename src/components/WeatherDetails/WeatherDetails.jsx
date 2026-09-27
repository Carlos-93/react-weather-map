import { Cloud, Droplets, Eye, Gauge, Umbrella } from 'lucide-react';

import { CLOUDS_SCALE, HUMIDITY_SCALE, PRESSURE_SCALE, VISIBILITY_SCALE } from '../constants';
import { describe, formatNumber } from '../utils/format';
import LocationCard from './LocationCard';
import MetricCard from './MetricCard';
import SunCard from './SunCard';
import WindCard from './WindCard';

function precipitationHint(rain, snow) {
    if (rain !== undefined && snow !== undefined) return 'Lluvia y nieve en la última hora';
    if (rain !== undefined) return 'Lluvia en la última hora';
    if (snow !== undefined) return 'Nieve en la última hora';
    return 'Sin precipitación en la última hora';
}

export default function WeatherDetails({ data }) {
    const { main, wind, clouds, sys, timezone } = data;
    const visibility = data.visibility / 1000;
    const rain = data.rain?.['1h'];
    const snow = data.snow?.['1h'];

    return (
        <div className="details">
            <WindCard wind={wind} index={0} />
            <SunCard sunrise={sys.sunrise} sunset={sys.sunset} timezone={timezone} index={1} />
            <MetricCard
                icon={Droplets}
                title="Humedad"
                index={2}
                value={main.humidity}
                unit="%"
                level={main.humidity / 100}
                hint={describe(main.humidity, HUMIDITY_SCALE)}
            />
            {/* main.pressure is already at sea level; grnd_level uses a coarse model terrain height, so it is left out */}
            <MetricCard
                icon={Gauge}
                title="Presión"
                index={3}
                value={main.pressure}
                unit="hPa"
                hint={describe(main.pressure, PRESSURE_SCALE)}
            />
            <MetricCard
                icon={Eye}
                title="Visibilidad"
                index={4}
                value={formatNumber(visibility)}
                unit="km"
                level={visibility / 10}
                hint={describe(visibility, VISIBILITY_SCALE)}
            />
            <MetricCard
                icon={Cloud}
                title="Nubosidad"
                index={5}
                value={clouds.all}
                unit="%"
                level={clouds.all / 100}
                hint={describe(clouds.all, CLOUDS_SCALE)}
            />
            <MetricCard
                icon={Umbrella}
                title="Precipitación"
                index={6}
                className="card--precipitation"
                value={formatNumber((rain ?? 0) + (snow ?? 0))}
                unit="mm"
                hint={precipitationHint(rain, snow)}
            >
                {rain !== undefined && snow !== undefined && (
                    <dl className="facts">
                        <div>
                            <dt>Lluvia</dt>
                            <dd>{formatNumber(rain)} mm</dd>
                        </div>
                        <div>
                            <dt>Nieve</dt>
                            <dd>{formatNumber(snow)} mm</dd>
                        </div>
                    </dl>
                )}
            </MetricCard>
            <LocationCard data={data} index={7} />
        </div>
    );
}
