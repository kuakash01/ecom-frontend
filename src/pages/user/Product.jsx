import Badge from "../../components/common/ui/badge/Badge";

function Product() {
  return (
    <div className="py-2  px-2 lg:px-20">
      <div className="grid grid-cols-12 ">
        <div className="col-span-12 lg:col-span-6 grid grid-cols-12 gap-2 p-0 lg:p-10">
          <div className="col-span-12 lg:col-span-3 grid grid-cols-12 order-2 lg:order-1 gap-2">
            <div className="col-span-3 lg:col-span-12">
              <img
                className="object-cover aspect-square rounded-2xl"
                src="/product/product.jpg"
                alt="Thumbnail 1"
              />
            </div>
            <div className="col-span-3 lg:col-span-12 ">
              <img
                className="object-cover aspect-square rounded-2xl"
                src="/product/product.jpg"
                alt="Thumbnail 1"
              />
            </div>
            <div className="col-span-3 lg:col-span-12 ">
              <img
                className="object-cover aspect-square rounded-2xl"
                src="/product/product.jpg"
                alt="Thumbnail 1"
              />
            </div>
          </div>
          <div className="col-span-12 lg:col-span-9 order-1 lg:order-2">
            <img
              src="/product/product.jpg"
              alt="Main product"
              className="w-full h-auto object-cover shadow aspect-square rounded-2xl"
            />
          </div>
        </div>

        <div className="col-span-12 lg:col-span-6 flex flex-col justify-between p-0 lg:p-10">
          <h1 className="text-3xl font-semibold">Product Title</h1>
          <div>
            <span>⭐️⭐️⭐️⭐️⭐️</span>
            <span>4.5/5</span>
          </div>
          <div className="flex gap-3 font-bold">
            <p className="text-xl text-black">₹1,999.00</p>
            <p className="text-xl text-gray-600 line-through">₹1,999.00</p>
            <Badge>-40%</Badge>
          </div>
          <p className="text-gray-700">
            This is a short description of the product. It highlights features
            and value to the customer.
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
          <div className="flex items-center">
            <div>
              <span className="py-2 px-4 bg-stone-200 rounded-l-full">-</span>
              <span className="py-2 px-4 bg-stone-200 ">1</span>
              <span className="py-2 px-4 bg-stone-200 rounded-r-full">+</span>
            </div>
            <button className="py-2 px-20 bg-black text-white rounded-full">Add to cart</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Product;
