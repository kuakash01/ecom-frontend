// import React, { useRef, useState, useEffect } from "react";
// import { Plus, X } from "lucide-react";

// const ImageUpload = ({
//   multiple = false,
//   value,
//   onChange,
//   label = "Upload Image",
//   required = false,
// }) => {
//   const [previews, setPreviews] = useState([]);
//   const inputRef = useRef();

//   // Update preview when value changes externally (useful for edit forms)
//   useEffect(() => {
//     if (multiple) {
//       const urls = (value || []).map((file) =>
//         typeof file === "string" ? file : URL.createObjectURL(file)
//       );
//       setPreviews(urls);
//     } else if (value) {
//       const url = typeof value === "string" ? value : URL.createObjectURL(value);
//       setPreviews([url]);
//     } else {
//       setPreviews([]);
//     }
//   }, [value, multiple]);

//   const handleChange = (e) => {
//     const files = Array.from(e.target.files);
//     if (!files.length) return;

//     if (multiple) {
//       const updatedFiles = [...(value || []), ...files];
//       const updatedPreviews = [
//         ...previews,
//         ...files.map((f) => URL.createObjectURL(f)),
//       ];
//       setPreviews(updatedPreviews);
//       onChange && onChange(updatedFiles);
//     } else {
//       const file = files[0];
//       const url = URL.createObjectURL(file);
//       setPreviews([url]);
//       onChange && onChange(file);
//     }

//     e.target.value = "";
//   };

//   const handleRemove = (index) => {
//     if (multiple) {
//       const updatedPreviews = previews.filter((_, i) => i !== index);
//       const updatedFiles = (value || []).filter((_, i) => i !== index);
//       setPreviews(updatedPreviews);
//       onChange && onChange(updatedFiles);
//     } else {
//       setPreviews([]);
//       onChange && onChange(null);
//     }
//   };

//   return (
//     <div>
//       {label && (
//         <label className="block mb-2 font-medium text-gray-700">
//           {label}
//           {required && <span className="text-red-500">*</span>}
//         </label>
//       )}
//       <div className="flex flex-wrap gap-3">
//         {previews.map((src, i) => (
//           <div key={i} className="relative w-24 h-24">
//             <img
//               src={src}
//               alt={`Preview ${i + 1}`}
//               className="w-full h-full object-cover rounded-lg border"
//             />
//             <button
//               type="button"
//               onClick={() => handleRemove(i)}
//               className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow hover:text-red-500"
//             >
//               <X size={16} />
//             </button>
//           </div>
//         ))}

//         {/* Add Button */}
//         <div
//           onClick={() => inputRef.current.click()}
//           className="w-24 h-24 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-500 transition"
//         >
//           <Plus size={28} className="text-gray-500" />
//         </div>

//         <input
//           ref={inputRef}
//           type="file"
//           multiple={multiple}
//           accept="image/*"
//           onChange={handleChange}
//           className="hidden"
//         />
//       </div>
//     </div>
//   );
// };

// export default ImageUpload;



import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";

const ImageUpload = ({
  label,
  value = [],
  onChange,
  multiple = false,
  required = false,
}) => {
  const [previews, setPreviews] = useState([]);

 useEffect(() => {
  if (!value) {
    setPreviews([]);
    return;
  }

  if (multiple) {
    const mapped = value.map((file) => {
      if (file instanceof File) {
        return URL.createObjectURL(file);
      }
      if (typeof file === "string") {
        return file; // already a URL
      }
      return "";
    });
    setPreviews(mapped);
  } else {
    let src = "";
    if (value instanceof File) src = URL.createObjectURL(value);
    else if (typeof value === "string") src = value;
    setPreviews(src ? [src] : []);
  }
}, [value, multiple]);


  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (multiple) {
      const updated = [...(value || []), ...files];
      onChange(updated);
    } else {
      onChange(files[0]);
    }

    e.target.value = ""; // reset input so reselect works
  };

  const handleRemove = (index = 0) => {
    if (multiple) {
      const newFiles = [...value];
      newFiles.splice(index, 1);
      onChange(newFiles);
      setPreviews(previews.filter((_, i) => i !== index));
    } else {
      onChange(null);
      setPreviews([]);
    }
  };

  return (
    <div>
      {label && (
        <label className="font-medium text-sm text-gray-700 dark:text-gray-300">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}

      {/* Hidden File Input */}
      <input
        type="file"
        id={`${label}-input`}
        accept="image/*"
        multiple={multiple}
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Image Previews */}
      <div className="flex flex-wrap gap-3 mt-2">
        {previews.map((src, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            className="relative w-28 h-28 rounded-lg overflow-hidden border border-gray-300 shadow-sm group"
          >
            <img
              src={src}
              alt={`preview-${index}`}
              className="object-cover w-full h-full"
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute top-1 right-1 bg-black/60 hover:bg-black text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={14} />
            </motion.button>
          </motion.div>
        ))}

        {/* Add Button */}
        {(multiple || previews.length === 0) && (
          <motion.label
            htmlFor={`${label}-input`}
            whileHover={{ scale: 1.1 }}
            className="w-28 h-28 flex items-center justify-center border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:bg-gray-100"
          >
            <Plus className="w-6 h-6 text-gray-500" />
          </motion.label>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
