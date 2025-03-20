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
const timeSunreseSunsetText = document.querySelectorAll(".sunrise-time__time");
const typeInformationsValues = document.querySelectorAll(
  ".type-information__value"
);
const cityName = document.querySelector(".main-weather-panel__city-name");

const inputNameCity = document.getElementById("search-name-city");
const listCity = document.querySelector(".list-city");

inputNameCity.addEventListener("input", async () => {
  const query = inputNameCity.value.trim();
  console.log(query);
  if (query.length < 3) {
    listCity.innerHTML = "";
    return;
  }
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/search.json?key=b72d269fa0c14e4da57220332252002&q=${query}`
    );

    const data = await response.json();
    listCity.innerHTML = "";

    data.forEach((city) => {
      console.log(city);

      const item = document.createElement("li");
      item.textContent = `${city.name}, ${city.country}`;
      item.addEventListener("click", () => {
        inputNameCity.value = city.name;
        listCity.innerHTML = "";
        showForecast(city.lat, city.lon);
      });

      listCity.appendChild(item);
    });
  } catch (error) {}
});

showForecast();

async function getForecast(latitude, longitude) {
  const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=b72d269fa0c14e4da57220332252002&q=${latitude},${longitude}&days=7&lang=pt&aqi=yes`;
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    return {
      forecast: data.forecast.forecastday,
      airQuality: data.current.air_quality,
      location: data.location,
    };
  } catch (error) {
    console.log(error);
  }
}

async function showForecast(latitude, longitude) {
  try {
    if (!latitude || !longitude) {
      const coords = await getLocalization();
      latitude = coords.latitude;
      longitude = coords.longitude;
    }

    const data = await getForecast(latitude, longitude);
    data.forecast.forEach((element, index) => {
      updateTemperatureElements(element, index);
      updateWeekdayElements(element, index);
      updateWeatherIcons(element, index);
    });
    weatherInformationDay(data.forecast[0].day);
    updateAirQuality(data.airQuality);
    updateSunriseSunset(data.forecast[0].astro);
    switchCityName(data.location);
  } catch (error) {
    console.log(error);
  }
}

function switchCityName(location) {
  cityName.innerText = location.name;
}

function weatherInformationDay(day) {
  const { avgvis_km, avghumidity, daily_chance_of_rain } = day;
  typeInformationsValues[0].innerText = avgvis_km;
  typeInformationsValues[1].innerText = avghumidity;
  typeInformationsValues[2].innerText = daily_chance_of_rain;
}

function updateSunriseSunset(astro) {
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

function getLocalization() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition((position) => {
      resolve({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      }),
        (error) => reject(error);
    });
  });
}
