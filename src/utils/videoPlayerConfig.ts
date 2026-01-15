import { Config } from 'react-player';

// Define a custom type that extends the base Config type
interface CustomPlayerConfig extends Config {
  file?: {
    attributes?: {
      controlsList?: string;
      disablePictureInPicture?: boolean;
    };
  };
  youtube?: {
    disablekb?: number;
    fs?: number;
    rel?: number;
    iv_load_policy?: number;
  };
}

export const getVideoPlayerConfig = (): CustomPlayerConfig => ({
  file: {
    attributes: {
      controlsList: 'nodownload',
      disablePictureInPicture: true,
      playsInline: true,
      'webkit-playsinline': true
    }
  },
  youtube: {
    disablekb: 1,
    fs: 0,
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
