import React, { useEffect, useState } from "react";
import axios from "axios";
import { UserProps } from "../App";

const ItemUseScreen = ({ user }: UserProps) => {
  const [boardList, setList] = useState([
    {
      id: "",
      title: "",
      content: "",
      createdOn: "",
    },
  ]);

  useEffect(() => {
    axios
      .get("/boards")
      .then((res) => setList(res.data))
      .catch((error) => console.log(error));
  });

  return (
    <>
      {dummyData.map((board) => {
        return (
          <div className="p-4 items-center justify-center w-[680px] rounded-xl group sm:flex space-x-6 bg-white bg-opacity-50 shadow-xl hover:rounded-2xl">
            <img
              className="mx-auto w-full block sm:w-4/12 h-40 rounded-lg"
              alt="art cover"
              loading="lazy"
              src="https://picsum.photos/seed/2/2000/1000"
            />
            <div className="sm:w-8/12 pl-0 p-5">
              <div className="space-y-2">
                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-cyan-900 text-justify">
                    {board.title}
                  </h4>
                </div>
                <div className="flex items-center space-x-4 justify-between">
                  <div className="flex gap-3 space-y-1">
                    <span className="text-m">{board.content}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4 justify-between">
                  <div className="text-grey-500 flex flex-row space-x-1  my-4">
                    <p>{board.createdOn}</p>
                  </div>
                  <div className="flex flex-row space-x-1 font-semibold">
                    {board.user}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default ItemUseScreen;

const dummyData = [
  {
    id: 1,
    title: "테스트 글1 제목입니다.",
    content: "정말 예뻐요 ㅎㅎ 인터넷으로 주문 잘 안해봤는데 믿을 만 하네요",
    user: "우니",
    createdOn: "2023-05-23",
  },
  {
    id: 2,
    title: "테스트 글2 제목입니다.",
    content:
      "225-230신는데, 크게나왔다고해서 225로 샀습니다.꽉끈하면 맞는 정도고, 역시 귀엽습니다",
    user: "그니",
    createdOn: "2023-05-23",
  },
  {
    id: 3,
    title: "테스트 글3 제목입니다.",
    content:
      "225-230신는데, 크게나왔다고해서 225로 샀습니다.꽉끈하면 맞는 정도고, 역시 귀엽습니다!",
    user: "혀니",
    createdOn: "2023-05-23",
  },
];
