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

  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();

  // 폼 전송 함수
  const submit = async (e: SyntheticEvent) => {
    try {
      e.preventDefault();
      if (form.secret) {
        if (form.password.length != 4) {
          throw new Error(
            "パスワードをフォーム(数字4文字)に合わせて入力してください"
          );
        }
      }

      if (form.title.length <= 0) {
        throw new Error("タイトルを入力してください");
      } else if (form.title.length < 2) {
        throw new Error("タイトルは2文字以上入力してください");
      }
      if (form.content.length <= 0) {
        throw new Error("内容を入力してください");
      }

      // 전송할 부분 따로 변수로 관리
      const url = `${API_URL}/post/write_item_use`;
      const body = new FormData();

      if (file !== null) {
        body.append("file", file);
      }
      body.append("writer", JSON.stringify({ writer: form.writer }));
      body.append("title", JSON.stringify({ title: form.title }));
      body.append("secret", JSON.stringify({ secret: form.secret }));
      body.append("password", JSON.stringify({ password: form.password }));
      body.append("content", JSON.stringify({ content: form.content }));

      const token = getCookie("access-token");
      const res = await axios.patch(url, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 201) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "レビュー作成が完了しました",
          showConfirmButton: false,
          timer: 1000,
        });
        navigate("/productinquiry");
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
          <h1 className="text-center text-2xl font-bold mb-10 font-Line-bd">
            修正
          </h1>
          <div className="space-y-4">
            <div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 font-Line-bd">
                  タイトル
                </label>
                <input
                  type="text"
                  id="first_name"
                  className="font-Line-rg bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="タイトル"
                  onChange={(event) =>
                    setForm({ ...form, title: event.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 font-Line-bd">
                内容
              </label>
              <textarea
                id="first_name"
                className="font-Line-rg bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 h-56"
                placeholder="内容を記入してください"
                onChange={(event) =>
                  setForm({ ...form, content: event.target.value })
                }
                required
              ></textarea>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 font-Line-bd">
                ファイル
              </label>
              <input
                type="file"
                id="file"
                className="font-Line-rg bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
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
                <label className="block text-sm font-medium text-gray-900 mr-2 mb-2 font-Line-bd">
                  秘密文の有無
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
                <label className="block text-sm font-medium text-gray-900 mt-2 mr-2 font-Line-bd">
                  パスワード
                </label>
                <input
                  type="password"
                  placeholder="パスワード"
                  id="password"
                  className="font-Line-rg bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/4 p-2.5"
                  onChange={(event) =>
                    setForm({ ...form, password: event.target.value })
                  }
                />
              </div>
            </div>
            <button className=" px-6 py-2 mx-auto block rounded-md text-lg font-Line-bd text-white bg-red-300 hover:bg-red-200">
              修正
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
