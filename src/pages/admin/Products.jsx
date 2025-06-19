import React, { useState, useEffect } from "react";
import { useLoaderData, useRevalidator } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
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

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/products/add`,
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

  useEffect(() => {
    console.log("Data loaded:", data);
  }, []);

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
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                      >
                        <div className="text-md">{heading}</div>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {data.data.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="sm:px-6  px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {index + 1}
                      </TableCell>
                      <TableCell className="sm:px-6  px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        <input type="checkbox" />
                      </TableCell>
                      <TableCell className="sm:px-6  px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        <div>
                          <img
                            className="w-24 aspect-square object-cover"
                            src={`${import.meta.env.VITE_API_URL}${item.image}`}
                            alt=""
                          />
                        </div>
                      </TableCell >
                      <TableCell className="sm:px-6  px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">Gallery</TableCell>
                      <TableCell className="sm:px-6  px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        <div>{item.name}</div>
                      </TableCell>
                      <TableCell className="sm:px-6  px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        <div>{item.stock}</div>
                      </TableCell>
                      <TableCell className="sm:px-6  px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        <div>{item.price}</div>
                      </TableCell>
                      <TableCell className="sm:px-6  px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        <div>{item.discount}</div>
                      </TableCell>
                      <TableCell className="sm:px-6  px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        <div>{item.size}</div>
                      </TableCell>
                      <TableCell className="sm:px-6  px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        Action
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
                  Product Name <span className="text-red-400">*</span>
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
                  Product Price <span className="text-red-400">*</span>
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

              {/* Size */}
              <div className="col-span-12 md:col-span-6 lg:col-span-4">
                <Label>
                  Product Size <span className="text-red-400">*</span>
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
                  Product Image <span className="text-red-400">*</span>
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
