"use client";
import type { Database } from "supabase/database.types";
import { createClient } from "utils/supabase/client";

export function DeleteGame({ game }: { game: Database["public"]["Tables"]["games"]["Row"]; }) {
    const supabase = createClient();
    const handleDelete = async () => {
        const { error } = await supabase.from('games').delete().eq('id', game.id);
        if (error) {
            console.error('Error deleting game:', error);
        } else {
            window.location.href = '/';
        }
    };
    return <div className="flex min-w-[200px] h-[100px] flex-col items-center justify-center border-2 border-white p-10 gap-4 cursor-pointer hover:bg-red-600 hover:text-white" onClick={handleDelete}>Delete Game</div>;

}
