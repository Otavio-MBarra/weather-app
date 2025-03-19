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
const defraIndexText = document.querySelector(
  ".quality-statistic__defra-index"
);
const statusQualityText = document.querySelector(".quality-statistic__text");

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

    updateAirQuality(data.airQuality);

    updateSunriseSuset(data.forecast[0].astro);
  } catch (error) {
    console.log(error);
  }
}
const timeSunreseSunsetText = document.querySelectorAll(".sunrise-time__time");

function updateSunriseSuset(astro) {
  console.log(astro);
  const { sunrise, sunset } = astro;
  timeSunreseSunsetText[0].innerText = convertHours(sunrise);
  timeSunreseSunsetText[1].innerText = convertHours(sunset);
}

function convertHours(hours) {
  const [time, minutes, period] = hours.match(/(\d+):(\d+)(\w+)/).slice(1);
  let hours24 = parseInt(time, 10);
  if (period.toLowerCase() === "pm" && hours24 !== 12) {
    hours24 += 12;
  }
  if (period.toLowerCase() === "am" && hours24 === 12) {
    hours24 = 0;
  }

  return `${String(hours24).padStart(2, "0")}:${minutes}`;
}

function updateAirQuality(airQuality) {
  updateInfoDay(airQuality);
  defraIndexText.innerText = airQuality["gb-defra-index"];
  const statusText = {
    1: { text: "Boa", class: "status-good" },
    2: { text: "Moderado", class: "status-moderate" },
    3: { text: "Ruim para grupos sensíveis", class: "status-sensitive" },
    4: { text: "Ruim", class: "status-bad" },
    5: { text: "Prejudicial à saúde", class: "status-harmful" },
    6: { text: "Perigoso", class: "status-dangerous" },
  };
  const { text, class: statusClass } = statusText[
    airQuality["gb-defra-index"]
  ] || {
    text: "Sem dados",
    class: "status-unknown",
  };
  const removeClass = [
    "status-good",
    "status-moderate",
    "status-sensitive",
    "status-unhealthy",
    "status-hazardous",
    "status-unknown",
  ];
  statusQualityText.innerText = text;
  statusQualityText.classList.remove(...removeClass);
  statusQualityText.classList.add(statusClass);
}

function updateInfoDay(airQuality) {
  const unidades = ["pm2_5", "pm10", "so2", "no2", "o3", "co"];
  unidades.forEach((unidade, index) => {
    infoStatisticUnit[index].innerText = airQuality[unidade].toFixed(1);
  });
}
function updateTemperatureElements(element, index) {
  const { maxtemp_c, avgtemp_c, mintemp_c } = element.day;
  maxTemp[index].innerText = `${Math.floor(maxtemp_c)}°`;
  minTemp[index].innerText = `${Math.floor(mintemp_c)}°`;
  currentTemp.innerHTML = `${Math.floor(avgtemp_c)}<span>°c</span>`;
}

function updateWeekdayElements(element, index) {
  let date = new Date(element.date);
  const nameDate = weekday[date.getDay()];
  weekdayElements[index].innerText = nameDate;
}
function updateWeatherIcons(element, index) {
  const { condition } = element.day;
  weatherIcons[index].src = condition.icon;
}

showForecast();
