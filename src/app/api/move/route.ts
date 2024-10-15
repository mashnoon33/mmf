import { type NextRequest, NextResponse } from 'next/server';
import { getSession } from 'utils/supabase/server';
import { fetchCurrentBoardState, fetchSecretCode, updateBoardState, upsertObfuscatedBoardState } from './helpers';
import { type BoardState, generateHints, type HintState, obfuscateBoardState, type Status } from './utilts';

export async function POST(request: NextRequest) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { board, game_id } = await request.json() as { board: BoardState, game_id: string };
    const session = await getSession();

    if (!session) {
      return handleError('Session not found', 401);
    }

    // Fetch the secret code
    const { data: secretCode, error: secretCodeError } = await fetchSecretCode(game_id);
    if (secretCodeError) {
      return handleError('Error fetching secret code', 500, secretCodeError);
    }

    // Fetch the current board state
    const { data: currentData, error: currentDataError } = await fetchCurrentBoardState(game_id, session.id);
    if (currentDataError) {
      return handleError('Error fetching current board state', 500, currentDataError);
    }

    const hints = generateHints(secretCode, board);
    let status : Status = 'playing';
    const sumOfHints = hints.reduce((sum, hint) => sum + hint, 0);
    if (sumOfHints === 4) {
      status = 'won';
    } else if (currentData.active_row + 1=== 12) {
      status = 'lost';
    }

    // Update the board state
    const updatedBoardState = [...currentData.board_state as unknown as BoardState, board] as BoardState;
    const obfuscatedBoardState = obfuscateBoardState(updatedBoardState);
    const updatedHints = [...currentData.hints as unknown as HintState, hints] as HintState;

    // Update the board state in the database
    const {  error: updateError } = await updateBoardState(game_id, session.id, updatedBoardState, updatedHints, currentData.active_row, status);
    if (updateError) {
      return handleError('Error updating board state', 500, updateError);
    }

    // Update the obfuscated board state in the database
    const { error: obfuscateError } = await upsertObfuscatedBoardState(game_id, session.id, obfuscatedBoardState, updatedHints, status,  currentData.active_row,);
    if (obfuscateError) {
      return handleError('Error upserting obfuscated board state', 500, obfuscateError);
    }

    
    return NextResponse.json({ updatedBoardState, hints, status });
  } catch (error) {
    return handleError('Unexpected error occurred', 500, error);
  }
}

function handleError(message: string, status: number, error?: unknown ) {
  console.error(message, error || '');
  return NextResponse.json({ error: message }, { status });
}

