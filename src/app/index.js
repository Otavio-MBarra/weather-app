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
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
  "Domingo",
];
function showCityForecast(elemento, index) {
  let test = new Date(elemento.date);
  const nameDate = diasDaSemana[test.getDay()];
  const nameDay = document.querySelectorAll(".day__day-name");
  nameDay[index].innerHTML = nameDate;

  let { maxtemp_c, avgtemp_c, mintemp_c, condition } = elemento.day;
  const iconsClimate = document.querySelectorAll(".icon-climate");
  iconsClimate[index].src = condition.icon;

  const maxTemp = document.querySelectorAll(".maxtemp");
  // maxTemp[index].innerHTML = maxtemp_c;
}

showForecast();
