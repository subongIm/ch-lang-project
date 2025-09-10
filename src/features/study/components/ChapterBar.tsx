import React, { useRef, useState } from 'react';
import { clsx } from 'clsx';

interface ChapterBarProps {
  currentTime: number;
  duration: number;
  startTime: number;
  endTime: number;
  onSeek: (time: number) => void;
  chapters?: Array<{
    time: number;
    label: string;
  }>;
}

export const ChapterBar: React.FC<ChapterBarProps> = ({
  currentTime,
  duration,
  startTime,
  endTime,
  onSeek,
  chapters = [],
}) => {
  const barRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Calculate progress percentage
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const scrubberPosition = `${progress}%`;

  // Handle click on progress bar
  const handleBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!barRef.current) return;
    
    const rect = barRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const barWidth = rect.width;
    const clickPercentage = clickX / barWidth;
    const newTime = clickPercentage * duration;
    
    onSeek(Math.max(startTime, Math.min(endTime, newTime)));
  };

  // Handle scrubber drag
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !barRef.current) return;
    
    const rect = barRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const barWidth = rect.width;
    const clickPercentage = Math.max(0, Math.min(1, mouseX / barWidth));
    const newTime = clickPercentage * duration;
    
    onSeek(Math.max(startTime, Math.min(endTime, newTime)));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add event listeners for dragging
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  // Format time for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-2">
      {/* Progress Bar */}
      <div
        ref={barRef}
        className="relative h-2 bg-timeline-track rounded-pill cursor-pointer group"
        onClick={handleBarClick}
      >
        {/* Buffered progress (placeholder - would need actual buffered data) */}
        <div className="absolute top-0 left-0 h-full bg-timeline-buffered rounded-pill" style={{ width: '100%' }} />
        
        {/* Played progress */}
        <div 
          className="absolute top-0 left-0 h-full bg-timeline-played rounded-pill transition-all duration-fast"
          style={{ width: scrubberPosition }}
        />
        
        {/* Scrubber */}
        <div
          className={clsx(
            'absolute top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 bg-timeline-scrubber border-2 border-surface rounded-full shadow-scrubber cursor-grab transition-all duration-fast',
            isDragging ? 'scale-110' : 'group-hover:scale-105'
          )}
          style={{ left: scrubberPosition, marginLeft: '-7px' }}
          onMouseDown={handleMouseDown}
        />
        
        {/* Chapter markers */}
        {chapters.map((chapter, index) => {
          const chapterProgress = ((chapter.time - startTime) / duration) * 100;
          return (
            <div
              key={index}
              className="absolute top-0 w-0.5 h-full bg-timeline-chapter-marker rounded-sm opacity-90"
              style={{ left: `${chapterProgress}%` }}
              title={`${formatTime(chapter.time)} - ${chapter.label}`}
            />
          );
        })}
      </div>

      {/* Time display */}
      <div className="flex justify-between text-mono text-list-timestamp">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
};
