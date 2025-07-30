import React, { useState, useEffect } from "react";
import { useLoaderData, useRevalidator } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import api from "../../config/axios"; // Import your axios instance
import { toast } from "react-toastify";


import Form from "../../components/common/form/Form";
import Label from "../../components/common/form/Label";
import Input from "../../components/common/form/input/InputField";
import Textarea from "../../components/common/form/input/TextArea";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "../../components/common/ui/table/index";

function Products() {
  const data = useLoaderData(); // loads data from the loader function
  const revalidator = useRevalidator(); // used to revalidate the loader data after form submission
  const [addNewProduct, setAddNewProduct] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleOpenModal = () => setAddNewProduct(true);
  const handleCloseModal = () => {
    setAddNewProduct(false);
    reset();
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // console.log("Submitted data:", data);
      const formData = new FormData();

      for (const key in data) {
        if (key === "productImage") {
          const file = data[key] && data[key][0];
          if (file) {
            formData.append(key, file);
          } else {
            console.warn("No file selected for:", key);
          }
        } else {
          formData.append(key, data[key]);
        }
      }

      // for (let [key, value] of formData.entries()) {
      //   console.log(`${key}:`, value);
      // }

      const response = await api.post(
        `/products/add`,
        formData
      );
      console.log("Product added:", response.data);
      handleCloseModal();
      revalidator.revalidate(); // ✅ reload loader data
    } catch (error) {
      console.error("Error adding product", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (item)=>{
    console.log("handleDeleteItem", item._id)
    const toastId = toast.loading("Removing Item...")
    try {
      const response = await api.post("/products/delete", {
        id: item._id
      });
      console.log("response delete", response)
      toast.update(toastId, {
        render: "Product Removed Successfully",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      revalidator.revalidate();
    } catch (error) {
      console.error("Error Removing Item")
      toast.update(toastId, {
        render: "Error in Removing Item",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    }
  }

  useEffect(() => {
    console.log("Data loaded:", data);
  }, []);

  return (
    <div className="relative ">
      {!addNewProduct && (
        <div className="relative">
          <div className="flex justify-between">
            <h1 className="text-2xl">Manage Products</h1>
            <button
              onClick={handleOpenModal}
              className="bg-black px-3 py-2 text-white rounded-md cursor-pointer hover:bg-gray-800 transition-colors duration-300"
            >
              Add New Product
            </button>
          </div>

          <div className="py-5 ">
            <div className="border p-2 border-gray-300 rounded-2xl overflow-auto max-w-full ">
              <Table className="text-gray-500 ">
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05] align-text-top ">
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
                      <TableCell
                        key={heading}
                        isHeader
                        className="px-5 py-3 text-xs font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                      >
                        <div className="text-md">{heading}</div>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {data.data.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="sm:px-6  px-4 py-3 text-xs text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {index + 1}
                      </TableCell>
                      <TableCell className="sm:px-6  px-4 py-3 text-xs text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        <input type="checkbox" />
                      </TableCell>
                      <TableCell className="sm:px-6  px-4 py-3 text-xs text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        <div>
                          <img
                            className="w-24 aspect-square object-cover"
                            src={`${item.image.url}`}
                            alt=""
                          />
                        </div>
                      </TableCell >
                      <TableCell className="sm:px-6  px-4 py-3 text-xs text-gray-500 text-start text-theme-sm dark:text-gray-400">Gallery</TableCell>
                      <TableCell className="sm:px-6  px-4 py-3 text-xs text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        <div>{item.name}</div>
                      </TableCell>
                      <TableCell className="sm:px-6  px-4 py-3 text-xs text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        <div>{item.stock}</div>
                      </TableCell>
                      <TableCell className="sm:px-6  px-4 py-3 text-xs text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        <div>{item.price}</div>
                      </TableCell>
                      <TableCell className="sm:px-6  px-4 py-3 text-xs text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        <div>{item.discount}</div>
                      </TableCell>
                      <TableCell className="sm:px-6  px-4 py-3 text-xs text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        <div>{item.size}</div>
                      </TableCell>
                      <TableCell className="sm:px-6  px-4 py-3 text-xs text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        Action
                        <span onClick={()=>handleDeleteItem(item)}>delete</span>
                      </TableCell>
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
                  Name <span className="text-red-400">*</span>
                </Label>
                <Controller
                  name="productName"
                  control={control}
                  rules={{ required: "Product name is required." }}
                  render={({ field, fieldState }) => (
                    <Input
                      {...field}
                      placeholder="Product Name"
                      error={!!fieldState.error}
                      hint={fieldState.error?.message}
                    />
                  )}
                />
              </div>

              {/* Price */}
              <div className="col-span-12 md:col-span-6 lg:col-span-4">
                <Label>
                  Price <span className="text-red-400">*</span>
                </Label>
                <Controller
                  name="price"
                  control={control}
                  rules={{ required: "Price is required." }}
                  render={({ field, fieldState }) => (
                    <Input
                      {...field}
                      type="number"
                      placeholder="Product Price"
                      error={!!fieldState.error}
                      hint={fieldState.error?.message}
                    />
                  )}
                />
              </div>
              {/* mrp  */}
              <div className="col-span-12 md:col-span-6 lg:col-span-4">
                <Label>
                  Mrp <span className="text-red-400">*</span>
                </Label>
                <Controller
                  name="mrp"
                  control={control}
                  rules={{ required: "MRP is required." }}
                  render={({ field, fieldState }) => (
                    <Input
                      {...field}
                      type="number"
                      placeholder="Product Price"
                      error={!!fieldState.error}
                      hint={fieldState.error?.message}
                    />
                  )}
                />
              </div>

              {/* Size */}
              <div className="col-span-12 md:col-span-6 lg:col-span-4">
                <Label>
                 Size <span className="text-red-400">*</span>
                </Label>
                <Controller
                  name="size"
                  control={control}
                  rules={{ required: "Size is required." }}
                  render={({ field, fieldState }) => (
                    <Input
                      {...field}
                      placeholder="Product Size"
                      error={!!fieldState.error}
                      hint={fieldState.error?.message}
                    />
                  )}
                />
              </div>

              {/* Category */}
              <div className="col-span-12 md:col-span-6 lg:col-span-4">
                <Label>Category</Label>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="Category" />
                  )}
                />
              </div>
              {/* Sub Category */}
              <div className="col-span-12 md:col-span-6 lg:col-span-4">
                <Label>Sub Category</Label>
                <Controller
                  name="subCategory"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="Sub Category" />
                  )}
                />
              </div>

              {/* Quantity */}
              <div className="col-span-12 md:col-span-6 lg:col-span-4">
                <Label>
                  Quantity <span className="text-red-400">*</span>
                </Label>
                <Controller
                  name="quantity"
                  control={control}
                  rules={{ required: "Quantity is required." }}
                  render={({ field, fieldState }) => (
                    <Input
                      {...field}
                      placeholder="Quantity"
                      error={!!fieldState.error}
                      hint={fieldState.error?.message}
                    />
                  )}
                />
              </div>

              {/* Product Image */}
              <div className="col-span-12 md:col-span-6 lg:col-span-4">
                <Label>
                  Image <span className="text-red-400">*</span>
                </Label>
                <Controller
                  name="productImage"
                  control={control}
                  rules={{ required: "Image is required." }}
                  render={({ field, fieldState }) => (
                    <Input
                      type="file"
                      onChange={(e) => field.onChange(e.target.files)}
                      error={!!fieldState.error}
                      hint={fieldState.error?.message}
                    />
                  )}
                />
              </div>

              {/* SKU */}
              <div className="col-span-12 md:col-span-6 lg:col-span-4">
                <Label>
                  SKU <span className="text-red-400">*</span>
                </Label>
                <Controller
                  name="sku"
                  control={control}
                  rules={{ required: "SKU is required." }}
                  render={({ field, fieldState }) => (
                    <Input
                      {...field}
                      placeholder="SKU"
                      error={!!fieldState.error}
                      hint={fieldState.error?.message}
                    />
                  )}
                />
              </div>

              {/* Tags */}
              <div className="col-span-12 md:col-span-6 lg:col-span-4">
                <Label>
                  Tags 
                </Label>
                <Controller
                  name="tags"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Tags (comma separated)"
                    />
                  )}
                />
              </div>
               {/* Category */}
              <div className="col-span-12 md:col-span-6 lg:col-span-4">
                <Label>Description</Label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <Textarea {...field} placeholder="Description" />
                  )}
                />
              </div>
            </div>

            <div className="flex justify-start space-x-2">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-black text-white rounded-md"
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
