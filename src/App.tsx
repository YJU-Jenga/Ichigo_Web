import React from "react";
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
import Write from "./Screens/WriteProductInquiryScreen";
import Cart from "./Screens/CartScreen";
import Purchase from "./Screens/PurchaseScreen";

function App() {
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
          <Route path="/purchase" element={<Purchase />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
