//@ts-nocheck
import React, { useEffect, useState } from "react";
import { useData } from "@/context/DataContext";
import { Plus, Edit, Trash2, ExternalLink, Youtube, Search, MoreVertical, Check } from "lucide-react";
import { useQueryParams, useGetCall, useActionCall } from "@/hooks";
import { MODAL_OPEN } from "@/constants/others";
import YoutubeFormModal from "@/components/FormModals/YoutubeModal/YoutubeFormModal";
import VideoModal from "@/components/VideoModal";
import { SERVICE } from "@/constants/services";
import Swal from "sweetalert2";

export default function YoutubeChannels() {
  const { extractFilterOnQuery, updateSearchParam, searchParams } =
    useQueryParams();
  const { data: youtubeChannelsData, loading: youtubeChannelsLoading } =
    useGetCall(SERVICE.YOUTUBECHANNELS);
  const Modal = searchParams.get("Modal") || undefined;

  const [filter, setFilter] = useState({
    filter: extractFilterOnQuery([]),
    pageNo: 1,
    pageSize: 10,
    sortDir: "",
    sortBy: "",
    search: "",
  });
  const [showActionMenu, setShowActionMenu] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { loading, setQuery, data } = useGetCall(SERVICE.YOUTUBECHANNELS, {
    avoidFetch: true,
  });
  const { loading: deleteLoading, Delete: DeleteYoutubeChannel } =
    useActionCall(SERVICE.YOUTUBECHANNELS);

  const YoutubeChannelAPI = () => {
    setQuery(filter);
  };

  useEffect(() => {
    YoutubeChannelAPI();
  }, [filter]);

  const ConfirmDeleteModal = async (value: string) => {
    const swalWithTailwind = Swal.mixin({
      customClass: {
        confirmButton:
          "bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-md shadow-sm transition-all duration-200 ml-3",
        cancelButton:
          "bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium px-4 py-2 rounded-md shadow-sm transition-all duration-200",
        popup:
          "rounded-xl shadow-2xl border border-gray-200 bg-white p-6 dark:bg-gray-800 dark:border-gray-700",
        title: "text-lg font-semibold text-gray-800 dark:text-gray-100",
        htmlContainer: "text-gray-600 dark:text-gray-300",
      },
      buttonsStyling: false,
    });

    swalWithTailwind
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
        padding: "2em",
        backdrop: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          const resp = await DeleteYoutubeChannel(value);
          if (resp) {
            YoutubeChannelAPI();
            Swal.fire({
              icon: "success",
              title: "Deleted!",
              text: "Your record has been deleted successfully.",
              confirmButtonText: "OK",
              customClass: {
                confirmButton:
                  "bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md transition-all duration-200",
              },
            });
          }
        }
      });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilter({
      ...filter,
      search: searchQuery
    });
  };

  return (
    <div className="w-full pb-24 px-4 bg-gray-50 min-h-screen">
      {/* Header Section - Native App Style */}
      <div className="py-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900">
            YouTube Channels
          </h1>
          <button
            onClick={() =>
              updateSearchParam({
                options: { Modal: MODAL_OPEN.YOUTUBE_MODAL },
              })
            }
            className="inline-flex items-center px-4 py-2 rounded-full shadow-md text-sm font-medium text-white bg-gradient-to-r from-red-600 to-pink-600 active:scale-95 transition-transform"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Channel
          </button>
        </div>
        <p className="text-gray-600">
          Manage YouTube channels for user reference
        </p>
      </div>

      {/* Search Bar - Native App Style */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
        <form onSubmit={handleSearch} className="flex items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search channels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="ml-3 px-4 py-2 bg-red-600 text-white rounded-full text-sm font-medium active:scale-95 transition-transform"
          >
            Search
          </button>
        </form>
      </div>

      {/* Channels List - Mobile Native Style */}
      <div className="space-y-4">
        {youtubeChannelsLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          </div>
        ) : youtubeChannelsData?.data?.length > 0 ? (
          youtubeChannelsData.data.map((channel) => (
            <div
              key={channel.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden active:scale-[0.98] transition-transform"
            >
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-14 h-14 bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl flex items-center justify-center mr-4">
                      <Youtube className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {channel.name}
                      </h3>
                      <div className="flex items-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                          <Youtube className="w-3 h-3 mr-1" />
                          YouTube
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setShowActionMenu(showActionMenu === channel.id ? null : channel.id)}
                      className="p-2 rounded-full hover:bg-gray-100 active:scale-95 transition-transform"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-500" />
                    </button>

                    {/* Action Menu */}
                    {showActionMenu === channel.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-10 overflow-hidden">
                        <button
                          onClick={() => {
                            window.open(channel.url, "_blank");
                            setShowActionMenu(null);
                          }}
                          className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                        >
                          <ExternalLink className="w-4 h-4 mr-3 text-gray-400" />
                          Open Channel
                        </button>
                        <button
                          onClick={() => {
                            updateSearchParam({
                              options: {
                                Modal: MODAL_OPEN.YOUTUBE_MODAL,
                                Edit: channel.id,
                              },
                            });
                            setShowActionMenu(null);
                          }}
                          className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                        >
                          <Edit className="w-4 h-4 mr-3 text-gray-400" />
                          Edit Channel
                        </button>
                        <button
                          onClick={() => {
                            ConfirmDeleteModal(channel.id);
                            setShowActionMenu(null);
                          }}
                          className="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 active:bg-red-100"
                        >
                          <Trash2 className="w-4 h-4 mr-3" />
                          Delete Channel
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {channel.description}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <a
                    href={channel.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center active:scale-95 transition-transform"
                  >
                    Visit Channel
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                  <button
                    onClick={() => window.open(channel.url, "_blank")}
                    className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center active:scale-95 transition-transform"
                  >
                    <Youtube className="w-5 h-5 text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Youtube className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No YouTube channels
            </h3>
            <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto">
              Get started by adding your first YouTube channel.
            </p>
            <button
              onClick={() =>
                updateSearchParam({
                  options: { Modal: MODAL_OPEN.YOUTUBE_MODAL },
                })
              }
              className="inline-flex items-center px-6 py-3 rounded-full shadow-md text-sm font-medium text-white bg-gradient-to-r from-red-600 to-pink-600 active:scale-95 transition-transform"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Channel
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      {Modal == MODAL_OPEN.YOUTUBE_MODAL && (
        <YoutubeFormModal recoilApi={YoutubeChannelAPI} />
      )}
    </div>
  );
}