import { Outlet, NavLink } from "react-router-dom";

const AccountLayout = () => {

  const menu = [
    { name: "Profile", path: "/profile" },
    { name: "My Orders", path: "/profile/orders" },
    { name: "Addresses", path: "/profile/addresses" },
    // { name: "Security", path: "/profile/security" },
  ];

  return (
    <div className="px-4 lg:px-20 py-10">

      <div className="grid grid-cols-12 gap-6">

        {/* LEFT SIDEBAR */}
        <div className="col-span-12 lg:col-span-3">
          <h1 className="text-3xl font-bold mb-8">
            My Account
          </h1>

          <div className="border border-gray-300 rounded-2xl p-4 flex flex-col gap-2 sticky top-20">

            {menu.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                end
                className={({ isActive }) =>
                  `
                  px-4 py-2 rounded-lg font-medium transition
                  ${isActive
                    ? "bg-black text-white"
                    : "hover:bg-gray-100"
                  }
                `
                }
              >
                {item.name}
              </NavLink>
            ))}

          </div>

        </div>

        {/* RIGHT CONTENT */}
        <div className="col-span-12 lg:col-span-9">
          <Outlet />
        </div>

      </div>
    </div>
  );
};

export default AccountLayout;
