import axios from "axios";
import React, { useEffect, useState } from "react";
const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {
        const FetchCategory = async () => {
            setIsLoading(true);
            try {
                const res = await axios.get('/api/category/list');
                setCategories(res.data)
            } catch (err) {
                console.error("fetch category error:", err);
                setError("Category ယူလို့မရပါ။");
            } finally {
                setIsLoading(false);
            }
        }
        FetchCategory();
    }, []);

    return (
        <section id="disease-categories" className="container my-5 py-5">
            <h3 className="section-title text-center">ကုသပေးနေသော ရောဂါအမျိုးအစားများ</h3>
            <div className="row g-4 mt-2">
                {isLoading ? (
                    <div className="text-danger text-center my-5">ကျေးဇူးပြုပြီး ခဏစောင့်ပေးပါ။</div>
                ) : error ? (
                    <div className="text-danger text-center my-5">{error}</div>
                ) : categories.length === 0 ? (
                    <div className="text-danger text-center my-5">လတ်တလော ကုသပေးနေသော ရောဂါအမျိုးအစားများ မရှိသေးပါ။</div>
                ) : (
                    categories.map(category => (
                        <div className="col-md-3" key={category.id}>
                            <div className="card category-item p-4 text-center">
                                <div className="category-icon"><i className={category.icon}></i></div>
                                <h5 className="fw-bold">{category.name}</h5>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}
export default Categories;
