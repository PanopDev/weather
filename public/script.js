//dom control

const elBody = document.querySelector('body');
const elWeatherContainer = document.querySelector('.weatherContainer');
const elLocation = elWeatherContainer.querySelector('h3');
const elCurrentCondition = elWeatherContainer.querySelector('h1');
const elSearchBar = document.getElementById('search');
const elSearchForm = document.querySelector('#searchForm');
const button = document.querySelector('.button');
const elConditionStatsUl = elWeatherContainer.querySelector('ul');
const elWeatherIcon = document.querySelector('#conditionIcon');
const elLocationHeader = document.querySelectorAll('.noData');
let userLocation = '';

browserLocation();
elLocationHeader[1].style.display = 'none';

elSearchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (e.target[0].value != '') {
    currentWeather.search = e.target[0].value;
    e.target[0].value = '';
  }
});

const createLiAndAppend = (elem, text) => {
  const newLi = document.createElement('li');
  newLi.className = 'liStats';
  newLi.innerText = text;
  elem.append(newLi);
};

const currentWeather = {
  set search(location) {
    this.location = location;
    weatherData();
  },
  location: localStorage.getItem('coord') || 'Boston',
  name: (data) => {
    elLocation.innerText = `${data?.location?.name}, ${data?.location?.region}`;
  },
  temp_f: (data) => {
    createLiAndAppend(
      elConditionStatsUl,
      `Current Temp: ${Math.round(data[x])} degrees F`
    );
  },
  condition: (data) => {
    elCurrentCondition.innerText = `${Math.round(data?.current?.temp_f)}F ${
      data?.current?.condition?.text
    }`;
    elWeatherIcon.src = `${data?.current?.condition?.icon}`;
  },
  wind_mph: (data) => {
    createLiAndAppend(elConditionStatsUl, `Wind speed: ${data[x]}Mph`);
  },
  gust_mph: (data) => {
    createLiAndAppend(elConditionStatsUl, `Wind gusts up to: ${data[x]}Mph`);
  },
  humidity: (data) => {
    createLiAndAppend(elConditionStatsUl, `Humidity: ${data[x]}`);
  },
  feelslike_f: (data) => {
    createLiAndAppend(elConditionStatsUl, `Feels like: ${Math.round(data[x])}`);
  },
  uv: (data) => {
    createLiAndAppend(elConditionStatsUl, `UV index: ${data[x]}`);
  },
};

const futureWeather = {
  date: 'date',
  condition: 'condition',
  maxTemp: 'temp',
  minTemp: 'temp',
};

function dailyForecast(data) {
  const forecastDay = data?.forecast?.forecastday;
  if (forecastDay) {
    forecastDay.forEach((obj) => {
      let date = new Date(obj.date.split('-')).toString().slice(0, 3);
      let image = obj.day.condition.icon;
      let tempLo = obj.day.mintemp_f;
      let tempHi = obj.day.maxtemp_f;

      const mainContainer = document.querySelector('.forecast');
      // const mainContainer = document.querySelector('.allHourly')

      const itemContainer = document.createElement('div');
      itemContainer.className = 'forecastDay';
      mainContainer.append(itemContainer);

      const day = document.createElement('p');
      day.className = 'forecastDay';
      day.innerText = date; //hour
      itemContainer.append(day);

      const conditionImg = document.createElement('img');
      conditionImg.src = image;
      conditionImg.className = 'forecastIcon';
      itemContainer.append(conditionImg);

      const temps = document.createElement('p');
      temps.className = 'forecastDay';
      temps.innerText = `${Math.round(tempHi)}F/${Math.round(tempLo)}F`;
      itemContainer.append(temps);
    });
  }
}
// militaryToStandardTime('2022-10-15 00:02')

function militaryToStandardTime(time) {
  let militaryTime = time.split(' ')[1];
  let hours = Number(militaryTime.split(':')[0]);
  let minutes = militaryTime.split(':')[1];
  let standardTime;

  hours > 12
    ? (standardTime = `${hours - 12} pm`)
    : (standardTime = `${hours} am`);

  if (hours === 0) {
    standardTime = `12 am`;
  } else if (hours === 12) {
    standardTime = `12 pm`;
  }

  return standardTime;
}

function hourlyForecast(data) {
  let todaysHourData = data?.forecast?.forecastday[0]?.hour;

  if (todaysHourData) {
    todaysHourData.forEach((obj) => {
      let hour = militaryToStandardTime(obj.time);
      // const currentDate = new Date().toString()
      // const currentHour = currentDate.match(/[0-24]{2}(?=:)/)
      // const dataHour = hour.match(/[0-24]{2}/)
      // console.log('current hour',currentHour[0])
      // console.log('datas hour',dataHour)

      let image = obj?.condition?.icon;
      let tempF = obj?.temp_f;

      if (hour.replace(/am|pm/, '') % 2 === 0) {
        const mainContainer = document.querySelector('.allHourly');

        const itemContainer = document.createElement('div');
        itemContainer.className = 'forecastDay';
        mainContainer.append(itemContainer);

        const day = document.createElement('p');
        day.className = 'forecastDay';
        day.innerText = hour; //hour
        itemContainer.append(day);

        const conditionImg = document.createElement('img');
        conditionImg.src = image;
        conditionImg.className = 'forecastIcon';
        itemContainer.append(conditionImg);

        const temps = document.createElement('p');
        temps.className = 'forecastDay';
        temps.innerText = `${Math.round(tempF)}F`;
        itemContainer.append(temps);
      }
    });
  }
}

async function getWeatherData() {
  const options = {
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify({ location: currentWeather.location }),
  };

  let weatherURL = `https://panopdevweather.onrender.com/weather`;

  try {
    let results = await fetch(weatherURL, options);
    if (results.status !== 200) return;

    results = await results.json();

    return results;
  } catch (error) {
    return;
  }
}
function noDataFound() {
  elLocationHeader[0].style.display = 'none';
  elLocationHeader[1].style.display = '';
  setTimeout(() => {
    elLocationHeader[1].style.display = 'none';
    elLocationHeader[0].style.display = '';
  }, 3000);
}

async function weatherData() {
  let data = await getWeatherData();
  if (!data) {
    return noDataFound();
  }
  const li = document.querySelectorAll('.liStats');
  li.forEach((elem) => elem.remove());
  for (x in data?.current) {
    if (x === 'condition') {
      currentWeather.condition(data);
    } else if (currentWeather[x] != undefined) {
      currentWeather[x](data?.current);
    }
  }
  for (x in data?.location) {
    if (x === 'name') {
      currentWeather.name(data);
    }
  }

  document.querySelectorAll('.forecastDay').forEach((el) => el.remove());
  document.querySelectorAll('.forecastIcon').forEach((el) => el.remove());
  dailyForecast(data);
  hourlyForecast(data);
}
async function browserLocation() {
  await navigator.geolocation.getCurrentPosition((x) => {
    localStorage.setItem('coord', `${x.coords.latitude},${x.coords.longitude}`);
    currentWeather.search = localStorage.getItem('coord');

    weatherData();
  });
}

weatherData();

//
