import React from "react";
import Banner from "../../components/user/home/Banner";
import ProductSection from "../../components/user/product/ProductsSection";
import Brands from "../../components/user/home/Brands";
import Category from "../../components/user/home/Category";
import Reviews from "../../components/user/home/Reviews";
function Home() {
  return (
    <div className="grid grid-cols-12 ">
      <div className="col-span-12">
        <Banner />
      </div>
      <div className="col-span-12">
        <Brands />
      </div>
      <div className="col-span-12">
        <ProductSection />
        <ProductSection />
      </div>
      <div className="col-span-12">
        <Category />
      </div>
      <div className="col-span-12">
        <Reviews />
      </div>
    </div>
  );
}

export default Home;
