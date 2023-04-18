import Swal from "sweetalert2";
import { UserProps } from "../App";
import axios, { AxiosError } from "axios";
import { API_URL } from "../config";
import { useEffect, useState } from "react";
import { getCookie } from "../cookie";

const ManigingScreen = ({ user }: UserProps) => {
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
          text: "관리자에게 문의해주세요",
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
    const UpdateStateUrl = `${API_URL}/order/update/${id}`;
    for (let i in purchaseList) {
      if (purchaseList[i].id === id) {
        setUpdateAddress(purchaseList[i].address);
        setUpdatePostalCode(purchaseList[i].postalCode);
        setUpdateUserId(purchaseList[i].userId);
      }
    }

    const body = {
      userId: updateUserId,
      postalCode: updatePostalCode,
      address: updateAddress,
      state: true,
    };
    try {
      const res = await axios.patch(UpdateStateUrl, body, { headers });
      if (res.status === 200) {
        Swal.fire({
          icon: "success",
          text: "상태가 변경되었습니다.",
          showConfirmButton: false,
          timer: 1000,
        });
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
  console.log(purchaseList);

  return (
    <>
      <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
        주문 관리
      </h1>
      {/* address
createdAt
id
orderToProducts
postalCode
state
updatedAt
userId
*/}
      <table className="min-w-full border-collapse block md:table">
        <thead className="block md:table-header-group">
          <tr className="border border-grey-500 md:border-none block md:table-row absolute -top-full md:top-auto -left-full md:left-auto  md:relative ">
            <th className="bg-gray-600 p-2 text-white font-bold md:border md:border-grey-500 text-left block md:table-cell">
              번호
            </th>
            <th className="bg-gray-600 p-2 text-white font-bold md:border md:border-grey-500 text-left block md:table-cell">
              주문자
            </th>
            <th className="bg-gray-600 p-2 text-white font-bold md:border md:border-grey-500 text-left block md:table-cell">
              배송지
            </th>
            <th className="bg-gray-600 p-2 text-white font-bold md:border md:border-grey-500 text-left block md:table-cell">
              우편번호
            </th>
            <th className="bg-gray-600 p-2 text-white font-bold md:border md:border-grey-500 text-left block md:table-cell">
              주문상태
            </th>
            <th className="bg-gray-600 p-2 text-white font-bold md:border md:border-grey-500 text-left block md:table-cell">
              주문 상태 변경
            </th>
          </tr>
        </thead>
        <tbody className="block md:table-row-group">
          {purchaseList.map((hihi: any) => {
            return (
              <tr
                key={hihi.id}
                className="bg-gray-100 border border-grey-500 md:border-none block md:table-row"
              >
                <td className="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                  <span className="inline-block w-1/3 md:hidden font-bold">
                    번호
                  </span>
                  {hihi.id}
                </td>
                <td className="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                  <span className="inline-block w-1/3 md:hidden font-bold">
                    주문자
                  </span>
                  {hihi.userId}
                </td>
                <td className="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                  <span className="inline-block w-1/3 md:hidden font-bold">
                    배송지
                  </span>
                  {hihi.address}
                </td>
                <td className="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                  <span className="inline-block w-1/3 md:hidden font-bold">
                    우편번호
                  </span>
                  {hihi.postalCode}
                </td>
                <td className="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                  <span className="inline-block w-1/3 md:hidden font-bold">
                    주문상태
                  </span>
                  {hihi.state ? (
                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      접수됨
                    </p>
                  ) : (
                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-brown-800">
                      접수 필요
                    </p>
                  )}
                </td>
                <td className="p-2 md:border md:border-grey-500 text-left block md:table-cell">
                  <span className="inline-block w-1/3 md:hidden font-bold">
                    주문 접수
                  </span>
                  <button
                    onClick={() => {
                      updateState(hihi.id);
                    }}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 border border-blue-500 rounded"
                  >
                    접수
                  </button>
                  {/* <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 border border-red-500 rounded">
                    Delete
                  </button> */}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};
export default ManigingScreen;
