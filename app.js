const cityInput = document.querySelector(".city-input");
const searcBtn = document.querySelector(".search-btn");
const notFoundSection = document.querySelector(".not-found");
const searchCitySection = document.querySelector(".search-city");
const weatherInfoSection = document.querySelector(".weather-info");

const countryTxt = document.querySelector(".country-txt");
const tempTxt = document.querySelector(".temp-txt");
const conditonTxt = document.querySelector(".conditon-txt");
const humidityVal = document.querySelector(".humidity-value-txt");
const windVal = document.querySelector(".wind-value-txt");
const weatherSummaryImg = document.querySelector(".weather-summary-img");
const currentDateTxt = document.querySelector(".current-date");

const ForecastItemContainer=document.querySelector(".forecast-item-container")

const apiKey = "a59e8480496100d0265463af8206166c";
searcBtn.addEventListener("click", (e) => {
  if (cityInput.value.trim() != "") {
    //The value must not be empty and must not have only spaces thatswhy used trim
    // console.log(cityInput.value);
    updateWeatherInfo(cityInput.value);
    cityInput.value = "";
  }
});

cityInput.addEventListener("keydown", (e) => {
  if (e.key == "Enter" && cityInput.value.trim() != "") {
    //Checking agr user ne enter button use kiya h istead of search button
    // console.log(cityInput.value);
    updateWeatherInfo(cityInput.value);
    cityInput.value = "";
  }
});

async function getFetchData(endPoint, city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`; //&units=metric making temp in celcius format
  const response = await fetch(apiUrl);
  return response.json();
}

async function updateWeatherInfo(city) {
  const weatherData = await getFetchData("weather", city);
  if (weatherData.cod != 200) {
    showDisplaySection(notFoundSection);
    return;
  }
  console.log(weatherData);

  const {
    name: country,
    main: { temp, humidity },
    weather: [{ id, main }],
    wind: { speed },
  } = weatherData;

  countryTxt.innerHTML = `${country}`;
  tempTxt.innerHTML = Math.round(temp) + "°C";
  conditonTxt.innerHTML = `${main}`;
  humidityVal.innerHTML = `${humidity}%`;
  windVal.innerHTML = `${speed}M/s`;

  weatherSummaryImg.src = `assets/assets/weather/${getWeatherImg(id)}`;
  currentDateTxt.innerHTML = getCurrentDate();

  await getForecast(city);

  showDisplaySection(weatherInfoSection);
}

function showDisplaySection(section) {
  [weatherInfoSection, notFoundSection, searchCitySection].forEach(
    (section) => (section.style.display = "none")
  );
  section.style.display = "block";
}

function getWeatherImg(id) {
  if (id <= 232) return "thunderstorm.svg";
  if (id <= 321) return "drizzle.svg";
  if (id <= 531) return "rain.svg";
  if (id <= 622) return "snow.svg";
  if (id <= 781) return "atmosphere.svg";
  if (id <= 800) return "clear.svg";
  else return "clouds.svg";
 
}

function getCurrentDate() {
  const currentDate = new Date();
  const options = {
    weekday: "short",
    day: "2-digit",
    month: "short",
  };

  console.log(currentDate);
  return currentDate.toLocaleDateString("en-IN", options);
}

async function getForecast(city) {
  const forecastData = await getFetchData("forecast", city);
  console.log(forecastData);

  const timetaken = "12:00:00";
  const todayDate = new Date().toISOString().split("T")[0];

  ForecastItemContainer.innerHTML=""

  forecastData.list.forEach((forecast) => {
    if (forecast.dt_txt.includes(timetaken) && !forecast.dt_txt.includes(todayDate)) {
      updateForecastItems(forecast)
      console.log(forecast);
      
    }
  });
}

function updateForecastItems(weatherData){
console.log(weatherData)
const {
  dt_txt:date,
  main:{temp},
  weather:[{id}]
}=weatherData

const dateTaken=new Date(date)
const dateOptions={
  day:"2-digit",
  month:"short",
}
const dateResult=dateTaken.toLocaleDateString("en-IN",dateOptions)
const forecastItem=`
            <div class="forecast-item">
                <h5 class="forecast-item-date">${dateResult}</h5>
                <img src="assets/assets/weather/${getWeatherImg(id)}" alt="" class="forecast-item-img">
                <h5 class="forecast-item-temp">${Math.round(temp)} °C</h5>
            </div>
`
// ForecastItemContainer.innerHTML=""
ForecastItemContainer.insertAdjacentHTML("beforeend",forecastItem)
}
