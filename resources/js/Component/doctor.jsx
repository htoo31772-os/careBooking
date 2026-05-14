import React from "react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
const Doctor = () => {
    const [doctors, setDoctors] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');
    useEffect(() => {
        const FetchDoctor = async () => {
            setIsLoading(true);
            try {
                const res = await axios.get('/api/doctor/list', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setDoctors(res.data)
                } catch (err) {
                console.error("fetch doctor error:", err);
                setError("Data ယူလို့မရပါ။");
            } finally {
                setIsLoading(false);
            }
        }
        FetchDoctor();
    }, [token]);
    // Like
    const handleLike = async (doctorId) => {
        if (!token) return toast.error("Like လုပ်ရန် အရင် Login ဝင်ပါ။", { duration: 4000 });
        try {
            const res = await axios.post(`/api/doctor/like/${doctorId}`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            setDoctors(prevDoctor =>
                prevDoctor.map(doc => {
                    if (doc.id === doctorId) {
                        return {
                            ...doc,
                            is_liked: res.data.is_liked,
                            likes_count: res.data.is_liked ? doc.likes_count + 1 : doc.likes_count - 1
                        }
                    }
                    return doc;
                })
            )

            if (res.data.is_liked) {
                toast.success("Liked");
            } else {
                toast.success("UnLiked");
            }
        } catch (err) {
            console.error("Like error is:", err);
            toast.error("တစ်ခုခုမှားယွင်းနေပါသည်။", { duration: 4000 });
        }
    }
    return (
        <section className="container my-5">
            <h4 className="fw-bold mb-4">လူကြိုက်များသော ဆရာဝန်များ</h4>
            <div className="row g-4">
                {isLoading ? (
                    <div className="text-danger text-center my-5">ကျေးဇူးပြုပြီး ခဏစောင့်ပေးပါ။</div>
                ) : error ? (
                    <div className="text-danger text-center my-5">{error}</div>
                ) : doctors.length === 0 ? (
                    <div className="text-danger text-center my-5">လတ်တလော ဆရာဝန်များမရှိသေးပါ။</div>
                ) : (
                    doctors.map(doctor => (
                        <div className="col-md-4" key={doctor.id}>
                            <div className="card doctor-card shadow-sm">
                                <div className="doctor-img-container">
                                    <img src={doctor.image ? `http://localhost:8000/storage/doctor/${doctor.image}` : '/images/user.jpg'} className="card-img-top" alt="Doctor" />
                                    <span className="badge-specialty">{doctor.category.name}</span>
                                </div>
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <h5 className="fw-bold mb-0">{doctor.name}</h5>
                                        <div className="text-warning small">
                                            <i className="bi bi-star-fill"></i> 4.9
                                        </div>
                                    </div>
                                    <p className="text-muted small mb-3"> အတွေ့အကြုံ({doctor.experience}နှစ်)</p>

                                    <Link to={`/doctor/detail/${doctor.id}`} className="btn btn-primary w-100 rounded-pill fw-bold mb-3">
                                        View Profile & Book
                                    </Link>

                                    <div className="interaction-bar d-flex justify-content-between">
                                        <div className={`stat-item ${doctor.is_liked ? 'text-danger fw-bold' : 'text-muted'}`} onClick={() => handleLike(doctor.id)}>
                                            <i className={`bi bi-heart${doctor.is_liked ? '-fill' : ''}`}></i>
                                            {doctor.likes_count >= 1000 ? `${(doctor.likes_count / 1000).toFixed(1)}k` : doctor.likes_count}
                                        </div>
                                        <div className="stat-item">
                                            <i className="bi bi-chat-text"></i> {doctor.reviews_count}
                                        </div>
                                        <div className="stat-item">
                                            <i className="bi bi-eye"></i> {doctor.view_count}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}
export default Doctor;
