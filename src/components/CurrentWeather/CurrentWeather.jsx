import { formatCityDate, formatCityTime, formatCountry, formatTemperature } from '../../utils/format';
import { CLOUD_DESCRIPTIONS } from '../../constants';
import { MapPin } from 'lucide-react';

import WeatherIcon from '../WeatherIcon/WeatherIcon';
import useNow from '../../hooks/useNow';
import './CurrentWeather.css';

export default function CurrentWeather({ data, ref }) {
    const nowSeconds = Math.floor(useNow() / 1000);
    const { name, sys, timezone, main, weather } = data;

    return (
        <section className="current" aria-labelledby="city-name">
            <div className="current__heading">
                <p className="current__country">
                    <MapPin aria-hidden="true" />
                    {formatCountry(sys.country)}
                </p>

                <h1 id="city-name" className="current__city" ref={ref} tabIndex={-1}>
                    {name}
                </h1>
                
                <p className="current__time">
                    {formatCityDate(nowSeconds, timezone)} · {formatCityTime(nowSeconds, timezone)} hora local
                </p>
            </div>

            <div className="current__reading">
                <WeatherIcon code={weather[0].icon} className="current__icon" />
                <p className="current__temperature">
                    <span className="visually-hidden">Temperatura actual: </span>
                    {formatTemperature(main.temp)}
                </p>
            </div>

            <div className="current__summary">
                <p className="current__description">
                    {weather.map(({ id, description }) => CLOUD_DESCRIPTIONS[id] ?? description).join(', ')}
                </p>
                
                {/* No min and max: OpenWeather's temp_min/temp_max are the spread across stations right now, not the day's range */}
                <dl className="current__stats">
                    <div style={{ '--index': 0 }}>
                        <dt>Sensación</dt>
                        <dd>{formatTemperature(main.feels_like)}</dd>
                    </div>
                </dl>
            </div>
        </section>
    );
}