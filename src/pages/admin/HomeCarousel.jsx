import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";

import Form from "../../components/common/form/Form";
import Label from "../../components/common/form/Label";
import Input from "../../components/common/form/input/InputField";
import Select from "../../components/common/form/Select";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "../../components/common/ui/table";
import { Trash, Pencil, X, Check } from "lucide-react";
import { useLoaderData, useRevalidator } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../config/apiAdmin";
import SingleImageUpload from "../../components/common/form/SingleImageUpload";
import SearchableSelect from "../../components/common/form/SearchSelect";

function ManageCarousel() {
  const [addNewImage, setAddNewImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const loaderData = useLoaderData();
  const revalidator = useRevalidator();

  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState("");

  const [editTypeId, setEditTypeId] = useState(null);
  const [editTypeValue, setEditTypeValue] = useState("");

  const [editValueId, setEditValueId] = useState(null);
  const [editRedirectValue, setEditRedirectValue] = useState("");

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);


  const { control, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      position: null,
      desktopImage: null,   // important
      mobileImage: null,   // important
      redirectValue: "",
      redirectType: ""
    },
  });


  const onSubmit = async (data) => {
    console.log("Form data to submit:", data); // Debug log to check form data
    try {
      setLoading(true);

      const toastId = toast.loading("Uploading Image...");

      // Build FormData
      const formData = new FormData();
      if (data.position) formData.append("position", data.position);
      formData.append("desktopImage", data.desktopImage);
      formData.append("mobileImage", data.mobileImage);
      formData.append("redirectType", data.redirectType);
      formData.append("redirectValue", data.redirectValue);




      // Hit API
      const res = await api.post("/admin/carousel", formData);

      toast.update(toastId, {
        render: res.data.message,
        type: "success",
        isLoading: false,
        autoClose: 2000
      });

      reset();
      setAddNewImage(false);
      revalidator.revalidate();

    } catch (error) {
      console.log("Error uploading carousel image", error);

      toast.error("Failed to upload image");
    } finally {
      setLoading(false);
    }
  };


  const updateRedirectType = async (id, type) => {
    try {
      const toastId = toast.loading("Updating redirect type...");

      const res = await api.post(`/admin/carousel/${id}/redirect-type`, {
        redirectType: type,
      });

      toast.update(toastId, {
        render: res.data.message,
        type: "success",
        isLoading: false,
        autoClose: 1500,
      });
      setEditRedirectValue("");
      revalidator.revalidate();

    } catch (error) {
      console.error(error);
      toast.error("Failed to update redirect type");
    }
  };

  const updateRedirectValue = async (id, value) => {
    try {
      const toastId = toast.loading("Updating redirect value...");

      const res = await api.post(`/admin/carousel/${id}/redirect-value`, {
        redirectValue: value,
      });

      toast.update(toastId, {
        render: res.data.message,
        type: "success",
        isLoading: false,
        autoClose: 1500,
      });

      revalidator.revalidate();

    } catch (error) {
      console.error(error);
      toast.error("Failed to update redirect value");
    }
  };

  const handleToggleStatus = async (item) => {
    try {
      const toastId = toast.loading("Updating Status");

      const res = await api.post(`/admin/carousel/${item._id}/status`, {
        status: !item.status
      });

      toast.update(toastId, {
        render: res.data.message,
        type: res.data.status === "success" ? "success" : "error",
        isLoading: false,
        autoClose: 2000
      });

      revalidator.revalidate();

    } catch (error) {
      console.log("Error updating carousel image status", error);
    }
  };


  const updatePosition = async (id, newPosition) => {
    try {
      const toastId = toast.loading("Updating Position...");
      const res = await api.post(`/admin/carousel/${id}/position`, {
        position: Number(newPosition)
      });

      toast.update(toastId, {
        render: res.data.message,
        type: "success",
        isLoading: false,
        autoClose: 1500
      });

      revalidator.revalidate();

    } catch (error) {
      console.log("Error updating position", error);
    }
  };

  const deleteCarouselImage = async (itemId) => {
    // show loading toast
    const toastId = toast.loading("Deleting image...");

    try {
      const res = await api.delete(`/admin/carousel/${itemId}`);
      console.log("Delete response:", res);

      // update toast with success
      toast.update(toastId, {
        render: res.data.message || "Deleted successfully",
        type: res.data.status === "success" ? "success" : "error",
        isLoading: false,
        autoClose: 3000,
      });

      revalidator.revalidate();
    } catch (error) {
      console.error("Error deleting carousel image:", error);

      // update toast with error
      toast.update(toastId, {
        render: "Internal server error",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  // fetch product list for the redirect value for type product
  useEffect(() => {
    const fetchProductsAndCategories = async () => {
      try {
        const [response1, response2] = await Promise.all([
          api.get("/admin/products/list"),
          api.get('/admin/categories')
        ]);
        // const res = await api.get("/admin/products/list");
        setProducts(response1.data.data);
        setCategories(response2.data.data);
        console.log("Products fetched for carousel redirect value:", response1.data.data);
        console.log("Categories fetched for carousel redirect value:", response2.data.data);
      } catch (err) {
        console.log(err);
        console.error("Product fetch failed");
      }
    };

    fetchProductsAndCategories();
  }, []);

  useEffect(() => {
    setValue("redirectValue", "");
  }, [watch("redirectType")]);

  return (
    <div className="relative w-full text-black dark:text-white">
      {(!addNewImage) && (
        <div className="relative">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold ">
              Manage Carousel
            </h1>
            <button
              onClick={() => setAddNewImage(true)}
              className="bg-black px-4 py-2 text-white rounded-lg shadow-md cursor-pointer hover:bg-gray-800 transition-colors duration-300"
            >
              + Add New Image
            </button>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-admin-dark-500 shadow-md rounded-xl border border-gray-200 dark:border-gray-500 overflow-auto mt-4 sm:max-w-[75vw]">
            <Table className="text-gray-600 w-full">
              <TableHeader className="bg-admin-500 dark:bg-admin-dark-700  border-b order border-gray-200 dark:border-gray-500">
                <TableRow>
                  {["Sr. No", "Desktop Image", "Mobile Image", "Redirect Type", "Redirect Value", "Position", "Status", "Action"].map(
                    (heading) => (
                      <TableCell
                        key={heading}
                        isHeader
                        className="px-5 py-3 text-xs font-medium text-gray-600 text-start text-theme-xs dark:text-gray-400"
                      >
                        {heading}
                      </TableCell>
                    )
                  )}
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05] text-black dark:text-white">
                {loaderData.data.sort((a, b) => a.position - b.position).map((item, index) => (
                  <TableRow
                    key={index}
                    className="hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  >
                    <TableCell className="px-6 py-4 text-sm font-medium">
                      {index + 1}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm">
                      <div className="w-72">
                        <img src={item?.desktopImage?.url || null} alt="" />
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm">
                      <div className="w-32">
                        <img src={item?.mobileImage?.url || null} alt="" />
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-3">
                        {editTypeId === item._id ? (
                          <div className="flex gap-2">

                            <select
                              value={editTypeValue}
                              onChange={(e) => setEditTypeValue(e.target.value)}
                              className="border rounded px-2 py-1 text-black"
                            >
                              <option value="product">Product</option>
                              <option value="category">Category</option>
                              <option value="filter">Filter</option>
                              <option value="landing">Landing</option>
                              <option value="external">External</option>
                            </select>

                            <Check
                              className="text-green-600 cursor-pointer"
                              onClick={() => {
                                updateRedirectType(item._id, editTypeValue);
                                setEditTypeId(null);
                              }}
                            />

                            <X
                              className="text-red-600 cursor-pointer"
                              onClick={() => setEditTypeId(null)}
                            />

                          </div>
                        ) : (
                          <div className="flex gap-2 items-center">
                            {item.redirectType}

                            <Pencil
                              size={14}
                              className="cursor-pointer"
                              onClick={() => {
                                setEditTypeId(item._id);
                                setEditTypeValue(item.redirectType);
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm ">
                      <div className="flex items-center gap-3 ">
                        {editValueId === item._id ? (
                          <div className="flex gap-2 items-center min-w-72">

                            {/* PRODUCT */}
                            {editTypeValue === "product" && (
                              <SearchableSelect
                                value={editRedirectValue}
                                onChange={setEditRedirectValue}
                                options={products.map((p) => ({
                                  label: p.title,
                                  value: p._id,
                                }))}
                                placeholder="Select Product"
                                className="w-44"
                              />
                            )}

                            {/* CATEGORY */}
                            {editTypeValue === "category" && (
                              <SearchableSelect
                                value={editRedirectValue}
                                onChange={setEditRedirectValue}
                                options={categories.map((c) => ({
                                  label: c.slug,
                                  value: c.slug,
                                }))}
                                placeholder="Select Category"
                                className="w-44"
                              />
                            )}

                            {/* OTHER TYPES */}
                            {["landing", "external", "filter"].includes(editTypeValue) && (
                              <input
                                type="text"
                                value={editRedirectValue}
                                onChange={(e) => setEditRedirectValue(e.target.value)}
                                className="border rounded px-2 py-1 text-black w-44"
                              />
                            )}

                            {/* SAVE */}
                            <Check
                              className="text-green-600 cursor-pointer"
                              onClick={() => {
                                updateRedirectValue(item._id, editRedirectValue);
                                setEditValueId(null);
                              }}
                            />

                            {/* CANCEL */}
                            <X
                              className="text-red-600 cursor-pointer"
                              onClick={() => setEditValueId(null)}
                            />

                          </div>
                        ) : (
                          <div className="flex gap-2 items-center">
                            {item.redirectValue}

                            <Pencil
                              size={14}
                              className="cursor-pointer"
                              onClick={() => {
                                setEditValueId(item._id);
                                setEditRedirectValue(item.redirectValue);
                                setEditTypeValue(item.redirectType);
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="px-6 py-4 text-sm">
                      {editingId === item._id ? (
                        <div className="flex items-center gap-2">

                          {/* Editable input */}
                          <input
                            type="number"
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
                            className="border p-1 w-16 rounded text-black"
                          />

                          {/* ✅ Save button */}
                          <button
                            onClick={() => {
                              updatePosition(item._id, editingValue);
                              setEditingId(null);
                            }}
                            className="text-green-600 cursor-pointer"
                          >
                            <Check />
                          </button>

                          {/* ❌ Cancel button */}
                          <button
                            onClick={() => setEditingId(null)}
                            className="text-red-600 cursor-pointer"
                          >
                            <X />
                          </button>

                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          {item.position}

                          {/* Edit icon */}
                          <Pencil
                            size={16}
                            className="cursor-pointer text-gray-600"
                            onClick={() => {
                              setEditingId(item._id);
                              setEditingValue(item.position);
                            }}
                          />
                        </div>
                      )}
                    </TableCell>

                    <TableCell className="px-6 py-4 text-sm ">
                      <div>
                        <button onClick={() => handleToggleStatus(item)} className={`${item.status ? "text-green-600" : "text-red-600"} rounded-lg cursor-pointer`}>
                          {item.status ? "Active" : "InActive"}
                        </button>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => deleteCarouselImage(item._id)}
                          className="text-red-500 hover:text-red-800 font-medium cursor-pointer"
                        >
                          <Trash size={18} />
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
      {(addNewImage) && (
        <div className="relative top-0 bg-white w-full p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Add New Banner</h2>
            <button
              onClick={() => setAddNewImage(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black cursor-pointer"
            >
              ✕
            </button>
          </div>
          <Form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-6">
                <Label>Select Mobile Image <span className="text-red-400">*</span></Label>
                <Controller
                  name="mobileImage"
                  control={control}
                  rules={{ required: "Mobile image is required." }}
                  render={({ field, fieldState }) => {

                    return (
                      <div>
                        <SingleImageUpload
                          value={field.value}
                          onChange={field.onChange}
                          multiple={false}
                          required={true}
                        />

                      </div>
                    );
                  }}
                />

              </div>

              <div className="col-span-12 md:col-span-6">
                <Label>Select Desktop Image <span className="text-red-400">*</span></Label>
                <Controller
                  name="desktopImage"
                  control={control}
                  rules={{ required: "Desktop image is required." }}
                  render={({ field, fieldState }) => {

                    return (
                      <div>
                        <SingleImageUpload
                          value={field.value}
                          onChange={field.onChange}
                          multiple={false}
                          required={true}
                        />

                      </div>
                    );
                  }}
                />

              </div>

              <div className="col-span-12 md:col-span-6">
                <Label>
                  Position
                </Label>
                <Controller
                  name="position"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Input
                      {...field}
                      placeholder="Enter Position"
                      error={!!fieldState.error}
                      hint={fieldState.error?.message}
                      type="Number"
                    />
                  )}
                />
              </div>
              <div className="col-span-12 md:col-span-6">
                <Label>
                  Redirect Type
                </Label>
                <Controller
                  name="redirectType"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Select
                      {...field}
                      placeholder="Enter Redirect Type"
                      error={!!fieldState.error}
                      hint={fieldState.error?.message}
                      options={[
                        { label: "Product", value: "product" },
                        { label: "Category", value: "category" },
                        { label: "Filter", value: "filter" },
                        { label: "Landing Page", value: "landing" },
                        { label: "External Link", value: "external" },
                      ]}
                      onChange={(value) => field.onChange(value)} // Ensure correct value is passed
                    />
                  )}
                />
              </div>
              <div className="col-span-12 md:col-span-6">
                <Label>
                  Redirect Value
                </Label>

                {watch("redirectType") === "product" ? (

                  /* PRODUCT DROPDOWN */
                  <SearchableSelect
                    value={watch("redirectValue")}
                    onChange={(val) => setValue("redirectValue", val)}
                    options={products.map((p) => ({
                      label: p.title,
                      value: p._id,
                    }))}
                    placeholder="Select Product"
                  />

                ) : watch("redirectType") === "category" ? (

                  /* CATEGORY DROPDOWN (USING SLUG) */
                  <SearchableSelect
                    value={watch("redirectValue")}
                    onChange={(val) => setValue("redirectValue", val)}
                    options={categories.map((c) => ({
                      label: c.slug,   // ✅ show slug
                      value: c.slug,   // ✅ store slug
                    }))}
                    placeholder="Select Category"
                  />

                ) : (

                  /* DEFAULT INPUT */
                  <Controller
                    name="redirectValue"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="Enter Redirect Value" />
                    )}
                  />

                )}
              </div>



            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setAddNewImage(false)}
                className="px-5 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-black text-white rounded-md shadow hover:bg-gray-800 transition cursor-pointer"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </Form>
        </div>
      )}
    </div>
  );
}

export default ManageCarousel;
