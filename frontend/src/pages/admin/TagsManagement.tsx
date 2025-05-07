import { useState, useEffect } from "react";
import DataTable from "../../components/admin/DataTable";
import Button from "../../components/static/Button";
import { Tag } from "../../types";
import axiosInstance from "../../utils/axios";
import { Edit, Trash2, Eye } from "lucide-react";

const TagsManagement = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    icon_path: "",
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const fetchTags = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/tags");
      setTags(response.data.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch tags");
      console.error("Error fetching tags:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleViewDetails = async (tag: Tag) => {
    try {
      const response = await axiosInstance.get(`/tags/${tag.id}`);
      setSelectedTag(response.data.data);
      setIsDetailModalOpen(true);
    } catch (err) {
      setError("Failed to fetch tag details");
      console.error("Error fetching tag details:", err);
    }
  };

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag);
    setFormData({
      name: tag.name,
      icon_path: tag.icon_path || "",
    });
    setPreviewUrl(tag.icon_path || "");
    setIsModalOpen(true);
  };

  const handleDelete = async (tag: Tag) => {
    if (window.confirm("Are you sure you want to delete this tag?")) {
      try {
        await axiosInstance.delete(`/tags/${tag.id}`);
        await fetchTags();
      } catch (err) {
        setError("Failed to delete tag");
        console.error("Error deleting tag:", err);
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      if (selectedImage) {
        formDataToSend.append("icon", selectedImage);
      } else if (formData.icon_path) {
        formDataToSend.append("icon_path", formData.icon_path);
      }

      if (editingTag) {
        await axiosInstance.put(`/tags/${editingTag.id}`, formDataToSend);
      } else {
        await axiosInstance.post("/tags", formDataToSend);
      }
      setIsModalOpen(false);
      setEditingTag(null);
      setFormData({ name: "", icon_path: "" });
      setSelectedImage(null);
      setPreviewUrl("");
      await fetchTags();
    } catch (err) {
      setError("Failed to save tag");
      console.error("Error saving tag:", err);
    }
  };

  const columns = [
    {
      header: "Name",
      accessor: (tag: Tag) => tag.name,
    },
    {
      header: "Icon",
      accessor: (tag: Tag) => (
        <img
          src={tag.icon_path}
          alt={tag.name}
          className="w-8 h-8 object-contain"
        />
      ),
    },
    {
      header: "Actions",
      accessor: (tag: Tag) => (
        <div className="flex items-center justify-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetails(tag);
            }}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            title="View Details"
          >
            <Eye size={16} className="text-gray-500" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(tag);
            }}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            title="Edit Tag"
          >
            <Edit size={16} className="text-blue-500" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(tag);
            }}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            title="Delete Tag"
          >
            <Trash2 size={16} className="text-red-500" />
          </button>
        </div>
      ),
      className: "w-24 text-center", // Set a fixed width for the column
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tags Management</h1>
        <Button
          onClick={() => {
            setEditingTag(null);
            setFormData({ name: "", icon_path: "" });
            setSelectedImage(null);
            setPreviewUrl("");
            setIsModalOpen(true);
          }}
        >
          Add New Tag
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-4">
          {error}
        </div>
      )}

      <DataTable columns={columns} data={tags} isLoading={loading} />

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">
              {editingTag ? "Edit Tag" : "Add New Tag"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Icon
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full p-2 border rounded-md"
                />
                {previewUrl && (
                  <div className="mt-2">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-16 h-16 object-contain"
                    />
                  </div>
                )}
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedImage(null);
                    setPreviewUrl("");
                  }}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingTag ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {isDetailModalOpen && selectedTag && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Tag Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <p className="mt-1">{selectedTag.name}</p>
              </div>
              {selectedTag.icon_path && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Icon
                  </label>
                  <img
                    src={selectedTag.icon_path}
                    alt={selectedTag.name}
                    className="mt-1 w-16 h-16 object-contain"
                  />
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <Button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                variant="outline"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TagsManagement;
