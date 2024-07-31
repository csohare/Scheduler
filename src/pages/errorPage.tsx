import { useLocation } from "react-router-dom";

export default function ErrorPage() {
  const { state } = useLocation();

  console.log(state.error.message);
  return (
    <div className="flex flex-col h-full justify-center items-center mx-8 mt-8">
      <div className="text-2xl p-6 font-bold text-wrap bg-orange-500 rounded-md">
        Network Error, please try booking again.
        <br />
        If the problem persists, please contact damon@theboombase.com
      </div>
    </div>
  );
}
