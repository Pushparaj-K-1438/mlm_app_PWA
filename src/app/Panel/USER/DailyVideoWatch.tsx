import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  CheckCircle,
  Clock,
  Calendar,
  AlertCircle,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useActionCall, useGetCall } from "@/hooks";
import { SERVICE } from "@/constants/services";
import Loader from "@/components/ui/Loader";
import ReactPlayer from "react-player";
const ReactPlayerAny = ReactPlayer as any;
import UIHelpers from "@/utils/UIhelper";
import Swal from "sweetalert2";
import Lib from "@/utils/Lib";
import {
  getVideoPlayerConfig,
  handleVideoTap,
  videoContainerProps,
} from "@/utils/videoPlayerConfig";

interface DailyVideoWatchProps {
  onVideoWatched: () => void;
}

export default function DailyVideoWatch({
  onVideoWatched,
}: DailyVideoWatchProps) {
  const { data, loading, setQuery } = useGetCall(SERVICE.DAILY_VIDEO_TODAY);
  const { Post: updateDVStatus } = useActionCall(
    SERVICE.DAILY_VIDEO_STATUS_UPDATE,
  );

  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [playing, setPlayingRaw] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const setPlaying = React.useCallback((val: boolean) => {
    console.log(`SET_PLAYING CALLED WITH: ${val}`);
    setPlayingRaw(val);
  }, []);

  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Handle back button to exit fullscreen on Android
  useEffect(() => {
    const handleBackButton = (e: PopStateEvent) => {
      if (isFullscreen) {
        e.preventDefault();
        setIsFullscreen(false);
        // Exit native fullscreen if active
        try {
          if (document.fullscreenElement) {
            document.exitFullscreen();
          } else if ((document as any).webkitFullscreenElement) {
            (document as any).webkitExitFullscreen();
          }
        } catch (err) {
          // Ignore
        }
        // Unlock screen orientation
        try {
          if (screen.orientation && screen.orientation.unlock) {
            screen.orientation.unlock();
          }
        } catch (err) {
          // Ignore
        }
        // Push state back to prevent actual navigation
        window.history.pushState(null, "", window.location.href);
      }
    };

    // Add/remove body class for immersive fullscreen
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    }

    // Listen for native fullscreen changes
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && !(document as any).webkitFullscreenElement) {
        setIsFullscreen(false);
        try {
          if (screen.orientation && screen.orientation.unlock) {
            screen.orientation.unlock();
          }
        } catch (err) {
          // Ignore
        }
      }
    };

    if (isFullscreen) {
      // Push a state so back button can be intercepted
      window.history.pushState(null, "", window.location.href);
      window.addEventListener("popstate", handleBackButton);
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      // Clean up body styles
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    };
  }, [isFullscreen]);

  // Auto-hide controls when playing
  useEffect(() => {
    if (playing) {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }

      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    } else {
      setShowControls(true);
    }

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [playing, currentTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string): string => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([^&\n?#]+)/,
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    return "";
  };

  const videoUrl = React.useMemo(() => {
    const path = data?.data?.video_path;
    const link = data?.data?.youtube_link;

    // Ensure we trim any potential whitespace from the source
    let target = (link || path)?.trim();
    if (!target) return undefined;

    // If it's a YouTube link, handle conversion
    if (target.includes("youtube.com") || target.includes("youtu.be")) {
      let youtubeLink = target;
      if (youtubeLink.includes("/shorts/")) {
        const videoId = youtubeLink.split("/shorts/")[1]?.split("?")[0];
        if (videoId) {
          youtubeLink = `https://www.youtube.com/watch?v=${videoId}`;
        }
      } else if (youtubeLink.includes("youtu.be/")) {
        const videoId = youtubeLink.split("youtu.be/")[1]?.split("?")[0];
        if (videoId) {
          youtubeLink = `https://www.youtube.com/watch?v=${videoId}`;
        }
      }

      if (youtubeLink.includes("youtube.com") && !youtubeLink.includes("www.")) {
        youtubeLink = youtubeLink.replace("youtube.com", "www.youtube.com");
      }
      return youtubeLink;
    }

    // If it's a direct http link, return it
    if (target.startsWith("http")) return target;

    // Otherwise it's a storage path
    return Lib.CloudPath(target);
  }, [data?.data?.video_path, data?.data?.youtube_link]);

  useEffect(() => {
    console.log("DEBUG: DailyVideoWatch MOUNTED");
    return () => console.log("DEBUG: DailyVideoWatch UNMOUNTED");
  }, []);

  useEffect(() => {
    console.log("DEBUG: playing state actually changed to:", playing);
  }, [playing]);

  useEffect(() => {
    if (videoUrl) {
      console.log("DEBUG: videoUrl updated:", videoUrl);
    }
  }, [videoUrl]);

  const playerConfig = React.useMemo(() => getVideoPlayerConfig(), []);

  // Track progress via onProgress callback

  const handleProgress = React.useCallback((state: any) => {

    setPlayed(state.played);

    setCurrentTime(state.playedSeconds);

  }, []);



  const handleDuration = React.useCallback((duration: number) => {

    setDuration(duration);

  }, []);



  // Seeking is disabled - user cannot seek forward/backward
  const handleSeek = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);



  const toggleFullscreen = React.useCallback(async () => {

    const container = containerRef.current;



    if (!isFullscreen) {

      // Try native Fullscreen API first (works in WebView)

      try {

        if (container) {

          if (container.requestFullscreen) {

            await container.requestFullscreen();

          } else if ((container as any).webkitRequestFullscreen) {

            await (container as any).webkitRequestFullscreen();

          } else if ((container as any).webkitEnterFullscreen) {

            await (container as any).webkitEnterFullscreen();

          }

        }

      } catch (e) {

        // Native fullscreen not supported, CSS fallback will be used

      }



      // Try to lock screen orientation to landscape

      try {

        if (screen.orientation && (screen.orientation as any).lock) {

          await (screen.orientation as any).lock("landscape");

        }

      } catch (e) {

        // Orientation lock not supported or failed

      }



      // Set state once after all attempts

      setIsFullscreen(true);

    } else {

      // Exit native fullscreen

      try {

        if (document.fullscreenElement) {

          await document.exitFullscreen();

        } else if ((document as any).webkitFullscreenElement) {

          await (document as any).webkitExitFullscreen();

        }

      } catch (e) {

        // Native fullscreen exit failed

      }



      // Unlock screen orientation

      try {

        if (screen.orientation && screen.orientation.unlock) {

          screen.orientation.unlock();

        }

      } catch (e) {

        // Orientation unlock not supported

      }



      // Set state once after all attempts

      setIsFullscreen(false);

    }

  }, [isFullscreen]);



  const toggleMute = React.useCallback(() => {

    setIsMuted(prev => !prev);

  }, []);



  const handleVideoContainerClick = React.useCallback(() => {
    if (playing) {
      setShowControls(prev => !prev);
    }
  }, [playing]);

  // Prevent double-tap/seeking on YouTube videos
  const handleVideoTouch = React.useCallback((e: React.TouchEvent | React.MouseEvent) => {
    handleVideoTap(e, () => {
      if (playing) {
        setShowControls(prev => !prev);
      }
    });
  }, [playing]);

  const handleDoubleClick = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);



  // Play video in embedded player (works for both direct files and YouTube)

  const handlePlayVideo = React.useCallback(() => {
    console.log("handlePlayVideo called, setting playing to true");
    setPlaying(true);

    // Direct call to internal player to ensure sync with user interaction
    if (playerRef.current) {
      try {
        const internal = playerRef.current.getInternalPlayer();
        if (internal) {
          if (typeof internal.playVideo === 'function') internal.playVideo();
          else if (typeof internal.play === 'function') internal.play().catch(() => { });
        }
      } catch (e) { }
    }
  }, []);

  const handleTogglePlay = React.useCallback(() => {
    const nextPlaying = !playing;
    console.log("handleTogglePlay called, current state:", playing, "next state:", nextPlaying);
    setPlaying(nextPlaying);

    if (playerRef.current) {
      try {
        const internal = playerRef.current.getInternalPlayer();
        if (internal) {
          if (nextPlaying) {
            if (typeof internal.playVideo === 'function') internal.playVideo();
            else if (typeof internal.play === 'function') internal.play().catch(() => { });
          } else {
            if (typeof internal.pauseVideo === 'function') internal.pauseVideo();
            else if (typeof internal.pause === 'function') internal.pause();
          }
        }
      } catch (e) { }
    }
  }, [playing]);

  const handlevideoWatchCompleted = React.useCallback(async () => {



    console.log("handlevideoWatchCompleted CALLED");



    // if already watched not need to trigger



    if (!data?.data?.watched) {




      Swal.fire({
        icon: "success",
        title: "Daily Video Completed!",
        text: "You've completed today's daily video! You can now access other features",
        confirmButtonText: "OK",
        customClass: {
          confirmButton:
            "bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md transition-all duration-200",
        },
      }).then((result) => {
        setQuery();
      });
      await updateDVStatus(
        {
          daily_video_id: data?.data?.id,
          watchedstatus: 1,
        },
        "",
      );
    }
    setPlaying(false);
  }, [data?.data?.watched, data?.data?.id, setQuery, updateDVStatus]);

  if (loading) {
    return <Loader />;
  }

  if (!data?.data?.id) {
    return (
      <div className="min-h-screen bg-gray-50 safe-area-inset-bottom pb-20">
        <div className="flex flex-col items-center justify-center h-64 px-6">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Calendar className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Daily Video Available
          </h3>
          <p className="text-center text-gray-500">
            There's no daily video scheduled for today. Please check back later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 safe-area-inset-bottom pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 safe-area-inset-top">
        <h1 className="text-xl font-bold text-gray-900">
          Daily Information Video
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          {data?.data?.watched ? (
            <span className="flex text-green-600">
              <CheckCircle className="text-green-400 mr-2" />
              You've completed today's daily video!
            </span>
          ) : (
            <span className="flex text-yellow-600">
              <AlertCircle className="mr-2 text-yellow-400" />
              Watch the video completely to unlock all features.
            </span>
          )}
        </p>
      </div>

      {/* Video Player Section */}
      <div
        className={`bg-black ${isFullscreen
          ? "fixed inset-0 z-50 !mx-0 !mt-0 !rounded-none"
          : "relative mx-4 sm:mx-6 mt-6 rounded-2xl overflow-hidden"
          }`}
        ref={containerRef}
        onClick={handleVideoContainerClick}
        onTouchEnd={handleVideoTouch}
        onDoubleClick={handleDoubleClick}
        {...videoContainerProps}
        style={isFullscreen ? {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
        } : undefined}
      >
        <div
          className={`${isFullscreen ? "h-screen" : "aspect-video"
            } bg-gray-900 relative`}
        >
          {videoUrl ? (
            <>
              <ReactPlayerAny
                key={videoUrl}
                ref={playerRef}
                url={videoUrl}
                width="100%"
                height="100%"
                controls={false}
                playing={playing}
                muted={isMuted}
                playsinline={true}
                onReady={() => {
                  console.log("=== DAILY VIDEO PLAYER READY ===");
                }}
                onStart={() => {
                  console.log("Video onStart event fired");
                  setHasStarted(true);
                }}
                onProgress={handleProgress as any}
                onDuration={handleDuration}
                onPlay={() => {
                  console.log("DEBUG: Native onPlay event fired");
                  setHasStarted(true);
                  if (!playing) setPlaying(true);
                }}
                onPause={() => {
                  console.log("DEBUG: Native onPause event fired");
                  if (playing) setPlaying(false);
                }}
                onError={(error: any) => {
                  console.error("ReactPlayer Error:", error);
                }}
                onEnded={() => {
                  console.log("DEBUG: onEnded event fired");
                  if (duration > 0 && currentTime > duration * 0.9) {
                    handlevideoWatchCompleted();
                  } else if (duration === 0 && currentTime > 0) {
                    handlevideoWatchCompleted();
                  } else {
                    console.log("Video ended prematurely, not marking as watched");
                    setPlaying(false);
                  }
                }}
                config={playerConfig as any}
                style={{ background: 'black' }}
              />
              {/* Transparent overlay to prevent YouTube double-tap seeking */}
              <div
                className="absolute inset-0"
                onTouchEnd={handleVideoTouch}
                onClick={handleVideoContainerClick}
                onDoubleClick={handleDoubleClick}
                style={{ touchAction: 'manipulation' }}
              />
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-white text-lg">
              No video source available
            </div>
          )}

          {/* Custom Play Button Overlay */}
          {!hasStarted && !playing && videoUrl && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlayVideo();
                }}
                className={`flex items-center justify-center w-20 h-20 rounded-full text-white transition-all transform hover:scale-105 ${videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-blue-600 hover:bg-blue-700"
                  }`}
              >
                <Play className="w-8 h-8 ml-1" />
              </button>
            </div>
          )}

          {/* Controls Overlay - Show when playing and controls are visible */}
          {showControls && videoUrl && (
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50 pointer-events-none">
              {/* Top Controls */}
              <div className="flex justify-between items-center p-4 pointer-events-auto">
                <div className="text-white">
                  <h3 className="font-medium">{data?.data?.title}</h3>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMute();
                    }}
                    className="flex items-center justify-center w-10 h-10 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full text-white transition-colors"
                  >
                    {isMuted ? (
                      <VolumeX className="w-5 h-5" />
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFullscreen();
                    }}
                    className="flex items-center justify-center w-10 h-10 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full text-white transition-colors"
                  >
                    {isFullscreen ? (
                      <Minimize2 className="w-5 h-5" />
                    ) : (
                      <Maximize2 className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Bottom Controls */}
              <div className="absolute bottom-0 left-0 right-0 p-4 pointer-events-auto">
                {/* Progress Bar */}
                <div
                  className="h-1 bg-white bg-opacity-30 rounded-full overflow-hidden mb-3"
                >
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-200"
                    style={{ width: `${played * 100}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between">
                  {/* Play/Pause Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTogglePlay();
                    }}
                    className="flex items-center justify-center w-12 h-12 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full text-white transition-colors"
                  >
                    {playing ? (
                      <div className="flex space-x-1">
                        <div className="w-1 h-5 bg-white"></div>
                        <div className="w-1 h-5 bg-white"></div>
                      </div>
                    ) : (
                      <Play className="w-5 h-5 ml-0.5" />
                    )}
                  </button>

                  {/* Time Display */}
                  <div className="flex items-center text-sm text-white font-medium">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Video Details - Hide when in fullscreen */}
      {!isFullscreen && (
        <div className="px-6 mt-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {data?.data?.title}
              </h2>
              {Boolean(data?.data?.watched) && (
                <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">Completed</span>
                </div>
              )}
            </div>

            <p className="text-gray-600 mb-4">{data?.data?.description}</p>

            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-1" />
              {UIHelpers.DateFormat(data?.data?.showing_date)}
            </div>
          </div>
        </div>
      )}

      {/* Instructions - Hide when in fullscreen */}
      {!isFullscreen && (
        <div className="px-6 mt-6 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <h3 className="text-lg font-medium text-blue-900 mb-3">
              Important Instructions
            </h3>
            <ul className="space-y-3 text-blue-800">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>
                  You must watch the daily information video completely before
                  accessing other features
                </span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>
                  The video contains important updates and information for your
                  daily activities
                </span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>
                  Once completed, you'll have full access to training, promotion
                  videos, and other features
                </span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Tap the screen to show/hide controls while playing</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
