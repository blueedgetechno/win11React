import { useEffect, useState } from 'react';
import { useAppSelector } from '../../../backend/reducers';
import { LazyComponent, ToolBar } from '../../../components/shared/general';
import './assets/store.scss';

import { FUNDING } from '@paypal/react-paypal-js';
import { UserEvents } from '../../../backend/reducers/fetch/analytics';
import { supabase } from '../../../backend/reducers/fetch/createClient';
import { Contents } from '../../../backend/reducers/locales';
import { Image } from '../../../components/shared/general';

const mb = '970422';
const account_id = '1502200344444';
const account_owner = 'DO VAN DAT';
const model = 'BsXBiU7'; //'sS1SemI'

const FUNDING_SOURCES = [FUNDING.PAYPAL, FUNDING.CARD, FUNDING.PAYU];
const initialOptions = {
    'client-id':
        'AUGjxD_5EwowYxfVHGQSqtBsy0G7F05x850-iRLbbZZFTAZxYXn2ois63R1hZyA0ufbDch1I4lv9XUAZ',
    'enable-funding': '',
    vault: true
};

export const PaymentApp = () => {
    const wnapp = useAppSelector((state) =>
        state.apps.apps.find((x) => x.id == 'payment')
    );
    const [ListSubs, setListSubs] = useState([
        {
            highlight: false,
            title: 'one month plan',
            price_in_vnd: '300',

            name: 'week',
            period: 'month',
            description: 'Perfect to get started using Cloud PC',
            bonus: ['Normal customer support priority']
        },
        {
            highlight: true,
            title: 'one year plan',
            price_in_vnd: '4000',

            name: 'month',
            period: 'year',
            description: 'Perfect to individuals',
            bonus: [
                'Every thing in one month plan plus',
                '1 year Thinkmay Personal Cloud Storage (1TB)',
                '1 year OneDrive / Google Drive (1TB)',
                '1 year Thinkmay Steam account',
                'Highest priority feature request'
            ]
        },
        {
            highlight: false,
            title: 'Enterprise',
            price: 'charge based on number of account ',
            description: 'Solution for your business',

            name: 'Enterprise',
            bonus: [
                '1 year Adobe / AutoCAD  license',
                '1 year Thinkmay Personal Cloud Storage (1TB)',
                '1 year OneDrive / Google Drive (1TB)',
                '1 year Thinkmay Steam account',
                'Multitasking Cloud PC',
                'Account management system for business',
                'Highest priority feature request'
            ]
        }
    ]);

    useEffect(() => {
        setup();
    }, []);
    const setup = async () => {
        const { data, error } = await supabase
            .from('plans')
            .select(
                'name,metadata->paypal->>id, metadata->>price_in_vnd, metadata->>total_time, metadata->>type'
            )
            .not('metadata->>total_time', 'is', null)
            .is('deleted_at', null);

        if (error) throw error;
        setListSubs(
            ListSubs.map((sub) => {
                return { ...sub, ...data.find((x) => x.type == sub.title) };
            })
        );
    };

    const [paypage, setPaypage] = useState(null);
    const payment = async (price_in_vnd) => {
        setPaypage(price_in_vnd);
    };

    return (
        <div
            className="paymentApp floatTab dpShad"
            data-size={wnapp.size}
            id={wnapp.id + 'App'}
            data-max={wnapp.max}
            style={{
                ...(wnapp.size == 'cstm' ? wnapp.dim : null),
                zIndex: wnapp.z
            }}
            data-hide={wnapp.hide}
        >
            <ToolBar
                app={wnapp.id}
                icon={wnapp.id}
                size={wnapp.size}
                name="Payment"
            />
            <div className="windowScreen">
                <LazyComponent show={!wnapp.hide}>
                    {paypage != null ? (
                        <Payment
                            price={paypage}
                            onClose={() => setPaypage(null)}
                        />
                    ) : (
                        <div className="paymentContent ">
                            {ListSubs.map((sub, index) => (
                                <div key={index} className="sub relative">
                                    {sub.highlight ? (
                                        <div className="rounded-[36px] bg-amber-600 absolute inset-0 z-[-1] w-[102%] h-[105%] top-[-4.5%] left-[-1%]">
                                            <p className="text-[16px] leading-4 text-center py-2 mt-[8px] text-background">
                                                Most Popular
                                            </p>
                                        </div>
                                    ) : null}

                                    <div className="flex flex-col overflow-hidden border h-full rounded-[4px]">
                                        <div className="bg-surface-100 px-8 xl:px-4 2xl:px-8 pt-6 rounded-tr-[4px] rounded-tl-[4px] ">
                                            <div className="mb-2 flex items-center gap-2">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="text-brand-600 text-2xl font-normal uppercase flex items-center gap-4 font-mono">
                                                        {sub.title}
                                                    </h3>
                                                </div>
                                            </div>
                                            <p className="text-foreground-light my-4 text-sm border-b border-default pb-4 2xl:pr-4">
                                                {sub.description}
                                            </p>

                                            <hr className="border-[#504646]" />
                                            <div className=" text-foreground flex items-baseline text-5xl font-normal lg:text-4xl xl:text-4xl border-b border-default min-h-[175px] pt-10">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-end gap-2">
                                                        <div>
                                                            <div className="flex items-end">
                                                                {sub.title ==
                                                                'Enterprise' ? (
                                                                    <p className="mt-2 gradient-text-500 pb-1 text-5xl">
                                                                        Contact
                                                                        Us
                                                                    </p>
                                                                ) : (
                                                                    <>
                                                                        <p className="mt-2 gradient-text-500 pb-1 text-5xl">
                                                                            {sub.price_in_vnd
                                                                                ? `${sub.price_in_vnd}k VND`
                                                                                : `\$${sub.price}`}
                                                                        </p>
                                                                        <p className="text-foreground-lighter mb-1.5 ml-1 text-[13px] leading-4">
                                                                            /{' '}
                                                                            {
                                                                                sub.period
                                                                            }{' '}
                                                                        </p>
                                                                    </>
                                                                )}
                                                            </div>
                                                            <p className="-mt-2">
                                                                <span className="bg-background text-brand-600 border shadow-sm rounded-md bg-opacity-30 py-0.5 px-2 text-[13px] leading-4">
                                                                    {sub.title ==
                                                                    'Enterprise'
                                                                        ? 'charge based on number of account'
                                                                        : sub.title ==
                                                                            'one year plan'
                                                                          ? `Unlimited remote usage`
                                                                          : `Limit of ${sub.total_time} hours`}
                                                                </span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <hr className="border-[#504646]" />
                                        </div>
                                        <div className="border-default bg-surface-100 flex h-full rounded-bl-[4px] rounded-br-[4px] flex-1 flex-col px-8 xl:px-4 2xl:px-8 py-6 ">
                                            <p className="text-foreground-light text-[13px] mt-2 mb-4">
                                                Get started with:
                                            </p>

                                            {sub.bonus.map((x, i) => (
                                                <ul
                                                    key={i}
                                                    role="list"
                                                    className="text-[13px] text-foreground-lighter"
                                                >
                                                    <li className="flex items-center py-2 first:mt-0">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="18"
                                                            height="18"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="3"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            className="sbui-icon text-brand h-4 w-4"
                                                            aria-hidden="true"
                                                        >
                                                            <polyline points="20 6 9 17 4 12"></polyline>
                                                        </svg>
                                                        <span className="text-foreground mb-0 ml-3 ">
                                                            {x}
                                                        </span>
                                                    </li>
                                                </ul>
                                            ))}

                                            <div className="flex flex-col gap-6 mt-auto prose">
                                                <div className="space-y-2 mt-12">
                                                    <p className="text-[13px] whitespace-pre-wrap">
                                                        {/* Free projects are paused after 1 week of inactivity. */}
                                                    </p>
                                                </div>

                                                <a
                                                    onClick={() =>
                                                        payment(
                                                            sub.price_in_vnd
                                                        )
                                                    }
                                                >
                                                    <button
                                                        type="button"
                                                        className="border-none h-[48px] relative cursor-pointer space-x-2 text-center font-regular ease-out duration-200 rounded-md outline-none transition-all outline-0 focus-visible:outline-4 focus-visible:outline-offset-1 border bg-brand-button hover:bg-brand-button/80 text-white border-brand focus-visible:outline-brand-600 shadow-sm w-full flex items-center justify-center text-sm leading-4 px-3 py-2 bg-[#328cff]"
                                                    >
                                                        <span className="truncate">
                                                            {sub.title ==
                                                            'Enterprise'
                                                                ? 'Contact Us'
                                                                : 'Get Started'}
                                                        </span>
                                                    </button>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </LazyComponent>
            </div>
        </div>
    );
};

const Payment = ({ onClose, price }) => {
    const t = useAppSelector((state) => state.globals.translation);
    const { id } = useAppSelector((state) => state.user);

    const [pageNo, setPageNo] = useState(0);
    const nextPage = () =>
        setPageNo((old) => {
            const current = pages.at(old);
            return pages.length - 1 != old ? old + 1 : old;
        });
    const prevPage = () =>
        setPageNo((old) => {
            const n = old != 0 ? old - 1 : old;
            const current = pages.at(n);
            return n;
        });
    const finishSurvey = async () => {
        UserEvents({ type: `finish_payment` });
        onClose();
    };

    const [qrurl, setQR] = useState(null);
    useEffect(() => {
        const url = new URL(
            `https://img.vietqr.io/image/${mb}-${account_id}-${model}.png`
        );
        url.searchParams.append('ammount', price * 1000);
        url.searchParams.append('accountName', account_owner);
        url.searchParams.append(
            'addInfo',
            `thinkmay ${id.replaceAll('-', ' ')}`
        );
        setQR(url.toString());

        const handle = (e) =>
            e.key == 'Enter'
                ? nextPage()
                : e.key == 'ArrowLeft'
                  ? prevPage()
                  : e.key == 'ArrowRight'
                    ? nextPage()
                    : null;
        window.addEventListener('keydown', handle);
        return () => {
            window.removeEventListener('keydown', handle);
        };
    }, []);

    const Finish = () => (
        <>
            <div className="yes_button base" onClick={finishSurvey}>
                Continue
            </div>
        </>
    );

    const Navigate = () => (
        <>
            <div className="no_button base" onClick={prevPage}>
                Back
            </div>
            <div className="yes_button base" onClick={nextPage}>
                Next
            </div>
        </>
    );

    const QR = () => (
        <div className="left">
            <Image absolute src={qrurl} />
        </div>
    );
    const Logo = () => (
        <div className="left">
            <img alt="left image" id="left_img" src="logo_white.png" />
        </div>
    );

    const pages = [
        {
            survey: false,
            content: (
                <>
                    <QR />
                    <div className="right">
                        <div className="header mb-8">
                            {t[Contents.PAYMENT_FOLLOW_UP_TITLE1]}
                        </div>
                        <p>
                            MB Bank <br />
                            Tên Chủ Tk: DO VAN DAT <br />
                            Số TK: 1502200344444
                        </p>
                    </div>
                    <Navigate />
                </>
            )
        }
    ];

    pages.unshift({
        survey: false,
        content: (
            <>
                <Logo />
                <div className="right">
                    <div className="header mb-8">
                        {t[Contents.PAYMENT_FOLLOW_UP_TITLE]}
                    </div>
                    <div>
                        {t[Contents.PAYMENT_FOLLOW_UP_CONTENT]}
                        <br />
                    </div>
                </div>
                <Navigate />
            </>
        )
    });

    pages.push({
        survey: false,
        content: (
            <>
                <Logo />
                <div className="right">
                    <div className="header mb-8">
                        {t[Contents.PAYMENT_FOLLOW_UP_DONE]}
                    </div>
                    <Finish />
                </div>
            </>
        )
    });

    return (
        <div className="getstarted floatTab dpShad">
            <div className="windowScreen flex flex-col" data-dock="true">
                <div className="restWindow flex-grow flex flex-col p-[24px]">
                    <div className="inner_fill_setup">
                        {pages.at(pageNo)?.content}
                    </div>
                </div>
            </div>
        </div>
    );
};
