 <div
        className={`fixed inset-0 transition-opacity duration-1000 ${
          isFilterOpen
            ? "opacity-100 bg-black/60"
            : "opacity-0 pointer-events-none"
        } z-40 `}
        onClick={toggleFilter}
      >
        {/* Filter Panel */}
        <div
          className={`w-[90%] lg:w-64 h-[40rem] bg-white rounded-2xl border border-gray-400 p-5 flex flex-col shadow-xl
    fixed bottom-0 left-1/2 transform -translate-x-1/2
    transition-transform duration-1000 ease-in-out
    ${isFilterOpen ? "translate-y-0" : "translate-y-full"}

    lg:static lg:transform-none lg:translate-x-0 lg:translate-y-0 lg:transition-none`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Scrollable Filters */}
          <div className="flex-1 overflow-y-auto hide-scrollbar pr-1">
            <div className="flex justify-between px-2">
              <span className="text-lg font-medium">Filters</span>
              <FilterIcon className="text-2xl" onClick={toggleFilter} />
            </div>
            <div className="border-b border-b-gray-400 my-4"></div>

            {/* dropdown */}
            <div className="dropdown text-gray-500">
              {[1, 2, 3, 4].map((_, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center cursor-pointer hover:bg-gray-100 p-2 rounded"
                >
                  <span>Tshirts</span>
                  <ArrowNextIcon className="text-xl fill-gray-400" />
                </div>
              ))}
            </div>
            <div className="border-b border-b-gray-400 my-4"></div>

            {/* price range */}
            <div className="price-range w-full">
              <div
                onClick={() =>
                  setIsDropdownOpen({
                    ...isDropdownOpen,
                    price: !isDropdownOpen.price,
                  })
                }
                className="flex justify-between px-2 cursor-pointer "
              >
                <span className="text-lg font-medium">Price</span>
                <ArrowDownIcon
                  className={`text-xl ${
                    isDropdownOpen.price ? "rotate-180" : ""
                  }`}
                />
              </div>
              {isDropdownOpen.price && (
                <div className="p-5">
                  <Range
                    step={1}
                    min={0}
                    max={100}
                    values={priceRange}
                    onChange={(priceRange) => setPriceRange(priceRange)}
                    renderTrack={({ props, children }) => (
                      <div
                        onMouseDown={props.onMouseDown}
                        onTouchStart={props.onTouchStart}
                        className="h-1 w-full bg-gray-300 rounded-lg relative"
                        ref={props.ref}
                      >
                        <div
                          className="absolute bg-black h-1 rounded-lg"
                          style={{
                            left: `${(priceRange[0] / 100) * 100}%`,
                            width: `${
                              ((priceRange[1] - priceRange[0]) / 100) * 100
                            }%`,
                          }}
                        />
                        {children}
                      </div>
                    )}
                    renderThumb={({ props, index }) => {
                      const { key, ...restProps } = props;
                      return (
                        <div
                          key={key}
                          {...restProps}
                          className="h-5 w-5 rounded-full bg-black shadow relative flex items-center justify-center"
                          style={{
                            zIndex: index === 1 ? 2 : 1,
                            ...restProps.style,
                          }}
                        >
                          <div className="absolute top-7 text-xs text-black font-medium">
                            {priceRange[index]}
                          </div>
                        </div>
                      );
                    }}
                  />
                </div>
              )}
            </div>

            <div className="border-b border-b-gray-400 mt-8 mb-4"></div>

            {/* color filter */}
            <div className="color-filters">
              <div
                onClick={() =>
                  setIsDropdownOpen({
                    ...isDropdownOpen,
                    color: !isDropdownOpen.color,
                  })
                }
                className="flex justify-between px-2 cursor-pointer "
              >
                <span className="text-lg font-medium">Color</span>
                <ArrowDownIcon
                  className={`text-xl ${
                    isDropdownOpen.color ? "rotate-180" : ""
                  }`}
                />
              </div>
              {isDropdownOpen.color && (
                <div className="p-5 flex gap-2 flex-wrap">
                  {filterColors.map(({ id, color }) => (
                    <div
                      key={id}
                      onClick={() => {
                        toggleColor(id);
                      }}
                      className={`h-8 w-8 flex justify-center items-center rounded-full cursor-pointer border-black/40 border ${color}`}
                    >
                      {selectedColors.includes(id) && (
                        <TickIcon className="text-white" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-b border-b-gray-400 my-4"></div>

            {/* size filters */}
            <div className="size-filter">
              <div
                onClick={() =>
                  setIsDropdownOpen({
                    ...isDropdownOpen,
                    size: !isDropdownOpen.size,
                  })
                }
                className="flex justify-between px-2 cursor-pointer "
              >
                <span className="text-lg font-medium">Size</span>
                <ArrowDownIcon
                  className={`text-xl ${
                    isDropdownOpen.size ? "rotate-180" : ""
                  }`}
                />
              </div>
              {isDropdownOpen.size && (
                <div className="flex flex-wrap gap-2 py-5">
                  {filterSize.map(({ id, size }) => (
                    <div
                      key={id}
                      onClick={() => toggleSize(id)}
                      className={`py-1 px-3 rounded-full cursor-pointer ${
                        selectedSize.includes(id)
                          ? "bg-black text-white"
                          : "bg-gray-300/70 text-black"
                      }`}
                    >
                      {size}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-b border-b-gray-400 my-4"></div>

            {/* dress style */}
            <div className="dress-style-filter">
              <div
                onClick={() =>
                  setIsDropdownOpen({
                    ...isDropdownOpen,
                    dressStyle: !isDropdownOpen.dressStyle,
                  })
                }
                className="flex justify-between px-2 cursor-pointer "
              >
                <span className="text-lg font-medium">Dress Style</span>
                <ArrowDownIcon
                  className={`text-xl ${
                    isDropdownOpen.dressStyle ? "rotate-180" : ""
                  }`}
                />
              </div>
              {isDropdownOpen.dressStyle && (
                <div className="text-gray-500">
                  {["Casual", "Formal", "Party", "Gym"].map((item) => (
                    <div
                      key={item}
                      className="flex justify-between items-center cursor-pointer hover:bg-gray-100 p-2 rounded"
                    >
                      <span>{item}</span>
                      <ArrowNextIcon className="text-xl fill-gray-400" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Fixed Apply Button */}
          <div className="mt-4">
            <button className="bg-black rounded-full py-2 text-white w-full cursor-pointer">
              Apply Filter
            </button>
          </div>
        </div>
      </div>