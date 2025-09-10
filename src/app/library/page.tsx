'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Panel } from '../../shared/ui/Panel';
import { Button } from '../../shared/ui/Button';
import { getClips, Clip } from '../../shared/api/mockData';

export default function LibraryPage() {
  const router = useRouter();
  const [clips, setClips] = useState<Clip[]>([]);

  // Load clips
  useEffect(() => {
    const clipsData = getClips();
    setClips(clipsData);
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-h1 text-foreground mb-2">라이브러리</h1>
          <p className="text-body text-muted-foreground">
            중국 예능 클립을 선택하여 학습을 시작하세요.
          </p>
        </div>

        {/* Clips Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {clips.map(clip => (
            <Panel key={clip.id} className="hover:shadow-popover transition-shadow duration-base">
              <div className="space-y-3">
                {/* Thumbnail */}
                <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
                  <img
                    src={clip.thumbnail}
                    alt={clip.title}
                    className="w-full h-full object-cover rounded-sm"
                  />
                  <div className="absolute bottom-2 right-2 bg-overlay text-text-inverse px-2 py-1 rounded-sm text-label">
                    {formatDuration(clip.duration)}
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h3 className="text-h2 text-foreground line-clamp-2">
                    {clip.title}
                  </h3>
                  
                  <div className="flex flex-wrap gap-1">
                    {clip.tags.map(tag => (
                      <span
                        key={tag}
                        className="text-label text-muted-foreground bg-muted px-2 py-1 rounded-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="text-body text-muted-foreground">
                    구간: {Math.floor(clip.source.start / 60)}:{(clip.source.start % 60).toString().padStart(2, '0')} - 
                    {Math.floor(clip.source.end / 60)}:{(clip.source.end % 60).toString().padStart(2, '0')}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <Button 
                    onClick={() => router.push(`/study/${clip.id}?start=${clip.source.start}&end=${clip.source.end}`)}
                    className="flex-1"
                  >
                    학습 시작
                  </Button>
                  <Button 
                    variant="secondary" 
                    onClick={() => router.push(`/review/${clip.id}`)}
                    className="flex-1"
                  >
                    복습
                  </Button>
                </div>
              </div>
            </Panel>
          ))}
        </div>

        {/* Empty State */}
        {clips.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-h2 text-foreground mb-2">클립을 찾을 수 없습니다</h3>
            <p className="text-body text-muted-foreground">
              아직 등록된 클립이 없습니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}