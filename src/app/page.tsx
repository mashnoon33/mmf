"use client";
import Title, { Subtitle } from "@/components/title/title";
import { useAnonAuth } from "@/hooks/use-anon-auth";
import { useEffect } from "react";
import CreateSessionCell from "@/components/buttons/create-session-cell";
import ExistingSessionCell from "@/components/buttons/existing-session-cell";
import PlayerName from "@/components/buttons/name-cell";

export default function HomePage() {
  const { session } = useAnonAuth();

  useEffect(() => {
    console.log("session", session);
  }, [session]);
  return (
    <main className="grid h-[calc(100vh-100px)]  space-y-4 pb-10" style={{ gridTemplateRows: "1fr auto" }}>
      <WelcomeCell />
      <div className="grid grid-cols-3 gap-4 mx-10">
        <CreateSessionCell />
        <ExistingSessionCell />
        <PlayerName />
      </div>
    </main>
  );
}



 function WelcomeCell() {
  return (
    <div className="flex mx-10 flex-col items-center justify-center border-2 border-white p-10 gap-4">
      <Title />
      <Subtitle />
    </div>
  );
}

