'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Panel } from '@/shared/ui/Panel';
import { Button } from '@/shared/ui/Button';
import { getClips, Clip } from '@/shared/api/mockData';

export default function LibraryPage() {
  const router = useRouter();
  const [clips, setClips] = useState<Clip[]>([]);
  const [watchedClips, setWatchedClips] = useState<Set<string>>(new Set());

  // Load clips and watched status
  useEffect(() => {
    const loadClips = () => {
      try {
        const clipsData = getClips();
        console.log('LibraryPage: Loaded clips:', clipsData);
        setClips(clipsData);
      } catch (error) {
        console.error('LibraryPage: Error loading clips:', error);
        setClips([]);
      }
    };
    
    const loadWatchedStatus = () => {
      try {
        const watched = JSON.parse(localStorage.getItem('watchedClips') || '[]');
        setWatchedClips(new Set(watched));
      } catch (error) {
        console.error('LibraryPage: Error loading watched status:', error);
        setWatchedClips(new Set());
      }
    };
    
    loadClips();
    loadWatchedStatus();
    
    // 페이지 포커스 시 데이터 새로고침 (관리자 페이지 변경사항 반영)
    const handleFocus = () => {
      loadClips();
      loadWatchedStatus();
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStudyStart = (clipId: string) => {
    try {
      // 학습 시작 시 즉시 시청된 것으로 표시
      const watchedClips = JSON.parse(localStorage.getItem('watchedClips') || '[]');
      if (!watchedClips.includes(clipId)) {
        watchedClips.push(clipId);
        localStorage.setItem('watchedClips', JSON.stringify(watchedClips));
        setWatchedClips(new Set(watchedClips));
      }
      
      // 학습 페이지로 이동
      const clip = clips.find(c => c.id === clipId);
      if (clip) {
        router.push(`/study/${clipId}?start=${clip.source.start}&end=${clip.source.end}`);
      } else {
        console.error('LibraryPage: Clip not found for ID:', clipId);
      }
    } catch (error) {
      console.error('LibraryPage: Error in handleStudyStart:', error);
    }
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
                <div className="flex items-center justify-between">
                  <Button 
                    onClick={() => handleStudyStart(clip.id)}
                    className="flex-1"
                  >
                    학습 시작
                  </Button>
                  
                  {/* 시청 여부 표시 */}
                  <div className="ml-3 flex items-center">
                    {watchedClips.has(clip.id) ? (
                      <div className="flex items-center space-x-1 text-green-700 bg-green-50 px-2 py-1 rounded-md">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-label font-medium">시청완료</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1 text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-label">미시청</span>
                      </div>
                    )}
                  </div>
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