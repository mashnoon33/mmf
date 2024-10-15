"use client";
import NameCell from "@/components/buttons/name-cell";
import { useAnonAuth } from "@/hooks/use-anon-auth";
import { useEffect, useState } from "react";
import { type Database } from "supabase/database.types";
import { createClient } from "utils/supabase/client";
import { WaitingForPlayer } from "./waiting-for-player-view";
import { GameInProgress } from "./gameplay-view";
import { DeleteGame } from "./delete-game-cell";
import { LinkCell } from "./link-cell";
import { ColorKey } from "@/components/color-key";

export default function Page({ params }: { params: { slug: string } }) {
    const [game, setGame] = useState<Database["public"]["Tables"]["games"]["Row"] | null>(null);
    const supabase = createClient();
    const { session } = useAnonAuth();

    useEffect(() => {
        const fetchGame = async () => {
            const { data, error } = await supabase
                .from('games')
                .select('*')
                .eq('url', params.slug)
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
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'games', filter: `url=eq.${params.slug}` }, payload => {
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
            .eq('url', params.slug)
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
        return (
            <div className="h-[calc(100vh-100px)]  grid  overflow-hidden" style={{ gridTemplateRows: "1fr auto" }}>
                <GameInProgress game={game} />
                <div className="grid   grid-cols-1 gap-4  mx-10 mb-10" style={{ gridTemplateColumns: "" }}>
                    <div className="border-2 border-white h-[100px] w-full">
                        <ColorKey />
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className="h-[calc(100vh-100px)]  grid  overflow-hidden" style={{ gridTemplateRows: "1fr auto" }}>
            <WaitingForPlayer game={game} handleJoinGame={handleJoinGame} />
            <div className="grid justify-center grid-cols-2 gap-4 mx-10 mb-10" style={{ gridTemplateColumns: "3fr 1fr" }}>
                <LinkCell />
                {game.creator_id === session?.user.id ? <DeleteGame game={game} /> : <NameCell />}
            </div>
        </div>
    );
}


