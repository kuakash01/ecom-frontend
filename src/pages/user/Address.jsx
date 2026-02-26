import { useEffect, useState } from "react";
import api from "../../config/apiUser";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useScrollToTop from "../../hooks/useScrollToTop";

const AddressList = () => {

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // scroll to top when visiting address page
  useScrollToTop();

  const fetchAddresses = async () => {
    try {
      const res = await api.get("/address");
      setAddresses(res.data.data || []);
    } catch (error) {
      toast.error("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };


  const handleDelete = async (id) => {
    // if (!window.confirm("Delete this address?")) return;

    try {
      await api.delete(`/address/${id}`);
      toast.success("Deleted");
      fetchAddresses();
    } catch {
      toast.error("Delete failed");
    }
  };


  const setDefault = async (id) => {
    try {
      await api.put(`/address/default/${id}`);
      toast.success("Default updated");
      fetchAddresses();
    } catch {
      toast.error("Failed");
    }
  };


  useEffect(() => {
    fetchAddresses();
  }, []);


  if (loading) return <p className="text-center py-10">Loading...</p>;


  return (
    <div className="max-w-5xl mx-auto px-4 py-8">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">

        <div>
          <h2 className="text-3xl font-semibold text-gray-900">
            Addresses
          </h2>

          <p className="text-gray-500 text-sm mt-1">
            Manage your delivery locations
          </p>
        </div>

        <button
          onClick={() => navigate("../addresses/add")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium shadow"
        >
          + Add Address
        </button>

      </div>


      {/* LIST */}
      <div className="grid md:grid-cols-2 gap-6">

        {addresses.map((addr) => (

          <div
            key={addr._id}
            className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition"
          >

            {/* TOP */}
            <div className="flex justify-between mb-3">

              <div>

                <div className="flex items-center gap-2 mb-1">

                  <h3 className="font-semibold text-lg text-gray-900">
                    {addr.fullName}
                  </h3>

                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium
                      ${addr.addressType === "home"
                        ? "bg-blue-100 text-blue-700"
                        : addr.addressType === "work"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-gray-100 text-gray-700"
                      }`}
                  >
                    {addr.addressType}
                  </span>

                  {addr.isDefault && (
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                      Default
                    </span>
                  )}

                </div>

                <p className="text-sm text-gray-600">
                  {addr.phone}
                </p>

              </div>


              {/* ACTIONS */}
              <div className="flex gap-3 text-sm">

                {!addr.isDefault && (
                  <button
                    onClick={() => setDefault(addr._id)}
                    className="text-green-600 hover:underline"
                  >
                    Make Default
                  </button>
                )}

                <button
                  onClick={() =>
                    navigate(`../addresses/edit/${addr._id}`)
                  }
                  className="text-indigo-600 hover:underline"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(addr._id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>

              </div>

            </div>


            {/* ADDRESS */}
            <p className="text-sm text-gray-700 leading-relaxed">

              {addr.addressLine1}

              {addr.addressLine2 && `, ${addr.addressLine2}`}

              {addr.landmark && `, Near ${addr.landmark}`}

              <br />

              {addr.city}, {addr.state} - {addr.pincode}

              <br />

              <span className="font-medium">
                {addr.country}
              </span>

            </p>

          </div>
        ))}


        {/* EMPTY */}
        {addresses.length === 0 && (
          <p className="text-gray-500 col-span-full text-center">
            No saved addresses yet
          </p>
        )}

      </div>

    </div>
  );
};

export default AddressList;
