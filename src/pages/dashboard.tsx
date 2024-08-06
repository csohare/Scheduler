import { supabase } from "../config/supabaseClient";
import { AuthContextType, useAuth } from "../context/authProvider";

export default function Dashboard() {
  const { session, signIn } = useAuth() as AuthContextType;

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert(error);
    }
  };

  return !session || session?.user.role !== "service_role" ? (
    <div className="container mx-auto">
      <button onClick={signIn}>Sign In</button>
    </div>
  ) : (
    <div className="flex">
      <button
        className="text-white outline-white mx-auto"
        onClick={handleSignOut}
      >
        SIGNOUT
      </button>
    </div>
  );
}
