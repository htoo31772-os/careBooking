import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [pagination, setPagination] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const token = localStorage.getItem('token');
    // UserList
    const FetctUser = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get('/api/admin/user/index', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            setUsers(res.data.data);
            setPagination(res.data);
            setCurrentPage(res.data.current_page);
        } catch (err) {
            console.error("Fecth User Data error:", err);
            setError("Data ယူလို့မရပါ။");
        } finally {
            setIsLoading(false)
        }
    };
    useEffect(() => { FetctUser(currentPage) }, [currentPage]);
    // User အား Delete လုပ်ခြင်း
    const handleDelete = async (id) => {
        if (window.confirm("User ကို ဖျက်သိမ်းရန်သေချာပါသလား?")) {
            try {
                await axios.post(`/api/admin/user/delete/${id}`, {}, { headers: { 'Authorization': `Bearer ${token}` } });
                setUsers(users.filter(user => user.id !== id));
                toast.success("User အားဖျက်သိမ်းပြီးပါပြီ။", { duration: 4000 });
            } catch (err) {
                console.error("user delete error:", err);
                toast.error("User ဖျက်သိမ်းမှုမအောင်မြင်ပါ။", { duration: 4000 })
            }

        }
    }
    return (
        <div className="p-3">
            <h4 className="fw-bold my-4">User Management</h4>
            <div className="card border-0 shadow-sm p-4">
                <div className="table-responsive">
                    <table className="table align-middle">
                        <thead className="bg-light">
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan="6" className="text-center text-danger">Loading...</td></tr>
                            ) : error ? (
                                <tr><td colSpan="6" className="text-center text-danger my-5">{error}</td></tr>
                            ) : users.length === 0 ? (
                                <tr><td colSpan="6" className="text-center text-danger">လတ်တလော Dataများမရှိသေးပါ။</td></tr>
                            ) : (
                                users?.map(user => (
                                    <tr key={user.id}>
                                        <td>#{user.id}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.phone}</td>
                                        <td>
                                            <span className="badge bg-success">Active</span>
                                        </td>
                                        <td>
                                            <div className="d-flex gap-1">
                                                <Link to={`/admin/user-Management/user-detail/${user.id}`} className="btn btn-sm btn-warning">Detail</Link>

                                                {user.role !== 'admin' && <button onClick={() => handleDelete(user.id)} className="btn btn-sm btn-danger">
                                                    <i className="bi bi-trash"></i>
                                                </button>}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}

                        </tbody>
                    </table>
                    {/* Pagination Controls */}
                    {!isLoading && users.length > 0 && (
                        <div className="d-flex justify-content-between align-items-center mt-4">
                            <p className="text-muted small">
                                Showing {pagination.from} to {pagination.to} of {pagination.total} users
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
    );
}
export default UserManagement;
