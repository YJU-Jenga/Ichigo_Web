import { NavLink } from "react-router-dom";
import { UserProps } from "../App";

const MyPageScreen = ({ user }: UserProps) => {
  return (
    //     "email": "client@gmail.com",
    //   "password": "1234qweR!!",
    //   "name": "client",
    //   "phone": "010-1111-1111"
    <>
      <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
        주문 관리
      </h1>
      <h1 className="text-gray-900 text-xl title-font font-medium mb-1">
        {user?.name}님 안녕하세요
      </h1>
      <NavLink
        to="/updateuser"
        className="text-white bg-red-500 font-medium py-1 px-4 border rounded-lg tracking-wide mr-1 hover:bg-red-600"
        aria-current="page"
      >
        회원정보 수정
      </NavLink>
    </>
  );
};
export default MyPageScreen;
