import axios from "axios";
import React from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
const Navbar = ({ isLoggedIn, setIsLoggedIn, user, setUser }) => {
    const handleLogout = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            return;
        }
        try {
            await axios.post('/api/logout', {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            localStorage.removeItem('token');
            setUser(null);
            setIsLoggedIn(false);
            window.location.href = "/login";
            toast.success('Logout အောင်မြင်ပါသည်။', { duration: 4000 })
        } catch (err) {
            console.error(err);
            localStorage.clear();
            window.location.href = "/login";
        }
    }
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white sticky-top shadow-sm">
            <div className="container">
                <a className="navbar-brand fw-bold text-primary fs-3" href="index.html">CareBooking</a>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navContent"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navContent">
                    <div className="ms-auto d-flex align-items-center">
                        {isLoggedIn ? (
                            <>
                                {user?.role === 'admin' && (
                                    <Link to="/admin/dashboard" className="nav-link fw-bold me-3 text-dark d-flex align-items-center">
                                        <i className="bi bi-speedometer2 me-1"></i> Dashboard
                                    </Link>
                                )}
                                <div className="dropdown">
                                    <a
                                        href="#"
                                        className="d-flex align-items-center text-decoration-none dropdown-toggle"
                                        id="userDropdown"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        <img
                                            src={user?.profile_photo ? `http://localhost:8000/storage/user/${user.profile_photo}` : "images/user.jpg"}
                                            alt="mdo"
                                            width="35"
                                            height="35"
                                            className="rounded-circle border me-1"
                                        />
                                    </a>
                                    <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2">
                                        <li>
                                            <h6 className="dropdown-header">Manage Account</h6>
                                        </li>
                                        <li>
                                            <Link className="dropdown-item py-2" to="/profile">
                                                <i className="bi bi-person me-2"></i> My Profile
                                            </Link>
                                        </li>
                                        <li>
                                            <hr className="dropdown-divider" />
                                        </li>
                                        <li>
                                            <button onClick={handleLogout} className="dropdown-item py-2 text-danger">
                                                <i className="bi bi-box-arrow-right me-2"></i> Logout
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-link text-decoration-none text-dark fw-bold me-2">Login</Link>
                                <Link to="/register" className="btn btn-primary btn-rounded fw-bold me-3">Register</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
export default Navbar;
