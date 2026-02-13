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
import { Trash, Pencil } from "lucide-react";
import { useLoaderData, useRevalidator } from "react-router-dom";
import api from "../../config/apiAdmin";

function ManageSizes() {
    const [openForm, setOpenForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editingSize, setEditingSize] = useState(null);

    const loaderData = useLoaderData();
    const revalidator = useRevalidator();

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const openAddModal = () => {
        setEditingSize(null);
        reset({});
        setOpenForm(true);
    };

    const openEditModal = (size) => {
        setEditingSize(size);
        reset({
            sizeName: size.sizeName,
            sizeValue: size.sizeValue
        });
        setOpenForm(true);
    };

    const onSubmit = async (values) => {
        const toastId = toast.loading(editingSize ? "Updating Size..." : "Adding Size...");
        try {
            setLoading(true);

            let res;

            if (editingSize) {
                res = await api.patch(`/admin/sizes/${editingSize._id}`, values);
            } else {
                res = await api.post("/admin/sizes", values);
            }

            toast.update(toastId, {
                render: res.data.message,
                type: res.data.status === "success" ? "success" : "error",
                isLoading: false,
                autoClose: 2000,
                closeButton: true
            });

            revalidator.revalidate();
            setOpenForm(false);
            reset();

        } catch (error) {
            toast.update(toastId, {
                render: error.response?.data?.message || "Something went wrong",
                type: "error",
                isLoading: false,
                autoClose: 2000,
                closeButton: true
            });
        } finally {
            setLoading(false);
            reset({ sizeName: "", sizeValue: "" });
        }
    };

    const handleDeleteSize = async (size) => {
        const toastId = toast.loading("Deleting Size...");
        try {
            const res = await api.delete(`/admin/sizes/${size._id}`);

            toast.update(toastId, {
                render: res.data.message,
                type: "success",
                isLoading: false,
                autoClose: 2000
            });

            revalidator.revalidate();
        } catch (error) {
            toast.update(toastId, {
                render: "Delete failed!",
                type: "error",
                isLoading: false,
                autoClose: 2000
            });
        }
    };

    return (
        <div className="relative w-full text-black dark:text-white">

            {!openForm && (
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">Manage Sizes</h1>
                        <button
                            onClick={openAddModal}
                            className="bg-black px-4 py-2 text-white rounded-lg shadow-md cursor-pointer hover:bg-gray-800 transition-colors duration-300"
                        >
                            + Add New Size
                        </button>
                    </div>

                    <div className="bg-white dark:bg-admin-dark-500 shadow-md rounded-xl border border-gray-200 dark:border-gray-500 overflow-auto mt-4">
                        <Table className="text-gray-600 w-full">
                            <TableHeader className="bg-admin-500 dark:bg-admin-dark-700 border-b border-gray-200 dark:border-gray-500">
                                <TableRow>
                                    {["Sr. No", "Size Name", "Size Value", "Action"].map(
                                        (heading) => (
                                            <TableCell
                                                key={heading}
                                                isHeader
                                                className="px-5 py-3 text-xs font-medium text-gray-600 text-start dark:text-gray-400"
                                            >
                                                {heading}
                                            </TableCell>
                                        )
                                    )}
                                </TableRow>
                            </TableHeader>

                            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                {loaderData.map((size, index) => (
                                    <TableRow key={size._id}>
                                        <TableCell className="px-6 py-4">{index + 1}</TableCell>

                                        <TableCell className="px-6 py-4">{size.sizeName}</TableCell>

                                        <TableCell className="px-6 py-4">{size.sizeValue}</TableCell>

                                        <TableCell className="px-6 py-4 flex space-x-3">
                                            <button
                                                onClick={() => openEditModal(size)}
                                                className="text-blue-500 hover:text-blue-700"
                                            >
                                                <Pencil size={18} />
                                            </button>

                                            <button
                                                onClick={() => handleDeleteSize(size)}
                                                className="text-red-500 hover:text-red-800"
                                            >
                                                <Trash size={18} />
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
                <div className="relative top-0 bg-white w-full p-6 rounded-xl shadow-lg">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">
                            {editingSize ? "Edit Size" : "Add New Size"}
                        </h2>

                        <button
                            onClick={() => setOpenForm(false)}
                            className="text-gray-500 hover:text-black cursor-pointer text-2xl"
                        >
                            ✕
                        </button>
                    </div>

                    <Form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div className="grid grid-cols-12 gap-4">

                            {/* Size Name */}
                            <div className="col-span-12 md:col-span-6">
                                <Label>
                                    Size Name <span className="text-red-400">*</span>
                                </Label>

                                <Controller
                                    name="sizeName"
                                    control={control}
                                    rules={{ required: "Size name is required." }}
                                    render={({ field, fieldState }) => (
                                        <Input
                                            {...field}
                                            placeholder="Enter Size Name (e.g., M, XL, 42)"
                                            error={!!fieldState.error}
                                            hint={fieldState.error?.message}
                                        />
                                    )}
                                />
                            </div>

                            {/* Size Value */}
                            <div className="col-span-12 md:col-span-6">
                                <Label>
                                    Size Value <span className="text-red-400">*</span>
                                </Label>

                                <Controller
                                    name="sizeValue"
                                    control={control}
                                    rules={{ required: "Size value is required." }}
                                    render={({ field, fieldState }) => (
                                        <Input
                                            {...field}
                                            placeholder="Enter actual value (e.g., 40, 30W)"
                                            error={!!fieldState.error}
                                            hint={fieldState.error?.message}
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => setOpenForm(false)}
                                className="px-5 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="px-5 py-2 bg-black text-white rounded-md shadow hover:bg-gray-800 transition"
                                disabled={loading}
                            >
                                {loading ? "Saving..." : editingSize ? "Update" : "Save"}
                            </button>
                        </div>
                    </Form>
                </div>
            )}
        </div>
    );
}

export default ManageSizes;
