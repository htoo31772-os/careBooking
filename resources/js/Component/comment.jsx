import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { Rating } from "react-simple-star-rating";
const Comment = ({ isLoggedIn, doctorId }) => {
    const [reivews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState(null);
    const token = localStorage.getItem('token');
    // Fetch Comment Data
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                const res = await axios.get(`/api/doctor/comment/show/${doctorId}`)
                setReviews(res.data);
            } catch (err) {
                console.error("Review Fetch Error:", err);
                setErrors("Data ယူလို့မရပါ။");
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [doctorId]);
    // Comment
    const [isBtnLoading, setIsBtnLoading] = useState(false);
    const [newReview, setNewReview] = useState({ comment: '', rating: 0 });
    const [validationError, setValidationError] = useState({});
    const handleRatingChange = (newRating) => {
        setNewReview({ ...newReview, rating: newRating })
    }
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewReview(prevState => ({ ...prevState, [name]: value }))
        if (validationError[name]) {
            setValidationError(prevError => ({ ...prevError, [name]: null }))
        }
    }
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!newReview.rating) {
            newErrors.rating = "Rating သတ်မှတ်ပေးပါ။";
        }
        if (!newReview.comment) {
            newErrors.comment = "Comment ရေးပေးပါ။";
        }
        setValidationError(newErrors);
        if (Object.keys(newErrors).length === 0) {
            setIsBtnLoading(true);
            try {
                const res = await axios.post(`/api/doctor/comment/writeComment/${doctorId}`, { ...newReview }, { headers: { 'Authorization': `Bearer ${token}` } })
                setReviews([res.data, ...reivews]);
                setNewReview({ comment: '', rating: 0 });
                toast.success("အောင်မြင်ပါသည်။", { duration: 4000 });
            } catch (err) {
                console.error("Comment error:", err);

                if (err.response && err.response.status === 422) {
                    setValidationError(err.response.errors);
                } else if (err.response && err.response.data && err.response.data.message) {
                    toast.error(err.response.data.message || "တစ်ခုခုမှားယွင်းနေပါသည်။", { duration: 4000 });
                } else {
                    toast.error("Comment ရေးခြင်းမအောင်မြင်ပါ။", { duration: 4000 })
                }
            } finally {
                setIsBtnLoading(false);
            }
        }
    }
    return (
        <>
            <h5 className="fw-bold mb-4">လူနာများ၏ မှတ်ချက်များ</h5>
            {/* Doctor's reviews */}
            {isLoading ? (
                <div className="text-danger text-center my-5">Loading...</div>
            ) : errors ? (
                <div className="text-danger text-center my-5">{errors}</div>
            ) : reivews.length > 0 ? (
                reivews.map(review => (
                    <div key={review.id} className="review-card shadow-sm border-0 p-4 bg-white rounded-4 mb-3">
                        <div className="d-flex align-items-center mb-2">
                            <img className="rounded-circle me-2" src={review?.user?.profile_photo ? `http://localhost:8000/storage/user/${review.user.profile_photo}` : '/images/user.jpg'} style={{ width: 40 }} />
                            <div className="fw-bold fs-5 text-primary">{review.user?.name}</div>
                        </div>
                        <Rating
                            initialValue={review.rating}
                            readonly={true}
                            size={25}
                            fillColor="#f1a545"
                            allowHover="#f1a545"
                        />
                        <p className="text-muted mb-0">
                            {review.comment}
                        </p>
                    </div>
                ))
            ) : (
                <div className="review-card shadow-sm border-0 p-4 bg-white rounded-4 mb-3 my-5 text-center">လတ်တလော မှတ်ချက်မရှိသေးပါ။</div>
            )}

            {/* Reviews ရေးရန် */}
            <div className="mt-5">
                <h5 className="fw-bold mb-4">ဒီဆရာဝန်ကို မှတ်ချက်ပေးရန်</h5>
                <div className="card border-0 shadow-sm p-4 rounded-4">
                    <form onSubmit={handleCommentSubmit}>
                        <div className="mb-3">
                            <label className="form-label small fw-bold text-muted">သင့်ရဲ့ အဆင့်သတ်မှတ်ချက်</label>
                        </div>
                        <div className="mb-3">
                            <Rating
                                onClick={handleRatingChange}
                                initialValue={newReview.rating}
                                allowHover="#f1a545"
                                fillColor="#f1a545"
                                size={25}
                                emptyColor="#cccccc"
                            />
                            {/* Validation Message */}
                            {validationError.rating && <div className="text-danger">{validationError.rating}</div>}
                        </div>
                        <div className="mb-3">
                            <textarea
                                name="comment"
                                value={newReview.comment}
                                onChange={handleInputChange}
                                className={`form-control border-0 bg-light p-3 ${validationError.comment ? 'is-invalid' : ''}`}
                                rows="3"
                                placeholder="ဆရာဝန်နဲ့ ပတ်သက်ပြီး သင့်အမြင်ကို ရေးပေးပါ..."
                            ></textarea>
                            {/* Validation Message */}
                            {validationError.comment && <div className="text-danger">{validationError.comment}</div>}
                        </div>
                        {isLoggedIn ? (
                            <button type="submit" className="btn btn-dark rounded-pill px-4 fw-bold" disabled={isBtnLoading}>
                                {isBtnLoading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                                        <span role="status">Comment တင်နေသည်...</span>
                                    </>
                                ) : ("Comment တင်မည်")}
                            </button>
                        ) : (
                            <Link to="/login">သင့်ရဲ့ မှတ်ချက်ပေးရန် login ဝင်ပေးပါ။</Link>
                        )}
                    </form>
                </div>
            </div>
        </>
    )
}
export default Comment;
