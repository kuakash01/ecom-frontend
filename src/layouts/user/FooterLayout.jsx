import React from "react";

function FooterLayout() {
  return (
    <div className="bg-gray-100 py-20 px-10 md:px-20 relative">
      {/* <div className="absolute top-0 border">news letter</div> */}
      <div className="grid grid-cols-12 space-y-5 relative">
        <div className="col-span-12 lg:col-span-3 flex flex-col justify-between">
          <img className="w-24" src="https://img.freepik.com/premium-vector/logo-company-called-creative-design-your-line_880858-63.jpg" alt="brand logo" />
          <p className="text-gray-600">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ratione
            accusamus veniam ducimus ab saepe iure?
          </p>
          <div>social media icons</div>
        </div>
        <div className="col-span-12 lg:col-span-9 grid grid-cols-12 space-y-5">
          <div className="col-span-6 md:col-span-3 flex justify-start lg:justify-center">
            <div className="space-y-2">
              <h3 className="text-lg">company</h3>
              <a className="block text-gray-600" href="about">
                About
              </a>
              <a className="block text-gray-600" href="features">
                Features
              </a>
              <a className="block text-gray-600" href="works">
                Works
              </a>
              <a className="block text-gray-600" href="career">
                Career
              </a>
            </div>
          </div>
          <div className="col-span-6 md:col-span-3 flex justify-start lg:justify-center">
            <div className="space-y-2">
              <h3 className="text-lg">help</h3>
              <a className="block text-gray-600" href="about">
                Customer Support
              </a>
              <a className="block text-gray-600" href="features">
                Delivery Details
              </a>
              <a className="block text-gray-600" href="works">
                Terms & Conditions
              </a>
              <a className="block text-gray-600" href="career">
                Privacy Policy
              </a>
            </div>
          </div>
          <div className="col-span-6 md:col-span-3 flex justify-start lg:justify-center">
            <div className="space-y-2">
              <h3 className="text-lg">faq</h3>
              <a className="block text-gray-600" href="about">
                Account
              </a>
              <a className="block text-gray-600" href="features">
                Manage Deliveries
              </a>
              <a className="block text-gray-600" href="works">
                Orders
              </a>
              <a className="block text-gray-600" href="career">
                Payments
              </a>
            </div>
          </div>
          <div className="col-span-6 md:col-span-3 flex justify-start lg:justify-center">
            <div className="space-y-2">
              <h3 className="text-lg">Resources</h3>
              <a className="block text-gray-600" href="about">
                Account
              </a>
              <a className="block text-gray-600" href="features">
                Manage Deliveries
              </a>
              <a className="block text-gray-600" href="works">
                Orders
              </a>
              <a className="block text-gray-600" href="career">
                Payments
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="border-b border-gray-400/50 my-5  "></div>
      <div className="flex flex-col md:flex-row justify-between text-gray-600">
        <p className="p-2">Example.com c 2000-2025, All Right Reserved</p>
        <img  className="p-2"src="payment support" alt="payment support image" />
      </div>
    </div>
  );
}

export default FooterLayout;
