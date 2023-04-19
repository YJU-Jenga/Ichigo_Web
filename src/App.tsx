import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import Main from "./Screens/MainScreen";
import Product from "./Screens/ProductScreen";
// import Itemuse from "./Screens/ItemuseScreen";
import ProductInquiry from "./Screens/ProductInquiryScreen";
import Qna from "./Screens/QnaScreen";
import Login from "./Screens/LoginScreen";
import Register from "./Screens/RegisterScreen";
import Custom from "./Screens/CustomScreen";
import WriteProductInquiry from "./Screens/WriteProductInquiryScreen";
import WriteQna from "./Screens/WriteQnaScreen";
import Cart from "./Screens/CartScreen";
import Purchase from "./Screens/PurchaseScreen";
import ViewPost from "./Screens/ViewPostScreen";
import UpdateProductInquiryScreen from "./Screens/UpdateProductInquiryScreen";
import AddProductScreen from "./Screens/AddProductScreen";
import { useCookies } from "react-cookie";
import jwt_decode from "jwt-decode";
import axios, { AxiosError } from "axios";
import CalendarScreen from "./Screens/CalendarScreen";
import ErrorScreen from "./Screens/ErrorScreen";
import ManigingScreen from "./Screens/ManigingScreen";
import MyPageScreen from "./Screens/MyPageScreen";
import UpdateUserScreen from "./Screens/UpdateUserScreen";
import { API_URL } from "./config";

export interface User {
  id: number;
  email: string;
  name: string;
  permission: boolean;
  phone: string;
}

export interface UserProps {
  user: User | undefined;
}

function App() {
  const [cookies, setCookie, removeCookie] = useCookies();
  const [user, setUser] = useState<User>();

  const getUser = async () => {
    try {
      const userCookie = JSON.parse(
        JSON.stringify(jwt_decode(cookies["access-token"]))
      );
      const url = `${API_URL}/user/${userCookie.email}`;
      const headers = {
        "Content-Type": "application/json",
        authorization: `Bearer ${cookies["access-token"]}`,
      };
      const res = await axios.get(url, { headers });
      const userData = res.data;
      setUser(userData);
    } catch (error) {
      if (error instanceof AxiosError) {
        alert(error.response?.data.message);
      }
    }
  };

  useEffect(() => {
    getUser();
  }, [user?.id]);

  return (
    <>
      <BrowserRouter>
        <Navbar user={user} />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/product" element={<Product user={user} />} />
          {/* <Route path="/itemuse" element={<Itemuse />} /> */}
          <Route
            path="/productinquiry"
            element={<ProductInquiry user={user} />}
          />
          <Route path="/qna" element={<Qna user={user} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/custom" element={<Custom user={user} />} />
          <Route
            path="/write_product_inquiury"
            element={<WriteProductInquiry user={user} />}
          />
          <Route path="/write_q&a" element={<WriteQna user={user} />} />
          <Route path="/cart" element={<Cart user={user} />} />
          <Route path="/purchase" element={<Purchase user={user} />} />
          <Route path="/viewpost/:id" element={<ViewPost user={user} />} />
          <Route
            path="/updateproductinquiry/:id"
            element={<UpdateProductInquiryScreen user={user} />}
          />
          <Route
            path="/addproduct"
            element={<AddProductScreen user={user} />}
          />
          <Route path="/calendar" element={<CalendarScreen user={user} />} />
          <Route path="/maniging" element={<ManigingScreen user={user} />} />
          <Route path="/mypage" element={<MyPageScreen user={user} />} />
          <Route
            path="/updateuser"
            element={<UpdateUserScreen user={user} />}
          />
          <Route path="/*" element={<ErrorScreen />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
