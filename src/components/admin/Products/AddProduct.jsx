import React, { useState, useEffect } from 'react';
import Form from "../../common/form/Form";
import Label from "../../common/form/Label";
import Input from "../../common/form/input/InputField";
import Textarea from "../../common/form/input/TextArea";
import Select from "../../common/form/Select";
import SearchSelect from "../../common/form/SearchSelect";
import { useForm, Controller } from "react-hook-form";
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
      const lastSelectedCategory = categoryLevels
        .map((l) => l.selected)
        .filter(Boolean)
        .pop();

      if (!lastSelectedCategory) {
        throw new Error("No category selected");
      }

      // Get highest category level value
      let categoryLevelKeys = Object.keys(data).filter((key) =>
        key.startsWith("categoryLevel")
      );

      if (categoryLevelKeys.length === 0) {
        throw new Error("No category level found");
      }

      const highestKey = categoryLevelKeys.reduce((a, b) =>
        +a.slice(13) > +b.slice(13) ? a : b
      );

      const categoryValue = data[highestKey];

      // Prepare JSON payload
      const payload = {};

      for (const key in data) {
        // Skip category levels (we handle separately)
        if (key.startsWith("categoryLevel")) continue;

        if (key === "variationColor" || key === "variationSize") continue;

        if (key === "variations") {
          payload.variations = data.variations;
          continue;
        }

        payload[key] = data[key];
      }

      // Add category properly
      payload.category =
        typeof categoryValue === "string"
          ? categoryValue
          : categoryValue?._id;

      const response = await api.post("/admin/products", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      toast.update(toastId, {
        render: response.data.message,
        type: response.data.status === "success" ? "success" : "error",
        isLoading: false,
        autoClose: 2000,
        closeButton: true,
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
              <SearchSelect
                options={colorOptions}
                multiple={true}

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
              <SearchSelect
                options={sizeOptions}
                multiple={true}
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

