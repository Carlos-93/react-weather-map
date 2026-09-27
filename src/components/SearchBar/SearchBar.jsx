import { useEffect, useRef } from 'react';
import { ArrowRight, LoaderCircle, Search } from 'lucide-react';

export default function SearchBar({ value, onChange, onSubmit, isPending }) {
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
            <input
                ref={inputRef}
                className="search__input"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder="Busca una ciudad…"
                aria-label="Ciudad"
                type="search"
                enterKeyHint="search"
                autoComplete="off"
                spellCheck={false}
            />
            <kbd className="search__shortcut" aria-hidden="true">/</kbd>
            <button className="search__button" type="submit" disabled={isPending} aria-label="Buscar">
                {isPending ? <LoaderCircle className="spinner" aria-hidden="true" /> : <ArrowRight aria-hidden="true" />}
            </button>
            <span className="visually-hidden" role="status">{isPending ? 'Buscando el tiempo…' : ''}</span>
        </form>
    );
}
