import { useEffect, useState } from 'react';
import { appDispatch, useAppSelector } from '../../../backend/reducers';
import { LazyComponent, ToolBar } from '../../../components/shared/general';
import './assets/store.scss';

import { FUNDING } from '@paypal/react-paypal-js';
import { supabase } from '../../../backend/reducers/fetch/createClient';

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
    const user = useAppSelector((state) => state.user);
    const dispatch = appDispatch;

    const [ListSubs, setListSubs] = useState([
        {
            highlight: false,
            title: 'Trial',
            price: '3',

            name: 'week',
        },
        {
            highlight: true,
            title: 'Start',
            price: '12',


            name: 'month',
        },
        {
            highlight: false,
            title: 'Standard',
            price: '20',

            name: 'month',
        },
        {
            highlight: false,
            title: 'Enterprise',
            price: '',

            name: 'Enterprise',
        }
    ]);

    useEffect(() => {
        setup();
    }, []);
    const setup = async () => {
        // const { data, error } = await supabase
        //     .from('plans')
        //     .select(
        //         'name,metadata->paypal->>id, metadata->>price_in_vnd, metadata->>total_time, metadata->>type'
        //     )
        //     .not('metadata->>total_time', 'is', null)
        //     .is('deleted_at', null);

        // if (error) throw error;
        // setListSubs(
        //     ListSubs.map((sub) => {
        //         return {
        //             ...sub,
        //             plan_id: data.find((x) => x.type == sub.type)?.id,
        //             hours: data.find((x) => x.type == sub.type)?.total_time,
        //             price:
        //                 data.find((x) => x.type == sub.type)?.price_in_vnd + 'k'
        //         };
        //     })
        // );
    };

    const [paypage, setPaypage] = useState(false)
    const payment = async (data, actions) => {
        setPaypage(true)
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
                    {paypage
                        ? <Payment onClose={() => setPaypage(false)}/>
                        : <div class="paymentContent ">
                            {ListSubs.map((sub, index) => (
                                <div key={index} className="sub relative">

                                    {
                                        sub.highlight
                                            ? <div className='rounded-[36px] bg-green-500 absolute inset-0 z-[-1] w-[102%] h-[105%] top-[-4.5%] left-[-1%]'>
                                                <p class="text-[16px] leading-4 text-center py-2 mt-[8px] text-background">Most Popular</p>

                                            </div>
                                            : null
                                    }

                                    <div class="flex flex-col overflow-hidden border h-full rounded-[4px]">
                                        <div class="bg-surface-100 px-8 xl:px-4 2xl:px-8 pt-6 rounded-tr-[4px] rounded-tl-[4px] ">
                                            <div class="mb-2 flex items-center gap-2">
                                                <div class="flex items-center gap-2">
                                                    <h3 class="text-brand-600 text-2xl font-normal uppercase flex items-center gap-4 font-mono">
                                                        {sub.name}
                                                    </h3>
                                                </div>
                                            </div>
                                            <p class="text-foreground-light my-4 text-sm border-b border-default pb-4 2xl:pr-4">
                                                Perfect for passion projects &amp; simple websites.
                                            </p>

                                            <hr className='border-[#504646]' />
                                            <div class=" text-foreground flex items-baseline text-5xl font-normal lg:text-4xl xl:text-4xl border-b border-default min-h-[175px] pt-10">
                                                <div class="flex flex-col gap-1">
                                                    <div class="flex items-end gap-2">
                                                        <div>
                                                            <div class="flex items-end">


                                                                {
                                                                    sub.title == 'Enterprise' ?
                                                                        <p class="mt-2 gradient-text-500 pb-1 text-5xl">Contact Us</p>
                                                                        :
                                                                        <>
                                                                            <p class="mt-2 gradient-text-500 pb-1 text-5xl">${sub.price}</p>
                                                                            <p class="text-foreground-lighter mb-1.5 ml-1 text-[13px] leading-4">/ month / org</p>
                                                                        </>
                                                                }
                                                            </div>
                                                            <p class="-mt-2">
                                                                <span class="bg-background text-brand-600 border shadow-sm rounded-md bg-opacity-30 py-0.5 px-2 text-[13px] leading-4">
                                                                    Limit of 2 free organizations
                                                                </span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <hr className='border-[#504646]' />

                                        </div>
                                        <div class="border-default bg-surface-100 flex h-full rounded-bl-[4px] rounded-br-[4px] flex-1 flex-col px-8 xl:px-4 2xl:px-8 py-6 ">
                                            <p class="text-foreground-light text-[13px] mt-2 mb-4">Get started with:</p>
                                            <ul role="list" class="text-[13px] text-foreground-lighter">
                                                <li class="flex items-center py-2 first:mt-0">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="sbui-icon text-brand h-4 w-4" aria-hidden="true">
                                                        <polyline points="20 6 9 17 4 12"></polyline>
                                                    </svg>
                                                    <span class="text-foreground mb-0 ml-3 ">Unlimited API requests</span>
                                                </li>
                                            </ul>
                                            <div class="flex flex-col gap-6 mt-auto prose">
                                                <div class="space-y-2 mt-12">
                                                    <p class="text-[13px] whitespace-pre-wrap">Free projects are paused after 1 week of inactivity.</p>
                                                </div>

                                                <a href="javascript:void(0)" onClick={payment}>
                                                    <button type="button" class="border-none h-[48px] relative cursor-pointer space-x-2 text-center font-regular ease-out duration-200 rounded-md outline-none transition-all outline-0 focus-visible:outline-4 focus-visible:outline-offset-1 border bg-brand-button hover:bg-brand-button/80 text-white border-brand focus-visible:outline-brand-600 shadow-sm w-full flex items-center justify-center text-sm leading-4 px-3 py-2 bg-[#328cff]">
                                                        <span class="truncate">
                                                            {
                                                                sub.title == 'Enterprise' ? 'Contact Us' : 'Get Started'
                                                            }
                                                        </span>
                                                    </button>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    }
                </LazyComponent>
            </div>
        </div >
    )
};



const Payment = ({onClose}) => {
    const t = useAppSelector((state) => state.globals.translation);
    const [result, SetResult] = useState([]);
    const Survey = useAppSelector((state) => state.sidepane.surveys);
    const { email, id } = useAppSelector((state) => state.user);

    const [pageNo, setPageNo] = useState(0);
    const nextPage = () =>
        setPageNo((old) => {
            const current = pages.at(old);
            if (current && current.guidance)
                SetResult((old) => [
                    ...old,
                    {
                        question: current.data.question,
                        selection: current.data.options.at(selection)
                    }
                ]);

            return old + 1;
        });
    const prevPage = () =>
        setPageNo((old) => {
            const n = old != 0 ? old - 1 : old;
            const current = pages.at(n);
            if (current && current.guidance)
                SetResult((old) => {
                    old.pop();
                    return old;
                });

            return n;
        });
    const reportSurvey = async () => {
        await supabase.from('generic_events').insert({
            value: result,
            name: `survey result from ${email}`,
            type: 'SURVEY'
        });
    };

    const finishSurvey = async () => {
        // await reportSurvey();
        onClose()
    };

    const [selection, Select] = useState(0);
    useEffect(() => {
        const handle = (e) =>
            e.key == 'Enter'
                ? nextPage()
                : e.key == 'ArrowUp'
                    ? Select((old) => old - 1)
                    : e.key == 'ArrowLeft'
                        ? prevPage()
                        : e.key == 'ArrowRight'
                            ? nextPage()
                            : e.key == 'ArrowDown'
                                ? Select((old) => old + 1)
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

    const Logo = () => (
        <div className="left">
            <img alt="left image" id="left_img" src="logo_white.png" />
        </div>
    );

    const pages = Survey.map((x, i) => { });

    pages.unshift({
        survey: false,
        content: (
            <>
                <Logo />
                <div className="right">
                    <div className="header mb-8">
                        We will follow up with the payment process
                    </div>
                    <div>
                        We will follow up with the payment process
                        <br />
                        <br />
                        We will follow up with the payment process
                        <br />
                    </div>
                </div>
                <Navigate/>
            </>
        )
    });

    pages.push({
        content: (
            <>
                <Logo />
                <div className="right">
                    <div className="header mb-8">{'Thank you'}</div>
                    <Finish />
                </div>
            </>
        )
    });

    return (
        <div className="getstarted floatTab dpShad" >
            <div className="windowScreen flex flex-col" data-dock="true">
                <div className="restWindow flex-grow flex flex-col p-[24px]">
                    <div className="inner_fill_setup">
                        {pages.at(pageNo)?.content}
                    </div>
                </div>
            </div>
        </div >
    );
};
