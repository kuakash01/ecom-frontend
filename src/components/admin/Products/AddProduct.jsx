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
import api from '../../../config/apiAdmin';
import VariationsSection from "./VariationsSection";

const AddProducts = ({ setMode, revalidator }) => {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    unregister,
    formState: { errors },
  } = useForm();

  const [categoryLevels, setCategoryLevels] = useState([]); // [{ options: [...], selected: null }]
  const [responseLoading, setResponseLoading] = useState(false);
  const [colorOptions, setColorOptions] = useState([]);
  const [sizeOptions, setSizeOptions] = useState([]);

  const onSubmit = async (data) => {
    console.log("Form Data:", data);
    setResponseLoading(true);
    const toastId = toast.loading("Adding Product...");

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

        if (key === "variations") {
          formData.append("variations", JSON.stringify(data[key]));
          continue;
        }

        if (key === "variationColor" || key === "variationSize") continue;

        // Default case
        formData.append(key, data[key]);
      }

      // for (let [key, value] of formData.entries()) {

      //   // Print color galleries with color ID
      //   if (key.startsWith("colorGalleries_")) {
      //     const colorId = key.split("_")[1].replace("[]", "");
      //     console.log(`Color ID: ${colorId} -> Gallery File:`, value);
      //     continue;
      //   }

      //   // Print variations array (clean JSON)
      //   if (key === "variations") {
      //     try {
      //       const variations = JSON.parse(value);
      //       console.log("Variations:", variations);
      //     } catch (err) {
      //       console.log("Variations (raw):", value);
      //     }
      //     continue;
      //   }

      //   // Default (only if you want)
      //   console.log(key, value);
      // }




      const response = await api.post(`/admin/products`, formData);

      toast.update(toastId, {
        render: response.data.message,
        type: response.data.status === "success" ? "success" : "error",
        isLoading: false,
        autoClose: 2000,
        closeButton: true
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
        closeButton: true,
      });
    } finally {
      setResponseLoading(false);
    }
  };


  const handleCloseModal = () => {
    setMode("list");
    // setCategoryLevels([]); // clear out old category data
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


  const getColors = async () => {
    try {
      const res = await api.get("/admin/colors");
      setColorOptions(res.data.data.map(c => { return { label: c.colorName, value: c._id } }));

    } catch (error) {
      console.error("Error fetching colors:", error);
    }
  }
  const getSizes = async () => {
    try {
      const res = await api.get("/admin/sizes");
      setSizeOptions(res.data.data.map(s => { return { label: s.sizeName, value: s._id } }));

    } catch (error) {
      console.error("Error fetching sizes:", error);
    }
  }

  const fetchRootCategories = async () => {
    try {
      const res = await api.get("/admin/categories/root");
      setCategoryLevels([{ options: res.data.data, selected: null }]);
    } catch (error) {
      console.error("Error fetching root categories:", error);
    }
  };
  useEffect(() => {
    fetchRootCategories();
    getColors();
    getSizes();

  }, []);


  return <div className="relative top-0 bg-white w-full p-6 rounded-xl shadow-lg">
    <h2 className="text-xl font-semibold mb-4">Add New Product</h2>

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
              rules={{ required: index === 0 ? "Category is required." : `Subcategory Level ${index} is required.` }}
              render={({ field, fieldState }) => (
                <Select
                  {...field}
                  options={level.options.map(cat => ({
                    value: cat._id,
                    label: cat.name,
                  }))}
                  placeholder="Select Category"
                  // For add product, selected can start as null
                  value={level.selected ? level.selected._id : ""}
                  error={!!fieldState.error}
                  hint={fieldState.error?.message}
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
                    <p className="text-error-500 text-xs mt-1">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              );
            }}
          />
        </div>


        {/* search Tags */}
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
        {/* filter Tags */}
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
        <div className=" border-y p-2 border-stone-400 col-span-12 text-center text-xl font-bold">Variations</div>
        {/* Variation Colors */}
        <div className="col-span-12 md:col-span-6 lg:col-span-4">
          <Label>
            Variations Color
          </Label>
          <Controller
            name="variationColor"
            control={control}
            render={({ field }) => (
              <MultiSelect
                options={colorOptions}

                {...field}
                placeholder="Select Variants"
              />
            )}
          />
        </div>
        {/* Variation Sizes */}
        <div className="col-span-12 md:col-span-6 lg:col-span-4">
          <Label>
            Variations Size
          </Label>
          <Controller
            name="variationSize"
            control={control}
            render={({ field }) => (
              <MultiSelect
                options={sizeOptions}

                {...field}
                placeholder="Select Variants"
              />
            )}
          />
        </div>


        <VariationsSection control={control} watch={watch} sizeOptions={sizeOptions} colorOptions={colorOptions} />

        {/* <div className='col-span-12  flex items-center justify-center  '>
          <button onClick={() => { }} className='text-black bg-gray-200 rounded-xl p-2'>Generate Variations</button>
        </div> */}



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
        // disabled={responseLoading} 
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
  </div>;
}

export default AddProducts;

