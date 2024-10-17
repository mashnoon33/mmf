import { actual_color_map } from "../game-board";
import { colorMap, numbermap } from "../game-board/consts";

export function ColorKey() {
    const groupedColors = Object.entries(colorMap).reduce((acc, [key, color]) => {
        if (!acc[color]) {
            acc[color] = [];
        }
        acc[color].push(key);
        return acc;
    }, {} as Record<string, string[]>);

    return <div>
        <div className="flex flex-row justify-center mt-4">
            {Object.entries(groupedColors).map(([color, keys]) => (
                <div key={color} className="flex flex-row items-center m-2">
                    {keys.map(key => (
                        <Keycap key={key} label={key} color={color} />
                    ))}
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
        // @ts-expect-error this is a type error
        <div className={`inline-block m-1 p-2 border-2  rounded-md border-white text-white text-center w-12 h-12 font-bold relative ${actual_color_map[color]}`}>
            {/\d/.test(label) && <div className="absolute top-1 left-0 right-0 text-xs text-white/20">{shiftKeycapMap[label]}</div>}
            <div className="absolute top-4 left-0 right-0  ">{label}</div>
        </div>
    );
}