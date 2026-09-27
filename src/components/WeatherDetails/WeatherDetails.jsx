import { CLOUDS_SCALE, HUMIDITY_SCALE, PRESSURE_SCALE, VISIBILITY_SCALE } from '../../constants';
import { Cloud, Droplets, Eye, Gauge, Umbrella } from 'lucide-react';
import { describe, formatNumber } from '../../utils/format';
import { useTranslation } from 'react-i18next';

import LocationCard from '../LocationCard/LocationCard';
import MetricCard from '../MetricCard/MetricCard';
import WindCard from '../WindCard/WindCard';
import SunCard from '../SunCard/SunCard';
import './WeatherDetails.css';

// Translation key for the precipitation card's description
function precipitationHint(rain, snow) {
    if (rain !== undefined && snow !== undefined) return 'rainAndSnow';
    if (rain !== undefined) return 'rain';
    if (snow !== undefined) return 'snow';
    return 'none';
}

export default function WeatherDetails({ data }) {
    const { t, i18n } = useTranslation();
    const language = i18n.resolvedLanguage;
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
                title={t('humidity.title')}
                index={2}
                value={main.humidity}
                unit="%"
                level={main.humidity / 100}
                hint={t(`scales.humidity.${describe(main.humidity, HUMIDITY_SCALE)}`)}
            />
            {/* main.pressure is already at sea level; grnd_level uses a coarse model terrain height, so it is left out */}
            <MetricCard
                icon={Gauge}
                title={t('pressure.title')}
                index={3}
                value={main.pressure}
                unit="hPa"
                hint={t(`scales.pressure.${describe(main.pressure, PRESSURE_SCALE)}`)}
            />
            <MetricCard
                icon={Eye}
                title={t('visibility.title')}
                index={4}
                value={formatNumber(visibility, language)}
                unit="km"
                level={visibility / 10}
                hint={t(`scales.visibility.${describe(visibility, VISIBILITY_SCALE)}`)}
            />
            <MetricCard
                icon={Cloud}
                title={t('clouds.title')}
                index={5}
                value={clouds.all}
                unit="%"
                level={clouds.all / 100}
                hint={t(`scales.clouds.${describe(clouds.all, CLOUDS_SCALE)}`)}
            />
            <MetricCard
                icon={Umbrella}
                title={t('precipitation.title')}
                index={6}
                className="card--precipitation"
                value={formatNumber((rain ?? 0) + (snow ?? 0), language)}
                unit="mm"
                hint={t(`precipitation.${precipitationHint(rain, snow)}`)}
            >
                {rain !== undefined && snow !== undefined && (
                    <dl className="facts">
                        <div>
                            <dt>{t('precipitation.rainLabel')}</dt>
                            <dd>{formatNumber(rain, language)} mm</dd>
                        </div>
                        <div>
                            <dt>{t('precipitation.snowLabel')}</dt>
                            <dd>{formatNumber(snow, language)} mm</dd>
                        </div>
                    </dl>
                )}
            </MetricCard>
            <LocationCard data={data} index={7} />
        </div>
    );
}