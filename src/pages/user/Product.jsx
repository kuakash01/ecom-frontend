import Badge from "../../components/common/ui/badge/Badge";
import { useLoaderData, useSearchParams, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import api from "../../config/axios";
import NewArrivals from "../../components/user/product/NewArrivals";
import useScrollToTop from "../../hooks/useScrollToTop";


function Product() {
  const productDetail = useLoaderData();
  const thumbRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedColor, setSelectedColor] = useState(searchParams.get("color") || "");
  const { productId } = useParams();

  const [currentGallery, setCurrentGallery] = useState([]);
  const [mainImage, setMainImage] = useState("");
  const [currentVariant, setCurrentVariant] = useState(null);

  const handleColorChange = (colorId) => {
    setSearchParams({ color: colorId });
    setSelectedColor(colorId);
  };

  const getColorGallery = async (productId, colorId) => {
    try {
      const response = await api.get(`/products/${productId}/color-gallery/${colorId}`);
      let gallery = response.data.data.gallery;
      setMainImage(gallery.length > 0 ? gallery[0] : "");
      return setCurrentGallery(gallery);
    } catch (error) {
      console.error("Error fetching color gallery:", error);
    }
    console.log("productid, colorid", productId, colorId);
  };

  const getColorId = (selectedColor, productDetail) => {
    let colorId = "";
    productDetail.allColors.forEach(cg => {
      if (cg.colorName.toLowerCase() === selectedColor.toLowerCase()) {
        colorId = cg._id;
      }
    });
    return colorId;
  }

  useEffect(() => {
    if (selectedColor && productDetail.allColors.find(cg => cg.colorName.toLowerCase() === selectedColor.toLowerCase())) {
      getColorGallery(productId, getColorId(selectedColor, productDetail));
    } else {
      setCurrentGallery(productDetail.defaultGallery);
      setCurrentVariant(productDetail.defaultVariant);
      setMainImage(productDetail.defaultGallery.length > 0 ? productDetail.defaultGallery[0] : "");
    }
    setSelectedColor(searchParams.get("color") || "");

    console.log("selected color changed", selectedColor);
  }, [productDetail, searchParams]);

  useScrollToTop(); // scroll to top on component load

  if (!productDetail) {
    return <div>Loading...</div>;
  }
  else if (productDetail.allColors.find(cg => cg.colorName.toLowerCase() === selectedColor.toLowerCase()) === undefined && selectedColor !== "") {
    return <div className="py-10 px-10 text-center">Color "{selectedColor}" not available for this product. <button onClick={() => setSearchParams({})} className="underline text-blue-600 cursor-pointer" >See all colors</button></div >
  }
  return (
    <div className="py-2  px-2 lg:px-10">
      {/* product details */}
      {productDetail && <div className="grid grid-cols-12 ">
        <div className="col-span-12 lg:col-span-6 grid grid-cols-12 gap-2 p-0 lg:p-10 h-full">
          <div className="col-span-12 lg:col-span-3 flex flex-row md:flex-col gap-2 order-2 lg:order-1 overflow-auto md:h-[65vh] w-full">
            {currentGallery?.map((img, idx) => (
              <div
                key={idx}
                className={`min-w-32 md:min-w-full cursor-pointer rounded-2xl overflow-hidden border  ${mainImage.url === img.url ? "border-black " : "border-gray-200"}`}
                onClick={() => setMainImage(img)}
              >
                <img
                  className={`object-cover aspect-square  transition duration-150 hover:scale-105 `}
                  src={img.url}
                  alt={`Thumbnail ${idx}`}
                />
              </div>
            ))}
          </div>



          <div className="col-span-12 lg:col-span-9 order-1 lg:order-2">
            <img
              src={mainImage ? mainImage.url : productDetail.thumbnail.url}
              alt="Main product"
              className="w-full h-auto object-cover shadow aspect-square rounded-2xl"
            />
          </div>
        </div>
        <div className="col-span-12 lg:col-span-6 flex flex-col justify-between p-0 lg:p-10">
          <h1 className="text-xl font-semibold">{productDetail.title}</h1>
          {/* <div>
            <span>⭐️⭐️⭐️⭐️⭐️</span>
            <span>4.5/5</span>
          </div> */}
          <div className="flex gap-3 font-bold items-center">
            <p className="text-2xl text-black">₹{currentVariant?.price || ""}</p>
            <p className="text-2xl text-gray-500 line-through">₹{currentVariant?.mrp || ""}</p>
            <span>
              <Badge>-40%</Badge>
            </span>
          </div>
          {/* <p className="text-gray-700 ">
            {productDetail.description}
          </p> */}
          <div className="border-b border-b-brand-200/30"></div>
          <div>
            <p className="pb-2 text-xs text-gray-500">Select Colors</p>
            <div className="flex gap-2">
              {productDetail.allColors.map((color, idx) => (
                <div key={idx} onClick={() => handleColorChange(color.colorName.toLowerCase())} className={` cursor-pointer ${selectedColor.toLowerCase() === color.colorName.toLowerCase() ? "text-blue-500 text-shadow-lg" : ""}`} >{color.colorName}</div>
              ))}
            </div>
          </div>
          <div className="border-b border-b-brand-200/30"></div>
          <div>
            <p className="pb-2 text-xs text-gray-500">Select Size</p>
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
          <NewArrivals />
        </div>
      </div>
    </div>
  );
}

export default Product;
