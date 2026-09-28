import { useTranslation } from 'react-i18next';
import { CloudSun } from 'lucide-react';

import ExternalLink from '../ExternalLink/ExternalLink';
import './Footer.css';

const YEAR = new Date().getFullYear();

// Footer component with brand and links to data sources and code repository
export default function Footer() {
    const { t } = useTranslation();

    return (
        <footer className="footer">
            <div className="footer__inner">
                <p className="footer__brand">
                    <CloudSun aria-hidden="true" />
                    <strong>Tiempo y Radar</strong>
                    <span>© {YEAR} Carlos Araujo Galván</span>
                </p>

                <nav aria-label={t('footer.nav')}>
                    <ul className="footer__links">
                        {/* Brand names stay untranslated; the label says what they are */}
                        <li>
                            {t('footer.data')}
                            <ExternalLink href="https://openweathermap.org/">OpenWeather</ExternalLink>
                            <ExternalLink href="https://open-meteo.com/">Open-Meteo</ExternalLink>
                        </li>
                        <li><ExternalLink href="https://github.com/Carlos-93/react-weather-map">{t('footer.code')}</ExternalLink></li>
                    </ul>
                </nav>
            </div>
        </footer>
    );
}