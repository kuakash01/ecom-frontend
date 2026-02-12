import { useState } from "react";
import api from "../../../config/axios";
import Input from "../../common/form/input/InputField";
import Form from "../../common/form/Form";
import Label from "../../common/form/Label";
import { useForm, Controller } from "react-hook-form";
import {toast} from "react-toastify";

const AddCheckoutAddress = ({ onClose, onSuccess }) => {

    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            fullName: "",
            phone: "",
            alternatePhone: "",
            street: "",
            city: "",
            state: "",
            pincode: "",
        },
    });
    const [miniLoading, setMiniLoading] = useState(false);


    const onSubmit = async (data) => {
        // console.log("Form Data:" 

        try {
            // Remove empty fields
            const cleanedData = Object.fromEntries(
                Object.entries(data).filter(
                    ([_, value]) => value !== "" && value !== null
                )
            );
            console.log("Cleaned Data:", cleanedData);
            setMiniLoading(true);
            
            const response = await api.post("/address", cleanedData);
            console.log("Address added response:", response.data);
            if (response.data.status === "success") {
                onSuccess();
                onClose();
                toast.success("Address added successfully!");
            }
            reset();

        } catch (error) {
            console.error("Error adding address:", error);
            toast.error("Failed to add address. Please try again.");

        } finally {
            setMiniLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 ">
            <div className="bg-white w-full max-w-lg rounded-2xl p-6 overflow-auto max-h-[90vh]">
                <h2 className="text-xl font-semibold mb-4">Add Delivery Address</h2>

                <Form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                    <div>
                        <Label>
                            Full Name
                        </Label>
                        <Controller
                            name="fullName"
                            control={control}
                            rules={{ required: "Full Name is required." }}
                            render={({ field, fieldState }) => (
                                <Input
                                    {...field}
                                    placeholder="Enter Full Name"
                                    error={!!fieldState.error}
                                    hint={fieldState.error?.message}
                                    type="text"
                                />
                            )}
                        />
                    </div>

                    <div>
                        <Label>
                            Phone
                        </Label>
                        <Controller
                            name="phone"
                            control={control}
                            rules={{ required: "Phone is required." }}
                            render={({ field, fieldState }) => (
                                <Input
                                    {...field}
                                    placeholder="Enter Phone Number"
                                    error={!!fieldState.error}
                                    hint={fieldState.error?.message}
                                    type="Number"
                                />
                            )}
                        />
                    </div>

                    <div >
                        <Label>
                            Alternate Phone
                        </Label>
                        <Controller
                            name="alternatePhone"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Input
                                    {...field}
                                    placeholder="Enter Alternate Phone Number"
                                    error={!!fieldState.error}
                                    hint={fieldState.error?.message}
                                    type="Number"
                                />
                            )}
                        />
                    </div>

                    <div >
                        <Label>
                            Street
                        </Label>
                        <Controller
                            name="street"
                            control={control}
                            rules={{ required: "Street is required." }}
                            render={({ field, fieldState }) => (
                                <Input
                                    {...field}
                                    placeholder="Enter Street Address"
                                    error={!!fieldState.error}
                                    hint={fieldState.error?.message}
                                    type="text"
                                />
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div >
                            <Label>
                                City
                            </Label>
                            <Controller
                                name="city"
                                control={control}
                                rules={{ required: "City is required." }}
                                render={({ field, fieldState }) => (
                                    <Input
                                        {...field}
                                        placeholder="Enter City"
                                        error={!!fieldState.error}
                                        hint={fieldState.error?.message}
                                        type="text"
                                    />
                                )}
                            />
                        </div>
                        <div >
                            <Label>
                                State
                            </Label>
                            <Controller
                                name="state"
                                control={control}
                                rules={{ required: "State is required." }}
                                render={({ field, fieldState }) => (
                                    <Input
                                        {...field}
                                        placeholder="Enter State"
                                        error={!!fieldState.error}
                                        hint={fieldState.error?.message}
                                        type="text"
                                    />
                                )}
                            />
                        </div>
                    </div>

                    <div>
                        <Label>
                            Pincode
                        </Label>
                        <Controller
                            name="pincode"
                            control={control}
                            rules={{ required: "Pincode is required." }}
                            render={({ field, fieldState }) => (
                                <Input
                                    {...field}
                                    placeholder="Enter Pincode"
                                    error={!!fieldState.error}
                                    hint={fieldState.error?.message}
                                    type="Number"
                                />
                            )}
                        />
                    </div>


                    <div className="flex justify-end gap-3 pt-5">

                        {/* Cancel Button */}
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 border border-gray-300 rounded-full text-gray-700 hover:border-black hover:text-black hover:bg-gray-100 transition-all duration-300 ease-in-out"
                        >
                            Cancel
                        </button>

                        {/* Save Button */}
                        <button
                            type="submit"
                            className="px-6 py-2.5 bg-black text-white rounded-full relative overflow-hidden group transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-[1.02] active:scale-[0.97]"
                        >
                            <span
                                className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            ></span>

                            {miniLoading ? (
                                <div className="relative z-10">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : (
                                <span className="relative z-10">
                                    Save & Use
                                </span>
                            )}
                        </button>

                    </div>

                </Form>
            </div>
        </div>
    );
};

export default AddCheckoutAddress;
