import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import Main from "./Screens/MainScreen";
import Product from "./Screens/ProductScreen";
import Itemuse from "./Screens/ItemuseScreen";
import ProductInquiry from "./Screens/ProductInquiryScreen";
import Qna from "./Screens/QnaScreen";
import Login from "./Screens/LoginScreen";
import Register from "./Screens/RegisterScreen";
import Custom from "./Screens/CustomScreen";
import Write from "./Screens/WriteScreen";
import Cart from "./Screens/CartScreen";
import { useCookies } from 'react-cookie'

function App() {
  const [cookies, setCookie, removeCookie] = useCookies();
  useEffect(()=>{
    if(localStorage.getItem('refresh-token')) {
      console.log(localStorage.getItem('refresh-token'));
      (async () => {
        try {
          const rt = localStorage.getItem('refresh-token');
          console.log("rt=",rt);
          await fetch('http://localhost:5000/auth/refresh', {
              method: 'POST',
              headers: {authorization: `Bearer ${rt}`},
              credentials: 'include',
            }).then(res=>res.json())        // 리턴값이 있으면 리턴값에 맞는 req 지정
            .then(res=> {
              console.log(res);          // 리턴값에 대한 처리
              const refreshToken = res['refresh_token'];
              // localStorage.removeItem('refresh-token');
              localStorage.setItem('refresh-token', refreshToken);
              // removeCookie('access-token')
              setCookie('access-token', res['access_token'], {maxAge: 15 * 60});
            });
        } catch (error) {
          console.log(error);
        }
      })();
    }
  },[])
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/product" element={<Product />} />
          <Route path="/itemuse" element={<Itemuse />} />
          <Route path="/productinquiry" element={<ProductInquiry />} />
          <Route path="/qna" element={<Qna />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/custom" element={<Custom />} />
          <Route path="/write" element={<Write />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;



