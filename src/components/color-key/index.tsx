import { colorMap } from "../game-board/consts";

export function ColorKey() {
    return <div>
        <div className="flex flex-wrap justify-center mt-4">
            {Object.entries(colorMap).map(([key, color]) => (
                <div key={key} className="flex flex-col items-center m-2">
                    <Keycap label={key} color={color} />
                    <div
                        className={`w-5 h-5 border-1 rounded-full`}
                        style={{ backgroundColor: colorMap[color] }}
                    >
                    </div>
                </div>
            ))}
        </div>
    </div>
}

const shiftKeycapMap: Record<string, string> = {
    "1": "!",
    "2": "@",
    "3": "#",
    "4": "$",
    "5": "%",
    "6": "^",
    "7": "&",
    "8": "*",
    "9": "(",
    "0": ")"
};

export function Keycap({ label, color }: { label: string, color: string }) {
    return (
        <div className="inline-block m-1 p-2 border-2  rounded-md bg-gray-200 text-center w-12 h-12 font-bold relative">
            <div className="absolute top-1 left-0 right-0 text-xs text-gray-400">{shiftKeycapMap[label]}</div>
            <div className="absolute top-4 left-0 right-0  text-gray-500">{label}</div>
        </div>
    );
}