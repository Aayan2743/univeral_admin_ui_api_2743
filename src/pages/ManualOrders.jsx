// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../api/axios";

// export default function ManualOrders() {
//   const navigate = useNavigate();
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [showCourierModal, setShowCourierModal] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState(null);

//   const [dimensions, setDimensions] = useState({
//     length: "",
//     breadth: "",
//     height: "",
//     weight: "",
//   });

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       const res = await api.get("/admin-dashboard/calling/orders");

//       if (res.data.success) {
//         setOrders(res.data.data);
//       }
//     } catch (err) {
//       console.log(err.response?.data);
//       alert("Failed to fetch orders");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const submitCourier = async () => {
//     try {
//       const res = await api.post(
//         `/send-courier/${selectedOrder.id}`,
//         dimensions,
//       );

//       if (res.data.success) {
//         alert("Order sent to courier successfully");
//         setShowCourierModal(false);
//         fetchOrders();
//       }
//     } catch (err) {
//       alert(err.response?.data?.message || "Failed to send courier");
//     }
//   };

//   const handleAction = async (action, order) => {
//     if (!action) return;

//     if (action === "cancel") {
//       if (!window.confirm("Are you sure to cancel this order?")) return;

//       try {
//         const res = await api.post(
//           `/admin-dashboard/calling/order/${order.id}/cancel`,
//         );

//         if (res.data.success) {
//           alert("Order cancelled successfully");
//           fetchOrders();
//         }
//       } catch (err) {
//         alert("Cancel failed");
//       }
//     }

//     // if (action === "courier") {
//     //   try {
//     //     const res = await api.post(
//     //       `/admin-dashboard/calling/order/${order.id}/send-to-courier`,
//     //     );

//     //     if (res.data.success) {
//     //       alert("Order sent to courier");
//     //       fetchOrders();
//     //     }
//     //   } catch (err) {
//     //     alert("Failed to send to courier");
//     //   }
//     // }

//     if (action === "courier") {
//       setSelectedOrder(order);
//       setShowCourierModal(true);
//     }
//   };

//   if (loading) return <p>Loading...</p>;

//   const overlayStyle = {
//     position: "fixed",
//     top: 0,
//     left: 0,
//     width: "100%",
//     height: "100%",
//     backgroundColor: "rgba(0,0,0,0.5)",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     zIndex: 9999,
//   };

//   const modalStyle = {
//     background: "#fff",
//     padding: "20px",
//     borderRadius: "8px",
//     width: "300px",
//     display: "flex",
//     flexDirection: "column",
//     gap: "10px",
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>Manual Orders</h2>

//       <table border="1" cellPadding="10" width="100%">
//         <thead>
//           <tr>
//             <th>#</th>
//             <th>Invoice</th>
//             <th>Customer</th>
//             <th>Phone</th>
//             <th>Total</th>
//             <th>Status</th>
//             <th>Date</th>
//             <th>Action</th>
//           </tr>
//         </thead>

//         <tbody>
//           {orders.map((order, index) => {
//             const customerName =
//               order.customer?.name || order.customer_name || "N/A";

//             const customerPhone =
//               order.customer?.phone || order.customer_phone || "N/A";

//             return (
//               <tr key={order.id}>
//                 <td>{index + 1}</td>
//                 <td>{order.invoice_number}</td>
//                 <td>{customerName}</td>
//                 <td>{customerPhone}</td>
//                 <td>₹ {order.grand_total}</td>
//                 <td>
//                   <span
//                     style={{
//                       color: order.status === "completed" ? "green" : "orange",
//                       fontWeight: "bold",
//                     }}
//                   >
//                     {order.status}
//                   </span>
//                 </td>
//                 <td>{new Date(order.created_at).toLocaleString()}</td>
//                 <td>
//                   <button
//                     onClick={() => navigate(`/calling/order/${order.id}`)}
//                     style={{ marginRight: "5px" }}
//                   >
//                     View
//                   </button>

//                   <select
//                     defaultValue=""
//                     onChange={(e) => handleAction(e.target.value, order)}
//                   >
//                     <option value="" disabled>
//                       Actions
//                     </option>

//                     {order.status !== "cancelled" && (
//                       <option value="cancel">Cancel Order</option>
//                     )}

//                     {order.status === "created" && (
//                       <option value="courier">Send to Courier</option>
//                     )}
//                   </select>
//                 </td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>

//       {showCourierModal && (
//         <div style={overlayStyle}>
//           <div style={modalStyle}>
//             <h3>Enter Package Details</h3>

//             <input
//               type="number"
//               placeholder="Length (cm)"
//               value={dimensions.length}
//               onChange={(e) =>
//                 setDimensions({ ...dimensions, length: e.target.value })
//               }
//             />

//             <input
//               type="number"
//               placeholder="Breadth (cm)"
//               value={dimensions.breadth}
//               onChange={(e) =>
//                 setDimensions({ ...dimensions, breadth: e.target.value })
//               }
//             />

//             <input
//               type="number"
//               placeholder="Height (cm)"
//               value={dimensions.height}
//               onChange={(e) =>
//                 setDimensions({ ...dimensions, height: e.target.value })
//               }
//             />

//             <input
//               type="number"
//               placeholder="Weight (kg)"
//               value={dimensions.weight}
//               onChange={(e) =>
//                 setDimensions({ ...dimensions, weight: e.target.value })
//               }
//             />

//             <div style={{ marginTop: "10px" }}>
//               <button onClick={submitCourier}>Submit</button>
//               <button
//                 onClick={() => setShowCourierModal(false)}
//                 style={{ marginLeft: "10px" }}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function ManualOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const [showCourierModal, setShowCourierModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [dimensions, setDimensions] = useState({
    length: "",
    breadth: "",
    height: "",
    weight: "",
  });

  useEffect(() => {
    fetchOrders();
  }, [page, search]);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const res = await api.get(
        `/admin-dashboard/calling/orders?page=${page}&search=${search}`,
      );

      if (res.data.success) {
        setOrders(res.data.data.data);
        setLastPage(res.data.data.last_page);
      }
    } catch (err) {
      alert("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      completed: "bg-green-100 text-green-600",
      cancelled: "bg-red-100 text-red-600",
      created: "bg-yellow-100 text-yellow-600",
      shipped: "bg-blue-100 text-blue-600",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${
          styles[status] || "bg-gray-100 text-gray-600"
        }`}
      >
        {status}
      </span>
    );
  };

  const handleAction = (action, order) => {
    if (action === "courier") {
      setSelectedOrder(order);
      setShowCourierModal(true);
    }
  };

  const submitCourier = async () => {
    try {
      const res = await api.post(
        `/admin-dashboard/send-courier/${selectedOrder.id}`,
        dimensions,
      );

      if (res.data.success) {
        alert("Sent to courier");
        setShowCourierModal(false);
        fetchOrders();
      }
    } catch {
      alert("Courier failed");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manual Orders</h2>

      {/* 🔍 Search */}
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search invoice, name, phone..."
          className="border p-2 rounded w-1/3"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />
      </div>

      {/* 📋 Table */}
      <div className="bg-white shadow rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Invoice</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Total</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium">{order.invoice_number}</td>
                <td className="p-3">
                  {order.customer?.name || order.customer_name}
                </td>
                <td className="p-3">
                  {order.customer?.phone || order.customer_phone}
                </td>
                <td className="p-3 font-semibold">₹ {order.grand_total}</td>
                <td className="p-3">{getStatusBadge(order.status)}</td>
                <td className="p-3">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => navigate(`/calling/order/${order.id}`)}
                    className="px-3 py-1 bg-gray-200 rounded"
                  >
                    View
                  </button>

                  {order.status === "created" && (
                    <button
                      onClick={() => handleAction("courier", order)}
                      className="px-3 py-1 bg-blue-500 text-white rounded"
                    >
                      Courier
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 📄 Pagination */}
      <div className="flex justify-center gap-2 mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 border rounded"
        >
          Prev
        </button>

        <span className="px-4 py-1">
          {page} / {lastPage}
        </span>

        <button
          disabled={page === lastPage}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 border rounded"
        >
          Next
        </button>
      </div>

      {/* 🚚 Courier Modal */}
      {showCourierModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow w-96">
            <h3 className="text-lg font-semibold mb-4">Package Dimensions</h3>

            {["length", "breadth", "height", "weight"].map((field) => (
              <input
                key={field}
                type="number"
                placeholder={field}
                className="border p-2 rounded w-full mb-3"
                value={dimensions[field]}
                onChange={(e) =>
                  setDimensions({
                    ...dimensions,
                    [field]: e.target.value,
                  })
                }
              />
            ))}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowCourierModal(false)}
                className="px-3 py-1 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={submitCourier}
                className="px-3 py-1 bg-blue-600 text-white rounded"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
