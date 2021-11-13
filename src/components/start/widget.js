import React, { useState, useEffect} from 'react';
import { useSelector, useDispatch} from 'react-redux';
import {Icon} from '../../utils/general';

import axios from 'axios';

export const WidPane = () => {
  const dispatch = useDispatch();
  const widget = useSelector((state) => state.widpane);
  const theme = useSelector((state) => state.setting.person.theme);
  const getRandom = (x = 0) => {
    if (theme=="light") return `hsl(${Math.floor(Math.random()*360)}deg 36% 84%)`;
    if (theme=="dark") return `hsl(${Math.floor(Math.random()*360)}deg 36% 16%)`;
  }

  useEffect(async () => {
    if (process.env.REACT_APP_DEVELOPEMENT != "development") {
      if (!widget.updated && !widget.hide) {
        var tmpWdgt = await fetchApi(widget);
        console.log("Fetching Api's");
        if (tmpWdgt.updated) {
          dispatch({
            type: "WIDGREST",
            payload: tmpWdgt
          })
        }
      }
    }
  })

  return (
    <div className="widPaneCont" data-hide={widget.hide} style={{'--prefix':'WIDG'}}>
      <div className="WidPane thinScroll" loading="lazy">
        <div className="widtop">
          <Icon fafa="faEllipsisH" width={12}/>
        </div>
        <div className="widTime">
          {new Date().toLocaleTimeString("en-US",{
            hour: 'numeric',
            minute: '2-digit'
          })}
        </div>
        <div className="widgetCont">
          <div className="topWidgets">
            <div className="weatherCont ltShad">
              <div className="wthtop">WEATHER</div>
              <div className="wthcity">
                <Icon fafa="faMapMarkerAlt" width={8}/>
                {widget.data.weather.city}, {widget.data.weather.country}
              </div>
              <div className="wthInfo">
                <div className="wthTemp">
                  <Icon
                    src={`https://www.metaweather.com/static/img/weather/png/64/${
                      widget.data.weather.icon
                    }.png`} ext
                    width={32}/>
                  <div className="wthdeg">{widget.data.weather.temp}</div>
                  <div className="wthunit">ºC</div>
                </div>
                <div className="moreWinfo">
                  <div className="wcontext">
                    {widget.data.weather.wstate}
                  </div>
                  <div className="rainProb">
                    <div className="chanceOfRain">
                      <Icon fafa="faTint" width={10}/>
                      {widget.data.weather.rain}%
                    </div>
                    <div className="chanceOfRain">
                      <Icon fafa="faWind" width={10}/>
                      {widget.data.weather.wind}
                    </div>
                  </div>
                </div>
              </div>
              <div className="weekWthCont">
                {widget.data.weather.days.map((item,i)=>{
                  return (
                    <div className="weekDay">
                      <div>{i==0?"Today":item.day}</div>
                      <Icon
                        src={`https://www.metaweather.com/static/img/weather/png/64/${
                          item.icon
                        }.png`} ext
                        width={24}/>

                      <div className="tempCont">{item.min}º</div>
                      <div className="tempCont">{item.max}º</div>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="shortCont">
              <div className="short0 ltShad">
                <div className="shName">MONEY | MARKET</div>
                <div className="shEntry">
                  <div className="stockName">
                    <Icon src="google" ui width={12}/>
                    <div className="stName">GOOGL</div>
                  </div>
                  <div className="stockValue">
                    <div>{widget.data.stock[0][0]}</div>
                    <div className="stRes" data-pos={widget.data.stock[0][2]==1}>
                      {widget.data.stock[0][2]?'+':'-'}
                      {widget.data.stock[0][1]}%
                    </div>
                  </div>
                </div>
                <div className="shEntry">
                  <div className="stockName">
                    <Icon src="tesla" ui width={12}/>
                    <div className="stName">TSLA</div>
                  </div>
                  <div className="stockValue">
                    <div>{widget.data.stock[1][0]}</div>
                    <div className="stRes" data-pos={widget.data.stock[1][2]==1}>
                      {widget.data.stock[1][2]?'+':'-'}
                      {widget.data.stock[1][1]}%
                    </div>
                  </div>
                </div>
              </div>
              <div className="short1 ltShad" style={{
                '--afterBack': `url(${widget.data.event.pages[0].thumbnail && widget.data.event.pages[0].thumbnail.source})`,
                backgroundImage: `url(${widget.data.event.pages[0].thumbnail && widget.data.event.pages[0].thumbnail.source})`
              }}>
                <div className="shName">
                  <div className="flex"><Icon fafa="faLandmark" width={8}/>
                      &nbsp;ON THIS DAY
                  </div>
                  <div>{widget.data.date}</div>
                </div>
                <div className="infotextCont">
                  <div className="dayInfo">
                    {widget.data.event.text}
                  </div>
                  <a href={widget.data.event.pages[0].content_urls.desktop.page}
                    rel="noopener noreferrer" target="_blank"
                    className="wikiref">more on wiki</a>
                </div>
              </div>
            </div>
          </div>
          <div className="newsCont">
            <div className="topStories ltShad">
              <div className="topNewsText">TOP STORIES</div>
              <div className="topNewsCont">
                {[...widget.data.news].splice(0,4).map((article,i)=>{
                  return (
                    <div className="tpNews" key={i}>
                      <div className="tpSource">{article.source.name}</div>
                      <div className="tpArticle">{article.title}</div>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="allNewsCont">
              {[...widget.data.news].splice(4, widget.data.news.length).map((article, i)=>{
                return (
                  <a className="articleCont ltShad" target="_blank" style={{
                    '--backgrad': getRandom(2),
                    backgroundImage: `url(${article.urlToImage})`
                  }} href={article.url} rel="noopener noreferrer" key={i}>
                    <div className="tpNews">
                      <div className="tpSource">{article.source.name}</div>
                      <div className="tpArticle">{article.title}</div>
                      {i%5==4?
                        <div className="tpdesc">{article.content}</div>:
                        null}
                    </div>
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const fetchApi = async (widget) => {
  var tmpWdgt = {
    ...widget
  };
  var date = new Date();

  console.log('fetching ON THIS DAY');
  await axios.get(`https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/${date.getMonth()}/${date.getDay()}`)
    .then(res => res.data).then(data => {
      console.log("Fetched");
      var event = data.events[Math.floor(Math.random() * data.events.length)];
      date.setYear(event.year);

      tmpWdgt.data.date = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });

      tmpWdgt.data.event = event;
    }).catch((error) => {
      console.log("Fetch failed");
    });

  console.log('fetching NEWS');
  await axios.get(`https://saurav.tech/NewsAPI/top-headlines/category/general/in.json`)
    .then(res => res.data).then(data => {
      console.log('NEWS Fetched');
      var newsList = [];
      for (var i = 0; i < data.totalResults; i++) {
        var item = {
          ...data.articles[i]
        };
        item.title = item.title.split("-").reverse().splice(1).reverse().join("-").trim();
        newsList.push(item);
      }

      tmpWdgt.data.news = newsList;
    }).catch((error) => {
      console.log("Fetch failed");
    });

  tmpWdgt.updated = true;
  return tmpWdgt;
}
