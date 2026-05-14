import React from "react";
import HeroSection from "../Component/hero";
import Booking from "../Component/booking";
import Categories from "../Component/category";
import Doctor from "../Component/doctor";
import Navbar from "./navbar";
const Home = ({ user, setUser, setIsLoggedIn, isLoggedIn }) => {
    return (
        <>
            <Navbar user={user} setUser={setUser} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            <HeroSection />
            <Booking />
            <Categories />
            <Doctor />
        </>
    )
}
export default Home;
