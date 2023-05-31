let firstDone;
let dayContainer = document.querySelector('.dayContainer');
let hourContainer = document.querySelector('.hourContainer');
let spanContainer = document.querySelector('.spanContainer');

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

let dayBtn = document.querySelector('#dayF');
let hourBtn = document.querySelector('#hourF');
let hourBonus = document.querySelector('#hourBonusInfo');

var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

function updateFromSpan(span){
    for(let child of hourContainer.children){
        if(child.id.slice(-1) == span.id.slice(-1)){
            child.style.display = 'flex';
            span.style.color = 'black';
        } else {
            child.style.display = 'none';
            span.style.color = '#FFFFFF';
        }
    }
}

dayBtn.addEventListener('click', () => {
    dayContainer.style.display = 'flex';
    hourContainer.style.display = 'none';
    hourBonus.style.display = 'none';
});

hourF.addEventListener('click', () => {
    dayContainer.style.display = 'none';
    hourContainer.style.display = 'flex';
    hourBonus.style.display = 'flex';
})

form.addEventListener('submit', () => {
    let theInput = locationInput.value.trim();
    if(theInput.length <= 1){
        return;
    }
    doFunc(theInput);
});

async function doFunc(location) {
    const respone = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=4c8dd7726b11412f81e123535232703&q=${location}&days=8&aqi=no&alerts=no`);
    firstDone = await respone.json();
    assignAll(firstDone);
}

function assignAll(response){
    console.log(response);
    assignFirstDay(response);

    for(let element of dayContainer.children){
        setDay(element, response);
    }

    for(let hourPortion of hourContainer.children){
        for(let hourElement of hourPortion.children){
            setHour(hourElement, hourElement.id, response);
        }
    }
}

function assignFirstDay(response){
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

function setDay(dayElement, response){
    let day_id = dayElement.id.slice(-1);
    let chosen_day = response.forecast.forecastday[day_id-1];    
    let day_name = dayElement.getElementsByTagName('h5')[0];
    let day_maxTemp = dayElement.getElementsByTagName('h3')[0];
    let day_minTemp = dayElement.getElementsByTagName('p')[0];
    let day_img = dayElement.getElementsByTagName('img')[0];
    let day_date = new Date(chosen_day.date);

    day_name.textContent = days[day_date.getDay()];
    day_maxTemp.textContent = addCelcius(chosen_day.day.maxtemp_c);
    day_minTemp.textContent = addCelcius(chosen_day.day.mintemp_c);
    day_img.src = chosen_day.day.condition.icon;
}

function setHour(hour, containerID, response){
    let chosen_day = response.forecast.forecastday[0];
    let [irr, hourID] = containerID.split('.');
    const correctDate = new Date(chosen_day.hour[hourID].time);
    let exactHour = correctDate.toLocaleTimeString('en-US').slice(0, 2);
    if(exactHour.slice(-1) == '.'){
        exactHour.slice(0, 1);
    }
    exactHour += correctDate.toLocaleTimeString('en-US').slice(8);
    let hour_name = hour.getElementsByTagName('h5')[0];
    let hour_temp = hour.getElementsByTagName('h3')[0];
    let hour_wind = hour.getElementsByTagName('p')[0];
    let hour_img = hour.getElementsByTagName('img')[0];

    hour_name.textContent = exactHour;
    hour_temp.textContent = addCelcius(chosen_day.hour[hourID].temp_c);
    hour_wind.textContent = chosen_day.hour[hourID].wind_kph + 'km/s';
    hour_img.src = chosen_day.hour[hourID].condition.icon;
}

doFunc('london');

for(let span of spanContainer.children){
    span.addEventListener('click', () => updateFromSpan(span));
}