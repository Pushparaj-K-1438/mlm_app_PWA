import { Config } from 'react-player';

// Define a custom type that extends the base Config type
interface CustomPlayerConfig extends Config {
  file?: {
    attributes?: {
      controlsList?: string;
      disablePictureInPicture?: boolean;
      playsInline?: boolean;
      'webkit-playsinline'?: boolean;
      allowFullScreen?: boolean;
      webkitAllowFullScreen?: boolean;
    };
  };
  youtube?: {
    playerVars?: {
      autoplay?: number;
      controls?: number;
      disablekb?: number;
      fs?: number;
      rel?: number;
      iv_load_policy?: number;
      modestbranding?: number;
      playsinline?: number;
      origin?: string;
    };
  };
}

export const getVideoPlayerConfig = (): CustomPlayerConfig => ({
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
      autoplay: 1,
      controls: 0,
      disablekb: 1,
      fs: 1,
      rel: 0,
      iv_load_policy: 3,
      modestbranding: 1,
      playsinline: 1,
      origin: typeof window !== 'undefined' ? window.location.origin : '',
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
