// SearchBar Component
export default function SearchBar({ location, setLocation, searchLocation }) {
    return (
        <div className="search">
            <input
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                onKeyDown={searchLocation}
                placeholder="Enter a city..."
                type="text"
            />
        </div>
    );
}