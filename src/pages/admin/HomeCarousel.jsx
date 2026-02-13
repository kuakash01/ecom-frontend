import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";

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
} from "../../components/common/ui/table";
import { Trash, Pencil, X, Check } from "lucide-react";
import { useLoaderData, useRevalidator } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../config/apiAdmin";
import SingleImageUpload from "../../components/common/form/SingleImageUpload";

function ManageCarousel() {
  const [addNewImage, setAddNewImage] = useState(false);
  const [currentEditCategory, setCurrentEditCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const loaderData = useLoaderData();
  const revalidator = useRevalidator();

  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState("");


  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      position: null,
      image: null,   // important
    },
  });


  const onSumbit = async (data) => {
    try {
      setLoading(true);

      const toastId = toast.loading("Uploading Image...");

      // Build FormData
      const formData = new FormData();
      if (data.position) formData.append("position", data.position);
      formData.append("image", data.image); // your ImageUpload gives actual File

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


  return (
    <div className="relative w-full text-black dark:text-white">
      {(!addNewImage) && (
        <div className="relative">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold ">
              Manage Categories
            </h1>
            <button
              onClick={() => setAddNewImage(true)}
              className="bg-black px-4 py-2 text-white rounded-lg shadow-md cursor-pointer hover:bg-gray-800 transition-colors duration-300"
            >
              + Add New Image
            </button>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-admin-dark-500 shadow-md rounded-xl border border-gray-200 dark:border-gray-500 overflow-auto mt-4">
            <Table className="text-gray-600 w-full">
              <TableHeader className="bg-admin-500 dark:bg-admin-dark-700 border-b border-b order border-gray-200 dark:border-gray-500">
                <TableRow>
                  {["Sr. No", "Image", "Position", "Status", "Action"].map(
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
                        <img src={item.image.url} alt="" />
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
            <h2 className="text-xl font-semibold">Add New Category</h2>
            <button
              onClick={() => setAddNewImage(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black cursor-pointer"
            >
              ✕
            </button>
          </div>
          <Form onSubmit={handleSubmit(onSumbit)} className="space-y-5">
            <div className="grid grid-cols-12 gap-4">
              {/* Category Name */}
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
                <Label>Select Image <span className="text-red-400">*</span></Label>
                <Controller
                  name="image"
                  control={control}
                  rules={{ required: "Thumbnail is required." }}
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
