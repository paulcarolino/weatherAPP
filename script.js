const locationInput = document.getElementById("locationInput");
const mainTemperature = document.querySelector(".mainTemperature>h1");
const minmaxTemperature = document.querySelector(".minmaxTemperature>h3");
const forecastContainer = document.querySelector(".futureForecast");
const windSpeed = document.querySelector("#windSpeed");
const weatherDescription = document.getElementById("weatherForcast");
const humidity = document.getElementById("humidity");
const mainWeatherIcon = document.getElementById("mainWeatherIcon");
const precipitation = document.getElementById("precipitation");

function convertData(data) {
  const {
    name: cityName,
    main: { temp: temperature, temp_min: tempMin, temp_max: tempMax, humidity },
    wind: { speed: windSpeed },
    weather: [{ icon: weatherIcon, description: weatherDescription }],
  } = data;
  return {
    cityName,
    temperature,
    tempMin,
    tempMax,
    humidity,
    windSpeed,
    weatherDescription,
    weatherIcon,
  };
}

function convertForecastData(data) {
  var newData = [];
  data.list = data.list.filter(
    (value, index, self) =>
      index ===
      self.findIndex(
        (t) =>
          t.dt_txt.substring(0, 10) === t.dt_txt.substring(0, 10) &&
          t.dt_txt.substring(0, 10) === value.dt_txt.substring(0, 10)
      )
  );
  data.list.forEach((element) => {
    let Day = element.dt_txt.substring(0, 10);
    Day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
      new Date(Day).getDay()
    ];
    let temp = element.main.temp;
    let precipitation = element.pop;
    let weatherIcon = element.weather[0].icon;
    let weatherDescription = element.weather[0].description;
    let newObj = {
      Day,
      precipitation,
      temp,
      weatherIcon,
      weatherDescription,
    };
    newData.push(newObj);
  });
  return newData;
}

async function getForecastWeather(locationValue) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${locationValue}&appid=7ba97aa4fedc541407a19cdf24624633&units=imperial`,
      { mode: "cors" }
    );

    const weather = convertForecastData(await response.json());
    console.log(weather);
    return weather;
  } catch (err) {
    console.log(err);
  }
}

async function getWeather(locationValue) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${locationValue}&appid=7ba97aa4fedc541407a19cdf24624633&units=imperial`,
      { mode: "cors" }
    );

    const weather = convertData(await response.json());

    return weather;
  } catch (err) {
    console.log("Oops Error on that City");
  }
}

function getForecastData(locationValue) {
  let forecastWeather = getForecastWeather(locationValue);
  forecastContainer.innerHTML = "";
  forecastWeather.then((data) => {
    for (let index = 0; index < 5; index++) {
      precipitation.textContent = data[0].precipitation * 100;
      var weatherForecastWeatherIcon = document.createElement("img");
      if (data[index].weatherIcon.substring(0, 2) == "01") {
        weatherForecastWeatherIcon.src = "Assets/Static/Sunny.svg";
      }
      if (
        data[index].weatherIcon.substring(0, 2) == "02" ||
        data[index].weatherIcon.substring(0, 2) == "03" ||
        data[index].weatherIcon.substring(0, 2) == "04"
      ) {
        weatherForecastWeatherIcon.src = "Assets/Static/Cloudy-1.svg";
      }
      if (
        data[index].weatherIcon.substring(0, 2) == "09" ||
        data[index].weatherIcon.substring(0, 2) == "10"
      ) {
        weatherForecastWeatherIcon.src = "Assets/Static/Rainy.svg";
      }
      if (data[index].weatherIcon.substring(0, 2) == "11") {
        weatherForecastWeatherIcon.src = "Assets/Static/Stormy.svg";
      }
      if (data[index].weatherIcon.substring(0, 2) == "13") {
        weatherForecastWeatherIcon.src = "Assets/Static/Snowy.svg";
      }

      let dayConatiner = document.createElement("div");
      let forecastDetails = `
                <div>
                    <h3>${data[index].temp}°</h3>
                </div>

                <div class="days">
                    ${data[index].Day}
                </div>
            `;
      dayConatiner.append(weatherForecastWeatherIcon);
      dayConatiner.innerHTML += forecastDetails;

      if (index != 0) {
        forecastContainer.append(dayConatiner);
      }
    }
  });
}
function getData(locationValue) {
  let currentWeather = getWeather(locationValue);

  currentWeather.then((data) => {
    mainTemperature.textContent = data.temperature;
    minmaxTemperature.innerHTML = `${data.tempMin}° / ${data.tempMax}°`;
    windSpeed.textContent = data.windSpeed;
    weatherDescription.textContent = `(${data.weatherDescription})`;
    humidity.textContent = data.humidity;
    if (data.weatherIcon.substring(0, 2) == "01") {
      mainWeatherIcon.src = "Assets/Animated/day.svg";
    }
    if (
      data.weatherIcon.substring(0, 2) == "02" ||
      data.weatherIcon.substring(0, 2) == "03" ||
      data.weatherIcon.substring(0, 2) == "04"
    ) {
      mainWeatherIcon.src = "Assets/Animated/cloudy.svg";
    }
    if (
      data.weatherIcon.substring(0, 2) == "09" ||
      data.weatherIcon.substring(0, 2) == "10"
    ) {
      mainWeatherIcon.src = "Assets/Animated/rainy-1.svg";
    }
    if (data.weatherIcon.substring(0, 2) == "11") {
      mainWeatherIcon.src = "Assets/Animated/thunder.svg";
    }
    if (data.weatherIcon.substring(0, 2) == "13") {
      mainWeatherIcon.src = "Assets/Animated/snowy-1.svg";
    }
  });
}

getData(locationInput.value);
getForecastData(locationInput.value);

locationInput.addEventListener("input", (e) => {
  locationInput.style.width = "0px";
  locationInput.style.width = locationInput.scrollWidth + "px";
  getData(e.target.value);

  getForecastData(e.target.value);
});
