import Badge from "../../components/common/ui/badge/Badge";
import { useLoaderData } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";


function Product() {
  const productDetail = useLoaderData();
  const thumbRef = useRef(null);
  const allImages = [
    productDetail.thumbnail.url,
    ...productDetail.gallery.map(img => img.url)
  ];

  const [mainImage, setMainImage] = useState(allImages[0]);

  const scrollAmount = 150; // pixels to scroll per click

  const scrollUp = () => {
    if (thumbRef.current) {
      thumbRef.current.scrollTop -= scrollAmount;
    }
  };

  const scrollDown = () => {
    if (thumbRef.current) {
      thumbRef.current.scrollTop += scrollAmount;
    }
  };


  return (
    <div className="py-2  px-2 lg:px-10">
      {/* product details */}
      {productDetail && <div className="grid grid-cols-12 ">
        <div className="col-span-12 lg:col-span-6 grid grid-cols-12 gap-2 p-0 lg:p-10 h-full">
          {/* <div className="col-span-12 lg:col-span-3 flex flex-row md:flex-col gap-2 order-2 lg:order-1 overflow-auto md:h-[65vh] w-full">
            {allImages.map((img, idx) => (
              <div
                key={idx}
                className="min-w-32 md:min-w-full cursor-pointer"
                onClick={() => setMainImage(img)}
              >
                <img
                  className="object-cover aspect-square rounded-2xl border hover:border-black transition"
                  src={img}
                  alt={`Thumbnail ${idx}`}
                />
              </div>
            ))}
          </div> */}
          <div className="col-span-12 lg:col-span-3 order-2 lg:order-1 flex flex-col items-center min-h-0">

            {/* Up Arrow */}
            <button
              onClick={scrollUp}
              className="hidden md:block p-2 bg-gray-200 rounded-full hover:bg-gray-300"
            >
              <ChevronUp size={20} />
            </button>

            {/* Scrollable Thumbnails */}
            <div
              ref={thumbRef}
              className="flex flex-row lg:flex-col gap-2 w-full overflow-y-auto overflow-x-auto min-h-0 max-h-[55vh] py-2 no-scrollbar"
            >
              {allImages.map((img, idx) => (
                <div
                  key={idx}
                  className="min-w-32 lg:min-w-full cursor-pointer"
                  onClick={() => setMainImage(img)}
                >
                  <img
                    className="object-cover aspect-square rounded-xl border hover:border-black transition"
                    src={img}
                    alt={`Thumbnail ${idx}`}
                  />
                </div>
              ))}
            </div>

            {/* Down Arrow */}
            <button
              onClick={scrollDown}
              className="hidden md:block p-2 bg-gray-200 rounded-full hover:bg-gray-300"
            >
              <ChevronDown size={20} />
            </button>
          </div>


          <div className="col-span-12 lg:col-span-9 order-1 lg:order-2">
            <img
              src={mainImage}
              alt="Main product"
              className="w-full h-auto object-cover shadow aspect-square rounded-2xl"
            />
          </div>
        </div>
        <div className="col-span-12 lg:col-span-6 flex flex-col justify-between p-0 lg:p-10">
          <h1 className="text-3xl font-semibold">{productDetail.name}</h1>
          <div>
            <span>⭐️⭐️⭐️⭐️⭐️</span>
            <span>4.5/5</span>
          </div>
          <div className="flex gap-3 font-bold items-center">
            <p className="text-2xl text-black">₹{productDetail.price}</p>
            <p className="text-2xl text-gray-500 line-through">₹{productDetail.mrp}</p>
            <span>
              <Badge>-40%</Badge>
            </span>
          </div>
          <p className="text-gray-700 ">
            {productDetail.description}
          </p>
          <div className="border-b border-b-brand-200/30"></div>
          <div>
            <p className="pb-2">Select Colors</p>
            <div className="flex gap-2">
              <div className="w-7 h-7 rounded-full bg-brand-400"></div>
              <div className="w-7 h-7 rounded-full bg-green-900"></div>
              <div className="w-7 h-7 rounded-full bg-blue-800"></div>
            </div>
          </div>
          <div className="border-b border-b-brand-200/30"></div>
          <div>
            <p className="pb-2">Select Size</p>
            <div className="flex gap-3">
              <div className="py-1 px-3 rounded-full bg-stone-200">Small</div>
              <div className="py-1 px-3 rounded-full bg-stone-200">Medium</div>
              <div className="py-1 px-3 rounded-full bg-stone-200">Large</div>
            </div>
          </div>
          <div className="border-b border-b-brand-200/30"></div>
          <div className="flex items-center flex-wrap gap-5">
            <div className="flex">
              <button className="py-2 px-4 bg-stone-200 rounded-l-full cursor-pointer">
                -
              </button>
              <span className="py-2 px-4 bg-stone-200 ">1</span>
              <button className="py-2 px-4 bg-stone-200 rounded-r-full cursor-pointer">
                +
              </button>
            </div>
            <button className="py-2 px-25 bg-black text-white rounded-full">
              Add to cart
            </button>
          </div>
        </div>
      </div>}
      {/* product reviews */}
      <div className="">
        <div className="grid grid-cols-3">
          <span className="text-center p-3 border-b border-b-brand-200/60">
            Product Details
          </span>
          <span className="text-center p-3 border-b-4 border-black/60">
            Rating & Reviews
          </span>
          <span className="text-center p-3 border-b border-b-brand-200/60">
            FAQs
          </span>
        </div>
        <div className="flex justify-between my-5">
          <div className="space-x-2">
            <span className="text-xl font-bold">All Reviews</span>
            <span>(562)</span>
          </div>
          <div className="flex gap-3">
            <div className="py-2 px-5 bg-gray-200 rounded-full">f</div>
            <div className="py-2 px-5 bg-gray-200 rounded-full">Latest </div>
            <div className="py-2 px-5 bg-black text-white rounded-full">
              Write a Review
            </div>
          </div>
        </div>

        <div className="m-10">
          <div className="grid grid-cols-12 gap-4 py-5">
            <div className="col-span-12 lg:col-span-6 space-y-3 border border-gray-200 p-5 rounded-xl">
              <div>⭐️⭐️⭐️⭐️⭐️</div>
              <p className="text-md font-bold">name</p>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor
                ut illo, eveniet minus ad possimus ullam aspernatur ab porro
                deserunt!
              </p>
              <p>date</p>
            </div>
            <div className="col-span-12 lg:col-span-6 space-y-3 border border-gray-200 p-5 rounded-xl">
              <div>⭐️⭐️⭐️⭐️⭐️</div>
              <p className="text-md font-bold">name</p>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor
                ut illo, eveniet minus ad possimus ullam aspernatur ab porro
                deserunt!
              </p>
              <p>date</p>
            </div>
            <div className="col-span-12 lg:col-span-6 space-y-3 border border-gray-200 p-5 rounded-xl">
              <div>⭐️⭐️⭐️⭐️⭐️</div>
              <p className="text-md font-bold">name</p>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor
                ut illo, eveniet minus ad possimus ullam aspernatur ab porro
                deserunt!
              </p>
              <p>date</p>
            </div>
            <div className="col-span-12 lg:col-span-6 space-y-3 border border-gray-200 p-5 rounded-xl">
              <div>⭐️⭐️⭐️⭐️⭐️</div>
              <p className="text-md font-bold">name</p>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor
                ut illo, eveniet minus ad possimus ullam aspernatur ab porro
                deserunt!
              </p>
              <p>date</p>
            </div>
            <div className="col-span-12 lg:col-span-6 space-y-3 border border-gray-200 p-5 rounded-xl">
              <div>⭐️⭐️⭐️⭐️⭐️</div>
              <p className="text-md font-bold">name</p>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor
                ut illo, eveniet minus ad possimus ullam aspernatur ab porro
                deserunt!
              </p>
              <p>date</p>
            </div>
            <div className="col-span-12 lg:col-span-6 space-y-3 border border-gray-200 p-5 rounded-xl">
              <div>⭐️⭐️⭐️⭐️⭐️</div>
              <p className="text-md font-bold">name</p>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor
                ut illo, eveniet minus ad possimus ullam aspernatur ab porro
                deserunt!
              </p>
              <p>date</p>
            </div>
          </div>
          <button className="py-2 px-10 block border mx-auto border-gray-200 rounded-full">
            Load More Reviews
          </button>
        </div>

        <div className=" my-6  rounded-lg ">
          <h3 className="text-center text-4xl font-bold my-10">New Arrivals</h3>
          <div className="grid grid-cols-12  ">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="col-span-6 md:col-span-3 bg-white rounded-2xl  p-2"
                >
                  <img
                    className="aspect-[14/16] object-cover rounded-2xl w-full"
                    src="/product/product.jpg"
                    alt="product"
                  />
                  <div className="mt-2">
                    <p className="text-xl font-bold">Product Name</p>
                    <p className="text-sm">⭐️⭐️⭐️⭐️☆</p>
                    <p className="text-lg font-semibold">₹ 1599</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Product;
