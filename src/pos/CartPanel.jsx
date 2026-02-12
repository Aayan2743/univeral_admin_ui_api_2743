// import { useState, useMemo } from "react";
// import api from "../api/axios";

// export default function CartPanel({ cart = [], setCart }) {
//   /* ================= CUSTOMER ================= */
//   const [customer, setCustomer] = useState({
//     name: "",
//     phone: "",
//   });

//   const [selectedCustomer, setSelectedCustomer] = useState(null);

//   /* ================= ADDRESS ================= */
//   const [addresses, setAddresses] = useState([]);
//   const [selectedAddress, setSelectedAddress] = useState(null);
//   const [showNewAddress, setShowNewAddress] = useState(false);

//   const [newAddress, setNewAddress] = useState({
//     address_line: "",
//     city: "",
//     state: "",
//     pincode: "",
//   });

//   const [discount, setDiscount] = useState(0);
//   const [paymentMode, setPaymentMode] = useState("pay");

//   /* ================= GST ================= */
//   const [gstEnabled, setGstEnabled] = useState(true);
//   const [gstPercent, setGstPercent] = useState(5);

//   /* ================= HELPERS ================= */
//   const isValidPhone = (phone) => /^[6-9]\d{9}$/.test(phone);

//   /* ================= CALCULATIONS ================= */
//   const subtotal = useMemo(
//     () => cart.reduce((s, i) => s + i.price * i.qty, 0),
//     [cart],
//   );

//   const gst = useMemo(() => {
//     if (!gstEnabled) return 0;
//     return (subtotal * gstPercent) / 100;
//   }, [subtotal, gstEnabled, gstPercent]);

//   const total = Math.max(subtotal + gst - discount, 0);

//   /* ================= QTY HANDLERS ================= */
//   const increaseQty = (index) => {
//     setCart((prev) =>
//       prev.map((item, i) => {
//         if (i !== index) return item;
//         if (item.qty >= item.stock) return item;
//         return { ...item, qty: item.qty + 1 };
//       }),
//     );
//   };

//   const decreaseQty = (index) => {
//     setCart((prev) =>
//       prev
//         .map((item, i) => (i === index ? { ...item, qty: item.qty - 1 } : item))
//         .filter((item) => item.qty > 0),
//     );
//   };

//   /* ================= SUBMIT ================= */

//   const handleSubmit = async () => {
//     if (!customer.name || !isValidPhone(customer.phone)) {
//       alert("Enter valid customer details");
//       return;
//     }

//     if (cart.length === 0) {
//       alert("Cart is empty");
//       return;
//     }

//     const payload = {
//       customer_id: selectedCustomer?.id || null,
//       address_id: selectedAddress || null,
//       new_address: showNewAddress ? newAddress : null,

//       payment_method: paymentMode,
//       paid_amount: Number(total.toFixed(2)),

//       customer_name: customer.name,
//       customer_phone: customer.phone,

//       items: cart.map((item) => ({
//         product_id: item.product_id,
//         variant_id: item.variation_id,
//         qty: item.qty,
//       })),
//     };

//     try {
//       const res = await api.post("/admin-dashboard/pos/create-order", payload);

//       if (res.data.success) {
//         alert(`Order Created: ${res.data.data.invoice_number}`);
//         setCart([]);
//       } else {
//         alert(res.data.message);
//       }
//     } catch (err) {
//       alert(err.response?.data?.message || "Order failed");
//     }
//   };

//   return (
//     <div className="w-96 bg-white border-l flex flex-col h-screen">
//       {/* HEADER */}
//       <div className="p-4 border-b">
//         <h3 className="text-lg font-semibold">Billing</h3>
//       </div>

//       {/* CUSTOMER */}
//       <div className="p-4 border-b space-y-2">
//         <input
//           value={customer.phone}
//           onChange={async (e) => {
//             const val = e.target.value.replace(/\D/g, "");

//             if (val.length <= 10) {
//               setCustomer((p) => ({ ...p, phone: val }));
//             }

//             if (val.length === 10) {
//               try {
//                 const res = await api.get(
//                   `/admin-dashboard/pos/search-user?phone=${val}`,
//                 );

//                 if (res.data.success) {
//                   const user = res.data.data;
//                   setSelectedCustomer(user);

//                   setCustomer((p) => ({
//                     ...p,
//                     name: user.name,
//                   }));

//                   if (res.data.success) {
//                     const user = res.data.data;

//                     setSelectedCustomer(user);

//                     setCustomer((p) => ({
//                       ...p,
//                       name: user.name,
//                     }));

//                     // 🔥 USE ADDRESSES FROM SAME RESPONSE
//                     if (user.addresses && user.addresses.length > 0) {
//                       setAddresses(user.addresses);
//                       setSelectedAddress(user.addresses[0].id);
//                       setShowNewAddress(false);
//                     } else {
//                       setAddresses([]);
//                       setSelectedAddress(null);
//                       setShowNewAddress(true);
//                     }
//                   }
//                 } else {
//                   setSelectedCustomer(null);
//                   setAddresses([]);
//                   setShowNewAddress(false);
//                 }
//               } catch {
//                 setSelectedCustomer(null);
//                 setAddresses([]);
//                 setShowNewAddress(false);
//               }
//             }
//           }}
//           placeholder="Mobile Number"
//           className="w-full border rounded-lg px-3 py-2 text-sm"
//         />

//         <input
//           value={customer.name}
//           disabled={!!selectedCustomer}
//           onChange={(e) => setCustomer((p) => ({ ...p, name: e.target.value }))}
//           placeholder="Customer Name"
//           className={`w-full border rounded-lg px-3 py-2 text-sm ${
//             selectedCustomer ? "bg-gray-100 cursor-not-allowed" : ""
//           }`}
//         />

//         {/* ================= ADDRESS UI ================= */}

//         {selectedCustomer && (
//           <div className="mt-2 space-y-2">
//             {addresses.length > 0 && !showNewAddress && (
//               <>
//                 <label className="text-xs font-medium text-gray-600">
//                   Select Address
//                 </label>

//                 <select
//                   value={selectedAddress || ""}
//                   onChange={(e) => setSelectedAddress(e.target.value)}
//                   className="w-full border rounded-lg px-3 py-2 text-sm"
//                 >
//                   {addresses.map((addr) => (
//                     <option key={addr.id} value={addr.id}>
//                       {addr.address_line}, {addr.city}, {addr.state} -{" "}
//                       {addr.pincode}
//                     </option>
//                   ))}
//                 </select>

//                 <button
//                   onClick={() => setShowNewAddress(true)}
//                   className="text-xs text-blue-600 underline"
//                 >
//                   + Add New Address
//                 </button>
//               </>
//             )}

//             {showNewAddress && (
//               <div className="space-y-2 p-3 border rounded-lg bg-gray-50">
//                 <input
//                   placeholder="Address Line"
//                   value={newAddress.address_line}
//                   onChange={(e) =>
//                     setNewAddress({
//                       ...newAddress,
//                       address_line: e.target.value,
//                     })
//                   }
//                   className="w-full border rounded px-3 py-2 text-sm"
//                 />

//                 <div className="grid grid-cols-2 gap-2">
//                   <input
//                     placeholder="City"
//                     value={newAddress.city}
//                     onChange={(e) =>
//                       setNewAddress({
//                         ...newAddress,
//                         city: e.target.value,
//                       })
//                     }
//                     className="border rounded px-3 py-2 text-sm"
//                   />

//                   <input
//                     placeholder="State"
//                     value={newAddress.state}
//                     onChange={(e) =>
//                       setNewAddress({
//                         ...newAddress,
//                         state: e.target.value,
//                       })
//                     }
//                     className="border rounded px-3 py-2 text-sm"
//                   />
//                 </div>

//                 <input
//                   placeholder="Pincode"
//                   maxLength={6}
//                   value={newAddress.pincode}
//                   onChange={(e) =>
//                     setNewAddress({
//                       ...newAddress,
//                       pincode: e.target.value.replace(/\D/g, ""),
//                     })
//                   }
//                   className="w-full border rounded px-3 py-2 text-sm"
//                 />

//                 {addresses.length > 0 && (
//                   <button
//                     onClick={() => setShowNewAddress(false)}
//                     className="text-xs text-gray-500 underline"
//                   >
//                     Cancel
//                   </button>
//                 )}
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* ITEMS */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-3">
//         {cart.map((item, i) => {
//           const outOfStock = item.stock <= 0;
//           const maxReached = item.qty >= item.stock;

//           return (
//             <div
//               key={i}
//               className="border rounded-xl p-3 flex justify-between items-center"
//             >
//               <div>
//                 <p className="font-medium text-sm">{item.product_name}</p>
//                 <p className="text-xs text-gray-500">{item.variation_name}</p>
//                 <p className="text-sm mt-1 font-semibold">₹ {item.price}</p>
//               </div>

//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={() => decreaseQty(i)}
//                   className="h-8 w-8 border rounded-lg"
//                 >
//                   −
//                 </button>

//                 <span>{item.qty}</span>

//                 <button
//                   disabled={outOfStock || maxReached}
//                   onClick={() => increaseQty(i)}
//                   className="h-8 w-8 border rounded-lg"
//                 >
//                   +
//                 </button>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* SUMMARY */}
//       <div className="border-t p-4 space-y-3 text-sm">
//         <Row label="Subtotal" value={`₹ ${subtotal.toFixed(2)}`} />
//         <Row label="GST" value={`₹ ${gst.toFixed(2)}`} />
//         <Row label="Total" value={`₹ ${total.toFixed(2)}`} />
//       </div>

//       {/* PAYMENT */}
//       <div className="p-4 border-t space-y-3">
//         <button
//           disabled={
//             cart.length === 0 || !customer.name || !isValidPhone(customer.phone)
//           }
//           onClick={handleSubmit}
//           className="w-full bg-green-700 text-white py-4 rounded-2xl disabled:opacity-40"
//         >
//           Proceed to Pay ₹ {total.toFixed(2)}
//         </button>
//       </div>
//     </div>
//   );
// }

// function Row({ label, value }) {
//   return (
//     <div className="flex justify-between">
//       <span>{label}</span>
//       <span>{value}</span>
//     </div>
//   );
// }

import { useState, useMemo } from "react";
import api from "../api/axios";

export default function CartPanel({ cart = [], setCart }) {
  /* ================= CUSTOMER ================= */
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
  });

  const [selectedCustomer, setSelectedCustomer] = useState(null);

  /* ================= ADDRESS ================= */
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showNewAddress, setShowNewAddress] = useState(false);

  const [newAddress, setNewAddress] = useState({
    address_line: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [discount, setDiscount] = useState(0);
  const [paymentMode, setPaymentMode] = useState("pay");

  /* ================= GST ================= */
  const [gstEnabled, setGstEnabled] = useState(true);
  const [gstPercent, setGstPercent] = useState(5);

  /* ================= HELPERS ================= */
  const isValidPhone = (phone) => /^[6-9]\d{9}$/.test(phone);

  /* ================= CALCULATIONS ================= */
  const subtotal = useMemo(
    () => cart.reduce((s, i) => s + i.price * i.qty, 0),
    [cart],
  );

  const gst = useMemo(() => {
    if (!gstEnabled) return 0;
    return (subtotal * gstPercent) / 100;
  }, [subtotal, gstEnabled, gstPercent]);

  const total = Math.max(subtotal + gst - discount, 0);

  /* ================= QTY ================= */
  const increaseQty = (index) => {
    setCart((prev) =>
      prev.map((item, i) =>
        i === index && item.qty < item.stock
          ? { ...item, qty: item.qty + 1 }
          : item,
      ),
    );
  };

  const decreaseQty = (index) => {
    setCart((prev) =>
      prev
        .map((item, i) => (i === index ? { ...item, qty: item.qty - 1 } : item))
        .filter((item) => item.qty > 0),
    );
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!customer.name || !isValidPhone(customer.phone)) {
      alert("Enter valid customer details");
      return;
    }

    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    const payload = {
      customer_id: selectedCustomer?.id || null,
      address_id: selectedAddress || null,
      new_address: showNewAddress ? newAddress : null,

      payment_method: paymentMode,
      paid_amount: Number(total.toFixed(2)),

      customer_name: customer.name,
      customer_phone: customer.phone,

      items: cart.map((item) => ({
        product_id: item.product_id,
        variant_id: item.variation_id,
        qty: item.qty,
      })),
    };

    try {
      const res = await api.post("/admin-dashboard/pos/create-order", payload);

      if (res.data.success) {
        alert(`Order Created: ${res.data.data.invoice_number}`);
        setCart([]);
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Order failed");
    }
  };

  const fetchCityState = async (pincode) => {
    if (pincode.length !== 6) return;

    try {
      const res = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`,
      );
      const data = await res.json();

      if (
        data?.[0]?.Status === "Success" &&
        data?.[0]?.PostOffice?.length > 0
      ) {
        const info = data[0].PostOffice[0];
        setNewAddress((prev) => ({
          ...prev,
          city: info.District || "",
          state: info.State || "",
        }));
      }
    } catch (err) {
      console.error("Pin API failed", err);
    }
  };

  return (
    <div className="w-96 bg-white border-l flex flex-col h-screen">
      {/* HEADER */}
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">Billing</h3>
      </div>

      {/* CUSTOMER */}
      <div className="p-4 border-b space-y-2">
        <input
          value={customer.phone}
          onChange={async (e) => {
            const val = e.target.value.replace(/\D/g, "");

            if (val.length <= 10) {
              setCustomer((p) => ({ ...p, phone: val }));
            }

            if (val.length === 10) {
              try {
                const res = await api.get(
                  `/admin-dashboard/pos/search-user?phone=${val}`,
                );

                if (res.data.success) {
                  const user = res.data.data;

                  setSelectedCustomer(user);

                  setCustomer((p) => ({
                    ...p,
                    name: user.name,
                  }));

                  // ✅ USE ADDRESSES FROM SAME RESPONSE
                  if (user.addresses && user.addresses.length > 0) {
                    setAddresses(user.addresses);
                    setSelectedAddress(user.addresses[0].id);
                    setShowNewAddress(false);
                  } else {
                    setAddresses([]);
                    setSelectedAddress(null);
                    setShowNewAddress(true);
                  }
                } else {
                  setSelectedCustomer(null);
                  setAddresses([]);
                  setShowNewAddress(false);
                }
              } catch {
                setSelectedCustomer(null);
                setAddresses([]);
                setShowNewAddress(false);
              }
            }
          }}
          placeholder="Mobile Number"
          className="w-full border rounded-lg px-3 py-2 text-sm"
        />

        <input
          value={customer.name}
          disabled={!!selectedCustomer}
          onChange={(e) => setCustomer((p) => ({ ...p, name: e.target.value }))}
          placeholder="Customer Name"
          className={`w-full border rounded-lg px-3 py-2 text-sm ${
            selectedCustomer ? "bg-gray-100 cursor-not-allowed" : ""
          }`}
        />

        {/* ADDRESS UI */}
        {selectedCustomer && (
          <div className="mt-3 space-y-3">
            {/* EXISTING ADDRESSES */}
            {addresses.length > 0 && !showNewAddress && (
              <>
                <label className="text-xs font-semibold text-gray-600">
                  Select Delivery Address
                </label>

                <select
                  value={selectedAddress || ""}
                  onChange={(e) => setSelectedAddress(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
                >
                  {addresses.map((addr) => (
                    <option key={addr.id} value={addr.id}>
                      {addr.address_line}, {addr.city}, {addr.state} -{" "}
                      {addr.pincode}
                    </option>
                  ))}
                </select>

                <div className="flex gap-4 text-xs">
                  <button
                    onClick={() => setShowNewAddress(true)}
                    className="text-blue-600 underline"
                  >
                    + Add New
                  </button>

                  <button
                    onClick={() => {
                      setSelectedAddress(null);
                      setAddresses([]);
                      setShowNewAddress(true);
                    }}
                    className="text-gray-500 underline"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}

            {/* NEW ADDRESS FORM */}
            {showNewAddress && (
              <div className="p-3 border rounded-lg bg-gray-50 space-y-3">
                <input
                  placeholder="Address Line"
                  value={newAddress.address_line}
                  onChange={(e) =>
                    setNewAddress({
                      ...newAddress,
                      address_line: e.target.value,
                    })
                  }
                  className="w-full border rounded px-3 py-2 text-sm"
                />

                <div className="grid grid-cols-2 gap-2">
                  <input
                    placeholder="City"
                    value={newAddress.city}
                    onChange={(e) =>
                      setNewAddress({
                        ...newAddress,
                        city: e.target.value,
                      })
                    }
                    className="border rounded px-3 py-2 text-sm"
                  />

                  <input
                    placeholder="State"
                    value={newAddress.state}
                    onChange={(e) =>
                      setNewAddress({
                        ...newAddress,
                        state: e.target.value,
                      })
                    }
                    className="border rounded px-3 py-2 text-sm"
                  />
                </div>

                <input
                  placeholder="Pincode"
                  maxLength={6}
                  value={newAddress.pincode}
                  onChange={(e) =>
                    setNewAddress({
                      ...newAddress,
                      pincode: e.target.value.replace(/\D/g, ""),
                    })
                  }
                  className="w-full border rounded px-3 py-2 text-sm"
                />

                {/* ACTION BUTTONS */}
                <div className="flex justify-end gap-3 text-xs">
                  {addresses.length > 0 && (
                    <button
                      onClick={() => setShowNewAddress(false)}
                      className="text-gray-500 underline"
                    >
                      Cancel
                    </button>
                  )}

                  <button
                    onClick={() => {
                      // Save locally to state only
                      const tempId = Date.now();

                      const newAddrObj = {
                        id: tempId,
                        ...newAddress,
                      };

                      setAddresses([...addresses, newAddrObj]);
                      setSelectedAddress(tempId);
                      setShowNewAddress(false);

                      setNewAddress({
                        address_line: "",
                        city: "",
                        state: "",
                        pincode: "",
                      });
                    }}
                    className="text-green-600 underline font-semibold"
                  >
                    Save Address
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ITEMS */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {cart.map((item, i) => (
          <div
            key={i}
            className="border rounded-xl p-3 flex justify-between items-center"
          >
            <div>
              <p className="font-medium text-sm">{item.product_name}</p>
              <p className="text-xs text-gray-500">{item.variation_name}</p>
              <p className="text-sm mt-1 font-semibold">₹ {item.price}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => decreaseQty(i)}
                className="h-8 w-8 border rounded-lg"
              >
                −
              </button>
              <span>{item.qty}</span>
              <button
                onClick={() => increaseQty(i)}
                className="h-8 w-8 border rounded-lg"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* SUMMARY */}
      <div className="border-t p-4 space-y-3 text-sm">
        <Row label="Subtotal" value={`₹ ${subtotal.toFixed(2)}`} />

        <div className="flex justify-between items-center">
          <span>Discount</span>
          <input
            type="number"
            min={0}
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
            className="w-24 border rounded px-2 py-1 text-right"
          />
        </div>

        <Row label="GST" value={`₹ ${gst.toFixed(2)}`} />
        <Row label="Total" value={`₹ ${total.toFixed(2)}`} />
      </div>

      {/* PAYMENT */}
      <div className="p-4 border-t">
        <button
          disabled={
            cart.length === 0 || !customer.name || !isValidPhone(customer.phone)
          }
          onClick={handleSubmit}
          className="w-full bg-green-700 text-white py-4 rounded-2xl disabled:opacity-40"
        >
          Proceed to Pay ₹ {total.toFixed(2)}
        </button>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
