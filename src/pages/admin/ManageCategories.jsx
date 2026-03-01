import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";

import Form from "../../components/common/form/Form";
import Label from "../../components/common/form/Label";
import Input from "../../components/common/form/input/InputField";
import Textarea from "../../components/common/form/input/TextArea";
import Select from "../../components/common/form/Select";
import SingleImageUpload from "../../components/common/form/SingleImageUpload"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "../../components/common/ui/table";
import { Trash, Pencil } from "lucide-react";
import { useLoaderData } from "react-router-dom";
import { toast } from "react-toastify";
import { useRevalidator } from "react-router-dom";
import api from "../../config/apiAdmin";

function ManageCategories() {
  const [addNewCategory, setAddNewCategory] = useState(false);
  const [editCategory, setEditCategory] = useState(false);
  const [currentEditCategory, setCurrentEditCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const loaderData = useLoaderData();
  const revalidator = useRevalidator();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();



  const onSubmit = async (values) => {
    console.log("Category Form Submitted: ", values);
    setLoading(true);

    const toastId = toast.loading("Adding category...");

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("parent", values.parent || "");
    formData.append("slug", values.slug);

    // Append single image if it exists
    if (values.image) {
      formData.append("image", values.image); // values.image is a File object
    }
    try {
      const response = await api.post('/admin/categories', formData);
      console.log("Category added successfully:", response.data);
      toast.update(toastId, {
        render: response.data.message,
        type: "success",
        isLoading: false,
        autoClose: 3000
      });
      reset({
        name: "",
        parent: "",
        slug: "",
        description: "",
        image: null
      });
      setAddNewCategory(false);
      setLoading(false);
      revalidator.revalidate();
    } catch (error) {
      console.error("Error adding category:", error);
      setLoading(false);
      toast.update(toastId, {
        render: "Failed to add category. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 3000
      });
    }

  };

  const handleDeleteCategory = async (categoryId) => {
    console.log("Delete category: ", categoryId);
    try {
      const toastId = toast.loading("Deleting category...");
      const response = await api.delete(`/admin/categories/${categoryId}`);

      toast.update(toastId, {
        render: response.data.message,
        type: "success",
        isLoading: false,
        autoClose: 3000
      });
      revalidator.revalidate();
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category. Please try again.");
    }
  };

  const handleSetEditCategory = (category) => {

    try {
      const parentCategory = loaderData.data.find(cat => cat._id === category.parent);
      console.log("Found parent category:", parentCategory);
      if (category) {
        setCurrentEditCategory(category);
        setAddNewCategory(false);
        setEditCategory(true); // your "mode" flag
        reset({
          id: category._id || "",
          name: category.name || "",
          description: category.description || "",
          slug: category.slug,
          parent: parentCategory ? parentCategory._id : null,
          image: category.image?.url || ""
        });
      }
    } catch (error) {
      console.error("Error setting edit category:", error);
    }
  };



  const handleEditCategory = async (values) => {
    console.log("Edit category: ", values);

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("parent", values.parent || "");
    formData.append("slug", values.slug);

    // Append single image if it exists
    if (typeof values.image === "object") {
      formData.append("image", values.image); // values.image is a File object
    }
    const toastId = toast.loading("Editing category...");
    try {
      const response = await api.patch(`/admin/categories/${values.id}`, formData);
      setEditCategory(false);
      toast.update(toastId, {
        render: response.data.message,
        type: "success",
        isLoading: false,
        autoClose: 3000,
        closeButton: true
      });
      revalidator.revalidate();
    } catch (error) {
      console.error("Error updating category:", error);
      toast.update(toastId, {
        render: "something went wrong",
        type: "error",
        isLoading: false,
        autoClose: 3000,
        closeButton: true
      });
    }
  };


  const handleAddCategory = (state) => {
    reset({
      id: "",
      name:"",
      description: "",
      slug: "",
      parent: "",
      image: null
    });
    setAddNewCategory(state);
  };


  if (loaderData.status === 'failed') {
    return <div className="text-red-500">{loaderData.message}</div>;
  }

  return (
    <div className="relative w-full text-black dark:text-white">
      {(!addNewCategory && !editCategory) && (
        <div className="relative">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold ">
              Manage Categories
            </h1>
            <button
              onClick={() => handleAddCategory(true)}
              className="bg-black px-4 py-2 text-white rounded-lg shadow-md cursor-pointer hover:bg-gray-800 transition-colors duration-300"
            >
              + Add New Category
            </button>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-admin-dark-500 shadow-md rounded-xl border border-gray-200 dark:border-gray-500 overflow-auto mt-4">
            <Table className="text-gray-600 w-full">
              <TableHeader className="bg-admin-500 dark:bg-admin-dark-700  border-b order border-gray-200 dark:border-gray-500">
                <TableRow>
                  {["Sr. No", "Image", "Category Name", "Parent Category", "Slug", "Description", "Action"].map(
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
                {loaderData?.data.map((item, index) => (
                  <TableRow
                    key={item._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  >
                    <TableCell className="px-6 py-4 text-sm font-medium">
                      {index + 1}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm font-medium">
                      <div className="w-52">
                        <img className="w-full aspect-square object-cover" src={item?.image?.url || (`${import.meta.env.VITE_BASE_URL}/images/defaultimage/no-image.jpg`)} alt="category image" />
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm">
                      {item.name}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm ">
                      {loaderData.data.find(cat => cat._id === item.parent)?.name || "—"}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm ">
                      {item.slug}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm ">
                      {item.description}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleSetEditCategory(item)}
                          className="text-blue-500 hover:text-blue-800 font-medium cursor-pointer"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(item._id)}
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

      {/* Add New Category Form */}
      {addNewCategory && (
        <div className="relative top-0 bg-white w-full p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Add New Category</h2>
            <button
              onClick={() => handleAddCategory(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black cursor-pointer"
            >
              ✕
            </button>
          </div>

          <Form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-12 gap-4">
              {/* Category Name */}
              <div className="col-span-12 md:col-span-6">
                <Label>
                  Category Name <span className="text-red-400">*</span>
                </Label>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: "Category name is required." }}
                  render={({ field, fieldState }) => (
                    <Input
                      {...field}
                      placeholder="Enter Category Name"
                      error={!!fieldState.error}
                      hint={fieldState.error?.message}
                    />
                  )}
                />
              </div>

              {/* Parent Category */}
              <div className="col-span-12 md:col-span-6">
                <Label>
                  Parent Category
                </Label>
                <Controller
                  name="parent"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Select
                      {...field}
                      defaultValue={field.value}
                      options={loaderData.data.map(cat => ({ value: cat._id, label: cat.name }))}
                      placeholder="Select Parent Category"
                      error={!!fieldState.error}
                      hint={fieldState.error?.message}
                    />
                  )}
                />
              </div>
              {/* Image */}
              <div className="col-span-12 md:col-span-6">
                <Label>
                  Image (upload if root category)
                </Label>
                <Controller
                  name="image"
                  control={control}
                  render={({ field, fieldState }) => (
                    <SingleImageUpload
                      onChange={field.onChange}
                      value={field.value}
                    />

                  )}
                />
              </div>
              {/* Slug */}
              <div className="col-span-12 md:col-span-6">
                <Label>
                  Slug <span className="text-red-400">*</span>
                </Label>
                <Controller
                  name="slug"
                  control={control}
                  rules={{ required: "Slug is required." }}
                  render={({ field, fieldState }) => (
                    <Input
                      {...field}
                      placeholder="Enter Slug (do not use space)"
                      error={!!fieldState.error}
                      hint={fieldState.error?.message}
                    />
                  )}
                />
              </div>

              {/* Description */}
              <div className="col-span-12">
                <Label>Description</Label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <Textarea {...field} placeholder="Enter Description" />
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => handleAddCategory(false)}
                className="px-5 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-black text-white rounded-md shadow hover:bg-gray-800 transition"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </Form>
        </div>
      )}


      {/* Edit Category Form */}
      {editCategory && (
        <div className="relative top-0 bg-white w-full p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Edit Category</h2>
            <button
              onClick={() => setEditCategory(false)}
              className="text-gray-500 hover:text-black cursor-pointer text-2xl"
            >
              ✕
            </button>
          </div>

          <Form onSubmit={handleSubmit(handleEditCategory)} className="space-y-5">
            <div className="grid grid-cols-12 gap-4">
              {/* Category Name */}
              <div className="col-span-12 md:col-span-6">
                <Label>
                  Category Name <span className="text-red-400">*</span>
                </Label>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: "Category name is required." }}
                  render={({ field, fieldState }) => (
                    <Input
                      {...field}
                      placeholder="Enter Category Name"
                      error={!!fieldState.error}
                      hint={fieldState.error?.message}
                    />
                  )}
                />
              </div>

              {/* Parent Category */}
              <div className="col-span-12 md:col-span-6">
                <Label>
                  Parent Category
                </Label>
                <Controller
                  name="parent"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Select
                      {...field}
                      defaultValue={field.value || ""}
                      options={loaderData.data.filter(cat => cat._id !== currentEditCategory?._id).map(cat => ({ value: cat._id, label: cat.name }))}
                      placeholder="Select Parent Category"
                      error={!!fieldState.error}
                      hint={fieldState.error?.message}
                    />
                  )}
                />
              </div>

              {/* Image */}
              <div className="col-span-12 md:col-span-6">
                <Label>
                  Image (upload if root category)
                </Label>
                <Controller
                  name="image"
                  control={control}
                  render={({ field, fieldState }) => (
                    <SingleImageUpload
                      onChange={field.onChange}
                      value={field.value}
                    />

                  )}
                />
              </div>

              {/* Slug */}
              <div className="col-span-12 md:col-span-6">
                <Label>
                  Slug <span className="text-red-400">*</span>
                </Label>
                <Controller
                  name="slug"
                  control={control}
                  rules={{ required: "Slug is required." }}
                  render={({ field, fieldState }) => (
                    <Input
                      {...field}
                      placeholder="Enter Slug"
                      error={!!fieldState.error}
                      hint={fieldState.error?.message}
                    />
                  )}
                />
              </div>

              {/* Description */}
              <div className="col-span-12">
                <Label>Description</Label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <Textarea {...field} placeholder="Enter Description" />
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setEditCategory(false)}
                className="px-5 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-black text-white rounded-md shadow hover:bg-gray-800 transition"
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

export default ManageCategories;
