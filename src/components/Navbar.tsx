import { NavLink, useLocation } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { UserProps } from '../App';
import { API_URL } from '../config';
import { useEffect, useState } from 'react';
import classNames from 'classnames';

export function Navbar({ user }: UserProps) {
    const [cookies, setCookie, removeCookie] = useCookies();
    const [checked, setChecked] = useState(true);
    const [menuToggle, setMenuToggle] = useState(false);
    const location = useLocation();

    const refreshToken = () => {
        if (localStorage.getItem('refresh-token')) {
            (async () => {
                try {
                    const rt = localStorage.getItem('refresh-token');

                    await fetch(`${API_URL}/auth/refresh`, {
                        method: 'POST',
                        headers: { authorization: `Bearer ${rt}` },
                        credentials: 'include',
                    })
                        .then((res) => res.json()) // 리턴값이 있으면 리턴값에 맞는 req 지정
                        .then((res) => {
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
    };

    useEffect(() => {
        refreshToken();
    }, [location]);

    useEffect(() => {
        refreshToken();
    }, []);

    const logout = async () => {
        try {
            await fetch(`${API_URL}/auth/logout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            }).then(() => {
                removeCookie('access-token');
                localStorage.removeItem('refresh-token');
            });
            window.location.replace('/');
        } catch (error) {}
    };
    let signIn, join, signOut, nickname;

    if (user == undefined) {
        signIn = (
            <div>
                <NavLink
                    to="/login"
                    className="zIndex:1 lg:p-4 py-3 px-0 block border-b-2 border-transparent hover:border-red-300 font-bold"
                    aria-current="page"
                >
                    로그인
                </NavLink>
            </div>
        );
        join = (
            <div>
                <NavLink
                    to="/register"
                    className="zIndex:1 lg:p-4 py-3 px-0 block border-b-2 border-transparent hover:border-red-300 font-bold"
                    aria-current="page"
                >
                    회원가입
                </NavLink>
            </div>
        );
    } else {
        nickname = (
            <div className="zIndex:1 lg:p-4 py-3 px-0 block border-b-2 border-transparent hover:border-red-300 font-bold">
                {user.name}님
            </div>
        );
        signOut = (
            <div>
                <NavLink
                    to="/"
                    className="zIndex:1 lg:p-4 py-3 px-0 block border-b-2 border-transparent hover:border-red-300 font-bold"
                    aria-current="page"
                    onClick={logout}
                >
                    로그아웃
                </NavLink>
            </div>
        );
    }

    return (
        <nav className="">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between">
                    {/* 메뉴1 */}
                    <div className="flex space-x-4">
                        <div className="hidden md:flex items-center space-x-1">
                            <NavLink
                                to="/"
                                className="zIndex:1 lg:p-4 py-3 px-0 block border-b-2 border-transparent hover:border-red-300"
                                aria-current="page"
                            >
                                Home
                            </NavLink>
                            <NavLink
                                to="/product"
                                className="zIndex:1 lg:p-4 py-3 px-0 block border-b-2 border-transparent hover:border-red-300"
                                aria-current="page"
                            >
                                상품
                            </NavLink>
                            <NavLink
                                to="/productinquiry"
                                className="zIndex:1 lg:p-4 py-3 px-0 block border-b-2 border-transparent hover:border-red-300"
                                aria-current="page"
                            >
                                상품 문의
                            </NavLink>
                            <NavLink
                                to="/qna"
                                className="zIndex:1 lg:p-4 py-3 px-0 block border-b-2 border-transparent hover:border-red-300"
                                aria-current="page"
                            >
                                Q&A
                            </NavLink>
                            {user ? (
                                <NavLink
                                    to="/calendar"
                                    className="zIndex:1 lg:p-4 py-3 px-0 block border-b-2 border-transparent hover:border-red-300"
                                    aria-current="page"
                                >
                                    캘린더
                                </NavLink>
                            ) : null}
                            {user !== undefined ? (
                                <NavLink
                                    to="/custom"
                                    className="zIndex:1 lg:p-4 py-3 px-0 block border-b-2 border-transparent hover:border-red-300"
                                    aria-current="page"
                                >
                                    커스터마이징
                                </NavLink>
                            ) : null}
                            {user?.permission ? (
                                <NavLink
                                    to="/maniging"
                                    className="zIndex:1 lg:p-4 py-3 px-0 block border-b-2 border-transparent hover:border-red-300"
                                    aria-current="page"
                                >
                                    주문관리
                                </NavLink>
                            ) : null}
                            {user ? (
                                <NavLink
                                    to="/mypage"
                                    className="zIndex:1 lg:p-4 py-3 px-0 block border-b-2 border-transparent hover:border-red-300"
                                    aria-current="page"
                                >
                                    마이페이지
                                </NavLink>
                            ) : null}
                            {user ? (
                                <NavLink
                                    to="/cart"
                                    className="zIndex:1 lg:p-4 py-3 px-0 block border-b-2 border-transparent hover:border-red-300"
                                    aria-current="page"
                                >
                                    장바구니
                                </NavLink>
                            ) : null}
                        </div>
                    </div>

                    {/* 로그인, 회원가입 */}
                    <div className="hidden md:flex items-center space-x-1">
                        {signIn}
                        {join}
                        {nickname}
                        {signOut}
                    </div>

                    {/* 모바일 메뉴 */}
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setMenuToggle(!menuToggle)}>
                            {menuToggle ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-8 w-8"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-8 w-8"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* mobile menu items */}
            <div className={classNames('md:hidden', { hidden: !menuToggle })}>
                <NavLink
                    to="/"
                    className="zIndex:1 border-b-2 border-transparent hover:border-red-300 block py-2 px-4"
                    aria-current="page"
                    onClick={() => setMenuToggle(!menuToggle)}
                >
                    Home
                </NavLink>
                <NavLink
                    to="/product"
                    className="zIndex:1 border-b-2 border-transparent hover:border-red-300 block py-2 px-4"
                    aria-current="page"
                    onClick={() => setMenuToggle(!menuToggle)}
                >
                    상품
                </NavLink>
                <NavLink
                    to="/productinquiry"
                    className="zIndex:1 border-b-2 border-transparent hover:border-red-300 block py-2 px-4"
                    aria-current="page"
                    onClick={() => setMenuToggle(!menuToggle)}
                >
                    상품 문의
                </NavLink>
                <NavLink
                    to="/qna"
                    className="zIndex:1 border-b-2 border-transparent hover:border-red-300 block py-2 px-4"
                    aria-current="page"
                    onClick={() => setMenuToggle(!menuToggle)}
                >
                    Q&A
                </NavLink>
                {user ? (
                    <NavLink
                        to="/calendar"
                        className="zIndex:1 border-b-2 border-transparent hover:border-red-300 block py-2 px-4"
                        aria-current="page"
                        onClick={() => setMenuToggle(!menuToggle)}
                    >
                        캘린더
                    </NavLink>
                ) : null}
                {user !== undefined ? (
                    <NavLink
                        to="/custom"
                        className="zIndex:1 border-b-2 border-transparent hover:border-red-300 block py-2 px-4"
                        aria-current="page"
                        onClick={() => setMenuToggle(!menuToggle)}
                    >
                        커스터마이징
                    </NavLink>
                ) : null}
                {user?.permission ? (
                    <NavLink
                        to="/maniging"
                        className="zIndex:1 border-b-2 border-transparent hover:border-red-300 block py-2 px-4"
                        aria-current="page"
                        onClick={() => setMenuToggle(!menuToggle)}
                    >
                        주문관리
                    </NavLink>
                ) : null}
                {user ? (
                    <NavLink
                        to="/mypage"
                        className="zIndex:1 border-b-2 border-transparent hover:border-red-300 block py-2 px-4"
                        aria-current="page"
                        onClick={() => setMenuToggle(!menuToggle)}
                    >
                        마이페이지
                    </NavLink>
                ) : null}
                {user ? (
                    <NavLink
                        to="/cart"
                        className="zIndex:1 border-b-2 border-transparent hover:border-red-300 block py-2 px-4"
                        aria-current="page"
                        onClick={() => setMenuToggle(!menuToggle)}
                    >
                        장바구니
                    </NavLink>
                ) : null}
            </div>
            <div className={classNames('md:hidden', { hidden: !menuToggle })}>
                {signIn}
                {join}
                {nickname}
                {signOut}
            </div>
        </nav>
    );
}
