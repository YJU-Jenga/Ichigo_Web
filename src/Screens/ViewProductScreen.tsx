import React, { SyntheticEvent, useEffect, useState } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import Swal from 'sweetalert2';
import { Product } from '../dto/Product';
import { API_URL } from '../config';
import { UserProps } from '../App';
import { getCookie } from '../cookie';
import ItemUseScreen from './ItemUseScreen';

const ViewProductScreen = ({ user }: UserProps) => {
    const navigate = useNavigate();

    const userId = user?.id;

    let { id } = useParams();
    const productId = Number(id);
    console.log(typeof productId);

    // 글 상세정보를 배열에 저장
    const [productDetail, setProductDetail] = useState<Product>();

    // 렌더링 전에 정보를 먼저 가져오기 위함
    useEffect(() => {
        getProductDetail();
    }, []);

    // 글 상세정보와 댓글을 가져오기 함수
    const getProductDetail = async () => {
        const url_product = `${API_URL}/product/getOne/${productId}`;
        try {
            const res = await axios.get(url_product);
            setProductDetail(res.data);
        } catch (error) {
            if (error instanceof AxiosError) {
                Swal.fire({
                    icon: 'error',
                    title: error.response?.data.message,
                    text: '관리자에게 문의해주세요',
                    showConfirmButton: false,
                    timer: 1000,
                });
                navigate('/product');
            }
        }
    };

    const addToCart = async (e: SyntheticEvent, id: number) => {
        e.preventDefault();
        const addCartUrl = `${API_URL}/cart/addProduct`;
        const token = getCookie('access-token'); // 쿠키에서 JWT 토큰 값을 가져온다.
        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        };
        const body = {
            cartId: 1,
            productId: id,
            count: 1,
        };
        console.log(body);
        try {
            const res = await axios.post(addCartUrl, body, { headers });
            console.log(res, '시발');
            if (res.status === 201) {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: '장바구니로 이동합니다.',
                    showConfirmButton: false,
                    timer: 1000,
                });
                navigate('/cart');
            }
        } catch (error) {
            console.log(error, '시발 왜 안돼');
            if (error instanceof AxiosError) {
                Swal.fire({
                    icon: 'error',
                    title: error.response?.data.message,
                    text: '관리자에게 문의해주세요',
                    showConfirmButton: false,
                    timer: 1000,
                });
                navigate('/product');
            }
        }
    };

    const goToPurchase = async () => {
        const token = getCookie('access-token'); // 쿠키에서 JWT 토큰 값을 가져온다.
        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        };
        const CartUpdateUrl = `${API_URL}/cart/updateAddedProduct/${userId}`;
        const body = {
            productId: productId,
            count: 1,
        };
        const res = await axios.patch(CartUpdateUrl, body, { headers });
        if (res.status === 200) {
            Swal.fire({
                icon: 'success',
                text: '주문페이지로 이동합니다.',
                showConfirmButton: false,
                timer: 1000,
            });
            navigate('/purchase');
        }
    };

    if (!productDetail) {
        return <></>;
    }

    return (
        <>
            <section className="bg-white">
                <div className="container px-6 py-10 mx-auto">
                    <div className="mt-8 lg:-mx-6 lg:flex lg:items-center">
                        <img
                            className="object-cover w-full lg:mx-6 lg:w-1/2 rounded-xl h-1/2 lg:h-1/2"
                            src={`${API_URL}/${productDetail.image}`}
                            alt=""
                        />
                        <div className="mt-6 lg:w-1/2 lg:mt-0 lg:mx-6 ">
                            <p className="block mt-4 text-4xl font-bold text-gray-800">
                                {productDetail.name}
                            </p>

                            <p className="mt-3 text-gray-500 text-xl">
                                {productDetail.description}
                            </p>
                            <h1 className="py-2 text-2xl text-red-400 font-bold">
                                {productDetail.price
                                    .toString()
                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                원
                            </h1>
                            <div className="flex">
                                <button
                                    className="position: static block mt-10 w-full px-4 py-3 mx-1 font-medium tracking-wide text-center capitalize transition-colors duration-300 transform text-white bg-[#41B979] rounded-[14px]"
                                    onClick={(event) => {
                                        addToCart(event, productDetail.id);
                                    }}
                                >
                                    장바구니 담기
                                </button>
                                <NavLink
                                    to={`/custom/${productId}`}
                                    className="position: static block mt-10 w-full px-4 py-3 mx-1 font-medium tracking-wide text-center capitalize transition-colors duration-300 transform text-white bg-[#FFD400] rounded-[14px]"
                                >
                                    커스텀
                                </NavLink>
                                <button
                                    className="block mt-10 w-full px-4 py-3 mx-1 font-medium tracking-wide text-center capitalize transition-colors duration-300 transform text-white bg-[#EF6253] rounded-[14px]"
                                    onClick={() => {
                                        goToPurchase();
                                    }}
                                >
                                    구매하기
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <hr className="mb-10" />
            <section className="grid place-items-center">
                <h1 className="text-gray-900 text-3xl title-font font-bold mb-1 mx-10 underline decoration-red-300">
                    상품 후기
                </h1>
                <ItemUseScreen user={undefined} />
            </section>
        </>
    );
};

export default ViewProductScreen;
