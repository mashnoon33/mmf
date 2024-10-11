"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAnonAuth } from "@/hooks/use-anon-auth";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { type Database } from "supabase/database.types";
import { createClient } from "utils/supabase/client";

export default function ListActiveSessions() {
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
      .or(`creator_id.eq.${session?.user.id},joiner_id.eq.${session?.user.id}`);

    if (error) {
      toast({
        title: "Error fetching sessions",
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

  const handleGameClick = (gameId: string) => {
    router.push(`/${gameId}`);
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
    <div>
      <h2>List of Active Sessions</h2>
      {userSessions.length > 0 ? (
        <div className="flex flex-col gap-4">
          {userSessions.map((game) => (
            <Card key={game.id} className="p-4 cursor-pointer hover:bg-gray-100 relative" onClick={() => handleGameClick(game.id)}>
              <h3 className="text-lg font-bold">Game ID: {game.id}</h3>
              <p>Status: {game.status}</p>
              {game.creator_id === session?.user.id && <p className="text-sm text-gray-500">You created this game</p>}
              <Button 
                variant="destructive" 
                className="absolute top-2 right-2" 
                onClick={(e) => { e.stopPropagation(); void handleDeleteGame(game.id) }}
              >
                X
              </Button>
            </Card>
          ))}
        </div>
      ) : (
        <p>No active sessions found</p>
      )}
    </div>
  );
}