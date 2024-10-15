/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */


import { useAnonAuth } from '@/hooks/use-anon-auth';
import { useCallback, useEffect } from 'react';
import { colorMap, columns } from './consts';
import { useGameBoardData } from './data-hooks';


export function useGameBoard(gameId: string, playerId: string, isPlayer: boolean) {
    const { session } = useAnonAuth();
    const { board, cursor, setBoard, setCursor, hints, setHints, status, setStatus } = useGameBoardData(gameId, playerId, isPlayer);
    const handleSubmit = useCallback(async () => {
        const response = await fetch(`/api/move`, {
            method: 'POST',
            body: JSON.stringify({ board: board[cursor.row], game_id: gameId }),
        });

        if (response.ok) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const data = await response.json();
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const { updatedBoardState, hints: newHints, status } = data;

            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            setBoard(updatedBoardState);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            setHints((prevHints) => [...prevHints, newHints]);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            setStatus(status);
            setCursor((prevCursor) => ({
                row: prevCursor.row + 1,
                col: 0,
            }));
        }
    }, [board, cursor.row, gameId, setBoard, setCursor, setHints, setStatus]);
    
    const handleKeyPress = useCallback((event: KeyboardEvent) => {
        switch (event.key) {
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case 'r':
            case 'b':
            case 'g':
            case 'y':
            case 'p':
            case 'i':
                handleColorKeyPress(event.key, cursor, setBoard, setCursor);
                break;
            case 'ArrowLeft':
                handleArrowLeft(setCursor);
                break;
            case 'ArrowRight':
                handleArrowRight(setCursor);
                break;
            case 'Backspace':
                handleBackspace(cursor, setBoard, setCursor);
                break;
            case 'Enter':
                void handleSubmit();
                break;
            default:
                break;
        }
    }, [cursor, handleSubmit, setBoard, setCursor]);



    useEffect(() => {
        if (isPlayer) {
            window.addEventListener('keydown', handleKeyPress);
            return () => {
                window.removeEventListener('keydown', handleKeyPress);
            };
        }
    }, [handleKeyPress, isPlayer]);

    return { session, board, cursor, setBoard, setCursor, hints, status };
}




// key handlers


// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
const handleColorKeyPress = (key: string, cursor: { row: number, col: number }, setBoard: Function, setCursor: Function) => {
    const color = colorMap[key];
    if (color) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        setBoard((prevBoard: string[][]) => {
            const newBoard = prevBoard[cursor.row] ?? [];
            newBoard[cursor.col] = color; // Overwrite the color even if something is already there
            return [...prevBoard.slice(0, cursor.row), newBoard, ...prevBoard.slice(cursor.row + 1)];
        });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        setCursor((prevCursor: { row: number, col: number }) => ({
            row: prevCursor.row,
            col: Math.min(prevCursor.col + 1, columns.length - 1),
        }));
    }
};

const handleArrowLeft = (setCursor: Function) => {
    setCursor((prevCursor: { row: number, col: number }) => ({
        row: prevCursor.row,
        col: Math.max(prevCursor.col - 1, 0),
    }));
};

const handleArrowRight = (setCursor: Function) => {
    setCursor((prevCursor: { row: number, col: number }) => ({
        row: prevCursor.row,
        col: Math.min(prevCursor.col + 1, columns.length - 1),
    }));
};

const handleBackspace = (cursor: { row: number, col: number }, setBoard: Function, setCursor: Function) => {
    setBoard((prevBoard: string[][]) => {
        const newBoard = prevBoard.map(row => [...row]);
        if (newBoard[cursor.row]) {

            newBoard[cursor.row]![cursor.col] = '';
        }
        return newBoard;
    });
    setCursor((prevCursor: { row: number, col: number }) => ({
        row: prevCursor.row,
        col: Math.max(prevCursor.col - 1, 0),
    }));
};