import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const ImagePreviewModal = ({ show, onClose, thumbnail, gallery }) => {
  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal Content */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
          >
            <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-3xl max-h-[85vh] overflow-y-auto">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
              >
                <X size={24} />
              </button>

              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                Image Preview
              </h2>

              {/* Thumbnail */}
              {thumbnail && (
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-2 font-medium">
                    Thumbnail
                  </p>
                  <img
                    src={thumbnail}
                    alt="Thumbnail"
                    className="w-40 h-40 object-cover rounded-xl border shadow-sm"
                  />
                </div>
              )}

              {/* Gallery */}
              {gallery && gallery.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 mb-2 font-medium">
                    Gallery Images
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {gallery.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt={`Gallery ${i + 1}`}
                        className="w-full h-40 object-cover rounded-xl border shadow-sm hover:scale-105 transition-transform"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ImagePreviewModal;
