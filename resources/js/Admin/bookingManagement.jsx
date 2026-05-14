import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const BookingManagement = () => {
    const token = localStorage.getItem('token');

    // Data States
    const [bookingList, setBookingList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pagination, setPagination] = useState({});
    const [currentPage, setCurrentPage] = useState(1);

    // Filter States
    const [filterDate, setFilterDate] = useState("");
    const [filterStatus, setFilterStatus] = useState("All Status");

    // Get Data From Backend with Filters
    const fetchBookingList = async (page = 1) => {
        setIsLoading(true);
        try {
            // Filter parameters များကို query string အဖြစ် ပြင်ဆင်ခြင်း
            let url = `/api/admin/booking/index?page=${page}`;
            if (filterDate) url += `&date=${filterDate}`;
            if (filterStatus !== "All Status") url += `&status=${filterStatus.toLowerCase()}`;

            const res = await axios.get(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            setBookingList(res.data.data);
            setPagination(res.data);
            setCurrentPage(res.data.current_page);
        } catch (err) {
            console.error("Booking Error:", err);
            toast.error("ဒေတာဆွဲယူရာတွင် အမှားအယွင်းရှိပါသည်။");
        } finally {
            setIsLoading(false);
        }
    };

    // Initial Load & Page Change
    useEffect(() => {
        fetchBookingList(currentPage);
    }, [currentPage]);

    // Filter Handler
    const handleFilterSubmit = (e) => {
        e.preventDefault();
        setCurrentPage(1); // Filter လုပ်ရင် ပထမဆုံးစာမျက်နှာကနေ ပြန်စမယ်
        fetchBookingList(1);
    };
    // Confirm Booking
    const handleConfirm = async (bookingId) => {
        if (!token) return;
        try {
            const res = await axios.post(`/api/admin/booking/confirm/${bookingId}`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            // Update state with confirmed data
            setBookingList(bookingList.map(b => b.id === bookingId ? (res.data.booking || res.data) : b));
            toast.success("Booking ကို အတည်ပြုပြီးပါပြီ။");
        } catch (err) {
            toast.error("အတည်ပြုရန် အမှားအယွင်းရှိနေပါသည်။");
        }
    };

    // Delete Booking
    const handleDelete = async (bookingId) => {
        if (!token) return;
        if (!window.confirm('ဤ Booking ကို ဖျက်ရန် သေချာပါသလား?')) return;

        try {
            await axios.delete(`/api/admin/booking/delete/${bookingId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setBookingList(bookingList.filter(b => b.id !== bookingId));
            toast.success("ဖျက်သိမ်းပြီးပါပြီ။");
        } catch (err) {
            toast.error('ဖျက်၍မရပါ။');
        }
    };

    return (
        <div className="p-4 bg-light min-vh-100">
            <h4 className="fw-bold m-0 text-dark mb-4">
                <i className="bi bi-calendar-check me-2"></i>All Bookings
            </h4>

            {/* Filter Section */}
            <div className="card border-0 shadow-sm mb-4 rounded-3 overflow-hidden">
                <div className="card-body p-4 bg-white">
                    <form className="row g-3 align-items-end" onSubmit={handleFilterSubmit}>
                        <div className="col-md-3">
                            <label className="form-label small fw-bold text-muted">ရက်စွဲဖြင့် ရှာရန်</label>
                            <input
                                type="date"
                                className="form-control border-light-subtle"
                                value={filterDate}
                                onChange={(e) => setFilterDate(e.target.value)}
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label small fw-bold text-muted">အခြေအနေ (Status)</label>
                            <select
                                className="form-select border-light-subtle"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option>All Status</option>
                                <option>Pending</option>
                                <option>Confirmed</option>
                                <option>Cancelled</option>
                            </select>
                        </div>
                        <div className="col-md-3">
                            <button type="submit" className="btn btn-dark w-100 fw-bold py-2 shadow-sm">
                                <i className="bi bi-search me-2"></i>Filter Now
                            </button>
                        </div>
                        <div className="col-md-2">
                            <button
                                type="button"
                                className="btn btn-light w-100 py-2"
                                onClick={() => {
                                    setFilterDate("");
                                    setFilterStatus("All Status");
                                    setCurrentPage(1);
                                    fetchBookingList(1);
                                }}
                            >
                                Reset
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Booking Table Card */}
            <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light text-muted small fw-bold">
                            <tr>
                                <th className="ps-4">ID</th>
                                <th>PATIENT NAME</th>
                                <th>DOCTOR NAME</th>
                                <th>DATE & TIME</th>
                                <th>STATUS</th>
                                <th className="text-end pe-4">ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan='6' className='text-center py-5 text-muted italic'>
                                        <div className="spinner-border spinner-border-sm me-2"></div>
                                        ဒေတာများ ဆွဲယူနေဆဲဖြစ်သည်...
                                    </td>
                                </tr>
                            ) : bookingList.length === 0 ? (
                                <tr>
                                    <td colSpan='6' className='text-center py-5 text-danger'>
                                        <i className="bi bi-exclamation-circle me-2"></i>
                                        လတ်တလော Booking များ မရှိသေးပါ။
                                    </td>
                                </tr>
                            ) : (
                                bookingList.map(booking => (
                                    <tr key={booking.id}>
                                        <td className="ps-4 fw-bold text-muted">#{booking.id}</td>
                                        <td>
                                            <div className="fw-bold">{booking.user?.name || 'Unknown User'}</div>
                                            <small className="text-muted">{booking.user?.phone}</small>
                                        </td>
                                        <td>
                                            <div className="text-primary fw-bold">Dr. {booking.doctor?.name}</div>
                                        </td>
                                        <td>
                                            <div className="fw-bold">
                                                {new Date(booking.booking_date).toLocaleDateString('en-GB', {
                                                    day: 'numeric', month: 'short', year: 'numeric'
                                                })}
                                            </div>
                                            <small className="text-muted bg-light px-2 rounded">
                                                {booking.booking_time}
                                            </small>
                                        </td>
                                        <td>
                                            <span className={`badge px-3 py-2 rounded-pill ${booking.status === 'pending' ? 'bg-warning-subtle text-warning' :
                                                booking.status === 'cancelled' ? 'bg-danger-subtle text-danger' :
                                                    'bg-success-subtle text-success'
                                                }`}>
                                                {booking.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="text-end pe-4">
                                            <div className="d-flex justify-content-end gap-2">
                                                {booking.status === 'pending' && (
                                                    <button
                                                        className="btn btn-sm btn-success rounded-3 px-3 shadow-sm"
                                                        onClick={() => handleConfirm(booking.id)}
                                                        title="Confirm Booking"
                                                    >
                                                        <i className="bi bi-check-circle me-1"></i> Confirm
                                                    </button>
                                                )}
                                                <button
                                                    className="btn btn-sm btn-outline-danger border-0 rounded-3"
                                                    onClick={() => handleDelete(booking.id)}
                                                    disabled={booking.status === 'pending'} // Pending ဖြစ်နေရင် ဖျက်ခွင့်မပေးသေးတာ ပိုကောင်းတယ် (သို့မဟုတ် Admin ယူဆချက်အလိုက်)
                                                    title="Delete Record"
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Enhanced Pagination */}
                {!isLoading && bookingList.length > 0 && (
                    <div className="card-footer bg-white p-3 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 border-0">
                        <p className="text-muted small mb-0">
                            Showing <strong>{pagination.from}</strong> to <strong>{pagination.to}</strong> of <strong>{pagination.total}</strong> bookings
                        </p>
                        <nav>
                            <ul className="pagination pagination-sm mb-0">
                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                    <button className="page-link border-0" onClick={() => setCurrentPage(1)}>First</button>
                                </li>
                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                    <button className="page-link border-0" onClick={() => setCurrentPage(prev => prev - 1)}>
                                        <i className="bi bi-chevron-left"></i>
                                    </button>
                                </li>

                                <li className="page-item active">
                                    <span className="page-link border-0">{currentPage} / {pagination.last_page}</span>
                                </li>

                                <li className={`page-item ${currentPage === pagination.last_page ? 'disabled' : ''}`}>
                                    <button className="page-link border-0" onClick={() => setCurrentPage(prev => prev + 1)}>
                                        <i className="bi bi-chevron-right"></i>
                                    </button>
                                </li>
                                <li className={`page-item ${currentPage === pagination.last_page ? 'disabled' : ''}`}>
                                    <button className="page-link border-0" onClick={() => setCurrentPage(pagination.last_page)}>Last</button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                )}
            </div>
        </div >
    );
};

export default BookingManagement;
