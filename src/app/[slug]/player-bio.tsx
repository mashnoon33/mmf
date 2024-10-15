"use client";
import { useState, useEffect } from "react";
import type { Database } from "supabase/database.types";
import { createClient } from "utils/supabase/client";



export function PlayerBio({ playerId }: { playerId: string; }) {
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
