import { Status } from '@/app/api/move/utilts';
import { useEffect, useState } from 'react';
import { createClient } from 'utils/supabase/client';

export async function fetchGameState( gameId: string, playerId: string, isPlayer: boolean) {
    const supabase = createClient();

    const table = isPlayer ? 'game_states' : 'game_states_obfuscated';
    const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('game_id', gameId)
        .eq('player_id', playerId)
        .single();
    if (error) {
        console.error('Error fetching game:', error);
        return null;
    } else {
        if (data && data.board_state.length < 12) {
            const additionalRows = Array.from({ length: 12 - data.board_state.length }, () => Array(4).fill("") as string[]);
            // @ts-expect-error this is a supabase bug
            data.board_state = [...data.board_state, ...additionalRows];
        }
      
        return data;
    }
}

export function useGameBoardData(gameId: string, playerId: string, isPlayer: boolean) {
    const supabase = createClient();
    const [board, setBoard] = useState<string[][]>(Array.from({ length: 12 }, () => Array(4).fill("") as string[]));
    const [cursor, setCursor] = useState({ row: 0, col: 0 });
    const [hasBoardLoaded, setHasBoardLoaded] = useState(false);
    const [hints, setHints] = useState<number[][]>([]);
    const [status, setStatus] = useState<Status>('playing');
    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchGameState(gameId, playerId, isPlayer);
            if (data) {
                // @ts-expect-error this is a supabase bug
                setBoard(data.board_state);
                setCursor({ row: data.active_row ?? 0, col: 0 });
                setHasBoardLoaded(true);
                // @ts-expect-error this is a supabase bug
                setHints(data.hints);
                setStatus(data.status as Status);
            }
        };
        void fetchData();
    }, [gameId, playerId, isPlayer]);

    useEffect(() => {
        if (!isPlayer && gameId && playerId) {
            const subscription = supabase
                .channel('real-time:game_states_obfuscated-' + gameId + '_' + playerId)
                .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'game_states_obfuscated', filter: `id=eq.${gameId}_${playerId}` }, payload => {
                    console.log(payload);
                    setBoard(payload.new.board_state as string[][]);
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    setCursor({ row: payload.new.active_row ?? 0, col: 0 });
                    setHints(payload.new.hints as number[][]);
                    setStatus(payload.new.status as Status);
                })
                .subscribe();

            return () => {
                void supabase.removeChannel(subscription);
            };
        }
    }, [gameId, supabase, playerId, isPlayer]);

    return { board, cursor, setBoard, setCursor, hasBoardLoaded, hints, setHints, status, setStatus };
}

