import { useLayoutEffect } from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";

export default function Root() {
  useLayoutEffect(() => {
    document.body.style.backgroundColor = "#222222";
  });

  return (
    <Box width="100%" maxWidth="100%">
      <Box>
        <Outlet />
      </Box>
    </Box>
    /*
    <div className="flex flex-col w-full">
      <div className="flex justify-center">
        <img
          className="transition ease-in-out scale-125 select-none hover:cursor-pointer hover:scale-150 duration-300"
          src="/logo.png"
          onClick={() => {
            navigate("/");
          }}
        />
      </div>
      <div>
        <Outlet />
      </div>
    </div>*/
  );
}
