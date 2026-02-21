import { useState, useEffect } from "react";
import SettingsLayout from "../SettingsLayout";
import { Eye, EyeOff } from "lucide-react";
import api from "../../../api/axios";
import toast from "react-hot-toast";

export default function WhatsAppIntegrationSettings() {
  const [editMode, setEditMode] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get("/admin-dashboard/whatsapp-settings");

      if (res.data?.success) {
        setEnabled(res.data.data.enabled);
        setApiKey(res.data.data.api_key || "");
        setBaseUrl(res.data.data.base_url || "");
      }
    } catch (err) {
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const res = await api.post("/admin-dashboard/whatsapp-settings", {
        enabled,
        api_key: apiKey,
        base_url: baseUrl,
      });

      if (res.data?.success) {
        toast.success("Settings updated successfully");
        setEditMode(false);
        fetchSettings();
      }
    } catch (err) {
      const message =
        err.response?.data?.errors ||
        err.response?.data?.message ||
        "Update failed";

      toast.error(message);
    }
  };

  if (loading) {
    return (
      <SettingsLayout>
        <div className="p-6 text-sm text-gray-500">Loading...</div>
      </SettingsLayout>
    );
  }

  return (
    <SettingsLayout>
      <div className="bg-white rounded-xl border p-6 space-y-6">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">WhatsApp Integration</h2>

          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="text-sm px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="text-sm px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* ENABLE TOGGLE */}
        <div className="flex items-center justify-between md:w-1/2">
          <div>
            <p className="text-sm font-medium">Enable WhatsApp</p>
            <p className="text-xs text-gray-500">
              Turn WhatsApp integration on or off
            </p>
          </div>

          {editMode ? (
            <button
              onClick={() => setEnabled(!enabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                enabled ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  enabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          ) : (
            <span
              className={`text-sm font-medium ${
                enabled ? "text-green-600" : "text-red-500"
              }`}
            >
              {enabled ? "Enabled" : "Disabled"}
            </span>
          )}
        </div>

        {/* API KEY */}
        <div className="space-y-2">
          <p className="text-sm font-medium">API Key</p>

          {editMode ? (
            <div className="relative md:w-1/2">
              <input
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter API Key"
                className="w-full border rounded-lg px-3 py-2 text-sm pr-10"
              />

              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-2.5 text-gray-500"
              >
                {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          ) : (
            <p className="text-sm text-gray-600">
              {apiKey ? "••••••••••••••" : "Not configured"}
            </p>
          )}
        </div>

        {/* BASE URL */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Base URL</p>

          {editMode ? (
            <input
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="https://api.example.com"
              className="md:w-1/2 border rounded-lg px-3 py-2 text-sm"
            />
          ) : (
            <p className="text-sm text-gray-600">
              {baseUrl || "Not configured"}
            </p>
          )}
        </div>
      </div>
    </SettingsLayout>
  );
}
