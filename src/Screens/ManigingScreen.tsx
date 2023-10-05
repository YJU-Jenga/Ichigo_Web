import Swal from "sweetalert2";
import { UserProps } from "../App";
import axios, { AxiosError } from "axios";
import { API_URL } from "../config";
import { useEffect, useState } from "react";
import { getCookie } from "../cookie";
import { useNavigate } from "react-router-dom";

const ManigingScreen = ({ user }: UserProps) => {
  const navigate = useNavigate();
  const [purchaseList, setPurchaseList] = useState<Array<any>>([]);
  const [updateAddress, setUpdateAddress] = useState("");
  const [updatePostalCode, setUpdatePostalCode] = useState("");
  const [updateUserId, setUpdateUserId] = useState(0);
  // 유저 정보를 가져와 봅시다 음호호
  useEffect(() => {
    getCartList();
  }, []);

  const getCartList = async () => {
    const token = getCookie("access-token"); // 쿠키에서 JWT 토큰 값을 가져온다.
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    const url = `${API_URL}/order/findAll`;
    try {
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 200) {
        console.log(res);
        setPurchaseList(res.data);
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
      }
    }
  };

  const updateState = async (id: number) => {
    const token = getCookie("access-token"); // 쿠키에서 JWT 토큰 값을 가져온다.
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    console.log(headers);
    const UpdateStateUrl = `${API_URL}/order/update/${id}`;
    for (let i in purchaseList) {
      if (purchaseList[i].id === id) {
        setUpdateAddress(purchaseList[i].address);
        setUpdatePostalCode(purchaseList[i].postalCode);
        setUpdateUserId(purchaseList[i].userId);
      }
    }

    try {
      const body = {
        userId: updateUserId,
        postalCode: updatePostalCode,
        address: updateAddress,
        state: true,
      };
      const res = await axios.patch(UpdateStateUrl, body, { headers });
      if (res.status === 200) {
        Swal.fire({
          icon: "success",
          text: "ステータスが変更されました",
          showConfirmButton: false,
          timer: 1000,
        });
        window.location.reload();
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
      }
    }
  };
  console.log(purchaseList);

  return (
    <div className="p-4">
      <h1 className="text-gray-900 text-3xl title-font font-Line-bd mb-5 underline decoration-red-300">
        注文管理
      </h1>
      <table className="min-w-full border-collapse block md:table">
        <thead className="block md:table-header-group">
          <tr className="border border-grey-500 md:border-none block md:table-row absolute -top-full md:top-auto -left-full md:left-auto  md:relative ">
            <th className="bg-gray-200 p-2 font-Line-bd md:border md:border-grey-500 text-left block md:table-cell underline decoration-red-300">
              番号
            </th>
            <th className="bg-gray-200 p-2 font-Line-bd md:border md:border-grey-500 text-left block md:table-cell underline decoration-red-300">
              注文者
            </th>
            <th className="bg-gray-200 p-2 font-Line-bd md:border md:border-grey-500 text-left block md:table-cell underline decoration-red-300">
              配送先
            </th>
            <th className="bg-gray-200 p-2 font-Line-bd md:border md:border-grey-500 text-left block md:table-cell underline decoration-red-300">
              郵便番号
            </th>
            <th className="bg-gray-200 p-2 font-Line-bd md:border md:border-grey-500 text-left block md:table-cell underline decoration-red-300">
              注文状態
            </th>
            <th className="bg-gray-200 p-2 font-Line-bd md:border md:border-grey-500 text-left block md:table-cell underline decoration-red-300">
              注文状態変更
            </th>
          </tr>
        </thead>
        <tbody className="block md:table-row-group">
          {purchaseList.map((hihi: any) => {
            return (
              <tr
                key={hihi.id}
                className="bg-white border border-grey-500 md:border-none block md:table-row"
              >
                <td className="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                  <span className="inline-block w-1/3 md:hidden font-bold">
                    番号
                  </span>
                  {hihi.id}
                </td>
                <td className="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                  <span className="inline-block w-1/3 md:hidden font-bold">
                    注文者
                  </span>
                  {hihi.userId}
                </td>
                <td className="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                  <span className="inline-block w-1/3 md:hidden font-bold">
                    配送先
                  </span>
                  {hihi.address}
                </td>
                <td className="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                  <span className="inline-block w-1/3 md:hidden font-bold">
                    郵便番号
                  </span>
                  {hihi.postalCode}
                </td>
                <td className="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                  <span className="inline-block w-1/3 md:hidden font-bold">
                    注文状態
                  </span>
                  {hihi.state ? (
                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      受付された
                    </p>
                  ) : (
                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-brown-800">
                      受付必要
                    </p>
                  )}
                </td>
                <td className="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                  <span className="inline-block w-1/3 md:hidden font-bold">
                    注文受け付ける
                  </span>
                  <button
                    onClick={() => {
                      updateState(hihi.id);
                    }}
                    className="bg-red-300 hover:bg-red-200 text-white font-Line-bd py-1 px-2 rounded"
                  >
                    受け付ける
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
export default ManigingScreen;
