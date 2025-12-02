import React, { useState, useEffect } from "react";
import { useLoaderData, useRevalidator } from "react-router-dom";
import { useForm, Controller } from "react-hook-form"
import api from "../../config/axios"; // Import your axios instance
import { toast } from "react-toastify";
import { useDispatch } from "react-redux"
import { setLoading } from "../../redux/themeSlice"

import Checkbox from "../../components/common/form/input/Checkbox";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "../../components/common/ui/table/index";
import { Trash, Pencil } from "lucide-react";
import ImagePreviewModal from "../../components/common/modal/ImagePreviewModal";

import AddProduct from "../../components/admin/Products/AddProduct";
import EditProduct from "../../components/admin/Products/EditProduct";
import VariationList from "../../components/admin/Products/VariationList";







function Products() {
  const data = useLoaderData(); // loads data from the loader function
  const revalidator = useRevalidator(); // used to revalidate the loader data after form submission
  const [productVariations, setProductVariations] = useState([]);
  const [colorGalleries, setColorGalleries] = useState([]);
  const [currentProductId, setCurrentProductId] = useState(null);

  // edit base detils
  const [currentEditDetails, setCurrentEditDetails] = useState(null);

  const [mode, setMode] = useState("list"); // add or edit mode

  // image modal states
  const [showModal, setShowModal] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [galleryPreviews, setGalleryPreviews] = useState([]);


  const handleDeleteItem = async (item) => {
    console.log("handleDeleteItem", item._id)
    const toastId = toast.loading("Removing Item...")
    try {
      const response = await api.delete(`/admin/products/${item._id}`);
      console.log("response delete", response)

      toast.update(toastId, {
        render: response.data.message,
        type: response.data.status === "success" ? "success" : "failure",
        isLoading: false,
        autoClose: 3000,
      });
      revalidator.revalidate();
    } catch (error) {
      console.error("Error Removing Item", error)
      toast.update(toastId, {
        render: "Error in Removing Item",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    }
  }




  const handleOpenImagePreview = (thumbnail, gallery) => {
    setThumbnailPreview(thumbnail);
    setGalleryPreviews(gallery);
    setShowModal(true);
  }

  // function to set new arrivals
  const handleSetNewArrivals = async (e, itemId, newArrivalStatus) => {
    console.log(e, itemId, newArrivalStatus)
    try {
      const toastId = toast.loading("Updating New Arrival");
      const res = await api.patch(`admin/products/${itemId}/newArrival`, {
        status: !newArrivalStatus
      })
      toast.update(toastId, {
        render: res.data.message,
        type: res.data.status === "success" ? "success" : "error",
        isLoading: false,
        autoClose: 3000,
        closeButton: true
      })
      if (res.data.status === "success")
        revalidator.revalidate();
    } catch (error) {
      console.log("Error Setting new arrival to product", error);
      toast.error("Something went wrong");
    }
  }

  const handleOpenVariants = async (productId) => {
    console.log("handleOpenVariants", productId);
    setCurrentProductId(productId);
    try {
      const response = await api.get(`/admin/products/${productId}/variants`);

      const colorWiseGalleryResponse = await api.get(`/admin/products/${productId}/color-gallery`);

      console.log("response get variants", response.data);
      console.log("colorWiseGalleryResponse", colorWiseGalleryResponse.data);

      setProductVariations(response.data.variations);
      setColorGalleries(colorWiseGalleryResponse.data.data);
      if (response.data.status === "success")
        setMode("view-variations");
      else {
        toast.error("Could not fetch product variations");
      }
    } catch (error) {
      console.error("Error fetching product variations:", error);
      toast.error("Something went wrong");
    }
  }


  const handleEditProduct = (item) => {
    console.log("handleEditProduct", item);
    setCurrentEditDetails(item);
    setMode("edit");
  }




  return (
    <div className="relative w-full text-black dark:text-white">
      {/* product list */}
      {mode === "list" && (
        <div className="relative">
          <div className="flex justify-between">
            <h1 className="text-2xl  font-bold ">Manage Products</h1>
            <button
              onClick={() => setMode("add")}
              className="bg-black px-3 py-2 text-white rounded-md cursor-pointer hover:bg-gray-800 transition-colors duration-300"
            >
              + Add New Product
            </button>
          </div>

          <div className="bg-white dark:bg-admin-dark-500 shadow-md rounded-xl border border-gray-200 dark:border-gray-500 overflow-auto mt-4">
            <Table className="text-gray-600 w-full">
              <TableHeader className="bg-admin-500 dark:bg-admin-dark-700 border-b order border-gray-200 dark:border-gray-500">
                <TableRow>
                  {[
                    "Sr. no",
                    "Title",
                    "New Arrival",
                    "Thumbnail",
                    "Category slug",
                    "Variations",
                    "Action",
                  ].map((heading) => (
                    <TableCell
                      key={heading}
                      isHeader
                      className="px-5 py-3 text-xs font-medium text-gray-600 text-start text-theme-xs dark:text-gray-400"
                    >
                      <div className="text-md">{heading}</div>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05] text-black dark:text-white">
                {data.data.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="sm:px-6  px-4 py-3 text-xs text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {index + 1}
                    </TableCell>
                    <TableCell className="sm:px-6  px-4 py-3 text-xs text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div>{item.title}</div>
                    </TableCell>

                    <TableCell className="sm:px-6  px-4 py-3 text-xs text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div><Checkbox onChange={(e) => handleSetNewArrivals(e, item._id, item.newArrival)} checked={item.newArrival} /></div>
                    </TableCell>

                    <TableCell className="sm:px-6  px-4 py-3 text-xs text-gray-500 text-start text-theme-sm dark:text-gray-400 w-32">
                      {item.thumbnail?.url && <div>
                        <img
                          className="w-24 aspect-square object-cover"
                          src={`${item.thumbnail?.url}`}
                          alt=""
                        />
                      </div>}
                    </TableCell >

                    {/* <TableCell className="sm:px-6 px-4 py-3 text-xs text-gray-500 text-start text-theme-sm dark:text-gray-400 w-32">
                      {item.thumbnail?.url && (
                        <div
                          className="relative group w-fit"
                          onClick={() =>
                            handleOpenImagePreview(
                              item.thumbnail?.url,
                              item.gallery.map((img) => img.url)
                            )
                          }
                        >

                          <img
                            className="w-24 aspect-square object-cover rounded-md shadow-sm transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                            src={`${item.gallery[0]?.url}`}
                            alt="Thumbnail"
                          />

                          
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 rounded-md transition-opacity duration-300 flex items-center justify-center">
                            <span className="text-white text-[11px] font-medium">Preview</span>
                          </div>
                        </div>
                      )}
                    </TableCell> */}
                    <TableCell className="sm:px-6  px-4 py-3 text-xs text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div>{item.category.slug}</div>
                    </TableCell>
                    <TableCell className="sm:px-6  px-4 py-3 text-xs text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div className="hover:text-blue-500 cursor-pointer" onClick={() => handleOpenVariants(item._id)}>View</div>
                    </TableCell>


                    <TableCell className="sm:px-6  px-4 py-3 text-xs text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditProduct(item)}
                          className="text-blue-500 hover:text-blue-700 font-medium"
                        >
                          <Pencil size={18} />
                        </button>

                        <button onClick={() => handleDeleteItem(item)} className="text-red-500 hover:text-red-700 font-medium">
                          <Trash size={18} className="text-red-500" />
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
      {mode === "view-variations" && <VariationList setMode={setMode} productVariations={productVariations} colorGalleries={colorGalleries} productId={currentProductId} />}

      {/* add new product */}
      {mode === "add" && <AddProduct setMode={setMode} revalidator={revalidator} />}
      {mode === "edit" && <EditProduct setMode={setMode} currentEditDetails={currentEditDetails} revalidator={revalidator} />}

      {/* image modal */}
      <ImagePreviewModal
        show={showModal}
        onClose={() => setShowModal(false)}
        thumbnail={thumbnailPreview}
        gallery={galleryPreviews}
      />
    </div>
  );
}





export default Products;
