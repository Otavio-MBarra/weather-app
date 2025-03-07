async function getForecast() {
  const apiUrl =
    "https://api.weatherapi.com/v1/forecast.json?key=b72d269fa0c14e4da57220332252002&q=cachoeiro%20de%20itapemirim&days=7&lang=pt";
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log(data.forecast);

    return data.forecast.forecastday;
  } catch (error) {
    console.log(error);
  }
}

async function showForecast() {
  try {
    const forecast = await getForecast();
    // console.log(forecast);

    forecast.forEach((element, index) => {
      // console.log(element.day.condition);
      showCityForecast(element, index);
    });
  } catch (error) {
    console.log(error);
  }
}

let diasDaSemana = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];
function showCityForecast(elemento, index) {
  let test = new Date(elemento.date_epoch);
  const nameDate = diasDaSemana[test.getDay()];
  console.log(nameDate);

  let { maxtemp_c, avgtemp_c, mintemp_c, condition } = elemento.day;
  const iconsClimate = document.querySelectorAll(".icon-climate");
  iconsClimate[index].src = condition.icon;
}

showForecast();
