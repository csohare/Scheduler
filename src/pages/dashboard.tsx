import { useState, useEffect } from "react";
import { supabase } from "../config/supabaseClient";
import { Auth } from "@supabase/auth-ui-react";
import { Session } from "@supabase/supabase-js";
import { ThemeSupa } from "@supabase/auth-ui-shared";

export default function Dashboard() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: session }) => {
      setSession(session.session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert(error);
    }
  };

  console.log(session);
  return !session || session?.user.role !== "service_role" ? (
    <div className="container mx-auto">
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={[]}
        view="sign_in"
        showLinks={false}
      />
    </div>
  ) : (
    <div>
      <button onClick={handleSignOut}>SIGNOUT</button>
    </div>
  );
}
