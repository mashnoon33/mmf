"use client";
import { useState, useEffect, useCallback } from "react";
import { useAnonAuth } from "@/hooks/use-anon-auth";
import { createClient } from "utils/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

export default function PlayerName() {
  const { session } = useAnonAuth();
  const supabase = createClient();
  const { toast } = useToast();
  const [playerName, setPlayerName] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    const fetchPlayerName = async () => {
      if (!session) {
        return;
      }
      const { data, error } = await supabase
        .from('players')
        .select('name')
        .eq('id', session.user.id)
        .single();

      if (error) {
        toast({
          title: "Error fetching player name for " + session?.user.id,
          description: error.message,
          variant: "destructive",
        });
      } else {
        setPlayerName(data.name);
      }
    };

    void fetchPlayerName();
  }, [session, supabase, toast]);

  const handleSaveName = useCallback(async () => {
    const response = await fetch('/api/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newName }),
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await response.json() as { error: string };

    if (!response.ok) {
      toast({
        title: "Error saving player name",
        description: result.error,
        variant: "destructive",
      });
    } else {
      setPlayerName(newName);
      setIsEditing(false);
      toast({
        title: "Name updated",
        description: "Your name has been updated successfully",
        variant: "default",
      });
    }
  }, [newName, toast]);

  return (
    <div>
      {playerName ? (
        <div>
          <span>{playerName}</span>
          <Button onClick={() => setIsEditing(true)}>Edit</Button>
        </div>
      ) : (
        <div className="flex gap-2">
          <Input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Enter your name"
            className="pixel-corners border-x-4 border-y-2 border-white"
          />
          <Button variant="pixelated" onClick={handleSaveName}>Save</Button>
        </div>
      )}
      {isEditing && (
        <div>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Enter your name"
            className="pixel-corners border-x-4 border-y-2 border-white"
          />
          <Button variant="pixelated" onClick={handleSaveName}>Save</Button>
        </div>
      )}
    </div>
  );
}
