// // "use client";

// // import { useEffect, useState, useRef } from "react";
// // import api from "../../api/axios";

// // import EditStepBasic from "./steps/EditStepBasic";
// // import StepGallery from "./steps/StepGallery";
// // import StepVariation from "./steps/StepVariation";
// // import StepMeta from "./steps/StepMeta";
// // import StepTax from "./steps/StepTax";
// // import EditStepGallery from "./steps/EditStepGallery";
// // import EditStepVariation from "./steps/EditStepVariation";
// // import EditStepMeta from "./steps/EditStepMeta";
// // import EditStepTax from "./steps/EditStepTax";
// // import ProductWizardHeader from "../components/ProductWizardHeader";

// // export default function EditProductDrawer({
// //   open,
// //   onClose,
// //   productId, // 👈 coming from Products.jsx
// // }) {
// //   const [step, setStep] = useState(1);

// //   const galleryRef = useRef(null);
// //   const variationRef = useRef(null);
// //   const metaRef = useRef(null);
// //   const taxRef = useRef(null);

// //   // ✅ THIS WAS MISSING
// //   const [product, setProduct] = useState(null);
// //   const [loading, setLoading] = useState(false);

// //   const [form, setForm] = useState({
// //     basic: {
// //       name: "",
// //       category_id: "",
// //       brand_id: "",
// //       description: "",
// //       base_price: "",
// //       discount: "",
// //     },
// //     gallery: [],
// //     variations: [],
// //     meta: {},
// //     tax: {},
// //   });

// //   /* =====================================
// //      🔥 FETCH PRODUCT USING productId
// //   ===================================== */
// //   useEffect(() => {
// //     if (!open || !productId) return;

// //     console.log("🟢 Fetching product with ID:", productId);

// //     const fetchProduct = async () => {
// //       try {
// //         setLoading(true);

// //         const res = await api.get(
// //           `/admin-dashboard/product/fetch-products-by-id/${productId}`,
// //         );

// //         const productData = res.data.data;

// //         console.log("🟢 Product API response:", productData);

// //         // ✅ set product state
// //         setProduct(productData);

// //         // ✅ hydrate form for other steps if needed
// //         setForm({
// //           basic: {
// //             name: productData.name || "",
// //             category_id: productData.category_id || "",
// //             brand_id: productData.brand_id || "",
// //             description: productData.description || "",
// //             base_price: productData.base_price || "",
// //             discount: productData.discount || "",
// //           },
// //           gallery: productData.gallery || [],
// //           variations: productData.variations || [],
// //           meta: productData.meta || {},
// //           tax: productData.product_tax || {},
// //         });
// //       } catch (err) {
// //         console.error("❌ Failed to fetch product", err);
// //         alert("Failed to load product details");
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchProduct();
// //   }, [open, productId]);

// //   if (!open) return null;

// //   return (
// //     <>
// //       {/* Overlay */}
// //       <div
// //         className="fixed inset-0 bg-black/40 z-40"
// //         onClick={(e) => {
// //           e.stopPropagation();
// //           onClose();
// //         }}
// //       />

// //       {/* Drawer */}
// //       <div className="fixed top-0 right-0 z-50 h-full w-full md:w-[50%] bg-white shadow-xl flex flex-col">
// //         {/* <Header step={step} onClose={onClose} /> */}
// //         <ProductWizardHeader
// //           title="Edit Product"
// //           step={step}
// //           setStep={setStep}
// //           onClose={onClose}
// //         />

// //         <div className="flex-1 overflow-y-auto px-6 py-8">
// //           {loading ? (
// //             <div className="text-center py-10">Loading product...</div>
// //           ) : (
// //             <>
// //               {step === 1 && (
// //                 <EditStepBasic
// //                   mode="edit"
// //                   product={product} // ✅ NOW DEFINED
// //                   setStep={setStep}
// //                   setProductId={() => {}}
// //                 />
// //               )}

// //               {step === 2 && (
// //                 <EditStepGallery
// //                   ref={galleryRef}
// //                   productId={productId}
// //                   existingImages={form.gallery} // 👈 FROM API
// //                   existingVideo={product?.video}
// //                 />
// //               )}

// //               {step === 3 && (
// //                 <EditStepVariation
// //                   ref={variationRef}
// //                   productId={productId}
// //                   // existingCombinations={product?.variantCombinations || []}
// //                   existingCombinations={product?.variantCombinations || []}
// //                 />
// //               )}

// //               {step === 4 && (
// //                 <EditStepMeta
// //                   ref={metaRef}
// //                   productId={productId}
// //                   meta={form.meta} // 🔥 PASS FETCHED META
// //                 />
// //               )}

// //               {step === 5 && (
// //                 <EditStepTax
// //                   ref={taxRef}
// //                   productId={product?.id}
// //                   productStatus={product?.status}
// //                   data={product?.product_tax} // ✅ FIXED
// //                 />
// //               )}
// //             </>
// //           )}
// //         </div>

// //         <Footer
// //           step={step}
// //           onBack={() => setStep(step - 1)}
// //           onNext={async () => {
// //             // STEP 2 → SAVE GALLERY
// //             if (step === 2) {
// //               if (!galleryRef.current) {
// //                 alert("Gallery not ready");
// //                 return;
// //               }

// //               const ok = await galleryRef.current.saveStep();
// //               if (!ok) return;
// //             }

// //             // 🔥 STEP 3 → SAVE VARIATIONS
// //             if (step === 3) {
// //               if (!variationRef.current) {
// //                 alert("Variations not ready");
// //                 return;
// //               }

// //               const ok = await variationRef.current.saveStep();
// //               if (!ok) return;
// //             }

// //             if (step === 4) {
// //               const ok = await metaRef.current.saveStep();
// //               if (!ok) return;
// //             }

// //             setStep(step + 1);
// //           }}
// //           // onSubmit={() => console.log("UPDATE PRODUCT PAYLOAD:", form)}
// //           onSubmit={async () => {
// //             // 🔥 STEP 5 SAVE
// //             const ok = await taxRef.current.saveStep();
// //             if (!ok) return;

// //             alert("Product updated successfully");
// //             onClose();
// //           }}
// //         />
// //       </div>
// //     </>
// //   );
// // }

// // /* ================= HEADER ================= */

// // function Header({ step, onClose }) {
// //   return (
// //     <div className="h-16 px-6 border-b bg-gray-50 flex items-center justify-between">
// //       <div>
// //         <h2 className="text-lg font-semibold">Edit Product</h2>
// //         <p className="text-sm text-gray-500">Step {step} of 5</p>
// //       </div>

// //       <button
// //         onClick={onClose}
// //         className="text-xl text-gray-500 hover:text-black"
// //       >
// //         ✕
// //       </button>
// //     </div>
// //   );
// // }

// // /* ================= FOOTER ================= */

// // function Footer({ step, onBack, onNext, onSubmit }) {
// //   return (
// //     <div className="h-16 px-6 border-t bg-gray-50 flex items-center justify-between">
// //       {/* BACK */}
// //       <button
// //         disabled={step === 1}
// //         onClick={onBack}
// //         className="px-4 py-2 rounded border disabled:opacity-50"
// //       >
// //         Back
// //       </button>

// //       {/* NEXT / SUBMIT */}
// //       {step < 5 ? (
// //         <button
// //           onClick={onNext}
// //           className="px-6 py-2 rounded bg-indigo-600 text-white"
// //         >
// //           Next
// //         </button>
// //       ) : (
// //         <button
// //           onClick={onSubmit}
// //           className="px-6 py-2 rounded bg-green-600 text-white"
// //         >
// //           Update Product
// //         </button>
// //       )}
// //     </div>
// //   );
// // }

// "use client";

// import { useEffect, useState, useRef } from "react";
// import api from "../../api/axios";

// import EditStepBasic from "./steps/EditStepBasic";
// import EditStepGallery from "./steps/EditStepGallery";
// import EditStepVariation from "./steps/EditStepVariation";
// import EditStepMeta from "./steps/EditStepMeta";
// import EditStepTax from "./steps/EditStepTax";
// import ProductWizardHeader from "../components/ProductWizardHeader";

// export default function EditProductDrawer({ open, onClose, productId }) {
//   const [step, setStep] = useState(1);
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const galleryRef = useRef(null);
//   const variationRef = useRef(null);
//   const metaRef = useRef(null);
//   const taxRef = useRef(null);

//   /* ================= FETCH PRODUCT ================= */

//   useEffect(() => {
//     if (!open || !productId) return;

//     const fetchProduct = async () => {
//       try {
//         setLoading(true);

//         const res = await api.get(
//           `/admin-dashboard/product/fetch-products-by-id/${productId}`,
//         );

//         setProduct(res.data.data);
//       } catch (err) {
//         console.error("Failed to fetch product", err);
//         alert("Failed to load product");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProduct();
//   }, [open, productId]);

//   /* ================= CLOSE RESET ================= */

//   useEffect(() => {
//     if (!open) {
//       setStep(1);
//       setProduct(null);
//     }
//   }, [open]);

//   if (!open) return null;

//   return (
//     <>
//       {/* Overlay */}
//       <div
//         className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
//         onClick={onClose}
//       />

//       {/* Drawer */}
//       <div className="fixed top-0 right-0 z-50 h-full w-full md:w-[55%] bg-white shadow-2xl flex flex-col transform transition-all duration-300">
//         {/* HEADER */}
//         <ProductWizardHeader
//           title="Edit Product"
//           step={step}
//           setStep={setStep}
//           onClose={onClose}
//         />

//         {/* BODY */}
//         <div className="flex-1 overflow-y-auto px-6 py-6">
//           {loading ? (
//             <div className="text-center py-16 text-gray-500">
//               Loading product...
//             </div>
//           ) : (
//             <>
//               {step === 1 && (
//                 <EditStepBasic product={product} setStep={setStep} />
//               )}

//               {step === 2 && (
//                 <EditStepGallery
//                   ref={galleryRef}
//                   productId={productId}
//                   existingImages={product?.gallery || []}
//                   existingVideo={product?.video}
//                 />
//               )}

//               {step === 3 && (
//                 <EditStepVariation
//                   ref={variationRef}
//                   productId={productId}
//                   existingCombinations={product?.variantCombinations || []}
//                 />
//               )}

//               {step === 4 && (
//                 <EditStepMeta
//                   ref={metaRef}
//                   productId={productId}
//                   meta={product?.meta || {}}
//                 />
//               )}

//               {step === 5 && (
//                 <EditStepTax
//                   ref={taxRef}
//                   productId={product?.id}
//                   productStatus={product?.status}
//                   data={product?.product_tax}
//                 />
//               )}
//             </>
//           )}
//         </div>

//         {/* FOOTER */}
//         <Footer
//           step={step}
//           onBack={() => setStep((prev) => Math.max(prev - 1, 1))}
//           onNext={async () => {
//             if (step === 2) {
//               if (!(await galleryRef.current?.saveStep())) return;
//             }

//             if (step === 3) {
//               if (!(await variationRef.current?.saveStep())) return;
//             }

//             if (step === 4) {
//               if (!(await metaRef.current?.saveStep())) return;
//             }

//             setStep((prev) => Math.min(prev + 1, 5));
//           }}
//           onSubmit={async () => {
//             if (!(await taxRef.current?.saveStep())) return;

//             alert("Product updated successfully");
//             onClose();
//           }}
//         />
//       </div>
//     </>
//   );
// }

// /* ================= FOOTER ================= */

// function Footer({ step, onBack, onNext, onSubmit }) {
//   return (
//     <div className="h-16 px-6 border-t bg-white flex items-center justify-between shadow-inner">
//       <button
//         disabled={step === 1}
//         onClick={onBack}
//         className="px-5 py-2 rounded-md border text-gray-600 hover:bg-gray-100 disabled:opacity-40"
//       >
//         Back
//       </button>

//       {step < 5 ? (
//         <button
//           onClick={onNext}
//           className="px-6 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 shadow"
//         >
//           Next →
//         </button>
//       ) : (
//         <button
//           onClick={onSubmit}
//           className="px-6 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 shadow"
//         >
//           Update Product
//         </button>
//       )}
//     </div>
//   );
// }

"use client";

import { useEffect, useState, useRef } from "react";
import api from "../../api/axios";

import EditStepBasic from "./steps/EditStepBasic";
import EditStepGallery from "./steps/EditStepGallery";
import EditStepVariation from "./steps/EditStepVariation";
import EditStepMeta from "./steps/EditStepMeta";
import EditStepTax from "./steps/EditStepTax";

const STEPS = ["Basic", "Gallery", "Variation", "SEO", "Tax"];

export default function EditProductDrawer({ open, onClose, productId }) {
  const [step, setStep] = useState(1);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  const galleryRef = useRef(null);
  const variationRef = useRef(null);
  const metaRef = useRef(null);
  const taxRef = useRef(null);

  /* ================= FETCH PRODUCT ================= */

  useEffect(() => {
    if (!open || !productId) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);

        const res = await api.get(
          `/admin-dashboard/product/fetch-products-by-id/${productId}`,
        );

        setProduct(res.data.data);
      } catch (err) {
        console.error("Failed to fetch product", err);
        alert("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [open, productId]);

  /* ================= RESET ON CLOSE ================= */

  useEffect(() => {
    if (!open) {
      setStep(1);
      setProduct(null);
    }
  }, [open]);

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-[9999] flex">
        {/* ================= LEFT SIDEBAR 20% ================= */}
        <div className="w-[20%] bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white p-8 flex flex-col shadow-2xl">
          <h2 className="text-2xl font-semibold mb-2">Edit Product</h2>
          <p className="text-sm text-white/80 mb-10">
            Step {step} of {STEPS.length}
          </p>

          <div className="space-y-4 flex-1">
            {STEPS.map((label, index) => {
              const tabStep = index + 1;
              const isActive = step === tabStep;
              const isCompleted = step > tabStep;

              return (
                <button
                  key={label}
                  disabled={isCompleted}
                  onClick={() => !isCompleted && setStep(tabStep)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300
                    ${
                      isActive
                        ? "bg-white text-indigo-700 shadow-lg scale-105"
                        : isCompleted
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-white/10"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold
                        ${
                          isActive ? "bg-indigo-600 text-white" : "bg-white/20"
                        }`}
                    >
                      {tabStep}
                    </div>
                    <span>{label}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <button
            onClick={onClose}
            className="text-sm text-white/80 hover:text-white"
          >
            ✕ Close
          </button>
        </div>

        {/* ================= RIGHT SIDE 80% ================= */}
        <div className="w-[80%] overflow-y-auto px-8 py-8 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
          <div className="relative bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-indigo-100 p-8 w-full">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-t-2xl" />

            {loading ? (
              <div className="text-center py-20 text-gray-500">
                Loading product...
              </div>
            ) : (
              <>
                {step === 1 && (
                  <EditStepBasic product={product} setStep={setStep} />
                )}

                {step === 2 && (
                  <EditStepGallery
                    ref={galleryRef}
                    productId={productId}
                    existingImages={product?.gallery || []}
                    existingVideo={product?.video}
                  />
                )}

                {step === 3 && (
                  <EditStepVariation
                    ref={variationRef}
                    productId={productId}
                    existingCombinations={product?.variantCombinations || []}
                  />
                )}

                {step === 4 && (
                  <EditStepMeta
                    ref={metaRef}
                    productId={productId}
                    meta={product?.meta || {}}
                  />
                )}

                {step === 5 && (
                  <EditStepTax
                    ref={taxRef}
                    productId={product?.id}
                    productStatus={product?.status}
                    data={product?.product_tax}
                  />
                )}

                {/* FOOTER */}
                <div className="mt-10 pt-6 flex justify-between items-center border-t border-indigo-100">
                  <button
                    disabled={step === 1}
                    onClick={() => setStep((prev) => Math.max(prev - 1, 1))}
                    className="px-6 py-2 rounded-lg text-gray-600 hover:bg-indigo-50"
                  >
                    ← Back
                  </button>

                  {step < 5 ? (
                    <button
                      onClick={async () => {
                        if (step === 2) {
                          if (!(await galleryRef.current?.saveStep())) return;
                        }

                        if (step === 3) {
                          if (!(await variationRef.current?.saveStep())) return;
                        }

                        if (step === 4) {
                          if (!(await metaRef.current?.saveStep())) return;
                        }

                        setStep((prev) => prev + 1);
                      }}
                      className="px-8 py-2 rounded-lg text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"
                    >
                      Next →
                    </button>
                  ) : (
                    <button
                      onClick={async () => {
                        if (!(await taxRef.current?.saveStep())) return;
                        alert("Product updated successfully");
                        onClose();
                      }}
                      className="px-8 py-2 rounded-lg text-white bg-green-600"
                    >
                      Update Product
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
