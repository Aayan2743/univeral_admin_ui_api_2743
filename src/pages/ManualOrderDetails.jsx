import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function ManualOrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin-dashboard/calling/order/${id}`);

      if (res.data.success) {
        setOrder(res.data.data);
      }
    } catch (err) {
      alert("Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!order) return <p className="p-6">No Order Found</p>;

  const customer = order.shipping_address_snapshot;

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

  return (
    <div className="p-6 space-y-6">
      {/* 🔙 Header */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          ← Back
        </button>

        <div className="text-right">
          <h2 className="text-2xl font-bold">{order.invoice_number}</h2>
          {getStatusBadge(order.status)}
        </div>
      </div>

      {/* 🧍 Customer Card */}
      <div className="bg-white shadow rounded p-6">
        <h3 className="text-lg font-semibold mb-4">Customer Details</h3>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Name</p>
            <p className="font-medium">{customer?.name}</p>
          </div>

          <div>
            <p className="text-gray-500">Phone</p>
            <p className="font-medium">{customer?.phone}</p>
          </div>

          <div className="col-span-2">
            <p className="text-gray-500">Address</p>
            <p className="font-medium">
              {customer?.address}, {customer?.city}, {customer?.state} -{" "}
              {customer?.pincode}
            </p>
          </div>
        </div>
      </div>

      {/* 🛍 Products */}
      <div className="bg-white shadow rounded overflow-hidden">
        <h3 className="text-lg font-semibold p-6">Order Items</h3>

        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Product</th>
              <th className="p-3">Variant</th>
              <th className="p-3">Price</th>
              <th className="p-3">Qty</th>
              <th className="p-3">Discount</th>
              <th className="p-3">Total</th>
            </tr>
          </thead>

          <tbody>
            {order.items.map((item) => (
              <tr key={item.id} className="border-t hover:bg-gray-50">
                <td className="p-3 flex items-center gap-3">
                  <img
                    src={item.product_image}
                    alt=""
                    className="w-12 h-12 rounded object-cover"
                  />
                  <span>{item.product_name}</span>
                </td>
                <td className="p-3">{item.variant_name}</td>
                <td className="p-3">₹ {item.price}</td>
                <td className="p-3">{item.quantity}</td>
                <td className="p-3">₹ {item.discount}</td>
                <td className="p-3 font-semibold">₹ {item.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 💰 Summary Card */}
      <div className="bg-white shadow rounded p-6 max-w-md ml-auto">
        <h3 className="text-lg font-semibold mb-4">Payment Summary</h3>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹ {order.subtotal}</span>
          </div>

          <div className="flex justify-between">
            <span>Discount</span>
            <span>₹ {order.discount_total}</span>
          </div>

          <div className="flex justify-between">
            <span>Tax</span>
            <span>₹ {order.tax_total}</span>
          </div>

          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Grand Total</span>
            <span>₹ {order.grand_total}</span>
          </div>

          <div className="flex justify-between">
            <span>Paid</span>
            <span>₹ {order.paid_amount}</span>
          </div>

          <div className="flex justify-between">
            <span>Change</span>
            <span>₹ {order.change_amount}</span>
          </div>
        </div>
      </div>

      {/* 🖨 Print Button */}
      <div className="text-right">
        <button
          onClick={() => window.print()}
          className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800"
        >
          Print Invoice
        </button>
      </div>
    </div>
  );
}
