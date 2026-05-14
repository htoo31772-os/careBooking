import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, Navigate } from "react-router-dom";
const Login = ({ setIsLoggedIn, setUser }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [isLoading, setIsLoading] = useState(false);
    const [validationError, setValidationError] = useState({});
    const handleInputChange = (e) => {
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
    const handleLoginchange = async (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!formData.email) {
            newErrors.email = "Email address ထည့်ပေးပါ။";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email address မှားနေပါသည်"
        }
        if (!formData.password) {
            newErrors.password = "Password ထည့်ပေးပါ။";
        }
        setValidationError(newErrors)
        if (Object.keys(newErrors).length === 0) {
            setIsLoading(true)
            try {
                const res = await axios.post('/api/login', formData)
                if (res.data.access_token) {
                    localStorage.setItem('token', res.data.access_token);
                    localStorage.setItem('user', JSON.stringify(res.data.user));
                }
                setIsLoggedIn(true);
                setUser(res.data.user);
                toast.success("Login အောင်မြင်ပါသည်။", { duration: 4000 });
                <Navigate to="/" replace />
            } catch (err) {
                if (err.response && err.response.data.status === 422) {
                    setValidationError(err.response.data.errors)
                } else if (err.response && err.response.data && err.response.data.message) {
                    toast.error(err.response.data.message || "တစ်ခုခုမှားယွင်းနေပါသည်။", { duration: 4000 })
                } else {
                    toast.error("Login မအောင်မြင်ပါ။ထပ်မံကြိုးစားကြည့်ပါ။", { duration: 4000 });
                }
            } finally {
                setIsLoading(false);
            }
        }
    }
    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-5 shadow border-0" style={{ maxWidth: '400px', width: '100%' }}>
                <h3 className="fw-bold mb-4 text-center">Login</h3>
                <form onSubmit={handleLoginchange}>
                    {/* Email */}
                    <div className="form-group mb-3">
                        <input
                            name="email"
                            type="email"
                            value={formData.email}
                            className={`form-control ${validationError?.email ? 'is-invalid' : ''}`}
                            onChange={handleInputChange}
                            placeholder="Email"
                        />
                        {/* Error Message */}
                        {validationError?.email && <div className="text-danger">{validationError.email}</div>}
                    </div>
                    {/* Password */}
                    <div className="form-group mb-4">
                        <input
                            name="password"
                            type="password"
                            value={formData.password}
                            className={`form-control ${validationError?.password ? 'is-invalid' : ''}`}
                            onChange={handleInputChange}
                            placeholder="Password"
                        />
                        {/* Error Message */}
                        {validationError?.password && <div className="text-danger">{validationError.password}</div>}
                    </div>
                    <button type="submit" className="btn btn-primary w-100 py-2" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                                <span role="status">Logging in...</span>
                            </>
                        ) : "Login"}
                    </button>
                    <p className="mt-3 text-center small">
                        No account? <Link to="/register">Register</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
export default Login;
