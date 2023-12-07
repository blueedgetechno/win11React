import { useLayoutEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ReleaseApp, formatEvent } from '../../../backend/actions/app';

function ReleaseAppModal({ data }) {
    const apps = useSelector((state) => state.globals.apps);
    const games = useSelector((state) => state.globals.games);

    const [storeApps, setStoreApps] = useState([...apps, ...games]);
    useLayoutEffect(() => {
        setStoreApps([...apps, ...games]);
    }, [apps, games]);

    const handleSubmitForm = (e) => {
        e.preventDefault();

        const vol_speed = document.querySelector('#vol_speed').value;
        const vol_availability =
            document.querySelector('#vol_availability').value;
        const gpu_model = document.querySelector('#gpu_model').value;
        const desc = document.querySelector('#desc').value;
        const store_id = document.querySelector('#store_id').value;
        const vcpus = document.querySelector('#vcpus').value;
        const ram = document.querySelector('#ram').value;
        const vdriver = document.querySelector('#vdriver').checked;
        const hidevm = document.querySelector('#hidevm').checked;
        const cluster_id =
            formatEvent(data?.event)?.host?.info?.cluster_id ?? '';

        ReleaseApp({
            vol_speed,
            vol_availability,
            gpu_model,
            desc,
            store_id,
            vcpus,
            ram,
            vdriver,
            hidevm,
            cluster_id
        });
    };
    return (
        <form
            onSubmit={handleSubmitForm}
            id="form"
            className="flex flex-col gap-4 p-[16px]"
        >
            <div className="flex flex-col gap-2 ">
                <label htmlFor="store_id" className="flex gap-8 items-center">
                    <span>App</span>
                    {/*<input className="flex-1 h-[40px] border border-solid px-2 rounded-md" type="text" placeholder="" name="storeId" id="store_id" />*/}
                    <select
                        id="store_id"
                        className="flex-1 h-[40px] border border-solid px-2 rounded-md"
                        name="store_id"
                    >
                        {storeApps.map((app) => (
                            <option value={app.id}>{app.name}</option>
                        ))}
                    </select>
                </label>
                <label htmlFor="desc" className="flex gap-8 items-center">
                    <span>Description</span>
                    <input
                        className="flex-1 h-[40px] border border-solid px-2 rounded-md"
                        type="text"
                        placeholder=""
                        name="desc"
                        id="desc"
                    />
                </label>
            </div>
            <div className="flex items-center gap-5 mt-4">
                <select
                    id="vol_speed"
                    className="h-[32px] text-[16px]"
                    name="vol_speed"
                >
                    <option value="HOT">HOT</option>
                    <option value="WARM">WARM</option>
                    <option value="COLD">COLD</option>
                </select>
                <select
                    id="vol_availability"
                    defaultValue={'LA'}
                    className="h-[32px] text-[16px]"
                    name="vol_availability"
                >
                    <option value="LA">Low Availability</option>
                    <option value="MA">Medium Availability</option>
                    <option value="HA">High Availability</option>
                </select>
            </div>
            <div className="flex items-center justify-around gap-6">
                <select
                    id="gpu_model"
                    defaultValue={'RTX 3060 Ti'}
                    className="h-[32px] text-[16px]"
                    name="gpu_model"
                >
                    <option value="RTX 3060 Ti">RTX 3060 Ti</option>
                    <option value="RTX 2060 SUPER">RTX 2060 Super</option>
                </select>
                <label htmlFor="ram">
                    Ram:
                    <select
                        id="ram"
                        defaultValue={'12'}
                        className="ml-2 h-[32px] text-[16px]"
                        name="ram"
                    >
                        <optgroup label="RAM">
                            <option value="8">8</option>
                            <option value="12">12</option>
                            <option value="16">16</option>
                        </optgroup>
                    </select>
                </label>
                <label htmlFor="">
                    VCPUS:
                    <select
                        id="vcpus"
                        defaultValue={'12'}
                        className="ml-2 h-[32px] text-[16px]"
                        name="vcpus"
                    >
                        <optgroup label="VCPUS">
                            <option value="8">8</option>
                            <option value="12">12</option>
                            <option value="16">16</option>
                        </optgroup>
                    </select>
                </label>
            </div>
            <div className="flex items-center justify-around">
                <label className="flex items-center gap-2" htmlFor="hidevm">
                    {' '}
                    <input
                        type="checkbox"
                        className="h-[20px] w-[20px]"
                        id="hidevm"
                        name="hidevm"
                    />{' '}
                    <span>Hide VM?</span>
                </label>
                <label className="flex items-center gap-2" htmlFor="vdriver">
                    {' '}
                    <input
                        type="checkbox"
                        className="h-[20px] w-[20px]"
                        id="vdriver"
                        name="vdriver"
                    />{' '}
                    <span>Virtual Driver ?</span>
                </label>
            </div>

            <button className="instbtn">Submit</button>
        </form>
    );
}

export default ReleaseAppModal;
