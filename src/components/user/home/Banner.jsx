import React from 'react'

function Banner() {
  return (
    <div className="relative">
    <div className="h-full hidden md:block">
      {/* Left Overlay */}
      <span className="absolute z-20 top-0 left-0 h-full w-24 bg-gradient-to-r from-black via-transparent to-transparent opacity-0 hover:opacity-20 transition-all duration-300"></span>

      {/* Right Overlay */}
      <span className="absolute z-20 top-0 right-0 h-full w-24 bg-gradient-to-l from-black via-transparent to-transparent opacity-0 hover:opacity-20 transition-all duration-300"></span>
    </div>

    <div className="flex items-center flex-col md:flex-row ">
      <div className="relative md:absolute md:z-10 z-0  w-full md:w-1/2 p-10 md:px-20 flex flex-col justify-center items-start ">
        <p className="text-4xl md:text-6xl font-bold">
          FIND CLOTHES THAT MATCHES YOUR STYLE
        </p>
        <p className="mt-5">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Doloremque doloribus pariatur fugiat reiciendis totam dolores,
          fuga expedita ipsam quisquam saepe?
        </p>
        <a
          className="mt-5 text-white px-10 py-2 rounded-full bg-black"
          href=""
        >
          Shop Now
        </a>
        <div className="flex gap-10 mt-15">
          <div>
            <p className="text-2xl">200+</p>
            <p>happy customers</p>
          </div>
          <div>
            <p className="text-2xl">200+</p>
            <p>happy customers</p>
          </div>
          <div>
            <p className="text-2xl">200+</p>
            <p>happy customers</p>
          </div>
        </div>
      </div>
      <img
        className="md:w-full h-[40vh] md:h-full object-cover object-right relative"
        src="/banner/banner1.png"
        alt=""
      />
    </div>
  </div>
  )
}

export default Banner
