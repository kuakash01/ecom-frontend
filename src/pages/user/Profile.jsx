import api from "../../config/apiUser";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const Profile = () => {

  // ================= STATES =================
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  const [editName, setEditName] = useState(false);
  const [newName, setNewName] = useState("");

  const fileInputRef = useRef(null);


  // ================= FETCH PROFILE =================
  const fetchProfile = async () => {
    try {

      const res = await api.get("/user/profile");
      const profile = res.data?.data || {};

      setUser(profile);
      setNewName(profile?.name || "");

    } catch (error) {
      toast.error("Failed to load profile");

    } finally {

      setLoading(false);

    }
  };


  // ================= UPDATE NAME =================
  const updateName = async () => {

    if (!newName.trim()) {
      return toast.error("Name cannot be empty");
    }

    try {

      const res = await api.put("/user/profile", {
        name: newName.trim()
      });

      setUser(res.data?.data || {});
      setEditName(false);

      toast.success("Name updated");

    } catch {

      toast.error("Update failed");

    }
  };


  // ================= IMAGE UPLOAD =================
  const handleImageChange = async (e) => {

    const file = e.target.files?.[0];

    if (!file) return;


    // Validate type
    if (!file.type.startsWith("image/")) {
      return toast.error("Only image files allowed");
    }


    // Validate size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      return toast.error("Image must be under 2MB");
    }


    const formData = new FormData();
    formData.append("profilePicture", file);


    try {

      const res = await api.put("/user/profile", formData);

      setUser(res.data?.data || {});

      toast.success("Profile picture updated");

    } catch {

      toast.error("Image upload failed");

    }
  };


  // ================= ON LOAD =================
  useEffect(() => {
    fetchProfile();
  }, []);


  // ================= LOADING =================
  if (loading) {
    return (
      <div className="py-16 text-center text-gray-500">
        Loading profile...
      </div>
    );
  }


  // ================= UI =================
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-8">


      {/* PROFILE IMAGE */}
      <div className="flex justify-center mb-6">

        <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-200">

          <img
            src={
              user?.profilePicture &&
                user.profilePicture.trim() !== ""
                ? user.profilePicture
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user?.name || "User"
                )}`
            }
            alt="profile"
            onClick={() => fileInputRef.current?.click()}
            onError={(e) => {
              e.target.src =
                "https://ui-avatars.com/api/?name=User";
            }}
            className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition"
          />

        </div>


        <input
          type="file"
          ref={fileInputRef}
          hidden
          accept="image/*"
          onChange={handleImageChange}
        />

      </div>



      {/* NAME SECTION */}
      <div className="flex justify-center items-center gap-3 mb-8">

        {!editName ? (

          <>
            <h2 className="text-2xl font-semibold text-gray-900">
              {user?.name || "Unnamed User"}
            </h2>

            <button
              onClick={() => setEditName(true)}
              className="text-indigo-600 text-sm hover:underline"
            >
              Edit
            </button>
          </>

        ) : (

          <>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="border rounded-lg px-3 py-1 focus:ring-2 focus:ring-indigo-500 outline-none"
            />

            <button
              onClick={updateName}
              className="text-green-600 text-sm hover:underline"
            >
              Save
            </button>

            <button
              onClick={() => {
                setEditName(false);
                setNewName(user?.name || "");
              }}
              className="text-gray-500 text-sm hover:underline"
            >
              Cancel
            </button>
          </>

        )}

      </div>



      {/* INFO GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


        <Info
          label="Email"
          value={user?.email || "—"}
        />

        <Info
          label="Role"
          value={user?.role || "User"}
        />

        <Info
          label="Joined"
          value={
            user?.createdAt
              ? new Date(user.createdAt).toLocaleDateString()
              : "—"
          }
        />

      </div>

    </div>
  );
};



// ================= INFO COMPONENT =================

const Info = ({ label, value }) => (
  <div>

    <p className="text-sm text-gray-500 mb-1">
      {label}
    </p>

    <p className="font-medium text-gray-800 break-all">
      {value}
    </p>

  </div>
);

export default Profile;
