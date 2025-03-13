async function getForecast() {
  const apiUrl =
    "https://api.weatherapi.com/v1/forecast.json?key=b72d269fa0c14e4da57220332252002&q=cachoeiro%20de%20itapemirim&days=7&lang=pt";
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    return data.forecast.forecastday;
  } catch (error) {
    console.log(error);
  }
}

async function showForecast() {
  try {
    const forecast = await getForecast();
    forecast.forEach((element, index) => {
      showTemperatureCelsius(element, index);
      showWeekdayName(element, index);
      showIconsWeather(element, index);
    });
  } catch (error) {
    console.log(error);
  }
}

let diasDaSemana = [
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
  "Domingo",
];
const nameDay = document.querySelectorAll(".day__day-name");
const maxTemp = document.querySelectorAll(".maxtemp");
const minTemp = document.querySelectorAll(".mintemp");
const iconsClimate = document.querySelectorAll(".icon-climate");
const currentTemp = document.querySelector(
  ".main-weather-panel__graus__currenty-grau"
);

function showTemperatureCelsius(element, index) {
  const { maxtemp_c, avgtemp_c, mintemp_c } = element.day;
  maxTemp[index].innerHTML = `${Math.floor(maxtemp_c)}°`;
  minTemp[index].innerHTML = `${Math.floor(mintemp_c)}°`;
  currentTemp.innerHTML = `${Math.floor(avgtemp_c)}<span>°c</span>`;
}

function showWeekdayName(element, index) {
  let date = new Date(element.date);
  const nameDate = diasDaSemana[date.getDay()];
  nameDay[index].innerHTML = nameDate;
}
function showIconsWeather(element, index) {
  const { condition } = element.day;
  iconsClimate[index].src = condition.icon;
}

showForecast();
