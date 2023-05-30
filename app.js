// //jshint esversion:6
require('dotenv').config();

// Variables from HTML file
const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const timezone = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const API_KEY = process.env.OPEN_WEATHER_MAP_API_KEY;

// getting all required elements - TO DO LIST
const searchQuery = document.querySelector("#search-query");
const inputBox = document.querySelector(".inputField input");
const addBtn = document.querySelector(".inputField button");
const todoList = document.querySelector(".todoList");
const deleteAllBtn = document.querySelector(".footer button");
const conditionHeader = document.querySelector("#condition");
const conditionBody = document.querySelector("#suggestion");
const selectedItem = document.querySelector("#check");
const outdoorHarshWeather = [200, 201, 202, 210, 211, 212, 221, 230, 231, 232, 302, 311, 312, 313, 314, 321, 501, 502, 502, 504, 511, 520, 521, 522, 531, 602, 611, 612, 613, 615, 616, 620, 621, 622, 761, 762, 771, 781];
const outdoorMildWeather = [300, 700, 711, 721, 731, 741, 804];
const rainWeather = [301, 310, 311, 321, 500, 501];
const snowWeather = [600, 601, 615];

// User Interface
setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HrFormat = (hour >= 13 ? hour % 12 : hour);
    const minutes = time.getMinutes();
    const ampm = hour >= 12 ? 'PM' : 'AM';

    timeEl.innerHTML = (hoursIn12HrFormat < 10 ? '0' + hoursIn12HrFormat : hoursIn12HrFormat) + ':' + (minutes < 10 ? '0' + minutes : minutes) + ' ' + `<span id="am-pm">${ampm}</span>`;
    dateEl.innerHTML = days[day] + ', ' + date + ' ' + months[month];
}, 1000);

function searchWeather() {
    fetchLatitudeAndLongitude(document.querySelector("#search-query").value);
}

function fetchLatitudeAndLongitude(city) {
    if(city == null || city == "" || city == undefined) {
        navigator.geolocation.getCurrentPosition((success) => {
            let {latitude, longitude} = success.coords;
            
            fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(res => res.json()).then((data) => {
                loadMainData(data);
                showWeatherData(data);
            });
        });
    } else {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`).then((response) => response.json()).then((data) => fetchQueryData(data));
    }
}

function fetchQueryData(data) {
    const {name} = data;
    const {icon, description} = data.weather[0];
    const {country} = data.sys;
    const {temp, temp_max} = data.main;
    const {lon, lat} = data.coord;
    getWeatherData(lon, lat);
    document.querySelector("#location-icon").src = "http://openweathermap.org/img/wn/" + icon + "@4x.png";
    document.querySelector("#location-temp").innerHTML = temp + "&#176;C";
    document.querySelector("#location-legend").innerHTML = name + ", " + country;
    document.querySelector("#coordinates").innerHTML = lat + "<strong>N</strong> " + lon + "<strong>E</strong>";
    document.querySelector("#location-description").innerHTML = "<em>Today: " + description.toUpperCase() + " currently. The high will be " + temp_max + "&#176;C. Have a nice day!</em>"
}

function loadMainData(data) {
    const {icon, description, id} = data.current.weather[0];
    const {temp} = data.current;
    document.querySelector("#location-icon").src = "http://openweathermap.org/img/wn/" + icon + "@4x.png";
    document.querySelector("#location-temp").innerHTML = temp + "&#176;C";
    document.querySelector("#location-legend").innerHTML = "Mumbai, IN";
    document.querySelector("#coordinates").innerHTML = "19.1398<strong>N</strong> 72.8728<strong>E</strong>";
    document.querySelector("#location-description").innerHTML = "<em>Today: " + description.toUpperCase() + " currently. The high will be " + (temp + 1.14) + "&#176;C. Have a nice day!</em>"

    let userEnteredValue = searchQuery.value;
    if(userEnteredValue.trim() == 0) {
        conditionHeader.innerHTML = `Today: ${description[0].toUpperCase() + description.substring(1)}`;
    }

    let suggestion = "";
    if(outdoorHarshWeather.includes(id)) {
        suggestion = `Please refrain from going out for some time. It is ${description} outside. You will not be able to do any of the tasks that are marked "Outdoors" by you in you list based on current weather conditions. Stay indoors and stay safe!`;
    } else if(outdoorMildWeather.includes(id)) {
        suggestion = `It is ${description} outside. The weather is mild and hence suitable to finish any urgent outdoor tasks from your list! Make the most of your time while the weather favours you! You may carry suitable gear just in case of emergency! Stay safe.`;
    } else if(rainWeather.includes(id)) {
        suggestion = `Rain weather update - It is ${description} outside. It is suggested to not do any outdoor activities until a significant change in weather is noticed. However, if it is urgent, please utilise proper rain gear. Stay safe!`;
    } else if(snowWeather.includes(id)) {
        suggestion = `Snow weather update - It is ${description} outside. It is suggested to not do any outdoor activities until a significant change in weather is noticed. However, if it is urgent, please utilise proper snow gear. Stay safe!`;
    } else {
        suggestion = `It is ${description} outside, hence the weather is pleasant! Now is the best time to finish all your outdoor tasks. Complete all your necessary work and enjoy this weather later. Don't miss out! Have fun and stay safe!`;
    }

    conditionBody.innerHTML = suggestion;
}

function getWeatherData(longitudeValue, latitudeValue) {
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitudeValue}&lon=${longitudeValue}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(res => res.json()).then((data) => showWeatherData(data));
}

function showWeatherData(data) {
    let {humidity, pressure, sunrise, sunset, wind_speed, feels_like} = data.current;

    currentWeatherItemsEl.innerHTML = 
    `<div class="weather-item">
        <div>Humidity</div>
        <div>${humidity}%</div>
    </div>
    <div class="weather-item">
        <div>Pressure</div>
        <div>${pressure} hPa</div>
    </div>
    <div class="weather-item">
        <div>Wind Speed</div>
        <div>${wind_speed} m/s</div>
    </div>
    <div class="weather-item">
        <div>Feels like</div>
        <div>${feels_like}&#176;C</div>
    </div>
    <div class="weather-item">
        <div>Sunrise</div>
        <div>${window.moment(sunrise * 1000).format("HH:mm")}</div>
    </div>
    <div class="weather-item">
        <div>Sunset</div>
        <div>${window.moment(sunset * 1000).format("HH:mm")}</div>
    </div>`;

    let otherDayForecast = '';
    data.daily.forEach((day, idx) => {
        if(idx == 0) {
            currentTempEl.innerHTML = `
            <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png" alt="weather icon" class="w-icon">
            <div class="other">
                <div class="day">${window.moment(day.dt * 1000).format("ddd")}</div>
                <div class="temp">Night - ${day.temp.night}&#176;C</div>
                <div class="temp">Day - ${day.temp.day}&#176;C</div>
            </div>
            `
        } else {
            otherDayForecast += `
            <div class="weather-forecast-item">
                <div class="day">${window.moment(day.dt * 1000).format("ddd")}</div>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                <div class="temp">Night - ${day.temp.night}&#176;C</div>
                <div class="temp">Day - ${day.temp.day}&#176;C</div>
            </div>
            `
        }
    });

    weatherForecastEl.innerHTML = otherDayForecast;

    let {id, description} = data.current.weather[0];
    let userEnteredValue = searchQuery.value;
    if(userEnteredValue.trim() != 0) {
        conditionHeader.innerHTML = `Today: ${description[0].toUpperCase() + description.substring(1)}`;
    }

    let suggestion = "";
    if(outdoorHarshWeather.includes(id)) {
        suggestion = `Please refrain from going out for some time. It is ${description} outside. You will not be able to do any of the tasks that are marked "Outdoors" by you in your list based on current weather conditions. Stay indoors and stay safe!`;
    } else if(outdoorMildWeather.includes(id)) {
        suggestion = `It is ${description} outside. The weather is mild and hence suitable to finish any urgent outdoor tasks from your list! Make the most of your time while the weather favours you! You may carry suitable gear just in case of emergency! Stay safe.`;
    } else if(rainWeather.includes(id)) {
        suggestion = `Rain weather update - It is ${description} outside. It is suggested to not do any outdoor activities until a significant change in weather is noticed. However, if it is urgent, please utilise proper rain gear. Stay safe!`;
    } else if(snowWeather.includes(id)) {
        suggestion = `Snow weather update - It is ${description} outside. It is suggested to not do any outdoor activities until a significant change in weather is noticed. However, if it is urgent, please utilise proper snow gear. Stay safe!`;
    } else {
        suggestion = `It is ${description} outside, hence the weather is pleasant! Now is the best time to finish all your outdoor tasks. Complete all your necessary work and enjoy this weather later. Don't miss out! Have fun and stay safe!`;
    }

    conditionBody.innerHTML = suggestion;
}

document.querySelector("#search-button").addEventListener("click", function() {
    searchWeather();
});

// TO DO LIST SECTION

// onkeyup event
inputBox.onkeyup = () => {
    let userEnteredValue = inputBox.value; //getting user entered value
    if(userEnteredValue.trim() != 0){ //if the user value isn't only spaces
        addBtn.classList.add("active"); //active the add button
    } else {
        addBtn.classList.remove("active"); //unactive the add button
    }
}

showTasks(); //calling showTask function

addBtn.onclick = () => { //when user click on plus icon button
    let userEnteredValue = inputBox.value; //getting input field value
    let getLocalStorageData = localStorage.getItem("New Todo"); //getting localstorage
    if(getLocalStorageData == null){ //if localstorage has no data
        listArray = []; //create a blank array
    } else {
        listArray = JSON.parse(getLocalStorageData);  //transforming json string into a js object
    }
    listArray.push(userEnteredValue); //pushing or adding new value in array
    localStorage.setItem("New Todo", JSON.stringify(listArray)); //transforming js object into a json string
    showTasks(); //calling showTask function
    addBtn.classList.remove("active"); //unactive the add button once the task added
}

function showTasks() {
    let getLocalStorageData = localStorage.getItem("New Todo");
    if(getLocalStorageData == null){
        listArray = [];
    } else {
        listArray = JSON.parse(getLocalStorageData); 
    }
    const pendingTasksNumb = document.querySelector(".pendingTasks");
    pendingTasksNumb.textContent = listArray.length; //passing the array length in pendingtask
    if(listArray.length > 0){ //if array length is greater than 0
        deleteAllBtn.classList.add("active"); //active the delete button
    } else {
        deleteAllBtn.classList.remove("active"); //unactive the delete button
    }

    let newLiTag = "";
    listArray.forEach((element, index) => {
        newLiTag += `<li>${element}<input type="checkbox" id="check"><span class="icon" onclick="deleteTask(${index})"><i class="fas fa-trash"></i></span></li>`;
    });

    todoList.innerHTML = newLiTag; //adding new li tag inside ul tag
    inputBox.value = ""; //once task added leave the input field blank
}

// delete task function
function deleteTask(index){
    let getLocalStorageData = localStorage.getItem("New Todo");
    listArray = JSON.parse(getLocalStorageData);
    listArray.splice(index, 1); //delete or remove the li
    localStorage.setItem("New Todo", JSON.stringify(listArray));
    showTasks(); //call the showTasks function
}

// delete all tasks function
deleteAllBtn.onclick = () => {
    listArray = []; //empty the array
    localStorage.setItem("New Todo", JSON.stringify(listArray)); //set the item in localstorage
    showTasks(); //call the showTasks function
}