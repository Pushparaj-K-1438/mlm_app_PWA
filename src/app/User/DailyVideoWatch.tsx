import React, { useState, useEffect, useRef } from "react";
import { Play, CheckCircle, Clock, Calendar, AlertCircle, Maximize2, Minimize2, X, Volume2, VolumeX, RotateCcw } from "lucide-react";
import { useActionCall, useGetCall } from "@/hooks";
import { SERVICE } from "@/constants/services";
import Loader from "@/components/ui/Loader";
import ReactPlayer from "react-player";
import UIHelpers from "@/utils/UIhelper";
import Swal from "sweetalert2";
import Lib from "@/utils/Lib";
import { getVideoPlayerConfig, videoContainerProps } from "@/utils/videoPlayerConfig";

interface DailyVideoWatchProps {
  onVideoWatched: () => void;
}

export default function DailyVideoWatch({
  onVideoWatched,
}: DailyVideoWatchProps) {
  const { data, loading, setQuery } = useGetCall(SERVICE.DAILY_VIDEO_TODAY);
  const { Post: updateDVStatus } = useActionCall(
    SERVICE.DAILY_VIDEO_STATUS_UPDATE
  );

  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isBuffering, setIsBuffering] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Auto-hide controls when playing
  useEffect(() => {
    if (playing) {
      if (controlsTimeout) clearTimeout(controlsTimeout);
      const timeout = setTimeout(() => setShowControls(false), 3000);
      setControlsTimeout(timeout);
    } else {
      setShowControls(true);
    }

    return () => {
      if (controlsTimeout) clearTimeout(controlsTimeout);
    };
  }, [playing, currentTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleProgress = (e: any) => {
    const video = e.target as HTMLVideoElement;
    if (video.duration) {
      const progress = video.currentTime / video.duration;
      setPlayed(progress);
      setCurrentTime(video.currentTime);
    }
  };

  const handleDurationChange = (e: any) => {
    const video = e.target as HTMLVideoElement;
    setDuration(video.duration);
  };

  const handleBuffer = () => {
    setIsBuffering(true);
  };

  const handleBufferEnd = () => {
    setIsBuffering(false);
  };

  // Updated to support Touch Events for mobile scrubbing
  const handleSeek = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!progressRef.current) return;

    const bounds = progressRef.current.getBoundingClientRect();

    let clientX: number;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = e.clientX;
    }

    const percent = Math.max(0, Math.min(1, (clientX - bounds.left) / bounds.width));
    const seekTime = percent * duration;

    // Access the internal player element
    const internalPlayer = playerRef.current?.getInternalPlayer();
    if (internalPlayer && "currentTime" in internalPlayer) {
      internalPlayer.currentTime = seekTime;
      setPlayed(percent);
      setCurrentTime(seekTime);
    }
  };

  const toggleFullscreen = async () => {
    if (!isFullscreen) {
      try {
        if (containerRef.current) {
          if (containerRef.current.requestFullscreen) {
            await containerRef.current.requestFullscreen();
          } else if ((containerRef.current as any).webkitRequestFullscreen) {
            await (containerRef.current as any).webkitRequestFullscreen();
          } else if ((containerRef.current as any).mozRequestFullScreen) {
            await (containerRef.current as any).mozRequestFullScreen();
          } else if ((containerRef.current as any).msRequestFullscreen) {
            await (containerRef.current as any).msRequestFullscreen();
          }
          setIsFullscreen(true);
        }
      } catch (error) {
        console.error('Error attempting to enable fullscreen:', error);
      }
    } else {
      try {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
          await (document as any).mozCancelFullScreen();
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen();
        }
        setIsFullscreen(false);
      } catch (error) {
        console.error('Error attempting to exit fullscreen:', error);
      }
    }
  };

  const toggleMute = () => {
    const internalPlayer = playerRef.current?.getInternalPlayer();
    if (internalPlayer && "muted" in internalPlayer) {
      internalPlayer.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const restartVideo = () => {
    const internalPlayer = playerRef.current?.getInternalPlayer();
    if (internalPlayer && "currentTime" in internalPlayer) {
      internalPlayer.currentTime = 0;
      setPlayed(0);
      setCurrentTime(0);
    }
  };

  const handleVideoContainerClick = () => {
    if (playing) {
      setShowControls(!showControls);
    }
  };

  if (loading) {
    return (
      <div className="w-full pb-24 px-4 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading video...</p>
        </div>
      </div>
    );
  }

  if (!data?.data?.id) {
    return (
      <div className="w-full pb-24 px-4 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center justify-center h-[60vh] px-6 text-center bg-white rounded-3xl shadow-lg p-8 max-w-sm">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <Calendar className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            No Video Available
          </h3>
          <p className="text-sm text-gray-500">
            Check back later for the daily update.
          </p>
          <button className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-full font-medium active:scale-95 transition-transform">
            Refresh
          </button>
        </div>
      </div>
    );
  }

  const handlevideoWatchCompleted = async () => {
    // if already watched not need to trigger
    if (!data?.data?.watched) {
      Swal.fire({
        icon: "success",
        title: "Video Completed!",
        text: "You've unlocked today's features!",
        confirmButtonText: "Great",
        customClass: {
          confirmButton: "bg-blue-600 text-white font-bold py-3 px-6 rounded-xl",
          popup: "rounded-2xl"
        },
      }).then((result) => {
        setQuery();
      });
      await updateDVStatus(
        {
          daily_video_id: data?.data?.id,
          watchedstatus: 1,
        },
        ""
      );
    }
    setPlaying(false);
  };

  return (
    <div className="w-full pb-24 px-4 bg-gray-50 min-h-screen">
      {/* Header Section - Native App Style */}
      <div className="py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Daily Video
        </h1>
        <div className="flex justify-between items-center bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-3 ${data?.data?.watched ? 'bg-green-100' : 'bg-yellow-100'
              }`}>
              {data?.data?.watched ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Status</p>
              <p className={`text-xs ${data?.data?.watched ? 'text-green-600' : 'text-yellow-600'
                }`}>
                {data?.data?.watched ? 'Completed' : 'Pending'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Date</p>
            <p className="text-sm font-medium text-gray-900">
              {UIHelpers.DateFormat(data?.data?.showing_date)}
            </p>
          </div>
        </div>
      </div>

      {/* Video Player Section - Native App Style */}
      <div
        className={`bg-black rounded-3xl shadow-xl overflow-hidden mb-6 relative transition-all duration-300 ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'w-full aspect-video'
          }`}
        ref={containerRef}
        onClick={handleVideoContainerClick}
      >
        <div className="absolute inset-0 bg-black" {...videoContainerProps}>
          {data?.data?.video_path || data?.data?.youtube_link ? (
            <ReactPlayer
              ref={playerRef}
              src={
                data?.data?.video_path
                  ? Lib.CloudPath(data?.data?.video_path)
                  : data?.data?.youtube_link
              }
              width="100%"
              height="100%"
              controls={false}
              playing={playing}
              onTimeUpdate={handleProgress}
              onDurationChange={handleDurationChange}
              onEnded={handlevideoWatchCompleted}
              onBuffer={handleBuffer}
              onBufferEnd={handleBufferEnd}
              playsInline={true}
              config={getVideoPlayerConfig()}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-white text-lg">
              No source
            </div>
          )}

          {/* Custom Play Button Overlay */}
          {!playing && (data?.data?.video_path || data?.data?.youtube_link) && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] z-10">
              <button
                onClick={() => setPlaying(true)}
                className="flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-full text-white transition-all active:scale-95 border-2 border-white/30 shadow-2xl"
              >
                <Play className="w-8 h-8 ml-1 fill-white" />
              </button>
            </div>
          )}

          {/* Buffering Indicator */}
          {isBuffering && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            </div>
          )}

          {/* Top Controls (Fullscreen/Exit) */}
          <div className={`absolute top-0 left-0 right-0 p-4 flex justify-between z-20 bg-gradient-to-b from-black/60 to-transparent pt-6 transition-opacity duration-300 ${showControls || !playing ? 'opacity-100' : 'opacity-0'
            }`}>
            <div className="flex items-center">
              {isFullscreen && (
                <button
                  onClick={() => setIsFullscreen(false)}
                  className="flex items-center justify-center w-10 h-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full text-white transition-colors mr-2"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleMute}
                className="flex items-center justify-center w-10 h-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full text-white transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>
              <button
                onClick={toggleFullscreen}
                className="flex items-center justify-center w-10 h-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full text-white transition-colors"
              >
                {isFullscreen ? (
                  <Minimize2 className="w-5 h-5" />
                ) : (
                  <Maximize2 className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Custom Controls Bar */}
          <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent pt-8 pb-8 px-4 z-30 transition-opacity duration-300 ${showControls || !playing ? 'opacity-100' : 'opacity-0'
            }`}>
            <div className="flex items-center space-x-3">
              {/* Play/Pause Button */}
              <button
                onClick={() => setPlaying(!playing)}
                className="flex items-center justify-center w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full text-white shadow-lg active:scale-95 transition-transform flex-shrink-0"
              >
                {playing ? (
                  <div className="flex space-x-1.5 items-center h-5">
                    <div className="w-1.5 h-full bg-white rounded-sm"></div>
                    <div className="w-1.5 h-full bg-white rounded-sm"></div>
                  </div>
                ) : (
                  <Play className="w-5 h-5 ml-0.5 fill-current" />
                )}
              </button>

              {/* Restart Button */}
              <button
                onClick={restartVideo}
                className="flex items-center justify-center w-10 h-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full text-white transition-colors flex-shrink-0"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              {/* Time Display */}
              <div className="text-xs text-white font-mono min-w-[80px]">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>

              {/* Progress Bar - Thicker for touch */}
              <div
                ref={progressRef}
                className="flex-1 h-6 bg-white/20 rounded-full cursor-pointer relative overflow-hidden active:scale-[0.99]"
                onClick={handleSeek}
                onTouchStart={handleSeek}
              >
                <div
                  className="h-full bg-blue-500 rounded-full absolute top-0 left-0 transition-all duration-100"
                  style={{ width: `${played * 100}%` }}
                ></div>
                {/* Scrubber Handle */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-md transition-all"
                  style={{ left: `${played * 100}%`, transform: `translate(-50%, -50%)` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Info Card - Native App Style */}
      {!isFullscreen && (
        <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3 leading-snug">
            {data?.data?.title}
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            {data?.data?.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-xs text-gray-500 bg-gray-50 rounded-full px-4 py-2">
              <Calendar className="w-4 h-4 mr-2" />
              {UIHelpers.DateFormat(data?.data?.showing_date)}
            </div>
            {data?.data?.watched && (
              <div className="flex items-center text-xs text-green-600 bg-green-50 rounded-full px-4 py-2">
                <CheckCircle className="w-4 h-4 mr-2" />
                Completed
              </div>
            )}
          </div>
        </div>
      )}

      {/* Instructions Card - Native App Style */}
      {!isFullscreen && (
        <div className="bg-blue-50 rounded-3xl p-6 border border-blue-100">
          <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            Instructions
          </h3>
          <ul className="space-y-3 text-sm text-blue-800">
            <li className="flex items-start">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
              Watch the video completely to unlock today's rewards.
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
              Do not skip or fast-forward through the content.
            </li>
            {isMobile && (
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                Tap the <Maximize2 className="w-3 h-3 mx-1 inline" /> icon for immersive viewing.
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}