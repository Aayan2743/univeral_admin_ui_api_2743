// import { useEffect, useRef, useState } from "react";

// export default function ProductCard({ product, onClick }) {
//   const images = product.images || [];
//   const [index, setIndex] = useState(0);
//   const timerRef = useRef(null);

//   const startHover = () => {
//     if (images.length <= 1) return;

//     timerRef.current = setInterval(() => {
//       setIndex((prev) => (prev + 1) % images.length);
//     }, 900);
//   };

//   const stopHover = () => {
//     clearInterval(timerRef.current);
//     timerRef.current = null;
//     setIndex(0);
//   };

//   useEffect(() => {
//     return () => clearInterval(timerRef.current);
//   }, []);

//   return (
//     <div
//       onMouseEnter={startHover}
//       onMouseLeave={stopHover}
//       onClick={() => onClick(product)}
//       className="
//         bg-white rounded-2xl border cursor-pointer
//         hover:shadow-lg transition overflow-hidden
//       "
//     >
//       {/* IMAGE */}
//       <div className="relative h-32 bg-gray-100">
//         {images.length > 0 ? (
//           <img
//             src={images[index]?.image_url}
//             alt={product.name}
//             className="h-full w-full object-cover transition-all"
//           />
//         ) : (
//           <div className="h-full flex items-center justify-center text-gray-400 text-sm">
//             No Image
//           </div>
//         )}

//         {/* IMAGE DOTS */}
//         {images.length > 1 && (
//           <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
//             {images.map((_, i) => (
//               <span
//                 key={i}
//                 className={`h-1.5 w-1.5 rounded-full ${
//                   i === index ? "bg-white" : "bg-white/40"
//                 }`}
//               />
//             ))}
//           </div>
//         )}
//       </div>

//       {/* INFO */}
//       <div className="p-3">
//         <h4 className="text-sm font-medium line-clamp-2">{product.name}</h4>

//         <p className="text-sm font-semibold mt-1">₹ {product.price}</p>

//         <p className="text-xs text-gray-500">
//           {product.variations?.length || 0} variants
//         </p>
//       </div>
//     </div>
//   );
// }

import { useEffect, useRef, useState } from "react";

export default function ProductCard({ product, onClick }) {
  const images = product.image_url ? [{ image_url: product.image_url }] : [];

  const variants = product.variants || [];

  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  const startHover = () => {
    if (images.length <= 1) return;

    timerRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 900);
  };

  const stopHover = () => {
    clearInterval(timerRef.current);
    timerRef.current = null;
    setIndex(0);
  };

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  return (
    <div
      onMouseEnter={startHover}
      onMouseLeave={stopHover}
      onClick={() => onClick(product)}
      className="bg-white rounded-2xl border cursor-pointer hover:shadow-lg transition overflow-hidden"
    >
      {/* IMAGE */}
      <div className="relative h-32 bg-gray-100">
        {images.length > 0 ? (
          <img
            src={images[index]?.image_url}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400 text-sm">
            No Image
          </div>
        )}
      </div>

      {/* INFO */}
      <div className="p-3">
        <h4 className="text-sm font-medium line-clamp-2">{product.name}</h4>

        <p className="text-sm font-semibold mt-1">
          ₹ {variants?.[0]?.price || 0}
        </p>

        <p className="text-xs text-gray-500">
          {variants?.length || 0} variants
        </p>
      </div>
    </div>
  );
}
