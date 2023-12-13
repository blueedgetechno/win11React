import { useAppSelector } from '../../backend/reducers';
import { Icon, LazyComponent } from '../shared/general';
import './widget.scss';

export const WidPane = () => {
    const widget = useAppSelector((state) => state.sidepane);
    const img = useAppSelector((state) => state.wallpaper.src);

    return (
        <div className="widPaneCont" data-hide={widget.banhide}>
            <LazyComponent show={!widget.banhide}>
                <div className="WidPane win11Scroll">
                    <div className="widtop">
                        <Icon fafa="faEllipsisH" width={12} />
                    </div>
                    <div className="widTime">
                        {new Date().toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit'
                        })}
                    </div>
                    <div className="widgetCont">
                        <div className="newsCont">
                            <div className="allNewsCont">
                                {widget.notifications.map((article, i) => {
                                    return (
                                        <a
                                            className="articleCont  shadow-2xl"
                                            target="_blank"
                                            style={{
                                                '--backgrad': 
                                                article.type == 'pending'
                                                        ? '#8b670c'
                                                : article.type == 'rejected'
                                                            ? '#c20c30'
                                                            : '#0c41aa',
                                                backgroundImage: `url(img/wallpaper/${img})`
                                            }}
                                            href={article.url}
                                            rel="noopener noreferrer"
                                            key={i}
                                            loading="lazy"
                                        >
                                            <div className="tpNews">
                                                <div className="tpSource">
                                                    {article.name}
                                                </div>
                                                <div className="tpArticle">
                                                    {article.title}
                                                </div>
                                                <div className="tpArticle">
                                                    {article.content}
                                                </div>
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
