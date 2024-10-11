'use client';
import React from 'react';
import { columns, rows } from './consts';
import { useGameBoard } from './handler';

type CellProps = {
  value: string;
  isActive: boolean;
};

export const colorMap = {
  r: 'bg-red-500',
  b: 'bg-blue-500',
  g: 'bg-green-500 text-white',
  y: 'bg-yellow-500 text-white',
  p: 'bg-purple-500',
  i: 'bg-indigo-500 text-white',
};

const Cell: React.FC<CellProps> = ({ value, isActive }) => {

  return (
    <div
      className={`w-10 h-10 border-2 flex items-center justify-center text-xl font-bold  ${isActive ? 'bg-white text-black' : colorMap[value as keyof typeof colorMap] || ''} `}
    >
      {value}
    </div>
  );
};

export function GameBoard({ gameId, playerId, isPlayer }: { gameId: string, playerId: string, isPlayer: boolean }) {
  const { session, board, cursor, hints, status } = useGameBoard(gameId, playerId, isPlayer);

  if (!session) {
    return (<div>Loading...</div>)
  }

  return (
    <div className="flex flex-col items-center relative border">
      {isPlayer && <div className="text-2xl font-bold m-3  border-gray-400 rounded-md p-2 absolute top-[-100px]">You</div>}
      <span className='bg-white text-black'>{status}</span>
    
      {rows.map((row) => (
        <div key={row} className='relative'>
          {hints[row] && <HintRow hints={hints[row]} />}
          <div className="flex ">
            {columns.map((col) => {
              const cellValue = board[row]?.[col] ?? '';
              return (
                <Cell
                  key={col}
                  value={cellValue}
                  isActive={isPlayer && cursor.row === row && cursor.col === col}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export function HintRow({ hints }: { hints: number[] }) {
  const dots = Array.from({ length: 4 }, (_, index) => hints[index] ?? -1);
  return (
    <div className="grid grid-cols-2 gap-1 mb-2 absolute top-0.5 left-[-50px]">
      {dots.map((hint, index) => {
        let colorClass = 'bg-gray-300';
        if (hint === 1) {
          colorClass = 'bg-green-500';
        } else if (hint === 0) {
          colorClass = 'bg-yellow-500';
        }
        return (
          <div key={index} className={`w-4 h-4 rounded-full ${colorClass}`}></div>
        );
      })}
    </div>
  );
}