let firstDone;

let dailyDescription = document.querySelector('#weather_description');
let dailyCity = document.querySelector('#weather_city');
let dailyDate = document.querySelector('#weather_date');
let dailyTime = document.querySelector('#weather_time');
let dailyTemp = document.querySelector('#weather_temp');
let dailyImg = document.querySelector('#weather_dailyImg');
let dailyMaxTemp = document.querySelector('#weather_maxTemp');
let dailyMinTemp = document.querySelector('#weather_minTemp');
let dailyWindSpeed = document.querySelector('#weather_windSpeed');
let dailyHumidity = document.querySelector('#weather_humidity');
let dailyRain = document.querySelector('#weather_rain');

let searchBtn = document.querySelector('#searchLocation');
let locationInput = document.querySelector('#locationInput');
let form = document.querySelector('#mainForm');
let day;

form.addEventListener('submit', () => {
    doFunc(locationInput.value);
});

async function doFunc(location) {
    const respone = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=4c8dd7726b11412f81e123535232703&q=${location}&days=2&aqi=no&alerts=no`);
    firstDone = await respone.json();
    assignVar2(firstDone);
    locationInput.value = '';
}

doFunc('london');

function assignVar2(response){
    [date, time] = response.location.localtime.split(' ');
    dailyCity.textContent = response.location.name;
    dailyDescription.textContent = response.current.condition.text;
    dailyDate.textContent = date;
    dailyTime.textContent = time;
    dailyTemp.textContent = addCelcius(response.current.temp_c);
    let day = response.forecast.forecastday[0].day;
    dailyMaxTemp.textContent = addCelcius(day.maxtemp_c);
    dailyMinTemp.textContent = addCelcius(day.mintemp_c);
    dailyWindSpeed.textContent = day.maxwind_kph + ' km/s';
    dailyHumidity.textContent = day.avghumidity + ' %';
    dailyRain.textContent = day.daily_chance_of_rain + ' %';
    dailyImg.src = response.current.condition.icon;
}

function addCelcius(temp){
    return temp + ' \u{2103}';
}