import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import Main from './Screens/MainScreen';
import Product from './Screens/ProductScreen';
import ItemUse from './Screens/ItemUseScreen';
import ProductInquiry from './Screens/ProductInquiryScreen';
import Qna from './Screens/QnaScreen';
import Login from './Screens/LoginScreen';
import Register from './Screens/RegisterScreen';
import Custom from './Screens/CustomScreen';
import WriteProductInquiry from './Screens/WriteProductInquiryScreen';
import WriteQna from './Screens/WriteQnaScreen';
import Cart from './Screens/CartScreen';
import Purchase from './Screens/PurchaseScreen';
import ViewPost from './Screens/ViewPostScreen';
import UpdateProductInquiryScreen from './Screens/UpdateProductInquiryScreen';
import AddProductScreen from './Screens/AddProductScreen';
import { useCookies } from 'react-cookie';
import jwt_decode from 'jwt-decode';
import axios, { AxiosError } from 'axios';
import CalendarScreen from './Screens/CalendarScreen';
import ErrorScreen from './Screens/ErrorScreen';
import ManigingScreen from './Screens/ManigingScreen';
import MyPageScreen from './Screens/MyPageScreen';
import UpdateUserScreen from './Screens/UpdateUserScreen';
import { API_URL } from './config';
import ViewProductScreen from './Screens/ViewProductScreen';

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
            const userCookie = JSON.parse(JSON.stringify(jwt_decode(cookies['access-token'])));
            const url = `${API_URL}/user/${userCookie.email}`;
            const headers = {
                'Content-Type': 'application/json',
                authorization: `Bearer ${cookies['access-token']}`,
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

    useEffect(() => {
        if (localStorage.getItem('refresh-token')) {
            console.log(localStorage.getItem('refresh-token'));
            (async () => {
                try {
                    const rt = localStorage.getItem('refresh-token');
                    console.log('rt=', rt);
                    await fetch(`${API_URL}/auth/refresh`, {
                        method: 'POST',
                        headers: { authorization: `Bearer ${rt}` },
                        credentials: 'include',
                    })
                        .then((res) => res.json()) // 리턴값이 있으면 리턴값에 맞는 req 지정
                        .then((res) => {
                            console.log(res); // 리턴값에 대한 처리
                            const refreshToken = res['refresh_token'];
                            // localStorage.removeItem('refresh-token');
                            localStorage.setItem('refresh-token', refreshToken);
                            // removeCookie('access-token')
                            setCookie('access-token', res['access_token'], { maxAge: 15 * 60 });
                        });
                } catch (error) {
                    console.log(error);
                }
            })();
        }
    }, []);

    return (
        <>
            <BrowserRouter>
                <Navbar user={user} />
                <Routes>
                    <Route path="/" element={<Main />} />
                    <Route path="/product" element={<Product user={user} />} />
                    <Route path="/itemuse" element={<ItemUse user={user} />} />
                    <Route path="/productinquiry" element={<ProductInquiry user={user} />} />
                    <Route path="/qna" element={<Qna user={user} />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/custom" element={<Custom user={user} />} />
                    <Route
                        path="/write_product_inquiury"
                        element={<WriteProductInquiry user={user} />}
                    />
                    <Route path="/write_q&a" element={<WriteQna user={user} />} />
                    {/* <Route path="/write_item_use" element={<WriteItemUse user={user} />} /> */}
                    <Route path="/cart" element={<Cart user={user} />} />
                    <Route path="/purchase" element={<Purchase user={user} />} />
                    <Route path="/viewpost/:id" element={<ViewPost user={user} />} />
                    <Route
                        path="/updateproductinquiry/:id"
                        element={<UpdateProductInquiryScreen user={user} />}
                    />
                    <Route path="/addproduct" element={<AddProductScreen user={user} />} />
                    <Route path="/calendar" element={<CalendarScreen user={user} />} />
                    <Route path="/maniging" element={<ManigingScreen user={user} />} />
                    <Route path="/mypage" element={<MyPageScreen user={user} />} />
                    <Route path="/viewproduct/:id" element={<ViewProductScreen user={user} />} />
                    <Route path="/updateuser" element={<UpdateUserScreen user={user} />} />
                    <Route path="/*" element={<ErrorScreen />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
