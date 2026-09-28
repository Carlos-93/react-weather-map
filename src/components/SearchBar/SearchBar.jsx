import { ArrowRight, LoaderCircle, MapPin, Search } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { formatCountry } from '../../utils/format';
import { useTranslation } from 'react-i18next';

import './SearchBar.css';

// Component for the search bar with suggestions
export default function SearchBar({ value, onChange, onSubmit, onSelect, isPending }) {
    const { t, i18n } = useTranslation();
    const language = i18n.resolvedLanguage;
    const inputRef = useRef(null);
    const listId = useId();
    const [suggestions, setSuggestions] = useState([]);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [isOpen, setIsOpen] = useState(false);
    const query = value.trim();
    const showList = isOpen && query.length >= 2 && suggestions.length > 0;

    // "/" focuses the search from anywhere on the page, a common shortcut on search-first sites
    useEffect(() => {
        function handleKeyDown(event) {
            if (event.key !== '/' || event.target.closest?.('input, textarea, [contenteditable]')) return;
            event.preventDefault();
            inputRef.current.focus();
        }

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Asks for suggestions 250 ms after the last key; a newer query cancels the pending request
    useEffect(() => {
        if (query.length < 2) return;

        const controller = new AbortController();
        const timer = setTimeout(async () => {
            try {
                const response = await fetch(`/api/cities?${new URLSearchParams({ q: query, lang: language })}`, { signal: controller.signal });
                if (!response.ok) return;
                setSuggestions(await response.json());
                setActiveIndex(-1);
            } catch {
                // Cancelled by a newer query or offline: the previous suggestions stay
            }
        }, 250);

        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [query, language]);

    function choose(city) {
        setIsOpen(false);
        onSelect(city.id);
    }

    function handleKeyDown(event) {
        // Enter also confirms a word being composed with an IME; that must not pick a suggestion
        if (event.nativeEvent.isComposing) return;

        if ((event.key === 'ArrowDown' || event.key === 'ArrowUp') && query.length >= 2 && suggestions.length) {
            event.preventDefault();
            setIsOpen(true);
            const last = suggestions.length - 1;
            if (event.key === 'ArrowDown') setActiveIndex((index) => (index < last ? index + 1 : 0));
            else setActiveIndex((index) => (index > 0 ? index - 1 : last));
        } else if (event.key === 'Enter' && showList && activeIndex >= 0) {
            event.preventDefault();
            choose(suggestions[activeIndex]);
        } else if (event.key === 'Escape' && showList) {
            // Closes the list without the search input's default of clearing the text
            event.preventDefault();
            setIsOpen(false);
        }
    }

    function handleSubmit(event) {
        setIsOpen(false);
        onSubmit(event);
    }

    const optionId = (index) => `${listId}-${index}`;
    let status = '';
    if (isPending) status = t('search.searching');
    else if (showList) status = t('search.results', { count: suggestions.length });

    return (
        <form className="search" role="search" onSubmit={handleSubmit}>
            <Search className="search__icon" aria-hidden="true" />
            <input ref={inputRef} className="search__input" value={value}
                onChange={(event) => {
                    onChange(event.target.value);
                    setIsOpen(true);
                }}
                onKeyDown={handleKeyDown} onFocus={() => setIsOpen(true)} onBlur={() => setIsOpen(false)}
                placeholder={t('search.placeholder')} aria-label={t('search.label')} type="search" enterKeyHint="search" autoComplete="off"
                spellCheck={false} role="combobox" aria-autocomplete="list" aria-expanded={showList} aria-controls={listId}
                aria-activedescendant={showList && activeIndex >= 0 ? optionId(activeIndex) : undefined}
            />
            <kbd className="search__shortcut" aria-hidden="true">/</kbd>
            <button className="search__button" type="submit" disabled={isPending} aria-label={t('search.submit')}>
                {isPending ? <LoaderCircle className="spinner" aria-hidden="true" /> : <ArrowRight aria-hidden="true" />}
            </button>

            {/* Pressing on the list would blur the input and close it before the click lands, so that press is cancelled */}
            <ul id={listId} className="search__suggestions" role="listbox" aria-label={t('search.suggestions')} hidden={!showList}
                onPointerDown={(event) => event.preventDefault()}
            >
                {suggestions.map((city, index) => (
                    <li key={city.id} id={optionId(index)} className="search__suggestion" role="option"
                        aria-selected={index === activeIndex} onClick={() => choose(city)} onPointerMove={() => setActiveIndex(index)}
                    >
                        <MapPin aria-hidden="true" />
                        <span className="search__suggestion-name">{city.name}</span>
                        <span className="search__suggestion-place">
                            {[city.state, formatCountry(city.country, language)].filter(Boolean).join(', ')}
                        </span>
                    </li>
                ))}
            </ul>
            <span className="visually-hidden" role="status">{status}</span>
        </form>
    );
}