import React, { useState, useEffect } from 'react';
import { Row, Col, Nav, Tab, Card } from 'react-bootstrap/';
import Slider from "react-slick";
import './index.css';

// const images = importAll(require.context('./images', false, /\.(png|jpe?g|svg)$/));
// console.log('images', images);

// function importAll(r) {
//   console.log('keys',r.keys());
//   console.log('keys->map',r.keys().map(r));
//   return r.keys().map(r);
// }
// images.map((image) => {
//   if(image.includes('snow')) {
//     console.log(image);
//   }
// })

const onlyTime = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: 'numeric',
});
const onlyDayNumber = new Intl.DateTimeFormat('en-US', {
  day: 'numeric'
});
const onlyLongDayName = new Intl.DateTimeFormat('en-US', {
  weekday: 'long'
});
const onlyShortDayName = new Intl.DateTimeFormat('en-US', {
  weekday: 'short'
});
const onlyMonthName = new Intl.DateTimeFormat('en-US', {
  month: 'long'
});


function Time(props) {
  const [time, setTime] = useState(null)

  useEffect(() => {
    let interval = null;

    if (props.offset) {
      getTime();
      interval = setInterval(getTime, 30*1000)
    }
    return () => clearInterval(interval)
  }, [props.offset]);

  function getTime() {
    const date = new Date();
    let dateUTC = Date.now() + (date.getTimezoneOffset() * 60 * 1000);
    let correctDate = dateUTC + props.offset * 1000;

    setTime(() => correctDate)
  }

  return (
    <>
      <time className='current-time'>{onlyTime.format(time)}</time>
    </>
  );
}



export default function WidgetTemplate(props) {
  const hourlyList = props.weather.hourly.filter((hour) => {
    let hours = new Date(hour.dt * 1000).getHours()
    return hours % 3 == 0
  })
  hourlyList.length = 7
  const hourlyCardList = hourlyList.map((hour, i) => {
    return <Col>< HourWeather key={`hour-${i}-${hour.dt}-${props.city.id}`} dt={hour.dt} temp={hour.temp} icon={hour.weather[0].icon} /></Col >
  })

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 7,
    slidesToScroll: 3,
    responsive: [
      {
        breakpoint: 1020,
        settings: {
          slidesToShow: 7,
          slidesToScroll: 3,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 3,
        }
      },
      {
        breakpoint: 540,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      }
    ]
  };

  return (
    <>
      <div className='widget-body'>
        <h2 className='city-name'>{props.city.name}</h2>
        <div className='date'>
          <p className='current-day-number'>{onlyDayNumber.format(props.daynumber)}</p>

          <div className='date-secondary-content'>
            <p className='current-month'>{onlyMonthName.format(props.monthname)}</p>
            <p className='current-day-name'>{onlyLongDayName.format(props.dayname)}</p>
            <Time offset={props.weather.timezone_offset} />
          </div>
        </div>

        <p className='temperature'>{Math.round(props.weather.current.temp)} &deg;C</p>
        <p className='weather-main'>{props.weather.current.weather[0].main}</p>
        <p className='weather-description'>{props.weather.current.weather[0].description}</p>

        <WeatherDetails weather={props.weather} sunrise={props.sunrise} sunset={props.sunset} />

      </div>

      <div className='widget-bottom'>
        <Tab.Container id="left-tabs-example" defaultActiveKey="first">
          <Row>
            <Col sm={2}>
              <Nav className="flex-column">
                <Nav.Item>
                  <Nav.Link eventKey="first">Hour</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="second">Day</Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col>
              <Tab.Content>
                <Tab.Pane eventKey="first">
                  <Slider {...settings}>

                    {hourlyCardList}

                  </Slider>
                </Tab.Pane>
                <Tab.Pane eventKey="second">
                  <Slider {...settings}>

                    {props.weather.daily.map((day, i) => {
                      return i ? <Col><DayWeather key={`day-${i}-${props.city.id}`} dt={day.dt} temp={day.temp.day} icon={day.weather[0].icon}/></Col> : null
                    })}

                  </Slider>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </div>
    </>
  )
}



function HourWeather(props) {
  return (
    <Card>
      <Card.Img variant="top" src={`http://openweathermap.org/img/wn/${props.icon}@2x.png`} alt='weather-icon' />
      <Card.Title>{onlyTime.format(props.dt * 1000)}</Card.Title>
      <Card.Text>{Math.round(props.temp)} &deg;C</Card.Text>
    </Card>
  )
}

function DayWeather(props) {
  return (
    <Card>
      <Card.Img variant="top" src={`http://openweathermap.org/img/wn/${props.icon}@2x.png`} alt='weather-icon' />
      <Card.Title>{onlyShortDayName.format(props.dt * 1000)}</Card.Title>
      <Card.Text>{Math.round(props.temp)} &deg;C</Card.Text>
    </Card>
  )
}

function Compass(props) {
  return (
    <>
      <div className='compass'>
        <div className='compass-cursor' style={{
          transform: `translateX(-50%) rotate(${props.wind}deg)`}}></div>
      </div>

    </>
  );
}

function WeatherDetails(props) {
  return (
    <>
      <div className='weather-details'>
        <Row>
          <Col sm={4}>
            <dl className='weather-characteristics'>
              <div className='characteristics-item'>
                <dt className='characteristics-label'>Feels Like:</dt>
                <dd className='characteristics-value'>{Math.round(props.weather.current.feels_like)} &deg;C</dd>
              </div>

              <div className='characteristics-item'>
                <dt className='characteristics-label'>Humidity:</dt>
                <dd className='characteristics-value'>{Math.round(props.weather.current.humidity)} %</dd>
              </div>

              <div className='characteristics-item'>
                <dt className='characteristics-label'>Sunrise:</dt>
                <dd className='characteristics-value'>{onlyTime.format(props.sunrise)}</dd>
              </div>

              <div className='characteristics-item'>
                <dt className='characteristics-label'>Wind Speed:</dt>
                <dd className='characteristics-value'>{props.weather.current.wind_speed} mps</dd>
              </div>
            </dl>
          </Col>

          <Col sm={4}>
            <dl className='weather-characteristics'>
              <div className='characteristics-item'>
                <dt className='characteristics-label'>Max:</dt>
                <dd className='characteristics-value'>{props.weather.daily[0].temp.max} &deg;C</dd>
                <dt className='characteristics-label'>Min:</dt>
                <dd className='characteristics-value'>{props.weather.daily[0].temp.min} &deg;C</dd>
              </div>

              <div className='characteristics-item'>
                <dt className='characteristics-label'>Pressure:</dt>
                <dd className='characteristics-value'>{props.weather.current.pressure} Pa</dd>
              </div>

              <div className='characteristics-item'>
                <dt className='characteristics-label'>Sunset:</dt>
                <dd className='characteristics-value'>{onlyTime.format(props.sunset)}</dd>
              </div>

              <div className='characteristics-item'>
                <dt className='characteristics-label'>Wind Degree:</dt>
                <dd className='characteristics-value'>{props.weather.current.wind_deg} &deg;</dd>
              </div>
            </dl>
          </Col>

          <Col>
            <Compass wind={props.weather.current.wind_deg} />
          </Col>
        </Row>
      </div>
    </>
  )
}