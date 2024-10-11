
type cell_colors = "r" | "b" | "g" | "y" | "p" | "i" | ""

export const colorMap: Record<string, cell_colors> = {
    1: 'r', // red
    2: 'b', // blue
    3: 'g', // green
    4: 'y', // yellow
    5: 'p', // purple
    6: 'i', // pink
};



export const rows = Array.from({ length: 12 }, (_, i) => i);
export const columns = Array.from({ length: 4 }, (_, i) => i);

