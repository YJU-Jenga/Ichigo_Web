import {
  BrowserRouter,
  NavLink,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { UserProps } from "../App";
import { useEffect, useState } from "react";
import { API_URL } from "../config";
import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";
import { getCookie } from "../cookie";

const MyPageScreen = ({ user }: UserProps) => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [orderList, setOrderList] = useState<Array<any>>([]);
  const orders: any[] = [];

  useEffect(() => {
    getOrderList();
  }, []);

  // 로그인한 사용자가 구입한 상품이 있는지 확인, 구입하고 구매확정되면 후기버튼 활성화
  // 우선 주문조회
  const getOrderList = async () => {
    const url = `${API_URL}/order/findAll`;
    const token = getCookie("access-token"); // 쿠키에서 JWT 토큰 값을 가져온다.
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    try {
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrderList(res.data);
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
  console.log(orderList);
  console.log(user);
  for (let i in orderList) {
    if (user?.id === orderList[i]?.userId) {
      orders.push({
        id: orderList[i]?.id,
        userId: orderList[i]?.userId,
        state: orderList[i]?.state,
        updatedAt: orderList[i]?.updatedAt,
      });
    }
  }
  return (
    <Tabs
      selectedIndex={index}
      onSelect={(index: number) => setIndex(index)}
      className="flex flex-row"
    >
      <aside className="flex flex-col w-64 h-screen px-5 py-8 overflow-y-auto bg-white border-r rtl:border-r-0 rtl:border-l">
        <h1 className="mx-2 font-semibold text-gray-600">
          {user?.name}님의 마이페이지
        </h1>
        <div className="flex flex-col justify-between flex-1 mt-6">
          <nav className="-mx-3 space-y-6 ">
            <TabList className="space-y-3 ">
              <Tab className="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg hover:bg-gray-100 hover:text-gray-700">
                회원정보 수정
              </Tab>
              <Tab className="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg hover:bg-gray-100 hover:text-gray-700">
                구매 내역
              </Tab>
            </TabList>
          </nav>
        </div>
      </aside>
      <div className="w-full h-100% grid place-items-center bg-gray-100">
        <TabPanel className="w-full h-full">
          <div className="flex flex-col w-11/12 sm:w-5/6 lg:w-1/2 max-w-2xl mx-auto rounded-lg border border-gray-300 shadow-xl">
            <div className="flex flex-row justify-between p-6 bg-white border-b border-gray-200 rounded-tl-lg rounded-tr-lg">
              <p className="font-semibold text-gray-800">회원정보 수정</p>
            </div>
            <div className="flex flex-col px-6 py-5 bg-gray-50">
              <div className="mb-3">
                <label className="mb-2 font-semibold text-gray-700">이름</label>
                <input
                  type="text"
                  defaultValue={user?.name}
                  className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border p-3 text-sm outline-none border-gray-200"
                />
              </div>
              <div className="mb-3">
                <label className="mb-2 font-semibold text-gray-700">
                  이메일
                </label>
                <input
                  type="text"
                  defaultValue={user?.email}
                  className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border p-3 text-sm outline-none border-gray-200"
                />
              </div>
              <div className="mb-3">
                <label className="mb-2 font-semibold text-gray-700">
                  전화번호
                </label>
                <input
                  type="text"
                  defaultValue={user?.phone}
                  className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border p-3 text-sm outline-none border-gray-200"
                />
              </div>
            </div>
            <div className="flex flex-row-reverse items-center p-5 bg-white border-t border-gray-200 rounded-bl-lg rounded-br-lg">
              <button
                className="text-white bg-yellow-500 active:bg-yellow-200 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                type="button"
              >
                회원정보 수정
              </button>
              <button
                className="text-white bg-red-500 active:bg-red-200 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                type="button"
              >
                취소
              </button>
            </div>
          </div>
        </TabPanel>
        <TabPanel className="w-full h-full">
          <>
            <div className="w-3/4 container mx-auto px-4 sm:px-8">
              <div className="py-8">
                <div>
                  <h2 className="text-2xl font-semibold leading-tight">
                    구매내역
                  </h2>
                </div>
                <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                  <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
                    <table className="min-w-full leading-normal">
                      <thead>
                        <tr>
                          <th className="px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg">
                            상품정보
                          </th>
                          <th className="px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg">
                            구매 / 구매확정일
                          </th>
                          <th className="px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg">
                            구매후기
                          </th>
                        </tr>
                      </thead>
                      {orders.map((order) => {
                        return (
                          <tbody key={order?.id}>
                            <tr>
                              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm w-2/5">
                                <div className="flex items-center justify-center pr-6">
                                  <div className="flex-shrink-0 w-10 h-10 hidden sm:table-cell">
                                    <img
                                      className="w-full h-full rounded-full"
                                      src="https://images.unsplash.com/photo-1601046668428-94ea13437736?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2167&q=80"
                                      alt=""
                                    />
                                  </div>
                                  <div className="ml-3">
                                    <p className="text-gray-900 whitespace-no-wrap text-center text-l">
                                      테드
                                    </p>
                                    <p className="text-gray-900 whitespace-no-wrap text-center text-l">
                                      1,000원 / *개
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-5 py-5 border-b border-gray-200 bg-white">
                                <p className="text-gray-900 whitespace-no-wrap text-center">
                                  {order?.updatedAt.substr(0, 10)}
                                </p>
                              </td>
                              <td className="px-5 py-5 bg-white flex items-center justify-center border-b border-gray-200">
                                {order?.state ? (
                                  <button
                                    className="text-white bg-green-500 hover:bg-green-400 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                                    type="button"
                                    onClick={() => {
                                      navigate("/write_item_use");
                                    }}
                                  >
                                    후기작성
                                  </button>
                                ) : (
                                  <button
                                    className="text-white bg-green-500 hover:bg-green-400 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                                    type="button"
                                    onClick={() => {
                                      Swal.fire({
                                        position: "center",
                                        icon: "warning",
                                        title:
                                          "아직 상품 후기를 작성할 수 없습니다",
                                        showConfirmButton: false,
                                        timer: 1000,
                                      });
                                    }}
                                  >
                                    후기작성
                                  </button>
                                )}
                              </td>
                            </tr>
                          </tbody>
                        );
                      })}
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </>
        </TabPanel>
      </div>
    </Tabs>
  );
};
export default MyPageScreen;
