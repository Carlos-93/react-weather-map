import { LoaderCircle, MapPin } from 'lucide-react';

import { SUGGESTED_CITIES } from '../constants';

// Component for displaying the welcome message, the current location button and suggested cities
export default function Welcome({ onSelect, onLocate, isPending, isLocating }) {
    return (
        <section className="welcome" aria-labelledby="welcome-title">
            <p className="welcome__eyebrow">El tiempo actual en todo el mundo</p>
            <h1 id="welcome-title" className="welcome__title">El tiempo de cualquier ciudad, al instante</h1>

            <p className="welcome__text">
                Temperatura, viento, humedad, presión, visibilidad y horas de sol: todo lo que está pasando ahora mismo, de un vistazo.
            </p>

            <div className="welcome__suggestions">
                <button className="chip chip--location" type="button" onClick={onLocate} disabled={isPending}>
                    {isLocating ? <LoaderCircle className="spinner" aria-hidden="true" /> : <MapPin aria-hidden="true" />}
                    {isLocating ? 'Buscando tu ubicación…' : 'Usar mi ubicación'}
                </button>
                <span className="visually-hidden" role="status">{isLocating ? 'Buscando tu ubicación…' : ''}</span>
                <p id="suggestions-label" className="welcome__label">O prueba con</p>
                <ul className="chips" aria-labelledby="suggestions-label">
                    {SUGGESTED_CITIES.map(({ label, query }, index) => (
                        <li key={query} style={{ '--index': index }}>
                            <button className="chip" type="button" onClick={() => onSelect(query)} disabled={isPending}>
                                {label}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <p className="welcome__tip">Pulsa <kbd>/</kbd> en cualquier parte de la página para ir al buscador</p>
        </section>
    );
}