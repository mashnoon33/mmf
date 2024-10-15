export type cell_colors = "r" | "b" | "g" | "y" | "p" | "i" | "";

export const numbermap: Record<string, cell_colors> = {
    1: "r", // red
    2: "b", // blue
    3: "g", // green
    4: "y", // yellow
    5: "p", // purple
    6: "i", // pink
};

export const lettermpa: Record<string, cell_colors> = {
    "r": "r",
    "b": "b",
    "g": "g",
    "y": "y",
    "p": "p",
    "i": "i",
};

export const colorMap: Record<string, cell_colors> = {
    ...numbermap,
    ...lettermpa,
};


export const rows = Array.from({ length: 12 }, (_, i) => i);
export const columns = Array.from({ length: 4 }, (_, i) => i);
