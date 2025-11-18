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
import api from "../../config/axios";

function ManageColors() {
    const [openForm, setOpenForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editingColor, setEditingColor] = useState(null); // null means add-mode
    const loaderData = useLoaderData();
    const revalidator = useRevalidator();

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const openAddModal = () => {
        setEditingColor(null);
        reset({});
        setOpenForm(true);
    };

    const openEditModal = (color) => {
        setEditingColor(color);
        reset({
            colorName: color.colorName,
            colorHex: color.colorHex
        });
        setOpenForm(true);
    };

    const onSubmit = async (values) => {
        const toastId = toast.loading(editingColor ? "Updating Color..." : "Adding Color...");
        try {
            setLoading(true);

            let res;

            if (editingColor) {
                // UPDATE
                res = await api.patch(`/admin/colors/${editingColor._id}`, values);
            } else {
                // ADD
                res = await api.post("/admin/colors", values);
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
            reset({
                colorName: "",
                colorHex: ""
            })
        }
    };

    const handleDeleteColor = async (color) => {
        const toastId = toast.loading("Deleting Color...");
        try {
            const res = await api.delete(`/admin/colors/${color._id}`);

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
                        <h1 className="text-2xl font-bold">Manage Colors</h1>
                        <button
                            onClick={openAddModal}
                            className="bg-black px-4 py-2 text-white rounded-lg shadow-md cursor-pointer hover:bg-gray-800 transition-colors duration-300"
                        >
                            + Add New Color
                        </button>
                    </div>

                    <div className="bg-white dark:bg-admin-dark-500 shadow-md rounded-xl border border-gray-200 dark:border-gray-500 overflow-auto mt-4">
                        <Table className="text-gray-600 w-full">
                            <TableHeader className="bg-admin-500 dark:bg-admin-dark-700 border-b border-gray-200 dark:border-gray-500">
                                <TableRow>
                                    {["Sr. No", "Color", "Color Name", "Color Hex", "Action"].map(
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
                                {loaderData.map((color, index) => (
                                    <TableRow key={color._id}>
                                        <TableCell className="px-6 py-4">{index + 1}</TableCell>

                                        <TableCell className="px-6 py-4">
                                            <div
                                                className="w-12 h-12 rounded border"
                                                style={{ backgroundColor: color.colorHex }}
                                            />
                                        </TableCell>

                                        <TableCell className="px-6 py-4">{color.colorName}</TableCell>

                                        <TableCell className="px-6 py-4">{color.colorHex}</TableCell>

                                        <TableCell className="px-6 py-4 flex space-x-3">
                                            <button
                                                onClick={() => openEditModal(color)}
                                                className="text-blue-500 hover:text-blue-700"
                                            >
                                                <Pencil size={18} />
                                            </button>

                                            <button
                                                onClick={() => handleDeleteColor(color)}
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
                            {editingColor ? "Edit Color" : "Add New Color"}
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

                            {/* Color Name */}
                            <div className="col-span-12 md:col-span-6">
                                <Label>
                                    Color Name <span className="text-red-400">*</span>
                                </Label>

                                <Controller
                                    name="colorName"
                                    control={control}
                                    rules={{ required: "Color name is required." }}
                                    render={({ field, fieldState }) => (
                                        <Input
                                            {...field}
                                            placeholder="Enter Color Name"
                                            error={!!fieldState.error}
                                            hint={fieldState.error?.message}
                                        />
                                    )}
                                />
                            </div>

                            {/* Color HEX */}
                            <div className="col-span-12 md:col-span-6">
                                <Label>
                                    Color HEX <span className="text-red-400">*</span>
                                </Label>

                                <Controller
                                    name="colorHex"
                                    control={control}
                                    rules={{
                                        required: "HEX code is required.",
                                        pattern: {
                                            value: /^#([0-9A-F]{3}|[0-9A-F]{6})$/i,
                                            message: "Invalid HEX code.",
                                        },
                                    }}
                                    render={({ field, fieldState }) => (
                                        <div className="grid grid-cols-12 gap-2">
                                            <div className="col-span-9">
                                                <Input
                                                    {...field}
                                                    placeholder="#000000"
                                                    error={!!fieldState.error}
                                                    hint={fieldState.error?.message}
                                                />
                                            </div>

                                            <div
                                                className="w-12 h-12 rounded border"
                                                style={{ backgroundColor: field.value || "transparent" }}
                                            />
                                        </div>
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
                                {loading ? "Saving..." : editingColor ? "Update" : "Save"}
                            </button>
                        </div>
                    </Form>
                </div>
            )}
        </div>
    );
}

export default ManageColors;
