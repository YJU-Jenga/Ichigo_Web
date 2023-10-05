import React, { useEffect, useState } from "react";
import axios from "axios";
import { UserProps } from "../App";
// 이름바꿈
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
                  <h4 className="text-md font-Line-bd text-cyan-900 text-justify">
                    {board.title}
                  </h4>
                </div>
                <div className="flex items-center space-x-4 justify-between">
                  <div className="flex gap-3 space-y-1">
                    <span className="text-m font-Line-rg">{board.content}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4 justify-between">
                  <div className="text-grey-500 flex flex-row space-x-1  my-4">
                    <p>{board.createdOn}</p>
                  </div>
                  <div className="flex flex-row space-x-1 font-Line-bd">
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
    title: "정말 좋은 인형",
    content: "정말 예뻐요 ㅎㅎ 인터넷으로 주문 잘 안해봤는데 믿을 만 하네요",
    user: "우니",
    createdOn: "2023-05-23",
  },
  {
    id: 2,
    title: "이 시대 최고의 부모",
    content:
      "아이들이 정말 좋아하고 잘 가지고 놀아요. 첫째만 사줬는데 둘째도 사줄까 생각중이네요^^",
    user: "그니",
    createdOn: "2023-05-23",
  },
  {
    id: 3,
    title: "부모를 그만둘까 생각중...",
    content: "부모의 대체제가 되어버렸네요...역시 귀엽습니다!",
    user: "혀니",
    createdOn: "2023-05-23",
  },
];
