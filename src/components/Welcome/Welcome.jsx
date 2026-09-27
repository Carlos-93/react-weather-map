import { Trans, useTranslation } from 'react-i18next';
import { LoaderCircle, MapPin } from 'lucide-react';
import { SUGGESTED_CITIES } from '../../constants';

import './Welcome.css';

// Component for displaying the welcome message, the current location button and suggested cities
export default function Welcome({ onSelect, onLocate, isPending, isLocating }) {
    const { t } = useTranslation();

    return (
        <section className="welcome" aria-labelledby="welcome-title">
            <p className="welcome__eyebrow">{t('welcome.eyebrow')}</p>
            <h1 id="welcome-title" className="welcome__title">{t('welcome.title')}</h1>

            <p className="welcome__text">
                {t('welcome.text')}
            </p>

            <div className="welcome__suggestions">
                <button className="chip chip--location" type="button" onClick={onLocate} disabled={isPending}>
                    {isLocating ? <LoaderCircle className="spinner" aria-hidden="true" /> : <MapPin aria-hidden="true" />}
                    {isLocating ? t('welcome.locating') : t('welcome.useLocation')}
                </button>

                <span className="visually-hidden" role="status">{isLocating ? t('welcome.locating') : ''}</span>
                <p id="suggestions-label" className="welcome__label">{t('welcome.suggestions')}</p>
                <ul className="chips" aria-labelledby="suggestions-label">
                    {SUGGESTED_CITIES.map(({ key, query }, index) => (
                        <li key={query} style={{ '--index': index }}>
                            <button className="chip" type="button" onClick={() => onSelect(query)} disabled={isPending}>
                                {t(`cities.${key}`)}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <p className="welcome__tip"><Trans i18nKey="welcome.tip" components={{ kbd: <kbd /> }} /></p>
        </section>
    );
}