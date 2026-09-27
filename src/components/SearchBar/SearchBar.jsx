import { ArrowRight, LoaderCircle, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useEffect, useRef } from 'react';

import './SearchBar.css';

export default function SearchBar({ value, onChange, onSubmit, isPending }) {
    const { t } = useTranslation();
    const inputRef = useRef(null);

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

    return (
        <form className="search" role="search" onSubmit={onSubmit}>
            <Search className="search__icon" aria-hidden="true" />
            <input ref={inputRef} className="search__input" value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={t('search.placeholder')} aria-label={t('search.label')} type="search" enterKeyHint="search" autoComplete="off"
                spellCheck={false}
            />
            <kbd className="search__shortcut" aria-hidden="true">/</kbd>
            <button className="search__button" type="submit" disabled={isPending} aria-label={t('search.submit')}>
                {isPending ? <LoaderCircle className="spinner" aria-hidden="true" /> : <ArrowRight aria-hidden="true" />}
            </button>
            <span className="visually-hidden" role="status">{isPending ? t('search.searching') : ''}</span>
        </form>
    );
}