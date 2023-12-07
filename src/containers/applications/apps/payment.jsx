import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UserEvents } from '../../../backend/actions/analytics';
import { ToolBar } from '../../../components/shared/general';
import './assets/store.scss';

import {
    FUNDING,
    PayPalButtons,
    PayPalScriptProvider
} from '@paypal/react-paypal-js';
import { supabase } from '../../../backend/actions/fetch/createClient';

const FUNDING_SOURCES = [FUNDING.PAYPAL, FUNDING.CARD, FUNDING.PAYU];
const initialOptions = {
    'client-id':
        'AUGjxD_5EwowYxfVHGQSqtBsy0G7F05x850-iRLbbZZFTAZxYXn2ois63R1hZyA0ufbDch1I4lv9XUAZ',
    'enable-funding': '',
    vault: true
};

export const PaymentApp = () => {
    const wnapp = useSelector((state) => state.apps.payment);
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const [ListSubs, setListSubs] = useState([
        //{
        //  name: 'week',
        //  type: 'trial',
        //  title: 'Trial',
        //  for: 'Week',
        //  hours: 20,
        //  gpu: 'RTX 3060ti',
        //  ram: '16GB',
        //  price: '75k'
        //},
        {
            name: 'month',
            type: 'start',
            title: 'Start',
            for: 'Month',
            hours: 100,
            gpu: 'RTX 3060ti',
            ram: '16GB',
            price: '250k'
        },
        {
            name: 'month',
            type: 'standard',
            title: 'Standard',
            for: 'Month',
            hours: 150,
            gpu: 'RTX 3060ti',
            ram: '16GB',
            price: '300k'
        }
    ]);

    useEffect(() => {
        setup();
    }, []);
    const setup = async () => {
        const { data, error } = await supabase
            .from('plans')
            .select('name,metadata->paypal->>id')
            .neq('metadata->paypal->>id', null);
        if (error) throw error;

        setListSubs(
            ListSubs.map((sub) => {
                return {
                    ...sub,
                    plan_id: data.find((x) => x.name == sub.name)?.id
                };
            })
        );
    };

    const payment = async (data, actions) => {
        console.log(data, actions);
    };

    const subscribe = async (user, plan_id, actions) => {
        return actions.subscription.create({
            plan_id: plan_id,
            custom_id: user.id
        });
    };

    const handlePayment = ({ type, price }) => {
        return () => {
            UserEvents({ content: `user pay for ${type}, ${price}` });
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
            data-size={wnapp.size == 'full' ? 'mini' : wnapp.size}
            id={wnapp.icon + 'App'}
            data-max={wnapp.max}
            style={{
                ...(wnapp.size == 'cstm' ? wnapp.dim : null),
                zIndex: wnapp.z
            }}
            data-hide={wnapp.hide}
        >
            <ToolBar
                app={wnapp.action}
                icon={wnapp.icon}
                size={wnapp.size}
                name="Payment"
            />
            {/*<div className="windowScreen flex flex-col p-2" data-dock="true">*/}
            <div>
                <div className="paymentModal">
                    {ListSubs.map((sub, index) => (
                        <div key={index} className="sub">
                            <p className="text-right">{sub.title}</p>
                            <p className="pl-[25%] font-semibold text-[24px]">
                                {sub.price}
                            </p>
                            <p className="pl-[30%] mb-[16px]">/{sub.for}</p>
                            <ul className="list-none flex flex-col gap-[8px] px-[8px]">
                                <li className="flex justify-between">
                                    {' '}
                                    <span className="inline-block min-w-[30px]">
                                        GPU:
                                    </span>{' '}
                                    <span className="text-right">
                                        {sub.gpu}
                                    </span>
                                </li>
                                <li className="flex justify-between">
                                    {' '}
                                    <span className="inline-block min-w-[30px]">
                                        RAM:
                                    </span>{' '}
                                    <span className="text-right">
                                        {sub.ram}
                                    </span>
                                </li>
                                <li className="flex justify-between">
                                    {' '}
                                    <span className="inline-block min-w-[30px]">
                                        Hours:
                                    </span>{' '}
                                    <span className="text-right">
                                        {sub.hours}
                                    </span>
                                </li>
                                <li className="text-[10px] mt-[-8px]">
                                    *giới hạn số giờ được sự dụng trong 1{' '}
                                    {sub.for}.
                                </li>
                            </ul>
                            <button
                                className="mt-[24px] instbtn mx-auto handcr border-none h-[32px] !px-2"
                                onClick={handlePayment({
                                    type: sub.type,
                                    price: sub.price
                                })}
                            >
                                Chuyển Khoản
                            </button>
                            {user?.id ? (
                                <div className="items-center flex flex-col items-center mt-4">
                                    <PayPalScriptProvider
                                        options={initialOptions}
                                    >
                                        {' '}
                                        {FUNDING_SOURCES.map(
                                            (fundingSource, index) => {
                                                return (
                                                    <PayPalButtons
                                                        key={index}
                                                        className="max-w-[120px] min-w-[80px] mx-auto paypalCtn"
                                                        fundingSource={
                                                            fundingSource
                                                        }
                                                        disableMaxWidth={false}
                                                        createSubscription={async (
                                                            data,
                                                            actions
                                                        ) =>
                                                            subscribe(
                                                                user,
                                                                sub.plan_id,
                                                                actions
                                                            )
                                                        }
                                                        onApprove={payment}
                                                        style={{
                                                            layout: 'vertical',
                                                            shape: 'pill',
                                                            color:
                                                                fundingSource ==
                                                                FUNDING.PAYLATER
                                                                    ? 'gold'
                                                                    : ''
                                                        }}
                                                    />
                                                );
                                            }
                                        )}
                                    </PayPalScriptProvider>
                                </div>
                            ) : null}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
