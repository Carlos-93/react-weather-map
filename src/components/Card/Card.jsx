import './Card.css';

// Glass panel with a soft glow that follows the pointer; `index` staggers its entrance
export default function Card({ icon: Icon, title, index = 0, className = '', children }) {
    function handlePointerMove(event) {
        const { left, top } = event.currentTarget.getBoundingClientRect();
        event.currentTarget.style.setProperty('--pointer-x', `${event.clientX - left}px`);
        event.currentTarget.style.setProperty('--pointer-y', `${event.clientY - top}px`);
    }

    return (
        <section className={`card ${className}`} style={{ '--index': index }} onPointerMove={handlePointerMove}>
            <h2 className="card__title">
                <Icon aria-hidden="true" />
                {title}
            </h2>
            {children}
        </section>
    );
}