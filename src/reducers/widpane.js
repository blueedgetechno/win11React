import * as history from './history.json';
import * as news from './news.json';

import axios from 'axios';

var hisTemp = history.default;

var date = new Date(),
  event = hisTemp[Math.floor(Math.random() * hisTemp.length)];
date.setYear(event.year);

var newsList = [];
for (var i = 0; i < news.default.articles.length; i++) {
  var item = {
    ...news.default.articles[i]
  };
  item.title = item.title.split("-").reverse().splice(1).reverse().join("-").trim();
  newsList.push(item);
}

var abbr = ["sn","sl","h","t","hr","lr","s","hc","lc","c"],
    wstates = ["Snow","Sleet","Hail","Thunderstorm","Heavy Rain","Light Rain","Showers","Heavy Cloud","Light Cloud", "Clear"];

var rem = null;

const getRandom = (x=10,rm=0)=>{
  if(rem!=null){
    var tmp = rem;
    rem = null;
    return tmp;
  }else if (rm) {
    rem = Math.floor(Math.random()*x);
    return rem;
  }

  return Math.floor(Math.random()*x);
}

const defState = {
  data: {
    weather: {
      city: 'New Delhi',
      country: 'India',
      wstate: wstates[getRandom(10,1)],
      icon: abbr[getRandom()],
      temp: 30+getRandom(20),
      rain: 10+getRandom(80),
      wind: 4+getRandom(5),
      days: [0,1,2,4].map(i => {
        return {
          day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
            (new Date().getDay() + i)%7
          ],
          icon: abbr[getRandom(10)],
          min: 30+getRandom(10),
          max: 40+getRandom(10)
        }
      })
    },
    stock: [
      [
        Number(parseFloat(2300 + Math.random() * 200).toFixed(2)).toLocaleString(),
        parseFloat(Math.random() * 2).toFixed(2),
        Math.round(Math.random())
      ],
      [
        Number(parseFloat(600 + Math.random() * 200).toFixed(2)).toLocaleString(),
        parseFloat(Math.random() * 2).toFixed(2),
        Math.round(Math.random())
      ],
    ],
    date: date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    }),
    event: event,
    news: newsList
  },
  hide: true,
  updated: false
};

const openWeatherMapAuth = "6dae2ee11ec5267eb03ccc630a67139c";
axios.get("https://ipapi.co/json")
    .then((response)=>{
        //Read API Result from localstorage
        let weatherStorage = JSON.parse(localStorage.getItem("weatherInfo"));
        if(weatherStorage == null)
            weatherStorage = {};
        if(weatherStorage.city == response.data.city && weatherStorage.day == new Date().getDay()){
            defState.data.weather = weatherStorage.data;
            return;
        }
        defState.data.weather.city = response.data.city;
        defState.data.weather.country = response.data.country_name;
        axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${response.data.latitude}&lon=${response.data.longitude}&units=metric&appid=${openWeatherMapAuth}`)
            .then((response)=>{
                defState.data.weather.wstate = response.data.current.weather[0].main
                defState.data.weather.temp = Math.round(response.data.current.temp)
                defState.data.weather.rain = response.data.current.humidity
                defState.data.weather.wind = Math.round(response.data.current.wind_gust)
                defState.data.weather.iconFrom = "owm";
                defState.data.weather.icon = `https://openweathermap.org/img/wn/${response.data.current.weather[0].icon}@2x.png`;
                for(let i = 0;i < 4;i++){
                    console.log(`https://openweathermap.org/img/wn/${response.data.daily[i].weather[0].icon}@2x.png`)
                    defState.data.weather.days[i] = {
                        day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
                            (new Date().getDay() + i) % 7
                        ],
                        icon: `https://openweathermap.org/img/wn/${response.data.daily[i].weather[0].icon}@2x.png`,
                        iconFrom: "owm",
                        min: Math.round(response.data.daily[i].temp.min),
                        max: Math.round(response.data.daily[i].temp.max)
                        }
                }
                //Save API Result
                weatherStorage = {
                    city: defState.data.weather.city,
                    day: new Date().getDay(),
                    data: defState.data.weather
                }
                localStorage.setItem('weatherInfo',JSON.stringify(weatherStorage));
            })
    })


const widReducer = (state = defState, action) => {

  switch (action.type) {
    case "WIDGHIDE":
      return {
        ...state, hide: true
      };
    case "WIDGTOGG":
      return {
        ...state, hide: !state.hide
      };
    case "WIDGREST":
      return action.payload;
    default:
      return state;
  }
}

export default widReducer;
