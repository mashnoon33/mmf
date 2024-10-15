'use client';
import React from 'react';
import { columns, rows } from './consts';
import { useGameBoard } from './handler';

type CellProps = {
  value: string;
  isActive: boolean;
  size: 'small' | 'large';
};

export const colorMap = {
  r: 'bg-red-700',
  b: 'bg-blue-700',
  g: 'bg-green-700',
  y: 'bg-yellow-700',
  p: 'bg-purple-700',
  i: 'bg-indigo-700',
};

const Cell: React.FC<CellProps> = ({ value, isActive, size }) => {

  return (
    <div
      className={`${size === 'small' ? 'w-10 h-10' : 'w-14 h-14'} text-white border-2 flex items-center justify-center text-xl font-bold  ${isActive ? 'bg-white text-black' : colorMap[value as keyof typeof colorMap] || ''} `}
    >
      {value}
    </div>
  );
};

export function GameBoard({ gameId, playerId, isPlayer, size }: { gameId: string, playerId: string, isPlayer: boolean, size: 'small' | 'large' }) {
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
                  size={size}
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