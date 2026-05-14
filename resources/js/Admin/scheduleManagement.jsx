import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const ScheduleManagement = () => {
    // Get Doctors & Shcedule form backend
    const token = localStorage.getItem('token');
    const [doctors, setDoctors] = useState([])
    const [schedules, setSchedules] = useState([]);
    const [pagination, setPagination] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    // Fetch Doctor List
    const fetchDoctors = async () => {
        try {
            const res = await axios.get('/api/doctor/list', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setDoctors(res.data);
        } catch (err) {
            console.error("Doctor List ယူလို့မရပါ:", err);
        }
    };
    // Fetch Schedule List
    const fetchSchedules = async (page = 1) => {
        setIsLoading(true);
        try {
            const res = await axios.get(`/api/admin/schedule/index?page=${page}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setSchedules(res.data.data); // Array data
            setPagination(res.data);     // Pagination object တစ်ခုလုံး
            setCurrentPage(res.data.current_page);
        } catch (err) {
            console.error("Schedule Data error:", err);
            setError("Data ယူလို့မရပါ။");
        } finally {
            setIsLoading(false);
        }
    };
    // Doctor
    useEffect(() => {
        fetchDoctors();
    }, []);
    // Schedule
    useEffect(() => {
        fetchSchedules(currentPage);
    }, [currentPage]);
    // FormInitialState
    const formInitialState = {
        doctor_id: '',
        day_of_week: '',
        start_time: '',
        end_time: '',
        slot_duration: ''
    }
    // Day
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    // Form State
    const [formData, setFormData] = useState(formInitialState);
    const [validationError, setValidationError] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isBtnLoading, setIsBtnLoading] = useState(false);
    const [error, setError] = useState(null)
    // handleInput
    const handleInput = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }))
        if (validationError[name]) {
            setValidationError(prevError => ({
                ...prevError,
                [name]: null
            }))
        }
    }
    // Handle Edit
    const [editId, setEditId] = useState(null);
    const handleEdit = (schedule) => {
        setEditId(schedule.id);
        setFormData({
            doctor_id: schedule.doctor_id,
            day_of_week: schedule.day_of_week,
            start_time: schedule.start_time,
            end_time: schedule.end_time,
            slot_duration: schedule.slot_duration
        })
        setValidationError({});
    }
    // Reset Form
    const resetForm = () => {
        setFormData(formInitialState);
        setEditId(null);
        setValidationError({});
    }
    //  handleScheduleSubmip
    const handleScheduleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!formData.doctor_id) {
            newErrors.doctor_id = "ဆရာဝန် အမည်ရွေးပါ။";
        }
        if (!formData.day_of_week) {
            newErrors.day_of_week = "ရက်သတ္တပတ် ရွေးပါ။";
        }
        if (!formData.start_time) {
            newErrors.start_time = "စမည့်အချိန် ထည့်ပါ။";
        }
        if (!formData.end_time) {
            newErrors.end_time = "ပြီးမည့်အချိန် ထည့်ပါ။";
        }
        if (!formData.slot_duration) {
            newErrors.slot_duration = "ကြာချိန် ထည့်ပါ။";
        }
        setValidationError(newErrors);
        if (Object.keys(newErrors).length === 0) {
            setIsBtnLoading(true);
            setValidationError({});
            try {
                if (editId) {
                    const res = await axios.post(`/api/admin/schedule/edit/${editId}`, formData, { headers: { 'Authorization': `Bearer ${token}` } })
                    setSchedules(schedules.map(schedule => schedule.id === editId ? res.data.schedule : schedule));
                    toast.success("Schedule ပြင်ဆင်ပြီးပါပြီ။", { duration: 4000 });
                } else {
                    const res = await axios.post('/api/admin/schedule/store', formData, { headers: { 'Authorization': `Bearer ${token}` } })
                    setSchedules(prevSchedule => [res.data.schedule, ...prevSchedule]);
                    toast.success("Schedule အသစ် ဖန်တီးပြီးပါပြီ။", { duration: 4000 });
                }
                resetForm();
            } catch (err) {
                console.log("Create & update Error:", err);

                if (err.response && err.response.status === 422) {
                    setValidationError(err.response.data.errors);
                } else if (err.response && err.response.data && err.response.data.message) {
                    toast.error(err.response.data.message || "တစ်ခုခုမှားယွင်းနေပါသည်။", { duration: 4000 });
                } else {
                    toast.error("သိမ်းဆည်းမှု မအောင်မြင်ပါ။", { duration: 4000 });
                }
            } finally {
                setIsBtnLoading(false)
            }
        }
    }
    // Delete
    const handleDelete = async (id) => {
        if (window.confirm("Shcedule ကိုဖျက်ရန်သေချာပါသလား?")) {
            try {
                axios.post(`/api/admin/schedule/delete/${id}`, {}, { headers: { 'Authorization': `Bearer ${token}` } })
                setSchedules(schedules.filter(schedule => schedule.id !== id));
                toast.success("Shcedule ကိုဖျက်သိမ်းပြီးပါပြီ။");
            } catch (err) {
                console.error("Schedule Delet Err:", err);
                toast.error("ဖျက်သိမ်းမှုမအောင်မြင်ပါ။", { duration: 4000 });
            }
        }
    }
    return (
        <div className="container-fluid py-5 bg-light min-vh-100">
            <div className="container">
                <div className="row g-4">

                    {/* ဘယ်ဘက်ခြမ်း: Schedule ဖန်တီးမည့် Form */}
                    <div className="col-lg-4">
                        <div className="card shadow border-0 rounded-3">
                            <div className="card-header bg-primary text-white py-3">
                                <h6 className="mb-0 fw-bold">{editId ? "Edit Schedule" : "Add New Schedule"}</h6>
                            </div>
                            <div className="card-body p-4">
                                <form onSubmit={handleScheduleSubmit}>
                                    {/* 1. Doctor ID (Select Box) */}
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold text-secondary">Doctor Name</label>
                                        <select
                                            name='doctor_id'
                                            className={`form-select form-select-lg border-2 ${validationError.doctor_id ? 'is-invalid' : ''}`}
                                            style={{ fontSize: '0.9rem' }}
                                            value={formData.doctor_id}
                                            onChange={handleInput}
                                        >
                                            <option value="">Choose a doctor...</option>
                                            {doctors.map(doc => (
                                                <option key={doc.id} value={doc.id}>{doc.name}</option>
                                            ))}
                                        </select>
                                        {/* Error Message */}
                                        {validationError.doctor_id && <div className='text-danger'>{validationError.doctor_id}</div>}
                                    </div>

                                    {/* 2. Day of Week */}
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold text-secondary">Work Day</label>
                                        <select
                                            name='day_of_week'
                                            className={`form-select border-2 ${validationError.day_of_week ? 'is-invalid' : ''}`}
                                            value={formData.day_of_week}
                                            onChange={handleInput}
                                        >
                                            <option value="">Select Day</option>
                                            {days.map(day => (
                                                <option key={day} value={day}>{day}</option>
                                            ))}
                                        </select>
                                        {/* Error Message */}
                                        {validationError.day_of_week && <div className='text-danger'>{validationError.day_of_week}</div>}
                                    </div>

                                    {/* 3. Start & 4. End Time */}
                                    <div className="row g-2 mb-3">
                                        <div className="col-6">
                                            <label className="form-label small fw-bold text-secondary">Start Time</label>
                                            <input
                                                name='start_time'
                                                type="time"
                                                className={`form-control border-2 ${validationError.start_time ? 'is-invalid' : ''}`}
                                                value={formData.start_time}
                                                onChange={handleInput}
                                            />
                                            {/* Error Message */}
                                            {validationError.start_time && <div className='text-danger'>{validationError.start_time}</div>}
                                        </div>
                                        <div className="col-6">
                                            <label className="form-label small fw-bold text-secondary">End Time</label>
                                            <input
                                                name='end_time'
                                                type="time"
                                                className={`form-control border-2 ${validationError.end_time ? 'is-invalid' : ''}`}
                                                value={formData.end_time}
                                                onChange={handleInput}
                                            />
                                            {/* Error Message */}
                                            {validationError.end_time && <div className='text-danger'>{validationError.end_time}</div>}
                                        </div>
                                    </div>

                                    {/* 5. Slot Duration */}
                                    <div className="mb-4">
                                        <label className="form-label small fw-bold text-secondary">Slot Duration (Min)</label>
                                        <div className="input-group">
                                            <input
                                                name='slot_duration'
                                                type="number"
                                                className={`form-control border-2 ${validationError.slot_duration ? 'is-invalid' : ''}`}
                                                placeholder="e.g. 30"
                                                value={formData.slot_duration}
                                                onChange={handleInput}
                                            />
                                            <span className="input-group-text bg-white border-2">min</span>
                                        </div>
                                        {/* Error Message */}
                                        {validationError.slot_duration && <div className='text-danger'>{validationError.slot_duration}</div>}
                                    </div>

                                    {/* Edit & Save Button */}
                                    <div className="d-flex gap-2">
                                        {editId && <button onClick={resetForm} type="submit" className="btn btn-secondary w-100 py-2 fw-bold shadow-sm">
                                            Cancel
                                        </button>}
                                        <button type="submit" className="btn btn-primary w-100 py-2 fw-bold shadow-sm">
                                            {isBtnLoading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                                                    <span role="status">Saving...</span>
                                                </>
                                            ) : (editId ? 'Update' : 'Add New')

                                            }
                                        </button>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>

                    {/* ညာဘက်ခြမ်း: Schedule ဖော်ပြပေးမည့် Table */}
                    <div className="col-lg-8">
                        <div className="card shadow border-0 rounded-3 overflow-hidden">
                            <div className="card-header bg-white py-3 border-bottom">
                                <h6 className="mb-0 fw-bold text-dark">Current Rosters</h6>
                            </div>
                            <div className="card-body p-0">
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="bg-light">
                                            <tr>
                                                <th className="px-4 py-3 text-secondary small fw-bold">DOCTOR</th>
                                                <th className="py-3 text-secondary small fw-bold">DAY</th>
                                                <th className="py-3 text-secondary small fw-bold">TIME RANGE</th>
                                                <th className="py-3 text-secondary small fw-bold">SLOT</th>
                                                <th className="py-3 text-center text-secondary small fw-bold">ACTION</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {schedules?.map((schedule) => (
                                                <tr key={schedule.id}>
                                                    <td className="px-4 py-3">
                                                        <div className="fw-bold text-primary">{schedule.doctor?.name}</div>
                                                    </td>
                                                    <td className="py-3">
                                                        <span className="badge bg-success border">{schedule.day_of_week}</span>
                                                    </td>
                                                    <td className="py-3">
                                                        <div className="text-muted small">
                                                            <span className="fw-bold text-dark">{new Date(`2000-01-01T${schedule.start_time}`).toLocaleTimeString([], {
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                                hour12: true
                                                            })}</span> to <span className="fw-bold text-dark">{new Date(`2000-01-01T${schedule.end_time}`).toLocaleTimeString([], {
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                                hour12: true
                                                            })}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 text-muted">{schedule.slot_duration} mins</td>
                                                    <td className="py-3 d-flex gap-2">
                                                        <button onClick={() => handleEdit(schedule)} className="btn btn-sm btn-outline-primary border">
                                                            <i className="bi bi-pen"></i>
                                                        </button>
                                                        <button onClick={() => handleDelete(schedule.id)} className="btn btn-sm btn-outline-danger border">
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {isLoading ? (
                                    <div className="text-center py-5">
                                        <p className="text-danger mb-0">Loading...</p>
                                    </div>
                                ) : schedules.length === 0 ? (
                                    <div className="text-center py-5">
                                        <p className="text-danger mb-0">schedules data များမရှိပါ။</p>
                                    </div>
                                ) : error && (
                                    <div className="text-center py-5">
                                        <p className="text-danger mb-0">schedules data ယူလို့မရပါ။</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* Pagination Controls */}
                        {!isLoading && schedules.length > 0 && (
                            <div className="d-flex justify-content-between align-items-center mt-4">
                                <p className="text-muted small">
                                    Showing {pagination.from} to {pagination.to} of {pagination.total} schedules
                                </p>
                                <nav>
                                    <ul className="pagination mb-0">
                                        {/* Previous */}
                                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                            <button className="page-link" onClick={() => setCurrentPage(prev => prev - 1)}>Previous</button>
                                        </li>
                                        {/* Next */}
                                        <li className={`page-item ${currentPage === pagination.last_page ? 'disabled' : ''}`}>
                                            <button className="page-link" onClick={() => setCurrentPage(prev => prev + 1)}>Next</button>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ScheduleManagement;
