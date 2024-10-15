"use client";
import NameCell from "@/components/buttons/name-cell";
import { GameBoard } from "@/components/game-board";
import { useAnonAuth } from "@/hooks/use-anon-auth";
import { useEffect, useState } from "react";
import { type Database } from "supabase/database.types";
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
            <div className="h-[calc(100vh-100px)]  flex w-full overflow-hidden">
                <GameInProgress game={game} />
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

function LinkCell() {
    return <div className="flex flex-col  border-2 border-white p-5 justify-center ">
        <span className="text-yellow-500 text-xs">Invite link</span>
        <div className="">{window.location.href}</div>
    </div>
}

function DeleteGame({ game }: { game: Database["public"]["Tables"]["games"]["Row"] }) {
    const supabase = createClient();
    const handleDelete = async () => {
        const { error } = await supabase.from('games').delete().eq('id', game.id);
        if (error) {
            console.error('Error deleting game:', error);
        } else {
            window.location.href = '/';
        }
    }
    return <div className="flex min-w-[200px] flex-col items-center justify-center border-2 border-white p-10 gap-4 cursor-pointer hover:bg-red-600 hover:text-white" onClick={handleDelete}>Delete Game</div>

}

function GameInProgress({ game }: { game: Database["public"]["Tables"]["games"]["Row"]}) {
    const { session } = useAnonAuth();
    return (
        <>
            <div className="flex flex-row justify-between items-center max-w-screen-sm mx-auto w-full">
                <GameBoard gameId={game.id} playerId={game.creator_id} isPlayer={game.creator_id === session?.user.id} size={game.creator_id === session?.user.id ? "large" : "small"} />
                <GameBoard gameId={game.id} playerId={game.joiner_id!} isPlayer={game.joiner_id === session?.user.id} size={game.creator_id === session?.user.id ? "small" : "large"} />
            </div>
            {/* <ColorKey /> */}
        </>
    );
}


function PlayerBio({ playerId }: { playerId: string }) {
    const [bio, setBio] = useState<Database["public"]["Tables"]["players"]["Row"] | null>(null);
    const supabase = createClient();

    useEffect(() => {
        const fetchPlayerBio = async (playerId: string, setBio: (bio: Database["public"]["Tables"]["players"]["Row"] | null) => void) => {
            const { data, error } = await supabase
                .from('players')
                .select('*')
                .eq('id', playerId)
                .single();
            if (error) {
                console.error('Error fetching player bio:', error);
            } else {
                setBio(data);
            }
        };

        void fetchPlayerBio(playerId, setBio);
    }, [playerId, supabase]);
    return (
        <div className="p-4   font-mono">
            <h3 className="text-2xl font-bold"> {bio?.name}</h3>
            <p> {bio?.id}</p>
            <p>
                <span className="text-green-500">{bio?.win}W</span> | <span className="text-red-500">{bio?.loss}L</span>
            </p>
        </div>
    );
}

function WaitingForPlayer({ game, handleJoinGame }: { game: Database["public"]["Tables"]["games"]["Row"], handleJoinGame: () => void }) {
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

