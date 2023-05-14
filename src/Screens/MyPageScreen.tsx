import { NavLink } from "react-router-dom";
import { UserProps } from "../App";

const MyPageScreen = ({ user }: UserProps) => {
  return (
    //     "email": "client@gmail.com",
    //   "password": "1234qweR!!",
    //   "name": "client",
    //   "phone": "010-1111-1111"
    <div>
      <aside className="flex flex-col w-64 h-screen px-5 py-8 overflow-y-auto bg-white border-r rtl:border-r-0 rtl:border-l">
        <h1 className="mx-2 font-medium text-gray-600">
          {user?.name}님의 마이페이지
        </h1>
        <div className="flex flex-col justify-between flex-1 mt-6">
          <nav className="-mx-3 space-y-6 ">
            <div className="space-y-3 ">
              <NavLink
                to={"/updateuser"}
                className="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg hover:bg-gray-100 hover:text-gray-700"
              >
                <span className="mx-2 text-sm font-medium">회원정보 수정</span>
              </NavLink>

              <a
                className="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg hover:bg-gray-100 hover:text-gray-700"
                href="#"
              >
                <span className="mx-2 text-sm font-medium">상품후기 쓰기</span>
              </a>
            </div>
          </nav>
        </div>
      </aside>
    </div>
  );
};
export default MyPageScreen;
