"use client";
import { ColorKey } from "@/components/color-key";
import { GameBoard } from "@/components/game-board";
import { useAnonAuth } from "@/hooks/use-anon-auth";
import { useEffect, useMemo, useState } from "react";
import { Database } from "supabase/database.types";
import { createClient } from "utils/supabase/client";

export default function Page({ params }: { params: { slug: string } }) {
    const [game, setGame] = useState<Database["public"]["Tables"]["games"]["Row"] | null>(null);
    const supabase = createClient();
    const { session } = useAnonAuth();

    useEffect(() => {
        const fetchGame = async () => {
            const { data, error } = await supabase
                .from('games')
                .select('*')
                .eq('id', params.slug)
                .single();
            if (error) {
                console.error('Error fetching game:', error);
            } else {
                setGame(data);
            }
        };

        void fetchGame();

        const subscription = supabase
            .channel('public:games')
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'games', filter: `id=eq.${params.slug}` }, payload => {
                setGame(payload.new as Database["public"]["Tables"]["games"]["Row"]);
            })
            .subscribe();

        return () => {
            void supabase.removeChannel(subscription);
        };
    }, [params.slug, supabase]);

    const handleJoinGame = async () => {
        const { data, error } = await supabase
            .from('games')
            .update({ joiner_id: session?.user.id })
            .eq('id', params.slug)
            .select()
            .single();
        if (error) {
            console.error('Error joining game:', error);
        } else {
            setGame(data);
        }
    };


    if (!game) {
        return <div>Loading...</div>;
    }

    if (game.status !== 'waiting' && session?.user.id) {
        return <div className=" h-screen flex flex-col justify-center items-center ">
            <div className="flex flex-row justify-between items-center max-w-screen-sm mx-auto w-full">
                <GameBoard gameId={game.id} playerId={game.creator_id} isPlayer={game.creator_id === session?.user.id} />
                <GameBoard gameId={game.id} playerId={game.joiner_id!} isPlayer={game.joiner_id === session?.user.id} />
            </div>
            {/* <ColorKey /> */}
        </div>
    }

    return <>
        <pre>{JSON.stringify(game, null, 2)}</pre>
        {game.creator_id === session?.user.id ? "waiting for second player" : <button onClick={handleJoinGame}>Join Game</button>}
    </>
}



