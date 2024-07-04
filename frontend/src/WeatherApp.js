import React, { useEffect } from 'react';
import styles from './Cal.module.css';
import weatherDescKo from './weatherDescKo';

const WeatherApp = () => {
  const API_KEY = 'cf443b26ed36c0ea076da879756c9ad9';

  useEffect(() => {
    const weatherSpan = document.getElementById('weather');
    const weatherIcon = document.getElementById('weatherIcon');

    if (!weatherSpan) {
      console.error('weatherSpan 요소를 찾을 수 없습니다.');
      return;
    }

    if (!weatherIcon) {
      console.error('weatherIcon 요소를 찾을 수 없습니다.');
      return;
    }

    function handleGeoSucc(position) {
      console.log(position);
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      const coordsObj = {
        latitude,
        longitude,
      };
      saveCoords(coordsObj);
      getWeather(latitude, longitude);
    }

    function handleGeoErr(err) {
      console.log("위치 정보 오류 발생! " + err);
    }

    function requestCoords() {
      navigator.geolocation.getCurrentPosition(handleGeoSucc, handleGeoErr);
    }

    function saveCoords(coordsObj) {
      localStorage.setItem('coords', JSON.stringify(coordsObj));
    }

    function getWeather(lat, lon) {
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&lang=KR&units=metric`)
        .then(res => {
          if (!res.ok) {
            throw new Error('네트워크 응답이 올바르지 않습니다.');
          }
          return res.json();
        })
        .then(data => {
          const temp = data.main.temp;
          const weathers = data.weather[data.weather.length - 1];
          const weatherDesc = weatherDescKo.find(desc => desc[weathers.id]);

          if (weatherDesc) {
            weatherSpan.innerHTML = `${temp}&#176;C 
                                    ${weatherDesc[weathers.id]}`;
          } else {
            weatherSpan.innerHTML = `${temp}&#176;C 날씨 정보를 찾을 수 없습니다.`;
          }

          weatherIcon.src = `https://openweathermap.org/img/wn/${weathers.icon}@2x.png`;
        })
        .catch(err => {
          console.error('날씨 정보를 가져오는 중 오류 발생!', err);
          weatherSpan.innerHTML = '날씨 정보를 가져올 수 없습니다.';
        });
    }

    requestCoords();
  }, []);

  return (
    <div className={styles.weatherdiv}>
      <div>오늘의 날씨</div>
      <span className={styles["weather"]} id="weather"></span>
      <br></br>
      <img className={styles["weatherIcon"]} id="weatherIcon" alt="Weather Icon" />
    </div>
  );
};

export default WeatherApp;
