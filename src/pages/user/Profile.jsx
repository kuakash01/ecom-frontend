// import { Link } from "react-router-dom";
// import api from "../../config/axios";
// import { useEffect, useState } from "react";
// import { toast } from "react-toastify";

// const Profile = () => {

//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Edit Mode
//   const [editMode, setEditMode] = useState(false);

//   // Form Data
//   const [formData, setFormData] = useState({
//     name: "",
//     profilePicture: "",
//   });


//   // =========================
//   // FETCH PROFILE
//   // =========================
//   const fetchProfile = async () => {
//     try {
//       const res = await api.get("/user/profile");

//       setUser(res.data.data);

//       setFormData({
//         name: res.data.data.name,
//         profilePicture: res.data.data.profilePicture || "",
//       });

//     } catch (error) {
//       toast.error("Failed to load profile");
//       console.log(error);
//     } finally {
//       setLoading(false);
//     }
//   };


//   // =========================
//   // UPDATE PROFILE
//   // =========================
//   const handleUpdate = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await api.put("/user/profile", formData);

//       toast.success("Profile Updated");

//       setUser(res.data.data);

//       setEditMode(false);

//     } catch (error) {
//       toast.error("Update failed");
//       console.log(error);
//     }
//   };


//   useEffect(() => {
//     fetchProfile();
//   }, []);


//   // =========================
//   // LOADING
//   // =========================
//   if (loading) {
//     return (
//       <div className="text-center py-10">
//         Loading profile...
//       </div>
//     );
//   }


//   return (
//     <div className="border border-gray-300 rounded-2xl p-6">

//       {/* HEADER */}
//       <div className="flex justify-between items-center mb-6">

//         <h2 className="text-2xl font-semibold">
//           My Profile
//         </h2>

//         {!editMode && (
//           <button
//             onClick={() => setEditMode(true)}
//             className="px-4 py-1 bg-blue-600 text-white rounded-lg text-sm"
//           >
//             Edit
//           </button>
//         )}

//       </div>


//       {/* PROFILE IMAGE */}
//       {user.profilePicture ? (
//         <div className="flex justify-start mb-6">
//           <img
//             src={user?.profilePicture}
//             alt="profile"
//             className="w-24 h-24 rounded-full object-cover border"
//           />
//         </div>) : (<div className="flex justify-start mb-6">
//           <img
//             src="/default-profile.png"
//             alt="profile"
//             className="w-24 h-24 rounded-full object-cover border"
//           />
//         </div>)
//       }


//       {/* ================= VIEW MODE ================= */}
//       {!editMode && user && (

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">

//           <Info label="Full Name" value={user.name} />
//           <Info label="Email" value={user.email} />
//           <Info label="Role" value={user.role} />
//           <Info label="Joined" value={new Date(user.createdAt).toLocaleDateString()} />

//         </div>
//       )}



//       {/* ================= EDIT MODE ================= */}
//       {editMode && (

//         <form
//           onSubmit={handleUpdate}
//           className="space-y-4"
//         >

//           {/* NAME */}
//           <div>
//             <label className="text-sm text-gray-500">
//               Full Name
//             </label>

//             <input
//               type="text"
//               value={formData.name}
//               onChange={(e) =>
//                 setFormData({ ...formData, name: e.target.value })
//               }
//               className="w-full border rounded-lg px-3 py-2 mt-1"
//               required
//             />
//           </div>


//           {/* PROFILE IMAGE URL */}
//           <div>
//             <label className="text-sm text-gray-500">
//               Profile Picture URL
//             </label>

//             <input
//               type="text"
//               value={formData.profilePicture}
//               onChange={(e) =>
//                 setFormData({ ...formData, profilePicture: e.target.value })
//               }
//               className="w-full border rounded-lg px-3 py-2 mt-1"
//             />
//           </div>


//           {/* BUTTONS */}
//           <div className="flex gap-3 pt-4">

//             <button
//               type="submit"
//               className="bg-green-600 text-white px-4 py-2 rounded-lg"
//             >
//               Save
//             </button>

//             <button
//               type="button"
//               onClick={() => setEditMode(false)}
//               className="bg-gray-400 text-white px-4 py-2 rounded-lg"
//             >
//               Cancel
//             </button>

//           </div>

//         </form>
//       )}

//     </div>
//   );
// };




// /* SMALL COMPONENT */

// const Info = ({ label, value }) => (
//   <div>
//     <p className="text-sm text-gray-500">{label}</p>
//     <p className="font-medium break-all">{value}</p>
//   </div>
// );

// export default Profile;














import api from "../../config/axios";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const Profile = () => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [editName, setEditName] = useState(false);
  const [newName, setNewName] = useState("");

  const fileInputRef = useRef();


  // ================= FETCH PROFILE =================
  const fetchProfile = async () => {
    try {
      const res = await api.get("/user/profile");
      setUser(res.data.data);
      setNewName(res.data.data.name);
    } catch (error) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };


  // ================= UPDATE NAME =================
  const updateName = async () => {
    try {
      const res = await api.put("/user/profile", {
        name: newName
      });

      setUser(res.data.data);
      setEditName(false);
      toast.success("Name updated");

    } catch (error) {
      toast.error("Update failed");
    }
  };


  // ================= IMAGE UPLOAD =================
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePicture", file);

    try {
      const res = await api.put("/user/profile", formData);

      setUser(res.data.data);
      toast.success("Profile picture updated");

    } catch (error) {
      toast.error("Image upload failed");
    }
  };


  useEffect(() => {
    fetchProfile();
  }, []);


  if (loading) return <div className="py-10 text-center">Loading...</div>;


  return (
    <div className="border border-gray-300 rounded-2xl p-6 max-w-3xl mx-auto">

      {/* PROFILE IMAGE */}
      <div className="flex justify-center mb-6 relative">

        <img
          src={user.profilePicture || "/default-avatar.png"}
          alt="profile"
          onClick={() => fileInputRef.current.click()}
          className="w-28 h-28 rounded-full object-cover cursor-pointer border hover:opacity-80 transition"
        />

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          hidden
          accept="image/*"
        />
      </div>


      {/* NAME SECTION */}
      <div className="flex items-center gap-3 mb-6 justify-center">

        {!editName ? (
          <>
            <h2 className="text-2xl font-semibold">
              {user.name}
            </h2>

            <button
              onClick={() => setEditName(true)}
              className="text-blue-600 text-sm"
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
              className="border rounded-lg px-3 py-1"
            />

            <button
              onClick={updateName}
              className="text-green-600 text-sm"
            >
              Save
            </button>

            <button
              onClick={() => setEditName(false)}
              className="text-gray-500 text-sm"
            >
              Cancel
            </button>
          </>
        )}

      </div>


      {/* OTHER INFO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <Info label="Email" value={user.email} />
        <Info label="Role" value={user.role} />
        <Info label="Joined" value={new Date(user.createdAt).toLocaleDateString()} />

      </div>

    </div>
  );
};


const Info = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-medium break-all">{value}</p>
  </div>
);

export default Profile;
