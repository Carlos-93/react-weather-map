export default function SearchBar({ value, onChange, onSubmit }) {
    return (
        <form className="search" role="search" onSubmit={onSubmit}>
            <input
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder="Introduce una ciudad..."
                aria-label="Ciudad"
                type="search"
                enterKeyHint="search"
                autoComplete="off"
            />
        </form>
    );
}
