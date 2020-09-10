import React from 'react';
import Widget from './Widget';
import { Container } from 'react-bootstrap';
import Slider from "react-slick";
import './index.css';


function WidgetList(props) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };
  return (
    <section className='section-main'>
      <Container>
        <Slider {...settings}>
          {props.cityList.map(city => {
            return <Widget key={city.id.toString()} city={city} /> 
          })}
        </Slider>
      </Container>
    </section>
  )
}

export default WidgetList;
