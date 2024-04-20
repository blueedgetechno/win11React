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
                    <div className="WidPane ">
                        <div className="title">
                            Chat with <Icon width={48} src='thinkmay'></Icon>
                        </div>
                        <div className="widgetCont win11Scroll">
                            <div className="newsCont">
                                <div className="allNewsCont">
                                    {widget.message.map((article, i) => {
                                        return (
                                            <a
                                                className={`articleCont `}
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

                        <div className="relative flex sendMessage ">
                            <input
                                className="inputMsg"
                                ref={value}
                                onKeyDown={(e) =>
                                    e.key == 'Enter' ? finish() : null
                                }
                                placeholder="Send us a message"
                                type="text"
                            />
                            <Icon
                                className="z-1 handcr ml-2 "
                                src="mail"
                                width={30}
                                margin="0 10px"
                                onClick={finish}
                            />
                        </div>
                    </div>
                </LazyComponent>
            </div>

            {/*<div
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
            </div>*/}
        </>
    );
};
