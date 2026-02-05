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
      controls: 1, // Show YouTube controls
      disablekb: 0, // Enable keyboard controls
      fs: 1, // Enable fullscreen button
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

export const videoContainerProps = {
  onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
  onTouchStart: (e: React.TouchEvent) => {
    // Prevent long press menu on mobile
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
