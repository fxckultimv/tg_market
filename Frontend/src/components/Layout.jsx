import { NavLink, Outlet } from 'react-router-dom'

import CustomLink from './CastomLink'
import { useBackButton } from '@tma.js/sdk-react'
import { useEffect } from 'react'
import Home from '../assets/home.svg'
import List from '../assets/list.svg'
import Add from '../assets/add.svg'
import Basket from '../assets/basket.svg'
import Profile from '../assets/profile.svg'

const Layout = () => {
    //   const backButton = useBackButton();

    //   useEffect(() => {
    //     const handleBackClick = () => {
    //       window.history.back();
    //     };

    //     const isRootPage = window.location.pathname === "/";

    //     if (backButton && isRootPage) {
    //       backButton.show();
    //       backButton.on("click", handleBackClick);

    //       return () => {
    //         backButton.hide();
    //         backButton.off("click", handleBackClick);
    //       };
    //     }
    //   }, [backButton]);

    return (
        <div className="flex min-h-screen flex-col bg-dark-gray text-white">
            <header className="flex justify-around bg-medium-gray shadow-lg">
                <CustomLink to="/">
                    <img src={Home} alt="home" />
                </CustomLink>
                <CustomLink to="/channels">
                    <img src={List} alt="list" />
                </CustomLink>
                <CustomLink to="/create-ad">
                    <img src={Add} alt="add" />
                </CustomLink>
                <CustomLink to="/basket">
                    <img src={Basket} alt="basket" />
                </CustomLink>
                <CustomLink to="/profile">
                    <img src={Profile} alt="profile" />
                </CustomLink>
            </header>
            <Outlet></Outlet>
        </div>
    )
}

export default Layout
