import { useEffect, useState } from 'react';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export const useYouTubeAPI = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('useYouTubeAPI useEffect triggered');
    
    // Check if API is already loaded
    if (window.YT && window.YT.Player) {
      console.log('YouTube API already loaded');
      setIsLoaded(true);
      setIsLoading(false);
      return;
    }

    console.log('Loading YouTube IFrame API...');
    
    // Load the YouTube IFrame API
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // Set up the callback
    window.onYouTubeIframeAPIReady = () => {
      console.log('YouTube IFrame API ready callback triggered');
      setIsLoaded(true);
      setIsLoading(false);
    };

    return () => {
      // Cleanup
      (window as any).onYouTubeIframeAPIReady = undefined;
    };
  }, []);

  return { isLoaded, isLoading };
};
