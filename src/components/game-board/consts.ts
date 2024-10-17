export type cell_colors = "1" | "2" | "3" | "4" | "5" | "6" | "";

export const numbermap: Record<string, cell_colors> = {
    1: "1", // red
    2: "2", // blue
    3: "3", // green
    4: "4", // yellow
    5: "5", // purple
    6: "6", // pink
};

export const lettermpa: Record<string, cell_colors> = {
    "1": "1",
    "2": "2",
    "3": "3",
    "4": "4",
    "5": "5",
    "6": "6",
};

export const colorMap: Record<string, cell_colors> = {
    ...numbermap,
    ...lettermpa,
};


export const rows = Array.from({ length: 12 }, (_, i) => i);
export const columns = Array.from({ length: 4 }, (_, i) => i);
