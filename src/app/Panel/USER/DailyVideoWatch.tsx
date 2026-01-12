// import React, { useState, useEffect, useRef } from "react";
// import { Play, CheckCircle, Clock, Calendar, AlertCircle } from "lucide-react";
// import { useActionCall, useGetCall } from "@/hooks";
// import { SERVICE } from "@/constants/services";
// import Loader from "@/components/ui/Loader";
// import ReactPlayer from "react-player";
// import UIHelpers from "@/utils/UIhelper";
// import Swal from "sweetalert2";
// import Lib from "@/utils/Lib";
// import { getVideoPlayerConfig, videoContainerProps } from "@/utils/videoPlayerConfig";

// interface DailyVideoWatchProps {
//   onVideoWatched: () => void;
// }

// export default function DailyVideoWatch({
//   onVideoWatched,
// }: DailyVideoWatchProps) {
//   const { data, loading, setQuery } = useGetCall(SERVICE.DAILY_VIDEO_TODAY);
//   const { Post: updateDVStatus } = useActionCall(
//     SERVICE.DAILY_VIDEO_STATUS_UPDATE
//   );

//   const playerRef = useRef<any>(null);
//   const [playing, setPlaying] = useState(false);
//   const [played, setPlayed] = useState(0);
//   const [duration, setDuration] = useState(0);
//   const [currentTime, setCurrentTime] = useState(0);

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

//   if (!data?.data?.id) {
//     return (
//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="text-center py-12">
//           <Calendar className="mx-auto h-12 w-12 text-gray-400" />
//           <h3 className="mt-2 text-sm font-medium text-gray-900">
//             No Daily Video Available
//           </h3>
//           <p className="mt-1 text-sm text-gray-500">
//             There's no daily video scheduled for today. Please check back later.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   const handlevideoWatchCompleted = async () => {
//     // if already watched not need to trigger
//     if (!data?.data?.watched) {
//       Swal.fire({
//         icon: "success",
//         title: "Daily Video Completed!",
//         text: "You've completed today's daily video! You can now access other features",
//         confirmButtonText: "OK",
//         customClass: {
//           confirmButton:
//             "bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md transition-all duration-200",
//         },
//       }).then((result) => {
//         setQuery();
//       });
//       await updateDVStatus(
//         {
//           daily_video_id: data?.data?.id,
//           watchedstatus: 1,
//         },
//         ""
//       );
//     }
//     setPlaying(false);
//   };

//   return (
//     <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-900">
//           Daily Information Video
//         </h1>
//         <p className="mt-2 text-gray-600">
//           {data?.data?.watched ? (
//             <span className="flex text-green-600">
//               <CheckCircle className="text-green-400 mr-2" />
//               You've completed today's daily video! You can now access other
//               features.
//             </span>
//           ) : (
//             <span className="flex text-yellow-600">
//               <AlertCircle className="mr-2 text-yellow-400" />
//               Watch the video completely to unlock all features.
//             </span>
//           )}
//         </p>
//       </div>

//       {/* Video Player Section */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
//         <div 
//           className="aspect-video bg-gray-900 relative"
//           {...videoContainerProps}
//         >
//           {data?.data?.video_path || data?.data?.youtube_link ? (
//             <ReactPlayer
//               ref={playerRef}
//               src={
//                 data?.data?.video_path
//                   ? Lib.CloudPath(data?.data?.video_path)
//                   : data?.data?.youtube_link
//               }
//               width="100%"
//               height="100%"
//               controls={false}
//               playing={playing}
//               onTimeUpdate={handleProgress}
//               onDurationChange={handleDurationChange}
//               onEnded={handlevideoWatchCompleted}
//               onError={(error) => {
//                 console.error('ReactPlayer Error:', error);
//                 // Handle video loading errors
//               }}
//             />
//           ) : (
//             <div className="absolute inset-0 flex items-center justify-center text-white text-lg">
//               No video source available
//             </div>
//           )}

//           {/* Custom Play Button Overlay */}
//           {!playing && (data?.data?.video_path || data?.data?.youtube_link) && (
//             <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
//               <button
//                 onClick={() => setPlaying(true)}
//                 className="flex items-center justify-center w-20 h-20 bg-blue-600 hover:bg-blue-700 rounded-full text-white transition-colors group"
//               >
//                 <Play className="w-8 h-8 ml-1 group-hover:scale-110 transition-transform" />
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Custom Progress Bar */}
//         <div className="px-6 py-4 bg-gray-50">
//           <div className="flex items-center space-x-4">
//             {/* Play/Pause Button */}
//             <button
//               onClick={() => setPlaying(!playing)}
//               className="flex items-center justify-center w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full text-white transition-colors"
//             >
//               {playing ? (
//                 <div className="flex space-x-1">
//                   <div className="w-1 h-4 bg-white"></div>
//                   <div className="w-1 h-4 bg-white"></div>
//                 </div>
//               ) : (
//                 <Play className="w-4 h-4 ml-0.5" />
//               )}
//             </button>

//             {/* Time Display */}
//             <div className="flex items-center text-sm text-gray-600 font-medium min-w-24">
//               <Clock className="w-4 h-4 mr-1" />
//               <span>
//                 {formatTime(currentTime)} / {formatTime(duration)}
//               </span>
//             </div>

//             {/* Progress Bar */}
//             <div className="flex-1">
//               <div
//                 className="h-2 bg-gray-200 rounded-full cursor-pointer overflow-hidden"
//                 onClick={handleSeek}
//               >
//                 <div
//                   className="h-full bg-blue-600 rounded-full transition-all duration-200"
//                   style={{ width: `${played * 100}%` }}
//                 ></div>
//               </div>
//             </div>

//             {/* Progress Percentage */}
//             <div className="text-sm text-gray-600 font-medium min-w-12 text-right">
//               {Math.round(played * 100)}%
//             </div>
//           </div>
//         </div>

//         <div className="p-6">
//           <div className="flex items-start justify-between">
//             <div className="flex-1">
//               <h2 className="text-xl font-semibold text-gray-900 mb-2">
//                 {data?.data?.title}
//               </h2>
//               <p className="text-gray-600 mb-4">{data?.data?.description}</p>

//               <div className="flex items-center space-x-4 text-sm text-gray-500">
//                 <div className="flex items-center">
//                   <Calendar className="w-4 h-4 mr-1" />
//                   {UIHelpers.DateFormat(data?.data?.showing_date)}
//                 </div>
//               </div>
//             </div>

//             {Boolean(data?.data?.watched) && (
//               <div className="flex items-center text-green-600">
//                 <CheckCircle className="w-5 h-5 mr-2" />
//                 <span className="font-medium">Completed</span>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Instructions */}
//       <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
//         <h3 className="text-lg font-medium text-blue-900 mb-3">
//           Important Instructions
//         </h3>
//         <ul className="space-y-2 text-blue-800">
//           <li className="flex items-start">
//             <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
//             You must watch the daily information video completely before
//             accessing other features
//           </li>
//           <li className="flex items-start">
//             <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
//             The video contains important updates and information for your daily
//             activities
//           </li>
//           <li className="flex items-start">
//             <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
//             Once completed, you'll have full access to training, promotion
//             videos, and other features
//           </li>
//         </ul>
//       </div>
//     </div>
//   );
// }
import React, { useState, useEffect, useRef } from "react";
import { Play, CheckCircle, Clock, Calendar, AlertCircle, Maximize2, Minimize2 } from "lucide-react";
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
  const [playing, setPlaying] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
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

  if (!data?.data?.id) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No Daily Video Available
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            There's no daily video scheduled for today. Please check back later.
          </p>
        </div>
      </div>
    );
  }

  const handlevideoWatchCompleted = async () => {
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
        ""
      );
    }
    setPlaying(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Daily Information Video
        </h1>
        <p className="mt-2 text-gray-600">
          {data?.data?.watched ? (
            <span className="flex text-green-600">
              <CheckCircle className="text-green-400 mr-2" />
              You've completed today's daily video! You can now access other
              features.
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
        className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8 ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''}`}
        ref={containerRef}
      >
        <div 
          className={`${isFullscreen ? 'h-screen' : 'aspect-video'} bg-gray-900 relative`}
          {...videoContainerProps}
        >
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
              onError={(error) => {
                console.error('ReactPlayer Error:', error);
                // Handle video loading errors
              }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-white text-lg">
              No video source available
            </div>
          )}

          {/* Custom Play Button Overlay */}
          {!playing && (data?.data?.video_path || data?.data?.youtube_link) && (
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
                  {data?.data?.title}
                </h2>
                <p className="text-gray-600 mb-4">{data?.data?.description}</p>

                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {UIHelpers.DateFormat(data?.data?.showing_date)}
                  </div>
                </div>
              </div>

              {Boolean(data?.data?.watched) && (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span className="font-medium">Completed</span>
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
              The video contains important updates and information for your daily
              activities
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
  );
}