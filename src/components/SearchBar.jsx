// SearchBar Component
export default function SearchBar({ location, setLocation, searchLocation }) {
    return (
        <form className="search" role="search" onSubmit={searchLocation}>
            <input
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="Introduce una ciudad..."
                aria-label="Ciudad"
                type="search"
                enterKeyHint="search"
                autoComplete="off"
            />
        </form>
    );
}