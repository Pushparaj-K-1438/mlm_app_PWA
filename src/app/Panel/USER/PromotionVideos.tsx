// import React, { useState, useEffect, useRef } from "react";
// import { useData } from "@/context/DataContext";
// import { useAuth } from "@/context/AuthContext";
// import {
//   Play,
//   CheckCircle,
//   Clock,
//   Trophy,
//   Timer,
//   Award,
//   HelpCircle,
//   RefreshCw,
//   Star,
//   XCircle,
//   LogIn,
//   Crown,
// } from "lucide-react";
// import { SERVICE } from "@/constants/services";
// import { useActionCall, useGetCall } from "@/hooks";
// import Loader from "@/components/ui/Loader";
// import ReactPlayer from "react-player";
// import UIHelpers from "@/utils/UIhelper";
// import Swal from "sweetalert2";
// import DailyVideoWarning from "@/components/DailyVideoWarning";
// import QuizForm from "@/components/QuizeForm";
// import Lib from "@/utils/Lib";
// import Error500 from "@/components/ui/Error500";
// import TrainingVideoWarning from "@/components/TrainingVideoWarning";
// import { LANG } from "@/constants/others";
// import {
//   getVideoPlayerConfig,
//   videoContainerProps,
// } from "@/utils/videoPlayerConfig";

// function PromotionVideosPage() {
//   const { data, loading, setQuery, error } = useGetCall(
//     SERVICE.GET_PROMOTION_VIDEO
//   );
//   const { data: userInfo } = useGetCall(SERVICE.GET_PROFILE);
//   const {
//     error: quizeUpdateError,
//     loading: quizeUpdateLoading,
//     Post: updateQuize,
//   } = useActionCall(SERVICE.PROMOTION_VIDEO_QUIZ_UPDATE);

//   const {
//     loading: confirmLoading,
//     Post: updateQuizeConfirm,
//     error: confirmError,
//   } = useActionCall(SERVICE.PROMOTION_VIDEO_QUIZ_CONFIRM);

//   const playerRef = useRef<any>(null);
//   const [playing, setPlaying] = useState(false);
//   const [played, setPlayed] = useState(0);
//   const [duration, setDuration] = useState(0);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [takeQuiz, setTakeQuiz] = useState(false);
//   const [takeQuizLang, setTakeQuizLang] = useState(LANG.TN);

//   const formatTime = (seconds: number) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = Math.floor(seconds % 60);
//     return `${mins}:${secs.toString().padStart(2, "0")}`;
//   };

//   const handleProgress = (e: any) => {
//     const video = e.target as HTMLVideoElement;
//     if (video.duration) {
//       const progress = video.currentTime / video.duration;
//       setPlayed(progress);
//       setCurrentTime(video.currentTime);
//     }
//   };

//   const handleDurationChange = (e: any) => {
//     const video = e.target as HTMLVideoElement;
//     setDuration(video.duration);
//   };

//   const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
//     const bounds = e.currentTarget.getBoundingClientRect();
//     const percent = (e.clientX - bounds.left) / bounds.width;
//     const seekTime = percent * duration;

//     // Access the internal player element
//     const internalPlayer = playerRef.current?.getInternalPlayer();
//     if (internalPlayer && "currentTime" in internalPlayer) {
//       internalPlayer.currentTime = seekTime;
//     }
//   };

//   if (loading || quizeUpdateLoading || confirmLoading) {
//     return (
//       <div>
//         <Loader />
//       </div>
//     );
//   }

//   if (error || quizeUpdateError || confirmError) {
//     const title =
//       error || quizeUpdateError || confirmError || "Something went wrong!";
//     let description = "";
//     if (error) {
//       description =
//         "No promotion data is available at the moment. Please check back later or adjust your filters.";
//     } else if (quizeUpdateError) {
//       description = quizeUpdateError;
//     } else if (confirmError) {
//       description = confirmError;
//     } else {
//       description =
//         "An unexpected error occurred. Please try refreshing the page or come back later.";
//     }
//     const colorCode = error ? "yellow-700" : "red-700";
//     return (
//       <Error500 title={title} description={description} colorCode={colorCode} />
//     );
//   }

//   if (!error && !data?.data) {
//     return (
//       <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 h-screen flex items-center justify-center">
//         <div className="bg-green-50 border border-green-200 rounded-xl py-6 px-12 flex items-center">
//           <div className="max-w-4xl mx-auto flex flex-col items-center  justify-center gap-6">
//             <Crown className="w-8 h-8  text-green-600 " />
//             <div className="flex flex-col items-center gap-2">
//               <h3 className="text-lg font-semibold text-green-900">
//                 Your session for today is complete.
//               </h3>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const handlevideoWatchCompleted = async () => {
//     Swal.fire({
//       icon: "success",
//       title: `${data?.data?.promotion_video?.title}`,
//       text: "You’ve finished watching the promotion video. Please proceed to take the quiz to continue.",
//       confirmButtonText: "OK",
//       customClass: {
//         confirmButton:
//           "bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md transition-all duration-200",
//       },
//     }).then((result) => {
//       handleTakeQuiz();
//     });
//     setDuration(0);
//     setCurrentTime(0);
//     setPlayed(0);
//     setPlaying(false);
//   };

//   const handleTakeQuiz = () => {
//     Swal.fire({
//       icon: "info",
//       title: `Read Instructions`,
//       html: `
//      <ul>
//       <li>* Each question has 55 seconds to answer.</li>
//       <li>* Once submitted, you cannot return to previous questions.</li>
//       <li>* Unanswered questions after 55 seconds will auto-skip.</li>
//       <li>* No pausing or refreshing during the quiz.</li>
//      </ul>
//     `,
//       showCancelButton: true,
//       confirmButtonText: "Take Quiz in English",
//       cancelButtonText: "Take Quiz in Tamil",
//       reverseButtons: true, // Puts the buttons in a specific order (optional)
//       customClass: {
//         confirmButton:
//           "bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md transition-all duration-200",
//         cancelButton:
//           "bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-md transition-all duration-200",
//       },
//     }).then((result) => {
//       if (result.isConfirmed) {
//         setTakeQuizLang(LANG.EN);
//       } else if (result.dismiss === Swal.DismissReason.cancel) {
//         setTakeQuizLang(LANG.TA);
//       }
//       setTakeQuiz(true);
//     });
//   };

//   const handleQuizSubmit = async (payload = []) => {
//     let formPayload = {
//       promotion_video_id: data?.data?.promotion_video?.id,
//       questions: payload,
//     };
//     let response = await updateQuize(formPayload);
//     if (response) {
//       Swal.fire({
//         title: "Quiz Completed",
//         text: `Your score is ${response?.data?.correct_count} out of ${response?.data?.total_questions}. Your Total Earning ₹ ${response?.data?.total_earning}`,
//         icon: "info",

//         showCancelButton: response?.data?.retry ?? false,
//         confirmButtonText: "Confirm & Close",
//         cancelButtonText: "Retry Quiz",

//         // Configure colors (optional)
//         confirmButtonColor: "#3085d6",
//         cancelButtonColor: "#f9e154",
//       }).then((result) => {
//         if (result.isConfirmed) {
//           handleConfirmAndClose();
//         } else if (result.dismiss === Swal.DismissReason.cancel) {
//           setQuery(true);
//           setTakeQuiz(false);
//         }
//       });
//     }
//   };

//   const handleConfirmAndClose = async () => {
//     const response = await updateQuizeConfirm({
//       user_promoter_session_id: data?.data?.user_promoter_session?.id,
//     });
//     if (response) {
//       Swal.fire(
//         "Completed!",
//         "Thank you for taking the quiz! Your participation is appreciated.",
//         "success"
//       );
//       setQuery();
//       setTakeQuiz(false);
//     }
//   };

//   return (
//     <>
//       {takeQuiz ? (
//         <QuizForm
//           title={`${data?.data?.promotion_video?.title}`}
//           quizQuestion={Lib.transformQuestionsFromResponse(
//             data?.data?.promotion_video?.quiz?.questions,
//             takeQuizLang
//           )}
//           handleQuizSubmit={handleQuizSubmit}
//         />
//       ) : (
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="mb-8">
//             <h1 className="text-3xl font-bold text-gray-900">
//               Education & Promotion Videos
//             </h1>
//             <p className="mt-2 text-gray-600">
//               Watch session-based promotional content and earn rewards through
//               quizzes
//             </p>
//           </div>

//           {/* Level Benefits */}
//           <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 mb-8 border border-purple-200">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">
//               Your Level Benefits
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div className="bg-white rounded-lg p-4 shadow-sm">
//                 <div className="flex items-center mb-2">
//                   <Trophy className="w-5 h-5 text-purple-600 mr-2" />
//                   <span className="font-medium text-gray-900">
//                     Current Level
//                   </span>
//                 </div>
//                 <div className="text-lg font-bold text-purple-600">0</div>
//               </div>
//               <div className="bg-white rounded-lg p-4 shadow-sm">
//                 <div className="flex items-center mb-2">
//                   <Play className="w-5 h-5 text-blue-600 mr-2" />
//                   <span className="font-medium text-gray-900">
//                     Videos Available
//                   </span>
//                 </div>
//                 <div className="text-lg font-bold text-blue-600">
//                   {userInfo?.data?.current_promoter_level >= 2 ? "4" : "2"} per
//                   session
//                 </div>
//               </div>
//               <div className="bg-white rounded-lg p-4 shadow-sm">
//                 <div className="flex items-center mb-2">
//                   <RefreshCw className="w-5 h-5 text-orange-600 mr-2" />
//                   <span className="font-medium text-gray-900">Retries</span>
//                 </div>
//                 <div className="text-lg font-bold text-orange-600">
//                   1 per video
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 ">
//             {/* Video Player Section */}
//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
//               <div
//                 className="aspect-video bg-gray-900 relative"
//                 {...videoContainerProps}
//               >
//                 {data?.data?.promotion_video?.video_path ||
//                 data?.data?.promotion_video?.youtube_link ? (
//                   <ReactPlayer
//                     ref={playerRef}
//                     src={
//                       data?.data?.promotion_video?.video_path
//                         ? Lib.CloudPath(data?.data?.promotion_video?.video_path)
//                         : data?.data?.promotion_video?.youtube_link
//                     }
//                     width="100%"
//                     height="100%"
//                     controls={false}
//                     playing={playing}
//                     onTimeUpdate={handleProgress}
//                     onDurationChange={handleDurationChange}
//                     onEnded={handlevideoWatchCompleted}
//                     onError={(error) => {
//                       console.error("ReactPlayer Error:", error);
//                       // Handle video loading errors
//                     }}
//                   />
//                 ) : (
//                   <div className="absolute inset-0 flex items-center justify-center text-white text-lg">
//                     No video source available
//                   </div>
//                 )}
//                 {/* Custom Play Button Overlay */}
//                 {!playing &&
//                   (data?.data?.promotion_video?.video_path ||
//                     data?.data?.promotion_video?.youtube_link) && (
//                     <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
//                       <button
//                         onClick={() => setPlaying(true)}
//                         className="flex items-center justify-center w-20 h-20 bg-blue-600 hover:bg-blue-700 rounded-full text-white transition-colors group"
//                       >
//                         <Play className="w-8 h-8 ml-1 group-hover:scale-110 transition-transform" />
//                       </button>
//                     </div>
//                   )}
//               </div>

//               {/* Custom Progress Bar */}
//               <div className="px-6 py-4 bg-gray-50">
//                 <div className="flex items-center space-x-4">
//                   {/* Play/Pause Button */}
//                   <button
//                     onClick={() => setPlaying(!playing)}
//                     className="flex items-center justify-center w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full text-white transition-colors"
//                   >
//                     {playing ? (
//                       <div className="flex space-x-1">
//                         <div className="w-1 h-4 bg-white"></div>
//                         <div className="w-1 h-4 bg-white"></div>
//                       </div>
//                     ) : (
//                       <Play className="w-4 h-4 ml-0.5" />
//                     )}
//                   </button>

//                   {/* Time Display */}
//                   <div className="flex items-center text-sm text-gray-600 font-medium min-w-24">
//                     <Clock className="w-4 h-4 mr-1" />
//                     <span>
//                       {formatTime(currentTime)} / {formatTime(duration)}
//                     </span>
//                   </div>

//                   {/* Progress Bar */}
//                   <div className="flex-1">
//                     <div
//                       className="h-2 bg-gray-200 rounded-full cursor-pointer overflow-hidden"
//                       onClick={handleSeek}
//                     >
//                       <div
//                         className="h-full bg-blue-600 rounded-full transition-all duration-200"
//                         style={{ width: `${played * 100}%` }}
//                       ></div>
//                     </div>
//                   </div>

//                   {/* Progress Percentage */}
//                   <div className="text-sm text-gray-600 font-medium min-w-12 text-right">
//                     {Math.round(played * 100)}%
//                   </div>
//                 </div>
//               </div>

//               <div className="p-6">
//                 <div className="flex items-start justify-between">
//                   <div className="flex-1">
//                     <h2 className="text-xl font-semibold text-gray-900 mb-2">
//                       {data?.data?.promotion_video?.title}
//                     </h2>
//                     <p className="text-gray-600 mb-4">
//                       {data?.data?.promotion_video?.description}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Instructions */}
//             <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
//               <h3 className="text-lg font-medium text-blue-900 mb-3">
//                 Important Instructions
//               </h3>
//               <ul className="space-y-2 text-blue-800">
//                 <li className="flex items-start">
//                   <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
//                   You must watch the daily information video completely before
//                   accessing other features
//                 </li>
//                 <li className="flex items-start">
//                   <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
//                   The video contains important updates and information for your
//                   daily activities
//                 </li>
//                 <li className="flex items-start">
//                   <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
//                   Once completed, you'll have full access to training, promotion
//                   videos, and other features
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// export default function PromotionVideos() {
//   return (
//     <DailyVideoWarning>
//       <TrainingVideoWarning>
//         <PromotionVideosPage />
//       </TrainingVideoWarning>
//     </DailyVideoWarning>
//   );
// }
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
} from "lucide-react";
import { SERVICE } from "@/constants/services";
import { useActionCall, useGetCall } from "@/hooks";
import Loader from "@/components/ui/Loader";
import ReactPlayer from "react-player";
import UIHelpers from "@/utils/UIhelper";
import Swal from "sweetalert2";
import DailyVideoWarning from "@/components/DailyVideoWarning";
import QuizForm from "@/components/QuizeForm";
import Lib from "@/utils/Lib";
import Error500 from "@/components/ui/Error500";
import TrainingVideoWarning from "@/components/TrainingVideoWarning";
import { LANG } from "@/constants/others";
import {
  getVideoPlayerConfig,
  videoContainerProps,
} from "@/utils/videoPlayerConfig";

function PromotionVideosPage() {
  const { data, loading, setQuery, error } = useGetCall(
    SERVICE.GET_PROMOTION_VIDEO
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

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - bounds.left) / bounds.width;
    const seekTime = percent * duration;

    // Access the internal player element
    const internalPlayer = playerRef.current?.getInternalPlayer();
    if (internalPlayer && "currentTime" in internalPlayer) {
      internalPlayer.currentTime = seekTime;
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

  if (loading || quizeUpdateLoading || confirmLoading) {
    return (
      <div>
        <Loader />
      </div>
    );
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
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 h-screen flex items-center justify-center">
        <div className="bg-green-50 border border-green-200 rounded-xl py-6 px-12 flex items-center">
          <div className="max-w-4xl mx-auto flex flex-col items-center  justify-center gap-6">
            <Crown className="w-8 h-8  text-green-600 " />
            <div className="flex flex-col items-center gap-2">
              <h3 className="text-lg font-semibold text-green-900">
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
        "success"
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
            takeQuizLang
          )}
          handleQuizSubmit={handleQuizSubmit}
        />
      ) : (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Education & Promotion Videos
            </h1>
            <p className="mt-2 text-gray-600">
              Watch session-based promotional content and earn rewards through
              quizzes
            </p>
          </div>

          {/* Level Benefits */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 mb-8 border border-purple-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Your Level Benefits
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center mb-2">
                  <Trophy className="w-5 h-5 text-purple-600 mr-2" />
                  <span className="font-medium text-gray-900">
                    Current Level
                  </span>
                </div>
                <div className="text-lg font-bold text-purple-600">0</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center mb-2">
                  <Play className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="font-medium text-gray-900">
                    Videos Available
                  </span>
                </div>
                <div className="text-lg font-bold text-blue-600">
                  {userInfo?.data?.current_promoter_level >= 2 ? "4" : "2"} per
                  session
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center mb-2">
                  <RefreshCw className="w-5 h-5 text-orange-600 mr-2" />
                  <span className="font-medium text-gray-900">Retries</span>
                </div>
                <div className="text-lg font-bold text-orange-600">
                  1 per video
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 ">
            {/* Video Player Section */}
            <div 
              className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8 ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''}`}
              ref={containerRef}
            >
              <div
                className={`${isFullscreen ? 'h-screen' : 'aspect-video'} bg-gray-900 relative`}
                {...videoContainerProps}
              >
                {data?.data?.promotion_video?.video_path ||
                data?.data?.promotion_video?.youtube_link ? (
                  <ReactPlayer
                    ref={playerRef}
                    src={
                      data?.data?.promotion_video?.video_path
                        ? Lib.CloudPath(data?.data?.promotion_video?.video_path)
                        : data?.data?.promotion_video?.youtube_link
                    }
                    width="100%"
                    height="100%"
                    controls={false}
                    playing={playing}
                    onTimeUpdate={handleProgress}
                    onDurationChange={handleDurationChange}
                    onEnded={handlevideoWatchCompleted}
                    onError={(error) => {
                      console.error("ReactPlayer Error:", error);
                      // Handle video loading errors
                    }}
                  />
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
                        onClick={() => setPlaying(true)}
                        className="flex items-center justify-center w-20 h-20 bg-blue-600 hover:bg-blue-700 rounded-full text-white transition-colors group"
                      >
                        <Play className="w-8 h-8 ml-1 group-hover:scale-110 transition-transform" />
                      </button>
                    </div>
                  )}

                {/* Fullscreen Button - Only show on mobile */}
                {isMobile && (
                  <button
                    onClick={toggleFullscreen}
                    className="absolute top-4 right-4 flex items-center justify-center w-10 h-10 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full text-white transition-colors z-10"
                  >
                    {isFullscreen ? (
                      <Minimize2 className="w-5 h-5" />
                    ) : (
                      <Maximize2 className="w-5 h-5" />
                    )}
                  </button>
                )}
              </div>

              {/* Custom Progress Bar */}
              <div className={`px-6 py-4 bg-gray-50 ${isFullscreen ? 'absolute bottom-0 left-0 right-0' : ''}`}>
                <div className="flex items-center space-x-4">
                  {/* Play/Pause Button */}
                  <button
                    onClick={() => setPlaying(!playing)}
                    className="flex items-center justify-center w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full text-white transition-colors"
                  >
                    {playing ? (
                      <div className="flex space-x-1">
                        <div className="w-1 h-4 bg-white"></div>
                        <div className="w-1 h-4 bg-white"></div>
                      </div>
                    ) : (
                      <Play className="w-4 h-4 ml-0.5" />
                    )}
                  </button>

                  {/* Time Display */}
                  <div className="flex items-center text-sm text-gray-600 font-medium min-w-24">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="flex-1">
                    <div
                      className="h-2 bg-gray-200 rounded-full cursor-pointer overflow-hidden"
                      onClick={handleSeek}
                    >
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-200"
                        style={{ width: `${played * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Progress Percentage */}
                  <div className="text-sm text-gray-600 font-medium min-w-12 text-right">
                    {Math.round(played * 100)}%
                  </div>
                </div>
              </div>

              {!isFullscreen && (
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        {data?.data?.promotion_video?.title}
                      </h2>
                      <p className="text-gray-600 mb-4">
                        {data?.data?.promotion_video?.description}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Instructions - Hide when in fullscreen */}
            {!isFullscreen && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="text-lg font-medium text-blue-900 mb-3">
                  Important Instructions
                </h3>
                <ul className="space-y-2 text-blue-800">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    You must watch the daily information video completely before
                    accessing other features
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    The video contains important updates and information for your
                    daily activities
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Once completed, you'll have full access to training, promotion
                    videos, and other features
                  </li>
                  {isMobile && (
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Tap the fullscreen icon in the top right corner to watch the video in fullscreen mode
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
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