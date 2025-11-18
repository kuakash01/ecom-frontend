import React from "react";
import Carousel from "../../components/user/home/Carousel";
import PopularProducts from "../../components/user/product/PopularProducts";
import NewArrivals from "../../components/user/product/NewArrivals";
import Categories from "../../components/user/home/Categories";
import DressStyle from "../../components/user/home/DressStyle";
import Reviews from "../../components/user/home/Reviews";
function Home() {
  return (
    <div className="grid grid-cols-12 ">
      <div className="col-span-12">
        <Carousel />
      </div>
      <div className="col-span-12">
        <Categories />
      </div>
      <div className="col-span-12">
        <NewArrivals />
      </div>
      <div className="col-span-12">
        <PopularProducts />
      </div>
      <div className="col-span-12">
        <DressStyle />
      </div>
      <div className="col-span-12">
        <Reviews />
      </div>
    </div>
  );
}

export default Home;
