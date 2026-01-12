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
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              YouTube Channels
            </h1>
            <p className="mt-2 text-gray-600">
              Manage YouTube channels for user reference
            </p>
          </div>
        </div>
      </div>

      {/* Channel Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
            <Youtube className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Training Content</h3>
          <p className="text-gray-600 text-sm">
            Comprehensive training videos to help you master promotional strategies
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <Users className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Success Stories</h3>
          <p className="text-gray-600 text-sm">
            Real testimonials and success stories from our community members
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <Play className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Sessions</h3>
          <p className="text-gray-600 text-sm">
            Interactive live sessions with experts and community leaders
          </p>
        </div>
      </div>

      {/* Channels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {youtubeChannelsData?.data.map((channel) => (
          <div
            key={channel.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div key={channel.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {/* Channel Thumbnail */}
              <div className="aspect-video bg-gradient-to-br from-red-500 to-pink-500 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Youtube className="w-16 h-16 text-white opacity-80" />
                </div>
                <div className="absolute top-4 right-4">
                  <span className={`text-white px-2 py-1 rounded text-xs font-medium ${channel.is_active == 1 ? "bg-green-600" : "bg-red-600"}`}>
                    {channel.is_active == 1 ? "Live" : "Offline"}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{channel.channel_name}</h3>
                    <p className="text-gray-600 text-sm line-clamp-3">{channel.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-end pt-4 border-t border-gray-200">                  
                  <div className="flex items-center space-x-2">
                    <a
                      href={channel.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1 border border-red-300 rounded text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Visit
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {youtubeChannelsData?.data.length === 0 && (
        <div className="text-center py-12">
          <Youtube className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No YouTube channels
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by adding your first YouTube channel.
          </p>
        </div>
      )}
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