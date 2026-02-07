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
import UIHelpers from "@/utils/UIhelper";
import Swal from "sweetalert2";
import Lib from "@/utils/Lib";

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const youTubePlayerRef = useRef<any>(null);
  const [playing, setPlayingRaw] = useState(false);
  // Track maximum watched position to prevent seeking forward
  const maxWatchedRef = useRef<number>(0);
  // Time display state
  const [currentVideoTime, setCurrentVideoTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [videoProgress, setVideoProgress] = useState(0);
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

  // Time tracking interval ref
  const timeTrackingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Helper functions for time tracking (defined before YouTube useEffect)
  const updateTimeDisplay = () => {
    let currentTime = 0;
    let duration = 0;

    if (apiVideoUrl && (apiVideoUrl.includes("youtube.com") || apiVideoUrl.includes("youtu.be"))) {
      // YouTube video
      if (youTubePlayerRef.current) {
        currentTime = youTubePlayerRef.current.getCurrentTime() || 0;
        duration = youTubePlayerRef.current.getDuration() || 0;
      }
    } else {
      // Uploaded file
      if (videoRef.current) {
        currentTime = videoRef.current.currentTime || 0;
        duration = videoRef.current.duration || 0;
      }
    }

    setCurrentVideoTime(currentTime);
    setTotalDuration(duration);
    if (duration > 0) {
      setVideoProgress(currentTime / duration);
    }
  };

  const updateProgressBar = (progress: number) => {
    setVideoProgress(progress);
  };

  const startTimeTracking = () => {
    stopTimeTracking();
    timeTrackingIntervalRef.current = setInterval(() => {
      updateTimeDisplay();
    }, 250); // Update every 250ms for smoother display
  };

  const stopTimeTracking = () => {
    if (timeTrackingIntervalRef.current) {
      clearInterval(timeTrackingIntervalRef.current);
      timeTrackingIntervalRef.current = null;
    }
  };

  const handleTogglePlay = () => {
    if (apiVideoUrl && (apiVideoUrl.includes("youtube.com") || apiVideoUrl.includes("youtu.be"))) {
      // YouTube video
      if (youTubePlayerRef.current) {
        const YT = (window as any).YT;
        const state = youTubePlayerRef.current.getPlayerState();
        if (state === YT.PlayerState.PLAYING) {
          youTubePlayerRef.current.pauseVideo();
        } else {
          youTubePlayerRef.current.playVideo();
        }
      }
    } else {
      // Uploaded file
      if (videoRef.current) {
        if (videoRef.current.paused) {
          videoRef.current.play();
          setPlayingRaw(true);
        } else {
          videoRef.current.pause();
          setPlayingRaw(false);
        }
      }
    }
  };

  // Get video URL from API
  const apiVideoUrl = React.useMemo(() => {
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

  // Convert to embed URL for iframe
  const embedUrl = React.useMemo(() => {
    if (!apiVideoUrl) return null;

    // Check if it's a YouTube URL
    const youtubeId = apiVideoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    if (youtubeId && youtubeId[1]) {
      return `https://www.youtube.com/embed/${youtubeId[1]}?autoplay=0&controls=1&rel=0`;
    }

    // For non-YouTube videos (uploaded files), return as is
    return apiVideoUrl;
  }, [apiVideoUrl]);

  useEffect(() => {
    console.log("DEBUG: DailyVideoWatch MOUNTED");
    return () => console.log("DEBUG: DailyVideoWatch UNMOUNTED");
  }, []);

  useEffect(() => {
    console.log("DEBUG: playing state actually changed to:", playing);
  }, [playing]);

  useEffect(() => {
    if (embedUrl) {
      console.log("DEBUG: embedUrl updated:", embedUrl);
    }
  }, [embedUrl]);

  // Load YouTube IFrame API for YouTube videos
  useEffect(() => {
    if (!apiVideoUrl || (!apiVideoUrl.includes("youtube.com") && !apiVideoUrl.includes("youtu.be"))) {
      return;
    }

    // Extract YouTube video ID
    const youtubeId = apiVideoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    if (!youtubeId || !youtubeId[1]) return;

    const videoId = youtubeId[1];

    // Load YouTube IFrame API if not already loaded
    if (!(window as any).YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    // Initialize YouTube player when API is ready
    const onYouTubeIframeAPIReady = () => {
      const playerId = `youtube-player-${data?.data?.id || 'daily'}`;
      if (youTubePlayerRef.current) {
        youTubePlayerRef.current.destroy();
      }

      youTubePlayerRef.current = new (window as any).YT.Player(playerId, {
        videoId: videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          rel: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          playsinline: 1,
        },
        events: {
          onReady: (event: any) => {
            console.log("YouTube player ready");
            updateTimeDisplay();
          },
          onStateChange: (event: any) => {
            const YT = (window as any).YT;
            if (event.data === YT.PlayerState.PLAYING) {
              setPlayingRaw(true);
              startTimeTracking();
            } else if (event.data === YT.PlayerState.PAUSED) {
              setPlayingRaw(false);
              stopTimeTracking();
            } else if (event.data === YT.PlayerState.ENDED) {
              setPlayingRaw(false);
              stopTimeTracking();
              handlevideoWatchCompleted();
            }
          }
        }
      });
    };

    // Check if API is already loaded
    if ((window as any).YT && (window as any).YT.Player) {
      onYouTubeIframeAPIReady();
    } else {
      (window as any).onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
    }

    return () => {
      if (youTubePlayerRef.current) {
        youTubePlayerRef.current.destroy();
        youTubePlayerRef.current = null;
      }
      stopTimeTracking();
    };
  }, [apiVideoUrl, data?.data?.id]);

  // Start time tracking when video starts playing
  useEffect(() => {
    if (playing && videoRef.current && (!apiVideoUrl || (!apiVideoUrl.includes("youtube.com") && !apiVideoUrl.includes("youtu.be")))) {
      startTimeTracking();
    } else {
      stopTimeTracking();
    }
    return () => stopTimeTracking();
  }, [playing]);

  const toggleFullscreen = React.useCallback(async () => {
    const container = containerRef.current;

    if (!isFullscreen) {
      // Enter fullscreen
      if (container) {
        try {
          if (container.requestFullscreen) {
            await container.requestFullscreen();
          } else if ((container as any).webkitRequestFullscreen) {
            await (container as any).webkitRequestFullscreen();
          }
        } catch (e) {
          console.log("Native fullscreen failed, using CSS fallback");
        }
      }
      setIsFullscreen(true);
    } else {
      // Exit fullscreen
      try {
        if (document.exitFullscreen && document.fullscreenElement) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen && (document as any).webkitFullscreenElement) {
          await (document as any).webkitExitFullscreen();
        }
      } catch (e) {
        console.log("Exit fullscreen failed");
      }
      setIsFullscreen(false);
    }
  }, [isFullscreen]);

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
          ref={containerRef}
          className={`${isFullscreen ? "fixed inset-0 z-50" : "w-full aspect-video"
            } bg-gray-900 relative`}
          style={{ minHeight: isFullscreen ? '100vh' : 'auto' }}
        >
          {embedUrl ? (
            <>
              {apiVideoUrl && (apiVideoUrl.includes("youtube.com") || apiVideoUrl.includes("youtu.be")) ? (
                // YouTube video - use div for YouTube IFrame API (controls=0, custom controls only)
                <div className="absolute inset-0">
                  <div
                    id={`youtube-player-${data?.data?.id || 'daily'}`}
                    className="w-full h-full"
                  />
                </div>
              ) : (
                // Uploaded file - use HTML5 video WITHOUT controls, custom controls only
                <video
                  key={embedUrl}
                  ref={videoRef}
                  src={embedUrl}
                  className="absolute inset-0 w-full h-full"
                  playsInline
                  style={{ background: 'black' }}
                  onLoadedMetadata={(e) => {
                    setTotalDuration(e.currentTarget.duration || 0);
                  }}
                  onTimeUpdate={(e) => {
                    const currentTime = e.currentTarget.currentTime;
                    const duration = e.currentTarget.duration;
                    // Track maximum watched position
                    if (currentTime > maxWatchedRef.current) {
                      maxWatchedRef.current = currentTime;
                    }
                    setCurrentVideoTime(currentTime);
                    setTotalDuration(duration);
                    if (duration > 0) {
                      setVideoProgress(currentTime / duration);
                    }
                  }}
                  onPlay={() => {
                    setPlayingRaw(true);
                    startTimeTracking();
                  }}
                  onPause={() => {
                    setPlayingRaw(false);
                    stopTimeTracking();
                  }}
                  onEnded={() => {
                    setPlayingRaw(false);
                    stopTimeTracking();
                    if (videoRef.current && videoRef.current.currentTime > 0) {
                      handlevideoWatchCompleted();
                    }
                  }}
                />
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-white text-lg">
              No video source available
            </div>
          )}

          {/* Custom Controls Overlay */}
          {embedUrl && (
            <div className="absolute inset-0 flex flex-col justify-end pointer-events-none">
              {/* Center Play/Pause Button */}
              <div className="flex-1 flex items-center justify-center pointer-events-auto">
                {!playing && (
                  <button
                    onClick={handleTogglePlay}
                    className="flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full text-white transition-all transform hover:scale-105"
                  >
                    <Play className="w-8 h-8 ml-1" />
                  </button>
                )}
              </div>

              {/* Bottom Controls Bar */}
              <div className="bg-gradient-to-t from-black/80 to-transparent p-4 pointer-events-auto">
                <div className="flex items-center justify-between">
                  {/* Play/Pause Button */}
                  <button
                    onClick={handleTogglePlay}
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

                  {/* Time Display (read-only, no seek) */}
                  <div className="flex items-center text-sm text-white">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{formatTime(currentVideoTime)} / {formatTime(totalDuration)}</span>
                  </div>

                  {/* Fullscreen Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFullscreen();
                    }}
                    className="flex items-center justify-center w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full text-white transition-colors"
                  >
                    {isFullscreen ? (
                      <Minimize2 className="w-5 h-5" />
                    ) : (
                      <Maximize2 className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Progress Bar - Read-only (no click to seek) */}
                <div className="mt-3 h-1 bg-white bg-opacity-30 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 transition-all duration-200" style={{ width: `${videoProgress * 100}%` }}></div>
                </div>
              </div>

              {/* Top Title Bar */}
              <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start bg-gradient-to-b from-black/70 to-transparent pointer-events-auto">
                <div className="text-white">
                  <h3 className="font-medium text-lg">{data?.data?.title || 'Daily Video'}</h3>
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
