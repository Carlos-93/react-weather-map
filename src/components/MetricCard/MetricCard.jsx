import Card from './Card';

// Card with one headline value, an optional 0-1 level bar and a short description
export default function MetricCard({ value, unit, level, hint, children, ...cardProps }) {
    return (
        <Card {...cardProps}>
            <p className="metric">
                <span className="metric__value">{value}</span>
                <span className="metric__unit">{unit}</span>
            </p>
            {level !== undefined && (
                <div className="meter" aria-hidden="true">
                    <div className="meter__fill" style={{ '--level': Math.min(level, 1) }} />
                </div>
            )}
            <p className="card__hint">{hint}</p>
            {children}
        </Card>
    );
}
