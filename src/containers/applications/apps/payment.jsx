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

    const payment = async (data, actions) => { };

    const subscribe = async (user, plan_id, actions) => {
        return actions.subscription.create({
            plan_id: plan_id,
            custom_id: user.id
        });
    };

    const handlePayment = ({ type, price }) => {
        return () => {
            const userEmail = user?.email || 'admin@gmail.com';
            const userName = user?.user_metadata.name || 'userEmail';
            dispatch({
                type: 'PM_MODAL',
                payload: { type, price, userEmail, userName }
            });
        };
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
                    <div class="paymentContent ">
                        {ListSubs.map((sub, index) => (
                            <div key={index} className="sub">

                                {
                                    sub.highlight
                                        ? <p class="text-[13px] leading-4 text-center py-2 text-background">Most Popular</p>
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

                                        <div class=" text-foreground flex items-baseline text-5xl font-normal lg:text-4xl xl:text-4xl border-b border-default min-h-[175px] pt-10">
                                            <div class="flex flex-col gap-1">
                                                <div class="flex items-end gap-2">
                                                    <div>
                                                        <div class="flex items-end">
                                                            <p class="mt-2 gradient-text-500 pb-1 text-5xl">${sub.price}</p>
                                                            <p class="text-foreground-lighter mb-1.5 ml-1 text-[13px] leading-4">/ month / org</p>
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
                                                <button type="button" class="relative cursor-pointer space-x-2 text-center font-regular ease-out duration-200 rounded-md outline-none transition-all outline-0 focus-visible:outline-4 focus-visible:outline-offset-1 border bg-brand-button hover:bg-brand-button/80 text-white border-brand focus-visible:outline-brand-600 shadow-sm w-full flex items-center justify-center text-sm leading-4 px-3 py-2 bg-black">
                                                    <span class="truncate">
                                                        Get Started
                                                    </span>
                                                </button>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </LazyComponent>
            </div>
        </div>
    )
};
