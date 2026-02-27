import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";

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
} from "../../components/common/ui/table";
import { Trash } from "lucide-react";
import { useLoaderData } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function ManageOrders() {
  const [addNewCategory, setAddNewCategory] = useState(false);
  const [loading, setLoading] = useState(false);
  const loaderData = useLoaderData();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();



  const onSubmit = (values) => {
    console.log("Category Form Submitted: ", values);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      reset();
      setAddNewCategory(false);
    }, 1000);
  };

  const handleDeleteCategory = (category) => {
    console.log("Delete category: ", category);
  };
  useEffect(() => {
    console.log("Loader Data:", loaderData);
  },)

  if (loaderData.status === 'failed') {
    return <div className="text-red-500">{loaderData.message}</div>;
  }

  return (
    <div className="relative w-full text-black dark:text-white">
      {!addNewCategory && (
        <div className="relative">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold ">
              Manage Orders
            </h1>
            {/* <button
              onClick={() => setAddNewCategory(true)}
              className="bg-black px-4 py-2 text-white rounded-lg shadow-md cursor-pointer hover:bg-gray-800 transition-colors duration-300"
            >
              + Add New Category
            </button> */}
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-admin-dark-500 shadow-md rounded-xl border border-gray-200 dark:border-gray-500 overflow-auto mt-4">
            <Table className="text-gray-600 w-full">
              <TableHeader className="bg-admin-500 dark:bg-admin-dark-700 border-b border-b order border-gray-200 dark:border-gray-500">
                <TableRow>
                  {["Sr. No", "Customer Name", "Email", "Total Amount", "Order Status", "Payment Status", "Order Date", "Action"].map(
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
                {loaderData.data?.map((item, index) => {

                  const orderStatusColors = {
                    pending: "text-yellow-500",
                    confirmed: "text-blue-500",
                    processing: "text-indigo-500",
                    shipped: "text-purple-500",
                    delivered: "text-green-600",
                    cancelled: "text-red-600",
                    returned: "text-orange-500"
                  };

                  const paymentStatusColors = {
                    pending: "text-yellow-500",
                    paid: "text-green-600",
                    failed: "text-red-600",
                    refunded: "text-orange-500"
                  };

                  return (
                    <TableRow
                      key={item._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                    >
                      <TableCell className="px-6 py-4 text-sm font-medium">
                        {index + 1}
                      </TableCell>

                      <TableCell className="px-6 py-4 text-sm">
                        {item.user?.name}
                      </TableCell>

                      <TableCell className="px-6 py-4 text-sm">
                        {item.user?.email}
                      </TableCell>

                      <TableCell className="px-6 py-4 text-sm font-semibold">
                        ₹{item.priceSummary?.total}
                      </TableCell>

                      {/* Order Status */}
                      <TableCell
                        className={`px-6 py-4 text-sm font-medium ${orderStatusColors[item.status]}`}
                      >
                        {item.status}
                      </TableCell>

                      {/* Payment Status */}
                      <TableCell
                        className={`px-6 py-4 text-sm font-medium ${paymentStatusColors[item.paymentDetails?.status]}`}
                      >
                        {item.paymentDetails?.status}
                      </TableCell>

                      <TableCell className="px-6 py-4 text-sm">
                        {new Date(item.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'numeric',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: 'numeric',
                          second: 'numeric',
                          hour12: true
                        })}
                      </TableCell>

                      <TableCell className="px-6 py-4 text-sm space-x-2">
                        <button
                          onClick={() => navigate(`/admin/orders/${item._id}`)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          View
                        </button>

                        <button
                          onClick={() => handleDeleteOrder(item)}
                          className="text-red-500 hover:text-red-800"
                        >
                          <Trash size={18} />
                        </button>
                      </TableCell>
                    </TableRow>
                  );
                })}
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
              onClick={() => setAddNewCategory(false)}
              className="text-gray-500 hover:text-black cursor-pointer text-2xl"
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
                  name="categoryName"
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
                onClick={() => setAddNewCategory(false)}
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

export default ManageOrders;
