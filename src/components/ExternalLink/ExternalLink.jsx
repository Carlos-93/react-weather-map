import { ArrowUpRight } from 'lucide-react';

import './ExternalLink.css';

export default function ExternalLink({ href, className = '', children }) {
    return (
        <a className={`external-link ${className}`} href={href} target="_blank" rel="noreferrer">
            {children}
            <ArrowUpRight aria-hidden="true" />
            <span className="visually-hidden"> (se abre en una pestaña nueva)</span>
        </a>
    );
}