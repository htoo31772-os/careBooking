import React from "react";
const HeroSection = () => {
    return (
        <header id="hero-section">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-6">
                        <h1 className="fw-bold mb-4">အကောင်းဆုံး ဆရာဝန်များနှင့် အမြန်ဆုံး ရက်ချိန်းယူပါ</h1>
                        <p className="mb-4 opacity-75">
                            သင့်ကျန်းမာရေးအတွက် ယုံကြည်စိတ်ချရသော အထူးကု ဆရာဝန်ကြီးများကို
                            တစ်နေရာတည်းမှာ ရှာဖွေနိုင်ပါသည်။
                        </p>
                        <div className="d-flex gap-3">
                            <a href="#quick-booking-form" className="btn btn-light btn-rounded fw-bold text-primary">
                                အခုပဲ ရက်ချိန်းယူမယ်
                            </a>
                            <a href="#disease-categories" className="btn btn-outline-light btn-rounded fw-bold">
                                ရောဂါအမျိုးအစားများ
                            </a>
                        </div>
                    </div>
                    <div className="col-lg-6 d-none d-lg-block text-end">
                        <img src="./images/heroImage.jpg" alt="Doctor" className="hero-img" />
                    </div>
                </div>
            </div>
        </header>
    );
}
export default HeroSection;
