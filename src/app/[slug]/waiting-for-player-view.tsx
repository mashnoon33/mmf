"use client";
import { useAnonAuth } from "@/hooks/use-anon-auth";
import type { Database } from "supabase/database.types";
import { PlayerBio } from "./player-bio";

export function WaitingForPlayer({ game, handleJoinGame }: { game: Database["public"]["Tables"]["games"]["Row"]; handleJoinGame: () => void; }) {
    const { session } = useAnonAuth();
    return (
        <div className=" mb-10 grid grid-cols-2 mx-10 flex-col items-center justify-center border-2 border-white gap-4">
            <div className="flex flex-col items-center justify-center">
                <PlayerBio playerId={game.creator_id} />
            </div>
            <div className={`border-l-2 h-full flex flex-col items-center justify-center ${game.creator_id != session?.user.id ? "cursor-pointer hover:bg-[#41FF00] hover:text-black" : ""}`}
                onClick={game.creator_id != session?.user.id ? handleJoinGame : undefined}>
                {game.creator_id != session?.user.id ? "Join Game" : "Waiting for player"}
            </div>
        </div>
    );
}
