import { useRef } from 'react';
import {
    appDispatch,
    push_message,
    useAppSelector
} from '../../backend/reducers';
import { Icon, LazyComponent } from '../shared/general';
import './widget.scss';

export const WidPane = () => {
    const widget = useAppSelector((state) => state.sidepane);
    const img = useAppSelector((state) => state.wallpaper.src);
    const value = useRef();
    const finish = () => {
        if (value.current.value.length > 0) {
            appDispatch(
                push_message({
                    timestamp: new Date().toISOString(),
                    content: value.current.value
                })
            );
            value.current.value = null;
        }
    };

    if (widget.banhide) return <></>;

    return (
        <>
            <div style={{ '--prefix': 'BAND' }} className="widPaneCont">
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
                                                className={`articleCont  shadow-2xl ${
                                                    article.type == 'pending'
                                                        ? 'load'
                                                        : null
                                                }`}
                                                target="_blank"
                                                style={{
                                                    '--backgrad':
                                                        article.type ==
                                                        'pending'
                                                            ? '#8b670c'
                                                            : article.type ==
                                                                'rejected'
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
                                                        {article.name ??
                                                            new Date().toUTCString()}
                                                    </div>
                                                    <div className="tpTitle">
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

                                <div className="allNewsCont">
                                    {widget.message.map((article, i) => {
                                        return (
                                            <a
                                                className={`articleCont  shadow-2xl `}
                                                href={article.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                key={i}
                                                // loading="lazy"
                                            >
                                                <div className="tpNews">
                                                    <div className="tpSource">
                                                        {(article.name.includes(
                                                            'from'
                                                        )
                                                            ? 'thinkmay'
                                                            : 'you') +
                                                            '  ' +
                                                            new Date(
                                                                article.timestamp
                                                            ).toLocaleDateString() +
                                                            '  ' +
                                                            new Date(
                                                                article.timestamp
                                                            ).toLocaleTimeString()}
                                                    </div>
                                                    <div className="tpTitle">
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

            <div
                style={{ '--prefix': 'BAND' }}
                className="inputCont"
                data-hide={widget.banhide}
            >
                <LazyComponent show={!widget.banhide}>
                    <div className="win11Scroll">
                        <div className="inputCont relative flex ">
                            <input
                                className="messageCont"
                                ref={value}
                                onKeyDown={(e) =>
                                    e.key == 'Enter' ? finish() : null
                                }
                                placeholder="Send us a message"
                                type="text"
                            />
                            <Icon
                                className="z-1 handcr ml-2 articleCont"
                                src="mail"
                                width={50}
                                margin="0 10px"
                                onClick={finish}
                            />
                        </div>
                    </div>
                </LazyComponent>
            </div>
        </>
    );
};
