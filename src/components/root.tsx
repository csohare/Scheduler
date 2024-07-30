import { Outlet, useNavigate } from "react-router-dom";

export default function Root() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="w-full h-24 flex justify-start">
        <img
          className="ml-5 scale-125 select-none hover:cursor-pointer"
          src="../../public/logo.png"
          onClick={() => {
            console.log("CLICKED");
            navigate("/");
          }}
        />
      </div>
      <Outlet />
      <div className="w-full">FOOTER</div>
    </div>
  );
}
