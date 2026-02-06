import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  CheckCircle,
  Clock,
  AlertTriangle,
  AlertCircle,
  ArrowRight,
  Crown,
  MessageCircleQuestion,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Calendar,
  BookOpen,
  Award,
  Target,
} from "lucide-react";
import { useActionCall, useGetCall } from "@/hooks";
import { SERVICE } from "@/constants/services";
import Loader from "@/components/ui/Loader";
import ReactPlayer from "react-player";
const ReactPlayerAny = ReactPlayer as any;
import UIHelpers from "@/utils/UIhelper";
import Swal from "sweetalert2";
import DailyVideoWarning from "@/components/DailyVideoWarning";
import QuizForm from "@/components/QuizeForm";
import Lib from "@/utils/Lib";
import Error500 from "@/components/ui/Error500";
import { LANG } from "@/constants/others";
import {
  videoContainerProps,
} from "@/utils/videoPlayerConfig";

const TrainingProgramWatch = () => {
  const { data, loading, setQuery, error } = useGetCall(
    SERVICE.USER_TRAINING_CURRENCT,
  );
  const { Post: updateTraningStatus, error: traningStatusUpdateError } =
    useActionCall(SERVICE.TRAINING_STATUS_UPDATE);

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
    const quizeTaken = localStorage.getItem("training_video_quiz_taken");

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

  const videoUrl = React.useMemo(() => {
    const path = data?.data?.training?.training_video?.video_path;
    const link = data?.data?.training?.training_video?.youtube_link;

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
  }, [data?.data?.training?.training_video?.video_path, data?.data?.training?.training_video?.youtube_link]);

  const isYoutube = React.useMemo(() => {
    return videoUrl && (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be"));
  }, [videoUrl]);

  const youtubeThumbnail = React.useMemo(() => {
    if (!isYoutube || !videoUrl) return null;
    try {
      const urlObj = new URL(videoUrl);
      const videoId = urlObj.searchParams.get("v");
      if (videoId) {
        return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`; // Try maxres first
      }
    } catch (e) {
      console.error("Error extracting YouTube ID:", e);
    }
    return null;
  }, [isYoutube, videoUrl]);

  // Fallback to high quality if maxres fails - handling this in UI via error handler would be complex,
  // usually hqdefault is safe backup but lets stick to simple logic or just use hqdefault which is always there.
  // Actually, maxresdefault might not exist for all videos. hqdefault is safer.
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

  const handleProgress = (state: { played: number; playedSeconds: number }) => {
    setPlayed(state.played);
    setCurrentTime(state.playedSeconds);
  };

  const handleDuration = (d: number) => {
    setDuration(d);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - bounds.left) / bounds.width;
    const seekTime = percent * duration;

    playerRef.current?.seekTo(seekTime);
  };

  const toggleFullscreen = async () => {
    if (!isFullscreen) {
      // Try native Fullscreen API
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
        }
      } catch (error) {
        console.error("Error attempting to enable fullscreen:", error);
      }

      // Try to lock screen orientation to landscape
      try {
        if (screen.orientation && (screen.orientation as any).lock) {
          await (screen.orientation as any).lock("landscape");
        }
      } catch (error) {
        // Orientation lock not supported
      }

      setIsFullscreen(true);
    } else {
      // Exit native fullscreen
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
      } catch (error) {
        console.error("Error attempting to exit fullscreen:", error);
      }

      // Unlock screen orientation
      try {
        if (screen.orientation && screen.orientation.unlock) {
          screen.orientation.unlock();
        }
      } catch (error) {
        // Orientation unlock not supported
      }

      setIsFullscreen(false);
    }
  };

  const toggleMute = () => {
    const internalPlayer = playerRef.current?.getInternalPlayer();
    if (internalPlayer && "muted" in internalPlayer) {
      internalPlayer.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVideoContainerClick = () => {
    if (playing) {
      setShowControls(!showControls);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error || traningStatusUpdateError) {
    return (
      <Error500
        title={traningStatusUpdateError ?? undefined}
        description={traningStatusUpdateError ? "" : undefined}
        colorCode={"red-700"}
      />
    );
  }

  if (data?.data?.training_status === 2) {
    return (
      <div className="min-h-screen bg-gray-50 safe-area-inset-bottom pb-20 flex items-center justify-center px-6">
        <div className="bg-white rounded-3xl shadow-lg p-8 max-w-md w-full">
          <div className="flex flex-col items-center justify-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
              <Crown className="w-10 h-10 text-white" />
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <h3 className="text-xl font-bold text-gray-900">
                Congratulations!
              </h3>
              <p className="text-gray-600">
                You have completed all the training videos for the 7-day
                training program. Great job!
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data?.data?.training?.id) {
    return (
      <div className="min-h-screen bg-gray-50 safe-area-inset-bottom pb-20 flex items-center justify-center px-6">
        <div className="bg-white rounded-3xl shadow-lg p-8 max-w-md w-full">
          <div className="flex flex-col items-center justify-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <Calendar className="w-10 h-10 text-white" />
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <h3 className="text-xl font-bold text-gray-900">
                Day {data?.data?.nextday - 2} training Complete!
              </h3>
              <p className="text-gray-600">
                Excellent progress! Get ready to continue your journey tomorrow
                with Day {data?.data?.nextday - 1}.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Play video in embedded player (works for both direct files and YouTube)
  const handlePlayVideo = () => {
    console.log("Training handlePlayVideo called");

    if (isYoutube && videoUrl) {
      // Attempt to force open in YouTube App on Mobile (Android Intent)
      try {
        let videoId = "";
        try {
          const urlObj = new URL(videoUrl);
          videoId = urlObj.searchParams.get("v") || "";
        } catch (e) { }

        if (!videoId) {
          const match = videoUrl.match(/(?:youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([^&\n?#]+)/);
          if (match) videoId = match[1];
        }

        if (videoId) {
          const userAgent = navigator.userAgent.toLowerCase();
          const isAndroid = userAgent.indexOf("android") > -1;

          if (isAndroid) {
            // Android Intent to force open YouTube App
            const intentUrl = `intent://www.youtube.com/watch?v=${videoId}#Intent;package=com.google.android.youtube;scheme=https;S.browser_fallback_url=${encodeURIComponent(videoUrl)};end`;
            window.location.href = intentUrl;
            handlevideoWatchCompleted();
            return;
          }
        }
      } catch (e) {
        console.error("Error handling mobile YouTube redirect:", e);
      }

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

  const handlevideoWatchCompleted = async () => {
    // if already watched not need to trigger
    if (!data?.data?.training?.status) {
      Swal.fire({
        icon: "success",
        title: `Day ${data?.data?.nextday - 1} Training Video Completed`,
        text: "You've completed today's daily video! Please Take Quiz",
        confirmButtonText: "OK",
        customClass: {
          confirmButton:
            "bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md transition-all duration-200",
        },
      }).then((result) => {
        setQuery();
      });
      await updateTraningStatus(
        {
          status: data?.data?.training?.training_video?.quiz?.id ? 1 : 2,
        },
        "",
      );
    }
    setPlaying(false);
  };

  const handleQuizSubmit = async (payload = []) => {
    Swal.fire({
      icon: "success",
      title: "Quiz Completed!",
      text: `Thank you for completing the quiz. ${Lib.checkQuizCorrect(
        data?.data?.training?.training_video?.quiz?.questions,
        payload,
        takeQuizLang,
      )}, and your responses have been submitted successfully.`,
      confirmButtonText: "OK",
      customClass: {
        confirmButton:
          "bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md transition-all duration-200",
      },
    }).then((result) => {
      setQuery();
    });
    setTakeQuiz(true);
    await updateTraningStatus(
      {
        status: 2,
      },
      "",
    );
    localStorage.removeItem("training_video_quiz_taken");
  };

  return (
    <>
      {takeQuiz ? (
        <QuizForm
          title={`Day ${data?.data?.nextday - 1}: ${data?.data?.training?.training_video?.title
            }`}
          quizQuestion={Lib.transformQuestionsFromResponse(
            data?.data?.training?.training_video?.quiz?.questions,
            takeQuizLang,
          )}
          handleQuizSubmit={handleQuizSubmit}
        />
      ) : (
        <div className="min-h-screen bg-gray-50 safe-area-inset-bottom pb-20">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4 safe-area-inset-top">
            <h1 className="text-xl font-bold text-gray-900">
              7-Day Training Program
            </h1>
            <div className="flex items-center justify-between mt-2">
              <p className="text-sm text-gray-600">
                Day {data?.data?.training?.day} of 7
              </p>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-2">Progress</span>
                <div className="text-lg font-bold text-blue-600">
                  {data?.data?.training?.day}/7
                </div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${(data?.data?.training?.day / 7) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Training Structure */}
          <div className="px-6 mt-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Training Structure
              </h3>
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-blue-50 rounded-xl">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-blue-600">
                      Days 1
                    </div>
                    <div className="text-gray-900 font-medium">
                      Welcome Video
                    </div>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-green-50 rounded-xl">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <Target className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-green-600">
                      Days 2-3
                    </div>
                    <div className="text-gray-900 font-medium">
                      Company Plan Video
                    </div>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-purple-50 rounded-xl">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <Award className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-purple-600">
                      Days 4-5
                    </div>
                    <div className="text-gray-900 font-medium">
                      How Work Video
                    </div>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-orange-50 rounded-xl">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                    <Play className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-orange-600">
                      Days 6-7
                    </div>
                    <div className="text-gray-900 font-medium">
                      Demo Working
                    </div>
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
              {(data?.data?.training?.training_video?.video_path ||
                data?.data?.training?.training_video?.youtube_link) && !isYoutube ? (
                <ReactPlayerAny
                  ref={playerRef}
                  url={videoUrl as any}
                  width="100%"
                  height="100%"
                  controls={false}
                  playing={playing}
                  onProgress={handleProgress as any}
                  onDuration={handleDuration}
                  muted={isMuted}
                  playsinline={true}
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
                    console.log("=== TRAINING PLAYER READY ===");
                  }}
                  onStart={() => {
                    console.log("Training video started playing");
                  }}
                  onPlay={() => {
                    console.log("Training video onPlay fired");
                    if (!playing) setPlaying(true);
                  }}
                  onPause={() => {
                    console.log("Training video paused");
                    if (playing) setPlaying(false);
                  }}
                  onEnded={() => {
                    console.log("Training video onEnded fired");
                    if (duration > 0 && currentTime > duration * 0.9) {
                      handlevideoWatchCompleted();
                    } else if (duration === 0 && currentTime > 0) {
                      handlevideoWatchCompleted();
                    } else {
                      console.log("Training video ended prematurely, not marking as watched");
                      setPlaying(false);
                    }
                  }}
                  onError={(error: any, data?: any) => {
                    console.error("Training ReactPlayer Error:", error);
                  }}
                  style={{ background: 'black' }}
                />
              ) : (data?.data?.training?.training_video?.video_path ||
                data?.data?.training?.training_video?.youtube_link) && isYoutube ? (
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
                (data?.data?.training?.training_video?.video_path ||
                  data?.data?.training?.training_video?.youtube_link) && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayVideo();
                      }}
                      className="flex items-center justify-center w-20 h-20 bg-blue-600 hover:bg-blue-700 rounded-full text-white transition-all transform hover:scale-105"
                    >
                      <Play className="w-8 h-8 ml-1" />
                    </button>
                  </div>
                )}

              {/* Controls Overlay */}
              {playing && showControls && (
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50 pointer-events-none">
                  {/* Top Controls */}
                  <div className="flex justify-between items-center p-4 pointer-events-auto">
                    <div className="text-white">
                      <h3 className="font-medium">
                        Day {data?.data?.training?.day} Training
                      </h3>
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
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {data?.data?.training?.training_video?.title}
                  </h2>
                  {Boolean(data?.data?.training?.status) && (
                    <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      <span className="text-sm font-medium">Watched!</span>
                    </div>
                  )}
                </div>

                <p className="text-gray-600 mb-4">
                  {data?.data?.training?.training_video?.description}
                </p>

                {data?.data?.training?.status == 1 &&
                  data?.data?.training?.training_video?.quiz?.id && (
                    <button
                      onClick={handleTakeQuiz}
                      className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-md hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/50 transition-all"
                    >
                      <MessageCircleQuestion className="mr-2" /> Take Quiz
                    </button>
                  )}
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
                      You must watch the daily information video completely
                      before accessing other features
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>
                      The video contains important updates and information for
                      your daily activities
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>
                      Once completed, you'll have full access to training,
                      promotion videos, and other features
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
};

export default function TrainingProgram() {
  return (
    <DailyVideoWarning>
      <TrainingProgramWatch />
    </DailyVideoWarning>
  );
}
