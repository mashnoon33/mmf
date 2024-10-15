"use client";
import { useRouter } from "next/navigation";
import { createClient } from "utils/supabase/client";

export default function CreateSessionCell() {
    const supabase = createClient();
    const router = useRouter();

    const handleCreateGame = async () => {
        const session = await supabase.auth.getSession();
        const { data } = await supabase
            .from('games')
            .insert([
                {
                    status: 'waiting',
                    creator_id: session?.data.session?.user.id ?? '',
                    url: generateUrl(),
                },
            ]).select();
        router.push(`/${data![0]!.url}`);
    };

    return <div onClick={handleCreateGame} className="flex cursor-pointer flex-col items-center justify-center border-2 border-white hover:bg-[#41FF00] hover:text-white p-10 gap-4">
        New Game
    </div>
}

function generateUrl() {
    // 6 digits alphanumeric
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}