import { useNavigate } from "react-router-dom";
import { AuthContextType, useAuth } from "../context/authProvider";
import { useEffect } from "react";

export default function Dashboard() {
  const { session } = useAuth() as AuthContextType;
  const navigate = useNavigate();

  useEffect(() => {
    if (!session || session?.user.role !== "service_role") {
      navigate("/");
    }
  }, [session, navigate]);

  return (
    <div className="flex text-white justify-center">TODO: DASHBOARD STUFF</div>
  );
}
