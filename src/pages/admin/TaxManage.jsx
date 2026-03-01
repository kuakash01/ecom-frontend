import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Form from "../../components/common/form/Form";
import Label from "../../components/common/form/Label";
import Input from "../../components/common/form/input/InputField";
import { toast } from "react-toastify";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "../../components/common/ui/table";
import { Trash, Pencil, Power } from "lucide-react";
import api from "../../config/apiAdmin";

function ManageTax() {
  const [openForm, setOpenForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [taxes, setTaxes] = useState([]);
  const [editingTax, setEditingTax] = useState(null);

  const {
    control,
    handleSubmit,
    reset,
  } = useForm();

  // ✅ Fetch Taxes
  const fetchTaxes = async () => {
    try {
      const res = await api.get("/admin/tax");
      setTaxes(res.data.taxes);
    } catch (error) {
      toast.error("Failed to load taxes");
    }
  };

  useEffect(() => {
    fetchTaxes();
  }, []);

  const openAddModal = () => {
    setEditingTax(null);
    reset({});
    setOpenForm(true);
  };

  const openEditModal = (tax) => {
    setEditingTax(tax);
    reset({
      name: tax.name,
      minPrice: tax.minPrice,
      maxPrice: tax.maxPrice,
      rate: tax.rate
    });
    setOpenForm(true);
  };

  const onSubmit = async (values) => {
    const toastId = toast.loading(
      editingTax ? "Updating Tax..." : "Adding Tax..."
    );

    try {
      setLoading(true);

      let res;

      if (editingTax) {
        res = await api.put(`/admin/tax/${editingTax._id}`, values);
      } else {
        res = await api.post("/admin/tax", values);
      }

      toast.update(toastId, {
        render: res.data.message,
        type: "success",
        isLoading: false,
        autoClose: 2000
      });

      fetchTaxes();
      setOpenForm(false);
      reset();

    } catch (error) {
      toast.update(toastId, {
        render: error.response?.data?.message || "Something went wrong",
        type: "error",
        isLoading: false,
        autoClose: 2000
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTax = async (tax) => {
    const toastId = toast.loading("Deleting Tax...");
    try {
      const res = await api.delete(`/admin/tax/${tax._id}`);

      toast.update(toastId, {
        render: res.data.message,
        type: "success",
        isLoading: false,
        autoClose: 2000
      });

      fetchTaxes();
    } catch (error) {
      toast.update(toastId, {
        render: "Delete failed!",
        type: "error",
        isLoading: false,
        autoClose: 2000
      });
    }
  };

  const toggleStatus = async (tax) => {
    try {
      await api.patch(`/admin/tax/toggle/${tax._id}`);
      fetchTaxes();
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="relative w-full text-black dark:text-white">

      {!openForm && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Manage Tax</h1>
            <button
              onClick={openAddModal}
              className="bg-black px-4 py-2 text-white rounded-lg shadow-md hover:bg-gray-800 transition"
            >
              + Add New Tax
            </button>
          </div>

          <div className="bg-white dark:bg-admin-dark-500 shadow-md rounded-xl border border-gray-200 dark:border-gray-500 overflow-auto mt-4">
            <Table className="text-gray-600 w-full">
              <TableHeader className="bg-admin-500 dark:bg-admin-dark-700 border-b border-gray-200 dark:border-gray-500">
                <TableRow>
                  {["Sr. No", "Name", "Min", "Max", "Rate %", "Status", "Action"].map(
                    (heading) => (
                      <TableCell
                        key={heading}
                        isHeader
                        className="px-5 py-3 text-xs font-medium text-start"
                      >
                        {heading}
                      </TableCell>
                    )
                  )}
                </TableRow>
              </TableHeader>

              <TableBody>
                {taxes.map((tax, index) => (
                  <TableRow key={tax._id}>
                    <TableCell className="px-6 py-4">{index + 1}</TableCell>
                    <TableCell className="px-6 py-4">{tax.name}</TableCell>
                    <TableCell className="px-6 py-4">{tax.minPrice}</TableCell>
                    <TableCell className="px-6 py-4">
                      {tax.maxPrice || "No Limit"}
                    </TableCell>
                    <TableCell className="px-6 py-4">{tax.rate}%</TableCell>

                    <TableCell className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          tax.isActive
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {tax.isActive ? "Active" : "Inactive"}
                      </span>
                    </TableCell>

                    <TableCell className="px-6 py-4 flex space-x-3">
                      <button
                        onClick={() => openEditModal(tax)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() => handleDeleteTax(tax)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash size={18} />
                      </button>

                      <button
                        onClick={() => toggleStatus(tax)}
                        className="text-yellow-500 hover:text-yellow-700"
                      >
                        <Power size={18} />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {openForm && (
        <div className="relative bg-white w-full p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {editingTax ? "Edit Tax" : "Add New Tax"}
            </h2>

            <button
              onClick={() => setOpenForm(false)}
              className="text-gray-500 hover:text-black text-2xl"
            >
              ✕
            </button>
          </div>

          <Form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-12 gap-4">

              <div className="col-span-12 md:col-span-6">
                <Label>Tax Name *</Label>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: "Tax name is required" }}
                  render={({ field }) => (
                    <Input {...field} placeholder="GST 18%" />
                  )}
                />
              </div>

              <div className="col-span-12 md:col-span-3">
                <Label>Min Price *</Label>
                <Controller
                  name="minPrice"
                  control={control}
                  rules={{ required: "Min price required" }}
                  render={({ field }) => (
                    <Input type="number" {...field} />
                  )}
                />
              </div>

              <div className="col-span-12 md:col-span-3">
                <Label>Max Price</Label>
                <Controller
                  name="maxPrice"
                  control={control}
                  render={({ field }) => (
                    <Input type="number" {...field} />
                  )}
                />
              </div>

              <div className="col-span-12 md:col-span-3">
                <Label>Rate % *</Label>
                <Controller
                  name="rate"
                  control={control}
                  rules={{ required: "Rate required" }}
                  render={({ field }) => (
                    <Input type="number" {...field} />
                  )}
                />
              </div>

            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setOpenForm(false)}
                className="px-5 py-2 bg-gray-200 rounded-md"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 bg-black text-white rounded-md shadow"
              >
                {loading
                  ? "Saving..."
                  : editingTax
                  ? "Update"
                  : "Save"}
              </button>
            </div>
          </Form>
        </div>
      )}
    </div>
  );
}

export default ManageTax;