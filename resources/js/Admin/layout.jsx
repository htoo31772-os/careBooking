import React from "react";
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import "../../css/admin.css";
const AdminLayout = ({ user }) => {
    return (
        <div className="d-flex">
            {/* Sidebar */}
            <div id="sidebar" style={{ minWidth: '250px', height: '100vh', backgroundColor: '#212529' }}>
                <div className="p-4">
                    <h3 className="fw-bold text-white mb-4 text-center">
                        <Link to="/" className="text-decoration-none">CareAdmin</Link>
                    </h3>

                    <hr className="text-secondary" />
                </div>
                <nav className="nav flex-column">
                    <Link to="/admin/dashboard" className="nav-link text-white active py-3 px-4">
                        <i className="bi bi-speedometer2 me-2"></i> Dashboard
                    </Link>
                     <Link to="/admin/category-Management" className="nav-link text-white-50 py-3 px-4">
                        <i className="bi bi-grid me-2"></i> Categories
                    </Link>
                    <Link to="/admin/doctor-Management" className="nav-link text-white-50 py-3 px-4">
                        <i className="bi bi-person-badge me-2"></i> Doctors
                    </Link>
                    <Link to="/admin/schedule-Management" className="nav-link text-white-50 py-3 px-4">
                        <i className="bi bi-calendar-date me-2"></i> Add Schedule
                    </Link>
                    <Link to="/admin/booking-Management" className="nav-link text-white-50 py-3 px-4">
                        <i className="bi bi-calendar-event me-2"></i> Booking List
                    </Link>
                    <Link to="/admin/user-Management" className="nav-link text-white-50 py-3 px-4">
                        <i className="bi bi-people me-2"></i> User Management
                    </Link>
                </nav>
            </div>

            {/* Main Content Area */}
            <div id="main-content" className="flex-grow-1 bg-light">
                {/* Top Navbar */}
                <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom p-3">
                    <div className="container-fluid">
                        <span className="navbar-text fw-bold">System Overview</span>
                        <div className="ms-auto d-flex align-items-center gap-3">
                            <span className="small fw-bold">Admin:{user.name}</span>
                            <img
                                src={user?.profile_photo ? `http://localhost:8000/storage/user/${user.profile_photo}` : "images/user.jpg"}
                                className="rounded-circle"
                                alt="Admin Profile"
                                width="35"
                                height="35"
                            />
                        </div>
                    </div>
                </nav>

                <Outlet />
            </div>
        </div>
    );
}
export default AdminLayout;
