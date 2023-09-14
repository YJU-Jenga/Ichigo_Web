import Swal from "sweetalert2";
import { UserProps } from "../App";
import axios, { AxiosError } from "axios";
import { API_URL } from "../config";
import { useEffect, useState } from "react";
import { getCookie } from "../cookie";
import { useNavigate } from "react-router-dom";

const ManigingDeviceScreen = ({ user }: UserProps) => {
  const navigate = useNavigate();
  const [deviceList, setDeviceList] = useState<Array<any>>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [changed, setChanged] = useState(true);
  const [name, setName] = useState("");
  const [macAddress, setMacAddress] = useState("");
  // 유저 정보를 가져와 봅시다 음호호
  useEffect(() => {
    getDeviceList();
  }, [changed]);

  const getDeviceList = async () => {
    const token = getCookie("access-token"); // 쿠키에서 JWT 토큰 값을 가져온다.
    const url = `${API_URL}/device/getAll`;
    try {
      const res = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 200) {
        console.log(res);
        setDeviceList(res.data);
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
      }
    }
  };

  const addDevice = async () => {
    const addDeviceUrl = `${API_URL}/device/create`;
    const token = getCookie("access-token"); // 쿠키에서 JWT 토큰 값을 가져온다.
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const body = {
      name: name,
      macAddress: macAddress,
    };
    const res = await axios.post(addDeviceUrl, body, { headers });
    console.log(res);
    if (res.status === 201) {
      setChanged(!changed);
    }
  };

  return (
    <>
      {modalOpen ? (
        <>
          <div className="fixed inset-0 bg-black/70 z-10">
            <div className="flex justify-center h-screen w-full items-center z-50 fixed bg-black-100">
              <div className="flex flex-col w-11/12 sm:w-5/6 lg:w-1/2 max-w-2xl mx-auto rounded-lg border border-gray-300 shadow-xl">
                <div className="flex flex-row justify-between p-6 bg-white border-b border-gray-200 rounded-tl-lg rounded-tr-lg">
                  <p className="font-Line-bd text-gray-800">デバイス追加</p>
                  <button onClick={() => setModalOpen(false)}>
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                  </button>
                </div>
                <div className="flex flex-col px-6 py-5 bg-gray-50">
                  <div className="mb-3">
                    <label className="mb-2 font-Line-bd text-gray-700">
                      名前
                    </label>
                    <input
                      onChange={(event) => setName(event.target.value)}
                      type="text"
                      className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border p-3 text-sm outline-none border-gray-200"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="mb-2 font-Line-bd text-gray-700">
                      MAC住所
                    </label>
                    <input
                      onChange={(event) => setMacAddress(event.target.value)}
                      type="text"
                      className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border p-3 text-sm outline-none border-gray-200"
                    />
                  </div>
                </div>
                <div className="flex flex-row-reverse items-center p-5 bg-white border-t border-gray-200 rounded-bl-lg rounded-br-lg">
                  <button
                    className="text-white bg-yellow-500 active:bg-yellow-200 font-Line-bd uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    onClick={() => {
                      addDevice();
                      setModalOpen(false);
                    }}
                  >
                    デバイス追加
                  </button>
                  <button
                    className="text-white bg-red-500 active:bg-red-200 font-Line-bd uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    onClick={() => setModalOpen(false)}
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
      <div className="p-4">
        <h1 className="text-gray-900 text-3xl title-font font-Line-bd mb-5 underline decoration-red-300">
          デバイス管理
        </h1>
        <button
          onClick={() => setModalOpen(true)}
          className="mb-5 text-xs bg-gray-600 font-Line-rg rounded-lg hover:bg-gray-500 text-white px-4 py-2.5 duration-300 transition-colors focus:outline-none"
        >
          デバイス登録
        </button>
        <table className="min-w-full border-collapse block md:table">
          <thead className="block md:table-header-group">
            <tr className="border border-grey-500 md:border-none block md:table-row absolute -top-full md:top-auto -left-full md:left-auto  md:relative ">
              <th className="bg-gray-600 p-2 text-white font-Line-bd md:border md:border-grey-500 text-left block md:table-cell">
                番号
              </th>
              <th className="bg-gray-600 p-2 text-white font-Line-bd md:border md:border-grey-500 text-left block md:table-cell">
                MAC住所
              </th>
              <th className="bg-gray-600 p-2 text-white font-Line-bd md:border md:border-grey-500 text-left block md:table-cell">
                名前
              </th>
              <th className="bg-gray-600 p-2 text-white font-Line-bd md:border md:border-grey-500 text-left block md:table-cell">
                ユーザー
              </th>
              <th className="bg-gray-600 p-2 text-white font-Line-bd md:border md:border-grey-500 text-left block md:table-cell">
                登録日時
              </th>
              <th className="bg-gray-600 p-2 text-white font-Line-bd md:border md:border-grey-500 text-left block md:table-cell">
                ユーザー登録日
              </th>
            </tr>
          </thead>
          <tbody className="block md:table-row-group">
            {deviceList.map((hihi: any) => {
              return (
                <tr
                  key={hihi.id}
                  className="bg-gray-100 border border-grey-500 md:border-none block md:table-row"
                >
                  <td className="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                    <span className="inline-block w-1/3 md:hidden font-bold">
                      番号
                    </span>
                    {hihi.id}
                  </td>
                  <td className="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                    <span className="inline-block w-1/3 md:hidden font-bold">
                      MAC住所
                    </span>
                    {hihi.macAddress}
                  </td>
                  <td className="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                    <span className="inline-block w-1/3 md:hidden font-bold">
                      名前
                    </span>
                    {hihi.name}
                  </td>
                  <td className="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                    <span className="inline-block w-1/3 md:hidden font-bold">
                      ユーザー
                    </span>
                    {hihi.userId}
                  </td>
                  <td className="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                    <span className="inline-block w-1/3 md:hidden font-bold">
                      登録日時
                    </span>
                    {hihi.createdAt}
                  </td>
                  <td className="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                    <span className="inline-block w-1/3 md:hidden font-bold">
                      ユーザー登録日
                    </span>
                    {hihi.updatedAt}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};
export default ManigingDeviceScreen;
