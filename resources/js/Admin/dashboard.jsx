import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
const AdminDashboard = () => {
    const [state, setState] = useState({
        patients: 0,
        today_booking: 0,
        doctors: 0,
        categories: 0
    })
    const [appointment, setAppointment] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const token = localStorage.getItem('token');
    // Get Data form backend
    useEffect(() => {
        const fetctData = async () => {
            try {
                const res = await axios.get('/api/admin/dashboard', { headers: { 'Authorization': `Bearer ${token}` } });
                setState(res.data.status);
                setAppointment(res.data.recentAppointments);
            } catch (error) {
                console.error("Dashboard Fetch Error:", err);
                toast.error("ဒေတာများ ရယူ၍ မရပါ။", { duration: 4000 })
            } finally {
                setIsLoading(false)
            }
        }
        fetctData();
    }, []);
    // Loading
    if (isLoading) return <div className="p-5 text-center">Loading Dashboard...</div>;
    return (
        <div className="p-4">
            {/* Statistics Row */}
            <div className="row g-4 mb-4">
                <div className="col-md-3">
                    <div className="stat-card bg-white text-center p-3 shadow-sm rounded-3">
                        <div className="text-primary mb-2 fs-3">
                            <i className="bi bi-people"></i>
                        </div>
                        <h4 className="fw-bold">{state.users}</h4>
                        <p className="text-muted small mb-0">Total Patients</p>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="stat-card bg-white text-center p-3 shadow-sm rounded-3">
                        <div className="text-success mb-2 fs-3">
                            <i className="bi bi-calendar-check"></i>
                        </div>
                        <h4 className="fw-bold">{state.bookings}</h4>
                        <p className="text-muted small mb-0">Today's Bookings</p>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="stat-card bg-white text-center p-3 shadow-sm rounded-3">
                        <div className="text-info mb-2 fs-3">
                            <i className="bi bi-person-badge"></i>
                        </div>
                        <h4 className="fw-bold">{state.doctors}</h4>
                        <p className="text-muted small mb-0">Active Doctors</p>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="stat-card bg-white text-center p-3 shadow-sm rounded-3">
                        <div className="text-warning mb-2 fs-3">
                            <i class="bi bi-card-checklist"></i>
                        </div>
                        <h4 className="fw-bold">{state.categories}</h4>
                        <p className="text-muted small mb-0">Category</p>
                    </div>
                </div>
            </div>

            {/* Appointments Table Card */}
            <div className="card border-0 shadow-sm p-4 rounded-4">
                <h5 className="fw-bold mb-4">Recent Appointments</h5>
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="bg-light">
                            <tr>
                                <th>Patient</th>
                                <th>Doctor</th>
                                <th>Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointment.length > 0 ? (
                                appointment.map(booking => (
                                    <tr key={booking.id}>
                                        <td>{booking.user.name}</td>
                                        <td>{booking.doctor.name}</td>
                                        <td>{new Date(booking.booking_date).toLocaleDateString('en-GB', {
                                            month: 'short',
                                            day: '2-digit',
                                            year: 'numeric'
                                        })}</td>
                                        <td>
                                            <span className={`badge px-3 py-2 rounded-pill ${booking.status === 'pending' ? 'bg-warning-subtle text-warning' :
                                                booking.status === 'cancelled' ? 'bg-danger-subtle text-danger' :
                                                    'bg-success-subtle text-success'
                                                }`}>
                                                {booking.status.toUpperCase()}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td>လတ်တလော Booking များမရှိသေးပါ။</td></tr>
                            )}

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
export default AdminDashboard;
