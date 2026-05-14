import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Booking = () => {
    const navigate = useNavigate();

    // State များ သတ်မှတ်ခြင်း
    const [categories, setCategories] = useState([]); // ကဏ္ဍများ
    const [doctors, setDoctors] = useState([]); // ဆရာဝန် အားလုံး
    const [filteredDoctors, setFilteredDoctors] = useState([]); // Filter လုပ်ထားသော ဆရာဝန်များ

    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [selectedDate, setSelectedDate] = useState('');

    // ၁။ စတင်ဖွင့်ချင်း Backend မှ Data များ ဆွဲယူခြင်း
    useEffect(() => {
        const fetchBaseData = async () => {
            try {
                // မင်းရဲ့ API Routes အလိုက် ပြင်ဆင်ပါ
                const [catRes, docRes] = await Promise.all([
                    axios.get('/api/category/list'),
                    axios.get('/api/doctor/list')
                ]);
                setCategories(catRes.data);
                setDoctors(docRes.data);
                setFilteredDoctors(docRes.data); // အစပိုင်းမှာ အားလုံးပြမယ်
            } catch (err) {
                console.error("Data loading error:", err);
            }
        };
        fetchBaseData();
    }, []);

    // ၂။ ကဏ္ဍ (Category) ပြောင်းလိုက်တိုင်း ဆရာဝန်စာရင်းကို စစ်ထုတ်ခြင်း (Filtering)
    const handleCategoryChange = (e) => {
        const catId = e.target.value;
        setSelectedCategory(catId);
        setSelectedDoctor(''); // ဆရာဝန် ရွေးချယ်မှုကို reset လုပ်မယ်

        if (!catId || catId === 'all') {
            setFilteredDoctors(doctors);
        } else {
            // Category ID တူတဲ့ ဆရာဝန်တွေကိုပဲ Filter လုပ်မယ်
            const filtered = doctors.filter(doc => doc.category_id === parseInt(catId));
            setFilteredDoctors(filtered);
        }
    };

    // ၃။ ရှာဖွေမှု Logic
    const handleSearch = (e) => {
        e.preventDefault();
        if (!selectedDoctor || !selectedDate) {
            alert("ကျေးဇူးပြု၍ ဆရာဝန်နှင့် ရက်စွဲကို ရွေးချယ်ပါ။");
            return;
        }
        navigate(`/doctor/detail/${selectedDoctor}?date=${selectedDate}`);
    };

    return (
        <section className="container py-4">
            <div className="row justify-content-center">
                <div className="col-lg-11">
                    <div id="quick-booking-form" className="bg-white p-4 shadow-sm rounded-4 border">
                        <h5 className="fw-bold mb-4 text-primary">
                            <i className="bi bi-calendar-check me-2"></i>အမြန် ရက်ချိန်းယူရန်
                        </h5>

                        <form className="row g-3" onSubmit={handleSearch}>
                            {/* ကဏ္ဍ ရွေးချယ်ရန် */}
                            <div className="col-md-3">
                                <label className="form-label fw-bold text-muted small">ရောဂါ/ကဏ္ဍ ရွေးပါ</label>
                                <select
                                    className="form-select border-0 bg-light p-3 rounded-3"
                                    value={selectedCategory}
                                    onChange={handleCategoryChange}
                                >
                                    <option value="all">ကဏ္ဍ အားလုံး</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* ဆရာဝန် ရွေးချယ်ရန် */}
                            <div className="col-md-3">
                                <label className="form-label fw-bold text-muted small">ဆရာဝန် ရွေးပါ</label>
                                <select
                                    className="form-select border-0 bg-light p-3 rounded-3"
                                    value={selectedDoctor}
                                    onChange={(e) => setSelectedDoctor(e.target.value)}
                                    required
                                >
                                    <option value="">ဆရာဝန် ရွေးချယ်ရန်...</option>
                                    {filteredDoctors.map(doc => (
                                        <option key={doc.id} value={doc.id}>{doc.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* ရက်စွဲ ရွေးချယ်ရန် */}
                            <div className="col-md-3">
                                <label className="form-label fw-bold text-muted small">ရက်စွဲ</label>
                                <input
                                    type="date"
                                    className="form-control border-0 bg-light p-3 rounded-3"
                                    min={new Date().toISOString().split('T')[0]} // ယနေ့ထက် စောလို့မရအောင် ပိတ်ထားမယ်
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    required
                                />
                            </div>

                            {/* ရှာဖွေမည် ခလုတ် */}
                            <div className="col-md-3 d-flex align-items-end">
                                <button type="submit" className="btn btn-primary w-100 p-3 rounded-3 fw-bold shadow-sm hover-up">
                                    <i className="bi bi-search me-2"></i>အချိန်ဇယား ကြည့်မည်
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Booking;
