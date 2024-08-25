import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { supabase } from "../config/supabaseClient";
import { Session } from "@supabase/supabase-js";

type AuthProviderProps = {
  children: ReactNode;
};

export type AuthContextType = {
  session: Session | null;
  signIn: () => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      setSession(data.session);
      setLoading(false);
    };

    fetchSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log(`SUPABSE AUTH EVENT ${event}`);
        setSession(session);
        setLoading(false);
      },
    );

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const signIn = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        //redirectTo: "https://scheduler-delta.vercel.app",
        redirectTo: window.location.origin + window.location.pathname,
      },
    });
    console.log(data, error);
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log(error);
    }
  };

  return (
    <AuthContext.Provider value={{ session, signIn, signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
