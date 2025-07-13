// WeatherInfo Component
export default function WeatherInfo({ data }) {
    return (
        <div className="container">
            <div className="top">
                <div className="location">
                    <h2>{data.name}</h2>
                </div>

                <div className="temp">
                    {data.main ? <h1>{data.main.temp.toFixed()}°C</h1> : null}
                </div>
                
                <div className="description">
                    {data.weather ? <p>{data.weather[0].main}</p> : null}
                </div>
            </div>

            {data.name !== undefined && (
                <div className="bottom">
                    <div className="feels">
                        {data.main ? <span className="bold">{data.main.feels_like.toFixed()}°C</span> : null}
                        <span>Feels Like</span>
                    </div>
                
                    <div className="humidity">
                        {data.main ? <span className="bold">{data.main.humidity}%</span> : null}
                        <span>Humidity</span>
                    </div>
                
                    <div className="wind">
                        {data.wind ? <span className="bold">{data.wind.speed.toFixed()} Kms/h</span> : null}
                        <span>Wind Speed</span>
                    </div>
                </div>
            )}
        </div>
    );
}