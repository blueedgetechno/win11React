import React from 'react';
import { useAppSelector } from '../../../backend/reducers';
import { ToolBar } from '../../../components/shared/general';
import './assets/store.scss';

export const RefundApp = () => {
    const wnapp = useAppSelector((state) => state.apps.apps.find(x => x.id == 'refund'));

    return (
        <div
            className="refundApp floatTab dpShad"
            data-size={wnapp.size == 'full' ? 'mini' : wnapp.size}
            id={wnapp.id + 'App'}
            data-max={wnapp.max}
            style={{
                ...(wnapp.size == 'cstm' ? wnapp.dim : null),
                zIndex: wnapp.z
            }}
            data-hide={wnapp.hide}
        >
            <ToolBar
                app={wnapp.action}
                icon={wnapp.id}
                size={wnapp.size}
                name="Payment"
            />
            <div
                className=" flex flex-col p-[24px] win11Scroll overflow-y-scroll"
                data-dock="true"
            >
                <h6 className="text-center text-[24px] mb-[14px]">Refund</h6>
                <div className="flex flex-col gap-[8px]">
                    <div className="flex gap-[8px]">
                        <div className="row">
                            <p className="nameFill">Ngân hàng</p>
                            <input className="ip" type="text" />
                        </div>
                        <div className="row w-full ml-[24px]">
                            <p>Tên tk</p>
                            <input className="ip" type="text" />
                        </div>
                    </div>
                    <div className="row">
                        <p className="nameFill">Số Tk</p>
                        <input className="ip" type="text" />
                    </div>
                    <div className="row">
                        <p className="nameFill">Lí Do</p>
                        <input className="ip" type="text" />
                    </div>
                </div>

                <div>
                    <h6 className="text-left text-[20px] mb-[14px] mt-[32px]">
                        Điều kiện
                    </h6>
                    <p className="mb-4">
                        1. Tài khoản nhận tiền bắt buộc phải trùng với tài khoản
                        đã chuyển tiền trước đây
                    </p>
                    <p>2:</p>
                    <div className="flex">
                        <div className="br flex-1 flex flex-col items-center ">
                            <p className="text-center mb-2">Gói Trial(tuần)</p>
                            <p>
                                Số giờ sử dụng dưới: 1.
                                <br />
                                Số ngày sử dụng dưới: 1
                            </p>
                        </div>
                        <div className="flex-1 flex flex-col items-center">
                            <p className="text-center mb-2">
                                Gói Start & Standard(Tháng)
                            </p>
                            <p>
                                Số giờ sử dụng dưới: 7.
                                <br />
                                Số ngày sử dụng dưới: 5
                            </p>
                        </div>
                    </div>
                </div>

                <button className="!text-[14px] !py-3 mt-5 instbtn border-none !w-[120px] self-end ">
                    Xác nhận
                </button>
            </div>
        </div>
    );
};
