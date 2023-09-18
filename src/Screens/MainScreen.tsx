import React from "react";
import { NavLink } from "react-router-dom";

const MainScreen = () => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  React.useEffect(() => {
    setIsLoaded(true);
  });

  const titleAnimation = {
    width: "100%",
    opacity: isLoaded ? 1 : 0,
    transform: isLoaded ? "translateX(0)" : "translateX(-100%)",
    transition: "opacity 1s ease, transform 1s ease",
  };

  return (
    <div
      style={{ backgroundImage: `url('/img/main_wave.png')`, height: "95%" }}
      className="w-screen bg-no-repeat bg-contain bg-bottom pt-16 md:pt-32 lg:pt-32 xl:pt-24 2xl:pt-16"
    >
      <div className="flex">
        <div className="lg:w-2/3 px-10 py-0  2xl:py-8">
          <div style={titleAnimation} className="w-full">
            <h1 className="text-5xl sm:text-6xl font-Line-bd text-rose-400">
              イチゴ
            </h1>
            <p className="text-base sm:text-xl  mt-9 sm:mt-7 text-gray-700 font-Line-rg">
              子供の友達として、自然な会話を通じて、
            </p>
            <p className="text-base sm:text-xl leading-6 mt-2 text-gray-700 font-Line-rg">
              親の育児負担をもっと軽くしてくれる対話型AI人形です。
            </p>
            <NavLink
              to="/product"
              aria-label="view catalogue"
              className="mt-9 md:mt-8 2xl:mt-4 text-xl leading-none text-gray-800 flex  hover:text-gray-600  font-Line-bd right"
            >
              買いに行く
            </NavLink>
          </div>
        </div>
        <div className="hidden lg:block lg:w-1/3 animate-bounce h-full pt-16">
          <img className="w-64 xl:w-96" src="img/main_str_bear.png"></img>
        </div>
      </div>
    </div>
  );
};

export default MainScreen;
