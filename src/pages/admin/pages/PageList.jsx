import { useEffect, useState } from "react";
import api from "../../../api/axios";
import Pagination from "../../components/Pagination";
import SettingsLayout from "../../settings/SettingsLayout";
import RichTextEditorNew from "../../components/RichTextEditorNew";

const PageList = () => {

  const [pages, setPages] = useState([]);
  const [sections, setSections] = useState([]);
  const [pagination, setPagination] = useState({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingPage, setEditingPage] = useState(null);

  const [formData, setFormData] = useState({
    section_id: "",
    title: "",
    content: "",
    status: 1,
    meta_title: "",
    meta_description: "",
    meta_keywords: ""
  });

  /* ================= FETCH PAGES ================= */

  const fetchPages = (page = 1) => {
    api.get(`/admin-dashboard/get-pages?page=${page}`)
      .then(res => {
        setPages(res.data.data.data);
        setPagination(res.data.data);
      });
  };

  /* ================= FETCH SECTIONS ================= */

  const fetchSections = () => {
    api.get(`/admin-dashboard/get-footer-sections`)
      .then(res => {
        setSections(res.data.data || res.data);
      });
  };

  useEffect(() => {
    fetchPages();
    fetchSections();
  }, []);

  /* ================= DELETE ================= */

  const deletePage = (id) => {
    if (!window.confirm("Delete this page?")) return;

    api.delete(`/admin-dashboard/delete-pages/${id}`)
      .then(() => fetchPages());
  };

  /* ================= OPEN DRAWER ================= */

  const openDrawer = (page = null) => {

    if (page) {
      setEditingPage(page);
      setFormData({
        section_id: page.section_id,
        title: page.title,
        content: page.content,
        status: page.status,
      
      });
    } else {
      setEditingPage(null);
      setFormData({
        section_id: "",
        title: "",
        content: "",
        status: 1,
     
      });
    }

    setDrawerOpen(true);
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingPage) {
      api.put(`/admin-dashboard/update-pages/${editingPage.id}`, formData)
        .then(() => {
          fetchPages();
          setDrawerOpen(false);
        });
    } else {
      api.post(`/admin-dashboard/add-pages`, formData)
        .then(() => {
          fetchPages();
          setDrawerOpen(false);
        });
    }
  };

  return (
    <SettingsLayout>

      <div className="p-6">

        <div className="flex justify-between mb-5">
          <h2 className="text-2xl font-bold">Pages</h2>

          <button
            onClick={() => openDrawer()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Add Page
          </button>
        </div>

        {/* Table */}
        <div className="bg-white shadow rounded overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">Title</th>
                <th>Section</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {pages.map(page => (
                <tr key={page.id} className="border-t">
                  <td className="p-3">{page.title}</td>
                  <td>{page.section?.name}</td>
                  <td>
                    {page.status ? (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm">
                        Active
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-sm">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="space-x-3">
                    <button
                      onClick={() => openDrawer(page)}
                      className="text-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deletePage(page.id)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Pagination pagination={pagination} onPageChange={fetchPages} />
        </div>

      </div>

      {/* ================= RIGHT DRAWER ================= */}

      <div
        className={`fixed top-0 right-0 h-full w-[520px] bg-white shadow-xl transform transition-transform duration-300 z-50 ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-xl font-semibold">
            {editingPage ? "Edit Page" : "Add Page"}
          </h3>
          <button onClick={() => setDrawerOpen(false)}>✕</button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-5 overflow-y-auto h-[calc(100%-80px)]"
        >

          {/* Section Dropdown */}
          <div>
            <label className="block mb-1 font-medium">
              Section <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.section_id}
              onChange={(e) =>
                setFormData({ ...formData, section_id: e.target.value })
              }
              className="w-full border px-3 py-2 rounded-lg"
              required
            >
              <option value="">Select Section</option>
              {sections.map(sec => (
                <option key={sec.id} value={sec.id}>
                  {sec.name}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block mb-1 font-medium">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full border px-3 py-2 rounded-lg"
              required
            />
          </div>

          {/* Content */}
          <div>
            <label className="block mb-1 font-medium">
              Content <span className="text-red-500">*</span>
            </label>
            {/* <textarea
              rows={5}
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              className="w-full border px-3 py-2 rounded-lg"
              required
            /> */}

                       <RichTextEditorNew
              value={formData.content}
              onChange={(html) =>
                setFormData({ ...formData, content: html })
              }
            />
          </div>

          {/* Status */}
          <div>
            <label className="block mb-1 font-medium">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="w-full border px-3 py-2 rounded-lg"
            >
              <option value={1}>Active</option>
              <option value={0}>Inactive</option>
            </select>
          </div>

      
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="px-4 py-2 border rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white rounded-lg"
            >
              {editingPage ? "Update Page" : "Save Page"}
            </button>
          </div>

        </form>
      </div>

    </SettingsLayout>
  );
};

export default PageList;