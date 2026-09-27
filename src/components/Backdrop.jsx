// Irrational steps spread particles evenly without calling Math.random during render
const sequence = (index, step) => (index * step) % 1;

const DROPS = Array.from({ length: 130 }, (_, index) => ({
    '--x': `${sequence(index, 0.618034) * 130 - 10}%`,
    '--delay': `${-sequence(index, 0.414214) * 1.2}s`,
    '--duration': `${0.45 + sequence(index, 0.732051) * 0.4}s`,
    '--length': `${3 + sequence(index, 0.236068) * 5}rem`,
}));

const FLAKES = Array.from({ length: 100 }, (_, index) => ({
    '--x': `${sequence(index, 0.618034) * 100}%`,
    '--delay': `${-sequence(index, 0.414214) * 14}s`,
    '--duration': `${7 + sequence(index, 0.732051) * 7}s`,
    '--size': `${0.3 + sequence(index, 0.236068) * 0.6}rem`,
    '--sway': `${3 + sequence(index, 0.302776) * 6}vw`,
}));

const STARS = Array.from({ length: 70 }, (_, index) => ({
    '--x': `${sequence(index, 0.618034) * 100}%`,
    '--y': `${sequence(index, 0.414214) * 70}%`,
    '--delay': `${-sequence(index, 0.732051) * 6}s`,
    '--size': `${1 + sequence(index, 0.236068) * 2}px`,
}));

function Particles({ kind, items }) {
    return items.map((style, index) => <span key={index} className={`particle particle--${kind}`} style={style} />);
}

// Full-screen photo of the current weather plus light, ambient effects on top
export default function Backdrop({ weather, code, period }) {
    const isClear = weather === 'clear';
    // The clear photo already shows the sun; clouds short of overcast (codes 801-803) get a glow to let it through
    const isSunny = period === 'day' && weather === 'clouds' && code < 804;
    const isRainy = weather === 'rain' || weather === 'thunderstorm';
    const isMisty = weather === 'clouds' || weather === 'fog' || weather === 'haze';

    return (
        <div className="backdrop" aria-hidden="true">
            <div className="backdrop__image" />
            <div className="backdrop__shade" />
            {isSunny && <div className="backdrop__glow" />}
            {isClear && period === 'night' && <Particles kind="star" items={STARS} />}
            {isMisty && <div className="backdrop__mist" />}
            {isRainy && <Particles kind="drop" items={DROPS} />}
            {weather === 'snow' && <Particles kind="flake" items={FLAKES} />}
            {weather === 'thunderstorm' && <div className="backdrop__lightning" />}
        </div>
    );
}
