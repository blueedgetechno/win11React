import { MdOutlineDone, MdRemoveCircle } from "react-icons/md";


export function complete({ data: {
    success,
    content,
} }) {

    return (
        <div className="w-[330px] h-auto p-[14px] rounded-lg">
            <div className="notify-icon">
                {success
                    ? <MdOutlineDone />
                    : <MdRemoveCircle />}
            </div>
            <p className="text-center text-[1.2rem] mb-[24px]">
                {success ? 'Success' : 'Failure'}
            </p>
            <Content content={content} />
        </div>
    );
}


const Content = ({ content }) => {
    return (
        <div className="mt-[14px]">
            <p>{content}</p>
        </div>
    );
};
