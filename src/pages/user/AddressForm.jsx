import { useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import api from "../../config/apiUser";
import { toast } from "react-toastify";

const AddressForm = () => {

    const navigate = useNavigate();
    const { id } = useParams();

    const isEdit = Boolean(id);

    const [searchParams] = useSearchParams();
    const redirect = searchParams.get("redirect");

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            fullName: "",
            phone: "",
            alternatePhone: "",
            addressLine1: "",
            addressLine2: "",
            landmark: "",
            city: "",
            state: "",
            pincode: "",
            addressType: "home",
        },
    });


    // ================= FETCH FOR EDIT =================
    const fetchSingle = async () => {
        try {

            const res = await api.get("/address");

            const found = res.data.data.find(
                (a) => a._id === id
            );

            if (!found) return toast.error("Not found");

            // Set form values
            Object.keys(found).forEach((key) => {
                setValue(key, found[key]);
            });

        } catch {
            toast.error("Failed to load address");
        }
    };


    // ================= SUBMIT =================
    const onSubmit = async (data) => {

        try {

            if (isEdit) {
                await api.put(`/address/${id}`, data);
                toast.success("Updated");
            } else {
                await api.post("/address", data);
                toast.success("Saved");
            }

            if (redirect) {
                navigate(redirect);
            } else {
                navigate("../addresses");
            }


        } catch {
            toast.error("Failed to save");
        }
    };


    useEffect(() => {
        if (isEdit) fetchSingle();
    }, []);


    const addressType = watch("addressType");


    return (
        <div className="">

            <div className="py-8 px-4">

                {/* HEADER */}
                <div className="mb-8">

                    <h2 className="text-3xl font-semibold text-gray-900">
                        {isEdit ? "Edit Address" : "Add New Address"}
                    </h2>

                    <p className="text-gray-500 mt-1 text-sm">
                        Enter accurate delivery information
                    </p>

                </div>


                {/* FORM */}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-6"
                >

                    {/* CONTACT */}
                    <Section title="Contact Details">

                        <Grid>

                            <Input
                                label="Full Name"
                                register={register}
                                name="fullName"
                                error={errors.fullName}
                                rules={{
                                    required: "Name is required",
                                    pattern: {
                                        value: /^[a-zA-Z\s]+$/,
                                        message: "Only letters allowed",
                                    },
                                }}
                            />

                            <Input
                                label="Phone Number"
                                register={register}
                                name="phone"
                                error={errors.phone}
                                rules={{
                                    required: "Phone is required",
                                    pattern: {
                                        value: /^[6-9]\d{9}$/,
                                        message: "Enter valid Indian number",
                                    },
                                }}
                            />

                            <Input
                                label="Alternate Phone"
                                register={register}
                                name="alternatePhone"
                                error={errors.alternatePhone}
                                rules={{
                                    pattern: {
                                        value: /^[6-9]\d{9}$/,
                                        message: "Invalid number",
                                    },
                                }}
                            />

                        </Grid>

                    </Section>


                    {/* ADDRESS */}
                    <Section title="Address Details">

                        <Input
                            label="Address Line 1"
                            register={register}
                            name="addressLine1"
                            error={errors.addressLine1}
                            rules={{ required: "Address required" }}
                        />

                        <Input
                            label="Address Line 2"
                            register={register}
                            name="addressLine2"
                        />

                        <Input
                            label="Landmark"
                            register={register}
                            name="landmark"
                        />

                        <Grid>

                            <Input
                                label="City"
                                register={register}
                                name="city"
                                error={errors.city}
                                rules={{
                                    required: "City required",
                                    pattern: {
                                        value: /^[a-zA-Z\s]+$/,
                                        message: "Only letters",
                                    },
                                }}
                            />

                            <Input
                                label="State"
                                register={register}
                                name="state"
                                error={errors.state}
                                rules={{
                                    required: "State required",
                                    pattern: {
                                        value: /^[a-zA-Z\s]+$/,
                                        message: "Only letters",
                                    },
                                }}
                            />

                            <Input
                                label="Pincode"
                                register={register}
                                name="pincode"
                                error={errors.pincode}
                                rules={{
                                    required: "Pincode required",
                                    pattern: {
                                        value: /^\d{6}$/,
                                        message: "6 digits only",
                                    },
                                }}
                            />

                        </Grid>


                        {/* COUNTRY */}
                        <div>

                            <label className="text-sm font-medium text-gray-600">
                                Country
                            </label>

                            <input
                                value="India"
                                disabled
                                className="w-full mt-1 bg-gray-100 border rounded-xl px-4 py-2.5"
                            />

                        </div>

                    </Section>


                    {/* TYPE */}
                    <Section title="Address Type">

                        <div className="flex gap-4">

                            {["home", "work", "other"].map((type) => (

                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setValue("addressType", type)}
                                    className={`px-5 py-2 rounded-xl border font-medium capitalize
                    ${addressType === type
                                            ? "bg-indigo-600 text-white border-indigo-600"
                                            : "bg-white hover:bg-gray-50"
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}

                        </div>

                    </Section>


                    {/* ACTIONS */}
                    <div className="flex justify-end gap-4 pt-6">

                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-5 py-2 rounded-xl bg-gray-200"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-medium shadow hover:bg-indigo-700 disabled:opacity-60"
                        >
                            {isSubmitting ? "Saving..." : "Save Address"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};




// ================= UI HELPERS =================

const Section = ({ title, children }) => (
    <div>

        <h3 className="text-lg font-semibold mb-3 text-gray-800">
            {title}
        </h3>

        <div className="space-y-4">
            {children}
        </div>

    </div>
);


const Grid = ({ children }) => (
    <div className="grid md:grid-cols-2 gap-4">
        {children}
    </div>
);


const Input = ({
    label,
    name,
    register,
    rules,
    error,
}) => (
    <div>

        <label className="text-sm font-medium text-gray-600">
            {label}
        </label>

        <input
            {...register(name, rules)}
            className={`w-full mt-1 border rounded-xl px-4 py-2.5 outline-none
        ${error
                    ? "border-red-500 focus:ring-red-500"
                    : "focus:ring-2 focus:ring-indigo-500"
                }`}
        />

        {error && (
            <p className="text-red-500 text-xs mt-1">
                {error.message}
            </p>
        )}

    </div>
);

export default AddressForm;
