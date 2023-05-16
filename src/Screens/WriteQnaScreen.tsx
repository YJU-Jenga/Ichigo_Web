import React, { useState, SyntheticEvent } from "react";
import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";
import { NavLink, redirect, useNavigate } from "react-router-dom";
import { UserProps } from "../App";
import { getCookie } from "../cookie";
import { API_URL } from "../config";

export default function WriteProductInquiryScreen({ user }: UserProps) {
  // 전송할 form데이터
  const [form, setForm] = useState({
    writer: user?.id,
    title: "",
    password: "",
    secret: false,
    content: "",
  });

  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();

  // 폼 전송 함수
  const submit = async (e: SyntheticEvent) => {
    try {
      e.preventDefault();
      if (form.secret) {
        if (form.password.length != 4) {
          throw new Error("비밀번호를 양식(숫자 4글자)에 맞게 입력해주세요.");
        }
      }

      if (form.title.length <= 0) {
        throw new Error("제목을 입력해주세요.");
      } else if (form.title.length < 2) {
        throw new Error("제목은 최소 2글자 이상 입력해주세요.");
      }
      if (form.content.length <= 0) {
        throw new Error("글의 내용을 입력해주세요.");
      }

      // 전송할 부분 따로 변수로 관리
      const url = `${API_URL}/post/write_q&a`;
      const body = new FormData();
      const token = getCookie("access-token");
      const headers = {
        "Content-Type": "Multipart/form-data",
        Authorization: `Bearer ${token}`,
      };

      if (file !== null) {
        body.append("file", file);
      }
      body.append("writer", JSON.stringify({ writer: form.writer }));
      body.append("title", JSON.stringify({ title: form.title }));
      body.append("secret", JSON.stringify({ secret: form.secret }));
      body.append("password", JSON.stringify({ password: form.password }));
      body.append("content", JSON.stringify({ content: form.content }));

      const res = await axios.post(url, body, { headers });
      if (res.status === 201) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Q & A 작성이 완료되었습니다.",
          showConfirmButton: false,
          timer: 1000,
        });
        navigate("/qna");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        Swal.fire({
          icon: "error",
          title: error.response?.data.message,
          text: "관리자에게 문의해주세요",
          showConfirmButton: false,
          timer: 1000,
        });
      } else if (error instanceof Error) {
        Swal.fire({
          icon: "error",
          title: "입력 오류",
          text: error.message,
          showConfirmButton: false,
          timer: 1000,
        });
      }
    }
  };

  return (
    <form onSubmit={submit}>
      <div className="min-h-screen md:px-20 pt-6 border">
        <div className=" bg-white rounded-md px-6 py-10 max-w-2xl mx-auto">
          <h1 className="text-center text-2xl font-bold mb-10">Q & A 쓰기</h1>
          <div className="space-y-4">
            <div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  제목
                </label>
                <input
                  type="text"
                  id="first_name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="제목"
                  onChange={(event) =>
                    setForm({ ...form, title: event.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                내용
              </label>
              <textarea
                id="first_name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 h-56"
                placeholder="내용을 입력해주세요"
                onChange={(event) =>
                  setForm({ ...form, content: event.target.value })
                }
                required
              ></textarea>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                파일
              </label>
              <input
                type="file"
                id="file"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  const target = event.currentTarget;
                  const files = (target.files as FileList)[0];

                  if (files === undefined) {
                    return;
                  }

                  setFile(files);
                }}
              />
            </div>
            <div className="flex w-full flex-col">
              <div className="flex flex-row">
                <label className="block text-sm font-medium text-gray-900 mr-2 mb-2">
                  비밀글
                </label>
                <input
                  className="block text-lg mb-2"
                  type="checkbox"
                  onChange={(event) => {
                    setForm({ ...form, secret: event.target.checked });
                  }}
                />
              </div>
              <div className="divider divider-horizontal"></div>
              <div className="flex flex-row">
                <label className="block text-sm font-medium text-gray-900 mt-2 mr-2">
                  비밀번호
                </label>
                <input
                  type="password"
                  placeholder="비밀번호"
                  id="password"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/4 p-2.5"
                  onChange={(event) =>
                    setForm({ ...form, password: event.target.value })
                  }
                />
              </div>
            </div>
            <button className=" px-6 py-2 mx-auto block rounded-md text-lg font-semibold text-white bg-red-300 hover:bg-red-200">
              글 쓰기
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
