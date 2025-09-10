'use client';

import { useState, useEffect } from 'react';
import { Panel } from '../../shared/ui/Panel';
import { Button } from '../../shared/ui/Button';
import { useUserStore } from '../../shared/stores/userStore';
import { getClipById, getPhrasesByClipId, Bookmark } from '../../shared/api/mockData';

export default function ProfilePage() {
  const { currentUser, bookmarks, setCurrentUser } = useUserStore();
  const [userBookmarks, setUserBookmarks] = useState<Array<Bookmark & { clipTitle: string; phraseText?: string }>>([]);

  // Load user bookmarks with additional data
  useEffect(() => {
    if (!currentUser) return;

    const bookmarkData = bookmarks
      .filter(bookmark => bookmark.userId === currentUser.id)
      .map(bookmark => {
        const clip = getClipById(bookmark.clipId);
        const phrases = getPhrasesByClipId(bookmark.clipId);
        const phrase = phrases.find(p => p.id === bookmark.phraseId);
        
        return {
          ...bookmark,
          clipTitle: clip?.title || '알 수 없는 클립',
          phraseText: phrase?.zh || undefined,
        };
      });

    setUserBookmarks(bookmarkData);
  }, [currentUser, bookmarks]);

  const handleLogin = () => {
    // Mock login - in real app, this would be proper authentication
    setCurrentUser({
      id: 'u_001',
      role: 'learner',
      name: '춘식',
      email: 'chunsik@example.com'
    });
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentUser) {
    return (
      <div className="bg-gradient-to-b from-page-bg-from to-page-bg-to p-6">
        <div className="max-w-2xl mx-auto">
          <Panel className="text-center">
            <div className="space-y-6">
              <div className="text-6xl">👤</div>
              <h1 className="text-h1 text-text-primary">로그인이 필요합니다</h1>
              <p className="text-body text-text-secondary">
                북마크와 학습 진도를 저장하려면 로그인하세요.
              </p>
              <Button onClick={handleLogin}>
                로그인 (데모)
              </Button>
            </div>
          </Panel>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-page-bg-from to-page-bg-to p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-h1 text-text-primary mb-2">프로필</h1>
              <p className="text-body text-text-secondary">
                안녕하세요, {currentUser.name}님!
              </p>
            </div>
            <Button variant="secondary" onClick={handleLogout}>
              로그아웃
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Info */}
          <Panel title="사용자 정보">
            <div className="space-y-3">
              <div>
                <label className="text-label font-medium text-text-primary">이름</label>
                <p className="text-body text-text-secondary">{currentUser.name}</p>
              </div>
              <div>
                <label className="text-label font-medium text-text-primary">이메일</label>
                <p className="text-body text-text-secondary">{currentUser.email}</p>
              </div>
              <div>
                <label className="text-label font-medium text-text-primary">역할</label>
                <p className="text-body text-text-secondary">
                  {currentUser.role === 'learner' ? '학습자' : 
                   currentUser.role === 'editor' ? '편집자' : '관리자'}
                </p>
              </div>
            </div>
          </Panel>

          {/* Learning Stats */}
          <Panel title="학습 통계">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-body text-text-primary">저장된 북마크</span>
                <span className="text-body font-medium text-brand-primary">{userBookmarks.length}개</span>
              </div>
              <div className="flex justify-between">
                <span className="text-body text-text-primary">학습한 클립</span>
                <span className="text-body font-medium text-brand-primary">
                  {new Set(userBookmarks.map(b => b.clipId)).size}개
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-body text-text-primary">총 학습 시간</span>
                <span className="text-body font-medium text-brand-primary">
                  {Math.floor(userBookmarks.length * 5)}분 (추정)
                </span>
              </div>
            </div>
          </Panel>

          {/* Bookmarks */}
          <Panel title="북마크" subtitle={`${userBookmarks.length}개의 저장된 북마크`} className="lg:col-span-2">
            {userBookmarks.length > 0 ? (
              <div className="space-y-3">
                {userBookmarks.map(bookmark => (
                  <div key={bookmark.id} className="border border-border rounded-sm p-3 hover:bg-hover-bg transition-colors duration-base">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-body font-medium text-text-primary mb-1">
                          {bookmark.clipTitle}
                        </h4>
                        {bookmark.phraseText && (
                          <p className="text-body text-text-secondary mb-2">
                            "{bookmark.phraseText}"
                          </p>
                        )}
                        <div className="flex items-center space-x-4 text-label text-text-tertiary">
                          <span>시간: {formatTime(bookmark.t)}</span>
                          {bookmark.note && (
                            <span>노트: {bookmark.note}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="utility" 
                          size="sm"
                          onClick={() => window.location.href = `/study/${bookmark.clipId}?start=${Math.max(0, bookmark.t - 30)}&end=${bookmark.t + 30}`}
                        >
                          학습
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">🔖</div>
                <p className="text-body text-text-secondary">
                  아직 저장된 북마크가 없습니다.
                </p>
                <p className="text-body text-text-tertiary mt-1">
                  학습 중에 북마크를 저장해보세요!
                </p>
              </div>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}
