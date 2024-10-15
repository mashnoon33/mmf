import { type BoardState, type HintState, type Status } from "./utilts";
import { adminClient } from 'utils/supabase/admin-client'


export async function fetchCurrentBoardState(game_id: string, player_id: string) {
    const composite = `${game_id}_${player_id}`
    console.log("fetching data", composite)
    const supabase = adminClient();
    const { data, error } = await supabase
      .from('game_states')
      .select("board_state, hints, active_row")
      .eq('id', composite)
      .single()
  
    if (error) {
      return { data: null, error };
    }
  
    return { data, error: null };
  }
  
  export async function fetchSecretCode(game_id: string) {
    const supabase = adminClient();
    const { data, error } = await supabase
      .from('game_secret_codes')
      .select('secret_code')
      .eq('game_id', game_id)
      .single()
    if (error) {
      return { data: null, error };
    }
  
    return { data: data.secret_code.split(''), error: null };
  }
  
  export async function updateBoardState(game_id: string, player_id: string, boardState: BoardState, hints: HintState, active_row: number, status: Status) {
    const supabase = adminClient();
    console.log({boardState, hints});
    const { data, error } = await supabase.from('game_states').update({
      // @ts-expect-error this is a supabase bug
      board_state: boardState,
      // @ts-expect-error this is a supabase bug
      hints: hints,
      active_row: active_row + 1,
      status: status
    })
    .eq('player_id', player_id)
    .eq('game_id', game_id)
    .select()
    .single()

  
    if (error) {
      return { data: null, error };
    }
  
    return { data, error: null };
  }
  
  export async function upsertObfuscatedBoardState(game_id: string, player_id: string, boardState: BoardState, hints: HintState, status: Status, active_row: number) {
    const supabase = adminClient();
    const { data, error } = await supabase.from('game_states_obfuscated').upsert({
      // @ts-expect-error this is a supabase bug
      board_state: boardState,
      game_id: game_id,
      player_id: player_id,
      id: game_id + "_" + player_id,
      hints: hints,
      status: status,
      active_row: active_row +1
    })
    .select()
    .single()
  
    if (error) {
      return { data: null, error };
    }
  
    return { data, error: null };
  }