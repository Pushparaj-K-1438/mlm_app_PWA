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
    disablekb?: 0 | 1;
    fs?: 0 | 1;
    rel?: 0 | 1;
    iv_load_policy?: 1 | 3;
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
    disablekb: 1,
    fs: 1, // Enable fullscreen for YouTube
    rel: 0,
    iv_load_policy: 3
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
