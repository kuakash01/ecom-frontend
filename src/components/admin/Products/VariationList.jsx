import React, { useMemo, useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import MultipleImageUpload from "../../common/form/MultipleImageUpload";
import Input from "../../common/form/input/InputField";
import Label from "../../common/form/Label";
import { Check, Plus, X, Trash2 } from "lucide-react";
import api from "../../../config/apiAdmin";
import { toast } from "react-toastify";
import SearchSelect from "../../common/form/SearchSelect"



const ProductVariationsView = ({
    productId,
    setMode,
    productVariations,
    colorGalleries,

}) => {

    /* ---------------- STATES ---------------- */

    const [variations, setVariations] = useState(productVariations || []);
    const [colorGalleriesState, setColorGalleriesState] = useState(colorGalleries || []);

    const [showAddForm, setShowAddForm] = useState(false);

    const [newVariant, setNewVariant] = useState({
        color: "",
        size: "",
        price: "",
        mrp: "",
        quantity: ""
    });

    const [loadingGallery, setLoadingGallery] = useState(null);
    const [loadingVariant, setLoadingVariant] = useState(null);

    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);

    const colorOptions = colors.map(c => ({
        label: c.colorName,
        value: c._id
    }));

    const sizeOptions = sizes.map(s => ({
        label: s.sizeName,
        value: s._id
    }));


    useEffect(() => {
        const load = async () => {
            const c = await api.get("/admin/colors");
            const s = await api.get("/admin/sizes");

            setColors(c.data.data);
            setSizes(s.data.data);
        };

        load();
    }, []);



    /* ---------------- GROUP BY COLOR ---------------- */

    const groupedByColor = useMemo(() => {
        const map = {};

        variations
            .filter(v => v.isActive !== false)
            .forEach(v => {

                const colorId = v.color._id;

                if (!map[colorId]) {

                    const matchedGallery =
                        colorGalleriesState.find(
                            cg => cg.color === colorId || cg.color?._id === colorId
                        );

                    map[colorId] = {
                        color: v.color,
                        gallery: matchedGallery?.gallery || [],
                        variations: []
                    };
                }

                map[colorId].variations.push(v);
            });

        return Object.values(map);

    }, [variations, colorGalleriesState]);


    /* ---------------- FORM ---------------- */

    const { control, watch, reset } = useForm({
        defaultValues: {
            colorGalleries: groupedByColor.map(g => ({
                colorId: g.color._id,
                gallery: g.gallery || []
            })),

            variantDetails: variations.map(v => ({
                price: v.price,
                mrp: v.mrp,
                quantity: v.quantity,
                sku: v.sku,
                _id: v._id
            }))
        }
    });

    const watchedGalleries = watch("colorGalleries");
    const watchedVariants = watch("variantDetails");


    /* ---------------- REFRESH DATA ---------------- */

    const refreshVariants = async () => {
        const res = await api.get(`/admin/products/${productId}/variants`);
        setVariations(res.data.variations || []);
    };

    const refreshGalleries = async () => {
        const res = await api.get(`/admin/products/${productId}/color-gallery`);
        setColorGalleriesState(res.data.data || []);
    };


    /* ---------------- ADD VARIANT ---------------- */

    const handleAddVariant = async () => {
        try {

            await api.post(
                `/admin/products/${productId}/variants`,
                newVariant
            );

            await refreshVariants();

            toast.success("Variant added");

            setShowAddForm(false);

            setNewVariant({
                color: "",
                size: "",
                price: "",
                mrp: "",
                quantity: ""
            });

        } catch (err) {
            console.log("variant add error", err);
            toast.error(
                err.response?.data?.message || "Failed to add"
            );
        }
    };


    /* ---------------- DISABLE VARIANT ---------------- */

    const disableVariant = async (id) => {
        try {

            await api.patch(
                `/admin/products/${productId}/variants/${id}/disable`
            );

            await refreshVariants();

            toast.success("Variant disabled");

        } catch {
            toast.error("Failed");
        }
    };


    /* ---------------- UPDATE VARIANT ---------------- */

    const updateVariant = async (variantId, data) => {

        setLoadingVariant(variantId);

        try {

            await api.patch(
                `/admin/products/${productId}/variants/${variantId}`,
                data
            );

            await refreshVariants();

            toast.success("Updated");

        } catch {
            toast.error("Failed");
        } finally {
            setLoadingVariant(null);
        }
    };


    /* ---------------- UPDATE GALLERY ---------------- */

    const updateColorGallery = async (colorId, gallery) => {

        setLoadingGallery(colorId);

        const formData = new FormData();

        const existing = [];

        gallery.forEach((img, i) => {

            if (img.file) {
                formData.append("newImages", img.file);
            } else {
                existing.push({
                    url: img.url,
                    public_id: img.public_id,
                    position: i
                });
            }

        });

        formData.append("gallery", JSON.stringify(existing));

        try {

            await api.patch(
                `/admin/products/${productId}/color-gallery/${colorId}`,
                formData
            );

            await refreshGalleries();

            toast.success("Gallery updated");

        } catch {
            toast.error("Failed");
        } finally {
            setLoadingGallery(null);
        }
    };


    /* ---------------- UI ---------------- */

    let variantIndex = 0;


    return (
        <div className="space-y-6 pb-16 relative">


            {/* HEADER */}

            <div className="flex justify-between items-center">

                <h1 className="text-2xl font-bold" >
                    Manage Variations
                </h1>

                <div className="flex gap-3">

                    <button
                        onClick={() => setShowAddForm(true)}
                        className="bg-black text-white px-4 py-2 rounded flex item-center gap-1"
                    >
                        <Plus size={16} /> <div>Add Variant</div>
                    </button>

                    <button
                        onClick={() => setMode("list")}
                        className="border px-3 py-2 rounded"
                    >
                        Back
                    </button>

                </div>

            </div>


            {/* ADD MODAL */}

            {showAddForm && (

                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">

                    <div className="bg-white w-[420px] p-6 rounded-xl space-y-4 overflow-visible">

                        <div className="flex justify-between items-center">

                            <h2 className="font-semibold text-lg">
                                Add New Variant
                            </h2>

                            <X
                                onClick={() => setShowAddForm(false)}
                                className="cursor-pointer"
                            />

                        </div>


                        {/* <select
                            value={newVariant.color}
                            onChange={e =>
                                setNewVariant({
                                    ...newVariant,
                                    color: e.target.value
                                })
                            }
                            className="w-full border p-2 rounded"
                        >
                            <option value="">Select Color</option>

                            {colors.map(c => (
                                <option key={c._id} value={c._id}>
                                    {c.colorName}
                                </option>
                            ))}
                        </select> */}
                        <SearchSelect
                            label="Color"
                            options={colorOptions}
                            multiple={false} // ✅ single select
                            placeholder="Select Color"
                            defaultSelected={
                                newVariant.color ? [newVariant.color] : []
                            }
                            onChange={(value) =>
                                setNewVariant({
                                    ...newVariant,
                                    color: value
                                })
                            }
                        />



                        {/* <select
                            value={newVariant.size}
                            onChange={e =>
                                setNewVariant({
                                    ...newVariant,
                                    size: e.target.value
                                })
                            }
                            className="w-full border p-2 rounded"
                        >
                            <option value="">Select Size</option>

                            {sizes.map(s => (
                                <option key={s._id} value={s._id}>
                                    {s.sizeName}
                                </option>
                            ))}
                        </select> */}
                        <SearchSelect
                            label="Size"
                            options={sizeOptions}
                            multiple={false} // ✅ single select
                            placeholder="Select Size"
                            defaultSelected={
                                newVariant.size ? [newVariant.size] : []
                            }
                            onChange={(value) =>
                                setNewVariant({
                                    ...newVariant,
                                    size: value
                                })
                            }
                        />



                        <Input
                            placeholder="Price"
                            value={newVariant.price}
                            onChange={e =>
                                setNewVariant({
                                    ...newVariant,
                                    price: e.target.value
                                })
                            }
                        />

                        <Input
                            placeholder="MRP"
                            value={newVariant.mrp}
                            onChange={e =>
                                setNewVariant({
                                    ...newVariant,
                                    mrp: e.target.value
                                })
                            }
                        />

                        <Input
                            placeholder="Quantity"
                            value={newVariant.quantity}
                            onChange={e =>
                                setNewVariant({
                                    ...newVariant,
                                    quantity: e.target.value
                                })
                            }
                        />


                        <div className="flex gap-3 pt-3">

                            <button
                                onClick={handleAddVariant}
                                className="flex-1 bg-black text-white py-2 rounded"
                            >
                                Save
                            </button>

                            <button
                                onClick={() => setShowAddForm(false)}
                                className="flex-1 border py-2 rounded"
                            >
                                Cancel
                            </button>

                        </div>

                    </div>

                </div>
            )}


            {/* EXISTING VARIANTS */}

            {variations.length ? (groupedByColor.map((group, gIndex) => {

                const savedGallery = group.gallery;
                const currentGallery = watchedGalleries[gIndex]?.gallery;

                const galleryChanged =
                    JSON.stringify(savedGallery) !==
                    JSON.stringify(currentGallery);


                return (

                    <div
                        key={group.color._id}
                        className="border p-5 rounded-xl bg-white space-y-6"
                    >

                        {/* COLOR HEADER */}

                        <div className="flex justify-between">

                            <div className="flex gap-3 items-center">

                                <div
                                    className="w-5 h-5 rounded-full border"
                                    style={{
                                        backgroundColor: group.color.colorHex
                                    }}
                                />

                                <b>{group.color.colorName}</b>

                            </div>


                            {galleryChanged && (
                                <button
                                    onClick={() =>
                                        updateColorGallery(
                                            group.color._id,
                                            currentGallery
                                        )
                                    }
                                    className="bg-green-500 text-white px-2 rounded"
                                >
                                    {loadingGallery === group.color._id
                                        ? "Saving"
                                        : <Check size={16} />}
                                </button>
                            )}

                        </div>


                        {/* GALLERY */}

                        <Controller
                            name={`colorGalleries.${gIndex}.gallery`}
                            control={control}
                            render={({ field }) => (
                                <MultipleImageUpload
                                    value={field.value}
                                    onChange={field.onChange}
                                    multiple
                                />
                            )}
                        />


                        {/* VARIANTS */}

                        {group.variations.map(v => {

                            const idx = variantIndex++;

                            const watched = watchedVariants[idx];

                            const changed =
                                watched?.price !== v.price ||
                                watched?.mrp !== v.mrp ||
                                watched?.quantity !== v.quantity;


                            return (

                                <div
                                    key={v._id}
                                    className="border p-4 rounded bg-gray-50 relative space-y-3"
                                >

                                    {/* SAVE */}

                                    {changed && (
                                        <button
                                            onClick={() =>
                                                updateVariant(v._id, {
                                                    price: watched.price,
                                                    mrp: watched.mrp,
                                                    quantity: watched.quantity
                                                })
                                            }
                                            className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded"
                                        >
                                            {loadingVariant === v._id
                                                ? "..."
                                                : <Check size={16} />}
                                        </button>
                                    )}


                                    {/* DISABLE */}

                                    <button
                                        onClick={() => disableVariant(v._id)}
                                        className="absolute bottom-2 right-2 text-red-500"
                                    >
                                        <Trash2 size={14} />
                                    </button>


                                    <p className="text-sm font-medium">
                                        Size: {v.size.sizeName}
                                    </p>


                                    <div className="grid grid-cols-4 gap-3">

                                        <Controller
                                            name={`variantDetails.${idx}.price`}
                                            control={control}
                                            render={({ field }) => (
                                                <Input {...field} />
                                            )}
                                        />

                                        <Controller
                                            name={`variantDetails.${idx}.mrp`}
                                            control={control}
                                            render={({ field }) => (
                                                <Input {...field} />
                                            )}
                                        />

                                        <Controller
                                            name={`variantDetails.${idx}.quantity`}
                                            control={control}
                                            render={({ field }) => (
                                                <Input {...field} />
                                            )}
                                        />

                                        <Controller
                                            name={`variantDetails.${idx}.sku`}
                                            control={control}
                                            render={({ field }) => (
                                                <Input {...field} readOnly />
                                            )}
                                        />

                                    </div>

                                </div>

                            );
                        })}

                    </div>
                );
            })) : (<p>No variations</p>)}

        </div>
    );
};

export default ProductVariationsView;



