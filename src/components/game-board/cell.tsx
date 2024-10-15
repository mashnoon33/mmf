import { actual_color_map } from ".";

type CellProps = {
  value: string;
  isActive: boolean;
};

export function Cell({ value, isActive }: CellProps) {

  return (
    <div
      className={`w-14 h-14 text-white border-2 flex items-center justify-center text-xl font-bold  ${isActive ? 'bg-white text-black' : actual_color_map[value as keyof typeof actual_color_map] || ''}  ${value === "x" ? "bg-white/90" : ""}`}
    >
      {value === "x" ? "" : value}
    </div>
  );
};
