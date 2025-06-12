// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import axios from "axios";

// import Form from "../../components/common/form/Form";
// import Label from "../../components/common/form/Label";
// import Input from "../../components/common/form/input/InputField";
// import {
//   Table,
//   TableHeader,
//   TableBody,
//   TableRow,
//   TableCell,
// } from "../../components/common/ui/table/index";

// function Products() {
//   const [addNewProduct, setAddNewProduct] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useForm();

//   const handleOpenModal = () => setAddNewProduct(true);
//   const handleCloseModal = () => {
//     setAddNewProduct(false);
//     reset();
//   };

//   const onSubmit = async (data) => {
//     setLoading(true);
//     try {
//       const response = await axios.post(
//         `${import.meta.env.VITE_API_URL}/api/products`,
//         data
//       );
//       console.log("Product added:", response.data);
//       handleCloseModal();
//     } catch (error) {
//       console.error("Error adding product", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="relative overflow-auto">
//       {!addNewProduct && (
//         <div className="relative">
//           <div className="flex justify-between">
//             <h1 className="text-2xl">Manage Products</h1>
//             <button
//               onClick={handleOpenModal}
//               className="bg-black px-3 py-2 text-white rounded-md"
//             >
//               Add New Product
//             </button>
//           </div>

//           <div className="py-5">
//             <div className="border p-2 border-gray-300 rounded-2xl">
//               <Table className="text-gray-500">
//                 <TableHeader>
//                   <TableRow>
//                     {[
//                       "Sr. no",
//                       "COD",
//                       "Product Image",
//                       "Product Gallery",
//                       "Product Name",
//                       "Product Quantity",
//                       "Price",
//                       "Discount",
//                       "Size",
//                       "Action",
//                     ].map((heading) => (
//                       <TableCell key={heading}>
//                         <div className="text-md">{heading}</div>
//                       </TableCell>
//                     ))}
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {[1, 2, 3, 4].map((_, index) => (
//                     <TableRow key={index}>
//                       <TableCell>{index + 1}</TableCell>
//                       <TableCell>
//                         <input type="checkbox" />
//                       </TableCell>
//                       <TableCell>Image</TableCell>
//                       <TableCell>Gallery</TableCell>
//                       <TableCell>Name</TableCell>
//                       <TableCell>Quantity</TableCell>
//                       <TableCell>Price</TableCell>
//                       <TableCell>Discount</TableCell>
//                       <TableCell>Size</TableCell>
//                       <TableCell>Action</TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>
//           </div>
//         </div>
//       )}

//       {addNewProduct && (
//         <div className="relative top-0 bg-white w-full p-6 rounded-xl shadow-lg">
//           <h2 className="text-xl font-semibold mb-4">Add New Product</h2>

//           <Form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//             <div className="grid grid-cols-12 gap-3">
//               {/* Product Name */}
//               <div className="col-span-12 md:col-span-6 lg:col-span-4">
//                 <Label>
//                   Product Name <span className="text-red-400">*</span>
//                 </Label>
//                 <Input
//                   type="text"
//                   placeholder="Product Name"
//                   {...register("productName", { required: "Product name is required." })}
//                   className="w-full border p-2 rounded-md"
//                 />
//                 {errors.productName && (
//                   <p className="text-red-500 text-sm mt-1">{errors.productName.message}</p>
//                 )}
//               </div>

//               {/* Price */}
//               <div className="col-span-12 md:col-span-6 lg:col-span-4">
//                 <Label>
//                   Product Price <span className="text-red-400">*</span>
//                 </Label>
//                 <Input
//                   type="number"
//                   placeholder="Product Price"
//                   {...register("price", { required: "Price is required." })}
//                   className="w-full border p-2 rounded-md"
//                 />
//                 {errors.price && (
//                   <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
//                 )}
//               </div>

//               {/* Size */}
//               <div className="col-span-12 md:col-span-6 lg:col-span-4">
//                 <Label>
//                   Product Size <span className="text-red-400">*</span>
//                 </Label>
//                 <Input
//                   type="text"
//                   placeholder="Product Size"
//                   {...register("size", { required: "Size is required." })}
//                   className="w-full border p-2 rounded-md"
//                 />
//                 {errors.size && (
//                   <p className="text-red-500 text-sm mt-1">{errors.size.message}</p>
//                 )}
//               </div>

//               {/* Category */}
//               <div className="col-span-12 md:col-span-6 lg:col-span-4">
//                 <Label>Category</Label>
//                 <Input
//                   type="text"
//                   placeholder="Category"
//                   {...register("category")}
//                   className="w-full border p-2 rounded-md"
//                 />
//               </div>

//               {/* Quantity */}
//               <div className="col-span-12 md:col-span-6 lg:col-span-4">
//                 <Label>
//                   Quantity <span className="text-red-400">*</span>
//                 </Label>
//                 <Input
//                   type="text"
//                   placeholder="Quantity"
//                   {...register("quantity", { required: "Quantity is required." })}
//                   className="w-full border p-2 rounded-md"
//                 />
//                 {errors.quantity && (
//                   <p className="text-red-500 text-sm mt-1">{errors.quantity.message}</p>
//                 )}
//               </div>

//                  {/* product image */}
//               <div className="col-span-12 md:col-span-6 lg:col-span-4">
//                 <Label>
//                   Quantity <span className="text-red-400">*</span>
//                 </Label>
//                 <Input
//                   type="file"
//                   placeholder="Product Image"
//                   {...register("productImage", { required: "Image is required." })}
//                   className="w-full border p-2 rounded-md"
//                 />
//                 {errors.productImage && (
//                   <p className="text-red-500 text-sm mt-1">{errors.productImage.message}</p>
//                 )}
//               </div>
//             </div>
            

//             <div className="flex justify-start space-x-2">
//               <button
//                 type="button"
//                 onClick={handleCloseModal}
//                 className="px-4 py-2 bg-gray-200 rounded-md"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className="px-4 py-2 bg-black text-white rounded-md"
//                 disabled={loading}
//               >
//                 {loading ? "Saving..." : "Save"}
//               </button>
//             </div>
//           </Form>

//           <button
//             onClick={handleCloseModal}
//             className="absolute top-2 right-2 text-gray-500 hover:text-black cursor-pointer"
//           >
//             ✕
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Products;





import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

import Form from "../../components/common/form/Form";
import Label from "../../components/common/form/Label";
import Input from "../../components/common/form/input/InputField";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "../../components/common/ui/table/index";

function Products() {
  const [addNewProduct, setAddNewProduct] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleOpenModal = () => setAddNewProduct(true);
  const handleCloseModal = () => {
    setAddNewProduct(false);
    setImagePreview(null);
    reset();
  };

  const onSubmit = async (data) => {
    console.log("printing")
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === "productImage") {
          formData.append(key, value[0]);
        } else {
          formData.append(key, value);
        }
      });
     

      // const response = await axios.post(
      //   `${import.meta.env.VITE_API_URL}/api/products`,
      //   formData,
      //   {
      //     headers: {
      //       "Content-Type": "multipart/form-data",
      //     },
      //   }
      // );

      console.log("Product added:", response.data);
      handleCloseModal();
    } catch (error) {
      console.error("Error adding product", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-auto">
      {!addNewProduct && (
        <div className="relative">
          <div className="flex justify-between">
            <h1 className="text-2xl">Manage Products</h1>
            <button
              onClick={handleOpenModal}
              className="bg-black px-3 py-2 text-white rounded-md"
            >
              Add New Product
            </button>
          </div>

          <div className="py-5">
            <div className="border p-2 border-gray-300 rounded-2xl">
              <Table className="text-gray-500">
                <TableHeader>
                  <TableRow>
                    {[
                      "Sr. no",
                      "COD",
                      "Product Image",
                      "Product Gallery",
                      "Product Name",
                      "Product Quantity",
                      "Price",
                      "Discount",
                      "Size",
                      "Action",
                    ].map((heading) => (
                      <TableCell key={heading}>
                        <div className="text-md">{heading}</div>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[1, 2, 3, 4].map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <input type="checkbox" />
                      </TableCell>
                      <TableCell>Image</TableCell>
                      <TableCell>Gallery</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Discount</TableCell>
                      <TableCell>Size</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      )}

      {addNewProduct && (
        <div className="relative top-0 bg-white w-full p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Add New Product</h2>

          <Form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-12 gap-3">
              {/* Product Name */}
              <div className="col-span-12 md:col-span-6 lg:col-span-4">
                <Label>
                  Product Name <span className="text-red-400">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="Product Name"
                  {...register("productName", { required: "Product name is required." })}
                  className="w-full border p-2 rounded-md"
                />
                {errors.productName && (
                  <p className="text-red-500 text-sm mt-1">{errors.productName.message}</p>
                )}
              </div>

              {/* Price */}
              <div className="col-span-12 md:col-span-6 lg:col-span-4">
                <Label>
                  Product Price <span className="text-red-400">*</span>
                </Label>
                <Input
                  type="number"
                  placeholder="Product Price"
                  {...register("price", { required: "Price is required." })}
                  className="w-full border p-2 rounded-md"
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
                )}
              </div>

              {/* Size */}
              <div className="col-span-12 md:col-span-6 lg:col-span-4">
                <Label>
                  Product Size <span className="text-red-400">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="Product Size"
                  {...register("size", { required: "Size is required." })}
                  className="w-full border p-2 rounded-md"
                />
                {errors.size && (
                  <p className="text-red-500 text-sm mt-1">{errors.size.message}</p>
                )}
              </div>

              {/* Category */}
              <div className="col-span-12 md:col-span-6 lg:col-span-4">
                <Label>Category</Label>
                <Input
                  type="text"
                  placeholder="Category"
                  {...register("category")}
                  className="w-full border p-2 rounded-md"
                />
              </div>

              {/* Quantity */}
              <div className="col-span-12 md:col-span-6 lg:col-span-4">
                <Label>
                  Quantity <span className="text-red-400">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="Quantity"
                  {...register("quantity", { required: "Quantity is required." })}
                  className="w-full border p-2 rounded-md"
                />
                {errors.quantity && (
                  <p className="text-red-500 text-sm mt-1">{errors.quantity.message}</p>
                )}
              </div>

              {/* Product Image */}
              <div className="col-span-12 md:col-span-6 lg:col-span-4">
                <Label>
                  Product Image <span className="text-red-400">*</span>
                </Label>
                <Input
                  type="file"
                  accept="image/*"
                  {...register("productImage", {
                    required: "Product image is required.",
                    validate: {
                      acceptedFormats: (files) =>
                        ["image/jpeg", "image/png", "image/webp"].includes(files[0]?.type) ||
                        "Only JPEG, PNG, or WEBP files are allowed",
                    },
                  })}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setImagePreview(URL.createObjectURL(file));
                    } else {
                      setImagePreview(null);
                    }
                  }}
                  className="w-full border p-2 rounded-md"
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mt-2 h-24 w-24 object-cover rounded-md border"
                  />
                )}
                {errors.productImage && (
                  <p className="text-red-500 text-sm mt-1">{errors.productImage.message}</p>
                )}
              </div>
            </div>

            <div className="flex justify-start space-x-2">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-200 rounded-md cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-black text-white rounded-md cursor-pointer"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </Form>

          <button
            onClick={handleCloseModal}
            className="absolute top-2 right-2 text-gray-500 hover:text-black cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

export default Products;
