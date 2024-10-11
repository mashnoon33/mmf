"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { createClient } from "utils/supabase/client";

export default function CreateSessionButton() {
  const supabase = createClient();
  const router = useRouter();

  const handleCreateGame = async () => {
    const session = await supabase.auth.getSession();
    const { data, error } = await supabase
      .from('games')
      .insert([
        {
          status: 'waiting',
          creator_id: session?.data.session!.user.id,
        },
      ]).select();
    router.push(`/${data![0]!.id}`);
  };

  return <>
    <Button variant="pixelated" onClick={handleCreateGame}>Create Session</Button>
  </>
}