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

  // Server-authoritative "video watched" marker (no toast).
  const { Post: markWatchedOnServer } = useActionCall(
    SERVICE.PROMOTION_VIDEO_MARK_WATCHED
  );

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

  // Track if current video has been watched for required duration (for Take Quiz button)
  const [videoWatchCompleted, setVideoWatchCompleted] = useState(false);

  // Watch-completion is tracked per *watch slot*, NOT per video id. The same
  // promotion video can be served again on a later day, in the other session,
  // in set 2, or after a retry. A video-id flag (the old bug) marked those as
  // "already watched" and jumped straight to the quiz — and a retry, which
  // re-serves a fresh video to watch, skipped the watch too. A slot is uniquely
  // identified by the backend session id + set + video order (+ video id for
  // safety). So a page refresh mid-watch still resumes, but a new day / retry /
  // session always requires watching the video again.
  const slotKey = React.useMemo(() => {
    const s = data?.data?.user_promoter_session;
    const videoId = data?.data?.promotion_video?.id;
    if (!s || !videoId) return null;
    const currentSet = s.set1_status > 2 ? 2 : 1;
    const currentOrder =
      currentSet === 1 ? s.current_video_order_set1 : s.current_video_order_set2;
    return `${s.id}_s${currentSet}_o${currentOrder}_v${videoId}`;
  }, [data?.data?.user_promoter_session, data?.data?.promotion_video?.id]);

  // Server-authoritative watched flag: the backend session already tracks the
  // current set's status (0=assigned, 1=video watched, 2=quiz done, 3=submitted).
  // If the current set is at VIDEO_WATCHED or beyond, the video for this slot
  // was already watched — regardless of PWA cache / device. A retry resets the
  // set back to 0 with a new video order, so it correctly requires re-watching.
  const serverWatched = React.useMemo(() => {
    const s = data?.data?.user_promoter_session;
    if (!s) return false;
    const currentSet = s.set1_status > 2 ? 2 : 1;
    const status = currentSet === 1 ? s.set1_status : s.set2_status;
    return Number(status) >= 1;
  }, [data?.data?.user_promoter_session]);

  // Single-record store: only the current slot's watched-state is kept, so it
  // can never leak across days/sessions/retries and never grows unbounded.
  const getWatchStateKey = () => {
    const userId = userInfo?.data?.id || "guest";
    return `promotion_watch_state_${userId}`;
  };
  const isSlotWatched = (key: string | null) => {
    if (!key) return false;
    try {
      const st = JSON.parse(localStorage.getItem(getWatchStateKey()) || "{}");
      return st.slot === key && st.done === true;
    } catch {
      return false;
    }
  };
  const markSlotWatched = (key: string | null) => {
    if (!key) return;
    localStorage.setItem(
      getWatchStateKey(),
      JSON.stringify({ slot: key, done: true })
    );
    setVideoWatchCompleted(true);
  };
  const clearSlotWatched = () => {
    localStorage.removeItem(getWatchStateKey());
  };

  // Watch-start timestamp is likewise slot-scoped (drives the YouTube wall-clock
  // countdown). Keyed by slot so a stale start from another video/day/slot is
  // never read — which previously could auto-complete the watch instantly.
  const getWatchStartKey = () => {
    const userId = userInfo?.data?.id || "guest";
    return `promotion_watch_start_${userId}`;
  };
  const readWatchStart = (key: string | null): number | null => {
    if (!key) return null;
    try {
      const st = JSON.parse(localStorage.getItem(getWatchStartKey()) || "{}");
      if (st.slot === key && st.startedAt) return Number(st.startedAt);
    } catch {
      /* ignore */
    }
    return null;
  };
  const writeWatchStart = (key: string | null) => {
    if (!key) return;
    if (readWatchStart(key)) return; // keep the original start time
    localStorage.setItem(
      getWatchStartKey(),
      JSON.stringify({ slot: key, startedAt: Date.now() })
    );
  };
  const clearWatchStart = () => {
    localStorage.removeItem(getWatchStartKey());
  };

  // YouTube video watch time tracking
  // Duration will be fetched from YouTube using ReactPlayer or oEmbed API
  const [youtubeVideoDuration, setYoutubeVideoDuration] = useState<number>(0); // 0 means not fetched yet
  const [isFetchingDuration, setIsFetchingDuration] = useState(false);
  const hiddenPlayerRef = useRef<any>(null);

  const getVideoDuration = () => {
    return youtubeVideoDuration;
  };

  // Fetch YouTube video duration using oEmbed/noembed API as fallback
  const fetchYouTubeDuration = async (youtubeVideoId: string): Promise<number | null> => {
    try {
      // Using noembed.com as a fallback to get video info (works without API key)
      const response = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${youtubeVideoId}`);
      const data = await response.json();

      if (data?.html) {
        // Extract duration from the embed HTML using a more reliable method
        // YouTube oEmbed doesn't always include duration, so we'll try another approach
        const width = data.width;
        const height = data.height;
        // This gives us some info but not duration directly
      }
    } catch (e) {
      console.log("Noembed fallback failed:", e);
    }

    // Try to fetch from YouTube page HTML as another fallback
    try {
      const response = await fetch(`https://www.youtube.com/watch?v=${youtubeVideoId}`);
      const html = await response.text();

      // Look for approximate duration in the page HTML (lengthSeconds)
      const lengthMatch = html.match(/"lengthSeconds":"(\d+)"/);
      if (lengthMatch && lengthMatch[1]) {
        const seconds = parseInt(lengthMatch[1]);
        console.log("YouTube duration from page HTML:", seconds);
        return seconds * 1000; // Convert to milliseconds
      }
    } catch (e) {
      console.log("YouTube page fetch failed:", e);
    }

    return null;
  };

  const youtubeWatchStartTimeRef = useRef<number | null>(null);
  const [youtubeWatchRemaining, setYoutubeWatchRemaining] = useState<number | null>(null);
  const youtubeCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const completionTriggeredRef = useRef(false); // Ensure completion only triggers once
  const youtubeDurationRef = useRef<number>(0); // Ref to store current duration for interval access

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

  // Note: Removed auto-quiz trigger since we now show a button instead
  // Users must click "Take Quiz Now" button to start the quiz

  // Check YouTube watch time on component mount and interval
  useEffect(() => {
    const videoId = data?.data?.promotion_video?.id;

    // Reset all state when video changes (important for new videos after quiz completion)
    completionTriggeredRef.current = false;
    setYoutubeWatchRemaining(null);
    youtubeWatchStartTimeRef.current = null;
    setVideoWatchCompleted(false); // Reset completed state for new video
    setYoutubeVideoDuration(0); // Reset duration for new video
    youtubeDurationRef.current = 0; // Reset duration ref

    // Clear any existing interval
    if (youtubeCheckIntervalRef.current) {
      clearInterval(youtubeCheckIntervalRef.current);
      youtubeCheckIntervalRef.current = null;
    }

    if (!videoId) return;

    // Server is the source of truth: if the backend already recorded this
    // slot's video as watched, show the quiz straight away (cache-proof). The
    // slot-scoped localStorage check is a secondary fallback for the brief
    // window before the server round-trip / offline.
    if (serverWatched || isSlotWatched(slotKey)) {
      setVideoWatchCompleted(true);
      clearWatchStart();
      return;
    }

    // Fetch YouTube video duration on mount (check if YouTube URL)
    const urlCheck = data?.data?.promotion_video?.youtube_link || data?.data?.promotion_video?.video_path;
    const isYoutubeVideo = urlCheck && (urlCheck.includes("youtube.com") || urlCheck.includes("youtu.be"));

    let youtubeVideoId: string | null = null;
    if (isYoutubeVideo && urlCheck) {
      const videoIdMatch = urlCheck.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]+)/);
      if (videoIdMatch) {
        youtubeVideoId = videoIdMatch[1];
        const cachedDuration = localStorage.getItem(`youtube_duration_${youtubeVideoId}`);

        if (cachedDuration) {
          // Use cached duration
          const duration = parseInt(cachedDuration);
          setYoutubeVideoDuration(duration);
          youtubeDurationRef.current = duration; // Update ref
          console.log("Using cached YouTube duration:", duration);
        } else {
          // Duration not cached - fetch using fallback API
          console.log("Fetching YouTube video duration for:", youtubeVideoId);
          setIsFetchingDuration(true);
          fetchYouTubeDuration(youtubeVideoId).then((durationMs) => {
            if (durationMs) {
              setYoutubeVideoDuration(durationMs);
              youtubeDurationRef.current = durationMs; // Update ref
              localStorage.setItem(`youtube_duration_${youtubeVideoId}`, durationMs.toString());
            }
            setIsFetchingDuration(false);
          });
        }
      }
    }

    // Check if there's a stored start time for THIS slot only
    const checkWatchTime = () => {
      // Read from ref to get the latest duration value
      const videoDuration = youtubeDurationRef.current;

      // If we don't have a duration yet and it's a YouTube video, don't proceed
      if (isYoutubeVideo && videoDuration === 0) {
        return;
      }

      const startTime = readWatchStart(slotKey);
      if (startTime) {
        const elapsed = Date.now() - startTime;
        const remaining = videoDuration - elapsed;

        if (remaining <= 0) {
          // Video duration completed - clear storage and trigger completion
          clearWatchStart();
          youtubeWatchStartTimeRef.current = null;
          setYoutubeWatchRemaining(null);

          // Only trigger completion once
          if (!completionTriggeredRef.current) {
            completionTriggeredRef.current = true;
            handlevideoWatchCompleted();
          }

          // Clear interval if running
          if (youtubeCheckIntervalRef.current) {
            clearInterval(youtubeCheckIntervalRef.current);
            youtubeCheckIntervalRef.current = null;
          }
        } else {
          // Update remaining time
          setYoutubeWatchRemaining(remaining);
          youtubeWatchStartTimeRef.current = startTime;
        }
      }
    };

    // Check immediately on mount
    checkWatchTime();

    // Set up interval to check every second (for countdown display)
    const interval = setInterval(checkWatchTime, 1000);
    youtubeCheckIntervalRef.current = interval;

    return () => {
      if (youtubeCheckIntervalRef.current) {
        clearInterval(youtubeCheckIntervalRef.current);
      }
    };
  }, [data?.data?.promotion_video?.id, slotKey, serverWatched]);

  // Sync youtubeDurationRef when youtubeVideoDuration state changes
  useEffect(() => {
    youtubeDurationRef.current = youtubeVideoDuration;
  }, [youtubeVideoDuration]);

  // Re-check watch time when YouTube duration is fetched
  useEffect(() => {
    if (youtubeVideoDuration > 0) {
      const checkWatchTime = () => {
        const startTime = readWatchStart(slotKey);
        if (startTime) {
          const elapsed = Date.now() - startTime;
          const remaining = youtubeVideoDuration - elapsed;

          if (remaining <= 0) {
            // Video duration completed - clear storage and trigger completion
            clearWatchStart();
            youtubeWatchStartTimeRef.current = null;
            setYoutubeWatchRemaining(null);

            // Only trigger completion once
            if (!completionTriggeredRef.current) {
              completionTriggeredRef.current = true;
              handlevideoWatchCompleted();
            }
          } else {
            // Update remaining time
            setYoutubeWatchRemaining(remaining);
            youtubeWatchStartTimeRef.current = startTime;
          }
        }
      };

      checkWatchTime();
    }
  }, [youtubeVideoDuration, slotKey]);

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

  // Format remaining milliseconds to MM:SS
  const formatRemainingTime = (ms: number) => {
    const totalSeconds = Math.ceil(ms / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgress = (state: any) => {
    setPlayed(state.played);
    setCurrentTime(state.playedSeconds);
  };

  const handleDuration = (duration: number) => {
    setDuration(duration);
  };

  // Seeking is disabled - user cannot seek forward/backward
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
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
      // For promotional YouTube videos, open in YouTube app (for packaged PWA apps)
      // Extract video ID
      let videoId = '';
      try {
        const urlObj = new URL(videoUrl);
        videoId = urlObj.searchParams.get('v') || '';
      } catch (e) {
        if (videoUrl.includes('/shorts/')) {
          videoId = videoUrl.split('/shorts/')[1]?.split('?')[0] || '';
        } else if (videoUrl.includes('youtu.be/')) {
          videoId = videoUrl.split('youtu.be/')[1]?.split('?')[0] || '';
        }
      }

      if (videoId) {
        // Use YouTube deep link that works in both browser and packaged PWA apps
        // Add special parameter so Android MainActivity.kt can identify and redirect to YouTube app
        const deepLinkUrl = `https://www.youtube.com/watch?v=${videoId}&promo_open=1`;

        // Store the start time (slot-scoped) for tracking. writeWatchStart keeps
        // the original start if one already exists for this slot.
        if (!readWatchStart(slotKey)) {
          writeWatchStart(slotKey);
          youtubeWatchStartTimeRef.current = Date.now();
        }

        // Show info message with video duration
        const durationMs = getVideoDuration();
        const durationSeconds = Math.round(durationMs / 1000);
        const timeDisplay = durationMs > 0 ? formatTime(durationSeconds) : 'the full video';

        Swal.fire({
          icon: "info",
          title: "Watch Complete Video",
          html: `
            <p style="font-size: 14px; color: #666;">
              Video will open in YouTube app.
            </p>
            <p style="font-size: 13px; color: #888; margin-top: 10px;">
              After watching ${timeDisplay}, come back to take the quiz.
            </p>
          `,
          confirmButtonText: "OK",
          customClass: {
            confirmButton:
              "bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md transition-all duration-200",
          },
        }).then(() => {
          // After user acknowledges, open the YouTube link
          const link = document.createElement('a');
          link.href = deepLinkUrl;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          link.setAttribute('data-youtube-deeplink', 'true');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        });
      } else {
        // Fallback to original URL
        const link = document.createElement('a');
        link.href = videoUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      // NOTE: handlevideoWatchCompleted() will be called after video duration completes
      // by the useEffect that checks localStorage
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

  // Handle duration from hidden YouTube player
  const handleHiddenPlayerDuration = (duration: number) => {
    console.log("YouTube duration fetched:", duration);
    const durationMs = Math.round(duration * 1000);
    setYoutubeVideoDuration(durationMs);
    youtubeDurationRef.current = durationMs; // Update ref for interval access

    // Cache in localStorage by video ID so we don't need to fetch again
    const videoIdMatch = videoUrl?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]+)/);
    if (videoIdMatch) {
      const videoId = videoIdMatch[1];
      localStorage.setItem(`youtube_duration_${videoId}`, durationMs.toString());
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
    markSlotWatched(slotKey);
    // Persist the watched state on the server (source of truth). Fire-and-
    // forget — the local flag already unlocked the quiz button; this makes it
    // survive a cache clear / new device / refresh.
    try {
      // Pass "" as the message to suppress the default success toast — this is
      // a silent background sync, not a user-facing action.
      await markWatchedOnServer({}, "");
    } catch (e) {
      /* non-blocking */
    }

    Swal.fire({
      icon: "success",
      title: `${data?.data?.promotion_video?.title}`,
      text: "You've finished watching the promotion video. Take the quiz button is now available below!",
      confirmButtonText: "OK",
      customClass: {
        confirmButton:
          "bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md transition-all duration-200",
      },
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
          // Retry = watch a fresh video again. Clear the slot-scoped watch
          // state so the next video (new slot) requires watching, not a
          // straight jump back to the quiz.
          clearSlotWatched();
          clearWatchStart();
          setVideoWatchCompleted(false);
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
      // Quiz done for this slot — clear the slot-scoped watch state and start
      // time so the next slot (and any future re-serve of this video) starts
      // fresh and requires watching again.
      clearSlotWatched();
      clearWatchStart();

      // Reset all video-related state
      setYoutubeWatchRemaining(null);
      youtubeWatchStartTimeRef.current = null;
      completionTriggeredRef.current = false;

      Swal.fire(
        "Completed!",
        "Thank you for taking the quiz! Your participation is appreciated.",
        "success",
      );
      setQuery();
      setTakeQuiz(false);
      setVideoWatchCompleted(false);
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
                      {userInfo?.data?.current_promoter_level >= 3 ? "4" : "2"}
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

          {/* YouTube Watch Countdown - Shows when user returns before video duration completes */}
          {youtubeWatchRemaining !== null && (
            <div className="px-6 mt-6">
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Timer className="w-8 h-8 mr-3" />
                    <div>
                      <h3 className="font-semibold text-lg">Complete the Video</h3>
                      <p className="text-sm opacity-90">Come back after watching</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">
                      {formatRemainingTime(youtubeWatchRemaining)}
                    </div>
                    <div className="text-xs opacity-75">remaining</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Loading duration message */}
          {isYoutube && youtubeVideoDuration === 0 && isFetchingDuration && (
            <div className="px-6 mt-6">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl p-4 text-white">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  <span className="text-sm">Fetching video duration...</span>
                </div>
              </div>
            </div>
          )}

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
                        controls: 0, // Hide native controls (prevents seeking)
                        disablekb: 1, // Disable keyboard controls (prevents seeking)
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
                      // Mark as completed and show button
                      markSlotWatched(slotKey);
                      handlevideoWatchCompleted();
                    } else if (duration === 0 && currentTime > 0) {
                      markSlotWatched(slotKey);
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
                    {/* Progress Bar - seeking disabled */}
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

          {/* Take Quiz Button - Show after video is completed */}
          {!isFullscreen && videoWatchCompleted && (
            <div className="px-6 mt-6">
              <button
                onClick={handleTakeQuiz}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-2xl shadow-lg transform transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-3"
              >
                <Trophy className="w-6 h-6" />
                <span className="text-lg">Take Quiz Now</span>
              </button>
              <p className="text-center text-sm text-gray-600 mt-3">
                You've completed the video! Tap the button above to take the quiz.
              </p>
            </div>
          )}

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

          {/* Hidden YouTube player to fetch video duration */}
          {isYoutube && videoUrl && (
            <div style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', opacity: 0, pointerEvents: 'none', left: '-9999px' }}>
              <ReactPlayerAny
                ref={hiddenPlayerRef}
                url={videoUrl}
                width="1px"
                height="1px"
                playing={false}
                controls={false}
                onDuration={handleHiddenPlayerDuration}
                onError={(e: any) => {
                  console.log("Hidden player error, using fallback fetch:", e);
                  // If hidden player fails, use the API fallback
                  const videoIdMatch = videoUrl?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]+)/);
                  if (videoIdMatch) {
                    fetchYouTubeDuration(videoIdMatch[1]).then((durationMs) => {
                      if (durationMs) {
                        setYoutubeVideoDuration(durationMs);
                        youtubeDurationRef.current = durationMs; // Update ref
                        localStorage.setItem(`youtube_duration_${videoIdMatch[1]}`, durationMs.toString());
                      }
                    });
                  }
                }}
                config={{
                  youtube: {
                    playerVars: {
                      autoplay: 0,
                      controls: 0,
                      disablekb: 1,
                      fs: 0,
                      playsinline: 1,
                      iv_load_policy: 3,
                      modestbranding: 1,
                      rel: 0,
                    },
                    embedOptions: {
                      host: 'https://www.youtube.com'
                    }
                  }
                }}
              />
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
