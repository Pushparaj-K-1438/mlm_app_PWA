// Video player configuration for ReactPlayer
export const getVideoPlayerConfig = () => ({
  file: {
    attributes: {
      controlsList: 'nodownload',
      disablePictureInPicture: true,
      playsInline: true,
      'webkit-playsinline': true,
      allowFullScreen: true,
      webkitAllowFullScreen: true,
    }
  },
  youtube: {
    playerVars: {
      autoplay: 0, // Don't autoplay by default, let ReactPlayer control it
      controls: 0, // Hide YouTube controls (using custom controls, no seeking)
      disablekb: 1, // Disable keyboard controls (prevents seeking with arrows)
      fs: 0, // Disable fullscreen button (using custom fullscreen)
      rel: 0, // Don't show related videos
      iv_load_policy: 3, // Hide annotations
      modestbranding: 1, // Minimal YouTube branding
      playsinline: 1, // Play inline on mobile
      origin: typeof window !== 'undefined' ? window.location.origin : '',
    },
    embedOptions: {
      host: 'https://www.youtube.com'
    }
  }
});

// Double-tap prevention for YouTube videos
let tapTimeout: NodeJS.Timeout | null = null;
let tapCount = 0;

export const handleVideoTap = (e: React.MouseEvent | React.TouchEvent, callback?: () => void) => {
  e.preventDefault();
  e.stopPropagation();

  tapCount++;

  // Clear existing timeout
  if (tapTimeout) {
    clearTimeout(tapTimeout);
  }

  // If this is the second tap within 300ms, prevent it (YouTube double-tap seek)
  if (tapCount === 2) {
    tapCount = 0;
    return;
  }

  // Reset tap count after delay
  tapTimeout = setTimeout(() => {
    tapCount = 0;
    // Only execute callback on single tap
    if (callback) {
      callback();
    }
  }, 300);
};

export const videoContainerProps = {
  onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
  onDoubleClick: (e: React.MouseEvent) => {
    // Prevent double-click seeking on YouTube
    e.preventDefault();
    e.stopPropagation();
  },
  onTouchStart: (e: React.TouchEvent) => {
    // Prevent long press menu on mobile and double-tap zoom
    if (e.touches.length === 1) {
      const target = e.target as HTMLElement;
      target.style.touchAction = 'none';
      target.style.userSelect = 'none';
      target.style.webkitUserSelect = 'none';
    }
  },
  onTouchEnd: (e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    target.style.touchAction = '';
    target.style.userSelect = '';
    target.style.webkitUserSelect = '';
  }
} as const;
