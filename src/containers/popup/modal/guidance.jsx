export function guidance({ data: { content } }) {
    return (
        <div className="w-[330px] h-auto p-[30px] rounded-lg self-center">
            {content}
        </div>
    );
}
