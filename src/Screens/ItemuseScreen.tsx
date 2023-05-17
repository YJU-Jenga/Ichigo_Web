import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { UserProps } from "../App";
import Swal from "sweetalert2";
import { API_URL } from "../config";
import { Board } from "../dto/Board";

const ItemUseScreen = ({ user }: UserProps, id: number) => {
  const [boardList, setBoardList] = useState<Array<Board>>([]);

  useEffect(() => {
    getPostList();
  }, []);

  const getPostList = async () => {
    try {
      const url = `${API_URL}/post/item_use_all`;
      const res = await axios.get(url);
      setBoardList(res.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        Swal.fire({
          icon: "error",
          title: error.response?.data.message,
          text: "관리자에게 문의해주세요",
          showConfirmButton: false,
          timer: 1000,
        });
      }
    }
  };

  return (
    <>
      {boardList.map((board) => {
        return (
          <div className="p-4 items-center justify-center w-[680px] rounded-xl group sm:flex space-x-6 bg-white bg-opacity-50 shadow-xl hover:rounded-2xl">
            {board.image ? (
              <img
                className="mx-auto w-full block sm:w-4/12 h-40 rounded-lg"
                alt="이미지가 없습니다."
                loading="lazy"
                src={`${API_URL}/${board?.image}`}
              />
            ) : null}
            <div className="sm:w-8/12 pl-0 p-5">
              <div className="space-y-2">
                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-cyan-900 text-justify">
                    {board?.title}
                  </h4>
                </div>
                <div className="flex items-center space-x-4 justify-between">
                  <div className="flex gap-3 space-y-1">
                    <span className="text-m">{board?.content}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4 justify-between">
                  <div className="flex flex-row-reverse space-x-1 font-semibold">
                    <p>{board.createdAt.substr(0, 10)}</p>
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
