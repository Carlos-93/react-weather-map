import { CloudSun } from 'lucide-react';

import LanguageSelector from '../LanguageSelector/LanguageSelector';
import SearchBar from '../SearchBar/SearchBar';
import './Header.css';

export default function Header({ query, onQueryChange, onSubmit, isPending }) {
    return (
        <header className="header">
            <a className="brand" href="/">
                <CloudSun className="brand__icon" aria-hidden="true" />
                <span className="brand__name">Tiempo y Radar</span>
            </a>
            <SearchBar value={query} onChange={onQueryChange} onSubmit={onSubmit} isPending={isPending} />
            <LanguageSelector />
        </header>
    );
}