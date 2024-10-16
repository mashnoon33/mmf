import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { createClient } from "utils/supabase/client";

let isCheckingSession = false;
let sessionPromise: Promise<Session | null> | null = null;

export function useAnonAuth() {
  const supabase = createClient();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const checkAndSignInAnon = async () => {
      if (isCheckingSession) {
        console.log("Session check already in progress, waiting for result");
        const existingSession = await sessionPromise;
        setSession(existingSession);
        return;
      }

      isCheckingSession = true;
      sessionPromise = (async () => {
        console.log("checking session");
        const session = await supabase.auth.getSession();
        if (session && !session.data.session) {
          console.log("no session, creating one");
          const { data, error } = await supabase.auth.signInAnonymously();
          if (error) {
            console.error("Error signing in anonymously:", error);
            isCheckingSession = false;
            sessionPromise = null;
            return null;
          } else {
            console.log("Signed in as anonymous user:", data);
            isCheckingSession = false;
            sessionPromise = null;
            return data.session;
          }
        } else {
          console.log("session already exists");
          isCheckingSession = false;
          sessionPromise = null;
          return session.data.session;
        }
      })();

      const newSession = await sessionPromise;
      setSession(newSession);
    };

    void checkAndSignInAnon();
  }, [supabase]);

  return { session }
}