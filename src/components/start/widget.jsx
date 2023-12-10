import React from "react";
import { useAppSelector } from "../../backend/reducers";
import { Icon, LazyComponent } from "../shared/general";
import "./widget.scss";



export const WidPane = () => {
  const widget = useAppSelector((state) => state.sidepane);
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
      data-hide={widget.banhide}
      style={{ "--prefix": "WIDG" }}
    >
      <LazyComponent show={!widget.banhide}>
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
            <div className="newsCont">
              <div className="allNewsCont">
                {widget.notifications
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
                          <div className="tpSource">{article.name}</div>
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
