import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

const AddDoctorModal = ({ onSuccess, categories, selectedDoctor, setSelectedDoctor }) => {
    const token = localStorage.getItem('token');
    const initialFormState = {
        name: '',
        specialty: '',
        experience: '',
        expertise: '',
        bio: '',
        fee: '',
        image: null,
    };
    const [formData, setFormData] = useState(initialFormState);
    const [isLoading, setIsLoading] = useState(false);
    const [validationError, setValidationError] = useState({});
    const [prevImage, setPrevImage] = useState(null);
    // selectDoctor
    useEffect(() => {
        if (selectedDoctor) {
            setFormData({
                name: selectedDoctor.name,
                specialty: selectedDoctor.category_id,
                experience: selectedDoctor.experience,
                expertise: selectedDoctor.expertise,
                fee: selectedDoctor.fee,
                bio: selectedDoctor.bio,
                image: null
            })
            setPrevImage(`http://localhost:8000/storage/doctor/${selectedDoctor.image}`);
        }
    }, [selectedDoctor]);
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
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file })
            setPrevImage(URL.createObjectURL(file));
        }
    }
    // Reset Form
    const resetForm = () => {
        setFormData(initialFormState);
        setValidationError({});
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!formData.name) {
            newErrors.name = "နာမည် ထည့်ပေးပါ။";
        }
        if (!formData.specialty) {
            newErrors.specialty = "အထူးကုကဏ္ဍ ရွေးချယ်ပေးပါ။";
        }
        if (!formData.experience) {
            newErrors.experience = "လုပ်သက် ထည့်ပေးပါ";
        }
        if (!formData.expertise) {
            newErrors.expertise = "ကျွမ်းကျင်မှု ထည့်ပေးပါ။";
        }
        if (!formData.fee) {
            newErrors.fee = "ပြသခ ထည့်ပေးပါ။";
        }
        if (!formData.bio) {
            newErrors.bio = "ကိုယ်ရေးအကျင်း ရေးပေးပါ။"
        }
        setValidationError(newErrors);

        if (Object.keys(newErrors).length === 0) {
            setIsLoading(true);
            const dataToSend = new FormData();
            dataToSend.append("name", formData.name);
            dataToSend.append("category_id", formData.specialty);
            dataToSend.append("experience", formData.experience);
            dataToSend.append("expertise", formData.expertise);
            dataToSend.append("fee", formData.fee);
            dataToSend.append("bio", formData.bio);

            if (formData.image) {
                dataToSend.append("image", formData.image);
            }
            try {
                if (selectedDoctor) {
                    await axios.post(`/api/admin/doctor/update/${selectedDoctor.id}`, dataToSend, { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } });
                } else {
                    await axios.post('/api/admin/doctor/store', dataToSend, { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } });
                }
                onSuccess();
                toast.success(selectedDoctor ? "ပြင်ဆင်မှု အောင်မြင်ပါသည်။" : "ဆရာဝန်အသစ် ထည့်သွင်းပြီးပါပြီ။", { duration: 4000 });
                resetForm();
                setPrevImage(null);
                setSelectedDoctor(null);
                const modalElement = document.getElementById("addDoctorModal");
                const modalInstance = bootstrap.Modal.getInstance(modalElement);
                if (modalInstance) modalInstance.hide();
            } catch (err) {
                if (err.response && err.response.status === 422) {
                    setValidationError(err.response.data.errors);
                } else if (err.response && err.response.data && err.response.data.message) {
                    toast.error(err.response.data.message || "တစ်ခုခု မှားယွင်းနေပါသည်။", { duration: 4000 });
                } else {
                    toast.error(selectedDoctor ? "ပြင်ဆင်မှု မအောင်မြင်ပါ။" : "ဆရာဝန်အသစ် ထည့်သွင်းမှုမအောင်မြင်ပါ။", { duration: 4000 });
                }
            } finally {
                setIsLoading(false);
            }
        }
    }
    return (
        <div className="modal fade" id="addDoctorModal" tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                    {/* Modal Header */}
                    <div className="modal-header bg-primary text-white border-0 py-3">
                        <h5 className="fw-bold modal-title mb-0">
                            <i className="bi bi-person-plus-fill me-2"></i>{selectedDoctor ? 'ပြင်ဆင်ရန်' : 'ဆရာဝန်အသစ် ထည့်သွင်းရန်'}
                        </h5>
                        <button
                            type="button"
                            className="btn-close btn-close-white"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        ></button>
                    </div>

                    {/* Modal Body / Form */}
                    <form onSubmit={handleSubmit} className="modal-body p-4">
                        <div className="row g-3">
                            {/* Name */}
                            <div className="col-md-6">
                                <label className="form-label small fw-bold text-secondary">ဆရာဝန်အမည်</label>
                                <input
                                    name='name'
                                    type="text"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className={`form-control bg-light border-0 p-2 ${validationError.name ? 'is-invalid' : ''}`}
                                    placeholder="ဆရာဝန်အမည်"
                                />
                                {/* Error Message */}
                                {validationError.name && <div className="text-danger">{validationError.name}</div>}
                            </div>

                            {/* Specialty */}
                            <div className="col-md-6">
                                <label className="form-label small fw-bold text-secondary">အထူးကုကဏ္ဍ (Specialty)</label>
                                <select
                                    name='specialty'
                                    onChange={handleInputChange}
                                    value={formData.specialty}
                                    className={`form-select bg-light border-0 p-2 ${validationError.specialty ? 'is-invalid' : ''}`}>
                                    <option value="">ကဏ္ဍရွေးချယ်ပါ</option>
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>{category.name}</option>
                                    ))}
                                </select>
                                {/* Error Message */}
                                {validationError.specialty && <div className="text-danger">{validationError.specialty}</div>}
                            </div>

                            {/* Experience */}
                            <div className="col-md-6">
                                <label className="form-label small fw-bold text-secondary">လုပ်သက် (Experience)</label>
                                <input
                                    name='experience'
                                    value={formData.experience}
                                    onChange={handleInputChange}
                                    type="text"
                                    className={`form-control bg-light border-0 p-2 ${validationError.experience ? 'is-invalid' : ''}`}
                                    placeholder="လုပ်သက်"
                                />
                                {/* Error Message */}
                                {validationError.experience && <div className="text-danger">{validationError.experience}</div>}
                            </div>

                            {/* Expertise */}
                            <div className="col-md-6">
                                <label className="form-label small fw-bold text-secondary">ကျွမ်းကျင်မှု (Expertise)</label>
                                <input
                                    name='expertise'
                                    value={formData.expertise}
                                    onChange={handleInputChange}
                                    type="text"
                                    className={`form-control bg-light border-0 p-2 ${validationError.expertise ? 'is-invalid' : ''}`}
                                    placeholder="ကျွမ်းကျင်မှု"
                                />
                                {/* Error Message */}
                                {validationError.experience && <div className="text-danger">{validationError.experience}</div>}
                            </div>

                            {/* Fee */}
                            <div className="col-md-6">
                                <label className="form-label small fw-bold text-secondary">ပြသခ (Consultation Fee)</label>
                                <div className="input-group">
                                    <input
                                        name='fee'
                                        value={formData.fee}
                                        onChange={handleInputChange}
                                        type="number"
                                        className={`form-control bg-light border-0 p-2 ${validationError.fee ? 'is-invalid' : ''}`}
                                        placeholder="ပြသခ"
                                    />
                                    <span className="input-group-text bg-light border-0">MMK</span>
                                </div>
                                {/* Error Message */}
                                {validationError.fee && <div className="text-danger">{validationError.fee}</div>}
                            </div>

                            {/* Image Upload */}
                            <div className="col-md-6">
                                <img src={prevImage || "/images/user.jpg"} className='rounded-pill' style={{ width: 60 }} />
                                <label className="form-label small fw-bold text-secondary">
                                    <i className="bi bi-camera-fill"></i>
                                    <input type="file"
                                        onChange={handleImageChange}
                                        className="d-none"
                                        accept='image' />
                                </label>
                                {/* Error Message */}
                                {validationError.image && <div className="text-danger">{validationError.image}</div>}
                            </div>

                            {/* Biography */}
                            <div className="col-md-12">
                                <label className="form-label small fw-bold text-secondary">ကိုယ်ရေးအကျဉ်း (Biography)</label>
                                <textarea
                                    name='bio'
                                    value={formData.bio}
                                    onChange={handleInputChange}
                                    className={`form-control bg-light border-0 p-2 ${validationError.bio ? 'is-invalid' : ''}`}
                                    rows="4"
                                    placeholder="ဆရာဝန်၏ အကြောင်းအကျဉ်းချုပ် ရေးသားရန်..."
                                ></textarea>
                                {/* Error Message */}
                                {validationError.bio && <div className="text-danger">{validationError.bio}</div>}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-4 d-flex gap-2">
                            {selectedDoctor && <button
                                type="button"
                                className="btn btn-light flex-grow-1 py-2 fw-bold rounded-pill"
                                data-bs-dismiss="modal"
                                onClick={resetForm}
                            >
                                ပယ်ဖျက်မည်
                            </button>}
                            <button
                                type="submit"
                                className="btn btn-primary flex-grow-1 py-2 fw-bold rounded-pill shadow" disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
                                        <span role="status">Processing...</span>
                                    </>
                                ) : (selectedDoctor ? "ပြင်ဆင်မည်" : "ဒေတာသိမ်းဆည်းမည်")}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddDoctorModal;
