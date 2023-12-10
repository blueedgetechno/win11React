import React from "react";
import { useAppSelector } from "../../backend/reducers";
import { Icon,LazyComponent } from "../shared/general";
import "./widget.scss";




var date = new Date(),
  event = {
    pages: [{
      thumbnail: 'hello',
      content_urls: {
        desktop: {
          page: 'hellp'
        }
      }
    }]
  }
date.setYear(event.year);

var newsList = [];


var abbr = ["sn", "sl", "h", "t", "hr", "lr", "s", "hc", "lc", "c"],
  wstates = [
    "Snow",
    "Sleet",
    "Hail",
    "Thunderstorm",
    "Heavy Rain",
    "Light Rain",
    "Showers",
    "Heavy Cloud",
    "Light Cloud",
    "Clear",
  ];

var rem = null;

const getRandom = (x = 10, rm = 0) => {
  if (rem != null) {
    var tmp = rem;
    rem = null;
    return tmp;
  } else if (rm) {
    rem = Math.floor(Math.random() * x);
    return rem;
  }

  return Math.floor(Math.random() * x);
};
const defState = {
  data: {
    weather: {
      city: "New Delhi",
      country: "India",
      wstate: wstates[getRandom(10, 1)],
      icon: abbr[getRandom()],
      temp: 30 + getRandom(20),
      rain: 10 + getRandom(80),
      wind: 4 + getRandom(5),
      days: [0, 1, 2, 3].map((i) => {
        return {
          day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
            (new Date().getDay() + i) % 7
          ],
          icon: abbr[getRandom(10)],
          min: 30 + getRandom(10),
          max: 40 + getRandom(10),
        };
      }),
    },
    stock: [
      [
        Number(
          parseFloat(2300 + Math.random() * 200).toFixed(2)
        ).toLocaleString(),
        parseFloat(Math.random() * 2).toFixed(2),
        Math.round(Math.random()),
      ],
      [
        Number(
          parseFloat(600 + Math.random() * 200).toFixed(2)
        ).toLocaleString(),
        parseFloat(Math.random() * 2).toFixed(2),
        Math.round(Math.random()),
      ],
    ],
    date: date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    event: event,
    news: newsList,
  },
  hide: true,
};

export const WidPane = () => {
  const widget = defState
  const theme = useAppSelector((state) => state.setting.person.theme);
  const getRandom = (x = 0) => {
    if (theme == "light")
      return `hsl(${Math.floor(Math.random() * 360)}deg 36% 84%)`;
    if (theme == "dark")
      return `hsl(${Math.floor(Math.random() * 360)}deg 36% 16%)`;
  };

  return (
    <div
      className="widPaneCont"
      data-hide={widget.hide}
      style={{ "--prefix": "WIDG" }}
    >
      <LazyComponent show={!widget.hide}>
        <div className="WidPane win11Scroll">
          <div className="widtop">
            <Icon fafa="faEllipsisH" width={12} />
          </div>
          <div className="widTime">
            {new Date().toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
            })}
          </div>
          <div className="widgetCont">
            <div className="topWidgets">
              <div className="weatherCont ltShad">
                <div className="wthtop">
                  <Icon src="weather" width={18} /> <span>Weather</span>
                </div>
                <div className="wthcity">
                  <Icon fafa="faMapMarkerAlt" width={8} />
                  {widget.data.weather.city}, {widget.data.weather.country}
                </div>
                <div className="wthInfo">
                  <div className="wthTemp">
                    <Icon
                      src={`https://www.metaweather.com/static/img/weather/png/64/${widget.data.weather.icon}.png`}
                      ext
                      width={32}
                    />
                    <div className="wthdeg">{widget.data.weather.temp}</div>
                    <div className="wthunit">ºC</div>
                  </div>
                  <div className="moreWinfo">
                    <div className="wcontext">{widget.data.weather.wstate}</div>
                    <div className="rainProb">
                      <div className="chanceOfRain">
                        <Icon fafa="faTint" width={10} />
                        {widget.data.weather.rain}%
                      </div>
                      <div className="chanceOfRain">
                        <Icon fafa="faWind" width={10} />
                        {widget.data.weather.wind}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="weekWthCont">
                  {widget.data.weather.days.map((item, i) => {
                    return (
                      <div key={i} className="weekDay">
                        <div>{i == 0 ? "Today" : item.day}</div>
                        <Icon
                          src={`https://www.metaweather.com/static/img/weather/png/64/${item.icon}.png`}
                          ext
                          width={24}
                        />

                        <div className="tempCont">{item.min}º</div>
                        <div className="tempCont">{item.max}º</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="shortCont">
                <div className="short0 ltShad">
                  <div className="shName">MONEY | MARKET</div>
                  <div className="shEntry">
                    <div className="stockName">
                      <Icon src="google" ui width={12} />
                      <div className="stName">GOOGL</div>
                    </div>
                    <div className="stockValue">
                      <div>{widget.data.stock[0][0]}</div>
                      <div
                        className="stRes"
                        data-pos={widget.data.stock[0][2] == 1}
                      >
                        {widget.data.stock[0][2] ? "+" : "-"}
                        {widget.data.stock[0][1]}%
                      </div>
                    </div>
                  </div>
                  <div className="shEntry">
                    <div className="stockName">
                      <Icon src="tesla" ui width={12} />
                      <div className="stName">TSLA</div>
                    </div>
                    <div className="stockValue">
                      <div>{widget.data.stock[1][0]}</div>
                      <div
                        className="stRes"
                        data-pos={widget.data.stock[1][2] == 1}
                      >
                        {widget.data.stock[1][2] ? "+" : "-"}
                        {widget.data.stock[1][1]}%
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="short1 ltShad"
                  style={{
                    "--afterBack": `url(${
                      widget.data.event.pages[0].thumbnail &&
                      widget.data.event.pages[0].thumbnail.source
                    })`,
                    backgroundImage: `url(${
                      widget.data.event.pages[0].thumbnail &&
                      widget.data.event.pages[0].thumbnail.source
                    })`,
                  }}
                >
                  <div className="shName">
                    <div className="flex">
                      <Icon fafa="faLandmark" width={8} />
                      &nbsp;ON THIS DAY
                    </div>
                    <div>{widget.data.date}</div>
                  </div>
                  <div className="infotextCont">
                    <div className="dayInfo">{widget.data.event.text}</div>
                    <a
                      href={
                        widget.data.event.pages[0].content_urls.desktop.page
                      }
                      rel="noopener noreferrer"
                      target="_blank"
                      className="wikiref"
                    >
                      more on wiki
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="newsCont">
              <div className="topStories ltShad">
                <div className="topNewsText">TOP STORIES</div>
                <div className="topNewsCont">
                  {[...widget.data.news].splice(0, 4).map((article, i) => {
                    return (
                      <div className="tpNews" key={i}>
                        <div className="tpSource">{article.source.name}</div>
                        <div className="tpArticle">{article.title}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="allNewsCont">
                {[...widget.data.news]
                  .splice(4, widget.data.news.length)
                  .map((article, i) => {
                    return (
                      <a
                        className="articleCont ltShad"
                        target="_blank"
                        style={{
                          "--backgrad": getRandom(2),
                          backgroundImage: `url(${article.urlToImage})`,
                        }}
                        href={article.url}
                        rel="noopener noreferrer"
                        key={i}
                        loading="lazy"
                      >
                        <div className="tpNews">
                          <div className="tpSource">{article.source.name}</div>
                          <div className="tpArticle">{article.title}</div>
                          {i % 5 == 4 ? (
                            <div className="tpdesc">{article.content}</div>
                          ) : null}
                        </div>
                      </a>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </LazyComponent>
    </div>
  );
};
