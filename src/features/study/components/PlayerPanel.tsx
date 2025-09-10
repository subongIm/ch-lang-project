import React, { useEffect, useRef, useState } from 'react';
import { usePlayerStore } from '../../../shared/stores/playerStore';
import { useYouTubeAPI } from '../../../shared/hooks/useYouTubeAPI';
import { Panel } from '../../../shared/ui/Panel';
import { ChapterBar } from './ChapterBar';

declare global {
  interface Window {
    YT: any;
  }
}

interface PlayerPanelProps {
  videoId: string;
  startTime: number;
  endTime: number;
  onTimeUpdate?: (currentTime: number) => void;
}

export const PlayerPanel: React.FC<PlayerPanelProps> = ({
  videoId,
  startTime,
  endTime,
  onTimeUpdate,
}) => {
  const iframeRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const [playerReady, setPlayerReady] = useState(false);
  const { isLoaded, isLoading } = useYouTubeAPI();
  
  const {
    currentTime,
    duration,
    isPlaying,
    isMuted,
    playbackRate,
    showSubtitles,
    setCurrentTime,
    setDuration,
    setIsPlaying,
    setIsMuted,
    setPlaybackRate,
    setShowSubtitles,
    seekTo,
    togglePlay,
    toggleMute,
  } = usePlayerStore();

  // Initialize video source
  useEffect(() => {
    usePlayerStore.getState().setVideoSource(videoId, startTime, endTime);
  }, [videoId, startTime, endTime]);

  // YouTube Player API integration
  useEffect(() => {
    console.log('PlayerPanel useEffect triggered:', { isLoaded, hasIframeRef: !!iframeRef.current, hasPlayer: !!playerRef.current });
    
    if (!isLoaded || !iframeRef.current || playerRef.current) {
      console.log('Early return:', { isLoaded, hasIframeRef: !!iframeRef.current, hasPlayer: !!playerRef.current });
      return;
    }

    console.log('Creating YouTube player with:', { videoId, startTime, endTime });

    const player = new window.YT.Player(iframeRef.current, {
      height: '390',
      width: '100%',
      videoId,
      playerVars: {
        // start와 end 파라미터 제거 (에러 원인일 수 있음)
        autoplay: 0,
        controls: 1,
        enablejsapi: 1,
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
        iv_load_policy: 3,
        fs: 1,
        playsinline: 1,
      },
      events: {
        onReady: (event: any) => {
          console.log('YouTube player ready:', event);
          setPlayerReady(true);
          setDuration(endTime - startTime); // 상대적 duration 설정
          playerRef.current = event.target;
          
          // 클리핑된 구간의 시작으로 이동
          setTimeout(() => {
            if (playerRef.current && playerRef.current.seekTo) {
              console.log('Seeking to start time:', startTime);
              playerRef.current.seekTo(startTime, true);
            }
          }, 2000); // 더 긴 대기 시간
        },
        onStateChange: (event: any) => {
          const state = event.data;
          setIsPlaying(state === window.YT.PlayerState.PLAYING);
          
          // 영상이 끝에 도달했을 때 클리핑된 구간의 시작으로 돌아가기
          if (state === window.YT.PlayerState.ENDED) {
            console.log('Video ended, seeking back to start time:', startTime);
            if (playerRef.current && playerRef.current.seekTo) {
              playerRef.current.seekTo(startTime);
              setCurrentTime(0);
            }
          }
        },
        onPlaybackRateChange: (event: any) => {
          setPlaybackRate(event.data);
        },
        onError: (event: any) => {
          const errorCode = event.data;
          console.error('YouTube player error details:', {
            errorCode,
            error: event,
            videoId,
            startTime,
            endTime,
            playerVars: {
              start: Math.floor(startTime),
              end: Math.floor(endTime),
              autoplay: 0,
              controls: 1,
              enablejsapi: 1,
              modestbranding: 1,
              rel: 0,
              showinfo: 0,
              iv_load_policy: 3,
              fs: 1,
              playsinline: 1,
              loop: 0,
              playlist: '',
            }
          });

          // YouTube API 에러 코드별 처리
          switch (errorCode) {
            case 2:
              console.error('Invalid video ID or video not found');
              break;
            case 5:
              console.error('HTML5 player error');
              break;
            case 100:
              console.error('Video not found or private');
              break;
            case 101:
              console.error('Video not allowed to be played in embedded players');
              break;
            case 150:
              console.error('Video not allowed to be played in embedded players');
              break;
            default:
              console.error('Unknown YouTube error:', errorCode);
          }
        },
      },
    });

    playerRef.current = player;

    return () => {
      if (player && player.destroy) {
        player.destroy();
        playerRef.current = null;
      }
    };
  }, [isLoaded, videoId, startTime, endTime, showSubtitles, setDuration, setIsPlaying, setPlaybackRate]);

  // Poll for current time updates with offset
  useEffect(() => {
    if (!playerReady || !playerRef.current) return;

    const interval = setInterval(() => {
      if (playerRef.current && playerRef.current.getCurrentTime) {
        const actualTime = playerRef.current.getCurrentTime();
        
        // 지정된 구간을 벗어나면 처음으로 돌아가기
        if (actualTime >= endTime) {
          console.log('Reached end time, seeking back to start:', startTime);
          playerRef.current.seekTo(startTime);
          setCurrentTime(0);
          return;
        }
        
        // 시작 시간보다 이전이면 시작 시간으로 이동
        if (actualTime < startTime) {
          console.log('Before start time, seeking to start:', startTime);
          playerRef.current.seekTo(startTime);
          setCurrentTime(0);
          return;
        }
        
        // Convert to our relative time (0-based)
        const relativeTime = Math.max(0, actualTime - startTime);
        setCurrentTime(relativeTime);
        onTimeUpdate?.(relativeTime);
      }
    }, 1000); // 1초마다 체크

    return () => clearInterval(interval);
  }, [playerReady, setCurrentTime, onTimeUpdate, startTime, endTime]);

  // Handle seek - 실제 YouTube 플레이어를 이동시킴 (절대 시간으로 변환)
  const handleSeek = (relativeTime: number) => {
    if (playerRef.current && playerRef.current.seekTo) {
      // Convert relative time to absolute time
      const absoluteTime = startTime + relativeTime;
      playerRef.current.seekTo(absoluteTime);
      setCurrentTime(relativeTime); // Store의 currentTime은 상대 시간 유지
    }
  };

  // Store의 seekTo 함수를 실제 YouTube 플레이어 seekTo로 오버라이드
  useEffect(() => {
    if (playerReady && playerRef.current) {
      // Store의 seekTo 함수를 실제 YouTube 플레이어 seekTo로 교체
      const originalSeekTo = usePlayerStore.getState().seekTo;
      usePlayerStore.setState({
        seekTo: (time: number) => {
          handleSeek(time);
        }
      });

      return () => {
        // 컴포넌트 언마운트 시 원래 함수로 복원
        usePlayerStore.setState({
          seekTo: originalSeekTo
        });
      };
    }
  }, [playerReady]);

  // Handle play/pause
  const handleTogglePlay = () => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
      togglePlay();
    }
  };

  // Handle mute
  const handleToggleMute = () => {
    if (playerRef.current) {
      if (isMuted) {
        playerRef.current.unMute();
      } else {
        playerRef.current.mute();
      }
      toggleMute();
    }
  };

  // Handle playback rate
  const handlePlaybackRateChange = (rate: number) => {
    if (playerRef.current && playerRef.current.setPlaybackRate) {
      playerRef.current.setPlaybackRate(rate);
      setPlaybackRate(rate);
    }
  };

  if (isLoading) {
    return (
      <Panel className="w-full">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary mx-auto mb-2"></div>
            <p className="text-body text-text-secondary">YouTube API 로딩 중...</p>
          </div>
        </div>
      </Panel>
    );
  }

  return (
    <Panel className="w-full">
      <div className="space-y-3">
        {/* YouTube Player */}
        <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
          <div
            ref={iframeRef}
            className="w-full h-full rounded-sm border border-border"
          />
        </div>

        {/* Chapter Bar */}
        <ChapterBar
          currentTime={currentTime}
          duration={duration}
          startTime={startTime}
          endTime={endTime}
          onSeek={handleSeek}
        />

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleTogglePlay}
              className="focus-ring p-2 rounded-sm hover:bg-hover-bg transition-colors duration-base"
            >
              {isPlaying ? '⏸️' : '▶️'}
            </button>
            
            <button
              onClick={handleToggleMute}
              className="focus-ring p-2 rounded-sm hover:bg-hover-bg transition-colors duration-base"
            >
              {isMuted ? '🔇' : '🔊'}
            </button>

            <select
              value={playbackRate}
              onChange={(e) => handlePlaybackRateChange(Number(e.target.value))}
              className="focus-ring rounded-sm border border-border bg-surface px-2 py-1 text-body"
            >
              <option value={0.5}>0.5x</option>
              <option value={0.75}>0.75x</option>
              <option value={1}>1x</option>
              <option value={1.25}>1.25x</option>
              <option value={1.5}>1.5x</option>
              <option value={2}>2x</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <label className="flex items-center space-x-1 text-body">
              <input
                type="checkbox"
                checked={showSubtitles}
                onChange={(e) => setShowSubtitles(e.target.checked)}
                className="focus-ring"
              />
              <span>자막</span>
            </label>
          </div>
        </div>
      </div>
    </Panel>
  );
};