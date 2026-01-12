// import React, { useState, useEffect, useRef } from "react";
// import {
//   Play,
//   CheckCircle,
//   Clock,
//   AlertTriangle,
//   AlertCircle,
//   ArrowRight,
//   Crown,
//   MessageCircleQuestion,
// } from "lucide-react";
// import { useActionCall, useGetCall } from "@/hooks";
// import { SERVICE } from "@/constants/services";
// import Loader from "@/components/ui/Loader";
// import ReactPlayer from "react-player";
// import UIHelpers from "@/utils/UIhelper";
// import Swal from "sweetalert2";
// import DailyVideoWarning from "@/components/DailyVideoWarning";
// import QuizForm from "@/components/QuizeForm";
// import Lib from "@/utils/Lib";
// import Error500 from "@/components/ui/Error500";
// import { LANG } from "@/constants/others";
// import { getVideoPlayerConfig, videoContainerProps } from "@/utils/videoPlayerConfig";

// const TrainingProgramWatch = () => {
//   const { data, loading, setQuery, error } = useGetCall(
//     SERVICE.USER_TRAINING_CURRENCT
//   );
//   const { Post: updateTraningStatus, error: traningStatusUpdateError } =
//     useActionCall(SERVICE.TRAINING_STATUS_UPDATE);

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

//   if (loading) {
//     return <Loader />;
//   }

//   if (error || traningStatusUpdateError) {
//     return (
//       <Error500
//         title={traningStatusUpdateError ?? undefined}
//         description={traningStatusUpdateError ? "" : undefined}
//         colorCode={"red-700"}
//       />
//     );
//   }
//   if (data?.data?.training_status === 2) {
//     return (
//       <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 h-screen flex items-center justify-center">
//         <div className="bg-green-50 border border-green-200 rounded-xl py-6 px-12 flex items-center">
//           <div className="max-w-4xl mx-auto flex flex-col items-center  justify-center gap-6">
//             <Crown className="w-8 h-8  text-green-600 " />
//             <div className="flex flex-col items-center gap-2">
//               <h3 className="text-lg font-semibold text-green-900">
//                 Congratulations!
//               </h3>
//               <p className="text-green-700">
//                 You have completed all the training videos for the 7-day
//                 training program. Great job!
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }
//   if (!data?.data?.training?.id) {
//     return (
//       <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 h-screen flex items-center justify-center">
//         <div className="bg-green-50 border border-green-200 rounded-xl py-6 px-12 flex items-center">
//           <div className="max-w-4xl mx-auto flex flex-col items-center  justify-center gap-6">
//             <Crown className="w-8 h-8  text-green-600 " />
//             <div className="flex flex-col items-center gap-2">
//               <h3 className="text-lg font-semibold text-green-900">
//                 Day {data?.data?.nextday - 2} training Complete!
//               </h3>
//               <p className="text-green-700">
//                 Excellent progress! Get ready to continue your journey tomorrow
//                 with Day {data?.data?.nextday - 1}.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const handlevideoWatchCompleted = async () => {
//     // if already watched not need to trigger
//     if (!data?.data?.training?.status) {
//       Swal.fire({
//         icon: "success",
//         title: `Day ${data?.data?.nextday - 1} Training Video Completed`,
//         text: "You've completed today's daily video! Please Take Quize",
//         confirmButtonText: "OK",
//         customClass: {
//           confirmButton:
//             "bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md transition-all duration-200",
//         },
//       }).then((result) => {
//         setQuery();
//       });
//       await updateTraningStatus(
//         {
//           status: data?.data?.training?.training_video?.quiz?.id ? 1 : 2,
//         },
//         ""
//       );
//     }
//     setPlaying(false);
//   };

//   const handleTakeQuiz = () => {
//     Swal.fire({
//       icon: "info",
//       title: `Read Instructions`,
//       html: `
//         <ul>
//          <li>* Each question has 55 seconds to answer.</li>
//          <li>* Once submitted, you cannot return to previous questions.</li>
//          <li>* Unanswered questions after 55 seconds will auto-skip.</li>
//          <li>* No pausing or refreshing during the quiz.</li>
//         </ul>
//        `,
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
//     Swal.fire({
//       icon: "success",
//       title: "Quiz Completed!",
//       text: `Thank you for completing the quiz. ${Lib.checkQuizCorrect(
//         data?.data?.training?.training_video?.quiz?.questions,
//         payload,
//         takeQuizLang
//       )}, and your responses have been submitted successfully.`,
//       confirmButtonText: "OK",
//       customClass: {
//         confirmButton:
//           "bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md transition-all duration-200",
//       },
//     }).then((result) => {
//       setQuery();
//     });
//     setTakeQuiz(true);
//     await updateTraningStatus(
//       {
//         status: 2,
//       },
//       ""
//     );
//   };
//   return (
//     <>
//       {takeQuiz ? (
//         <QuizForm
//           title={`Day ${data?.data?.nextday - 1}: ${
//             data?.data?.training?.training_video?.title
//           }`}
//           quizQuestion={Lib.transformQuestionsFromResponse(
//             data?.data?.training?.training_video?.quiz?.questions,
//             takeQuizLang
//           )}
//           handleQuizSubmit={handleQuizSubmit}
//         />
//       ) : (
//         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 ">
//           <div className="mb-8">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h1 className="text-3xl font-bold text-gray-900">
//                   7-Day Training Program
//                 </h1>
//                 <p className="mt-2 text-gray-600">
//                   Day {data?.data?.training?.day} of 7
//                 </p>
//               </div>
//               <div className="text-right">
//                 <div className="text-sm text-gray-500">Progress</div>
//                 <div className="text-2xl font-bold text-blue-600">
//                   {data?.data?.training?.day - 1}/7
//                 </div>
//                 <div className="w-32 bg-gray-200 rounded-full h-2 mt-2">
//                   <div
//                     className="bg-blue-600 h-2 rounded-full transition-all duration-500"
//                     style={{
//                       width: `${((data?.data?.training?.day - 1) / 7) * 100}%`,
//                     }}
//                   ></div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8 border border-blue-200">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">
//               Training Structure
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//               <div className="bg-white rounded-lg p-4 shadow-sm">
//                 <div className="text-sm font-medium text-blue-600">Days 1</div>
//                 <div className="text-gray-900 font-medium">Welcome Video</div>
//               </div>
//               <div className="bg-white rounded-lg p-4 shadow-sm">
//                 <div className="text-sm font-medium text-green-600">
//                   Days 2-3
//                 </div>
//                 <div className="text-gray-900 font-medium">
//                   Company Plan Video
//                 </div>
//               </div>
//               <div className="bg-white rounded-lg p-4 shadow-sm">
//                 <div className="text-sm font-medium text-purple-600">
//                   Days 4-5
//                 </div>
//                 <div className="text-gray-900 font-medium">How Work Video</div>
//               </div>
//               <div className="bg-white rounded-lg p-4 shadow-sm">
//                 <div className="text-sm font-medium text-purple-600">
//                   Days 6-7
//                 </div>
//                 <div className="text-gray-900 font-medium">Demo Working</div>
//               </div>
//             </div>
//           </div>

//           {/* Video Player Section */}
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
//             <div 
//               className="aspect-video bg-gray-900 relative"
//               {...videoContainerProps}
//             >
//               {data?.data?.training?.training_video?.video_path ||
//               data?.data?.training?.training_video?.youtube_link ? (
//                 <ReactPlayer
//                   ref={playerRef}
//                   src={
//                     data?.data?.training?.training_video?.video_path
//                       ? Lib.CloudPath(
//                           data?.data?.training?.training_video?.video_path
//                         )
//                       : data?.data?.training?.training_video?.youtube_link
//                   }
//                   width="100%"
//                   height="100%"
//                   controls={false}
//                   playing={playing}
//                   onTimeUpdate={handleProgress}
//                   onDurationChange={handleDurationChange}
                
//                   onEnded={handlevideoWatchCompleted}
//                   onError={(error) => {
//                     console.error("ReactPlayer Error:", error);
//                     // Handle video loading errors
//                   }}
                  
//                 />
//               ) : (
//                 <div className="absolute inset-0 flex items-center justify-center text-white text-lg">
//                   No video source available
//                 </div>
//               )}

//               {/* Custom Play Button Overlay */}
//               {!playing &&
//                 (data?.data?.training?.training_video?.video_path ||
//                   data?.data?.training?.training_video?.youtube_link) && (
//                   <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
//                     <button
//                       onClick={() => setPlaying(true)}
//                       className="flex items-center justify-center w-20 h-20 bg-blue-600 hover:bg-blue-700 rounded-full text-white transition-colors group"
//                     >
//                       <Play className="w-8 h-8 ml-1 group-hover:scale-110 transition-transform" />
//                     </button>
//                   </div>
//                 )}
//             </div>

//             {/* Custom Progress Bar */}
//             <div className="px-6 py-4 bg-gray-50">
//               <div className="flex items-center space-x-4">
//                 {/* Play/Pause Button */}
//                 <button
//                   onClick={() => setPlaying(!playing)}
//                   className="flex items-center justify-center w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full text-white transition-colors"
//                 >
//                   {playing ? (
//                     <div className="flex space-x-1">
//                       <div className="w-1 h-4 bg-white"></div>
//                       <div className="w-1 h-4 bg-white"></div>
//                     </div>
//                   ) : (
//                     <Play className="w-4 h-4 ml-0.5" />
//                   )}
//                 </button>

//                 {/* Time Display */}
//                 <div className="flex items-center text-sm text-gray-600 font-medium min-w-24">
//                   <Clock className="w-4 h-4 mr-1" />
//                   <span>
//                     {formatTime(currentTime)} / {formatTime(duration)}
//                   </span>
//                 </div>

//                 {/* Progress Bar */}
//                 <div className="flex-1">
//                   <div
//                     className="h-2 bg-gray-200 rounded-full cursor-pointer overflow-hidden"
//                     onClick={handleSeek}
//                   >
//                     <div
//                       className="h-full bg-blue-600 rounded-full transition-all duration-200"
//                       style={{ width: `${played * 100}%` }}
//                     ></div>
//                   </div>
//                 </div>

//                 {/* Progress Percentage */}
//                 <div className="text-sm text-gray-600 font-medium min-w-12 text-right">
//                   {Math.round(played * 100)}%
//                 </div>
//               </div>
//             </div>

//             <div className="p-6">
//               <div className="flex items-start justify-between">
//                 <div className="flex-1">
//                   <h2 className="text-xl font-semibold text-gray-900 mb-2">
//                     {data?.data?.training?.training_video?.title}
//                   </h2>
//                   <p className="text-gray-600 mb-4">
//                     {data?.data?.training?.training_video?.description}
//                   </p>

//                   {data?.data?.training?.status == 1 &&
//                     data?.data?.training?.training_video?.quiz?.id && (
//                       <button
//                         onClick={handleTakeQuiz}
//                         className="flex px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/50 transition-all"
//                       >
//                         <MessageCircleQuestion className="mr-2" /> Take Quiz
//                       </button>
//                     )}
//                 </div>

//                 {Boolean(data?.data?.training?.status) && (
//                   <div className="flex items-center text-green-600">
//                     <CheckCircle className="w-5 h-5 mr-2" />
//                     <span className="font-medium">Watched!</span>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Instructions */}
//           <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
//             <h3 className="text-lg font-medium text-blue-900 mb-3">
//               Important Instructions
//             </h3>
//             <ul className="space-y-2 text-blue-800">
//               <li className="flex items-start">
//                 <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
//                 You must watch the daily information video completely before
//                 accessing other features
//               </li>
//               <li className="flex items-start">
//                 <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
//                 The video contains important updates and information for your
//                 daily activities
//               </li>
//               <li className="flex items-start">
//                 <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
//                 Once completed, you'll have full access to training, promotion
//                 videos, and other features
//               </li>
//             </ul>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default function TrainingProgram() {
//   return (
//     <DailyVideoWarning>
//       <TrainingProgramWatch />
//     </DailyVideoWarning>
//   );
// }


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
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 h-screen flex items-center justify-center">
        <div className="bg-green-50 border border-green-200 rounded-xl py-6 px-12 flex items-center">
          <div className="max-w-4xl mx-auto flex flex-col items-center  justify-center gap-6">
            <Crown className="w-8 h-8  text-green-600 " />
            <div className="flex flex-col items-center gap-2">
              <h3 className="text-lg font-semibold text-green-900">
                Congratulations!
              </h3>
              <p className="text-green-700">
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
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 h-screen flex items-center justify-center">
        <div className="bg-green-50 border border-green-200 rounded-xl py-6 px-12 flex items-center">
          <div className="max-w-4xl mx-auto flex flex-col items-center  justify-center gap-6">
            <Crown className="w-8 h-8  text-green-600 " />
            <div className="flex flex-col items-center gap-2">
              <h3 className="text-lg font-semibold text-green-900">
                Day {data?.data?.nextday - 2} training Complete!
              </h3>
              <p className="text-green-700">
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
        text: "You've completed today's daily video! Please Take Quize",
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
      ""
    );
  };
  return (
    <>
      {takeQuiz ? (
        <QuizForm
          title={`Day ${data?.data?.nextday - 1}: ${
            data?.data?.training?.training_video?.title
          }`}
          quizQuestion={Lib.transformQuestionsFromResponse(
            data?.data?.training?.training_video?.quiz?.questions,
            takeQuizLang
          )}
          handleQuizSubmit={handleQuizSubmit}
        />
      ) : (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 ">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  7-Day Training Program
                </h1>
                <p className="mt-2 text-gray-600">
                  Day {data?.data?.training?.day} of 7
                </p>
              </div>
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
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8 border border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Training Structure
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-sm font-medium text-blue-600">Days 1</div>
                <div className="text-gray-900 font-medium">Welcome Video</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-sm font-medium text-green-600">
                  Days 2-3
                </div>
                <div className="text-gray-900 font-medium">
                  Company Plan Video
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-sm font-medium text-purple-600">
                  Days 4-5
                </div>
                <div className="text-gray-900 font-medium">How Work Video</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-sm font-medium text-purple-600">
                  Days 6-7
                </div>
                <div className="text-gray-900 font-medium">Demo Working</div>
              </div>
            </div>
          </div>

          {/* Video Player Section */}
          <div 
            className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8 ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''}`}
            ref={containerRef}
          >
            <div 
              className={`${isFullscreen ? 'h-screen' : 'aspect-video'} bg-gray-900 relative`}
              {...videoContainerProps}
            >
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
                (data?.data?.training?.training_video?.video_path ||
                  data?.data?.training?.training_video?.youtube_link) && (
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
                      {data?.data?.training?.training_video?.title}
                    </h2>
                    <p className="text-gray-600 mb-4">
                      {data?.data?.training?.training_video?.description}
                    </p>

                    {data?.data?.training?.status == 1 &&
                      data?.data?.training?.training_video?.quiz?.id && (
                        <button
                          onClick={handleTakeQuiz}
                          className="flex px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/50 transition-all"
                        >
                          <MessageCircleQuestion className="mr-2" /> Take Quiz
                        </button>
                      )}
                  </div>

                  {Boolean(data?.data?.training?.status) && (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      <span className="font-medium">Watched!</span>
                    </div>
                  )}
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
