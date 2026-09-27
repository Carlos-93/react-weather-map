import { useTranslation } from 'react-i18next';
import { CloudSun } from 'lucide-react';

import ExternalLink from '../ExternalLink/ExternalLink';
import './Footer.css';

const YEAR = new Date().getFullYear();

export default function Footer() {
    const { t } = useTranslation();

    return (
        <footer className="footer">
            <div className="footer__brand">
                <p className="footer__name"><CloudSun aria-hidden="true" />Tiempo y Radar</p>
                <p>{t('footer.tagline')}</p>
            </div>

            <nav aria-label={t('footer.nav')}>
                <ul className="footer__links">
                    <li><ExternalLink href="https://openweathermap.org/">{t('footer.data')}</ExternalLink></li>
                    <li><ExternalLink href="https://github.com/Carlos-93/react-weather-map">{t('footer.code')}</ExternalLink></li>
                    <li><ExternalLink href="https://www.carlos-ag.com/">{t('footer.portfolio')}</ExternalLink></li>
                </ul>
            </nav>
            <p className="footer__copy">© {YEAR} Carlos Araujo Galván</p>
        </footer>
    );
}