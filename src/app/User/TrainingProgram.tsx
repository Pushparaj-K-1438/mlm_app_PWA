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
  RotateCcw,
  Volume2,
  VolumeX,
  X,
  Info,
} from "lucide-react";
import { useActionCall, useGetCall } from "@/hooks";
import { SERVICE } from "@/constants/services";
import Loader from "@/components/ui/Loader";
import ReactPlayer from "react-player";
import UIHelpers from "@/utils/UIhelper";
import Swal from "sweetalert2";
import DailyVideoWarning from "@/components/DailyVideoWarning";
import QuizForm from "@/components/QuizeForm";
import Lib from "@/utils/Lib";
import Error500 from "@/components/ui/Error500";
import { LANG } from "@/constants/others";
import { getVideoPlayerConfig, videoContainerProps } from "@/utils/videoPlayerConfig";

const TrainingProgramWatch = () => {
  const { data, loading, setQuery, error } = useGetCall(
    SERVICE.USER_TRAINING_CURRENCT
  );
  const { Post: updateTraningStatus, error: traningStatusUpdateError } =
    useActionCall(SERVICE.TRAINING_STATUS_UPDATE);

  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
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
          <p className="mt-4 text-gray-600">Loading training program...</p>
        </div>
      </div>
    );
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
      <div className="w-full pb-24 px-4 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-lg p-8 max-w-sm w-full">
          <div className="flex flex-col items-center justify-center gap-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <Crown className="w-10 h-10 text-green-600" />
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
      <div className="w-full pb-24 px-4 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-lg p-8 max-w-sm w-full">
          <div className="flex flex-col items-center justify-center gap-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <Crown className="w-10 h-10 text-green-600" />
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
            "bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-xl transition-all duration-200",
          popup: "rounded-2xl"
        },
      }).then((result) => {
        setQuery();
      });
      await updateTraningStatus(
        {
          status: data?.data?.training?.training_video?.quiz?.id ? 1 : 2,
        },
        ""
      );
    }
    setPlaying(false);
  };

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
      reverseButtons: true,
      customClass: {
        confirmButton:
          "bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-xl transition-all duration-200",
        cancelButton:
          "bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-xl transition-all duration-200",
        popup: "rounded-2xl"
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

  const handleQuizSubmit = async (payload = []) => {
    Swal.fire({
      icon: "success",
      title: "Quiz Completed!",
      text: `Thank you for completing the quiz. ${Lib.checkQuizCorrect(
        data?.data?.training?.training_video?.quiz?.questions,
        payload,
        takeQuizLang
      )}, and your responses have been submitted successfully.`,
      confirmButtonText: "OK",
      customClass: {
        confirmButton:
          "bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-xl transition-all duration-200",
        popup: "rounded-2xl"
      },
    }).then((result) => {
      setQuery();
    });
    setTakeQuiz(true);
    await updateTraningStatus(
      {
        status: 2,
      },
      ""
    );
  };

  return (
    <>
      {takeQuiz ? (
        <QuizForm
          title={`Day ${data?.data?.nextday - 1}: ${data?.data?.training?.training_video?.title
            }`}
          quizQuestion={Lib.transformQuestionsFromResponse(
            data?.data?.training?.training_video?.quiz?.questions,
            takeQuizLang
          )}
          handleQuizSubmit={handleQuizSubmit}
        />
      ) : (
        <div className="w-full pb-24 px-4 bg-gray-50 min-h-screen">
          {/* Header Section - Native App Style */}
          <div className="py-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">
                7-Day Training Program
              </h1>
              <div className="text-right">
                <div className="text-sm text-gray-500">Progress</div>
                <div className="text-2xl font-bold text-blue-600">
                  {data?.data?.training?.day}/7
                </div>
                <div className="w-32 bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${((data?.data?.training?.day) / 7) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
            <p className="text-gray-600">
              Day {data?.data?.training?.day} of 7
            </p>
          </div>

          {/* Training Structure - Mobile Native Style */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 mb-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center">
              <Info className="w-4 h-4 mr-2 text-blue-500" />
              Training Structure
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                <div className="text-xs font-medium text-blue-600 mb-1">Days 1</div>
                <div className="text-sm text-gray-900 font-medium">Welcome Video</div>
              </div>
              <div className="bg-green-50 rounded-xl p-3 border border-green-100">
                <div className="text-xs font-medium text-green-600 mb-1">Days 2-3</div>
                <div className="text-sm text-gray-900 font-medium">Company Plan</div>
              </div>
              <div className="bg-purple-50 rounded-xl p-3 border border-purple-100">
                <div className="text-xs font-medium text-purple-600 mb-1">Days 4-5</div>
                <div className="text-sm text-gray-900 font-medium">How Work</div>
              </div>
              <div className="bg-orange-50 rounded-xl p-3 border border-orange-100">
                <div className="text-xs font-medium text-orange-600 mb-1">Days 6-7</div>
                <div className="text-sm text-gray-900 font-medium">Demo Working</div>
              </div>
            </div>
          </div>

          {/* Video Player Section - Mobile Native Style */}
          <div
            className={`bg-black rounded-3xl shadow-xl overflow-hidden mb-6 relative transition-all duration-300 ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'w-full aspect-video'
              }`}
            ref={containerRef}
            onClick={handleVideoContainerClick}
          >
            <div className="absolute inset-0 bg-black" {...videoContainerProps}>
              {data?.data?.training?.training_video?.video_path ||
                data?.data?.training?.training_video?.youtube_link ? (
                <ReactPlayer
                  ref={playerRef}
                  src={
                    data?.data?.training?.training_video?.video_path
                      ? Lib.CloudPath(
                        data?.data?.training?.training_video?.video_path
                      )
                      : data?.data?.training?.training_video?.youtube_link
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
                  No video source available
                </div>
              )}

              {/* Custom Play Button Overlay */}
              {!playing &&
                (data?.data?.training?.training_video?.video_path ||
                  data?.data?.training?.training_video?.youtube_link) && (
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

          {/* Video Info Card - Mobile Native Style */}
          {!isFullscreen && (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {data?.data?.training?.training_video?.title}
                  </h2>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {data?.data?.training?.training_video?.description}
                  </p>
                </div>
                {Boolean(data?.data?.training?.status) && (
                  <div className="flex items-center text-green-600 ml-4">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    <span className="font-medium">Watched!</span>
                  </div>
                )}
              </div>

              {data?.data?.training?.status == 1 &&
                data?.data?.training?.training_video?.quiz?.id && (
                  <button
                    onClick={handleTakeQuiz}
                    className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-2xl shadow-md hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/50 transition-all active:scale-95"
                  >
                    <MessageCircleQuestion className="mr-2" /> Take Quiz
                  </button>
                )}
            </div>
          )}

          {/* Instructions Card - Mobile Native Style */}
          {!isFullscreen && (
            <div className="bg-blue-50 rounded-3xl p-5 border border-blue-100">
              <h3 className="text-base font-bold text-blue-900 mb-4 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                Important Instructions
              </h3>
              <ul className="space-y-3 text-sm text-blue-800">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                  You must watch the daily information video completely before accessing other features
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                  The video contains important updates and information for your daily activities
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                  Once completed, you'll have full access to training, promotion videos, and other features
                </li>
                {isMobile && (
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                    Tap the fullscreen icon in the top right corner to watch the video in fullscreen mode
                  </li>
                )}
              </ul>
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