import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import Comment from '../Component/comment';

const DoctorDetail = ({ isLoggedIn, user }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(false);
    const [timeSlots, setTimeSlots] = useState([]);
    const [selectSlot, setSelectSlot] = useState(null);
    const [selectDate, setSelectDate] = useState("");
    const [isBtnLoading, setIsBtnLoading] = useState(false)
    const [searchParams] = useSearchParams();
    const dateForUrl = searchParams.get('date');
    // Modal ကို ပိတ်ရန်အတွက် Ref သုံးခြင်း
    const closeBtnRef = useRef(null);
    // ၁။ Backend API မှ အချက်အလက် လှမ်းယူခြင်း
    useEffect(() => {
        const fetchDoctor = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`/api/doctor/detail/${id}?date=${dateForUrl}`);
                setDoctor(response.data);
                // For Schedule
                if (dateForUrl) {
                    setSelectDate(dateForUrl);
                }
            } catch (error) {
                console.error("Error fetching doctor info:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDoctor();
    }, [id, dateForUrl]);
    // Select Date
    useEffect(() => {
        if (selectDate && doctor?.schedule) {
            const dateObj = new Date(selectDate);
            const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const dayName = dayNames[dateObj.getDay()];
            const matchSchdeule = doctor.schedule.find(s => s.day_of_week === dayName);
            if (matchSchdeule) {
                const slot = generateSlots(matchSchdeule);
                setTimeSlots(slot)
            } else[
                setTimeSlots([])
            ]
            setSelectSlot(null);
        }
    }, [selectDate, doctor])
    // GenerateSlots
    const generateSlots = (schedule) => {
        const slots = [];
        let current = new Date(`2024-01-01T${schedule.start_time}`);
        const end = new Date(`2024-01-01T${schedule.end_time}`);
        const duration = parseInt(schedule.slot_duration);

        while (current < end) {
            const timeString = current.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            })
            slots.push(timeString);

            current.setMinutes(current.getMinutes() + duration);
        }
        return slots;
    }
    // Handle Reset
    const handleReset = () => {
        setFormData({ message: '' })
        setSelectDate("")
        setSelectSlot(null)
    }
    // Booking Form တင်ခြင်း
    const token = localStorage.getItem('token');
    const [formData, setFormData] = useState({ message: "" });
    const handleBookingSumbit = async (e) => {
        e.preventDefault();
        if (!token) {
            toast.error("Booking တင်ရန် အရင်ဆုံး Login ဝင်ပေးပါ။", { duration: 4000 });
            navigate('/login');
            return;
        }
        if (!selectSlot || !selectDate) {
            toast.error("ရက်စွဲနှင့် အချိန်ကို အရင်ရွေးချယ်ပါ။", { duration: 4000 });
            return;
        }
        setIsBtnLoading(true);
        const bookingPayload = {
            doctor_id: doctor.id,
            booking_date: selectDate,
            booking_time: selectSlot,
            message: formData.message
        }
        try {
            const response = await axios.post('/api/booking/store', bookingPayload, { headers: { 'Authorization': `Bearer ${token}` } })
            toast.success("Booking တင်ပြီးပါပြီ။", { duration: 4000 });
            const modalElement = document.getElementById('patientInfoModal');
            const modal = bootstrap.Modal.getInstance(modalElement);
            if (modal) {
                modal.hide();
            }
            // Reset form
            handleReset();
            setSelectSlot(null);
            setSelectDate("")

        } catch (err) {
            toast.error(err.response?.data?.message || "Booking မအောင်မြင်ပါ။", { duration: 4000 });
        } finally {
            setIsBtnLoading(false)
        }
    }

    if (loading) return <div className="text-center py-5">ခေတ္တစောင့်ဆိုင်းပါ...</div>;
    if (!doctor) return <div className="text-center py-5">ဒေတာ မရှိပါ။</div>;
    return (
        <div className="container my-5">
            <div className="row g-4">
                {/* Left Column: Doctor Profile & Reviews */}
                <div className="col-lg-8">
                    <div id="doctor-profile-card" className="card p-4 shadow-sm mb-4">
                        <div className="row align-items-center">
                            <div className="col-md-4 text-center">
                                <img
                                    src={doctor?.image ? `http://localhost:8000/storage/doctor/${doctor.image}` : "/images/user.jpg"}
                                    className="img-fluid rounded-4 shadow-sm"
                                    alt="Doctor Profile"
                                />
                            </div>
                            <div className="col-md-8">
                                <div className="d-flex justify-content-between align-items-start">
                                    <div>
                                        <h2 className="fw-bold mb-1">{doctor.name}</h2>
                                        <p className="text-primary fw-bold fs-5">{doctor.category.name}</p>
                                    </div>
                                </div>
                                <p className="text-muted">
                                    {doctor.bio}
                                </p>
                                <div className="d-flex gap-2">
                                    <span className="badge bg-primary-subtle text-primary p-2 px-3 rounded-pill">
                                        Expertise: {doctor.expertise}
                                    </span>
                                    <span className="badge bg-info-subtle text-info p-2 px-3 rounded-pill">
                                        Experience: {doctor.experience}နှစ်
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Comment */}
                    <Comment isLoggedIn={isLoggedIn} doctorId={doctor.id} />
                </div>

                {/* Right Column: Booking Widget */}
                <div className="col-lg-4">
                    <div id="booking-widget" className="card p-4 bg-white shadow-sm rounded-4 sticky-top" style={{ top: '20px' }}>
                        <h5 className="fw-bold mb-4">Booking အချိန်ယူရန်</h5>

                        <div className="mb-4">
                            <label className="form-label fw-bold small">၁။ ရက်စွဲရွေးချယ်ပါ</label>
                            <input type="date" id="calendar-input" value={selectDate} min={new Date().toISOString().split("T")[0]} onChange={(e) => setSelectDate(e.target.value)} className="form-control mb-2" />
                        </div>

                        <div className="mb-4">
                            <label className="form-label fw-bold small">၂။ အားလပ်သည့် အချိန်ရွေးပါ</label>
                            <div className="row g-2">
                                {timeSlots.length > 0 ? (
                                    timeSlots.map((time, index) => (
                                        < div className="col-6" key={index}>
                                            <button className={`btn w-100 fw-bold py-2 rounded-3 border-2 ${selectSlot === time
                                                ? 'btn-primary border-primary shadow'
                                                : 'btn-outline-primary'
                                                }`} onClick={() => setSelectSlot(time)}>{time}</button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-12">
                                        <p className="text-muted text-center small">{selectDate ? "ယနေ့အတွက် အချိန်ဇယားမရှိပါ။" : "ရက်စွဲကို အရင်ရွေးပေးပါ။"}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <hr className="my-4" />
                        <div className="d-flex justify-content-between mb-4">
                            <span className="fw-bold">ကုသစရိတ်:</span>
                            <span className="text-primary fw-bold">{doctor.fee} MMK</span>
                        </div>
                        {user.role !== 'admin' && <button
                            className="btn btn-primary w-100 py-3 rounded-pill fw-bold shadow"
                            data-bs-toggle="modal"
                            data-bs-target="#patientInfoModal"
                        >
                            ဆက်လက်လုပ်ဆောင်မည်
                        </button>}

                    </div>
                </div>
            </div>

            {/* Patient Info Modal */}
            <div className="modal fade" id="patientInfoModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content border-0 rounded-4 shadow-lg p-3">
                        <div className="modal-body">
                            <h5 className="fw-bold mb-4">လူနာအချက်အလက် ဖြည့်သွင်းပါ</h5>
                            <form onSubmit={handleBookingSumbit}>
                                <label className="form-label small fw-bold">ရောဂါလက္ခဏာ (သို့မဟုတ်) သိလိုသည်များ</label>
                                <textarea
                                    className="form-control mb-4 p-3 bg-light border-0"
                                    rows="3"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    placeholder="ဆရာဝန်ထံ ပေးပို့လိုသည့် စာတို..."
                                    required
                                ></textarea>
                                <div className="d-flex gap-2">
                                    <button
                                        type="button"
                                        className="btn btn-light flex-grow-1 p-3 fw-bold rounded-3"
                                        data-bs-dismiss="modal"
                                        onClick={handleReset}
                                    >
                                        ပယ်ဖျက်မည်
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary flex-grow-1 p-3 fw-bold rounded-3"
                                        disabled={isBtnLoading}
                                    >
                                        {isBtnLoading ? "အတည်ပြုနေသည်..." : "Booking တင်မည်"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default DoctorDetail;
