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
              src={mainImage.url}
              alt="Main product"
              className="w-full h-auto object-cover shadow aspect-square rounded-2xl"
            />
          </div>
        </div>

        <div className="col-span-12 lg:col-span-6 flex flex-col gap-6 p-4 lg:p-10">

          {/* Title + Ratings */}
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
              {productDetail.title}
            </h1>

            {/* Example Rating (replace with API data) */}
            <div className="flex items-center gap-2">
              <div className="text-yellow-500">★★★★☆</div>
              <span className="text-sm text-gray-600">(128 Reviews)</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center gap-4">
            <p className="text-3xl font-bold text-black">₹{currentVariant?.price}</p>
            {currentVariant?.mrp && (
              <p className="text-lg text-gray-400 line-through">
                ₹{currentVariant?.mrp}
              </p>
            )}
            <Badge className="bg-red-200 text-red-700 rounded-full px-3 py-1 text-sm">
              -40%
            </Badge>
          </div>

          {/* Highlights (replace with actual data later) */}
          <ul className="grid grid-cols-2 gap-2 text-sm text-gray-600">
            <li>Free Delivery</li>
            <li>7-Day Return</li>
            <li>Cash on Delivery</li>
            <li>1 Year Warranty</li>
          </ul>

          <div className="border-b"></div>

          {/* Color Selector */}
          {productDetail.allColors?.length > 1 && (
            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium text-gray-700">Select Color</p>
              <div className="flex gap-3 flex-wrap">
                {productDetail.allColors.map((color, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleColorChange(color.colorName)}
                    className={`cursor-pointer px-4 py-1 rounded-full border text-sm transition-all duration-200 ${selectedColor.toLowerCase() === color.colorName.toLowerCase()
                        ? "border-black bg-black text-white shadow-md"
                        : "border-gray-300 hover:border-black"
                      }`}
                  >
                    {color.colorName}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border-b"></div>

          {/* Size Selector */}
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium text-gray-700">Select Size</p>
            <div className="flex gap-3 flex-wrap">
              {allVariantOfAColor.map((variant, idx) => {
                const isSelected =
                  currentVariant?.size.sizeValue.toLowerCase() ===
                  variant.size.sizeValue.toLowerCase();
                const isOutOfStock = variant.quantity === 0;

                return (
                  <div
                    key={idx}
                    onClick={() => !isOutOfStock && setSelectedSize(variant.size)}
                    className={`cursor-pointer px-4 py-1 rounded-lg border text-sm transition-all duration-200 ${isSelected
                        ? "border-black bg-black text-white font-semibold shadow-sm"
                        : "border-gray-300"
                      } ${!isSelected &&
                      !isOutOfStock &&
                      "hover:border-black hover:bg-gray-100"
                      } ${isOutOfStock &&
                      "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                  >
                    {variant.size.sizeName}
                    {isOutOfStock && " (Out of Stock)"}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-b"></div>

          {/* Quantity + Actions */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center border border-gray-300 rounded-full overflow-hidden">
              <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200">-</button>
              <span className="px-6 py-2">1</span>
              <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200">+</button>
            </div>

            <button className="flex-1 py-3 rounded-full bg-black text-white text-center font-semibold hover:bg-gray-900 transition-all">
              Add to Cart
            </button>
          </div>

          {/* Delivery Info */}
          <div className="text-sm text-gray-600 flex gap-1 items-center">
            🚚 Delivery within 3-5 days
          </div>

        </div>



      </div>}