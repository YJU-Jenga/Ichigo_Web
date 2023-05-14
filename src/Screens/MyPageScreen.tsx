import { NavLink } from "react-router-dom";
import { UserProps } from "../App";

const MyPageScreen = ({ user }: UserProps) => {
  return (
    //     "email": "client@gmail.com",
    //   "password": "1234qweR!!",
    //   "name": "client",
    //   "phone": "010-1111-1111"
    <div>
      <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
        {user?.name}님의 마이페이지
      </h1>
      <aside className="flex flex-col w-64 h-screen px-5 py-8 overflow-y-auto bg-white border-r rtl:border-r-0 rtl:border-l">
        <div className="flex flex-col justify-between flex-1 mt-6">
          <nav className="-mx-3 space-y-6 ">
            <div className="space-y-3 ">
              <a
                className="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg hover:bg-gray-100 hover:text-gray-700"
                href="#"
              >
                <span className="mx-2 text-sm font-medium">Dashboard</span>
              </a>

              <a
                className="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg hover:bg-gray-100 hover:text-gray-700"
                href="#"
              >
                <span className="mx-2 text-sm font-medium">Preformance</span>
              </a>
            </div>
          </nav>
        </div>
      </aside>
      <NavLink
        to="/updateuser"
        className="text-white bg-red-500 font-medium py-1 px-4 border rounded-lg tracking-wide mr-1 hover:bg-red-600"
        aria-current="page"
      >
        회원정보 수정
      </NavLink>
      <button>상품후기 쓰기</button>
    </div>
  );
};
export default MyPageScreen;
