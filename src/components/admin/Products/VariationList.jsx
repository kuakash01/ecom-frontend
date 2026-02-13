import React, { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import MultipleImageUpload from "../../common/form/MultipleImageUpload";
import Input from "../../common/form/input/InputField";
import Label from "../../common/form/Label";
import { Check } from "lucide-react";
import api from "../../../config/apiAdmin";
import { toast } from "react-toastify";

const ProductVariationsView = ({ productId, setMode, productVariations, colorGalleries }) => {
    // const variations = productVariations || [];
    const [variations, setVariations] = useState(productVariations || []);
    const [colorGalleriesState, setColorGalleriesState] = useState(colorGalleries || []);

    const groupedByColor = useMemo(() => {
        const map = {};

        variations.forEach(v => {
            const colorId = v.color._id;

            if (!map[colorId]) {
                // Find the corresponding color gallery from colorGalleriesState
                const matchedGallery = colorGalleriesState.find(
                    cg => cg.color === colorId || cg.color._id === colorId
                );

                map[colorId] = {
                    color: v.color,
                    gallery: matchedGallery?.gallery || [], // use gallery from colorGalleriesState
                    variations: []
                };
            }

            map[colorId].variations.push(v);
        });

        return Object.values(map);
    }, [variations, colorGalleriesState]);


    const { reset, control, watch } = useForm({
        defaultValues: {
            colorGalleries: groupedByColor.map(g => ({
                colorId: g.color._id,
                gallery: g.gallery || []
            })),
            variantDetails: variations.map(v => ({
                price: v.price,
                mrp: v.mrp,
                quantity: v.quantity,
                sku: v.sku || "",
                _id: v._id
            }))
        }
    });

    const watchedColorGalleries = watch("colorGalleries");
    const watchedVariants = watch("variantDetails");

    const [loadingGallery, setLoadingGallery] = useState(null);
    const [loadingVariant, setLoadingVariant] = useState(null);

    const updateColorGallery = async (colorId, gallery) => {
        setLoadingGallery(colorId);

        const formData = new FormData();

        // 1. Existing & new images
        const existingGallery = [];

        gallery.forEach((img, index) => {
            const baseInfo = {
                url: img.url || null,
                public_id: img.public_id || null,
                position: index
            };

            if (img.file) {
                // New image
                formData.append("newImages", img.file);
            } else {
                // Existing image
                existingGallery.push(baseInfo);
            }
        });

        // 2. Append existing gallery (must be JSON string)
        formData.append("gallery", JSON.stringify(existingGallery));

        try {
            const res = await api.patch(
                `/admin/products/${productId}/color-gallery/${colorId}`,
                formData
            );

            // Update local state
            // setColorGalleriesState(prev => {
            //     const otherGalleries = prev.filter(cg => cg.color !== colorId && cg.color._id !== colorId);
            //     return [
            //         ...otherGalleries,
            //         {
            //             color: colorId,
            //             gallery: res.data.gallery
            //         }
            //     ];
            // });
            const response = await api.get(`/admin/products/${productId}/color-gallery`);
            setColorGalleriesState(response.data.data || []);
            reset({
                colorGalleries: groupedByColor.map(g => ({
                    colorId: g.color._id,
                    gallery: g.gallery || []
                })),
                variantDetails: variations.map(v => ({
                    price: v.price,
                    mrp: v.mrp,
                    quantity: v.quantity,
                    sku: v.sku || "",
                    _id: v._id
                }))
            });
            toast.success("Gallery updated");
        } catch (error) {
            console.error("Error updating gallery:", error);
            toast.error("Failed to update gallery.");
        } finally {
            setLoadingGallery(null);
        }
    };


    // PATCH update for a specific variant
    const updateVariant = async (variantId, data) => {
        setLoadingVariant(variantId);
        try {
            const res = await api.patch(`/admin/products/${productId}/variants/${variantId}`, data);

            // Refresh variations
            const response = await api.get(`/admin/products/${productId}/variants`);
            const updated = response.data.variations || [];
            setVariations(updated);

            reset({
                colorGalleries: groupedByColor.map(g => ({
                    colorId: g.color._id,
                    gallery: g.gallery || []
                })),
                variantDetails: updated.map(v => ({
                    price: v.price,
                    mrp: v.mrp,
                    quantity: v.quantity,
                    sku: v.sku || "",
                    _id: v._id
                }))
            });


            toast.success("Variant updated");
        } catch (error) {
            console.error("Error updating variant:", error);
            toast.error("Failed to update variant.");
        } finally {
            setLoadingVariant(null);
        }
    };


    if (!variations.length) {
        return <p className="text-gray-500">No variations found.</p>;
    }

    let variantIndex = 0;

    return (
        <div className="space-y-6 pb-10">
            <h1 className="text-2xl font-bold">Manage Variations</h1>

            {groupedByColor.map((group, groupIndex) => {
                const savedGallery = group.gallery;
                const currentGallery = watchedColorGalleries[groupIndex].gallery;
                const galleryChanged =
                    JSON.stringify(savedGallery) !== JSON.stringify(currentGallery);
                return (
                    <div
                        key={group.color._id}
                        className="border p-5 rounded-xl shadow-sm bg-white space-y-6"
                    >
                        {/* COLOR HEADER */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-6 h-6 rounded-full border"
                                    style={{ backgroundColor: group.color.colorHex }}
                                />
                                <p className="font-semibold text-gray-900 text-lg">
                                    {group.color.colorName}
                                </p>
                            </div>

                            {/* TICK FOR GALLERY */}
                            {galleryChanged && (
                                <button
                                    onClick={() =>
                                        updateColorGallery(group.color._id, currentGallery)
                                    }
                                    className="px-3 py-1 bg-green-500 text-white rounded flex items-center gap-1"
                                >
                                    {loadingGallery === group.color._id ? (
                                        "Saving..."
                                    ) : (
                                        <Check size={18} />
                                    )}
                                </button>
                            )}
                        </div>

                        {/* GALLERY */}
                        <div className="space-y-2">
                            <p className="font-medium">Gallery</p>
                            <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
                                <Controller
                                    name={`colorGalleries.${groupIndex}.gallery`}
                                    control={control}
                                    render={({ field }) => (
                                        <MultipleImageUpload
                                            value={field.value}
                                            onChange={field.onChange}
                                            label={`gallery-${group.color._id}`}
                                            multiple
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        {/* VARIANT DETAILS */}
                        <div className="space-y-6">
                            <p className="font-semibold text-gray-800">Variation Details</p>

                            {group.variations.map(v => {
                                const idx = variantIndex++;
                                const watched = watchedVariants[idx];

                                const variantChanged =
                                    watched.price !== v.price ||
                                    watched.mrp !== v.mrp ||
                                    watched.quantity !== v.quantity;

                                return (
                                    <div
                                        key={v._id}
                                        className="border rounded-md p-4 bg-gray-50 space-y-4 relative"
                                    >
                                        {/* TICK BUTTON */}
                                        {variantChanged && (
                                            <button
                                                onClick={() =>
                                                    updateVariant(v._id, {
                                                        price: watched.price,
                                                        mrp: watched.mrp,
                                                        quantity: watched.quantity
                                                    })
                                                }
                                                className="absolute top-3 right-3 bg-green-500 text-white p-1 rounded"
                                            >
                                                {loadingVariant === v._id ? (
                                                    "..."
                                                ) : (
                                                    <Check size={18} />
                                                )}
                                            </button>
                                        )}

                                        <div className="text-sm text-gray-700 font-medium">
                                            Size: {v.size?.sizeName}
                                        </div>

                                        <div className="grid grid-cols-12 gap-4">
                                            {/* PRICE */}
                                            <div className="col-span-12 md:col-span-6 lg:col-span-3">
                                                <Label>Price</Label>
                                                <Controller
                                                    name={`variantDetails.${idx}.price`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input {...field} placeholder="Price" />
                                                    )}
                                                />
                                            </div>

                                            {/* MRP */}
                                            <div className="col-span-12 md:col-span-6 lg:col-span-3">
                                                <Label>MRP</Label>
                                                <Controller
                                                    name={`variantDetails.${idx}.mrp`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input {...field} placeholder="MRP" />
                                                    )}
                                                />
                                            </div>

                                            {/* Quantity */}
                                            <div className="col-span-12 md:col-span-6 lg:col-span-3">
                                                <Label>Quantity</Label>
                                                <Controller
                                                    name={`variantDetails.${idx}.quantity`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input {...field} placeholder="Quantity" />
                                                    )}
                                                />
                                            </div>

                                            {/* SKU */}
                                            <div className="col-span-12 md:col-span-6 lg:col-span-3">
                                                <Label>SKU</Label>
                                                <Controller
                                                    name={`variantDetails.${idx}.sku`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input {...field} readOnly placeholder="SKU" />
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}

            <button
                onClick={() => setMode("list")}
                className="absolute top-2 right-2 text-gray-500 hover:text-black cursor-pointer"
            >
                &lt; Back
            </button>
        </div>
    );
};

export default ProductVariationsView;




















