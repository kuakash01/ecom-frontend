import React, { useState, useEffect } from 'react';
import Form from "../../common/form/Form";
import Label from "../../common/form/Label";
import Input from "../../common/form/input/InputField";
import Textarea from "../../common/form/input/TextArea";
import Select from "../../common/form/Select";
import MultiSelect from "../../common/form/MultiSelect";


import { useForm, Controller } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useRevalidator } from "react-router-dom";
import api from '../../../config/apiAdmin';
import { useDispatch } from 'react-redux';
import { setLoading } from '../../../redux/themeSlice';

const EditProduct = ({ setMode, currentEditDetails, revalidator }) => {

  const {
    control,
    handleSubmit,
    reset,
    resetField,
    unregister,
    formState: { errors },
  } = useForm();

  const [categoryLevels, setCategoryLevels] = useState([]); // [{ options: [...], selected: null }]
  const [responseLoading, setResponseLoading] = useState(false);
  const [currentEditId, setCurrentEditId] = useState("");
  const dispatch = useDispatch();


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
      if (typeof value !== "string")
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
        console.log(`${key}:`, value,);
      }


      const url = editProduct
        ? `/admin/products/${currentEditId}`
        : `/admin/products`;

      const method = editProduct ? "patch" : "post";

      // await api[method](url, formData);

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

    }
  };

  const getRootCategories = async () => {
    try {
      const response = await api.get("/admin/categories/root");
      setCategoryLevels([{ options: response.data.data, selected: null }]);
      // console.log("Root categories fetched:", [{ options: response.data.data, selected: null }]);
    } catch (err) {
      console.error("Error fetching root categories:", err);
    }
  };




  const handleCloseModal = () => {
    setAddNewProduct(false);
    setCategoryLevels([]); // clear out old category data
    reset();
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

  const safeGet = async (url) => {
    try {
      return await api.get(url);
    } catch (err) {
      if (err.response && err.response.status === 404) return null;
      throw err;
    }
  };

  const handleEditProduct = async (product) => {
    setCurrentEditId(product._id);
    dispatch(setLoading(true));

    try {
      const categoryExistRes = await safeGet(`admin/categories/${product.category}/exist`);
      let updatedLevels = [];
      let categoryData = {};

      if (categoryExistRes && categoryExistRes.data.isPresent) {
        // Fetch full category chain if exists
        const chainRes = await api.get(`/admin/categories/${product.category}/chain`);
        const chain = chainRes.data.data;

        for (let i = 0; i < chain.length; i++) {
          const parentId = i === 0 ? null : chain[i - 1]._id;
          const res = await api.get(`/admin/categories${parentId ? `/${parentId}/children` : "/root"}`);
          updatedLevels.push({
            options: res.data.data,
            selected: chain[i],
          });
        }

        // Map selected categories into form fields
        updatedLevels.forEach((level, i) => {
          categoryData[`categoryLevel${i}`] = level.selected._id;
        });

        setCategoryLevels(updatedLevels);
      } else {
        // Category not found → load root categories instead
        console.log("Category not found, loading root categories...");
        await getRootCategories();
      }

      // Common reset for both cases
      reset({
        title: product.title || "",
        searchTags: product.searchTags?.join(", ") || "",
        filterTags: product.filterTags?.join(", ") || "",
        description: product.description || "",
        thumbnail: product.thumbnail?.url || "",
        ...categoryData, // will be empty if category not found
      });

      setMode("edit");
    } catch (error) {
      console.error("Error during edit product setup:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };




  const fetchRootCategories = async () => {
    try {
      const res = await api.get("/admin/categories/root");
      setCategoryLevels([{ options: res.data.data, selected: null }]);
    } catch (error) {
      console.error("Error fetching root categories:", error);
    }
  };

  useEffect(() => {
    if (currentEditDetails) {
      handleEditProduct(currentEditDetails);
    } else {
      fetchRootCategories();
    }
  }, [currentEditDetails]);


  return (
    <div className="relative top-0 bg-white w-full p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
      {/* reuse the same form component */}
      <Form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-12 gap-3">
          {/* Product Name */}
          <div className="col-span-12 md:col-span-6 lg:col-span-4">
            <Label>
              Title <span className="text-red-400">*</span>
            </Label>
            <Controller
              name="title"
              control={control}
              rules={{ required: "Product Title is required." }}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  placeholder="Product Title"
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


          {/* Search Tags */}
          <div className="col-span-12 md:col-span-6 lg:col-span-4">
            <Label>
              Search Tags
            </Label>
            <Controller
              name="searchTags"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Search Tags (comma separated)"
                />
              )}
            />
          </div>
          {/* Filter Tags */}
          <div className="col-span-12 md:col-span-6 lg:col-span-4">
            <Label>
              Filter Tags
            </Label>
            <Controller
              name="filterTags"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Filter Tags (comma separated)"
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
              setMode("list");
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
            setMode("list");
          }}
          className="absolute top-2 right-2 text-gray-500 hover:text-black cursor-pointer"
        >
          ✕
        </button>
      </Form>
    </div>
  )
}

export default EditProduct;
