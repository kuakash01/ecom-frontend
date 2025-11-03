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
import Select from "../../components/common/form/Select";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "../../components/common/ui/table/index";
import { Trash, Pencil } from "lucide-react";
import ImagePreviewModal from "../../components/common/modal/ImagePreviewModal";

function Products() {
  const data = useLoaderData(); // loads data from the loader function
  const revalidator = useRevalidator(); // used to revalidate the loader data after form submission
  const [addNewProduct, setAddNewProduct] = useState(false);
  const [loading, setLoading] = useState(false);

  const [categoryLevels, setCategoryLevels] = useState([]); // [{ options: [...], selected: null }]

  // image modal states
  const [showModal, setShowModal] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [galleryPreviews, setGalleryPreviews] = useState([]);



  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();


  const onSubmit = async (data) => {
    setLoading(true);


    try {
      // console.log("Submitted data:", data);
      const formData = new FormData();

      const lastSelectedCategory = categoryLevels
        .map((lvl) => lvl.selected)
        .filter(Boolean)
        .pop() || null;

      if (!lastSelectedCategory) {
        toast.error("Please select a category");
        setLoading(false);
        return;
      }

      // ✅ Append only the last category ID
      formData.append("category", lastSelectedCategory);

      for (const key in data) {
        if (key.startsWith("categoryLevel")) continue; // skip all dropdowns


        if (key === "thumbnail") {
          const file = data[key] && data[key];
          if (file) {
            formData.append(key, file);
          } else {
            console.warn("No file selected for:", key);
          }
        } else if (key === "gallery") {
          const files = data[key];
          if (files && files.length > 0) {
            files.forEach((file) => {
              formData.append(key, file);
            });
          } else {
            console.warn("No files selected for:", key);
          }
        } else {
          formData.append(key, data[key]);
        }
      }

      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const toastId = toast.loading("Adding Product...");

      const response = await api.post(
        `/admin/products`,
        formData
      );
      console.log("Product added:", response.data);
      handleCloseModal();
      toast.update(toastId, {
        render: "Product Added Successfully",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      revalidator.revalidate(); // ✅ reload loader data
    } catch (error) {
      console.error("Error adding product", error);
      toast.update(toastId, {
        render: "Error in adding product",
        type: "failure",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (item) => {
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

  const getRootCategories = async () => {
    try {
      const response = await api.get("/admin/categories/root");
      setCategoryLevels([{ options: response.data.data, selected: null }]);
      console.log("Root categories fetched:", [{ options: response.data.data, selected: null }]);
    } catch (err) {
      console.error("Error fetching root categories:", err);
    }
  };


  const handleCategoryChange = async (levelIndex, selected) => {
    try {
      // Update the current selection
      const updatedLevels = [...categoryLevels];
      updatedLevels[levelIndex].selected = selected;

      // Remove any levels below this one (in case user goes back and changes)
      updatedLevels.splice(levelIndex + 1);

      // Fetch children for the selected category
      const res = await api.get(`/admin/categories/${selected}/children`);
      const children = res.data.data;

      // If there are subcategories, add a new level
      if (children.length > 0) {
        updatedLevels.push({ options: children, selected: null });
      }

      setCategoryLevels(updatedLevels);
    } catch (error) {
      console.error("Error fetching next-level categories:", error);
    }
  };


  const handleOpenModal = () => {
    setAddNewProduct(true);
    getRootCategories();
  };
  const handleCloseModal = () => {
    setAddNewProduct(false);
    reset();
  };

  const handleOpenImagePreview = (thumbnail, gallery) => {
    setThumbnailPreview(thumbnail);
    setGalleryPreviews(gallery);
    setShowModal(true);
  }


  return (
    <div className="relative w-full text-black dark:text-white">
      {!addNewProduct && (
        <div className="relative">
          <div className="flex justify-between">
            <h1 className="text-2xl  font-bold ">Manage Products</h1>
            <button
              onClick={handleOpenModal}
              className="bg-black px-3 py-2 text-white rounded-md cursor-pointer hover:bg-gray-800 transition-colors duration-300"
            >
              + Add New Product
            </button>
          </div>

          <div className="bg-white dark:bg-admin-dark-500 shadow-md rounded-xl border border-gray-200 dark:border-gray-500 overflow-auto mt-4">
            <Table className="text-gray-600 w-full">
              <TableHeader className="bg-admin-500 dark:bg-admin-dark-700 border-b order border-gray-200 dark:border-gray-500">
                <TableRow>
                  {[
                    "Sr. no",
                    "Product Name",
                    "Price",
                    "Mrp",
                    "Description",
                    "Product Image",
                    "Product Gallery",
                    "Stock",
                    "Size",
                    "Rating",
                    "Action",
                  ].map((heading) => (
                    <TableCell
                      key={heading}
                      isHeader
                      className="px-5 py-3 text-xs font-medium text-gray-600 text-start text-theme-xs dark:text-gray-400"
                    >
                      <div className="text-md">{heading}</div>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05] text-black dark:text-white">
                {data.data.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="sm:px-6  px-4 py-3 text-xs text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {index + 1}
                    </TableCell>
                    <TableCell className="sm:px-6  px-4 py-3 text-xs text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div>{item.name}</div>
                    </TableCell>
                    <TableCell className="sm:px-6  px-4 py-3 text-xs text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div>{item.price}</div>
                    </TableCell>
                    <TableCell className="sm:px-6  px-4 py-3 text-xs text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div>{item.mrp}</div>
                    </TableCell>
                    <TableCell className="sm:px-6  px-4 py-3 text-xs text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div>{item.description}</div>
                    </TableCell>

                    <TableCell className="sm:px-6  px-4 py-3 text-xs text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {item.thumbnail?.url && <div>
                        <img
                          className="w-24 aspect-square object-cover"
                          src={`${item.thumbnail?.url}`}
                          alt=""
                        />
                      </div>}
                    </TableCell >
                    <TableCell className="sm:px-6  px-4 py-3 text-xs text-gray-500 text-start text-theme-sm dark:text-gray-400"> {item.thumbnail?.url && <div>
                        <img
                          className="w-24 aspect-square object-cover"
                          src={`${item.thumbnail?.url}`}
                          alt=""
                        />
                      </div>}</TableCell>
                    <TableCell className="sm:px-6  px-4 py-3 text-xs text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div>{item.stock}</div>
                    </TableCell>
                    <TableCell className="sm:px-6  px-4 py-3 text-xs text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div>{item.size}</div>
                    </TableCell>

                    <TableCell className="sm:px-6  px-4 py-3 text-xs text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div>{item.rating}</div>
                    </TableCell>
                    <TableCell className="sm:px-6  px-4 py-3 text-xs text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div className="flex space-x-2">
                        <button className="text-blue-500 hover:text-blue-700 font-medium"><Pencil size={18} /></button>
                        <button onClick={() => handleDeleteItem(item)} className="text-red-500 hover:text-red-700 font-medium">
                          <Trash size={18} className="text-red-500" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
                  name="name"
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


              {/*  Category */}
              {categoryLevels.map((level, index) => (
                <div
                  key={index}
                  className="col-span-12 md:col-span-6 lg:col-span-4"
                >
                  <Label>
                    {index === 0 ? "Category" : `Subcategory Level ${index}`}
                    <span className="text-red-400">*</span>
                  </Label>
                  <Controller
                    name={`categoryLevel${index}`}
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={level.options.map(cat => ({
                          value: cat._id,
                          label: cat.name,
                        }))}
                        placeholder="Select Category"
                        value={level.selected}
                        onChange={(selected) => {
                          field.onChange(selected);
                          handleCategoryChange(index, selected);
                        }}
                      />
                    )}
                  />
                </div>
              ))}



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
              {/* <div className="col-span-12 md:col-span-6 lg:col-span-4">
                <Label>
                  Thumbnail <span className="text-red-400">*</span>
                </Label>
                <Controller
                  name="thumbnail"
                  control={control}
                  rules={{ required: "Thumbnail is required." }}
                  render={({ field, fieldState }) => (
                    <Input
                      type="file"
                      onChange={(e) => field.onChange(e.target.files)}
                      error={!!fieldState.error}
                      hint={fieldState.error?.message}
                    />
                  )}
                />
              </div> */}

              {/* Gallery Image */}
              {/* <div className="col-span-12 md:col-span-6 lg:col-span-4">
                <Label>
                  Gallery
                </Label>
                <Controller
                  name="gallery"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Input
                      type="file"
                      onChange={(e) => field.onChange(e.target.files)}
                      error={!!fieldState.error}
                      hint={fieldState.error?.message}
                      multiple={true}
                    />
                  )}
                />
              </div> */}

              {/* Product Image */}
              <div className="col-span-12 md:col-span-6 lg:col-span-4">
                <Label>
                  Thumbnail <span className="text-red-400">*</span>
                </Label>
                <Controller
                  name="thumbnail"
                  control={control}
                  rules={{ required: "Thumbnail is required." }}
                  render={({ field, fieldState }) => {
                    const [preview, setPreview] = React.useState(null);

                    const handleChange = (e) => {
                      const file = e.target.files[0];
                      field.onChange(file);
                      setPreview(file ? URL.createObjectURL(file) : null);
                    };

                    return (
                      <div>
                        <Input
                          type="file"
                          onChange={handleChange}
                          error={!!fieldState.error}
                          hint={fieldState.error?.message}
                        />
                        {preview && (
                          <img
                            src={preview}
                            alt="Thumbnail Preview"
                            className="mt-2 w-24 h-24 object-cover rounded-md border"
                          />
                        )}
                      </div>
                    );
                  }}
                />
              </div>

              {/* Gallery Image */}
              <div className="col-span-12 md:col-span-6 lg:col-span-4">
                <Label>Gallery</Label>
                <Controller
                  name="gallery"
                  control={control}
                  render={({ field, fieldState }) => {
                    const [previews, setPreviews] = React.useState([]);

                    const handleChange = (e) => {
                      const files = Array.from(e.target.files);
                      field.onChange(files);
                      const urls = files.map((file) => URL.createObjectURL(file));
                      setPreviews(urls);
                    };

                    return (
                      <div>
                        <Input
                          type="file"
                          multiple
                          onChange={handleChange}
                          error={!!fieldState.error}
                          hint={fieldState.error?.message}
                        />
                        <div className="flex flex-wrap gap-2 mt-2">
                          {previews.map((src, i) => (
                            <img
                              key={i}
                              src={src}
                              alt={`Gallery Preview ${i + 1}`}
                              className="w-20 h-20 object-cover rounded-md border"
                            />
                          ))}
                        </div>
                      </div>
                    );
                  }}
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
              {/* Description */}
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

      <ImagePreviewModal
        show={showModal}
        onClose={() => setShowModal(false)}
        thumbnail={thumbnailPreview}
        gallery={galleryPreviews}
      />
    </div>
  );
}





export default Products;
