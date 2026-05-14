import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const CategoryManagement = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        return;
    }
    const initialFormState = {
        name: '',
        icon: ''
    };
    const [formData, setFormData] = useState(initialFormState);
    const [validationError, setValidationError] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null)
    const [btnLoading, setBtnLoading] = useState(false);
    // Categories များကို Backend မှရယူခြင်း
    useEffect(() => {
        const fetchCategory = async () => {
            setIsLoading(true)
            try {
                const res = await axios.get('/api/admin/category/index', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                setCategories(res.data);
            } catch (err) {
                console.error("Category Err:", err);
                toast.error("Categories ယူလို့မရပါ။");
            } finally {
                setIsLoading(false);
            }
        }
        fetchCategory();
    }, [])
    // Reset Fomr
    const resetForm = () => {
        setEditId(null);
        setFormData(initialFormState);
        setValidationError({});
    }
    // Onclick Edit Button
    const [editId, setEditId] = useState(null);
    const handleEdit = (category) => {
        setEditId(category.id);
        setFormData({
            name: category.name,
            icon: category.icon
        })
    }
    // Delete Button
    const handleDelete = async (id) => {
        if (window.confirm("Category ကိုဖျက်ရန်သေချာပါသလား?")) {
            try {
                await axios.post(`/api/admin/category/delete/${id}`, {}, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                setCategories(categories.filter(category => category.id !== id));
                toast.success("Category ကိုဖျက်သိမ်းလိုက်ပါပြီ။", { duration: 400 });
            } catch (err) {
                console.error("Category Delet Err:", err);
                toast.error("ဖျက်သိမ်းမှုမအောင်မြင်ပါ။",{duration:4000});
            }
        }
    }
    // Input
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        if (validationError[name]) {
            setValidationError(prevError => ({
                ...prevError,
                [name]: null
            }))
        }
    }
    const handleSubmitChange = async (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!formData.name.trim()) {
            newErrors.name = "Category နာမည်ထည့်ပေးပါ။";
        }
        if (!formData.icon.trim()) {
            newErrors.icon = "Category icon ထည့်ပေးပါ။";
        }
        setValidationError(newErrors);
        if (Object.keys(newErrors).length === 0) {
            setBtnLoading(true);
            setValidationError({});
            try {
                if (editId) {
                    const res = await axios.post(`/api/admin/category/update/${editId}`, formData, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })
                    setCategories(categories.map(category => category.id === editId ? res.data.category : category));
                    toast.success("Category ကိုပြင်ဆင်ပြီးပါပြီ။");
                } else {
                    const res = await axios.post('/api/admin/category/store', formData, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })
                    setCategories(prevCategories => [res.data.category, ...prevCategories]);
                    toast.success("Category ဖန်တီးပြီးပါပြီး။", { duration: 4000 });
                }
                resetForm();
            } catch (err) {
                if (err.response && err.response.status === 422) {
                    setValidationError(err.response.data.errors);
                } else if (err.response || err.response.data || err.response.data.message) {
                    toast.error(err.response.data.message || "တစ်ခုခုမှား ယွင်းနေပါသည်။", { duration: 4000 });
                } else {
                    toast.error("Category ဖန်တီးမှု မအောင်မြင်ပါ။", { duration: 4000 });
                }
            } finally {
                setBtnLoading(false);
            }
        }
    }
    return (
        <div className="p-4">
            <h4 className="fw-bold mb-4">Disease Categories</h4>
            <div className="row g-4">
                {/* Left Side: Add Form */}
                <div className="col-md-4">
                    <form onSubmit={handleSubmitChange}>
                        <div className="card p-3 border-0 shadow-sm">
                            <h6 className="fw-bold mb-3">{editId ? "Edit Category" : "Add New Category"}</h6>

                            {/* Name Input */}
                            <div className="form-group mb-3">
                                <span className="input-group-text bg-white mb-3">
                                    <i className={formData.icon || "bi bi-image"}></i>
                                </span>
                                <input
                                    type="text"
                                    name="name"
                                    className={`form-control ${validationError?.name ? 'is-invalid' : ''}`}
                                    placeholder="Category Name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                />
                                {/* Error Message */}
                                {validationError.name && <div className="text-danger">{validationError.name}</div>}
                            </div>

                            {/* Icon Input */}
                            <div className="form-group mb-3">
                                <input
                                    type="text"
                                    name="icon"
                                    className={`form-control ${validationError?.icon ? 'is-invalid' : ''}`}
                                    placeholder="Icon Class"
                                    value={formData.icon}
                                    onChange={handleInputChange}
                                />
                                {/* Error Message */}
                                {validationError.icon && <div className="text-danger">{validationError.icon}</div>}
                            </div>
                            <div className="d-flex gap-2">
                                <button type="submit" className={`btn w-100 ${editId ? "btn-success" : "btn-primary"}`} disabled={isLoading}>
                                    {btnLoading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                                            <span role="status">Processing...</span>
                                        </>
                                    ) : (editId ? 'Update' : 'Add New')

                                    }
                                </button>
                                {editId && <button type="button" className="btn btn-secondary w-100" onClick={resetForm}>Cancle</button>}
                            </div>
                        </div>
                    </form>
                </div>

                {/* Right Side: Category List Table */}
                <div className="col-md-8">
                    <div className="card p-3 border-0 shadow-sm">
                        <div className="table-responsive">
                            <table className="table align-middle">
                                <thead className="bg-light">
                                    <tr>
                                        <th>Icon</th> {/* Icon Column တိုးမယ် */}
                                        <th>Name</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <tr> <td colSpan="4" className="text-center">Loading...</td> </tr>
                                    ) : error ? (
                                        <tr> <td colSpan="4" className="text-center">{error}</td> </tr>
                                    ) : categories.length === 0 ? (
                                        <tr> <td colSpan="4" className="text-center">လတ်တလော Category data မရှိသေးပါ။</td> </tr>
                                    ) : (
                                        categories.map(category => (
                                            <tr key={category.id}>
                                                <td>
                                                    <div className="bg-light d-flex align-items-center justify-content-center rounded" style={{ width: '40px', height: '40px' }}>
                                                        <i className={category.icon}></i>
                                                    </div>
                                                </td>
                                                <td className="fw-bold">{category.name}</td>
                                                <td>
                                                    <button onClick={() => handleEdit(category)} className="btn btn-sm btn-primary me-2">
                                                        <i class="bi bi-pencil-square"></i>
                                                    </button>
                                                    <button onClick={() => handleDelete(category.id)} className="btn btn-sm btn-danger">
                                                        <i class="bi bi-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default CategoryManagement;
