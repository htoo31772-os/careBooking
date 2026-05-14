import axios from "axios";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
const Profile = ({ user, setUser }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [birthDay, setBirthDay] = useState(null);
    const [address, SetAddress] = useState("");
    const [previousImage, setPreviousImage] = useState(null)
    const token = localStorage.getItem('token');
    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setPhone(user.phone || "");
            setBirthDay(user.date_of_birth ? new Date(user.date_of_birth) : null);
            SetAddress(user.address || "");
        }
    }, [user])
    // Profile Image
    const [image, setImage] = useState(null);
    const [validatioError, setValidationError] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreviousImage(URL.createObjectURL(file));
            setImage(file);
        }
    }
    const handleUpdateChange = async (e) => {
        e.preventDefault();
        setValidationError({})
        if (!name) {
            setValidationError("နာမည် ထည့်ပေးပါ။");
            return;
        }
        const formData = new FormData();
        formData.append("name", name);
        formData.append("phone", phone);
        formData.append("birthDay", birthDay.toLocaleDateString('fr-CA'));
        formData.append("address", address);
        if (image) {
            formData.append("image", image);
        }
        try {
            setIsLoading(true)
            const res = await axios.post('/api/updateProfile', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            if (previousImage) {
                URL.revokeObjectURL(previousImage)
            }
            setImage(null);
            setUser(res.data.user);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            toast.success("Profile ပြင်ဆင်ပြီးပါပြီ။", { duration: 4000 });
        } catch (err) {
            if (err.response && err.response.status === 422) {
                setValidationError(err.response.data.errors);
            } if (err.response && err.response.data && err.response.data.message) {
                toast.error(err.response.data.message || "တစ်ခုခုမှားယွင်းနေပါသည်။");
            } else {
                toast.error("Profile ပြင်ဆင်ခြင်း မအောင်မြင်ပါ။", { duration: 4000 });
            }
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <div className="container my-5">
            <div className="row g-4">
                {/* Sidebar */}
                <div className="col-lg-3">
                    <div id="profile-sidebar">
                        <div id="profile-image-container">
                            <img
                                src={previousImage || (user?.profile_photo ? `http://localhost:8000/storage/user/${user.profile_photo}` : 'images/user.jpg')}
                                className="rounded-circle"
                                alt="User"
                            />
                            <label htmlFor="upload-photo" className="edit-photo-btn">
                                <i className="bi bi-camera-fill"></i><input type="file" onChange={handleImageChange} className="d-none" id="upload-photo" accept="image/*" />
                            </label>
                        </div>
                        <div className="text-center mb-4">
                            <h5 className="fw-bold mb-0">{name}</h5>
                            <p className="text-muted small">{email}</p>
                        </div>

                        <nav className="nav">
                            <Link to="/profile/booking" className="nav-link-custom">
                                <i className="bi bi-calendar-check"></i> My Bookings
                            </Link>
                        </nav>
                    </div>
                </div>

                {/* Main Content */}
                <div className="col-lg-9">
                    <div className="info-card h-100">
                        <h4 className="fw-bold mb-4">Account Information</h4>

                        <form onSubmit={handleUpdateChange}>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label">အမည်အပြည့်အစုံ</label>
                                    <input
                                        type="text"
                                        value={name}
                                        className={`form-control form-control-custom ${validatioError?.name ? 'is-invalid' : ''}`}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                    {validatioError.name && <div className="text-danger">{validatioError.name}</div>}
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">အီးမေးလ်</label>
                                    <input
                                        type="email"
                                        value={email}
                                        className="form-control form-control-custom"
                                        disabled
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">ဖုန်းနံပါတ်</label>
                                    <input
                                        type="tel"
                                        value={phone}
                                        className="form-control form-control-custom"
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">မွေးသက္ကရာဇ်</label>
                                    <div className="datepicker-container">
                                        <DatePicker
                                            selected={birthDay}
                                            onChange={(date) => setBirthDay(date)}
                                            dateFormat="dd/MM/yyyy"
                                            className="form-control form-control-custom"
                                            showYearDropdown
                                            yearDropdownItemNumber={100}
                                            isClearable
                                            maxDate={new Date()}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <label className="form-label">နေရပ်လိပ်စာ</label>
                                    <textarea
                                        className="form-control form-control-custom"
                                        rows="3"
                                        value={address}
                                        onChange={(e) => SetAddress(e.target.value)}
                                    ></textarea>
                                </div>
                            </div>

                            <hr className="my-4 opacity-50" />

                            <div className="d-flex justify-content-end gap-2">
                                <button type="button" className="btn btn-light px-4 rounded-pill fw-bold">
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary px-4 rounded-pill fw-bold shadow">
                                    {isLoading ? (
                                        <>
                                            <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
                                            <span role="status">Updating...</span>
                                        </>
                                    ) : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Profile;
