'use client';
import { intervalToDuration, parseJSON } from 'date-fns';
import { useEffect, useState } from 'react';
import { Database } from 'supabase/database.types';
import { Cell } from './cell';
import { columns, rows } from './consts';
import { useGameBoard } from './handler';
import { HintRow } from './hint';

export const actual_color_map = {
    "1": 'bg-red-700',
    "2": 'bg-blue-700',
    "3": 'bg-green-700',
    "4": 'bg-yellow-700',
    "5": 'bg-purple-700',
    "6": 'bg-indigo-700',
};


export function GameBoard({ game, playerId, isPlayer }: { game: Database["public"]["Tables"]["games"]["Row"], playerId: string, isPlayer: boolean }) {
  const { session, board, cursor, hints, status } = useGameBoard(game.id, playerId, isPlayer);
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, [game.status]);
  if (!session) {
    return (<div>Loading...</div>)
  }

  return (
    <div className='flex flex-row items-end gap-4'>
      <div className="flex flex-col items-center relative border">

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

      <div className="flex flex-col   ">
        {status === 'won' && <h1 className='text-xl '>won!</h1>}
        {status === 'lost' && <h1 className='text-xl text-red-500'>lost!</h1>}
        {isPlayer && <span className=''>You</span>}
        <h3 className='text-2xl '>{cursor.row}/12</h3>
        <h1 className='text-4xl text-white'>{getTimeDifferenceInMinSec(parseJSON(game.started_at ?? ""), now)}</h1>
      </div>

    </div>
  );
}



function getTimeDifferenceInMinSec(startTimestamp: Date, endTimestamp: Date) {
  // Calculate the duration between the two timestamps
  const duration = intervalToDuration({ start: startTimestamp, end: endTimestamp });

  // Get minutes and seconds, defaulting to 0 if undefined
  const minutes = duration.minutes ?? 0;
  const seconds = duration.seconds ?? 0;

  // Format the minutes and seconds as mm:ss
  const formattedDuration = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return formattedDuration;
}
