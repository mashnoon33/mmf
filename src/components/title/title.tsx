export default function Title() {
    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-[6rem] font-bold">MMFX</h1>
        </div>
    );
}

export function Subtitle() {
    return (
        <div className="flex flex-col items-center justify-center text-white text-center">
            <p className=" w-[40rem]">
                This is a modern realtime multiplayer take on the classic board game. 
                To get started, create a room or join one.
            </p>
        </div>
    );
}