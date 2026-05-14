import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
const BookingDetail = () => {
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const res = await axios.get('/api/booking/list', { headers: { 'Authorization': `Bearer ${token}` } });
                setBookings(res.data);
            } catch (err) {
                console.error("Booking error:", err);
                setError("Data ယူလို့မရပါ။");
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, []);
    // Cancel Booking
    const handleCancel = async (bookingId) => {
        if (!token) return;
        if (window.confirm('ဒီရက်ချိန်းကို ပယ်ဖျက်ချင်ပါသလား?')) {
            try {
                const res = await axios.post(`/api/booking/cancel/${bookingId}`, {}, { headers: { 'Authorization': `Bearer ${token}` } })
                toast.success("ရက်ချိန်းကို ပယ်ဖျက်လိုက်ပါပြီ။", { duration: 4000 })
                setBookings(bookings.map(b => b.id === bookingId ? res.data : b));
            } catch (err) {
                console.error("Cancle error is:", err);
                toast.error("ပယ်ဖျက်၍ မရပါ။ တစ်ခုခု မှားယွင်းနေပါသည်။", { duration: 4000 })
            }
        }
    }
    return (
        <div className="container my-5">
            <div className="row g-4">
                {/* Sidebar Menu */}
                <div className="col-lg-3">
                    <div id="dashboard-sidebar" className="shadow-sm bg-primary text-light p-3">
                        <h6 className="text-muted fw-bold mb-2 ms-2">Menu</h6>
                        <Link to="/profile" className="nav-link-custom text-light me-2">
                            <i className="bi bi-person-circle"></i> Profile
                        </Link>
                        <Link href="/profile/booking" className="nav-link-custom text-light active">
                            <i className="bi bi-calendar-check"></i> My Bookings
                        </Link>
                    </div>
                </div>

                {/* Bookings Content */}
                <div className="col-lg-9">
                    <h4 className="fw-bold mb-4">Booking တင်ထားသော ရက်ချိန်းများ</h4>

                    {/* Booking Card 1 */}
                    {
                        isLoading ? (
                            <div className="text-danger text-center my-5">Loading....</div>
                        ) : error ? (
                            <div className="text-danger text-center my-5">{error}</div>
                        ) : bookings.length > 0 ? (
                            bookings.map(booking => (
                                <div key={booking.id} className="booking-card">
                                    <div className="d-flex align-items-center gap-3">
                                        <img src={booking.doctor?.image ? `http://localhost:8000/storage/doctor/${booking.doctor.image}` : '/images/user.jpg'} className="rounded-circle" style={{ width: 60 }} alt="Dr" />
                                        <div>
                                            <h6 className="fw-bold mb-1">{booking.doctor.name}</h6>
                                            <p className="text-muted small mb-0">{booking.doctor.expertise} - {new Date(booking.booking_date).toLocaleDateString('en-GB', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}</p>
                                            <p className="text-primary small fw-bold">{new Date(`2024-01-01T${booking.booking_time}`).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: true
                                            })} </p>
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <span className={`status-badge mb-2 d-block ${booking.status === 'pending' ? 'bg-warning-subtle text-warning' :
                                                booking.status === 'cancelled' ? 'bg-danger-subtle text-danger' :
                                                    'bg-success-subtle text-success'
                                            }`}>
                                            {booking.status}
                                        </span>
                                        {booking.status === 'pending' ? (
                                            <button
                                                onClick={() => handleCancel(booking.id)}
                                                className="btn btn-outline-danger rounded-pill px-4 fw-bold btn-sm"
                                            >
                                                Cancel
                                            </button>
                                        ) : (
                                            <span className="text-muted small italic text-decoration-line-through">
                                                No actions available
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-danger text-center my-5">Booking ယူထားခြင်းမရှိပါ။</div>
                        )
                    }
                </div>
            </div>
        </div>
    );
}
export default BookingDetail;
