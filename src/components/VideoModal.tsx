import React, { useState, useEffect } from "react";
import { X, Upload, Youtube, Calendar } from "lucide-react";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (videoData: any) => void;
  video?: any;
  type: "daily" | "training" | "promotion" | "youtube";
}

export default function VideoModal({
  isOpen,
  onClose,
  onSave,
  video,
  type,
}: VideoModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    videoUrl: "",
    youtubeLink: "",
    showingDate: "",
    day: 1,
    session: "12am-12pm",
  });

  useEffect(() => {
    if (video) {
      setFormData({
        title: video.title || "",
        description: video.description || "",
        videoUrl: video.videoUrl || "",
        youtubeLink: video.youtubeLink || "",
        showingDate: video.showingDate || "",
        day: video.day || 1,
        session: video.session || "12am-12pm",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        videoUrl: "",
        youtubeLink: "",
        showingDate: new Date().toISOString().split("T")[0],
        day: 1,
        session: "12am-12pm",
      });
    }
  }, [video, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {video ? "Edit" : "Add"}{" "}
                {type.charAt(0).toUpperCase() + type.slice(1)} Video
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter video title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter video description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video Source
                </label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg">
                    <Upload className="w-5 h-5 text-gray-400" />
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Direct Upload
                      </label>
                      <input
                        type="file"
                        accept="video/*"
                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                    </div>
                  </div>

                  <div className="text-center text-gray-500">OR</div>

                  <div className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg">
                    <Youtube className="w-5 h-5 text-red-500" />
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700">
                        YouTube Link
                      </label>
                      <input
                        type="url"
                        value={formData.youtubeLink}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            youtubeLink: e.target.value,
                          }))
                        }
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://youtube.com/watch?v=..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Showing Date *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={formData.showingDate}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        showingDate: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <Calendar className="absolute right-3 top-2.5 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {type === "training" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Training Day *
                  </label>
                  <select
                    value={formData.day}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        day: parseInt(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                      <option key={day} value={day}>
                        Day {day}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {type === "promotion" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session *
                  </label>
                  <select
                    value={formData.session}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        session: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="12am-12pm">12 AM - 12 PM</option>
                    <option value="12pm-12am">12 PM - 12 AM</option>
                  </select>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-600 to-yellow-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {video ? "Update" : "Create"} Video
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
