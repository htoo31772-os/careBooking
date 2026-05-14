import axios from "axios";
import React, { useState, navigate } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
const Register = ({ setIsLoggedIn, setUser }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    })
    const [validatioError, setValidationError] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }))
        if (validatioError[name]) {
            setValidationError(prevError => ({
                ...prevError,
                [name]: null
            }))
        }
    }
    const handleSubmitRegister = async (e) => {
        e.preventDefault();
        setValidationError({});
        const newErrors = {};
        if (!formData.name) {
            newErrors.name = "User နာမည် ထည့်ပေးပါ။";
        }
        if (!formData.email) {
            newErrors.email = "Email address ထည့်ပေးပါ။";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email address မှားနေပါတယ်။"
        }
        if (!formData.password) {
            newErrors.password = "Password ထည့်ပေးပါ။";
        }
        if (!formData.password_confirmation) {
            newErrors.password_confirmation = "Confirm Password ထည့်ပေးပါ။";
        } else if (formData.password !== formData.password_confirmation) {
            newErrors.password_confirmation = "Password မှားယွင်းနေပါသည်။"
        }
        setValidationError(newErrors)
        if (Object.keys(newErrors).length === 0) {
            setIsLoading(true)
            try {
                const res = await axios.post('/api/register', formData)
                if (res.data.access_token) {
                    localStorage.setItem('token', res.data.access_token);
                    localStorage.setItem('user', JSON.stringify(res.data.user));
                }
                setIsLoggedIn(true);
                setUser(res.data.user);
                toast.success('Registration အောင်မြင်ပါသည်။', { duration: 4000 })

                navigate("/", { replace: true });
            } catch (err) {
                if (err.response.status === 422) {
                    setValidationError(err.response.data.errors);
                } else if (err.response && err.response.data && err.response.data.message) {
                    toast.error(err.response.data.message || 'တစ်ခုခုမှားယွင်း နေပါသည်။', { duration: 4000 })
                } else {
                    toast.error('Registration မအောင်မြင်ပါ။', { duration: 4000 });
                }
            } finally {
                setIsLoading(false);
            }
        }
    }
    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-5 shadow border-0" style={{ maxWidth: '400px', width: '100%' }}>
                <form onSubmit={handleSubmitRegister}>
                    <h3 className="fw-bold mb-4 text-center">Register</h3>
                    {/* Name */}
                    <div className="form-group mb-3">
                        <input
                            type="text"
                            name="name"
                            className={`form-control ${validatioError.name ? 'is-invalid' : ''}`}
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Name" />
                        {/* Error Message */}
                        {validatioError.name && <div className="invalid-feedback">{validatioError.name}</div>}
                    </div>
                    {/* Email */}
                    <div className="form-group mb-3">
                        <input
                            type="email"
                            name="email"
                            className={`form-control ${validatioError.email ? 'is-invalid' : ''}`}
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Email" />
                        {/* Error Message */}
                        {validatioError.email && <div className="invalid-feedback">{validatioError.email}</div>}
                    </div>
                    {/* Password */}
                    <div className="form-group mb-3">
                        <input
                            type="password"
                            name="password"
                            className={`form-control ${validatioError.password ? 'is-invalid' : ''}`}
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Password" />
                        {/* Error Message */}
                        {validatioError.password && <div className="invalid-feedback mb-4">{validatioError.password}</div>}
                    </div>
                    {/* Password_Confirmation */}
                    <div className="form-group mb-4">
                        <input
                            type="password"
                            name="password_confirmation"
                            className={`form-control ${validatioError.password_confirmation ? 'is-invalid' : ''}`}
                            value={formData.password_confirmation}
                            onChange={handleInputChange}
                            placeholder="Confirm Password" />
                        {/* Error Message */}
                        {validatioError.password_confirmation && <div className="invalid-feedback mb-4">{validatioError.password_confirmation}</div>}
                    </div>
                    {/* Registration Button */}
                    <button type="submit" className="btn btn-primary w-100 py-2" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
                                <span role="status">Registration...</span>
                            </>
                        ) : "Register"}
                    </button>
                    {/* Login Link */}
                    <p className="mt-3 text-center small">
                        Have an account? <Link to="/login">Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
export default Register;
