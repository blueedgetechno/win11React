import { MdOutlineDone, MdRemoveCircle } from 'react-icons/md';

export function complete({ data: { success, content } }) {
    return (
        <div className="w-[330px] h-auto p-[14px] rounded-lg">
            <div className="notify-icon">
                {success ? <MdOutlineDone /> : <MdRemoveCircle />}
            </div>
            <p className="text-center text-[1.6rem] font-bold mb-[8px]">
                {success ? 'Success' : <span >Failure</span>}
            </p>
            <div className='text-center text-[1.4rem]'>
                <Content content={content} />
            </div>
        </div>
    );
}

const Content = ({ content }) => {
    return (
        <div className="mt-[8px]">
            <p>{content}</p>
        </div>
    );
};
