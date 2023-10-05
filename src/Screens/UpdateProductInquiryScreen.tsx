import React, { useState, SyntheticEvent } from "react";
import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";
import { NavLink, redirect, useNavigate, useParams } from "react-router-dom";
import { UserProps } from "../App";
import { getCookie } from "../cookie";
import { API_URL } from "../config";

export default function UpdatePostScreen({ user }: UserProps) {
  // 전송할 form데이터
  const [form, setForm] = useState({
    writer: user?.id,
    title: "",
    password: "",
    secret: false,
    content: "",
  });

  let { id } = useParams();
  console.log(id);

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
      const url = `${API_URL}/post/update/${id}`;
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

      const res = await axios.patch(url, body, { headers });
      Swal.fire({
        position: "center",
        icon: "success",
        title: "お問い合わせの修正が完了しました",
        showConfirmButton: false,
        timer: 1000,
      });
      navigate("/productinquiry");
      if (res.status === 201) {
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        Swal.fire({
          icon: "error",
          title: error.response?.data.message,
          text: "管理者にお問い合わせください",
          showConfirmButton: false,
          timer: 1000,
        });
      } else if (error instanceof Error) {
        Swal.fire({
          icon: "error",
          title: "記入error",
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
          <h1 className="text-center text-2xl font-bold text-gray-500 mb-10">
            お問い合わせの修正
          </h1>
          <div className="space-y-4">
            <div>
              <label className="text-lx">タイトル</label>
              <input
                type="text"
                placeholder="タイトル"
                id="title"
                className="ml-2 outline-none py-1 px-2 text-md border-2 rounded-md"
                onChange={(event) =>
                  setForm({ ...form, title: event.target.value })
                }
              />
            </div>
            <div>
              <label className="block mb-2 text-lg">内容</label>
              <textarea
                id="content"
                placeholder="こちらに作成してください"
                className="w-full border-2 p-4 text-gray-600 outline-none rounded-md"
                onChange={(event) =>
                  setForm({ ...form, content: event.target.value })
                }
              ></textarea>
            </div>
            <div>
              <label className="text-lx">ファイル</label>
              <input
                type="file"
                id="file"
                className="ml-2 outline-none py-1 px-2 text-md border-2 rounded-md"
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
            <div>
              秘密の有無
              <input
                type="checkbox"
                onChange={(event) => {
                  setForm({ ...form, secret: event.target.checked });
                }}
              />
            </div>
            <div>
              <label className="block mb-2 text-lg">暗証番号</label>
              <input
                type="password"
                placeholder="暗証番号"
                id="password"
                className="ml-2 outline-none py-1 px-2 text-md border-2 rounded-md"
                onChange={(event) =>
                  setForm({ ...form, password: event.target.value })
                }
              />
            </div>
            <button className=" px-6 py-2 mx-auto block rounded-md text-lg font-semibold text-indigo-100 bg-indigo-600  ">
              修正
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
