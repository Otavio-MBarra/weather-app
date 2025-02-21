async function getForecast() {
  const apiUrl =
    "http://api.weatherapi.com/v1/forecast.json?key=b72d269fa0c14e4da57220332252002&q=cachoeiro%20de%20itapemirim&days=7&lang=pt";
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
    forecast.forEach((element) => {
      console.log(element);
      showCityForecast(element);
    });
  } catch (error) {
    console.log(error);
  }
}

function showCityForecast(elemento) {
  let { day } = elemento;
  console.log(day);
  const icon = document.querySelector(".main-weather-panel__img-climate");
  const MaxGraus = document.querySelector(".media-graus__maximum");

  icon.src = day.condition.icon;
  MaxGraus.innerText = `${Math.floor(day.maxtemp_c)}°`;
}

showForecast();
