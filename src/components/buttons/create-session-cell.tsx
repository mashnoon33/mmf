"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "utils/supabase/client";

export default function CreateSessionCell() {
    const supabase = createClient();
    const [session, setSession] = useState(null);
    const router = useRouter();

    const handleCreateGame = async () => {
        const session = await supabase.auth.getSession();
        const { data, error } = await supabase
            .from('games')
            .insert([
                {
                    status: 'waiting',
                    creator_id: session?.data.session?.user.id ?? '',
                },
            ]).select();
        router.push(`/${data![0]!.id}`);
    };

    return <div onClick={handleCreateGame} className="flex cursor-pointer flex-col items-center justify-center border-2 border-white hover:bg-[#41FF00] hover:text-white p-10 gap-4">
        New Game
    </div>
}