import React, { useEffect, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import Input from "../../common/form/input/InputField";
import Label from "../../common/form/Label";
import { Trash2, Plus } from "lucide-react";
import { motion } from "framer-motion";
import MultipleImageUpload from "../../common/form/MultipleImageUpload";

const VariationsSection = ({ control, watch, sizeOptions, colorOptions }) => {
  const variationColor = watch("variationColor") || [];
  const variationSize = watch("variationSize") || [];


  // -------- COLOR GALLERY FIELD ARRAY --------
  // const {
  //   fields: colorFields,
  //   append: appendColorGallery,
  //   replace: replaceColorGallery
  // } = useFieldArray({
  //   control,
  //   name: "colorGalleries"
  // });

  // -------- VARIATIONS FIELD ARRAY --------
  const {
    fields: variationFields,
    append: appendVariation,
    remove: removeVariation,
    replace: replaceVariation
  } = useFieldArray({
    control,
    name: "variations"
  });



  // Generate variations whenever colors or sizes change
  const [removedVariations, setRemovedVariations] = useState([]);

  useEffect(() => {
    if (variationColor.length === 0 && variationSize.length === 0) {
      if (variationFields.length > 0) replaceVariation([]);
      return;
    }

    const newVariations = [];

    for (let color of variationColor) {
      for (let size of variationSize) {
        // skip manually removed variations
        if (removedVariations.some(r => r.color === color && r.size === size)) continue;

        const existing = variationFields.find(f => f.color === color && f.size === size);
        if (existing) {
          newVariations.push(existing);
        } else {
          newVariations.push({ color, size, price: "", quantity: "" });
        }
      }
    }

    const isSame =
      newVariations.length === variationFields.length &&
      newVariations.every((v, i) => v.color === variationFields[i].color && v.size === variationFields[i].size);

    if (!isSame) {
      replaceVariation(newVariations);
    }
  }, [variationColor, variationSize, replaceVariation, removedVariations]);


  useEffect(() => {
    // Only reset removed variations if the selected colors or sizes changed
    setRemovedVariations([]);
  }, [variationColor.join(","), variationSize.join(",")]);


  // // ------------------ HANDLE COLOR-LEVEL GALLERIES ------------------
  // useEffect(() => {
  //   const selectedColors = variationColor;

  //   if (selectedColors.length === 0) {
  //     if (colorFields.length !== 0) replaceColorGallery([]);
  //     return;
  //   }

  //   const colorFieldsColors = colorFields.map(c => c.color);
  //   const isSame =
  //     selectedColors.length === colorFieldsColors.length &&
  //     selectedColors.every(c => colorFieldsColors.includes(c));

  //   if (!isSame) {
  //     const mapped = selectedColors.map(color => {
  //       const existing = colorFields.find(c => c.color === color);
  //       return existing || { color, gallery: [] };
  //     });

  //     replaceColorGallery(mapped);
  //   }
  // }, [variationColor, colorFields]);



  // When user removes manually
  const handleRemove = (index) => {
    const removed = variationFields[index];
    setRemovedVariations(prev => [...prev, { color: removed.color, size: removed.size }]);
    removeVariation(index);
  };


  return (
    <div className="col-span-12 space-y-2 ">



      {/* {(colorFields.length > 0 && variationFields.length > 0) && (
        <div className="space-y-4">
          <Label>Gallery per Color</Label>

          {colorFields.map((item, index) => {
            return (
              <div
                key={item.id}
                className="border border-gray-200 p-4 rounded-md space-y-2"
              >
                <p className="font-medium">
                  {colorOptions.find(c => c.value === item.color)?.label ||
                    item.color}
                </p>

                <Controller
                  name={`colorGalleries.${index}.gallery`}
                  control={control}
                  render={({ field }) => (
                    <MultipleImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      required
                      label={`gallery-${index}`}   // ADD THIS LINE
                    // label={colorOptions.find(c => c.value === item.color)?.label || item.color}
                    />
                  )}
                />
              </div>
            );
          })}
        </div>
      )} */}

      {variationFields.map((item, index) => {
        return (
          <div
            key={item.id} className="space-y-4">
            <Label>Product Variations</Label>
            <div

              className="grid grid-cols-12 gap-4 border border-gray-200 p-4 rounded-md"
            >

              {/* Color */}
              <div className="col-span-12 sm:col-span-6 md:col-span-3">
                <Label>Color</Label>
                <Controller
                  name={`variations.${index}.color`}
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="text"
                      value={
                        colorOptions.find(c => c.value === item.color)?.label ||
                        item.color
                      }
                      placeholder="Color"
                    />
                  )}
                />
              </div>

              {/* Size */}
              <div className="col-span-12 sm:col-span-6 md:col-span-3">
                <Label>Size</Label>
                <Controller
                  name={`variations.${index}.size`}
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      value={
                        sizeOptions.find(s => s.value === item.size)?.label ||
                        item.size
                      }
                      placeholder="Size"
                    />
                  )}
                />
              </div>



              {/* Price */}
              <div className="col-span-12 md:col-span-6 lg:col-span-4">
                <Label>
                  Price <span className="text-red-400">*</span>
                </Label>
                <Controller
                  name={`variations.${index}.price`}
                  control={control}
                  rules={{ required: "Price is required." }}
                  render={({ field, fieldState }) => (
                    <Input
                      {...field}
                      type="number"
                      placeholder="Product Price"
                      error={!!fieldState.error}
                      hint={fieldState.error?.message}
                    />
                  )}
                />
              </div>
              {/* mrp  */}
              <div className="col-span-12 md:col-span-6 lg:col-span-4">
                <Label>
                  Mrp <span className="text-red-400">*</span>
                </Label>
                <Controller
                  name={`variations.${index}.mrp`}
                  control={control}
                  rules={{ required: "MRP is required." }}
                  render={({ field, fieldState }) => (
                    <Input
                      {...field}
                      type="number"
                      placeholder="Product Price"
                      error={!!fieldState.error}
                      hint={fieldState.error?.message}
                    />
                  )}
                />
              </div>


              {/* Quantity */}
              <div className="col-span-12 sm:col-span-6 md:col-span-3">
                <Label>Quantity  <span className="text-red-400">*</span></Label>
                <Controller
                  name={`variations.${index}.quantity`}
                  control={control}
                  rules={{ required: "Quantity is required." }}
                  render={({ field, fieldState }) => (
                    <Input
                      {...field}
                      type="number"
                      placeholder="Qty"
                      error={!!fieldState.error}
                      hint={fieldState.error?.message} />
                  )}
                />
              </div>




              {/* Remove Variation */}
              <div className="col-span-12 flex justify-end items-end">
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="p-2 bg-red-500 text-white rounded-md"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        )
      })}

    </div>


  );
};

export default VariationsSection;
