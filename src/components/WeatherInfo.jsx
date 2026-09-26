// WeatherInfo Component
export default function WeatherInfo({ data }) {
    return (
        <div className="container">
            <div className="top">
                <div className="location">
                    <h2>{data.name}</h2>
                </div>

                <div className="temp">
                    <h1>{data.main.temp.toFixed()}°C</h1>
                </div>

                <div className="description">
                    <p>{data.weather[0].description}</p>
                </div>
            </div>

            <div className="bottom">
                <div className="feels">
                    <span className="bold">{data.main.feels_like.toFixed()}°C</span>
                    <span>Sensación térmica</span>
                </div>

                <div className="humidity">
                    <span className="bold">{data.main.humidity}%</span>
                    <span>Humedad</span>
                </div>

                <div className="wind">
                    <span className="bold">{(data.wind.speed * 3.6).toFixed()} km/h</span>
                    <span>Velocidad del viento</span>
                </div>
            </div>
        </div>
    );
}