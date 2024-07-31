import { useLayoutEffect } from "react";
import { useNavigate, useRouteError } from "react-router-dom";

export default function ErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    document.body.style.backgroundColor = "#222222";
  });

  console.log(error);

  return (
    <div className="flex flex-col h-screen justify-center items-center text-white">
      <div>
        <img
          className="transition ease-in-out scale-125 select-none hover:cursor-pointer hover:scale-150 duration-300"
          src="/logo.png"
          onClick={() => {
            navigate("/");
          }}
        />
      </div>
      <div className="font-bold text-2xl">404 Page Not Found</div>
    </div>
  );
}
