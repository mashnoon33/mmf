import { Session, User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { createClient } from "utils/supabase/client";

export function useAnonAuth() {
  const supabase = createClient();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const signInAnon = async () => {
      const { data, error } = await supabase.auth.signInAnonymously();
      console.log("no session, creating one");
      if (error) {
        console.error("Error signing in anonymously:", error);
      } else {
        console.log("Signed in as anonymous user:", data);
        setSession(data.session);
      }
    };

    // Check if user is already signed in
    void (async () => {
      console.log("checking session");
      const session = await supabase.auth.getSession();
      if (session && !session.data.session) {
        await signInAnon();
      } else {
        console.log("session already exists");
        setSession(session.data.session);
      }
    })();
  }, [supabase]);

  return { session };
}
