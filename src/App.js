import { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { MdDarkMode } from "react-icons/md";
import { CiLight } from "react-icons/ci";
import ColorRing from "react-spinner-loader";
import "./App.css";

const clear_icon =
  "https://res.cloudinary.com/dijwul6ub/image/upload/v1718381152/clear_jspqha.png";
const cloudy_icon =
  "https://res.cloudinary.com/dijwul6ub/image/upload/v1718381161/cloud_kvtjzy.png";
const drizzle_icon =
  "https://res.cloudinary.com/dijwul6ub/image/upload/v1718381168/drizzle_stdbeh.png";
const rainy_icon =
  "https://res.cloudinary.com/dijwul6ub/image/upload/v1718381182/rain_sckcyw.png";
const snow_icon =
  "https://res.cloudinary.com/dijwul6ub/image/upload/v1718381196/snow_nipj2q.png";

const App = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState("light");
  const apiKey = "2a738552e41ecbed90549bf95559d521";

  const allIcons = {
    "01d": clear_icon,
    "01n": clear_icon,
    "02d": cloudy_icon,
    "02n": cloudy_icon,
    "03d": cloudy_icon,
    "03n": cloudy_icon,
    "04d": drizzle_icon,
    "04n": drizzle_icon,
    "09d": rainy_icon,
    "09n": rainy_icon,
    "10d": rainy_icon,
    "10n": rainy_icon,
    "13d": snow_icon,
    "13n": snow_icon,
  };

  const fetchDataFromApi = async (city) => {
    if (city.trim() === "") {
      setError("Please Enter city name");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=${apiKey}`
      );
      if (!response.ok) {
        throw new Error("Network response not Ok");
      }

      const data = await response.json();

      const icon = allIcons[data.weather[0].icon] || clear_icon;
      const newWeatherData = {
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        location: data.name,
        icon: icon,
      };

      setWeatherData((prevWeatherData) => [...prevWeatherData, newWeatherData]);
      setError("");
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleInputChange = (event) => {
    setCity(event.target.value);
  };

  const onClickEnter = (event) => {
    if (event.key === "Enter") {
      fetchDataFromApi(city);
      setCity("")
    }
  };

  const onclickSearchIcon = () => {
    fetchDataFromApi(city);
    setCity("")
  };

  const onToggleTheme = () => {
    setTheme((prevState) => (prevState === "light" ? "dark" : "light"));
  };

  const renderWeatherData = () => {
    return weatherData.map((data, index) => (
      <div className="weather-info" key={index}>
        <img src={data.icon} alt="" />
        <p className="temp">{data.temperature}°C</p>
        <p className="location">{data.location}</p>
        <div className="weather-data">
          <div className="col">
            <img
              src="https://res.cloudinary.com/dijwul6ub/image/upload/v1718381175/humidity_upioab.png"
              alt=""
            />
            <div>
              <p>{data.humidity}</p>
              <span>Humidity</span>
            </div>
          </div>
          <div className="col">
            <img
              src="https://res.cloudinary.com/dijwul6ub/image/upload/v1718381201/wind_ycmnms.png"
              alt=""
            />
            <div>
              <p>{data.windSpeed}</p>
              <span>Wind Speed</span>
            </div>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className={`App ${theme}`}>
      <nav className="nav-section">
        <h1>WEATHER REPORT</h1>
        <button className="theme-toggle" onClick={onToggleTheme}>
          {theme === "light" ? <MdDarkMode /> : <CiLight />}
        </button>
      </nav>
      <div className="input-section">
        <input
          type="text"
          placeholder="Search city name"
          value={city}
          onChange={handleInputChange}
          onKeyDown={onClickEnter}
        />
        <CiSearch className="search-icon" onClick={onclickSearchIcon} />
      </div>
      {error && <p className="error">{error}</p>}
      {loading && (
        <div className="loader">
          <ColorRing
            visible={true}
            height="80"
            width="80"
            ariaLabel="color-ring-loading"
            wrapperStyle={{}}
            wrapperClass="color-ring-wrapper"
            colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
          />
        </div>
      )}

      <div className="weather-cards">{renderWeatherData()}</div>
    </div>
  );
};

export default App;
