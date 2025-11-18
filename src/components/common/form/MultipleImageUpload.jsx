
// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { Plus, Trash2 } from "lucide-react";

// const ImageUpload = ({
//   label,
//   value = [],
//   onChange,
//   multiple = false,
//   required = false,
  
// }) => {
//   const [previews, setPreviews] = useState([]);

//  useEffect(() => {
//   if (!value) {
//     setPreviews([]);
//     return;
//   }

//   if (multiple) {
//     const mapped = value.map((file) => {
//       if (file instanceof File) {
//         return URL.createObjectURL(file);
//       }
//       if (typeof file === "string") {
//         return file; // already a URL
//       }
//       return "";
//     });
//     setPreviews(mapped);
//   } else {
//     let src = "";
//     if (value instanceof File) src = URL.createObjectURL(value);
//     else if (typeof value === "string") src = value;
//     setPreviews(src ? [src] : []);
//   }
// }, [value, multiple]);

// // useEffect(() => {
// //   if (!value) {
// //     if (previews.length > 0) setPreviews([]);
// //     return;
// //   }

// //   let newPreviews = [];

// //   if (multiple && Array.isArray(value)) {
// //     newPreviews = value.map(file => {
// //       if (file instanceof File) return URL.createObjectURL(file);
// //       if (typeof file === "string") return file;
// //       return "";
// //     });
// //   } else {
// //     if (value instanceof File) newPreviews = [URL.createObjectURL(value)];
// //     else if (typeof value === "string") newPreviews = [value];
// //   }

// //   // Only update state if different
// //   if (JSON.stringify(newPreviews) !== JSON.stringify(previews)) {
// //     setPreviews(newPreviews);
// //   }

// // }, [value, multiple, previews]);

//   const handleFileChange = (e) => {
//     const files = Array.from(e.target.files);
//     if (!files.length) return;

//     if (multiple) {
//       const updated = [...(value || []), ...files];
//       onChange(updated);
//     } else {
//       onChange(files[0]);
//     }

//     e.target.value = ""; // reset input so reselect works
//   };

//   const handleRemove = (index = 0) => {
//     if (multiple) {
//       const newFiles = [...value];
//       newFiles.splice(index, 1);
//       onChange(newFiles);
//       setPreviews(previews.filter((_, i) => i !== index));
//     } else {
//       onChange(null);
//       setPreviews([]);
//     }
//   };

//   return (
//     <div>
//       {label && (
//         <label className="font-medium text-sm text-gray-700 dark:text-gray-300">
//           {label} {required && <span className="text-red-400">*</span>}
//         </label>
//       )}

//       {/* Hidden File Input */}
//       <input
//         type="file"
//         id={`${label}-input`}
//         accept="image/*"
//         multiple={multiple}
//         className="hidden"
//         onChange={handleFileChange}
//       />

//       {/* Image Previews */}
//       <div className="flex flex-wrap gap-3 mt-2">
//         {previews.map((src, index) => (
//           <motion.div
//             key={index}
//             initial={{ opacity: 0, scale: 0.8 }}
//             animate={{ opacity: 1, scale: 1 }}
//             whileHover={{ scale: 1.05 }}
//             className="relative w-28 h-28 rounded-lg overflow-hidden border border-gray-300 shadow-sm group"
//           >
//             <img
//               src={src}
//               alt={`preview-${index}`}
//               className="object-cover w-full h-full"
//             />
//             <motion.button
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//               type="button"
//               onClick={() => handleRemove(index)}
//               className="absolute top-1 right-1 bg-black/60 hover:bg-black text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
//             >
//               <Trash2 size={14} />
//             </motion.button>
//           </motion.div>
//         ))}

//         {/* Add Button */}
//         {(multiple || previews.length === 0) && (
//           <motion.label
//             htmlFor={`${label}-input`}
//             whileHover={{ scale: 1.1 }}
//             className="w-28 h-28 flex items-center justify-center border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:bg-gray-100"
//           >
//             <Plus className="w-6 h-6 text-gray-500" />
//           </motion.label>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ImageUpload;










import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";

const MultipleImageUpload = ({ label, value = [], onChange, required = false }) => {
  const [previews, setPreviews] = useState([]);
  const objectUrlsRef = useRef([]);

  useEffect(() => {
    // Clean up old object URLs
    objectUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
    objectUrlsRef.current = [];

    if (!value || value.length === 0) {
      setPreviews([]);
      return;
    }

    const newPreviews = value.map(file => {
      if (file instanceof File) {
        const url = URL.createObjectURL(file);
        objectUrlsRef.current.push(url);
        return url;
      } else if (typeof file === "string") {
        return file;
      }
      return "";
    });

    setPreviews(newPreviews);

    return () => {
      objectUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
    };
  }, [value]);

  const handleFileChange = e => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    onChange([...(Array.isArray(value) ? value : []), ...files]);
    e.target.value = "";
  };

  const handleRemove = index => {
    const newFiles = [...value];
    newFiles.splice(index, 1);
    onChange(newFiles);
  };

  return (
    <div>
      {label && (
        <label className="font-medium text-sm text-gray-700 dark:text-gray-300">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}
      <input
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        id={`${label}-input`}
        onChange={handleFileChange}
      />
      <div className="flex flex-wrap gap-3 mt-2">
        {previews.map((src, index) => (
          <motion.div key={index} className="relative w-28 h-28 rounded-lg overflow-hidden border border-gray-300 shadow-sm group">
            <img src={src} alt={`preview-${index}`} className="object-cover w-full h-full" />
            <motion.button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute top-1 right-1 bg-black/60 hover:bg-black text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={14} />
            </motion.button>
          </motion.div>
        ))}
        <motion.label
          htmlFor={`${label}-input`}
          whileHover={{ scale: 1.1 }}
          className="w-28 h-28 flex items-center justify-center border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:bg-gray-100"
        >
          <Plus className="w-6 h-6 text-gray-500" />
        </motion.label>
      </div>
    </div>
  );
};

export default MultipleImageUpload;
