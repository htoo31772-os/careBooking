import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
const UserDtail = () => {
    const { id } = useParams();
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');
    useEffect(() => {
        const FetchUser = async () => {
            setIsLoading(true);
            try {
                const res = await axios.get(`/api/admin/user/show/${id}`, { headers: { 'Authorization': `Bearer ${token}` } });
                setUserData(res.data);
            } catch (err) {
                toast.error("အချက်အလက်များ ဆွဲယူမရပါ။", { duration: 4000 });
                setError("အချက်အလက်များ ဆွဲယူမရပါ။");
            } finally {
                setIsLoading(false);
            }
        }
        FetchUser();
    }, [id])
    if (isLoading) {
        return <div className="text-center text-danger my-5">Loading...</div>
    }
    if (error) {
        return <div className="text-center text-danger my-5">{error}</div>
    }
    return (
        <div className="container my-5">
            <div className="row justify-content-center">
                <div className="col-lg-10">
                    {/* Header with Back Button */}
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <Link to="/admin/user-Management" className="btn btn-outline-secondary rounded-pill">
                            <i className="bi bi-arrow-left"></i> Back to List
                        </Link>
                    </div>

                    <div className="row g-4">
                        {/* Left: User Profile Card */}
                        <div className="col-md-4">
                            <div className="card border-0 shadow-sm text-center p-4 h-100 rounded-4">
                                <img
                                    src={userData?.profile_photo ? `http://localhost:8000/storage/user/${userData.profile_photo}` : '/images/user.jpg'}
                                    className="rounded-circle mx-auto mb-3 shadow-sm"
                                    style={{ width: "150px", height: "150px", objectFit: "cover", border: "4px solid #f8f9fa" }}
                                    alt="User"
                                />
                                <h5 className="fw-bold mb-1">{userData?.name}</h5>
                                <span className="badge bg-soft-primary text-primary rounded-pill px-3 mb-3">
                                    {userData?.role || 'User'}
                                </span>
                                <p className="text-muted small">{userData?.email}</p>
                            </div>
                        </div>

                        {/* Right: Detailed Information */}
                        <div className="col-md-8">
                            <div className="card border-0 shadow-sm p-4 h-100 rounded-4">
                                <h5 className="fw-bold mb-4">User Details</h5>
                                <div className="row g-3">
                                    <div className="col-6">
                                        <label className="text-muted small d-block">Full Name</label>
                                        <p className="fw-semibold border-bottom pb-2">{userData?.name}</p>
                                    </div>
                                    <div className="col-6">
                                        <label className="text-muted small d-block">Email Address</label>
                                        <p className="fw-semibold border-bottom pb-2">{userData?.email}</p>
                                    </div>
                                    <div className="col-6">
                                        <label className="text-muted small d-block">Phone Number</label>
                                        <p className="fw-semibold border-bottom pb-2">{userData?.phone || "Not Provided"}</p>
                                    </div>
                                    <div className="col-6">
                                        <label className="text-muted small d-block">Date of Birth</label>
                                        <p className="fw-semibold border-bottom pb-2">{userData?.date_of_birth || "Not Provided"}</p>
                                    </div>
                                    <div className="col-12">
                                        <label className="text-muted small d-block">Address</label>
                                        <p className="fw-semibold border-bottom pb-2">{userData?.address || "No address record found."}</p>
                                    </div>
                                    <div className="col-6">
                                        <label className="text-muted small d-block">Joined Date</label>
                                        <p className="fw-semibold">{new Date(userData?.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default UserDtail;
