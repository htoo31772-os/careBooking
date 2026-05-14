import './bootstrap';
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Home from './Layout/home';
import './../css/app.css';
import Register from './MainPage/register';
import Login from './MainPage/login';
import Profile from './MainPage/profile';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './Component/protectedRoute';
import AdminLayout from './Admin/layout';
import AdminDashboard from './Admin/dashboard';
import UserManagement from './Admin/userManagement';
import CategoryManagement from './Admin/categoryManagement';
import BookingManagement from './Admin/bookingManagement';
import DoctorManagement from './Admin/doctorManagement';
import UserDtail from './Admin/userDetail';
import DoctorDetail from './MainPage/doctorDetail';
import ScheduleManagement from './Admin/scheduleManagement';
import Booking from './Component/booking';
import BookingDetail from './MainPage/bookingDetail';
const MainRouter = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    useEffect(() => {
        const saveUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (saveUser) {
            setUser(JSON.parse(saveUser));
        }
        if (token) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, []);
    return (
        <BrowserRouter>
            <Toaster />
            <Routes>
                <Route path='/' element={<Home user={user} setUser={setUser} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
                <Route path='/register' element={
                    !isLoggedIn ? <Register setIsLoggedIn={setIsLoggedIn} setUser={setUser} /> : <Navigate to="/" replace />}
                />
                <Route path='/login' element={!isLoggedIn ? <Login setIsLoggedIn={setIsLoggedIn} setUser={setUser} /> : <Navigate to="/" replace />}
                />
                <Route path='/profile' element={isLoggedIn ? <Profile setUser={setUser} user={user} /> : <Navigate to="/" replace />} />
                <Route path='/profile/booking' element={isLoggedIn ? <BookingDetail /> : <Navigate to="/" replace />} />
                <Route path='/doctor/detail/:id' element={<DoctorDetail isLoggedIn={isLoggedIn} user={user} />} />
                {/* Admin */}
                <Route path='/admin' element={<ProtectedRoute isAllowed={isLoggedIn && user.role === "admin"} />}>
                    <Route element={<AdminLayout user={user} />}>
                        <Route index element={<AdminDashboard />} />
                        <Route path='dashboard' element={<AdminDashboard user={user} />} />
                        <Route path='user-Management' element={<UserManagement />} />
                        <Route path='user-Management/user-detail/:id' element={<UserDtail />} />
                        <Route path='schedule-Management' element={<ScheduleManagement />} />
                        <Route path='category-Management' element={<CategoryManagement />} />
                        <Route path='booking-Management' element={<BookingManagement />} />
                        <Route path='doctor-Management' element={<DoctorManagement />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}
createRoot(document.getElementById('root')).render(<MainRouter />)
