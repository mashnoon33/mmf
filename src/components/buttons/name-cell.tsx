"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useAnonAuth } from "@/hooks/use-anon-auth";
import { createClient } from "utils/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { GrReturn } from "react-icons/gr";

export default function PlayerName() {
  const { session } = useAnonAuth();
  const supabase = createClient();
  const { toast } = useToast();
  const [playerName, setPlayerName] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

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
        setPlayerName(data.name ?? '');
        setNewName(data.name ?? '');
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
     
    }
  }, [newName, toast]);


  const handleClick = () => {
    setIsEditing(true);
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      void handleSaveName();
    }
  };

  return (
    <div onKeyDown={handleKeyDown} onClick={handleClick} className="flex cursor-pointer relative flex-col border-2 border-white text-center justify-center">      
        {
            isEditing ? <input ref={inputRef} placeholder="handle" className="px-4 bg-transparent outline-none text-center focus:outline-none border-none caret-transparent" style={{ caretColor: 'white' }} value={newName} onChange={(e) => setNewName(e.target.value)} /> : playerName ?? <p>No name set</p>
        }
       <div className="absolute bottom-0 right-0 p-2 text-white/60 text-xs">
        {isEditing ? <span className="flex gap-2 items-center"><GrReturn className="font-bold" /> Press Enter to save</span> : <span> Click to edit name</span>}
       </div>
    </div>
  )
}
