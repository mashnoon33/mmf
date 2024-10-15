"use client";
import { GameBoard } from "@/components/game-board";
import { useAnonAuth } from "@/hooks/use-anon-auth";
import type { Database } from "supabase/database.types";

export function GameInProgress({ game }: { game: Database["public"]["Tables"]["games"]["Row"]; }) {
    const { session } = useAnonAuth();
    return (
        <div className=" grid grid-cols-2 mx-10 flex-col items-center justify-center border-2 border-white gap-4">
            <div className="flex flex-col items-center justify-center">
                <GameBoard game={game} playerId={game.creator_id} isPlayer={game.creator_id === session?.user.id} />
            </div>
            <div className={`border-l-2 h-full flex flex-col items-center justify-center`} >
                <GameBoard game={game} playerId={game.joiner_id!} isPlayer={game.joiner_id === session?.user.id} />
            </div>
        </div>

    );
}
