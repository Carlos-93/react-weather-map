import { CloudSun } from 'lucide-react';

import ExternalLink from './ExternalLink';

const YEAR = new Date().getFullYear();

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer__brand">
                <p className="footer__name">
                    <CloudSun aria-hidden="true" />
                    Tiempo y Radar
                </p>
                <p>El tiempo actual de cualquier ciudad del mundo.</p>
            </div>
            <nav aria-label="Enlaces externos">
                <ul className="footer__links">
                    <li>
                        <ExternalLink href="https://openweathermap.org/">Datos de OpenWeather</ExternalLink>
                    </li>
                    <li>
                        <ExternalLink href="https://github.com/Carlos-93/react-weather-map">Código en GitHub</ExternalLink>
                    </li>
                    <li>
                        <ExternalLink href="https://www.carlos-ag.com/">Portfolio</ExternalLink>
                    </li>
                </ul>
            </nav>
            <p className="footer__copy">© {YEAR} Carlos Araujo Galván</p>
        </footer>
    );
}
