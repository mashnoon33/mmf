export default function Title() {
    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-6xl font-bold">Mastermind</h1>
            <h1 className="text-6xl font-bold">Effect</h1>
        </div>
    );
}

export function Subtitle() {
    return (
        <div className="flex flex-col items-center justify-center text-white text-center">
            <p className="">Welcome to Mastermind Effect. 
                This is a modern realtime multiplayer take on the classic board game. 
                To get started, create a room or join one.
            </p>
        </div>
    );
}