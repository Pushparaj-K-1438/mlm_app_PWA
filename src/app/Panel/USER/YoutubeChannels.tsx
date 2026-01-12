//@ts-nocheck
import React, { useEffect, useState } from "react";
import { useData } from "@/context/DataContext";
import { Plus, Edit, Trash2, ExternalLink, Youtube, Users, Video, Play } from "lucide-react";
import { useQueryParams, useGetCall, useActionCall } from "@/hooks";
import { MODAL_OPEN } from "@/constants/others";
import YoutubeFormModal from "@/components/FormModals/YoutubeModal/YoutubeFormModal";
import VideoModal from "@/components/VideoModal";
import { SERVICE } from "@/constants/services";
import Swal from "sweetalert2";
import DailyVideoWarning from "@/components/DailyVideoWarning";

const YoutubeChannelsPage = () => {
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
  const { loading, setQuery, data } = useGetCall(SERVICE.YOUTUBECHANNELS, {
    avoidFetch: true,
  });
  const YoutubeChannelAPI = () => {
    setQuery(filter);
  };
  useEffect(() => {
    YoutubeChannelAPI();
  }, [filter]);

  if (youtubeChannelsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 safe-area-inset-bottom pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Youtube className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-gray-600">Loading YouTube channels...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 safe-area-inset-bottom pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 safe-area-inset-top">
        <h1 className="text-xl font-bold text-gray-900">YouTube Channels</h1>
        <p className="text-sm text-gray-600 mt-1">Discover and explore valuable content</p>
      </div>

      {/* Channel Categories */}
      <div className="px-6 mt-6">
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl p-6 text-white">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-4">
                <Youtube className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">Training Content</h3>
                <p className="text-white/80 text-sm mt-1">
                  Comprehensive training videos to help you master promotional strategies
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 text-white">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">Success Stories</h3>
                <p className="text-white/80 text-sm mt-1">
                  Real testimonials and success stories from our community members
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl p-6 text-white">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-4">
                <Play className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">Live Sessions</h3>
                <p className="text-white/80 text-sm mt-1">
                  Interactive live sessions with experts and community leaders
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Channels List */}
      <div className="px-6 mt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Featured Channels</h2>
        
        {youtubeChannelsData?.data.length > 0 ? (
          <div className="space-y-4">
            {youtubeChannelsData?.data.map((channel) => (
              <div
                key={channel.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="flex">
                  {/* Channel Thumbnail */}
                  <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-pink-500 flex-shrink-0 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Youtube className="w-8 h-8 text-white opacity-80" />
                    </div>
                    <div className="absolute top-2 right-2">
                      <span className={`text-white px-2 py-0.5 rounded-full text-xs font-medium ${
                        channel.is_active == 1 ? "bg-green-600" : "bg-red-600"
                      }`}>
                        {channel.is_active == 1 ? "Live" : "Offline"}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-gray-900 mb-1">{channel.channel_name}</h3>
                        <p className="text-gray-600 text-sm line-clamp-2">{channel.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-end mt-3">
                      <a
                        href={channel.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Visit
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Youtube className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No YouTube channels</h3>
            <p className="text-gray-500 text-sm">
              Get started by adding your first YouTube channel.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function YoutubeChannels() {
  return (
    <DailyVideoWarning>
      <YoutubeChannelsPage />
    </DailyVideoWarning>
  );
}