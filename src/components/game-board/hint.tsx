export function HintRow({ hints }: { hints: number[] }) {
  const dots = Array.from({ length: 4 }, (_, index) => hints[index] ?? -1);
  return (
    <div className="grid grid-cols-2 gap-1 mb-4 absolute top-3 left-[-50px]">
      {dots.map((hint, index) => {
        let colorClass = 'bg-gray-300';
        if (hint === 1) {
          colorClass = 'bg-green-500';
        } else if (hint === 0) {
          colorClass = 'bg-yellow-500';
        }
        return (
          <div key={index} className={`w-3 h-3  ${colorClass}`}></div>
        );
      })}
    </div>
  );
}