import React, { useState, useEffect, useRef } from "react";
import { useData } from "@/context/DataContext";
import { useAuth } from "@/context/AuthContext";
import {
  Play,
  CheckCircle,
  Clock,
  Trophy,
  Timer,
  Award,
  HelpCircle,
  RefreshCw,
  Star,
  XCircle,
  LogIn,
  Crown,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Target,
  Video,
  Gift,
} from "lucide-react";
import { SERVICE } from "@/constants/services";
import { useActionCall, useGetCall } from "@/hooks";
import Loader from "@/components/ui/Loader";
import ReactPlayer from "react-player";
const ReactPlayerAny = ReactPlayer as any;
import UIHelpers from "@/utils/UIhelper";
import Swal from "sweetalert2";
import DailyVideoWarning from "@/components/DailyVideoWarning";
import QuizForm from "@/components/QuizeForm";
import Lib from "@/utils/Lib";
import Error500 from "@/components/ui/Error500";
import TrainingVideoWarning from "@/components/TrainingVideoWarning";
import { LANG } from "@/constants/others";
import {
  videoContainerProps,
} from "@/utils/videoPlayerConfig";

function PromotionVideosPage() {
  const { data, loading, setQuery, error } = useGetCall(
    SERVICE.GET_PROMOTION_VIDEO,
  );
  const { data: userInfo } = useGetCall(SERVICE.GET_PROFILE);
  const {
    error: quizeUpdateError,
    loading: quizeUpdateLoading,
    Post: updateQuize,
  } = useActionCall(SERVICE.PROMOTION_VIDEO_QUIZ_UPDATE);

  const {
    loading: confirmLoading,
    Post: updateQuizeConfirm,
    error: confirmError,
  } = useActionCall(SERVICE.PROMOTION_VIDEO_QUIZ_CONFIRM);

  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [takeQuiz, setTakeQuiz] = useState(false);
  const [takeQuizLang, setTakeQuizLang] = useState(LANG.TN);
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

  const handleTakeQuiz = () => {
    Swal.fire({
      icon: "info",
      title: `Read Instructions`,
      html: `
     <ul>
      <li>* Each question has 55 seconds to answer.</li>
      <li>* Once submitted, you cannot return to previous questions.</li>
      <li>* Unanswered questions after 55 seconds will auto-skip.</li>
      <li>* No pausing or refreshing during the quiz.</li>
     </ul>
    `,
      showCancelButton: true,
      confirmButtonText: "Take Quiz in English",
      cancelButtonText: "Take Quiz in Tamil",
      reverseButtons: true, // Puts the buttons in a specific order (optional)
      customClass: {
        confirmButton:
          "bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md transition-all duration-200",
        cancelButton:
          "bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-md transition-all duration-200",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        setTakeQuizLang(LANG.EN);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        setTakeQuizLang(LANG.TA);
      }
      setTakeQuiz(true);
    });
  };

  useEffect(() => {
    const quizeTaken = localStorage.getItem("promotion_video_quiz_taken");

    if (quizeTaken) {
      handleTakeQuiz();
    }
  }, []);

  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
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

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
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

  const videoUrl = React.useMemo(() => {
    const path = data?.data?.promotion_video?.video_path;
    const link = data?.data?.promotion_video?.youtube_link;

    let target = link || path;
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
  }, [data?.data?.promotion_video?.video_path, data?.data?.promotion_video?.youtube_link]);

  const isYoutube = React.useMemo(() => {
    return videoUrl && (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be"));
  }, [videoUrl]);

  const youtubeThumbnailSafe = React.useMemo(() => {
    if (!isYoutube || !videoUrl) return null;
    try {
      const urlObj = new URL(videoUrl);
      const videoId = urlObj.searchParams.get("v");
      if (videoId) {
        return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      }
    } catch (e) { }
    return null;
  }, [isYoutube, videoUrl]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleProgress = (state: any) => {
    setPlayed(state.played);
    setCurrentTime(state.playedSeconds);
  };

  const handleDuration = (duration: number) => {
    setDuration(duration);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - bounds.left) / bounds.width;

    if (playerRef.current) {
      playerRef.current.seekTo(percent, "fraction");
    }
  };

  const toggleFullscreen = async () => {
    const container = containerRef.current;

    if (!isFullscreen) {
      // Try native Fullscreen API
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
        // Orientation lock not supported
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
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVideoContainerClick = () => {
    if (playing) {
      setShowControls(!showControls);
    }
  };

  // Play video in embedded player (works for both direct files and YouTube)
  const handlePlayVideo = () => {
    console.log("Promotion handlePlayVideo called");

    if (isYoutube && videoUrl) {
      window.open(videoUrl, "_blank");
      handlevideoWatchCompleted();
      return;
    }

    setPlaying(true);

    if (playerRef.current) {
      try {
        const internal = playerRef.current.getInternalPlayer();
        if (internal) {
          if (typeof internal.playVideo === 'function') internal.playVideo();
          else if (typeof internal.play === 'function') internal.play().catch(() => { });
        }
      } catch (e) { }
    }
  };

  const handleTogglePlay = () => {
    if (isYoutube && videoUrl) {
      handlePlayVideo();
      return;
    }

    const nextPlaying = !playing;
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
  };

  if (loading || quizeUpdateLoading || confirmLoading) {
    return <Loader />;
  }

  if (error || quizeUpdateError || confirmError) {
    const title =
      error || quizeUpdateError || confirmError || "Something went wrong!";
    let description = "";
    if (error) {
      description =
        "No promotion data is available at the moment. Please check back later or adjust your filters.";
    } else if (quizeUpdateError) {
      description = quizeUpdateError;
    } else if (confirmError) {
      description = confirmError;
    } else {
      description =
        "An unexpected error occurred. Please try refreshing the page or come back later.";
    }
    const colorCode = error ? "yellow-700" : "red-700";
    return (
      <Error500 title={title} description={description} colorCode={colorCode} />
    );
  }

  if (!error && !data?.data) {
    return (
      <div className="min-h-screen bg-gray-50 safe-area-inset-bottom pb-20 flex items-center justify-center px-6">
        <div className="bg-white rounded-3xl shadow-lg p-8 max-w-md w-full">
          <div className="flex flex-col items-center justify-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
              <Crown className="w-10 h-10 text-white" />
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <h3 className="text-xl font-bold text-gray-900">
                Your session for today is complete.
              </h3>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handlevideoWatchCompleted = async () => {
    Swal.fire({
      icon: "success",
      title: `${data?.data?.promotion_video?.title}`,
      text: "You've finished watching the promotion video. Please proceed to take the quiz to continue.",
      confirmButtonText: "OK",
      customClass: {
        confirmButton:
          "bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md transition-all duration-200",
      },
    }).then((result) => {
      handleTakeQuiz();
    });
    setDuration(0);
    setCurrentTime(0);
    setPlayed(0);
    setPlaying(false);
  };

  const handleQuizSubmit = async (payload = []) => {
    let formPayload = {
      promotion_video_id: data?.data?.promotion_video?.id,
      questions: payload,
    };
    let response = await updateQuize(formPayload);
    if (response) {
      Swal.fire({
        title: "Quiz Completed",
        text: `Your score is ${response?.data?.correct_count} out of ${response?.data?.total_questions}. Your Total Earning ₹ ${response?.data?.total_earning}`,
        icon: "info",

        showCancelButton: response?.data?.retry ?? false,
        confirmButtonText: "Confirm & Close",
        cancelButtonText: "Retry Quiz",

        // Configure colors (optional)
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#f9e154",
      }).then((result) => {
        if (result.isConfirmed) {
          handleConfirmAndClose();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          setQuery(true);
          setTakeQuiz(false);
        }
      });
      localStorage.removeItem("promotion_video_quiz_taken");
    }
  };

  const handleConfirmAndClose = async () => {
    const response = await updateQuizeConfirm({
      user_promoter_session_id: data?.data?.user_promoter_session?.id,
    });
    if (response) {
      Swal.fire(
        "Completed!",
        "Thank you for taking the quiz! Your participation is appreciated.",
        "success",
      );
      setQuery();
      setTakeQuiz(false);
    }
  };

  return (
    <>
      {takeQuiz ? (
        <QuizForm
          title={`${data?.data?.promotion_video?.title}`}
          quizQuestion={Lib.transformQuestionsFromResponse(
            data?.data?.promotion_video?.quiz?.questions,
            takeQuizLang,
          )}
          handleQuizSubmit={handleQuizSubmit}
        />
      ) : (
        <div className="min-h-screen bg-gray-50 safe-area-inset-bottom pb-20">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4 safe-area-inset-top">
            <h1 className="text-xl font-bold text-gray-900">
              Education & Promotion Videos
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Watch promotional content and earn rewards through quizzes
            </p>
          </div>

          {/* Level Benefits */}
          <div className="px-6 mt-6">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">
                Your Level Benefits
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex flex-col items-center justify-center">
                    <Trophy className="w-6 h-6 mb-2" />
                    <span className="text-xs opacity-90">Level</span>
                    <span className="text-lg font-bold">0</span>
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex flex-col items-center justify-center">
                    <Video className="w-6 h-6 mb-2" />
                    <span className="text-xs opacity-90">Videos</span>
                    <span className="text-lg font-bold">
                      {userInfo?.data?.current_promoter_level >= 2 ? "4" : "2"}
                    </span>
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex flex-col items-center justify-center">
                    <RefreshCw className="w-6 h-6 mb-2" />
                    <span className="text-xs opacity-90">Retries</span>
                    <span className="text-lg font-bold">1</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Video Player Section */}
          <div
            className={`bg-black ${isFullscreen
              ? "fixed inset-0 z-50 !mx-0 !mt-0 !rounded-none"
              : "relative mx-4 sm:mx-6 mt-6 rounded-2xl overflow-hidden"
              }`}
            ref={containerRef}
            onClick={handleVideoContainerClick}
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
              {...videoContainerProps}
            >
              {videoUrl && !isYoutube ? (
                <ReactPlayerAny
                  ref={playerRef}
                  url={videoUrl as any}
                  width="100%"
                  height="100%"
                  controls={false}
                  playing={playing}
                  onProgress={handleProgress}
                  onDuration={handleDuration}
                  muted={isMuted}
                  playsinline
                  config={{
                    youtube: {
                      playerVars: {
                        autoplay: 0,
                        controls: 1,
                        playsinline: 1,
                      },
                      embedOptions: {
                        host: 'https://www.youtube.com'
                      }
                    }
                  } as any}
                  onReady={() => {
                    console.log("=== PROMOTION PLAYER READY ===");
                    console.log("Player ref:", playerRef.current);
                    const internal = playerRef.current?.getInternalPlayer?.();
                    console.log("Internal player:", internal);
                    console.log("Internal player type:", internal?.constructor?.name);
                    console.log("Is YouTube iframe?", internal?.getPlayerState ? "YES - YouTube" : "NO - Not YouTube");
                    console.log("============================");
                  }}
                  onStart={() => {
                    console.log("Promotion video started playing");
                  }}
                  onPlay={() => {
                    console.log("Promotion video onPlay fired");
                    if (!playing) setPlaying(true);
                  }}
                  onPause={() => {
                    console.log("Promotion video paused");
                    if (playing) setPlaying(false);
                  }}
                  onEnded={() => {
                    console.log("Promotion video onEnded fired");
                    if (duration > 0 && currentTime > duration * 0.9) {
                      handlevideoWatchCompleted();
                    } else if (duration === 0 && currentTime > 0) {
                      handlevideoWatchCompleted();
                    } else {
                      console.log("Promotion video ended prematurely, not marking as watched");
                      setPlaying(false);
                    }
                  }}
                  onError={(error: any, data?: any) => {
                    console.error("Promotion ReactPlayer Error:", error);
                    console.error("Error data:", data);
                  }}
                  style={{ background: 'black' }}
                />
              ) : videoUrl && isYoutube ? (
                <div
                  className="absolute inset-0 flex items-center justify-center text-white text-lg bg-black bg-cover bg-center"
                  style={{
                    backgroundImage: youtubeThumbnailSafe ? `url(${youtubeThumbnailSafe})` : 'none',
                  }}
                >
                  {!youtubeThumbnailSafe && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      {/* Detailed placeholder if no thumbnail */}
                      <span className="text-sm text-gray-400">Preview not available</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-white text-lg">
                  No video source available
                </div>
              )}

              {/* Custom Play Button Overlay */}
              {!playing &&
                (data?.data?.promotion_video?.video_path ||
                  data?.data?.promotion_video?.youtube_link) && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayVideo();
                      }}
                      className={`flex items-center justify-center w-20 h-20 rounded-full text-white transition-all transform hover:scale-105 shadow-lg ${data?.data?.promotion_video?.youtube_link
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >
                      <Play className="w-8 h-8 ml-1" />
                    </button>
                  </div>
                )}

              {/* Controls Overlay */}
              {showControls && (data?.data?.promotion_video?.video_path || data?.data?.promotion_video?.youtube_link) && (
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50 pointer-events-none">
                  {/* Top Controls */}
                  <div className="flex justify-between items-center p-4 pointer-events-auto">
                    <div className="text-white">
                      <h3 className="font-medium">Promotion Video</h3>
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
                      className="h-1 bg-white bg-opacity-30 rounded-full cursor-pointer overflow-hidden mb-3"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSeek(e);
                      }}
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
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {data?.data?.promotion_video?.title}
                </h2>
                <p className="text-gray-600 mb-4">
                  {data?.data?.promotion_video?.description}
                </p>
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
                      Watch the promotional video completely to unlock the quiz
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>
                      Complete the quiz to earn rewards based on your
                      performance
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>
                      You have one retry option if you're not satisfied with
                      your score
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>
                      Tap the screen to show/hide controls while playing
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default function PromotionVideos() {
  return (
    <DailyVideoWarning>
      <TrainingVideoWarning>
        <PromotionVideosPage />
      </TrainingVideoWarning>
    </DailyVideoWarning>
  );
}
