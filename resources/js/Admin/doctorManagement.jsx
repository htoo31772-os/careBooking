import React, { useEffect, useState } from "react";
import AddDoctorModal from "./addDoctorModal";
import axios from "axios";
import toast from "react-hot-toast";
const DoctorManagement = () => {
    const token = localStorage.getItem('token');
    const [doctors, setDoctors] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedDoctor, setSelectedDoctor] = useState(null)
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [docRes, speRes] = await Promise.all([
                axios.get('/api/admin/doctor/index', { headers: { 'Authorization': `Bearer ${token}` } }),
                axios.get('/api/admin/category/index', { headers: { 'Authorization': `Bearer ${token}` } })
            ]);
            setDoctors(docRes.data);
            setCategories(speRes.data);
        } catch (err) {
            console.error("Doctor & Category err:", err);
            toast.error("Data ယူလို့မရပါ။");
        } finally {
            setIsLoading(false);
        }
    }
    useEffect(() => { fetchData(); }, [])
    // Handle Edit
    const handleEdit = (doctor) => {
        setSelectedDoctor(doctor);
    };
    const handleDelete = async (id) => {
        if (window.confirm("ဆရာဝန်ဖျက်ရန်သေချာပါသလား?")) {
            try {
                await axios.post(`/api/admin/doctor/delete/${id}`, {}, { headers: { 'Authorization': `Bearer ${token}` } })
                setDoctors(doctors.filter(doctor => doctor.id !== id));
                toast.success("ဖျက်သိမ်းမှုအောင်မြင်ပါသည်။", { duration: 4000 });
            } catch (err) {
                console.error("Doctor Delete err:", err);
                toast.error("ဖျက်သိမ်းမှု မအောင်မြင်ပါ။");
            }
        }
    }
    return (
        <div className="p-4">
            {/* Header with Add Button */}
            <div className="d-flex justify-content-between align-items-center my-4">
                <h4 className="fw-bold">Doctor Management</h4>
                <button
                    className="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#addDoctorModal"
                >
                    + Add New Doctor
                </button>
            </div>

            {/* Doctor List Table */}
            <div className="card border-0 shadow-sm p-4 text-center">
                <div className="table-responsive">
                    <table className="table align-middle">
                        <thead className="bg-light">
                            <tr>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Specialty</th>
                                <th>Experience</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="5" className="text-center text-danger py-4">Loading...</td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan="5" className="text-center text-danger py-4">Data ယူလို့မရပါ။</td>
                                </tr>
                            ) : doctors.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center text-danger py-4"> Data မရှိသေးပါ။</td>
                                </tr>
                            ) : (
                                doctors?.map(doctor => (
                                    <tr key={doctor.id}>
                                        <td>
                                            <img
                                                src={doctor?.image ? `http://localhost:8000/storage/doctor/${doctor.image}` : "/images/user.jpg"}
                                                className="rounded-circle"
                                                alt="Doctor"
                                                style={{ width: 40 }}
                                            />
                                        </td>
                                        <td>{doctor.name}</td>
                                        <td>{doctor.category.name}</td>
                                        <td>{doctor.experience}နှစ်</td>
                                        <td>
                                            <div className="d-flex justify-content-center gap-2">
                                                <button onClick={() => handleEdit(doctor)} data-bs-toggle="modal"
                                                    data-bs-target="#addDoctorModal" className="btn btn-sm btn-info text-white">Edit</button>
                                                <button onClick={() => handleDelete(doctor.id)} className="btn btn-sm btn-danger">Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}

                        </tbody>
                    </table>
                </div>
            </div>
            <AddDoctorModal onSuccess={fetchData} categories={categories} selectedDoctor={selectedDoctor} setSelectedDoctor={setSelectedDoctor} />
        </div>
    );
}
export default DoctorManagement;
