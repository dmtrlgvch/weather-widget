import React, { useState, useEffect } from 'react';


import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Header from './components/Header';
import ModalAddCity from './components/ModalAddCity';

import WidgetList from './components/WidgetList';

if (!localStorage.cityList) {
  localStorage.cityList = JSON.stringify([])
}
const API_KEY = '0a4ca624b3b6caa5a76be2d1c36ef77d'



function App() {
  const [show, setShow] = useState(false);
  const [cityList, setCityList] = useState(JSON.parse(localStorage.cityList));
  
  
  useEffect(() => {
    localStorage.cityList = JSON.stringify(cityList)
  }, [cityList])


  function changeModal(bool) {
    setShow(bool)
  }

  function deleteCity(e) {
    setCityList((list)=>{
      list.splice(e-1,1)
      return [...list]
    })
  }

  async function getCity(query) {
    let url = '';
    if (typeof query == 'string') {
      url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${API_KEY}`
    } else {
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${query.latitude}&lon=${query.longitude}&appid=${API_KEY}`
    }
    const res = await fetch(url);
    if (!res.ok) {
      alert('City not found!')
      return;
    }
    const data = await res.json();
    
    let city = {
      coord: {
        lat: data.coord.lat,
        lon: data.coord.lon
      },
      name: data.name,
      country: data.sys.country,
      id: data.id
    };
    setCityList(list => {
      if (city && !list.some(el => el.id === city.id)) {
        return [...list, city]
      } else{
        return list;
      }
    })


  }

  return (
    <>
      <Header changeModal={changeModal} deleteCity={deleteCity} cityList={cityList}/>
      <ModalAddCity show={show} changeModal={changeModal} getCity={getCity} />
      <WidgetList cityList={cityList}/>
    </>
  );
}

export default App;



