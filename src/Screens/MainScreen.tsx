import React from 'react';
import { NavLink } from 'react-router-dom';

const MainScreen = () => {
    return (
        <div className="lg:px-20 md:px-6 px-4 md:py-12 py-8">
            <div className="lg:flex items-center justify-between">
                <div className="lg:w-1/3">
                    <h1 className="text-4xl font-semibold leading-9 text-gray-800 border-b-2 border-transparent border-red-300 font-Line-bd w-fit">
                        イチゴ
                    </h1>
                    <p className="text-base leading-6 mt-4 text-gray-600">
                        子供の友達として、自然な会話を通じて、
                    </p>
                    <p className="text-base leading-6 mt-2 text-gray-600">
                        親の育児負担をもっと軽くしてくれる対話型AI人形です。
                    </p>
                    <NavLink
                        to="/product"
                        aria-label="view catalogue"
                        className="mt-6 md:mt-8 text-base font-semibold leading-none text-gray-800 flex items-center hover:text-red-300"
                    >
                        買いに行く
                        <svg
                            className="ml-2 mt-1"
                            width="12"
                            height="8"
                            viewBox="0 0 12 8"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M1.33325 4H10.6666"
                                stroke="#1F2937"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M8 6.66667L10.6667 4"
                                stroke="#1F2937"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M8 1.33398L10.6667 4.00065"
                                stroke="#1F2937"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </NavLink>
                </div>
                <div className="lg:w-7/12 lg:mt-0 mt-8">
                    <div className="w-full h-full">
                        <img
                            src="img/nude_ted.jpeg"
                            alt="apartment design"
                            className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 lg:gap-8 gap-6 lg:mt-8 md:mt-6 mt-4"
                        />
                    </div>
                    {/* <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 lg:gap-8 gap-6 lg:mt-8 md:mt-6 mt-4">
            <img src="img/ted.jpeg" className="w-full" alt="kitchen" />
            <img src="img/ted.jpeg" className="w-full" alt="sitting room" />
          </div> */}
                </div>
            </div>
        </div>
    );
};

export default MainScreen;
