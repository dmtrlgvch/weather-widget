import React, { useState, useEffect } from 'react';
import Spinner from 'react-bootstrap/Spinner'
import WidgetTemplate from './WidgetTemplate';

const API_KEY = '0a4ca624b3b6caa5a76be2d1c36ef77d'


const images = importAll(require.context('./WidgetTemplate/images', false, /\.(png|jpe?g|svg)$/));

function importAll(r) {
  return r.keys().map(r);
}




export default function Widget(props) {
  const [weather, setWeather] = useState(null);
  
  const [dayName, setDayName] = useState(null)
  const [monthName, setMonthName] = useState(null)
  const [dayNumber, setDayNumber] = useState(null)
  const [sunrise, setSunrise] = useState(null)
  const [sunset, setSunset] = useState(null)
  const [widgetBackground, setwidgetBackground] = useState(null)


  useEffect(() => {
    getCityWeather(props.city.coord)
  }, []);

   

  async function getCityWeather(coord) {
    let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${coord.lat}&lon=${coord.lon}&exclude=minutely&appid=${API_KEY}&units=metric`
    const res = await fetch(url);
    const data = await res.json();

    setWeather(() => ({ ...{}, ...data }));
    getCorrectDate(data);

    images.map((image) => {
      if(image.includes(data.current.weather[0].main)) {
        setwidgetBackground(image);
      }
    })   

  }

  
  function getCorrectDate(city) {
    const date = new Date();
    let dateUTC = Date.now() + (date.getTimezoneOffset() * 60 * 1000);
    let correctDate = dateUTC + city.timezone_offset * 1000;

    let sunriseUTC = city.current.sunrise * 1000 + (date.getTimezoneOffset() * 60 * 1000);
    let sunsetUTC = city.current.sunset * 1000 + (date.getTimezoneOffset() * 60 * 1000);

    let sunriseTime = sunriseUTC + city.timezone_offset * 1000;
    let sunsetTime = sunsetUTC + city.timezone_offset * 1000;

    setDayName(correctDate);
    setMonthName(correctDate);
    setDayNumber(correctDate);
    setSunrise(sunriseTime);
    setSunset(sunsetTime);
  }


  return (
    <div className='widget' style={{backgroundImage: `url(${widgetBackground})`}}>      
      {weather ? <WidgetTemplate city={props.city} weather={weather} daynumber={dayNumber} dayname={dayName} monthname={monthName} sunrise={sunrise} sunset={sunset} /> : <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>}
    </div>
  );
}


