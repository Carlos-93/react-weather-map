import { useTranslation } from 'react-i18next';
import { ArrowUpRight } from 'lucide-react';

import './ExternalLink.css';

export default function ExternalLink({ href, className = '', children }) {
    const { t } = useTranslation();

    return (
        <a className={`external-link ${className}`} href={href} target="_blank" rel="noreferrer">
            {children}
            <ArrowUpRight aria-hidden="true" />
            <span className="visually-hidden"> {t('externalLink.newTab')}</span>
        </a>
    );
}