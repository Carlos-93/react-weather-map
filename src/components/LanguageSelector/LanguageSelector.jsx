import { useEffect, useId, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LANGUAGES } from '../../constants';

import './LanguageSelector.css';

// Flag button that opens the list of languages, ported from the portfolio's selector
export default function LanguageSelector() {
    const { t, i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const rootRef = useRef(null);
    const triggerRef = useRef(null);
    const menuId = useId();
    const current = LANGUAGES.find(({ code }) => code === i18n.resolvedLanguage) ?? LANGUAGES[0];

    // Closes with a click outside or with Escape, which also gives the focus back to the button
    useEffect(() => {
        if (!isOpen) return;

        function handlePointerDown(event) {
            if (!rootRef.current.contains(event.target)) setIsOpen(false);
        }

        function handleKeyDown(event) {
            if (event.key !== 'Escape') return;
            setIsOpen(false);
            triggerRef.current.focus();
        }

        document.addEventListener('pointerdown', handlePointerDown);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('pointerdown', handlePointerDown);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    function chooseLanguage(code) {
        i18n.changeLanguage(code);
        setIsOpen(false);
        triggerRef.current.focus();
    }

    return (
        <div className="language" ref={rootRef}>
            <button ref={triggerRef} className="language__trigger" type="button"
                aria-label={`${t('language.select')}: ${current.name}`} aria-expanded={isOpen} aria-controls={menuId}
                onClick={() => setIsOpen(!isOpen)}
            >
                <img className="language__flag" src={current.flag} alt="" />
                <span className="language__code" aria-hidden="true">{current.code.toUpperCase()}</span>
                <ChevronDown className="language__chevron" aria-hidden="true" />
            </button>

            <ul id={menuId} className="language__menu" hidden={!isOpen}>
                {LANGUAGES.map(({ code, name, flag }) => (
                    <li key={code}>
                        {/* lang makes screen readers say each name in its own language */}
                        <button className="language__option" type="button" lang={code}
                            aria-current={code === current.code} onClick={() => chooseLanguage(code)}
                        >
                            <img className="language__flag" src={flag} alt="" />
                            {name}
                            {code === current.code && <Check className="language__check" aria-hidden="true" />}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
