"use client";
import { useAnonAuth } from "@/hooks/use-anon-auth";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { type Database } from "supabase/database.types";
import { createClient } from "utils/supabase/client";
import { Button } from "../ui/button";

export default function ExistingSessionCell() {
    const [sessions, setSessions] = useState<Database["public"]["Tables"]["games"]["Row"][]>([]);
    const { session } = useAnonAuth();
    const supabase = createClient();
    const router = useRouter();
    const { toast } = useToast();

    const fetchSessions = useCallback(async () => {
        if (!session) {
            return;
        }
        const { data, error } = await supabase
            .from('games')
            .select('*')
            .or(`status.eq.waiting,status.eq.active`)
            .eq(`creator_id`, session?.user.id)
            .limit(1);

        if (error) {
            toast({
                title: "Error fetching session",
                description: error.message,
                variant: "destructive",
            });
        } else {
            setSessions(data);
        }
    }, [session, supabase, toast]);

    useEffect(() => {
        void fetchSessions();
    }, [supabase, session?.user.id, fetchSessions]);

    const userSessions = sessions.filter(
        (game: Database["public"]["Tables"]["games"]["Row"]) => game.creator_id === session?.user.id || game.joiner_id === session?.user.id
    );

    const handleGameClick = (url: string) => {
        router.push(`/${url}`);
    };

    const handleDeleteGame = async (gameId: string) => {
        const { error } = await supabase
            .from('games')
            .delete()
            .eq('id', gameId);
        if (error) {
            toast({
                title: "Error deleting game",
                description: error.message,
                variant: "destructive",
            });
        } else {
            void fetchSessions();
            toast({
                title: "Game deleted",
                description: "The game has been deleted",
                variant: "default",
            });
        }
    };

    return (
        <div className="flex   flex-col  border-2 border-white text-center justify-center">
            {userSessions.length > 0 ? (
                <div className="flex w-full flex-col ">
                    {userSessions.map((game) => (
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                        <div key={game.id} className="p-4 w-full cursor-pointer hover:bg-gray-100 relative" onClick={() => handleGameClick(game.url )}>
                            <h2 className="text-lg font-bold">Join Existing</h2>
                            <p className="text-[#41FF00]">{game.status}</p>
                            <p className="text-sm ">{game.id.split('-')[0]}</p>
                            <Button
                                variant="ghost"
                                className="absolute top-1    right-1 text-red-600"
                                onClick={(e) => { e.stopPropagation(); void handleDeleteGame(game.id) }}
                            >
                                X
                            </Button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="p-4 text-white/40">No active sessions found </p>
            )}
        </div>
    );
}