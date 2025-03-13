let weekday = [
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
  "Domingo",
];
const weekdayElements = document.querySelectorAll(".day__day-name");
const maxTemp = document.querySelectorAll(".maxtemp");
const minTemp = document.querySelectorAll(".mintemp");
const weatherIcons = document.querySelectorAll(".icon-climate");
const currentTemp = document.querySelector(
  ".main-weather-panel__graus__currenty-grau"
);
const infoStatisticUnit = document.querySelectorAll(
  ".more-info-statistic__number"
);

async function getForecast() {
  const apiUrl =
    "https://api.weatherapi.com/v1/forecast.json?key=b72d269fa0c14e4da57220332252002&q=cachoeiro%20de%20itapemirim&days=7&lang=pt&aqi=yes";
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log();

    return {
      forecast: data.forecast.forecastday,
      airQuality: data.current.air_quality,
    };
  } catch (error) {
    console.log(error);
  }
}

async function showForecast() {
  try {
    const data = await getForecast();
    data.forecast.forEach((element, index) => {
      updateTemperatureElements(element, index);
      updateWeekdayElements(element, index);
      updateWeatherIcons(element, index);
    });
    updateInfoDay(data.airQuality);
  } catch (error) {
    console.log(error);
  }
}

function updateInfoDay(airQuality) {
  console.log(airQuality);

  const unidades = ["pm2_5", "pm10", "so2", "no2", "o3"];
  unidades.forEach((unidade, index) => {
    infoStatisticUnit[index].innerHTML = airQuality[unidade].toFixed(1);
  });
}

function updateTemperatureElements(element, index) {
  const { maxtemp_c, avgtemp_c, mintemp_c } = element.day;
  maxTemp[index].innerHTML = `${Math.floor(maxtemp_c)}°`;
  minTemp[index].innerHTML = `${Math.floor(mintemp_c)}°`;
  currentTemp.innerHTML = `${Math.floor(avgtemp_c)}<span>°c</span>`;
}

function updateWeekdayElements(element, index) {
  let date = new Date(element.date);
  const nameDate = weekday[date.getDay()];
  weekdayElements[index].innerHTML = nameDate;
}
function updateWeatherIcons(element, index) {
  const { condition } = element.day;
  weatherIcons[index].src = condition.icon;
}

showForecast();
