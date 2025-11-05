import React, { useState, useEffect } from "react";
import { useLoaderData, useRevalidator } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import api from "../../config/axios"; // Import your axios instance
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux"
import { setLoading } from "../../redux/themeSlice"

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

import { Plus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";






function Products() {
  const data = useLoaderData(); // loads data from the loader function
  const revalidator = useRevalidator(); // used to revalidate the loader data after form submission
  const [addNewProduct, setAddNewProduct] = useState(false);
  const [responseLoading, setResponseLoading] = useState(false);

  // const isLoading = useSelector(state => state.theme.isloading)
  const dispatch = useDispatch();


  const [categoryLevels, setCategoryLevels] = useState([]); // [{ options: [...], selected: null }]

  // image modal states
  const [showModal, setShowModal] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [galleryPreviews, setGalleryPreviews] = useState([]);

  const [editProduct, setEditProduct] = useState(false);

  const [currentEditId, setCurrentEditId] = useState("")

  const {
    control,
    handleSubmit,
    reset,
    resetField,
    unregister,
    formState: { errors },
  } = useForm();



  const onSubmit = async (data) => {
    setResponseLoading(true);
    const toastId = toast.loading(editProduct ? "Updating Product..." : "Adding Product...");
    console.log("data", currentEditId);
    try {
      const formData = new FormData();
      const lastSelectedCategory = categoryLevels.map(l => l.selected).filter(Boolean).pop();

      if (!lastSelectedCategory) throw new Error("No category selected");

      let categoryLevel = [];
      for (const key in data) {
        if (key.startsWith("categoryLevel")) {
          categoryLevel.push({ [key]: data[key] });
        }
      }
      const value = Object.values(
        categoryLevel.reduce((a, b) => +Object.keys(a)[0].slice(13) > +Object.keys(b)[0].slice(13) ? a : b)
      )[0];
      if(typeof value !== "string")
      formData.append("category", typeof value === "string" ? value : value._id
);
      // console.log("value", value)


      for (const key in data) {
        // Handle category level separately
        if (key.startsWith("categoryLevel")) {
          categoryLevel = data[key];
          continue;
        }

        // Handle gallery separately
        if (key === "gallery") {
          data[key].forEach((item) => {
            if (item instanceof File) {
              formData.append("gallery", item); // New file
            } else {
              formData.append("existingGallery[]", item); // Existing URL
            }
          });
          continue;
        }

        // Default case
        formData.append(key, data[key]);
      }


      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }


      const url = editProduct
        ? `/admin/products/${currentEditId}`
        : `/admin/products`;

      const method = editProduct ? "patch" : "post";

      await api[method](url, formData);

      toast.update(toastId, {
        render: editProduct ? "Product Updated" : "Product Added",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      handleCloseModal();
      revalidator.revalidate();
    } catch (err) {
      console.error("Error:", err);
      toast.update(toastId, {
        render: "Something went wrong",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    } finally {
      setResponseLoading(false);
      setEditProduct(false);
      setAddNewProduct(false);
    }
  };


  const handleDeleteItem = async (item) => {
    console.log("handleDeleteItem", item._id)
    const toastId = toast.loading("Removing Item...")
    try {
      const response = await api.delete(`/admin/products/${item._id}`);
      console.log("response delete", response)

      toast.update(toastId, {
        render: response.data.message,
        type: response.data.status === "success" ? "success" : "failure",
        isLoading: false,
        autoClose: 3000,
      });
      revalidator.revalidate();
    } catch (error) {
      console.error("Error Removing Item", error)
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
  const updatedLevels = [...categoryLevels];
  updatedLevels[levelIndex].selected = selected;

  // Remove levels below current
  const removedLevels = updatedLevels.splice(levelIndex + 1);

  // Update state first
  setCategoryLevels(updatedLevels);

  // Unregister removed fields
  removedLevels.forEach((_, idx) => {
    const fieldName = `categoryLevel${levelIndex + 1 + idx}`;
    unregister(fieldName);
  });

  // Fetch children and add new level if needed
  if (selected) {
    try {
    const res = await api.get(`/admin/categories/${selected._id}/children`);
    const children = res.data.data;
    if (children.length > 0) {
      setCategoryLevels((prev) => [...prev, { options: children, selected: null }]);
    }
     } catch (error) {
      console.error("Error updating category levels:", error);
     }
  }
};





  const handleEditProduct = async (product) => {
    setCurrentEditId(product._id);
    try {


      dispatch(setLoading(true));
      // Fetch the full category chain for this product
      const chainRes = await api.get(`/admin/categories/${product.category}/chain`);
      const chain = chainRes.data.data;

      // console.log("Category Chain:", chain);

      const updatedLevels = [];

      for (let i = 0; i < chain.length; i++) {
        const parentId = i === 0 ? null : chain[i - 1]._id;

        // Fetch the sibling categories for this level
        const res = await api.get(`/admin/categories${parentId ? `/${parentId}/children` : "/root"}`);
        const children = res.data.data;



        // Match the structure of handleCategoryChange
        updatedLevels.push({
          options: children, // raw categories (with _id, name, parent)
          selected: chain[i], // raw object too
        });
      }
      dispatch(setLoading(false));


      setCategoryLevels(updatedLevels);
      console.log("Category levels set for edit:", updatedLevels);

      // Prepare autofill object
      const categoryData = {};
      updatedLevels.forEach((level, index) => {
        categoryData[`categoryLevel${index}`] = level.selected._id;
      });

      reset({
        name: product.name || "",
        price: product.price || "",
        mrp: product.mrp || "",
        size: product.size || "",
        quantity: product.quantity || "",
        sku: product.sku || "",
        tags: product.tags?.join(", ") || "",
        description: product.description || "",
        ...categoryData,
        thumbnail: product.thumbnail.url || "",
        gallery: product.gallery.map(i => i.url) || [],
      });

      setEditProduct(true);
    } catch (error) {
      console.error("Error during edit product setup:", error);
    }
  };




  const handleOpenModal = () => {
    reset({
      name: "",
      price: "",
      mrp: "",
      size: "",
      quantity: "",
      sku: "",
      tags: "",
      description: "",
      thumbnail: "",
      gallery: [],
    });
    setAddNewProduct(true);
    setEditProduct(false); // just in case
    setCategoryLevels([]); // clear out previous levels
    getRootCategories();
  };
  const handleCloseModal = () => {
    setAddNewProduct(false);
    setEditProduct(false);
    setCategoryLevels([]); // clear out old category data
    reset();
  };

  const handleOpenImagePreview = (thumbnail, gallery) => {
    setThumbnailPreview(thumbnail);
    setGalleryPreviews(gallery);
    setShowModal(true);
  }

  useEffect(() => {
    const fetchRootCategories = async () => {
      try {
        const res = await api.get("/admin/categories/root");
        setCategoryLevels([{ options: res.data.data, selected: null }]);
      } catch (error) {
        console.error("Error fetching root categories:", error);
      }
    };

    fetchRootCategories();
  }, []);


  return (
    <div className="relative w-full text-black dark:text-white">
      {/* product list */}
      {!addNewProduct && !editProduct && (
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
                    "Thumbnail",
                    "Gallery",
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
                      <div>₹{item.price}</div>
                    </TableCell>
                    <TableCell className="sm:px-6  px-4 py-3 text-xs text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div>₹{item.mrp}</div>
                    </TableCell>
                    <TableCell className="sm:px-6  px-4 py-3 text-xs text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div>{item.description}</div>
                    </TableCell>

                    <TableCell className="sm:px-6  px-4 py-3 text-xs text-gray-500 text-start text-theme-sm dark:text-gray-400 w-32">
                      {item.thumbnail?.url && <div>
                        <img
                          className="w-24 aspect-square object-cover"
                          src={`${item.thumbnail?.url}`}
                          alt=""
                        />
                      </div>}
                    </TableCell >

                    <TableCell className="sm:px-6 px-4 py-3 text-xs text-gray-500 text-start text-theme-sm dark:text-gray-400 w-32">
                      {item.thumbnail?.url && (
                        <div
                          className="relative group w-fit"
                          onClick={() =>
                            handleOpenImagePreview(
                              item.thumbnail?.url,
                              item.gallery.map((img) => img.url)
                            )
                          }
                        >

                          <img
                            className="w-24 aspect-square object-cover rounded-md shadow-sm transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                            src={`${item.gallery[0]?.url}`}
                            alt="Thumbnail"
                          />

                          {/* Subtle overlay on hover */}
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 rounded-md transition-opacity duration-300 flex items-center justify-center">
                            <span className="text-white text-[11px] font-medium">Preview</span>
                          </div>
                        </div>
                      )}
                    </TableCell>

                    <TableCell className="sm:px-6  px-4 py-3 text-xs text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div>{item.quantity}</div>
                    </TableCell>
                    <TableCell className="sm:px-6  px-4 py-3 text-xs text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div>{item.size}</div>
                    </TableCell>

                    <TableCell className="sm:px-6  px-4 py-3 text-xs text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div>{item.rating}</div>
                    </TableCell>
                    <TableCell className="sm:px-6  px-4 py-3 text-xs text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditProduct(item)}
                          className="text-blue-500 hover:text-blue-700 font-medium"
                        >
                          <Pencil size={18} />
                        </button>

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

      {/* add new product */}
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
              {/* {categoryLevels.map((level, index) => (
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
              ))} */}
              {/* Category */}
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
                        // For add product, selected can start as null
                        value={level.selected ? level.selected._id : ""}
                        onChange={(selectedId) => {
                          // Find the object for this ID
                          const selectedCategory = level.options.find(cat => cat._id === selectedId) || null;

                          // Update react-hook-form field
                          field.onChange(selectedCategory);

                          // Update categoryLevels and fetch child categories
                          handleCategoryChange(index, selectedCategory);
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
                      if (!file) return;
                      field.onChange(file);
                      setPreview(URL.createObjectURL(file));

                      // Reset input value so selecting the same file again works
                      e.target.value = "";
                    };

                    const handleRemove = () => {
                      field.onChange(null);
                      setPreview(null);
                    };

                    return (
                      <div>
                        {/* Hidden Input */}
                        <input
                          type="file"
                          id="thumbnailInput"
                          accept="image/*"
                          className="hidden"
                          onChange={handleChange}
                        />

                        {/* Thumbnail Preview or Add Button */}
                        {preview ? (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.05 }}
                            className="relative w-28 h-28 rounded-lg overflow-hidden border border-gray-300 shadow-sm group mt-2"
                          >
                            <img
                              src={preview}
                              alt="Thumbnail Preview"
                              className="object-cover w-full h-full"
                            />
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              type="button"
                              onClick={handleRemove}
                              className="absolute top-1 right-1 bg-black/60 hover:bg-black text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 size={14} />
                            </motion.button>
                          </motion.div>
                        ) : (
                          <motion.label
                            htmlFor="thumbnailInput"
                            whileHover={{ scale: 1.1 }}
                            className="mt-2 w-28 h-28 flex items-center justify-center border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:bg-gray-100"
                          >
                            <Plus className="w-6 h-6 text-gray-500" />
                          </motion.label>
                        )}

                        {/* Error Message */}
                        {fieldState.error && (
                          <p className="text-red-500 text-sm mt-1">
                            {fieldState.error.message}
                          </p>
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

                    const handleAddImages = (e) => {
                      const files = Array.from(e.target.files);
                      const newPreviews = files.map((file) => ({
                        file,
                        url: URL.createObjectURL(file),
                      }));

                      const updated = [...previews, ...newPreviews];
                      setPreviews(updated);
                      field.onChange(updated.map((p) => p.file));
                    };

                    const handleRemove = (index) => {
                      const updated = previews.filter((_, i) => i !== index);
                      setPreviews(updated);
                      field.onChange(updated.map((p) => p.file));
                    };

                    return (
                      <div>

                        {/* Hidden file input */}
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          id="galleryInput"
                          className="hidden"
                          onChange={handleAddImages}
                        />

                        {/* Gallery grid */}
                        <div className="flex flex-wrap gap-3 mt-3">
                          {previews.map((preview, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              whileHover={{ scale: 1.05 }}
                              className="relative w-28 h-28 rounded-lg overflow-hidden border border-gray-300 shadow-sm group"
                            >
                              <img
                                src={preview.url}
                                alt={`Preview ${index}`}
                                className="object-cover w-full h-full"
                              />

                              {/* Delete icon */}
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

                          {/* Add image button */}
                          <motion.label
                            htmlFor="galleryInput"
                            whileHover={{ scale: 1.1 }}
                            className="w-28 h-28 flex items-center justify-center border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:bg-gray-100"
                          >
                            <Plus className="w-6 h-6 text-gray-500" />
                          </motion.label>
                        </div>

                        {/* Error message */}
                        {fieldState.error && (
                          <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>
                        )}
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
                disabled={responseLoading}
              >
                {responseLoading ? "Saving..." : "Save"}
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
      {editProduct && (
        <div className="relative top-0 bg-white w-full p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
          {/* reuse the same form component */}
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
                    render={({ field }) => {
                      const currentValue = level.selected?._id || "";

                      return (
                        <Select
                          {...field}
                          value={currentValue}
                          options={level.options.map(cat => ({
                            value: cat._id,
                            label: cat.name,
                          }))}
                          placeholder="Select Category"
                          onChange={(value) => {
                            const selectedOption = level.options.find(cat => cat._id === value);
                            const selectedCategory = selectedOption
                              ? { _id: selectedOption._id, name: selectedOption.name }
                              : null;

                            field.onChange(selectedCategory);
                            handleCategoryChange(index, selectedCategory);
                          }}
                        />
                      );
                    }}
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
              <div className="col-span-12 md:col-span-6 lg:col-span-4">
                <Label>
                  Thumbnail <span className="text-red-400">*</span>
                </Label>

                <Controller
                  name="thumbnail"
                  control={control}
                  rules={{ required: "Thumbnail is required." }}
                  render={({ field, fieldState }) => {
                    const [preview, setPreview] = React.useState(
                      typeof field.value === "string" ? field.value : null
                    );

                    React.useEffect(() => {
                      if (typeof field.value === "string") setPreview(field.value);
                    }, [field.value]);

                    const handleChange = (e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      field.onChange(file);
                      setPreview(URL.createObjectURL(file));
                      e.target.value = "";
                    };

                    const handleRemove = () => {
                      field.onChange(null);
                      setPreview(null);
                    };

                    return (
                      <div>
                        <input
                          type="file"
                          id="thumbnailInput"
                          accept="image/*"
                          className="hidden"
                          onChange={handleChange}
                        />

                        {preview ? (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.05 }}
                            className="relative w-28 h-28 rounded-lg overflow-hidden border border-gray-300 shadow-sm group mt-2"
                          >
                            <img
                              src={preview}
                              alt="Thumbnail Preview"
                              className="object-cover w-full h-full"
                            />
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              type="button"
                              onClick={handleRemove}
                              className="absolute top-1 right-1 bg-black/60 hover:bg-black text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 size={14} />
                            </motion.button>
                          </motion.div>
                        ) : (
                          <motion.label
                            htmlFor="thumbnailInput"
                            whileHover={{ scale: 1.1 }}
                            className="mt-2 w-28 h-28 flex items-center justify-center border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:bg-gray-100"
                          >
                            <Plus className="w-6 h-6 text-gray-500" />
                          </motion.label>
                        )}

                        {fieldState.error && (
                          <p className="text-red-500 text-sm mt-1">
                            {fieldState.error.message}
                          </p>
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
                    const [previews, setPreviews] = React.useState(

                      Array.isArray(field.value)
                        ? field.value.map((url) => ({ file: null, url }))
                        : []
                    );

                    React.useEffect(() => {
                      if (Array.isArray(field.value)) {
                        setPreviews(
                          field.value.map((item) =>
                            typeof item === "string"
                              ? { file: null, url: item }
                              : { file: item, url: URL.createObjectURL(item) }
                          )
                        );
                      }
                    }, [field.value]);


                    const handleAddImages = (e) => {
                      const files = Array.from(e.target.files);
                      const newPreviews = files.map((file) => ({
                        file,
                        url: URL.createObjectURL(file),
                      }));
                      const updated = [...previews, ...newPreviews];
                      setPreviews(updated);
                      field.onChange(
                        updated.map((p) => (p.file ? p.file : p.url))
                      );
                    };

                    const handleRemove = (index) => {
                      const updated = previews.filter((_, i) => i !== index);
                      setPreviews(updated);
                      field.onChange(updated.map((p) => (p.file ? p.file : p.url)));
                    };

                    return (
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          id="galleryInput"
                          className="hidden"
                          onChange={handleAddImages}
                        />

                        <div className="flex flex-wrap gap-3 mt-3">
                          {previews.map((preview, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              whileHover={{ scale: 1.05 }}
                              className="relative w-28 h-28 rounded-lg overflow-hidden border border-gray-300 shadow-sm group"
                            >
                              <img
                                src={preview.url}
                                alt={`Preview ${index}`}
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

                          <motion.label
                            htmlFor="galleryInput"
                            whileHover={{ scale: 1.1 }}
                            className="w-28 h-28 flex items-center justify-center border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:bg-gray-100"
                          >
                            <Plus className="w-6 h-6 text-gray-500" />
                          </motion.label>
                        </div>

                        {fieldState.error && (
                          <p className="text-red-500 text-sm mt-1">
                            {fieldState.error.message}
                          </p>
                        )}
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
                onClick={() => {
                  setEditProduct(false);
                }}
                className="px-4 py-2 bg-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-black text-white rounded-md"
                disabled={responseLoading}
              >
                {responseLoading ? "Saving..." : "Save"}
              </button>
            </div>
            <button
              onClick={() => {
                setEditProduct(false);
              }}
              className="absolute top-2 right-2 text-gray-500 hover:text-black cursor-pointer"
            >
              ✕
            </button>
          </Form>
        </div>
      )}

      {/* image modal */}
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
